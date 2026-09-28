/**
 * The emails the Clovi chat assistant sends to the team (no-reply@ → the lead
 * inbox), in the same look as the form emails:
 *   buildContactEmail     the moment a visitor shares name, email and mobile
 *   buildTranscriptEmail  the conversation, when the chat ends
 *
 * Project leads use the Start a Project email (_leadEmail.js) and job
 * applications the careers email (_applicationEmail.js), so those arrive
 * exactly as they do from the forms. Everything the visitor typed is escaped.
 */
import { purposeLabel } from '../src/lib/clovi/schema.js'
import { SITE, FONT, RED, INK, MUTED, LINE, escape, row, section, link, muted, shell, formatReceived } from './_lib/emailLayout.js'

const contactRows = (c) => {
  const phoneHref = `tel:${String(c.phone).replace(/[^\d+]/g, '')}`
  return [
    row('Name', escape(c.name)),
    row('Email', link(`mailto:${c.email}`, c.email)),
    row('Mobile', link(phoneHref, c.phone)),
    row('Looking to', escape(purposeLabel(c.purpose))),
  ]
}

const replyButton = (c, subject) => `
        <tr>
          <td style="padding:18px 32px 4px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="border-radius:8px;background:${RED};">
                <a href="${escape(`mailto:${c.email}?subject=${encodeURIComponent(subject)}`)}" style="display:inline-block;padding:12px 22px;font:600 14px/1 ${FONT};color:#FFFFFF;text-decoration:none;">Reply to ${escape(c.name.split(/\s+/)[0])}</a>
              </td>
            </tr></table>
          </td>
        </tr>`

const footer = (text) => `
        <tr>
          <td style="padding:26px 32px 28px;">
            <p style="margin:0;padding-top:18px;border-top:1px solid ${LINE};font:12px/1.6 ${FONT};color:${MUTED};">${text}</p>
          </td>
        </tr>`

/* ------------------------------------------------------------ contact */

export const buildContactEmail = (record) => {
  const c = record.contact
  // Sent again, marked, when the visitor corrects their details mid-chat.
  const subject = `${record.updated ? 'Updated contact · ' : ''}Chat: ${c.name} wants to ${purposeLabel(c.purpose).toLowerCase()}`
  const body = `
        <tr>
          <td style="padding:28px 32px 4px;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">Clovi chat · ${escape(purposeLabel(c.purpose))}</p>
            <h1 style="margin:0;font:700 22px/1.3 ${FONT};color:${INK};">${escape(c.name)} ${record.updated ? 'corrected their contact details' : 'started a conversation'}</h1>
            <p style="margin:8px 0 0;font:14px/1.5 ${FONT};color:${MUTED};">Received ${escape(formatReceived(record.timestamp))} on ${escape(record.sourcePage)}</p>
          </td>
        </tr>
        ${replyButton(c, 'Re: your chat with Gen Clover')}
        ${section('Contact', contactRows(c))}
        ${footer(`Sent by the Clovi chat assistant on <a href="${SITE}" style="color:${MUTED};">genclover.com</a> as soon as the visitor shared their details. If they go on to send a project brief or a job application, that arrives as its own email, and the full conversation follows when the chat ends. Replying goes straight to ${escape(c.name)}.`)}`
  return { subject, html: shell({ subject, preview: `${c.email} · ${c.phone}`, badge: 'New chat', body }) }
}

/* ---------------------------------------------------------- transcript */

const bubble = (m) => {
  const bot = m.from === 'bot'
  return `
              <tr>
                <td style="padding:5px 0;">
                  <p style="margin:0 0 2px;font:600 11px/1.4 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${bot ? MUTED : RED};">${bot ? 'Clovi' : 'Visitor'}</p>
                  <div style="display:inline-block;max-width:100%;padding:9px 12px;border-radius:10px;background:${bot ? '#F4F5F7' : '#FDECEC'};font:14px/1.55 ${FONT};color:${INK};white-space:pre-wrap;word-break:break-word;">${escape(m.text)}</div>
                </td>
              </tr>`
}

export const buildTranscriptEmail = (record) => {
  const c = record.contact
  const outcomes = [
    record.outcome.lead && 'Project brief sent (separate email)',
    record.outcome.application && 'Job application sent (separate email)',
    record.outcome.jobHandoff && 'Candidate without a CV: follow up to collect it',
    record.outcome.handoff && !record.outcome.jobHandoff && 'Asked to talk to a person',
  ].filter(Boolean)
  const subject = `Chat transcript: ${c.name} · ${purposeLabel(c.purpose)}`
  const body = `
        <tr>
          <td style="padding:28px 32px 4px;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">Clovi chat transcript</p>
            <h1 style="margin:0;font:700 22px/1.3 ${FONT};color:${INK};">Conversation with ${escape(c.name)}</h1>
            <p style="margin:8px 0 0;font:14px/1.5 ${FONT};color:${MUTED};">Ended ${escape(formatReceived(record.timestamp))} · ${record.messages.length} messages</p>
          </td>
        </tr>
        ${replyButton(c, 'Re: your chat with Gen Clover')}
        ${
          record.unanswered.length
            ? `<tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">Questions Clovi could not answer</p>
            <div style="border-left:3px solid ${RED};background:#FAFBFC;border-radius:0 8px 8px 0;padding:12px 16px;font:14px/1.6 ${FONT};color:${INK};">${record.unanswered.map((q) => `• ${escape(q)}`).join('<br>')}</div>
          </td>
        </tr>`
            : ''
        }
        ${section('Visitor', [...contactRows(c), row('Outcome', outcomes.length ? outcomes.map(escape).join('<br>') : muted('No brief or application sent'))])}
        <tr>
          <td style="padding:22px 32px 0;">
            <p style="margin:0 0 8px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">Conversation</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};padding-top:6px;">${record.messages.map(bubble).join('')}</table>
          </td>
        </tr>
        ${footer(`Sent by the Clovi chat assistant on <a href="${SITE}" style="color:${MUTED};">genclover.com</a>. Started on ${escape(record.sourcePage)}. Replying goes straight to ${escape(c.name)}.`)}`
  return {
    subject,
    html: shell({ subject, preview: record.unanswered.length ? `${record.unanswered.length} question(s) need a reply` : `${record.messages.length} messages`, badge: 'Chat transcript', body }),
  }
}
