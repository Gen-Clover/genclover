/**
 * The visitor log for the admin portal. Signed-in admins only.
 *
 *   GET /api/admin/visits?days=7         → summary for the last N days (1–180)
 *   GET /api/admin/visits?visitor=<id>   → everything one visitor did, by session
 */
import { listVisitEvents, visitsMode, RETENTION_DAYS } from '../_lib/visits.js'
import { currentAdmin } from '../_lib/auth.js'
import { send, query } from '../_lib/http.js'

const NO_STORE = { 'Cache-Control': 'no-store' }

const count = (items, key, limit = 10) => {
  const tally = new Map()
  for (const item of items) {
    const k = key(item)
    if (k) tally.set(k, (tally.get(k) ?? 0) + 1)
  }
  return [...tally].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([label, value]) => ({ label, value }))
}

/** A click is named by what was clicked; other events by their own name. */
const actionName = (e) => (e.data?.name === 'click' ? (e.data.label ? `Clicked “${e.data.label}”` : null) : e.data?.name)

const place = (e) => [e.city, e.region, e.country].filter(Boolean).join(', ') || null

/** Group events into sessions, with what each session amounted to. */
const toSessions = (events) => {
  const by = new Map()
  for (const e of events) {
    if (!by.has(e.session)) by.set(e.session, [])
    by.get(e.session).push(e)
  }
  return [...by.entries()].map(([id, list]) => {
    const first = list[0]
    const views = list.filter((e) => e.type === 'pageview')
    const seconds = list.filter((e) => e.type === 'leave').reduce((sum, e) => sum + (Number(e.data?.seconds) || 0), 0)
    return {
      id,
      visitor: first.visitor,
      startedAt: first.at,
      endedAt: list[list.length - 1].at,
      location: place(first),
      country: first.country,
      device: first.device,
      browser: first.browser,
      os: first.os,
      referrer: first.referrer,
      entry: views[0]?.path ?? first.path,
      pages: views.length,
      seconds: Math.round(seconds),
      actions: list.filter((e) => e.type === 'event').map(actionName).filter(Boolean),
      events: list,
    }
  })
}

const summarize = (events, days) => {
  const sessions = toSessions(events)
  const views = events.filter((e) => e.type === 'pageview')
  const leaves = events.filter((e) => e.type === 'leave')
  const visitors = new Set(events.map((e) => e.visitor))
  const sessionsPerVisitor = count(sessions, (s) => s.visitor, Infinity)

  // Per day, in IST, since that is where the team reads it.
  const day = (iso) => new Date(new Date(iso).getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)
  const daily = new Map()
  for (let i = days - 1; i >= 0; i--) daily.set(day(new Date(Date.now() - i * 864e5).toISOString()), { visitors: new Set(), views: 0 })
  for (const e of events) {
    const d = daily.get(day(e.at))
    if (!d) continue
    d.visitors.add(e.visitor)
    if (e.type === 'pageview') d.views++
  }

  const pageTime = new Map()
  for (const e of leaves) {
    const p = pageTime.get(e.path) ?? { seconds: 0, n: 0 }
    p.seconds += Number(e.data?.seconds) || 0
    p.n++
    pageTime.set(e.path, p)
  }

  return {
    totals: {
      visitors: visitors.size,
      sessions: sessions.length,
      pageviews: views.length,
      returning: sessionsPerVisitor.filter((v) => v.value > 1).length,
      avgSessionSeconds: sessions.length ? Math.round(sessions.reduce((s, x) => s + x.seconds, 0) / sessions.length) : 0,
      pagesPerSession: sessions.length ? Math.round((views.length / sessions.length) * 10) / 10 : 0,
    },
    daily: [...daily].map(([date, d]) => ({ date, visitors: d.visitors.size, views: d.views })),
    pages: count(views, (e) => e.path, 15).map((p) => {
      const t = pageTime.get(p.label)
      return { ...p, avgSeconds: t?.n ? Math.round(t.seconds / t.n) : null }
    }),
    countries: count(sessions, (s) => s.country),
    cities: count(sessions, (s) => s.location),
    devices: count(sessions, (s) => s.device),
    browsers: count(sessions, (s) => s.browser),
    referrers: count(sessions, (s) => s.referrer ?? 'Direct / unknown'),
    actions: count(events.filter((e) => e.type === 'event'), actionName, 15),
    sessions: sessions
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, 150)
      .map(({ events: list, ...s }) => ({ ...s, path: list.filter((e) => e.type === 'pageview').map((e) => e.path) })),
  }
}

export default async function handler(req, res) {
  if (!currentAdmin(req)) return send(res, 401, { message: 'Please sign in again.' }, NO_STORE)
  if (req.method !== 'GET') return send(res, 405, { message: 'Method not allowed.' }, { Allow: 'GET' })

  const meta = { mode: visitsMode, retentionDays: RETENTION_DAYS }
  try {
    const visitor = query(req).get('visitor')
    if (visitor) {
      if (!/^[a-z0-9-]{8,64}$/i.test(visitor)) return send(res, 400, { message: 'Unknown visitor.' })
      const events = await listVisitEvents({ visitor })
      const sessions = toSessions(events).sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      return send(res, 200, { ...meta, visitor, sessions }, NO_STORE)
    }
    const days = Math.min(RETENTION_DAYS, Math.max(1, Number(query(req).get('days')) || 7))
    const events = await listVisitEvents({ since: new Date(Date.now() - days * 864e5) })
    return send(res, 200, { ...meta, days, ...summarize(events, days) }, NO_STORE)
  } catch (error) {
    console.error('[admin/visits]', error.message)
    return send(res, 500, { message: 'Could not read the visitor log.' }, NO_STORE)
  }
}
