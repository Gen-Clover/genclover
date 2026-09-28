/**
 * Clovi, the chat assistant: what it sends to the team. (Chat)
 *
 *   POST /api/clovi { action: 'contact',    contact }                     → contact email
 *   POST /api/clovi { action: 'lead',       contact, lead, attribution } → Start a Project email
 *                                                                           + the visitor's confirmation
 *   POST /api/clovi { action: 'transcript', contact, messages, ... }     → conversation email
 *
 * Job applications from the chat go through /api/apply, so they arrive exactly
 * like the careers form. No AI service is involved: the conversation runs in
 * the browser. Mail uses the Microsoft 365 set-up of the forms:
 * LEAD_NOTIFY_FROM, LEAD_NOTIFY_TO, APPLY_NOTIFY_TO, LEAD_CONFIRM_FROM, LEAD_CONFIRM_CC.
 */
import { validateContact, internationalPhone, regionFor, clean, TRANSCRIPT_MAX_MESSAGES, TRANSCRIPT_MAX_CHARS } from '../src/lib/clovi/schema.js'
import { serviceEnquiryOptions } from '../src/data/services.js'
import { businessTypeOptions, timelineOptions } from '../src/data/leadOptions.js'
import { buildLeadEmail, buildConfirmationEmail } from './_leadEmail.js'
import { buildContactEmail, buildTranscriptEmail } from './_cloviEmail.js'
import { sendMail, graphConfigured, outboxMode } from './_lib/graph.js'
import { send, readJson, clientIp } from './_lib/http.js'

const list = (value) => String(value).split(',').map((a) => a.trim()).filter(Boolean)
const NOTIFY_FROM = process.env.LEAD_NOTIFY_FROM || 'no-reply@genclover.com'
const LEAD_TO = list(process.env.LEAD_NOTIFY_TO || 'contact@genclover.com')
const JOBS_TO = list(process.env.APPLY_NOTIFY_TO || process.env.LEAD_NOTIFY_TO || 'contact@genclover.com')
const setting = (name, fallback) => {
  const value = (process.env[name] ?? fallback).trim()
  return ['off', 'none', 'false'].includes(value.toLowerCase()) ? '' : value
}

/* ------------------------------------------------------------ rate limit */

/** Per instance: a chat makes a handful of calls, so 20 per 10 minutes per IP is generous. */
const WINDOW_MS = 10 * 60 * 1000
const hits = new Map()
const isRateLimited = (ip) => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 500) for (const [k, t] of hits) if (t.every((x) => now - x >= WINDOW_MS)) hits.delete(k)
  return recent.length > 20
}

const oneOf = (options, v) => options.some((o) => o.value === v)
const page = (body) => clean(body.sourcePage, 300) || '/'

