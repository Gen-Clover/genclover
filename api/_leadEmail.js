/**
 * The notification email for a new project inquiry.
 *
 * Built for inboxes, not browsers: table layout and inline styles (Gmail and
 * Outlook strip <style> blocks and ignore flex/grid), a light card that reads
 * well in both light and dark mail themes, and a plain-text part alongside the
 * HTML, which also helps deliverability.
 *
 * Every value that came from the visitor is escaped. Option values (slugs) are
 * shown with the same labels the form used.
 *
 * The leading underscore keeps Vercel from exposing this file as an endpoint.
 */

import { serviceEnquiryOptions } from '../src/data/services.js'
import { businessTypeOptions, regionOptions, timelineOptions } from '../src/data/leadOptions.js'

const SITE = 'https://www.genclover.com'

const labelFrom = (options) => (value) => options.find((o) => o.value === value)?.label ?? value
const serviceLabel = labelFrom(serviceEnquiryOptions)
const businessLabel = labelFrom(businessTypeOptions)
const regionLabel = labelFrom(regionOptions)
const timelineLabel = labelFrom(timelineOptions)

const escape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Attribution comes straight from the browser: keep it short and to strings. */
const safe = (v, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '')

const formatBudget = (budget) => {
  if (!budget) return null
  try {
    const locale = budget.currency === 'INR' ? 'en-IN' : 'en'
    const money = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: budget.currency,
      maximumFractionDigits: 0,
    }).format(budget.amount)
    return `${money} (${budget.currency})`
  } catch {
    return `${budget.currency} ${Number(budget.amount).toLocaleString('en')}`
  }
}

/** "26 Sep 2026, 9:13 pm IST": the team reads these in India. */
const formatReceived = (iso) => {
  try {
    const ist = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))
    return `${ist} IST`
  } catch {
    return iso
  }
}

/* ------------------------------------------------------------ html bits */

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const RED = '#C1151B'
const INK = '#0B0C0E'
const MUTED = '#5A606A'
const LINE = '#E7EAEE'

const row = (label, value) => `
  <tr>
    <td style="padding:9px 0;width:132px;vertical-align:top;font:13px/1.5 ${FONT};color:${MUTED};">${escape(label)}</td>
    <td style="padding:9px 0;vertical-align:top;font:600 14px/1.5 ${FONT};color:${INK};word-break:break-word;overflow-wrap:anywhere;">${value}</td>
  </tr>`

const section = (title, rows) => `
  <tr>
    <td style="padding:22px 32px 0;">
      <p style="margin:0 0 4px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">${escape(title)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};">
        ${rows.join('')}
      </table>
    </td>
  </tr>`

const link = (href, text) =>
  `<a href="${escape(href)}" style="color:${RED};text-decoration:none;font-weight:600;">${escape(text)}</a>`

const muted = (text) => `<span style="font-weight:400;color:${MUTED};">${escape(text)}</span>`

/* ---------------------------------------------------------------- build */

