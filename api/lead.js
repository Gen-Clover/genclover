/**
 * Lead submission endpoint. (Spec §10, §17)
 *
 * Runs as a Vercel serverless function at POST /api/lead.
 *
 *   Website form → this endpoint → validation → lead record → notification
 *                                                           → (future) CRM
 *
 * Security posture:
 *   - No secrets in client code. Everything sensitive is read from env vars.
 *   - Every field is validated and sanitized here, independently of the browser.
 *   - Honeypot + minimum-elapsed-time + per-IP rate limiting for spam.
 *   - Only the fields we need are stored or forwarded.
 *
 * Configure ONE of the following in the Vercel project (Settings → Environment
 * Variables). Until one is set, the endpoint returns 503 with a clear message
 * and the form tells the visitor to email us instead — it never fails silently.
 *
 *   RESEND_API_KEY     Sends the notification email via Resend.
 *   LEAD_NOTIFY_TO     Destination address (default: contact@genclover.com).
 *   LEAD_NOTIFY_FROM   Verified sender (default: website@genclover.com).
 *
 *   LEAD_WEBHOOK_URL   Alternative: POST the lead record to a webhook
 *                      (CRM, Zapier, Make, an internal service).
 *   LEAD_WEBHOOK_TOKEN Optional bearer token for that webhook.
 */

import { isValidPhoneNumber } from 'libphonenumber-js/min'

const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || 'contact@genclover.com'
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || 'website@genclover.com'

/* ------------------------------------------------------------- rate limit */

/**
 * In-memory, per-instance rate limiting. Serverless instances are recycled and
 * not shared, so this throttles casual abuse rather than a distributed attack.
 * For stronger guarantees, move this to Vercel KV or Upstash.
 */
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }
const hits = new Map()

const isRateLimited = (ip) => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(ip, recent)

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key)
    }
  }
  return recent.length > RATE_LIMIT.max
}

/* -------------------------------------------------------------- validation */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const CURRENCY_RE = /^[A-Z]{3}$/

const ALLOWED = {
  service: [
    'websites', 'web-applications', 'ecommerce', 'ai-automation', 'data-analytics',
    'technology-solutions', 'devops-mlops', 'digital-marketing-seo', 'other',
  ],
  businessType: ['startup', 'small-business', 'growing-business', 'corporate', 'enterprise', 'other'],
  region: ['india', 'usa', 'uk', 'europe', 'middle-east', 'asia-pacific', 'other'],
  timeline: ['asap', '1-2-months', '2-3-months', '3-6-months', '6-plus-months', 'flexible', 'not-sure', ''],
}

/** Trim, cap length, and strip control characters and angle brackets. */
const clean = (value, maxLength) =>
  typeof value === 'string'
    ? value
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, maxLength)
    : ''

const validate = (body) => {
  const errors = []
  const v = {
    service: clean(body.service, 60),
    businessType: clean(body.businessType, 60),
    region: clean(body.region, 60),
    budgetCurrency: clean(body.budgetCurrency, 3).toUpperCase(),
    budgetAmount: clean(String(body.budgetAmount ?? ''), 20).replace(/[^\d]/g, ''),
    timeline: clean(body.timeline, 60),
    details: clean(body.details, 4000),
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    email: clean(body.email, 200).toLowerCase(),
    phoneCountry: clean(body.phoneCountry, 2).toUpperCase(),
    phone: clean(body.phone, 40),
    consent: body.consent === true,
  }

  Object.entries(ALLOWED).forEach(([field, allowed]) => {
    if (!allowed.includes(v[field])) errors.push(`${field} is not a recognized option.`)
  })

  if (!v.service) errors.push('service is required.')
  if (!v.businessType) errors.push('businessType is required.')
  if (!v.region) errors.push('region is required.')
  if (v.details.length < 20) errors.push('details must be at least 20 characters.')
  if (!v.name) errors.push('name is required.')
  if (!EMAIL_RE.test(v.email)) errors.push('email is not valid.')
  if (v.budgetAmount) {
    if (v.budgetAmount.length > 12) errors.push('budgetAmount is too large.')
    if (!CURRENCY_RE.test(v.budgetCurrency)) errors.push('budgetCurrency is not valid.')
  }
  if (!v.phoneCountry || !isValidPhoneNumber(v.phone, v.phoneCountry)) {
    errors.push('phone is not valid.')
  }
  if (!v.consent) errors.push('consent is required.')

  return { values: v, errors }
}

