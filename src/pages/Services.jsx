import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import FinalCTA from '../components/home/FinalCTA'
import { serviceMotifs } from '../components/services/ServiceMotifs'
import { services } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, EASE } from '../lib/motion'
import { trackEvent, events } from '../lib/analytics'

/**
 * Services hub. (Spec §6)
 *
 * One screen of services and nothing else: eight large tiles in an
 * asymmetric mosaic, each with its own small animated illustration and its
 * name. The tiles arrive scattered across the screen and settle into place.
 * A tile opens its service page, where the detail lives.
 */

/**
 * Where each tile sits in the 12-column mosaic on large screens, in the same
 * order as services.js. Websites leads as the large tile.
 */
const LAYOUT = {
  websites: 'lg:col-span-5 lg:row-span-2',
  'web-applications': 'lg:col-span-4',
  'ai-automation': 'lg:col-span-3 lg:row-span-2',
  ecommerce: 'lg:col-span-4',
  'data-analytics': 'lg:col-span-3',
  'technology-solutions': 'lg:col-span-3',
  'devops-mlops': 'lg:col-span-3',
  'digital-marketing-seo': 'lg:col-span-3',
}

/** Mosaic order: the big tiles first, so grid auto-placement packs them. */
const ORDER = ['websites', 'web-applications', 'ai-automation', 'ecommerce', 'data-analytics', 'technology-solutions', 'devops-mlops', 'digital-marketing-seo']

/** Fixed scatter offsets, so the server render and the browser agree. */
const SCATTER = [
  { x: -120, y: 60, rotate: -7 },
  { x: 80, y: -70, rotate: 5 },
  { x: 140, y: 40, rotate: 8 },
  { x: -40, y: 110, rotate: -4 },
  { x: -90, y: 120, rotate: 6 },
  { x: 30, y: 140, rotate: -8 },
  { x: 110, y: 90, rotate: 4 },
  { x: 160, y: 130, rotate: -6 },
]

/** Tall tiles stack the illustration over the title; one-row tiles sit them side by side. */
const TALL = ['websites', 'ai-automation']

const ServiceTile = ({ service, index, large }) => {
  const tall = TALL.includes(service.slug)
  const reduced = useReducedMotion()
  const Motif = serviceMotifs[service.slug]
  const Icon = service.icon
  const scatter = SCATTER[index % SCATTER.length]

  return (
    <motion.li
      className={`${LAYOUT[service.slug] ?? ''} ${large ? 'col-span-2' : ''}`}
      variants={
        reduced
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, x: scatter.x, y: scatter.y, rotate: scatter.rotate, scale: 0.92 },
              visible: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { duration: 0.9, ease: EASE } },
            }
      }
    >
      <Link
        to={`${routes.services}/${service.slug}`}
        onClick={() => trackEvent(events.SERVICE_CTA_CLICK, { service: service.slug, location: 'services_hub' })}
        className="group relative flex h-full min-h-[11rem] flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/70 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-accent-700/70 hover:bg-ink-850 hover:shadow-[0_24px_60px_-24px_rgb(var(--glow-accent)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 lg:min-h-0 lg:p-6"
      >
        {/* soft accent bloom that wakes up on hover */}
        <span
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-700/0 blur-3xl transition-colors duration-500 group-hover:bg-accent-700/25"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3">
          <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
            {String(services.indexOf(service) + 1).padStart(2, '0')}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-ink-700 text-silver-500 transition-all duration-500 group-hover:rotate-45 group-hover:border-accent-600 group-hover:bg-accent-600 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div
          className={`relative mx-auto my-3 flex min-h-0 w-full flex-1 items-center justify-center ${large ? 'max-w-md' : 'max-w-[15rem]'} ${
            tall ? '' : 'lg:absolute lg:bottom-5 lg:right-5 lg:top-16 lg:my-0 lg:w-[47%] lg:max-w-none'
          }`}
        >
          {Motif ? <Motif /> : <Icon className="h-12 w-12 text-accent-500" aria-hidden="true" />}
        </div>

        <div className={tall ? '' : 'lg:mt-auto lg:max-w-[46%]'}>
          <h2 className={`font-semibold leading-tight text-silver-100 ${large ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
            {service.title}
          </h2>
          {/* one-row tiles have no room for it beside the illustration */}
          <p className={`${tall ? '' : 'lg:hidden'} mt-1 max-h-0 overflow-hidden text-sm leading-snug text-silver-400 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100 group-focus-visible:max-h-16 group-focus-visible:opacity-100 [@media(hover:none)]:max-h-none [@media(hover:none)]:opacity-100`}>
            {service.shortDescription}
          </p>
        </div>
      </Link>
    </motion.li>
  )
}

const Services = () => {
  usePageMeta(pageMeta.services)
  const v = useMotionVariants()
  const ordered = ORDER.map((slug) => services.find((s) => s.slug === slug)).filter(Boolean)
  // Anything added to services.js later still shows, after the mosaic.
  const rest = services.filter((s) => !ORDER.includes(s.slug))

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950" aria-label="Services">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-accent-900/25 blur-[150px]"
          aria-hidden="true"
        />
        <div className="container relative flex flex-col pb-10 pt-24 lg:h-[100svh] lg:max-h-[64rem] lg:min-h-[44rem] lg:pb-8 lg:pt-[5.75rem]">
          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)} className="mb-5 flex items-baseline gap-4">
            <motion.p variants={v.fadeUp} className="eyebrow">
              Services
            </motion.p>
            <motion.h1 variants={v.riseIn} className="text-2xl leading-tight tracking-tight md:text-3xl">
              What we build.
            </motion.h1>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={v.stagger(0.07, 0.1)}
            className="grid flex-1 grid-cols-2 gap-3 lg:min-h-0 lg:grid-cols-12 lg:grid-rows-3 lg:gap-4"
          >
            {[...ordered, ...rest].map((service, i) => (
              <ServiceTile key={service.slug} service={service} index={i} large={service.slug === 'websites'} />
            ))}
          </motion.ul>
        </div>
      </section>

      <FinalCTA
        title="Not sure which service you need?"
        description="Most projects draw on more than one. Describe the problem in your own words and we will put the right combination together."
        location="services_hub"
      />
    </>
  )
}

export default Services
