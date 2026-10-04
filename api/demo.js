/**
 * Demo requests from /book-a-demo. (Templates)
 *
 *   POST /api/demo  { demoType, template, websiteUrl, businessName, ...contact,
 *                     authorisation, consent }
 *
 * Emails the request to the team, with the visitor's authorisation to use their
 * website's material recorded word for word, and an acknowledgement to the
 * visitor that repeats what they agreed to. Nothing is stored on our side: the
 * email is the record. Uses the Microsoft 365 set-up of the inquiry form:
 *
 *   LEAD_NOTIFY_FROM   sender of the internal email (default no-reply@genclover.com)
 *   DEMO_NOTIFY_TO     where requests go, comma-separated (default: LEAD_NOTIFY_TO,
 *                      then contact@genclover.com)
 *   LEAD_CONFIRM_FROM  sender of the acknowledgement (default contact@genclover.com;
 *                      "off" disables it)
 *
 * Locally, without Microsoft 365 credentials, both emails are written to
 * .data/outbox/ instead (see api/_lib/graph.js).
 *
 * Spam: honeypot, minimum fill time and a per-IP rate limit, as on /api/lead.
 */
import { parsePhoneNumber } from 'libphonenumber-js/min'
import { validateDemoRequest, DEMO_AUTHORISATION } from '../src/lib/demoRequest.js'
import { sendMail, graphConfigured, outboxMode } from './_lib/graph.js'
import { buildDemoEmail, buildDemoConfirmation } from './_demoEmail.js'
import { send, readJson, clientIp } from './_lib/http.js'

const list = (value) => value.split(',').map((a) => a.trim()).filter(Boolean)
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || 'no-reply@genclover.com'
const NOTIFY_TO = list(process.env.DEMO_NOTIFY_TO || process.env.LEAD_NOTIFY_TO || 'contact@genclover.com')
const confirmFrom = () => {
  const value = (process.env.LEAD_CONFIRM_FROM ?? 'contact@genclover.com').trim()
  return ['off', 'none', 'false'].includes(value.toLowerCase()) ? '' : value
}

/* ------------------------------------------------------------ rate limit */

/** Per-instance, like /api/lead: throttles casual abuse, not a distributed attack. */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map()

const isRateLimited = (ip) => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 500) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
  }
  return recent.length > MAX_PER_WINDOW
}

/* --------------------------------------------------------------- helpers */

/** "+91 98765 43210", so the email is unambiguous. */
const international = (phone, country) => {
  try {
    return parsePhoneNumber(phone, country).formatInternational()
  } catch {
    return phone
  }
}

const hostOf = (url) => {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return ''
  }
}

/**
 * Whether the requester writes from the website's own domain. Not proof of
 * anything, but a quick signal for the team before copying a site's material.
 */
const emailMatchesSite = (email, host) => {
  const domain = email.split('@')[1] ?? ''
  return Boolean(host && domain && (domain === host || domain.endsWith(`.${host}`) || host.endsWith(`.${domain}`)))
}

/* --------------------------------------------------------------- handler */

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { message: 'Method not allowed.' }, { Allow: 'POST' })

  let body
  try {
    body = await readJson(req)
  } catch {
    return send(res, 400, { message: 'The request could not be read.' })
  }

  // Spam signals. A filled honeypot gets a fake success, so bots learn nothing.
  if (body.company_website) return send(res, 200, { ok: true })
  if (typeof body.elapsedMs === 'number' && body.elapsedMs < 3000) {
    return send(res, 400, { message: 'That was submitted a little too quickly.' })
  }

  const { values, errors } = validateDemoRequest(body)
  if (Object.keys(errors).length > 0) {
    return send(res, 400, { message: 'Please check the highlighted fields.', errors })
  }

  // Counted only for requests about to be sent, so fixing a typo costs nothing.
  if (isRateLimited(clientIp(req))) {
    return send(res, 429, { message: 'Too many requests from this connection. Please try again shortly.' })
  }

  if (!graphConfigured() && !outboxMode()) {
    console.error('[demo] Microsoft 365 mail is not configured.')
    return send(res, 503, { message: 'Our demo request system is not reachable right now.' })
  }

  const timestamp = new Date().toISOString()
  const host = hostOf(values.websiteUrl)
  const record = {
    timestamp,
    demoType: values.demoType,
    template: values.template || null,
    website: values.websiteUrl ? { url: values.websiteUrl, host, emailMatches: emailMatchesSite(values.email, host) } : null,
    businessName: values.businessName,
    notes: values.notes,
    contact: {
      name: values.name,
      email: values.email,
      phone: international(values.phone, values.phoneCountry),
    },
    // The exact words agreed to, so the permission stands on its own later.
    authorisation: values.authorisation
      ? { given: true, at: timestamp, version: DEMO_AUTHORISATION.version, text: DEMO_AUTHORISATION.text }
      : null,
    consent: { given: true, at: timestamp },
    sourcePage: typeof body.sourcePage === 'string' ? body.sourcePage.slice(0, 300) : '/book-a-demo',
  }

  try {
    const { subject, html } = buildDemoEmail(record)
    await sendMail({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      replyTo: { address: values.email, name: values.name },
      subject,
      html,
    })
  } catch (error) {
    console.error('[demo] Delivery failed:', error.message)
    return send(res, 502, { message: 'We could not send your request just now.' })
  }

  // The request is delivered; the acknowledgement is best-effort.
  let confirmation = false
  const from = confirmFrom()
  if (from) {
    try {
      const { subject, html } = buildDemoConfirmation(record)
      await sendMail({ from, to: [values.email], subject, html })
      confirmation = true
    } catch (error) {
      console.error('[demo] Confirmation failed (the request itself was delivered):', error.message)
    }
  }

  return send(res, 200, { ok: true, confirmation })
}