/* ------------------------------------------------------------ forwarding */

const sendViaResend = async (record) => {
  const lines = [
    ['Service', record.service],
    ['Business type', record.clientSegment],
    ['Region', record.country],
    [
      'Budget',
      record.budget
        ? `${record.budget.currency} ${Number(record.budget.amount).toLocaleString('en')}`
        : 'Not provided',
    ],
    ['Timeline', record.timeline || 'Not provided'],
    ['Name', record.contact.name],
    ['Company', record.contact.company || 'Not provided'],
    ['Email', record.contact.email],
    ['Phone', record.contact.phone],
    ['Source page', record.sourcePage],
    ['Referrer', record.attribution?.referrer || '-'],
    ['Campaign', record.attribution?.utmCampaign || '-'],
    ['Received', record.timestamp],
  ]

  const escape = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const html = `
    <h2>New project inquiry</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${lines
        .map(
          ([k, val]) =>
            `<tr><td style="color:#666">${escape(k)}</td><td><strong>${escape(val)}</strong></td></tr>`
        )
        .join('')}
    </table>
    <h3>Project details</h3>
    <p style="white-space:pre-wrap;font-family:sans-serif;font-size:14px">${escape(record.description)}</p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Gen Clover Website <${NOTIFY_FROM}>`,
      to: [NOTIFY_TO],
      reply_to: record.contact.email,
      subject: `New inquiry - ${record.service} - ${record.contact.name}`,
      html,
    }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Resend rejected the request (${response.status}): ${text}`)
  }
}

const sendViaWebhook = async (record) => {
  const response = await fetch(process.env.LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.LEAD_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(record),
  })

  if (!response.ok) {
    throw new Error(`Lead webhook responded ${response.status}`)
  }
}

/* --------------------------------------------------------------- handler */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed.' })
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  if (isRateLimited(ip)) {
    return res
      .status(429)
      .json({ message: 'Too many inquiries from this connection. Please try again shortly.' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {})

  // Spam signals: a filled honeypot, or a form completed impossibly fast.
  if (body.company_website) {
    // Respond as success so bots get no signal from the difference.
    return res.status(200).json({ ok: true })
  }
  if (typeof body.elapsedMs === 'number' && body.elapsedMs < 3000) {
    return res.status(400).json({ message: 'That was submitted a little too quickly.' })
  }

  const { values, errors } = validate(body)
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Please check the highlighted fields.', errors })
  }

  /**
   * Lead record. (Spec §10, §24)
   * Shaped so it can be handed to a CRM or the future Commercial Engine without
   * reshaping: one primary service now, with room for more selections later.
   */
  const record = {
    timestamp: new Date().toISOString(),
    source: 'website',
    sourcePage: clean(body.sourcePage, 300) || '/start-a-project',
    service: values.service,
    additionalServices: [],
    clientSegment: values.businessType,
    country: values.region,
    budget: values.budgetAmount
      ? { currency: values.budgetCurrency, amount: Number(values.budgetAmount) }
      : null,
    timeline: values.timeline || null,
    description: values.details,
    contact: {
      name: values.name,
      company: values.company || null,
      email: values.email,
      phone: values.phone,
      phoneCountry: values.phoneCountry,
    },
    consent: { given: true, at: new Date().toISOString() },
    attribution: body.attribution ?? null,
  }

  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(record)
    } else if (process.env.LEAD_WEBHOOK_URL) {
      await sendViaWebhook(record)
    } else {
      // Fail loudly rather than pretending a lead was captured.
      console.error('[lead] No delivery method configured (RESEND_API_KEY or LEAD_WEBHOOK_URL).')
      return res.status(503).json({
        message: 'Our inquiry system is not reachable right now.',
      })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('[lead] Delivery failed:', error.message)
    return res.status(502).json({ message: 'We could not send your inquiry just now.' })
  }
}
