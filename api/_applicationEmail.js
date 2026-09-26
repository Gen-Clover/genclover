/**
 * The two emails a job application sends:
 *   buildApplicationEmail         to the hiring inbox, with the CV attached
 *   buildApplicationConfirmation  the acknowledgement to the candidate
 *
 * Same look as the inquiry emails (_leadEmail.js): table layout, inline
 * styles, a light card that survives Gmail and Outlook. Everything the
 * candidate typed is escaped. The leading underscore keeps Vercel from
 * exposing this file as an endpoint.
 */
import { experienceLabel, noticeLabel } from '../src/lib/application.js'

const SITE = 'https://www.genclover.com'
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const RED = '#C1151B'
const INK = '#0B0C0E'
const MUTED = '#5A606A'
const LINE = '#E7EAEE'

const escape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

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

const shell = ({ subject, preview, badge, body }) => `<!doctype html>
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
        <tr>
          <td style="background:${INK};padding:20px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font:700 15px/1 ${FONT};letter-spacing:.2em;color:#FFFFFF;">GEN&nbsp;CLOV<span style="color:#E01F26;">E</span>R</td>
                <td align="right" style="font:600 11px/1 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:#9AA0A9;">${escape(badge)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:3px;background:${RED};line-height:3px;font-size:0;">&nbsp;</td></tr>
        ${body}
      </table>
    </td>
  </tr>
</table>
</body>
</html>`

const formatReceived = (iso) => {
  try {
    return `${new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))} IST`
  } catch {
    return iso
  }
}

const fileSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`)

/* ---------------------------------------------------------- to the team */

export const buildApplicationEmail = (record) => {
  const a = record.applicant
  const role = record.job?.title ?? 'General application'
  const subject = `Application: ${role} · ${a.name}`
  const replyHref = `mailto:${a.email}?subject=${encodeURIComponent(`Re: your application for ${role} at Gen Clover`)}`
  const phoneHref = `tel:${a.phone.replace(/[^\d+]/g, '')}`

  const body = `
        <tr>
          <td style="padding:28px 32px 4px;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">${escape(role)}</p>
            <h1 style="margin:0;font:700 22px/1.3 ${FONT};color:${INK};">${escape(a.name)} has applied</h1>
            <p style="margin:8px 0 0;font:14px/1.5 ${FONT};color:${MUTED};">Received ${escape(formatReceived(record.timestamp))} · CV attached (${escape(record.cv.name)}, ${escape(fileSize(record.cv.size))})</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 4px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:8px;background:${RED};">
                  <a href="${escape(replyHref)}" style="display:inline-block;padding:12px 22px;font:600 14px/1 ${FONT};color:#FFFFFF;text-decoration:none;">Reply to ${escape(a.name.split(/\s+/)[0])}</a>
                </td>
                <td style="width:10px;">&nbsp;</td>
                <td style="border-radius:8px;border:1px solid ${LINE};">
                  <a href="${escape(phoneHref)}" style="display:inline-block;padding:11px 18px;font:600 14px/1 ${FONT};color:${INK};text-decoration:none;">Call</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${
          a.note
            ? `<tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">In their words</p>
            <div style="border-left:3px solid ${RED};background:#FAFBFC;border-radius:0 8px 8px 0;padding:14px 16px;font:15px/1.6 ${FONT};color:${INK};white-space:pre-wrap;">${escape(a.note)}</div>
          </td>
        </tr>`
            : ''
        }
        ${section('Candidate', [
          row('Name', escape(a.name)),
          row('Email', link(`mailto:${a.email}`, a.email)),
          row('Phone', link(phoneHref, a.phone)),
          row('Based in', escape(a.city)),
          row('Experience', escape(experienceLabel(a.experienceYears))),
          row('Can start', escape(noticeLabel(a.noticePeriod))),
          row('Profile', a.profileUrl ? link(a.profileUrl, a.profileUrl) : muted('Not given')),
        ])}
        ${section('Role', [
          row('Applied for', record.job ? link(`${SITE}/careers/${record.job.id}`, role) : escape(role)),
          row('Sent from', escape(record.sourcePage)),
        ])}
        <tr>
          <td style="padding:26px 32px 28px;">
            <p style="margin:0;padding-top:18px;border-top:1px solid ${LINE};font:12px/1.6 ${FONT};color:${MUTED};">
              Sent by the careers page on <a href="${SITE}" style="color:${MUTED};">genclover.com</a>.
              Replying to this email goes straight to ${escape(a.name)}. The candidate agreed to us
              keeping their application on file for this and future roles; delete it if they ask.
            </p>
          </td>
        </tr>`

  return {
    subject,
    html: shell({ subject, preview: `${a.name} · ${experienceLabel(a.experienceYears)} · ${a.city}`, badge: 'New application', body }),
  }
}

/* ------------------------------------------------------- to the candidate */

/** First name only if it looks like one: the form is public (see _leadEmail.js). */
const greetingName = (name) => {
  const first = String(name ?? '').trim().split(/\s+/)[0] ?? ''
  if (!first || first.length > 30 || /[/:@<>]|www\.|https?|\.\w{2,}/i.test(first)) return 'there'
  return first
}

/**
 * Repeats only the role title (our text), never anything the candidate typed,
 * so the form cannot be used to send someone else's words from our domain.
 */
export const buildApplicationConfirmation = (record) => {
  const first = greetingName(record.applicant.name)
  const role = record.job?.title ?? 'a role at Gen Clover'
  const subject = record.job
    ? `We have received your application for ${record.job.title} · Gen Clover`
    : 'We have received your application · Gen Clover'

  const body = `
        <tr>
          <td style="padding:30px 32px 6px;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">Thank you, ${escape(first)}</p>
            <h1 style="margin:0;font:700 24px/1.3 ${FONT};color:${INK};">We have received your application.</h1>
            <p style="margin:14px 0 0;font:15px/1.65 ${FONT};color:#2E333A;">
              Thanks for applying for ${escape(role)}. A person on our team reads every application,
              together with your CV. If your experience is a match, we will get in touch to arrange a
              first conversation. If it is not the right fit this time, we will let you know as well.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="background:#FAFBFC;border:1px solid ${LINE};border-radius:10px;padding:16px 18px;font:14px/1.6 ${FONT};color:#2E333A;">
              <strong style="color:${INK};">Anything to add?</strong> Just reply to this email.
              It reaches our team at ${link('mailto:contact@genclover.com', 'contact@genclover.com')}.
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;font:15px/1.6 ${FONT};color:#2E333A;">
            Best wishes,<br>
            <strong style="color:${INK};">The Gen Clover team</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 28px;">
            <p style="margin:0;padding-top:18px;border-top:1px solid ${LINE};font:12px/1.6 ${FONT};color:${MUTED};">
              Gen Clover · Chandigarh, India · <a href="${SITE}" style="color:${MUTED};">genclover.com</a><br>
              You are receiving this because this address was used to apply on our careers page.
              We keep your details on file to consider you for this and future roles.
              To have them deleted, reply to this email.
              If this was not you, you can ignore this email.
            </p>
          </td>
        </tr>`

  return {
    subject,
    html: shell({ subject, preview: `Thanks, ${first}. We read every application and will be in touch.`, badge: 'Application received', body }),
  }
}
