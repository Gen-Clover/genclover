/**
 * Shared layout for the site's outgoing emails: table layout and inline styles
 * (Gmail and Outlook strip <style> blocks and ignore flex/grid), a light card that
 * reads well in light and dark mail themes. Everything passed in as text is escaped.
 */
export const SITE = 'https://www.genclover.com'
export const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
export const RED = '#C1151B'
export const INK = '#0B0C0E'
export const MUTED = '#5A606A'
export const LINE = '#E7EAEE'

export const escape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const row = (label, value) => `
  <tr>
    <td style="padding:9px 0;width:132px;vertical-align:top;font:13px/1.5 ${FONT};color:${MUTED};">${escape(label)}</td>
    <td style="padding:9px 0;vertical-align:top;font:600 14px/1.5 ${FONT};color:${INK};word-break:break-word;overflow-wrap:anywhere;">${value}</td>
  </tr>`

export const section = (title, rows) => `
  <tr>
    <td style="padding:22px 32px 0;">
      <p style="margin:0 0 4px;font:700 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${RED};">${escape(title)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};">
        ${rows.join('')}
      </table>
    </td>
  </tr>`

export const link = (href, text) =>
  `<a href="${escape(href)}" style="color:${RED};text-decoration:none;font-weight:600;">${escape(text)}</a>`

export const muted = (text) => `<span style="font-weight:400;color:${MUTED};">${escape(text)}</span>`

export const shell = ({ subject, preview, badge, body }) => `<!doctype html>
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

export const formatReceived = (iso) => {
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
