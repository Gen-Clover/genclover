/**
 * Admin authentication for /admin.
 *
 * One admin account, configured in Vercel → Settings → Environment Variables:
 *   ADMIN_EMAIL            the login email
 *   ADMIN_PASSWORD_HASH    output of `npm run admin:hash-password` (scrypt, salted)
 *   ADMIN_SESSION_SECRET   32+ random characters; signs the session cookie.
 *                          Changing it signs every admin out.
 *
 * The session is a signed, expiring token in an httpOnly, Secure,
 * SameSite=Strict cookie scoped to /api/admin, so page scripts can never read
 * it and other sites can never send it. Mutating requests must also carry the
 * X-GC-Admin header, which a cross-site form cannot set.
 */
import { scryptSync, timingSafeEqual, createHmac, randomBytes } from 'node:crypto'
import { parseCookies } from './http.js'

const COOKIE = 'gc_admin'
const SESSION_HOURS = 12

const secret = () => process.env.ADMIN_SESSION_SECRET || ''

export const authConfigured = () =>
  Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && secret().length >= 32)

/* -------------------------------------------------------------- passwords */

/** Format: scrypt:<salt base64>:<hash base64> (no $, which .env files expand). */
export const hashPassword = (password) => {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `scrypt:${salt.toString('base64')}:${hash.toString('base64')}`
}

const verifyPassword = (password, stored) => {
  const [scheme, saltB64, hashB64] = String(stored).split(':')
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false
  const expected = Buffer.from(hashB64, 'base64')
  const actual = scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length)
  return timingSafeEqual(actual, expected)
}

const sameText = (a, b) => {
  const x = Buffer.from(String(a).toLowerCase().trim())
  const y = Buffer.from(String(b).toLowerCase().trim())
  return x.length === y.length && timingSafeEqual(x, y)
}

export const checkCredentials = (email, password) => {
  if (!authConfigured() || typeof email !== 'string' || typeof password !== 'string') return false
  // Always run the (slow) hash check, so a wrong email takes as long as a wrong password.
  const passwordOk = verifyPassword(password.slice(0, 200), process.env.ADMIN_PASSWORD_HASH)
  return sameText(email, process.env.ADMIN_EMAIL) && passwordOk
}

/* --------------------------------------------------------------- sessions */

const sign = (payload) => createHmac('sha256', secret()).update(payload).digest('base64url')

const issueToken = (email) => {
  const payload = Buffer.from(
    JSON.stringify({ sub: email, exp: Date.now() + SESSION_HOURS * 3600_000 })
  ).toString('base64url')
  return `${payload}.${sign(payload)}`
}

const readToken = (token) => {
  if (!token || !secret()) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return data.exp > Date.now() ? data : null
  } catch {
    return null
  }
}

const cookie = (value, maxAgeSeconds) =>
  `${COOKIE}=${value}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`

export const sessionCookie = (email) => cookie(issueToken(email), SESSION_HOURS * 3600)
export const clearedCookie = () => cookie('', 0)

/** The signed-in admin's email, or null. */
export const currentAdmin = (req) => {
  const data = readToken(parseCookies(req)[COOKIE])
  if (!data || !sameText(data.sub, process.env.ADMIN_EMAIL || '')) return null
  return data.sub
}

/** Blocks cross-site form posts: browsers only add custom headers from our own scripts. */
export const hasAdminHeader = (req) => req.headers['x-gc-admin'] === '1'
