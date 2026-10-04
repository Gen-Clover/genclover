/**
 * First-party visitor log, read in /admin → Visitors. (api/track.js)
 *
 * Anonymous by design:
 *   - a random visitor id in localStorage (`gc-vid`) and a session id in
 *     sessionStorage (`gc-sid`): neither is linked to a name or an email;
 *   - per page: when it was opened, how long it was actually in view, and how
 *     far down it was scrolled;
 *   - what was clicked: the visible label of the button or link, never what
 *     anyone typed. trackEvent() milestones (form submitted, demo booked) are
 *     forwarded too, with the same scrubbed payload Google Analytics gets.
 * Nothing is recorded in /admin, or for browsers that send Do Not Track or
 * Global Privacy Control. Location is added on the server from the connection.
 */

const VISITOR_KEY = 'gc-vid'
const SESSION_KEY = 'gc-sid'
const ENDPOINT = '/api/track'
const FLUSH_MS = 8000

let started = false
let queue = []
let visitor = null
let session = null
let page = null // { path, visibleMs, since, depth }

const optedOut = () =>
  typeof window === 'undefined' ||
  navigator.doNotTrack === '1' ||
  window.doNotTrack === '1' ||
  navigator.globalPrivacyControl === true ||
  window.location.pathname.startsWith('/admin')

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`

const stored = (storage, key) => {
  try {
    let id = storage.getItem(key)
    if (!id) {
      id = newId()
      storage.setItem(key, id)
    }
    return id
  } catch {
    return newId() // storage blocked: still count this page load
  }
}

const push = (type, data) => {
  if (!started || !page) return
  queue.push({ type, path: page.path, at: new Date().toISOString(), ...(data ? { data } : {}) })
  if (queue.length >= 20) flush()
}

const flush = () => {
  if (!queue.length) return
  const body = JSON.stringify({ visitor, session, referrer: document.referrer || null, events: queue })
  queue = []
  try {
    const blob = new Blob([body], { type: 'application/json' })
    if (navigator.sendBeacon?.(ENDPOINT, blob)) return
  } catch {
    /* fall through to fetch */
  }
  fetch(ENDPOINT, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
}

/* ------------------------------------------------------- time and depth */

const visibleNow = () => document.visibilityState === 'visible'

const settleTime = () => {
  if (page?.since != null) {
    page.visibleMs += performance.now() - page.since
    page.since = null
  }
}

const closePage = () => {
  if (!page) return
  settleTime()
  push('leave', { seconds: Math.round(page.visibleMs / 1000), depth: page.depth })
}

const onScroll = () => {
  if (!page) return
  const max = document.documentElement.scrollHeight - window.innerHeight
  const depth = max > 0 ? Math.round((window.scrollY / max) * 100) : 100
  if (depth > page.depth) page.depth = Math.min(100, depth)
}

/* --------------------------------------------------------------- clicks */

/** A tile's heading names it better than all of its text run together. */
const labelOf = (el) =>
  (el.getAttribute('aria-label') || el.querySelector('h1, h2, h3, h4')?.textContent || el.textContent || el.getAttribute('title') || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)

const onClick = (e) => {
  const el = e.target.closest?.('a, button, [role="button"], [data-tick]')
  if (!el || el.closest('form input, form textarea')) return
  const label = labelOf(el)
  if (!label) return
  const href = el.getAttribute('href')
  push('event', { name: 'click', label, ...(href ? { to: href.slice(0, 120) } : {}) })
}

/* ---------------------------------------------------------------- API */

export const startVisitorLog = () => {
  if (started || optedOut()) return
  started = true
  visitor = stored(localStorage, VISITOR_KEY)
  session = stored(sessionStorage, SESSION_KEY)

  document.addEventListener('visibilitychange', () => {
    if (!page) return
    if (visibleNow()) page.since = performance.now()
    else {
      settleTime()
      flush()
    }
  })
  window.addEventListener('pagehide', () => {
    closePage()
    flush()
  })
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClick, { capture: true })
  setInterval(flush, FLUSH_MS)
}

/** Called on every route change. */
export const logPageview = (path) => {
  if (!started) return
  if (path.startsWith('/admin')) {
    closePage()
    page = null
    return
  }
  if (page?.path === path) return
  closePage()
  page = { path, visibleMs: 0, since: visibleNow() ? performance.now() : null, depth: 0 }
  push('pageview')
  requestAnimationFrame(onScroll)
}

/** trackEvent() milestones, already scrubbed of personal fields. */
export const logVisitEvent = (name, payload) => {
  if (!started) return
  const data = { name }
  for (const [k, v] of Object.entries(payload ?? {}).slice(0, 6)) {
    if (['string', 'number', 'boolean'].includes(typeof v)) data[k] = v
  }
  push('event', data)
}

