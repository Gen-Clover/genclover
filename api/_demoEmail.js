/**
 * The two emails a demo request sends:
 *   buildDemoEmail         to the team, with the authorisation recorded verbatim
 *   buildDemoConfirmation  the acknowledgement to the visitor
 *
 * Same look as the other site emails (_lib/emailLayout.js). Everything the
 * visitor typed is escaped. The leading underscore keeps Vercel from exposing
 * this file as an endpoint.
 */
import { demoTypeLabel, templateChoiceLabel, DEMO_AUTHORISATION } from '../src/lib/demoRequest.js'
import { getTemplate, templatePath } from '../src/data/templates.js'
import { SITE, FONT, RED, INK, MUTED, LINE, escape, row, section, link, muted, shell, formatReceived } from './_lib/emailLayout.js'

const callout = (title, html, tone = RED) => `
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${tone};">${escape(title)}</p>
            <div style="border-left:3px solid ${tone};background:#FAFBFC;border-radius:0 8px 8px 0;padding:14px 16px;font:14px/1.6 ${FONT};color:${INK};white-space:pre-wrap;">${html}</div>
          </td>
        </tr>`

const templateRow = (slug) => {
  const template = getTemplate(slug)
  return template ? link(`${SITE}${templatePath(slug)}`, templateChoiceLabel(slug)) : escape(templateChoiceLabel(slug))
}

/* ---------------------------------------------------------- to the team */

