import { useEffect, useId, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Globe2, Layers, Briefcase } from 'lucide-react'
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
  const [paused, setPaused] = useState(false)
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    if (reduced || paused) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % brandPillars.length), 2800)
    return () => clearInterval(id)
  }, [reduced, paused])

  const pillar = brandPillars[active]

  return (
    <div
      className="grid items-center gap-8 sm:grid-cols-[13rem_1fr]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <svg viewBox="-80 -80 160 160" className="w-full max-w-[13rem]" aria-hidden="true">
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
        <div role="tablist" aria-label="The four leaves" className="flex flex-wrap gap-2">
          {brandPillars.map((p, i) => (
            <button
              key={p.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              onFocus={() => setPaused(true)}
              className={`rounded-md border px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-brand transition-colors ${
                i === active
                  ? 'border-accent-600 bg-accent-950/50 text-accent-300'
                  : 'border-ink-700 text-silver-500 hover:text-silver-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-5 min-h-[4.5rem]" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={pillar.label}
              initial={{ opacity: 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-base leading-relaxed text-silver-300"
            >
              {pillar.description}
            </motion.p>
          </AnimatePresence>
        </div>
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
        <div className="container relative flex flex-col justify-center pb-16 pt-32 md:pt-36 lg:min-h-[100svh]">
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
        <div className="container flex flex-col justify-center py-20 lg:min-h-[100svh]">
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
                    <div key={fact.label} className="flex gap-4">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                      <div>
                        <dt className="font-display text-[11px] uppercase tracking-brand text-silver-500">
                          {fact.label}
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed text-silver-200">{fact.value}</dd>
                      </div>
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
