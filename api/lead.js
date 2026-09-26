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
 *   Email through Microsoft 365 (Microsoft Graph), sent from our own mailbox:
 *   MS_TENANT_ID       Directory (tenant) ID of the genclover.com Microsoft 365
 *   MS_MAIL_CLIENT_ID  Application (client) ID of the gc-website-mail app
 *   MS_MAIL_CLIENT_SECRET Client secret of that app (Mail.Send, application)
 *   LEAD_NOTIFY_FROM   Mailbox internal notifications are sent from
 *                      (default: no-reply@genclover.com). Replies to them go to
 *                      the inquirer via reply-to, never to this mailbox.
 *
 *   Sender policy: internal notifications come from no-reply@genclover.com;
 *   anything sent to people outside the company comes from contact@genclover.com,
 *   so their replies reach a monitored inbox.
 *   LEAD_NOTIFY_TO     Destination address, or several separated by commas
 *                      (default: contact@genclover.com).
 *
 *   LEAD_WEBHOOK_URL   Alternative: POST the lead record to a webhook
 *                      (CRM, Zapier, Make, an internal service).
 *   LEAD_WEBHOOK_TOKEN Optional bearer token for that webhook.
 */

import { isValidPhoneNumber } from 'libphonenumber-js/min'
import { serviceEnquiryOptions } from '../src/data/services.js'
import { businessTypeOptions, regionOptions, timelineOptions } from '../src/data/leadOptions.js'
import { buildLeadEmail } from './_leadEmail.js'

/** One address, or several separated by commas. */
const NOTIFY_TO = (process.env.LEAD_NOTIFY_TO || 'contact@genclover.com')
  .split(',')
  .map((a) => a.trim())
  .filter(Boolean)
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || 'no-reply@genclover.com'

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

/** The same option lists the form renders, so the two can never drift apart. */
const values = (options) => options.map((o) => o.value)
const ALLOWED = {
  service: values(serviceEnquiryOptions),
  businessType: values(businessTypeOptions),
  region: values(regionOptions),
  timeline: [...values(timelineOptions), ''],
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

/**
 * Returns the cleaned values and `errors` keyed by the form's field names, so
 * the form can highlight exactly the fields the server rejected.
 */
const validate = (body) => {
  const errors = {}
  const fail = (field, message) => {
    if (!errors[field]) errors[field] = message
  }
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

  if (!v.service) fail('service', 'Please choose the service you need.')
  if (!v.businessType) fail('businessType', 'Please choose a business type.')
  if (!v.region) fail('region', 'Please choose your location.')
  Object.entries(ALLOWED).forEach(([field, allowed]) => {
    if (!allowed.includes(v[field])) fail(field, 'Please choose one of the listed options.')
  })

  if (v.details.length < 20) fail('details', 'A sentence or two more would really help us.')
  if (!v.name) fail('name', 'Please enter your name.')
  if (!EMAIL_RE.test(v.email)) fail('email', 'That does not look like a valid email address.')
  if (v.budgetAmount) {
    if (v.budgetAmount.length > 12) fail('budgetAmount', 'That figure looks too large. Please check it.')
    if (!CURRENCY_RE.test(v.budgetCurrency)) fail('budgetAmount', 'Please choose a currency for the amount.')
  }
  if (!v.phoneCountry) fail('phoneCountry', 'Please choose a country code.')
  else if (!isValidPhoneNumber(v.phone, v.phoneCountry)) {
    fail('phone', 'That number does not look right for the selected country.')
  }
  if (!v.consent) fail('consent', 'We need your agreement before we can contact you.')

  return { values: v, errors }
}

/* ------------------------------------------------------------ forwarding */

/**
 * Microsoft 365 via Microsoft Graph.
 *
 * The site signs in as its own app registration (client credentials, no
 * user password) and sends from the NOTIFY_FROM mailbox, so the email is
 * genuinely from @genclover.com, passes the domain's existing SPF/DKIM/DMARC,
 * and a copy lands in that mailbox's Sent Items. The app's Mail.Send
 * permission should be limited to that one mailbox (see README).
 */
const graphConfigured = () =>
  Boolean(process.env.MS_TENANT_ID && process.env.MS_MAIL_CLIENT_ID && process.env.MS_MAIL_CLIENT_SECRET)

/** Access tokens last about an hour; reuse one while this instance is warm. */
let graphToken = { value: null, expiresAt: 0 }

const getGraphToken = async () => {
  if (graphToken.value && Date.now() < graphToken.expiresAt - 60_000) return graphToken.value

  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(process.env.MS_TENANT_ID)}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.MS_MAIL_CLIENT_ID,
        client_secret: process.env.MS_MAIL_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    }
  )
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.access_token) {
    throw new Error(`Microsoft sign-in failed (${response.status}): ${payload.error_description ?? payload.error ?? ''}`)
  }
  graphToken = { value: payload.access_token, expiresAt: Date.now() + payload.expires_in * 1000 }
  return graphToken.value
}

const sendViaMicrosoft = async (record) => {
  // Layout and labels live in _leadEmail.js.
  const { subject, html } = buildLeadEmail(record)
  const token = await getGraphToken()

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(NOTIFY_FROM)}/sendMail`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: 'HTML', content: html },
          toRecipients: NOTIFY_TO.map((address) => ({ emailAddress: { address } })),
          // Replying answers the person who sent the brief, not the website mailbox.
          replyTo: [{ emailAddress: { address: record.contact.email, name: record.contact.name } }],
        },
        saveToSentItems: true,
      }),
    }
  )

  // Graph answers 202 Accepted with an empty body on success.
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Microsoft Graph rejected the email (${response.status}): ${detail.slice(0, 500)}`)
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

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {})
  } catch {
    return res.status(400).json({ message: 'The request could not be read.' })
  }

  // Spam signals: a filled honeypot, or a form completed impossibly fast.
  if (body.company_website) {
    // Respond as success so bots get no signal from the difference.
    return res.status(200).json({ ok: true })
  }
  if (typeof body.elapsedMs === 'number' && body.elapsedMs < 3000) {
    return res.status(400).json({ message: 'That was submitted a little too quickly.' })
  }

  const { values, errors } = validate(body)
  if (Object.keys(errors).length > 0) {
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
    if (graphConfigured()) {
      await sendViaMicrosoft(record)
    } else if (process.env.LEAD_WEBHOOK_URL) {
      await sendViaWebhook(record)
    } else {
      // Fail loudly rather than pretending a lead was captured.
      console.error('[lead] No delivery method configured (MS_TENANT_ID/MS_MAIL_CLIENT_ID/MS_MAIL_CLIENT_SECRET or LEAD_WEBHOOK_URL).')
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