export const buildLeadEmail = (record) => {
  const service = serviceLabel(record.service)
  const name = record.contact.name
  const company = record.contact.company
  const who = company ? `${name} (${company})` : name
  const budget = formatBudget(record.budget)
  const timeline = record.timeline ? timelineLabel(record.timeline) : null
  const received = formatReceived(record.timestamp)
  const attribution = record.attribution ?? {}
  const referrer = safe(attribution.referrer, 300)
  const campaign = [safe(attribution.utmSource), safe(attribution.utmMedium), safe(attribution.utmCampaign)]
    .filter(Boolean)
    .join(' / ')
  const landing = safe(attribution.landingPage, 300)
  const replySubject = `Re: your ${service} inquiry with Gen Clover`
  const replyHref = `mailto:${record.contact.email}?subject=${encodeURIComponent(replySubject)}`
  const phoneHref = `tel:${record.contact.phone.replace(/[^\d+]/g, '')}`
  const preview = record.description.replace(/\s+/g, ' ').slice(0, 110)

  const subject = `New inquiry: ${service} · ${who}`

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escape(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F2F4F7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F4F7;">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">

        <!-- header -->
        <tr>
          <td style="background:${INK};padding:20px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font:700 15px/1 ${FONT};letter-spacing:.2em;color:#FFFFFF;">GEN&nbsp;CLOV<span style="color:#E01F26;">E</span>R</td>
                <td align="right" style="font:600 11px/1 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:#9AA0A9;">New inquiry</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:3px;background:${RED};line-height:3px;font-size:0;">&nbsp;</td></tr>

        <!-- summary -->
        <tr>
          <td style="padding:28px 32px 4px;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">${escape(service)}</p>
            <h1 style="margin:0;font:700 22px/1.3 ${FONT};color:${INK};">${escape(who)} wants to talk about a project</h1>
            <p style="margin:8px 0 0;font:14px/1.5 ${FONT};color:${MUTED};">Received ${escape(received)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 4px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:8px;background:${RED};">
                  <a href="${escape(replyHref)}" style="display:inline-block;padding:12px 22px;font:600 14px/1 ${FONT};color:#FFFFFF;text-decoration:none;">Reply to ${escape(name)}</a>
                </td>
                <td style="width:10px;">&nbsp;</td>
                <td style="border-radius:8px;border:1px solid ${LINE};">
                  <a href="${escape(phoneHref)}" style="display:inline-block;padding:11px 18px;font:600 14px/1 ${FONT};color:${INK};text-decoration:none;">Call</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- project details -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">In their words</p>
            <div style="border-left:3px solid ${RED};background:#FAFBFC;border-radius:0 8px 8px 0;padding:14px 16px;font:15px/1.6 ${FONT};color:${INK};white-space:pre-wrap;">${escape(record.description)}</div>
          </td>
        </tr>

        ${section('Project', [
          row('Service', escape(service)),
          row('Business type', escape(businessLabel(record.clientSegment))),
          row('Region', escape(regionLabel(record.country))),
          row('Budget', budget ? escape(budget) : muted('Not given')),
          row('Timeline', timeline ? escape(timeline) : muted('Not given')),
        ])}

        ${section('Contact', [
          row('Name', escape(name)),
          row('Company', company ? escape(company) : muted('Not given')),
          row('Email', link(`mailto:${record.contact.email}`, record.contact.email)),
          row('Phone', link(phoneHref, record.contact.phone)),
        ])}

        ${section('How they found us', [
          row('Sent from', escape(record.sourcePage)),
          row('First page', landing ? escape(landing) : muted('Unknown')),
          row('Referrer', referrer ? escape(referrer) : muted('Direct or unknown')),
          row('Campaign', campaign ? escape(campaign) : muted('None')),
        ])}

        <!-- footer -->
        <tr>
          <td style="padding:26px 32px 28px;">
            <p style="margin:0;padding-top:18px;border-top:1px solid ${LINE};font:12px/1.6 ${FONT};color:${MUTED};">
              Sent by the Start a Project form on <a href="${SITE}" style="color:${MUTED};">genclover.com</a>.
              Replying to this email goes straight to ${escape(name)}.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  const text = [
    `New inquiry: ${service}`,
    `${who} wants to talk about a project.`,
    `Received ${received}`,
    '',
    'IN THEIR WORDS',
    record.description,
    '',
    'PROJECT',
    `Service: ${service}`,
    `Business type: ${businessLabel(record.clientSegment)}`,
    `Region: ${regionLabel(record.country)}`,
    `Budget: ${budget ?? 'Not given'}`,
    `Timeline: ${timeline ?? 'Not given'}`,
    '',
    'CONTACT',
    `Name: ${name}`,
    `Company: ${company || 'Not given'}`,
    `Email: ${record.contact.email}`,
    `Phone: ${record.contact.phone}`,
    '',
    'HOW THEY FOUND US',
    `Sent from: ${record.sourcePage}`,
    `First page: ${landing || 'Unknown'}`,
    `Referrer: ${referrer || 'Direct or unknown'}`,
    `Campaign: ${campaign || 'None'}`,
    '',
    `Reply to this email to answer ${name} directly.`,
  ].join('\n')

  return { subject, html, text }
}