export const buildDemoEmail = (record) => {
  const c = record.contact
  const redesign = record.demoType === 'redesign'
  const what = redesign
    ? `Redesign of ${record.website.host}`
    : getTemplate(record.template)
      ? `${getTemplate(record.template).name} template`
      : 'Template, help choosing'
  const subject = `Demo request: ${what} · ${record.businessName}`
  const replyHref = `mailto:${c.email}?subject=${encodeURIComponent(`Re: your demo request at Gen Clover`)}`
  const phoneHref = `tel:${c.phone.replace(/[^\d+]/g, '')}`

  const body = `
        <tr>
          <td style="padding:28px 32px 4px;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">${escape(demoTypeLabel(record.demoType))}</p>
            <h1 style="margin:0;font:700 22px/1.3 ${FONT};color:${INK};">${escape(record.businessName)} would like a demo</h1>
            <p style="margin:8px 0 0;font:14px/1.5 ${FONT};color:${MUTED};">Received ${escape(formatReceived(record.timestamp))} · from ${escape(c.name)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px 4px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:8px;background:${RED};">
                  <a href="${escape(replyHref)}" style="display:inline-block;padding:12px 22px;font:600 14px/1 ${FONT};color:#FFFFFF;text-decoration:none;">Reply to ${escape(c.name.split(/\s+/)[0])}</a>
                </td>
                <td style="width:10px;">&nbsp;</td>
                <td style="border-radius:8px;border:1px solid ${LINE};">
                  <a href="${escape(phoneHref)}" style="display:inline-block;padding:11px 18px;font:600 14px/1 ${FONT};color:${INK};text-decoration:none;">Call</a>
                </td>
                ${
                  redesign
                    ? `<td style="width:10px;">&nbsp;</td>
                <td style="border-radius:8px;border:1px solid ${LINE};">
                  <a href="${escape(record.website.url)}" style="display:inline-block;padding:11px 18px;font:600 14px/1 ${FONT};color:${INK};text-decoration:none;">Open their website</a>
                </td>`
                    : ''
                }
              </tr>
            </table>
          </td>
        </tr>
        ${record.notes ? callout('In their words', escape(record.notes)) : ''}
        ${section('Demo', [
          row('Kind', escape(demoTypeLabel(record.demoType))),
          ...(redesign ? [row('Current website', link(record.website.url, record.website.url))] : []),
          row('Template', record.template ? templateRow(record.template) : muted(redesign ? 'No preference, follow their current site' : 'Not given')),
          row('Business', escape(record.businessName)),
        ])}
        ${section('Contact', [
          row('Name', escape(c.name)),
          row('Email', link(`mailto:${c.email}`, c.email)),
          row('Phone', link(phoneHref, c.phone)),
          row('Sent from', escape(record.sourcePage)),
        ])}
        ${
          record.authorisation
            ? callout(
                'Permission to use their website material',
                `<strong>Given ${escape(formatReceived(record.authorisation.at))}</strong> by ${escape(c.name)} (${escape(c.email)}), wording version ${escape(record.authorisation.version)}:\n\n“${escape(record.authorisation.text)}”\n\n` +
                  (record.website.emailMatches
                    ? `Their email address is on the website's own domain (${escape(record.website.host)}).`
                    : `<span style="color:${RED};font-weight:600;">Their email address is not on ${escape(record.website.host)}.</span> Confirm on the first call that they can act for this business before sharing the demo.`),
                record.website.emailMatches ? '#1F7A4D' : RED
              )
            : ''
        }
        <tr>
          <td style="padding:26px 32px 28px;">
            <p style="margin:0;padding-top:18px;border-top:1px solid ${LINE};font:12px/1.6 ${FONT};color:${MUTED};">
              Sent by the demo request form on <a href="${SITE}" style="color:${MUTED};">genclover.com</a>.
              Replying to this email goes straight to ${escape(c.name)}. Keep this email as the record of
              their permission. Share the demo only with them, keep it unpublished, and delete it with the
              copied material if they ask.
            </p>
          </td>
        </tr>`

  return {
    subject,
    html: shell({ subject, preview: `${record.businessName} · ${demoTypeLabel(record.demoType)}`, badge: 'Demo request', body }),
  }
}

/* --------------------------------------------------------- to the visitor */

/** First name only if it looks like one: the form is public (see _leadEmail.js). */
const greetingName = (name) => {
  const first = String(name ?? '').trim().split(/\s+/)[0] ?? ''
  if (!first || first.length > 30 || /[/:@<>]|www\.|https?|\.\w{2,}/i.test(first)) return 'there'
  return first
}

/**
 * Repeats only our own text (the kind of demo and the permission wording),
 * never anything the visitor typed, so the form cannot be used to send someone
 * else's words or links from our domain.
 */
export const buildDemoConfirmation = (record) => {
  const first = greetingName(record.contact.name)
  const redesign = record.demoType === 'redesign'
  const subject = 'We have received your demo request · Gen Clover'

  const intro = redesign
    ? 'Thanks for asking us to redesign your website as a demo. We will review your current site, build a first version using your own brand, photos and content, and set up a short call to walk you through it.'
    : 'Thanks for asking for a template demo. We will set the template up with your business in mind and arrange a short call to walk you through it.'

  const body = `
        <tr>
          <td style="padding:30px 32px 6px;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">Thank you, ${escape(first)}</p>
            <h1 style="margin:0;font:700 24px/1.3 ${FONT};color:${INK};">We have received your demo request.</h1>
            <p style="margin:14px 0 0;font:15px/1.65 ${FONT};color:#2E333A;">${escape(intro)}</p>
            <p style="margin:12px 0 0;font:15px/1.65 ${FONT};color:#2E333A;">We usually reply within one or two working days to agree a time.</p>
          </td>
        </tr>
        ${
          redesign
            ? `<tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${MUTED};">What you agreed to</p>
            <div style="background:#FAFBFC;border:1px solid ${LINE};border-radius:10px;padding:16px 18px;font:14px/1.6 ${FONT};color:#2E333A;">
              “${escape(DEMO_AUTHORISATION.text)}”
              <br><br><span style="color:${MUTED};">Recorded ${escape(formatReceived(record.authorisation.at))}. To withdraw this permission, or to have the demo deleted, just reply to this email.</span>
            </div>
          </td>
        </tr>`
            : ''
        }
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
              You are receiving this because this address was used to request a demo on our website.
              If this was not you, reply and let us know, and we will delete the request.
            </p>
          </td>
        </tr>`

  return {
    subject,
    html: shell({ subject, preview: `Thanks, ${first}. We will be in touch to arrange your demo.`, badge: 'Demo request received', body }),
  }
}
