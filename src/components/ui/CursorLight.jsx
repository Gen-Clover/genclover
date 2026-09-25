import { useEffect, useRef, useState } from 'react'

/**
 * A soft light that follows the mouse across the whole site: red light on the
 * dark theme, a rose-to-peach tint on the light theme. Styling lives in
 * `.cursor-light` in index.css; this only tracks the pointer.
 *
 * Mouse only (hidden on touch screens by CSS), never intercepts clicks
 * (pointer-events: none), and fades out when the pointer leaves the window.
 */
const CursorLight = () => {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    let frame = 0
    let x = 0
    let y = 0

    const apply = () => {
      frame = 0
      ref.current?.style.setProperty('--mx', `${x}px`)
      ref.current?.style.setProperty('--my', `${y}px`)
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      if (!frame) frame = requestAnimationFrame(apply)
      setOn(true)
    }
    const onLeave = (e) => {
      if (!e.relatedTarget) setOn(false)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className="cursor-light" data-on={on} aria-hidden="true" />
}

export default CursorLight
