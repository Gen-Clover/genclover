import { useEffect, useRef, useState } from 'react'

/**
 * Companion to the `.mobile-carousel` class in index.css.
 *
 * On phones that class turns a card grid into a horizontal swipe row. This
 * hook adds what the row needs only while it is a row:
 *   - `props`: keyboard focus and a name, so the row can be scrolled with the
 *     arrow keys (desktop grids get neither, so no extra Tab stop);
 *   - `dots`: a position indicator under the row. Tapping a dot scrolls to
 *     that card.
 *
 * Usage:
 *   const swipe = useSwipeRow(items.length, 'Our services')
 *   <ul ref={swipe.ref} {...swipe.props} className="mobile-carousel …">…</ul>
 *   {swipe.dots}
 */

const PHONE = '(max-width: 767px)'

const usePhone = () => {
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.(PHONE)
    if (!mq) return undefined
    const update = () => setPhone(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return phone
}

/** Horizontal offset of a card inside the row, measured from the row's padding edge. */
const offsetOf = (row, item) => {
  const pad = parseFloat(getComputedStyle(row).paddingLeft) || 0
  return item.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft - pad
}

export const useSwipeRow = (count, label) => {
  const ref = useRef(null)
  const phone = usePhone()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const row = ref.current
    if (!phone || !row) return undefined
    let frame = 0
    const measure = () => {
      frame = 0
      const items = [...row.children]
      if (!items.length) return
      // At the far end the last card may never reach the left edge.
      if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 4) {
        setIndex(items.length - 1)
        return
      }
      let best = 0
      let distance = Infinity
      items.forEach((item, i) => {
        const d = Math.abs(offsetOf(row, item) - row.scrollLeft)
        if (d < distance) {
          distance = d
          best = i
        }
      })
      setIndex(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    row.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      row.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [phone])

  const goTo = (i) => {
    const row = ref.current
    const item = row?.children[i]
    if (!item) return
    row.scrollTo({ left: offsetOf(row, item), behavior: 'smooth' })
  }

  const props = phone ? { tabIndex: 0, 'aria-label': `${label}. Swipe or use the arrow keys for more.` } : {}

  const dots =
    phone && count > 1 ? (
      <div className="mt-3 flex items-center justify-center gap-0.5" aria-label={`${label} position`} role="group">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show item ${i + 1} of ${count}`}
            aria-current={i === index ? 'true' : undefined}
            className="grid h-8 w-6 place-items-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-4 bg-accent-500' : 'w-1.5 bg-ink-600'
              }`}
            />
          </button>
        ))}
      </div>
    ) : null

  return { ref, props, dots }
}
