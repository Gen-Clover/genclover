import { useId } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Globe2, Layers, Briefcase, Pause, Play } from 'lucide-react'
import Button from '../components/ui/Button'
import { PETAL_PATH } from '../components/brand/Logo'
import { brandPillars, getIndustry } from '../data/taxonomy'
import { publishedProjects } from '../data/projects'
import { contact, routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'
import { useAutoAdvance } from '../lib/useAutoAdvance'

/**
 * About. Two screens, then the shared footer:
 *   1. The name as a clover: four ideas for leaves, the facts as its roots.
 *   2. The story: who Gen Clover is and how it works, as one piece of writing.
 * Everything else (services, process, proof) lives on its own page, so it is
 * not repeated here.
 */

/* Petal order follows the mark: upper-right, lower-right, lower-left, upper-left. */
const PETAL_ANGLES = [45, 135, 225, 315]
/** The petal each pillar lives on, clockwise from the upper-left. */
const PILLAR_PETAL = [3, 0, 1, 2]
/** Where each pillar's card sits around the clover on large screens. */
const PILLAR_PLACE = [
  'lg:col-start-1 lg:row-start-1 lg:text-right',
  'lg:col-start-3 lg:row-start-1',
  'lg:col-start-3 lg:row-start-2',
  'lg:col-start-1 lg:row-start-2 lg:text-right',
]

/**
 * The name and the facts, as one picture. Four leaves (the ideas every project
 * draws on) grow from one stem; the red travels leaf to leaf and its idea
 * lights up beside it. Below the ground, the stem's roots are the facts the
 * company stands on.
 */
const CloverTree = ({ facts }) => {
  const { ref, active, choose, stopped, toggle, reduced } = useAutoAdvance(brandPillars.length, { interval: 3000 })
  const uid = useId().replace(/:/g, '')

  return (
    <div ref={ref}>
      <div className="grid items-center gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-2 lg:gap-x-10">
        {/* the clover and its stem */}
        <div className="order-first sm:col-span-2 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <svg viewBox="-80 -80 160 220" className="mx-auto w-full max-w-[12rem] lg:max-w-[16rem]" aria-hidden="true">
            <defs>
              <linearGradient id={`s-${uid}`} x1="0.1" y1="0" x2="0.75" y2="1">
                <stop offset="0%" stopColor="var(--clover-1)" />
                <stop offset="100%" stopColor="var(--clover-3)" />
              </linearGradient>
            </defs>
            <path d="M0 30 C 3 70, -4 105, 0 138" className="fill-none stroke-silver-600" strokeWidth="4" strokeLinecap="round" />
            {PETAL_ANGLES.map((angle, petal) => {
              const pillar = PILLAR_PETAL.indexOf(petal)
              const on = pillar === active
              return (
                <g key={angle} transform={`rotate(${angle})`}>
                  <path d={PETAL_PATH} fill={`url(#s-${uid})`} />
                  {/* the red, passing from leaf to leaf */}
                  <path
                    d={PETAL_PATH}
                    className="fill-accent-500"
                    style={{
                      opacity: on ? 1 : 0,
                      transform: on ? 'scale(1.06)' : 'scale(1)',
                      transformOrigin: '0 0',
                      transition: reduced ? 'none' : 'opacity 700ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                </g>
              )
            })}
            <circle r="5" className="fill-ink-900" />
          </svg>
        </div>

        {/* the four ideas, each beside its leaf */}
        {brandPillars.map((pillar, i) => {
          const on = i === active
          return (
            <button
              key={pillar.label}
              type="button"
              data-tick
              onClick={() => choose(i)}
              aria-pressed={on}
              className={`${PILLAR_PLACE[i]} rounded-2xl border p-5 text-left transition-all duration-500 ${
                on
                  ? 'border-accent-700/70 bg-accent-950/30 shadow-[0_0_40px_-12px_rgb(var(--glow-accent)/0.6)]'
                  : 'border-ink-800 bg-ink-950/60 hover:border-ink-600'
              }`}
            >
              <span className={`font-display text-[11px] font-semibold uppercase tracking-brand ${on ? 'text-accent-400' : 'text-silver-500'}`}>
                {String(i + 1).padStart(2, '0')} · {pillar.label}
              </span>
              <span className={`mt-2 block text-sm leading-relaxed transition-colors ${on ? 'text-silver-100' : 'text-silver-500'}`}>
                {pillar.description}
              </span>
            </button>
          )
        })}
      </div>

      {!reduced && (
        <div className="mt-2 flex justify-center">
          <button type="button" onClick={toggle} className="inline-flex min-h-[44px] items-center gap-2 text-xs text-silver-500 hover:text-silver-200">
            {stopped ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            {stopped ? 'Play' : 'Pause'}
          </button>
        </div>
      )}

      {/* the ground, and the roots below it */}
      <div className="relative mt-2">
        <div className="mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-silver-600 to-transparent" aria-hidden="true" />
        <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="hidden h-12 w-full md:block" aria-hidden="true">
          {[100, 300, 500, 700].map((x, i) => (
            <motion.path
              key={x}
              d={`M400 0 C 400 28, ${x} 28, ${x} 60`}
              className="fill-none stroke-ink-600"
              strokeWidth="2"
              strokeDasharray="4 6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, duration: 1 }}
            />
          ))}
        </svg>
        <p className="mb-3 mt-4 text-center font-display text-[11px] uppercase tracking-brand text-silver-600 md:sr-only">What we stand on</p>
        <dl className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {facts.map((fact) => {
            const Icon = fact.icon
            return (
              <div key={fact.label} data-tick className="rounded-xl border border-ink-800 bg-ink-950/60 p-4">
                <dt className="flex items-center gap-2 font-display text-[11px] uppercase tracking-brand text-silver-500">
                  <Icon className="h-4 w-4 text-accent-500" aria-hidden="true" />
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-silver-200">{fact.value}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    </div>
  )
}

const About = () => {
  usePageMeta(pageMeta.about)
  const v = useMotionVariants()

  const sectors = [...new Set(publishedProjects.map((p) => p.industry))]
    .filter((id) => id !== 'other')
    .map((id) => getIndustry(id)?.label)
    .filter(Boolean)

  const facts = [
    { icon: MapPin, label: 'Based in', value: contact.location },
    { icon: Globe2, label: 'Working with', value: 'Clients in India and internationally, across time zones' },
    {
      icon: Layers,
      label: 'What we build',
      value: 'Websites, web applications, e-commerce, AI and automation, data platforms, cloud infrastructure and search',
    },
    { icon: Briefcase, label: 'Delivered for', value: sectors.join(', ') },
  ]

  return (
    <>
      {/* -------------------------- screen 1: the name, and what it stands on */}
      <section className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950" aria-label="The name">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container relative flex flex-col justify-center pb-14 pt-24 lg:min-h-[100svh] lg:pb-10 lg:pt-[5.5rem]">
          <motion.div initial="hidden" animate="visible" variants={v.fadeUp} className="mx-auto mb-6 max-w-2xl text-center">
            <p className="eyebrow">About Gen Clover</p>
            <h1 className="mt-3 text-3xl leading-tight tracking-tight md:text-4xl xl:text-5xl">Four leaves, one stem.</h1>
            <p className="mt-3 text-base leading-relaxed text-silver-400">
              <span className="text-silver-200">Gen</span> is for generation: building what comes next.{' '}
              <span className="text-silver-200">Clover</span> is for growth: four ideas from a single stem, in every
              project we take on.
            </p>
          </motion.div>
          <CloverTree facts={facts} />
          <a
            href={`mailto:${contact.email}`}
            className="mx-auto mt-5 inline-flex items-center gap-2.5 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {contact.email}
          </a>
        </div>
      </section>

      {/* ------------------------------------------------ screen 2: story */}
      <section className="relative isolate overflow-hidden bg-ink-900" aria-label="Our story">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 top-10 hidden h-[40rem] w-[40rem] rounded-full bg-accent-900/20 blur-[140px] lg:block"
          aria-hidden="true"
        />
        <div className="container relative flex flex-col justify-center py-16 lg:min-h-[100svh]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={v.stagger(0.08)}>
            <motion.div variants={v.fadeUp} className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent-600" aria-hidden="true" />
              <p className="eyebrow">Our story</p>
            </motion.div>

            <div className="mt-7 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              <motion.h2
                variants={v.fadeUp}
                className="text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]"
              >
                We build the systems businesses
                <span className="text-accent-500"> actually run on.</span>
              </motion.h2>

              <motion.div
                variants={v.fadeUp}
                className="space-y-5 text-base leading-relaxed text-silver-400 md:text-lg"
              >
                <p>
                  <span className="text-silver-100">
                    Gen Clover is a technology and digital product company based in Chandigarh,
                    India.
                  </span>{' '}
                  We design and build websites, applications, AI and data platforms for businesses
                  in India and around the world.
                </p>
                <p>
                  Our work rarely starts with a technology. It starts with a problem: reports
                  nobody trusts, processes run on spreadsheets and email, incidents that take hours
                  to trace, a website that no longer says what the business does. We work out what
                  actually needs to change, then build the system that changes it, properly.
                </p>
                <p>
                  And we stay. The products we build are meant to be run, extended and improved for
                  years, so we write code the next engineer can read, document the decisions behind
                  it, and keep watching it after it goes live.
                </p>
              </motion.div>
            </div>

            <motion.div variants={v.fadeUp} className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Button to={routes.work} size="lg">
                See what we have built
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to={routes.startProject} size="lg" variant="secondary">
                Start a Project
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
