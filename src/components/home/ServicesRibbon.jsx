import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { serviceMotifs } from '../services/ServiceMotifs'
import { services } from '../../data/services'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/**
 * What we build: the eight services as a ribbon of the animated illustrations
 * used on /services. It drifts on its own, and the visitor can take over at
 * any time: drag it, swipe it, scroll it sideways, or use the arrows. Any of
 * those pauses the drift for a moment. The list is laid out twice so the
 * ribbon loops without an end in either direction.
 */

const SPEED = 0.5 // px per frame while drifting
const RESUME_MS = 2500 // quiet time before drifting again

const ServiceCard = ({ service, hidden }) => {
  const Motif = serviceMotifs[service.slug]
  return (
    <Link
      to={`${routes.services}/${service.slug}`}
      draggable={false}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      onClick={(e) => {
        // A drag that ends on a card is not a click.
        if (e.currentTarget.closest('[data-dragged="true"]')) {
          e.preventDefault()
          return
        }
        trackEvent(events.SERVICE_CTA_CLICK, { service: service.slug, location: 'home_ribbon' })
      }}
      className="group relative flex h-64 w-64 shrink-0 select-none flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/70 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-accent-700/70 hover:bg-ink-850 sm:w-72"
    >
      <span className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-accent-700/0 blur-3xl transition-colors duration-500 group-hover:bg-accent-700/25" aria-hidden="true" />
      <span className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-ink-700 text-silver-500 transition-all duration-500 group-hover:rotate-45 group-hover:border-accent-600 group-hover:bg-accent-600 group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="flex min-h-0 flex-1 items-center justify-center py-2">{Motif && <Motif />}</div>
      <h3 className="text-lg font-semibold leading-tight text-silver-100">{service.title}</h3>
    </Link>
  )
}

const ServicesRibbon = () => {
  const v = useMotionVariants()
  const reduced = useReducedMotion()
  const trackRef = useRef(null)
  const pausedUntil = useRef(0)
  const hovering = useRef(false)
  // The drift is kept as a fraction: browsers round scrollLeft, so adding a
  // third of a pixel to it directly would never move it.
  const position = useRef(0)

  const hold = () => {
    pausedUntil.current = performance.now() + RESUME_MS
  }

  // Keep the scroll position inside the middle of the doubled list, so the
  // ribbon never reaches an end whichever way it is moved.
  const wrap = () => {
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    if (track.scrollLeft >= half) track.scrollLeft -= half
    else if (track.scrollLeft <= 0) track.scrollLeft += half
    position.current = track.scrollLeft
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    track.scrollLeft = 1
    position.current = track.scrollLeft
    let frame
    const tick = (now) => {
      if (!reduced && !hovering.current && now > pausedUntil.current && !document.hidden) {
        position.current += SPEED
        track.scrollLeft = position.current
        if (track.scrollLeft >= track.scrollWidth / 2) wrap()
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  /* drag with a mouse; touch and trackpads scroll natively */
  const drag = useRef(null)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      trackRef.current.setPointerCapture(e.pointerId)
      trackRef.current.dataset.dragged = 'true'
    }
    if (d.moved) {
      trackRef.current.scrollLeft = d.left - dx
      wrap()
      hold()
    }
  }
  const onPointerUp = () => {
    drag.current = null
    // Cleared after the click that ends a drag has been swallowed.
    setTimeout(() => trackRef.current && (trackRef.current.dataset.dragged = 'false'), 0)
  }

  const step = (dir) => {
    const track = trackRef.current
    const card = track.querySelector('a')
    hold()
    track.scrollBy({ left: dir * (card.offsetWidth + 16) * 2, behavior: reduced ? 'auto' : 'smooth' })
    setTimeout(wrap, 600)
  }

  return (
    <section className="overflow-hidden border-y border-ink-800 bg-ink-900 py-16 md:py-20" aria-label="What we build">
      <motion.div variants={v.fadeUp} {...revealOnce} className="container mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">What we build</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-4xl">Eight ways in. One team.</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link to={routes.services} className="mr-2 hidden items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 sm:inline-flex">
            All services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir)}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink-700 text-silver-400 transition-colors hover:border-accent-600 hover:text-silver-100"
              aria-label={dir < 0 ? 'Previous services' : 'Next services'}
            >
              {dir < 0 ? <ChevronLeft className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </motion.div>

      <div
        ref={trackRef}
        data-dragged="false"
        onPointerEnter={(e) => e.pointerType === 'mouse' && (hovering.current = true)}
        onPointerLeave={() => {
          hovering.current = false
          onPointerUp()
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={hold}
        onTouchStart={hold}
        onTouchMove={hold}
        onScroll={() => {
          const track = trackRef.current
          // Someone else moved it (finger, wheel, arrows): follow, and keep it looping.
          if (Math.abs(track.scrollLeft - position.current) > 2) wrap()
        }}
        onFocus={hold}
        className="flex cursor-grab gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Services, scroll sideways to see more"
      >
        {[0, 1].map((copy) =>
          services.map((service) => <ServiceCard key={`${copy}-${service.slug}`} service={service} hidden={copy === 1} />)
        )}
      </div>
    </section>
  )
}

export default ServicesRibbon
