/**
 * Small request/response helpers shared by the API functions.
 * They only rely on Node's own req/res, so the same handlers run on Vercel and
 * under the local dev middleware in vite.config.js.
 */

export const send = (res, status, body, headers = {}) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  res.end(JSON.stringify(body))
}

export const query = (req) => new URL(req.url, 'http://localhost').searchParams

/** Vercel parses JSON bodies; the dev middleware may hand over a string or nothing. */
export const readJson = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 200_000) throw new Error('Body too large')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

export const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'

export const parseCookies = (req) =>
  Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key]) => key)
      .map(([key, ...rest]) => [key, decodeURIComponent(rest.join('='))])
  )
