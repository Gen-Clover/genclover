/**
 * Job applications from the careers page. (Careers)
 *
 *   POST /api/apply  { jobId | 'general', ...applicant, consent, cv: { name, type, data } }
 *
 * Emails the application, with the CV attached, to the hiring inbox, and an
 * acknowledgement to the candidate. Nothing is stored on our side: the email
 * is the record. Uses the Microsoft 365 set-up of the inquiry form:
 *
 *   LEAD_NOTIFY_FROM   sender of the internal email (default no-reply@genclover.com)
 *   APPLY_NOTIFY_TO    where applications go, comma-separated (default: LEAD_NOTIFY_TO,
 *                      then contact@genclover.com). A role's own "Applications go to"
 *                      address, set in /admin, takes precedence.
 *   LEAD_CONFIRM_FROM  sender of the acknowledgement (default contact@genclover.com;
 *                      "off" disables it)
 *
 * Spam: honeypot, minimum fill time and a per-IP rate limit, as on /api/lead.
 * The CV must be a real PDF or Word file (checked by its bytes) under 3 MB.
 */
import { parsePhoneNumber } from 'libphonenumber-js/min'
import { validateApplication, CV_MAX_BYTES, CV_TYPES } from '../src/lib/application.js'
import { getJob } from './_lib/store.js'
import { sendMail, graphConfigured, outboxMode } from './_lib/graph.js'
import { buildApplicationEmail, buildApplicationConfirmation } from './_applicationEmail.js'
import { send, readJson, clientIp } from './_lib/http.js'

const list = (value) => value.split(',').map((a) => a.trim()).filter(Boolean)
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || 'no-reply@genclover.com'
const NOTIFY_TO = list(process.env.APPLY_NOTIFY_TO || process.env.LEAD_NOTIFY_TO || 'contact@genclover.com')
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

/* ------------------------------------------------------------------- CV */

/** What the file really is, from its first bytes. The browser's claim is not trusted. */
const sniff = (bytes) => {
  if (bytes.subarray(0, 5).toString('latin1') === '%PDF-') return 'application/pdf'
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04)
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (bytes.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0]))) return 'application/msword'
  return null
}

const EXTENSION = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

const readCv = (cv, applicantName) => {
  if (!cv || typeof cv.data !== 'string') return { error: 'Please attach your CV.' }
  // base64 is 4/3 the size of the file; reject oversized uploads before decoding.
  if (cv.data.length > Math.ceil(CV_MAX_BYTES / 3) * 4 + 8) return { error: 'That file is over 3 MB. Please upload a smaller PDF.' }
  const bytes = Buffer.from(cv.data, 'base64')
  if (bytes.length === 0) return { error: 'That file is empty.' }
  if (bytes.length > CV_MAX_BYTES) return { error: 'That file is over 3 MB. Please upload a smaller PDF.' }
  const type = sniff(bytes)
  if (!type || !CV_TYPES[type]) return { error: 'Please upload a PDF or Word document.' }

  // Our own file name, so nothing the browser sent ends up in the attachment name.
  const safeName = applicantName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60) || 'candidate'
  return {
    attachment: { name: `CV-${safeName}.${EXTENSION[type]}`, contentType: type, contentBytes: bytes.toString('base64') },
    meta: { name: `CV-${safeName}.${EXTENSION[type]}`, size: bytes.length, type },
  }
}

/** "+91 98765 43210", so the hiring email is unambiguous. */
const international = (phone, country) => {
  try {
    return parsePhoneNumber(phone, country).formatInternational()
  } catch {
    return phone
  }
}

/* --------------------------------------------------------------- handler */

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { message: 'Method not allowed.' }, { Allow: 'POST' })

  let body
  try {
    body = await readJson(req)
  } catch {
    return send(res, 400, { message: 'The application could not be read.' })
  }

  // Spam signals. A filled honeypot gets a fake success, so bots learn nothing.
  if (body.company_website) return send(res, 200, { ok: true })
  if (typeof body.elapsedMs === 'number' && body.elapsedMs < 3000) {
    return send(res, 400, { message: 'That was submitted a little too quickly.' })
  }

  const { values, errors } = validateApplication(body)
  const cv = readCv(body.cv, values.name)
  if (cv.error) errors.cv = cv.error
  if (Object.keys(errors).length > 0) {
    return send(res, 400, { message: 'Please check the highlighted fields.', errors })
  }

  let job = null
  if (body.jobId !== 'general') {
    try {
      job = typeof body.jobId === 'string' ? await getJob(body.jobId) : null
    } catch (error) {
      console.error('[apply] Role lookup failed:', error.message)
      return send(res, 503, { message: 'Applications are not available right now.' })
    }
    if (!job || job.status !== 'open') {
      return send(res, 409, { message: 'This role is no longer accepting applications. You can still send a general application.' })
    }
  }

  // Counted only for applications about to be sent, so fixing a typo costs nothing.
  if (isRateLimited(clientIp(req))) {
    return send(res, 429, { message: 'Too many applications from this connection. Please try again shortly.' })
  }

  if (!graphConfigured() && !outboxMode()) {
    console.error('[apply] Microsoft 365 mail is not configured.')
    return send(res, 503, { message: 'Our application system is not reachable right now.' })
  }

  const record = {
    timestamp: new Date().toISOString(),
    job: job && { id: job.id, title: job.title },
    applicant: { ...values, phone: international(values.phone, values.phoneCountry) },
    cv: cv.meta,
    sourcePage: typeof body.sourcePage === 'string' ? body.sourcePage.slice(0, 300) : '/careers',
  }

  try {
    const { subject, html } = buildApplicationEmail(record)
    await sendMail({
      from: NOTIFY_FROM,
      to: job?.applyEmail ? [job.applyEmail] : NOTIFY_TO,
      replyTo: { address: values.email, name: values.name },
      subject,
      html,
      attachments: [cv.attachment],
    })
  } catch (error) {
    console.error('[apply] Delivery failed:', error.message)
    return send(res, 502, { message: 'We could not send your application just now.' })
  }

  // The application is delivered; the acknowledgement is best-effort.
  let confirmation = false
  const from = confirmFrom()
  if (from) {
    try {
      const { subject, html } = buildApplicationConfirmation(record)
      await sendMail({ from, to: [values.email], subject, html })
      confirmation = true
    } catch (error) {
      console.error('[apply] Confirmation failed (the application itself was delivered):', error.message)
    }
  }

  return send(res, 200, { ok: true, confirmation })
}
