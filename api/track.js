/**
 * Visit events from the public site, for the visitor log in /admin.
 *
 *   POST /api/track  { visitor, session, referrer?, events: [{ type, path, at, data? }] }
 *
 * Sent with navigator.sendBeacon by src/lib/visitorLog.js. Location comes from
 * Vercel's request headers (country, region, city); the IP address is used
 * only for rate limiting in memory and is never stored. Browsers sending Do
 * Not Track or Global Privacy Control, and obvious bots, are not logged.
 * Always answers 204, so a page never waits on this or learns anything from it.
 */
import { addVisitEvents } from './_lib/visits.js'
import { readJson, clientIp } from './_lib/http.js'

const ID_RE = /^[a-z0-9-]{8,64}$/i
const TYPES = new Set(['pageview', 'leave', 'event'])
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|facebookexternalhit/i
const MAX_EVENTS = 40

/* per-instance throttle, like the forms: blunts floods, not a distributed attack */
const WINDOW_MS = 60 * 1000
const MAX_PER_WINDOW = 120
const hits = new Map()
const limited = (ip) => {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 2000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  return recent.length > MAX_PER_WINDOW
}

const text = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, max) : '')

const header = (req, name) => {
  const v = req.headers[name]
  if (!v) return null
  try {
    return decodeURIComponent(String(v)).slice(0, 80)
  } catch {
    return String(v).slice(0, 80)
  }
}

/** Device, browser and OS from the user agent: coarse buckets only. */
const describeAgent = (ua) => {
  const device = /ipad|tablet/i.test(ua) ? 'Tablet' : /mobi|android|iphone/i.test(ua) ? 'Mobile' : 'Desktop'
  const browser = /edg\//i.test(ua)
    ? 'Edge'
    : /opr\/|opera/i.test(ua)
      ? 'Opera'
      : /samsungbrowser/i.test(ua)
        ? 'Samsung Internet'
        : /chrome|crios/i.test(ua)
          ? 'Chrome'
          : /firefox|fxios/i.test(ua)
            ? 'Firefox'
            : /safari/i.test(ua)
              ? 'Safari'
              : 'Other'
  const os = /windows/i.test(ua)
    ? 'Windows'
    : /iphone|ipad|ios/i.test(ua)
      ? 'iOS'
      : /android/i.test(ua)
        ? 'Android'
        : /mac os/i.test(ua)
          ? 'macOS'
          : /linux/i.test(ua)
            ? 'Linux'
            : 'Other'
  return { device, browser, os }
}

/** Only the referring site's host is kept, never its full URL. */
const referrerHost = (value) => {
  try {
    const host = new URL(value).hostname.replace(/^www\./, '')
    return /(^|\.)genclover\.com$/.test(host) ? null : host.slice(0, 80)
  } catch {
    return null
  }
}

/** Event details: a few short strings or numbers, nothing nested. */
const cleanData = (data) => {
  if (!data || typeof data !== 'object') return null
  const out = {}
  for (const [k, v] of Object.entries(data).slice(0, 8)) {
    const key = text(k, 30)
    if (!key) continue
    if (typeof v === 'number' && Number.isFinite(v)) out[key] = Math.round(v * 100) / 100
    else if (typeof v === 'string') out[key] = text(v, 120)
    else if (typeof v === 'boolean') out[key] = v
  }
  return Object.keys(out).length ? out : null
}

export default async function handler(req, res) {
  res.statusCode = 204
  if (req.method !== 'POST') return res.end()

  const ua = String(req.headers['user-agent'] || '')
  if (BOT_RE.test(ua) || req.headers.dnt === '1' || req.headers['sec-gpc'] === '1') return res.end()
  if (limited(clientIp(req))) return res.end()

  let body
  try {
    body = await readJson(req)
  } catch {
    return res.end()
  }
  const visitor = text(body.visitor, 64)
  const session = text(body.session, 64)
  if (!ID_RE.test(visitor) || !ID_RE.test(session) || !Array.isArray(body.events)) return res.end()

  const agent = describeAgent(ua)
  const place = {
    country: header(req, 'x-vercel-ip-country'),
    region: header(req, 'x-vercel-ip-country-region'),
    city: header(req, 'x-vercel-ip-city'),
  }
  const referrer = referrerHost(body.referrer)
  const now = Date.now()

  const rows = body.events
    .slice(0, MAX_EVENTS)
    .map((e) => {
      const type = text(e?.type, 20)
      const path = text(e?.path, 300)
      const at = Date.parse(e?.at)
      if (!TYPES.has(type) || !path.startsWith('/') || path.startsWith('/admin')) return null
      // A clock that is badly off is replaced by the server's.
      const when = Number.isFinite(at) && Math.abs(now - at) < 24 * 3600 * 1000 ? at : now
      return { at: new Date(when).toISOString(), visitor, session, type, path, data: cleanData(e.data), ...place, ...agent, referrer }
    })
    .filter(Boolean)

  try {
    await addVisitEvents(rows)
  } catch (error) {
    console.error('[track] Could not store visit events:', error.message)
  }
  return res.end()
}
