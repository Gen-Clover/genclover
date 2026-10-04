import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, MousePointerClick } from 'lucide-react'
import FinalCTA from '../components/home/FinalCTA'
import { Skyline, SKYLINE } from '../components/industries/IndustrySkyline'
import { industryPages } from '../data/industries'
import { getService } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants } from '../lib/motion'
import { canHover } from '../lib/pointer'

/**
 * Industries hub. (Spec §13) No invented client claims.
 *
 * The sectors as a city: one illustrated building per industry on a shared
 * street. Hover or focus a building (first tap on touch) and it lights up
 * while a card shows how we approach that sector; click it to open the
 * sector page. Until someone interacts, the city gives itself a slow tour.
 */

const TOUR_MS = 3200

const SectorCard = ({ industry }) => {
  const services = industry.services.map(getService).filter(Boolean).slice(0, 4)
  return (
    <motion.div
      key={industry.id}
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="eyebrow">{industry.label}</p>
      <h2 className="mt-2 text-xl font-semibold leading-snug text-silver-100 md:text-2xl">{industry.headline}</h2>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-silver-400">{industry.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {services.map((service) => (
          <Link
            key={service.slug}
            to={`${routes.services}/${service.slug}`}
            className="rounded border border-ink-700 bg-ink-950/70 px-2 py-0.5 text-[11px] text-silver-300 transition-colors hover:border-accent-700/60 hover:text-silver-100"
          >
            {service.title}
          </Link>
        ))}
        <Link
          to={`${routes.industries}/${industry.id}`}
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent-400 hover:text-accent-300"
        >
          Explore
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  )
}

const Industries = () => {
  usePageMeta(pageMeta.industries)
  const v = useMotionVariants()
  const reduced = useReducedMotion()
  const navigate = useNavigate()

  const byId = useMemo(() => Object.fromEntries(industryPages.map((i) => [i.id, i])), [])
  const labels = useMemo(() => Object.fromEntries(industryPages.map((i) => [i.id, i.label])), [])
  const order = SKYLINE.map((b) => b.id).filter((id) => byId[id])

  const [active, setActive] = useState(null) // lit building
  const [shown, setShown] = useState(order[0]) // sector in the card
  const [touched, setTouched] = useState(false) // stops the tour
  const streetRef = useRef(null)

  // On narrow screens the city scrolls sideways: bring the lit building into view.
  useEffect(() => {
    const street = streetRef.current
    if (!active || !street || street.scrollWidth <= street.clientWidth) return
    const building = street.querySelector(`[href="${routes.industries}/${active}"]`)
    if (!building) return
    const s = street.getBoundingClientRect()
    const b = building.getBoundingClientRect()
    street.scrollBy({ left: b.left + b.width / 2 - (s.left + s.width / 2), behavior: reduced ? 'auto' : 'smooth' })
  }, [active, reduced])

  const light = (id) => {
    setActive(id)
    if (id) setShown(id)
  }

  // The tour: until anyone interacts, light each building in turn.
  useEffect(() => {
    if (touched || reduced) return undefined
    let i = 0
    const start = setTimeout(() => light(order[0]), 1600)
    const timer = setInterval(() => {
      i = (i + 1) % order.length
      light(order[i])
    }, TOUR_MS)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, reduced])

  const enter = (id) => {
    setTouched(true)
    light(id)
  }
  const leave = () => setActive(null)

  // First tap on touch lights a building; the next opens its page.
  const activate = (event, id) => {
    event.preventDefault()
    if (!canHover() && active !== id) {
      enter(id)
      return
    }
    navigate(`${routes.industries}/${id}`)
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950" aria-label="Industries">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-accent-900/20 blur-[150px]"
          aria-hidden="true"
        />
        <div className="container relative flex flex-col pb-8 pt-24 lg:min-h-[100svh] lg:pt-[5.75rem]">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-12">
            <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)}>
              <motion.p variants={v.fadeUp} className="eyebrow">
                Industries
              </motion.p>
              <motion.h1 variants={v.riseIn} className="mt-3 text-4xl leading-[1.05] tracking-tight xl:text-5xl">
                Who we build for.
              </motion.h1>
              <motion.p variants={v.fadeUp} className="mt-3 flex items-center gap-2 text-sm text-silver-500">
                <MousePointerClick className="h-4 w-4 text-accent-500" aria-hidden="true" />
                <span className="[@media(hover:none)]:hidden">Hover a building to visit a sector.</span>
                <span className="[@media(hover:hover)]:hidden">Tap a building to visit a sector.</span>
              </motion.p>
            </motion.div>

            <div className="surface surface-static min-h-[10.5rem] p-5" aria-live="polite">
              <AnimatePresence mode="wait">
                {shown && byId[shown] && <SectorCard key={shown} industry={byId[shown]} />}
              </AnimatePresence>
            </div>
          </div>

          {/* the city; on narrow screens it scrolls sideways */}
          <div ref={streetRef} className="-mx-4 mt-6 flex-1 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:flex lg:items-end">
            <div className="min-w-[900px] lg:min-w-0 lg:w-full">
              <Skyline active={active} labels={labels} onEnter={enter} onLeave={leave} onActivate={activate} />
            </div>
          </div>

          {/* the same sectors as plain controls, for keyboards and quick scanning */}
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="All sectors">
            {order.map((id) => (
              <li key={id}>
                <Link
                  to={`${routes.industries}/${id}`}
                  onMouseEnter={() => enter(id)}
                  onMouseLeave={leave}
                  onFocus={() => enter(id)}
                  onBlur={leave}
                  className={`inline-flex min-h-[36px] items-center rounded-full border px-3.5 text-xs transition-colors ${
                    active === id
                      ? 'border-accent-600 bg-accent-600 text-white'
                      : 'border-ink-700 bg-ink-900/60 text-silver-400 hover:text-silver-100'
                  }`}
                >
                  {labels[id]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={routes.startProject}
                className="inline-flex min-h-[36px] items-center rounded-full border border-dashed border-ink-600 px-3.5 text-xs text-silver-500 transition-colors hover:border-accent-700 hover:text-silver-200"
              >
                Not listed? Tell us about yours
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <FinalCTA
        title="Your sector has its own rules. We will learn them."
        description="Tell us the constraints you work under, from regulation to seasonality to legacy systems, and we will show you how we would design around them."
        location="industries_hub"
      />
    </>
  )
}

export default Industries
