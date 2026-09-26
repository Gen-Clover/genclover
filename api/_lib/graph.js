/**
 * Email through Microsoft 365 (Microsoft Graph), as our own @genclover.com
 * mailboxes. Same app registration and variables as the inquiry form
 * (MS_TENANT_ID, MS_MAIL_CLIENT_ID, MS_MAIL_CLIENT_SECRET; see
 * docs/MICROSOFT-365-MAIL-SETUP.md), with support for attachments.
 *
 * Local development without those variables: messages are written to
 * .data/outbox/ (gitignored) instead of being sent, so the flow can be tested
 * end to end. On Vercel, missing variables are an error, never a silent skip.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const graphConfigured = () =>
  Boolean(process.env.MS_TENANT_ID && process.env.MS_MAIL_CLIENT_ID && process.env.MS_MAIL_CLIENT_SECRET)

/** Local dev only: no credentials, not on Vercel. */
export const outboxMode = () => !graphConfigured() && !process.env.VERCEL

let token = { value: null, expiresAt: 0 }

const getToken = async () => {
  if (token.value && Date.now() < token.expiresAt - 60_000) return token.value
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
  token = { value: payload.access_token, expiresAt: Date.now() + payload.expires_in * 1000 }
  return token.value
}

const recipients = (addresses) => addresses.map((address) => ({ emailAddress: { address } }))

const writeToOutbox = async (message) => {
  const dir = resolve(process.cwd(), '.data', 'outbox')
  await mkdir(dir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const base = `${stamp}-${message.subject.replace(/[^a-z0-9]+/gi, '-').slice(0, 60)}`
  await writeFile(resolve(dir, `${base}.html`), message.html)
  for (const a of message.attachments ?? []) {
    await writeFile(resolve(dir, `${base}--${a.name}`), Buffer.from(a.contentBytes, 'base64'))
  }
  console.log(`[mail] (local outbox) "${message.subject}" to ${message.to.join(', ')} → .data/outbox/${base}.html`)
}

/**
 * Send one email as `from`. `attachments`: [{ name, contentType, contentBytes (base64) }],
 * together under 3 MB. Throws if Graph refuses the message.
 */
export const sendMail = async ({ from, to, cc = [], replyTo, subject, html, attachments = [] }) => {
  if (outboxMode()) return writeToOutbox({ from, to, subject, html, attachments })
  if (!graphConfigured()) throw new Error('Microsoft 365 mail is not configured (MS_TENANT_ID, MS_MAIL_CLIENT_ID, MS_MAIL_CLIENT_SECRET).')

  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(from)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await getToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: recipients(to),
        ...(cc.length ? { ccRecipients: recipients(cc) } : {}),
        ...(replyTo ? { replyTo: [{ emailAddress: replyTo }] } : {}),
        ...(attachments.length
          ? {
              attachments: attachments.map((a) => ({
                '@odata.type': '#microsoft.graph.fileAttachment',
                name: a.name,
                contentType: a.contentType,
                contentBytes: a.contentBytes,
              })),
            }
          : {}),
      },
      saveToSentItems: true,
    }),
  })

  // Graph answers 202 Accepted with an empty body on success.
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Microsoft Graph rejected the email from ${from} (${response.status}): ${detail.slice(0, 500)}`)
  }
}
