/**
 * Admin sign-in. (See api/_lib/auth.js for the configuration.)
 *
 *   GET    /api/admin/auth  → { email } when signed in, 401 otherwise
 *   POST   /api/admin/auth  { email, password } → sets the session cookie
 *   DELETE /api/admin/auth  → clears it
 *
 * Five failed attempts from one address lock it out for 15 minutes.
 */
import {
  authConfigured,
  checkCredentials,
  currentAdmin,
  sessionCookie,
  clearedCookie,
  hasAdminHeader,
} from '../_lib/auth.js'
import { recentFailedLogins, recordFailedLogin, clearFailedLogins } from '../_lib/store.js'
import { send, readJson, clientIp } from '../_lib/http.js'

const MAX_FAILURES = 5
const WINDOW_MINUTES = 15
const NO_STORE = { 'Cache-Control': 'no-store' }

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const email = currentAdmin(req)
    return email
      ? send(res, 200, { email }, NO_STORE)
      : send(res, 401, { message: 'Not signed in.', configured: authConfigured() }, NO_STORE)
  }

  if (!hasAdminHeader(req)) return send(res, 403, { message: 'Forbidden.' })

  if (req.method === 'DELETE') {
    return send(res, 200, { ok: true }, { ...NO_STORE, 'Set-Cookie': clearedCookie() })
  }

  if (req.method !== 'POST') {
    return send(res, 405, { message: 'Method not allowed.' }, { Allow: 'GET, POST, DELETE' })
  }

  if (!authConfigured()) {
    console.error('[admin] ADMIN_EMAIL, ADMIN_PASSWORD_HASH or ADMIN_SESSION_SECRET is missing.')
    return send(res, 503, { message: 'Admin sign-in is not configured on this deployment.' })
  }

  const ip = clientIp(req)
  try {
    if ((await recentFailedLogins(ip, WINDOW_MINUTES)) >= MAX_FAILURES) {
      return send(res, 429, {
        message: `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.`,
      })
    }

    const body = await readJson(req)
    if (!checkCredentials(body.email, body.password)) {
      await recordFailedLogin(ip)
      return send(res, 401, { message: 'That email and password do not match.' })
    }

    await clearFailedLogins(ip)
    const email = String(body.email).trim().toLowerCase()
    return send(res, 200, { email }, { ...NO_STORE, 'Set-Cookie': sessionCookie(email) })
  } catch (error) {
    console.error('[admin] Sign-in failed:', error.message)
    return send(res, 500, { message: 'Sign-in failed. Please try again.' })
  }
}
