import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Shared behaviour for anything that steps through items on its own: the home
 * process rail, the About clover and the case-study walkthrough.
 *
 *   - Advances every `interval` ms, but only while at least `amount` of it is
 *     on screen, and never for visitors who prefer reduced motion.
 *   - Picking an item (`choose`) holds it for `hold` ms so it can be read, then
 *     the sequence carries on from there.
 *   - `toggle` is the pause button: the only way to stop it for good (WCAG 2.2.2).
 *
 * Attach `ref` to the element whose visibility should gate playback.
 */
export const useAutoAdvance = (count, { interval = 2000, hold = 6000, amount = 0.4 } = {}) => {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { amount })
  const [active, setActive] = useState(0)
  const [stopped, setStopped] = useState(false)
  const [holdUntil, setHoldUntil] = useState(0)

  const playing = !reduced && !stopped && inView && count > 1

  useEffect(() => {
    if (!playing) return undefined
    const next = () => setActive((i) => (i + 1) % count)
    let id
    const first = setTimeout(() => {
      next()
      id = setInterval(next, interval)
    }, Math.max(interval, holdUntil - Date.now()))
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [playing, holdUntil, interval, count])

  const choose = useCallback(
    (i) => {
      setHoldUntil(Date.now() + hold)
      setActive(i)
    },
    [hold]
  )

  const toggle = useCallback(() => setStopped((s) => !s), [])

  return { ref, active, choose, playing, stopped, toggle, reduced, holding: holdUntil > Date.now() }
}