/* --------------------------------------------------------------- handler */

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { message: 'Method not allowed.' }, { Allow: 'POST' })
  if (isRateLimited(clientIp(req))) return send(res, 429, { message: 'Too many messages. Please try again shortly.' })

  let body
  try {
    body = await readJson(req)
  } catch {
    return send(res, 400, { message: 'The request could not be read.' })
  }
  if (body.company_website) return send(res, 200, { ok: true }) // honeypot

  const { values: contact, errors } = validateContact(body.contact)
  if (Object.keys(errors).length) return send(res, 400, { message: 'Please check your details.', errors })
  contact.phone = internationalPhone(contact.phone, contact.phoneCountry)

  if (!graphConfigured() && !outboxMode()) {
    console.error('[clovi] Microsoft 365 mail is not configured.')
    return send(res, 503, { message: 'Our team inbox is not reachable right now.' })
  }

  const timestamp = new Date().toISOString()
  const replyTo = { address: contact.email, name: contact.name }

  try {
    if (body.action === 'contact') {
      const { subject, html } = buildContactEmail({ timestamp, contact, updated: body.updated === true, sourcePage: page(body) })
      await sendMail({ from: NOTIFY_FROM, to: contact.purpose === 'job' ? JOBS_TO : LEAD_TO, replyTo, subject, html })
      return send(res, 200, { ok: true })
    }

    if (body.action === 'lead') {
      const lead = body.lead ?? {}
      const v = {
        service: clean(lead.service, 60),
        businessType: clean(lead.businessType, 60),
        timeline: clean(lead.timeline, 60),
        budget: clean(lead.budget, 60),
        details: clean(lead.details, 4000),
      }
      const leadErrors = {}
      if (!oneOf(serviceEnquiryOptions, v.service)) leadErrors.service = 'Please choose a service.'
      if (!oneOf(businessTypeOptions, v.businessType)) leadErrors.businessType = 'Please choose a business type.'
      if (v.timeline && !oneOf(timelineOptions, v.timeline)) leadErrors.timeline = 'Please choose a timeline.'
      if (v.details.length < 10) leadErrors.details = 'A sentence about the project would help.'
      if (Object.keys(leadErrors).length) return send(res, 400, { message: 'Please check the project details.', errors: leadErrors })

      // Same record shape as the Start a Project form (api/lead.js).
      const record = {
        timestamp,
        channel: 'clovi',
        source: 'website-chat',
        sourcePage: `Clovi chat on ${page(body)}`,
        service: v.service,
        additionalServices: [],
        clientSegment: v.businessType,
        country: regionFor(contact.phoneCountry),
        budget: null,
        timeline: v.timeline || null,
        description: v.budget ? `${v.details}\n\nRough budget (from chat): ${v.budget}` : v.details,
        contact: { name: contact.name, company: null, email: contact.email, phone: contact.phone, phoneCountry: contact.phoneCountry },
        consent: { given: true, at: timestamp },
        attribution: body.attribution && typeof body.attribution === 'object' ? body.attribution : null,
      }
      const internal = buildLeadEmail(record)
      await sendMail({ from: NOTIFY_FROM, to: LEAD_TO, replyTo, subject: internal.subject, html: internal.html })

      let confirmation = false
      const from = setting('LEAD_CONFIRM_FROM', 'contact@genclover.com')
      if (from) {
        try {
          const cc = list(setting('LEAD_CONFIRM_CC', 'contact@genclover.com')).filter((a) => a.toLowerCase() !== contact.email)
          const mail = buildConfirmationEmail(record)
          await sendMail({ from, to: [contact.email], cc, subject: mail.subject, html: mail.html })
          confirmation = true
        } catch (error) {
          console.error('[clovi] Confirmation failed (the lead itself was delivered):', error.message)
        }
      }
      return send(res, 200, { ok: true, confirmation })
    }

    if (body.action === 'transcript') {
      const messages = (Array.isArray(body.messages) ? body.messages : [])
        .slice(-TRANSCRIPT_MAX_MESSAGES)
        .map((m) => ({ from: m?.from === 'user' ? 'user' : 'bot', text: clean(String(m?.text ?? ''), TRANSCRIPT_MAX_CHARS) }))
        .filter((m) => m.text)
      if (messages.length === 0) return send(res, 200, { ok: true })
      const unanswered = (Array.isArray(body.unanswered) ? body.unanswered : []).slice(0, 20).map((q) => clean(String(q), 300)).filter(Boolean)
      const o = body.outcome ?? {}
      const { subject, html } = buildTranscriptEmail({
        timestamp,
        contact,
        messages,
        unanswered,
        outcome: { lead: o.lead === true, application: o.application === true, handoff: o.handoff === true, jobHandoff: o.jobHandoff === true },
        sourcePage: page(body),
      })
      await sendMail({ from: NOTIFY_FROM, to: contact.purpose === 'job' ? JOBS_TO : LEAD_TO, replyTo, subject, html })
      return send(res, 200, { ok: true })
    }

    return send(res, 400, { message: 'Unknown action.' })
  } catch (error) {
    console.error(`[clovi] ${body.action} failed:`, error.message)
    return send(res, 502, { message: 'We could not reach the team just now.' })
  }
}
