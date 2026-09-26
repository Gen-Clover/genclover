import { useEffect, useId, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Globe2, Layers, Briefcase, Pause, Play } from 'lucide-react'
import Button from '../components/ui/Button'
import { CloverMark, PETAL_PATH } from '../components/brand/Logo'
import { brandPillars, getIndustry } from '../data/taxonomy'
import { publishedProjects } from '../data/projects'
import { contact, routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * About. Two screens, then the shared footer:
 *   1. The story: who Gen Clover is and how it works, as one piece of writing.
 *   2. The name, told through the clover itself, beside the facts at a glance.
 * Everything else (services, process, proof) lives on its own page, so it is
 * not repeated here.
 */

/* Petal order follows the mark: upper-right, lower-right, lower-left, upper-left. */
const PETAL_ANGLES = [45, 135, 225, 315]
/** Which pillar each petal carries, reading clockwise from the upper-left. */
const PETAL_FOR_PILLAR = [3, 0, 1, 2]

const CloverStory = () => {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  // Picking a leaf or pressing pause stops the rotation for good. A tap on iOS
  // never focuses the button, so focus cannot be what pauses it.
  const [stopped, setStopped] = useState(false)
  const rootRef = useRef(null)
  const tabsRef = useRef([])
  const inView = useInView(rootRef, { amount: 0.4 })
  const uid = useId().replace(/:/g, '')

  const playing = !reduced && !stopped && !hovered && inView

  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % brandPillars.length), 2800)
    return () => clearInterval(id)
  }, [playing])

  const choose = (i) => {
    setStopped(true)
    setActive(i)
  }

  const onKeyDown = (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    const next = (active + keys[e.key] + brandPillars.length) % brandPillars.length
    choose(next)
    tabsRef.current[next]?.focus()
  }

  const pillar = brandPillars[active]

  return (
    <div
      ref={rootRef}
      className="grid items-center gap-8 sm:grid-cols-[13rem_1fr]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="-80 -80 160 160" className="mx-auto w-full max-w-[10rem] sm:max-w-[13rem]" aria-hidden="true">
        <defs>
          <linearGradient id={`s-${uid}`} x1="0.1" y1="0" x2="0.75" y2="1">
            <stop offset="0%" stopColor="var(--clover-1)" />
            <stop offset="100%" stopColor="var(--clover-3)" />
          </linearGradient>
          <linearGradient id={`a-${uid}`} x1="0.1" y1="0" x2="0.75" y2="1">
            <stop offset="0%" stopColor="#FF5F64" />
            <stop offset="100%" stopColor="#8E0F14" />
          </linearGradient>
        </defs>
        <g>
          {PETAL_ANGLES.map((angle, petal) => {
            const pillarIndex = PETAL_FOR_PILLAR.indexOf(petal)
            const on = pillarIndex === active
            return (
              <path
                key={angle}
                d={PETAL_PATH}
                transform={`rotate(${angle})`}
                fill={on ? `url(#a-${uid})` : `url(#s-${uid})`}
                className={on ? '' : 'opacity-90'}
                style={{ transition: 'fill 400ms' }}
              />
            )
          })}
        </g>
      </svg>

      <div>
        <div
          role="tablist"
          aria-label="The four leaves"
          onKeyDown={onKeyDown}
          className="flex flex-wrap gap-2"
        >
          {brandPillars.map((p, i) => (
            <button
              key={p.label}
              ref={(el) => (tabsRef.current[i] = el)}
              type="button"
              role="tab"
              id={`${uid}-leaf-${i}`}
              aria-selected={i === active}
              aria-controls={`${uid}-leaf-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => choose(i)}
              className={`min-h-[44px] rounded-md border px-3 font-display text-[11px] font-semibold uppercase tracking-brand transition-colors ${
                i === active
                  ? 'border-accent-600 bg-accent-950/50 text-accent-300'
                  : 'border-ink-700 text-silver-500 hover:text-silver-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div
          id={`${uid}-leaf-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-leaf-${active}`}
          className="mt-5 grid"
        >
          {/* All descriptions share one cell, so the box keeps the height of the
              longest and nothing below it moves as the leaves rotate. */}
          {brandPillars.map((p, i) => (
            <motion.p
              key={p.label}
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, y: i === active || reduced ? 0 : 6 }}
              transition={{ duration: 0.25 }}
              aria-hidden={i !== active}
              className={`[grid-area:1/1] text-base leading-relaxed text-silver-300 ${
                i === active ? '' : 'invisible'
              }`}
            >
              {p.description}
            </motion.p>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setStopped((s) => !s)}
            className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-md text-xs text-silver-500 transition-colors hover:text-silver-200"
          >
            {stopped ? (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {stopped ? 'Play' : 'Pause'}
          </button>
        )}
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
      {/* ------------------------------------------------ screen 1: story */}
      <section className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 top-10 hidden h-[40rem] w-[40rem] rounded-full bg-accent-900/20 blur-[140px] lg:block"
          aria-hidden="true"
        />
        <div className="container relative flex flex-col justify-center pb-12 pt-28 md:pt-32 lg:min-h-[100svh]">
          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.08)}>
            <motion.div variants={v.fadeUp} className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent-600" aria-hidden="true" />
              <p className="eyebrow">About Gen Clover</p>
            </motion.div>

            <div className="mt-7 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              <motion.h1
                variants={v.fadeUp}
                className="text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]"
              >
                We build the systems businesses
                <span className="text-accent-500"> actually run on.</span>
              </motion.h1>

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

      {/* ----------------------------------- screen 2: the name + at a glance */}
      <section className="bg-ink-900">
        <div className="container flex flex-col justify-center py-14 lg:min-h-[100svh]">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <motion.div variants={v.fadeUp} {...revealOnce}>
              <p className="eyebrow">The name</p>
              <h2 className="mt-4 text-3xl leading-tight md:text-4xl">Four leaves, one stem.</h2>
              <p className="mt-5 max-w-prose text-base leading-relaxed text-silver-400">
                <span className="text-silver-200">Gen</span> is for generation: building what comes
                next, and generating something new rather than assembling what already exists.{' '}
                <span className="text-silver-200">Clover</span> is for growth. Its four leaves grow
                from a single stem, the way every project we take on draws on the same four ideas.
              </p>
              <div className="mt-10">
                <CloverStory />
              </div>
            </motion.div>

            <motion.aside
              variants={v.fadeUp}
              {...revealOnce}
              className="self-center rounded-2xl border border-ink-700 bg-ink-950 p-7 md:p-8"
              aria-label="Gen Clover at a glance"
            >
              <div className="flex items-center gap-3">
                <CloverMark className="h-8 w-8" />
                <p className="font-display text-xs font-semibold uppercase tracking-brand text-silver-300">
                  At a glance
                </p>
              </div>
              <dl className="mt-7 space-y-6">
                {facts.map((fact) => {
                  const Icon = fact.icon
                  return (
                    <div key={fact.label} className="relative pl-8">
                      <dt className="font-display text-[11px] uppercase tracking-brand text-silver-500">
                        <Icon
                          className="absolute left-0 top-0.5 h-4 w-4 text-accent-500"
                          aria-hidden="true"
                        />
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-silver-200">{fact.value}</dd>
                    </div>
                  )
                })}
              </dl>
              <a
                href={`mailto:${contact.email}`}
                className="mt-8 flex items-center gap-2.5 border-t border-ink-800 pt-6 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {contact.email}
              </a>
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
