import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Scroll behaviour on navigation.
 *
 * React Router's built-in <ScrollRestoration> only works with a data router
 * (createBrowserRouter). We use BrowserRouter, so this implements the same
 * contract by hand:
 *
 *   PUSH    — a new page. Start at the top.
 *   POP     — back or forward. Return the visitor to exactly where they were,
 *             which is the whole point of pressing back.
 *   REPLACE — same page, different state (the Work hub's ?category= filter).
 *             Do not move. Yanking someone to the top when they tick a filter
 *             is the single most irritating thing an SPA can do.
 *
 * `history.scrollRestoration` is set to 'manual' so the browser's own attempt
 * does not race ours. Its automatic restoration fires before React has rendered
 * the new route, so it lands on a page that is still the wrong height.
 *
 * Positions are keyed by `location.key`, which React Router assigns per history
 * entry. That is more precise than keying by URL: visiting /work twice creates
 * two entries with two remembered positions, which is correct.
 */

const positions = new Map()

/**
 * Restoring needs the page to have rendered tall enough to scroll to Y, and to
 * STAY that tall. Lazy route chunks, scroll-reveal sections and the Work hub's
 * AnimatePresence grid all settle over several frames, and a page that briefly
 * shrinks makes the browser clamp the position we just set. So we re-apply
 * across a short window rather than setting it once.
 */
const RESTORE_WINDOW_MS = 1500
/** Frames the position must hold before we accept it and stop. */
const STABLE_FRAMES = 4

/**
 * True while we are driving the scroll ourselves. The recorder below must not
 * write during a restore, or the intermediate (clamped, too-short) values would
 * overwrite the very offset we are trying to return to.
 */
let restoring = false

const ScrollRestoration = () => {
  const location = useLocation()
  const navigationType = useNavigationType()
  const rafRef = useRef(null)

  // Take over from the browser once, and hand it back on unmount.
  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return undefined
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  /**
   * Track the scroll position for the current history entry.
   *
   * Deliberately NOT saved in this effect's cleanup. Cleanup runs during the
   * commit that swaps in the next route, so by then `window.scrollY` already
   * reflects the new page and would overwrite the position we actually want.
   * Instead the position is recorded continuously while scrolling, and again on
   * the interaction that is about to navigate, while the old page is still the
   * one on screen.
   */
  useEffect(() => {
    const key = location.key
    let ticking = false

    const record = () => {
      ticking = false
      if (restoring) return
      positions.set(key, window.scrollY)
    }

    // rAF-throttled: writing on every scroll event is a guaranteed jank source.
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(record)
    }

    // Snapshot immediately on the gesture that may navigate. Covers the case
    // where someone scrolls and clicks within the same frame, before the
    // throttled scroll recorder has run.
    const snapshot = () => {
      if (!restoring) positions.set(key, window.scrollY)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', snapshot, { capture: true, passive: true })
    window.addEventListener('keydown', snapshot, { capture: true, passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', snapshot, { capture: true })
      window.removeEventListener('keydown', snapshot, { capture: true })
    }
  }, [location.key])

  // Apply the right scroll position for the new location.
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      restoring = false
    }

    // An explicit #hash always wins — the visitor asked for that element.
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return undefined
      }
    }

    // A filter or other in-place state change: leave the visitor where they are.
    if (navigationType === 'REPLACE') return undefined

    if (navigationType === 'POP') {
      const saved = positions.get(location.key)

      if (typeof saved === 'number' && saved > 0) {
        const startedAt = performance.now()
        let stable = 0
        restoring = true

        const attempt = () => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const target = Math.min(saved, Math.max(0, maxScroll))

          if (Math.abs(window.scrollY - target) > 1) {
            // 'instant' overrides the page's CSS scroll-behavior: smooth. Without it
            // every rAF restarts a smooth animation that never reaches the target.
            window.scrollTo({ top: target, left: 0, behavior: 'instant' })
            stable = 0
          } else if (target >= saved - 1) {
            // Only settled once we actually reached the saved offset, not merely
            // the current (possibly still-growing) page bottom.
            stable += 1
          } else {
            stable = 0
          }

          if (stable >= STABLE_FRAMES || performance.now() - startedAt > RESTORE_WINDOW_MS) {
            stop()
            return
          }
          rafRef.current = requestAnimationFrame(attempt)
        }

        attempt()
        return stop
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    return undefined
  }, [location.key, location.hash, navigationType])

  return null
}

export default ScrollRestoration
