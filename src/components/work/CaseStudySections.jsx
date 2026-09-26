import { useRef } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { Check, ArrowRight, ArrowDown, ShieldCheck, Sparkles } from 'lucide-react'
import { SectionHeader, Section } from '../ui/Section'
import { useMotionVariants, revealOnce, EASE } from '../../lib/motion'

/**
 * Deep case-study sections.
 *
 * Every section is data-driven and renders only when the project carries that
 * content, so a lightly documented project degrades to the short format while a
 * fully documented engagement gets the long one. Nothing here is project
 * specific — the shapes live in `project.caseStudy` in data/projects.js.
 *
 * All motion is routed through useMotionVariants / useReducedMotion, so a
 * visitor with prefers-reduced-motion gets the same content without movement.
 */

/* ------------------------------------------------------------- flow strip */

/**
 * The numbered loop that runs under a case-study hero:
 * 01 Detect -> 02 Diagnose -> 03 Fix -> 04 Review -> 05 Hand off
 * Connectors draw left to right as the strip enters view.
 */
export const FlowStrip = ({ flow }) => {
  const reduced = useReducedMotion()
  if (!flow?.length) return null

  return (
    <div className="border-y border-ink-800 bg-ink-900/60">
      <div className="container py-7">
        <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0">
          {flow.map((step, i) => (
            <li key={step.number} className="flex min-w-0 flex-1 items-start gap-3 sm:gap-0">
              <motion.div
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                className="min-w-0 sm:pr-4"
              >
                <div className="flex items-baseline gap-2">
                  {/* accent-400, not 500: at 11px the mid red only reaches
                      4.18:1 on the strip background, just under AA. */}
                  <span className="font-display text-[11px] font-semibold tracking-brand text-accent-400">
                    {step.number}
                  </span>
                  <span className="text-sm font-semibold text-silver-100">{step.title}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-silver-500">{step.detail}</p>
              </motion.div>

              {i < flow.length - 1 && (
                <span
                  className="relative mt-2.5 hidden h-px flex-1 overflow-hidden bg-ink-700 sm:block"
                  aria-hidden="true"
                >
                  <motion.span
                    className="absolute inset-0 block origin-left bg-accent-600"
                    initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 + 0.2 }}
                  />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ stats */

/** Key figures about the system as built. Never performance claims. */
export const StatRow = ({ stats }) => {
  const v = useMotionVariants()
  if (!stats?.length) return null

  return (
    <motion.ul
      variants={v.stagger(0.07)}
      {...revealOnce}
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.li key={stat.label} variants={v.fadeUp} className="surface p-5">
          <p className="font-display text-2xl font-bold leading-none text-silver-100 md:text-3xl">
            {stat.value}
            {stat.unit && (
              <span className="ml-1 text-base font-medium text-silver-400">{stat.unit}</span>
            )}
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-silver-400">{stat.label}</p>
        </motion.li>
      ))}
    </motion.ul>
  )
}

/* ------------------------------------------------------------- at a glance */

export const AtAGlance = ({ data }) => {
  const v = useMotionVariants()
  if (!data?.points?.length) return null

  return (
    <Section muted>
      <SectionHeader eyebrow="At a glance" title={data.headline} description={data.intro} />
      <motion.ol variants={v.stagger(0.07)} {...revealOnce} className="grid gap-5 md:grid-cols-3">
        {data.points.map((point, i) => (
          <motion.li key={point.title} variants={v.fadeUp} className="surface p-7">
            <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-base font-semibold text-silver-100">{point.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-silver-400">{point.text}</p>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  )
}

/* ------------------------------------------------- generic points section */

/**
 * Used for the challenge breakdown, the approach, safeguards and lessons.
 * `icon` picks the bullet treatment: 'dot' | 'check' | 'shield'.
 */
export const PointsSection = ({
  eyebrow,
  title,
  description,
  points,
  columns = 3,
  icon = 'dot',
  muted = false,
  footnote,
}) => {
  const v = useMotionVariants()
  if (!points?.length) return null

  const Bullet = icon === 'check' ? Check : icon === 'shield' ? ShieldCheck : null
  const cols =
    columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'

  return (
    <Section muted={muted}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <motion.ul variants={v.stagger(0.06)} {...revealOnce} className={`grid gap-5 ${cols}`}>
        {points.map((point) => (
          <motion.li key={point.title} variants={v.fadeUp} className="surface p-6 md:p-7">
            {Bullet ? (
              <Bullet className="h-4 w-4 text-accent-500" aria-hidden="true" />
            ) : (
              <span className="block h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
            )}
            <h3 className="mt-4 text-base font-semibold text-silver-100">{point.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-silver-400">{point.text}</p>
          </motion.li>
        ))}
      </motion.ul>
      {footnote && (
        <p className="mt-8 max-w-prose text-sm leading-relaxed text-silver-500">{footnote}</p>
      )}
    </Section>
  )
}

/* ------------------------------------------------------ before / after */

export const BeforeAfter = ({ data }) => {
  const v = useMotionVariants()
  if (!data?.before?.length) return null

  return (
    <Section muted>
      <SectionHeader eyebrow={data.eyebrow ?? 'Where it started'} title={data.headline} description={data.intro} />
      <motion.div variants={v.stagger(0.1)} {...revealOnce} className="grid gap-5 lg:grid-cols-2">
        {[
          { label: data.beforeLabel ?? 'Before', items: data.before, tone: 'before' },
          { label: data.afterLabel ?? 'After', items: data.after, tone: 'after' },
        ].map((col) => (
          <motion.div
            key={col.label}
            variants={v.fadeUp}
            className={`surface p-7 ${col.tone === 'after' ? 'border-accent-800/60' : ''}`}
          >
            <p className={col.tone === 'after' ? 'eyebrow' : 'font-display text-[11px] font-semibold uppercase tracking-eyebrow text-silver-500'}>
              {col.label}
            </p>
            <ul className="mt-5 space-y-3.5">
              {col.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-silver-300">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      col.tone === 'after' ? 'bg-accent-500' : 'bg-ink-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
      {data.footnote && (
        <p className="mt-8 text-sm leading-relaxed text-silver-500">{data.footnote}</p>
      )}
    </Section>
  )
}

/* ------------------------------------------------------------ architecture */

/**
 * Layered architecture diagram.
 *
 * Drawn from data rather than as a hand-authored SVG per project, so every case
 * study gets the same diagram language. Layers reveal top to bottom and the
 * connector between them draws as you reach it, which is what makes it read as
 * a flow rather than a stack of boxes.
 */
export const ArchitectureFlow = ({ data }) => {
  const v = useMotionVariants()
  const reduced = useReducedMotion()
  if (!data?.layers?.length) return null

  return (
    <Section>
      <SectionHeader eyebrow="Architecture" title={data.headline} description={data.intro} />

      {/* A group, not an image: the layers and nodes are real text that screen
          readers should read, top to bottom, in the order data flows. */}
      <div
        className="relative"
        role="group"
        aria-label={data.alt ?? `Architecture, from ${data.layers.map((l) => l.label).join(' to ')}`}
      >
        {data.layers.map((layer, li) => (
          <div key={layer.label}>
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: EASE }}
              className={`surface overflow-hidden p-6 md:p-7 ${
                layer.emphasis ? 'border-accent-800/60' : ''
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="eyebrow">{layer.label}</p>
                {layer.note && (
                  <p className="font-display text-[11px] tracking-wide text-silver-500">
                    {layer.note}
                  </p>
                )}
              </div>

              <motion.ul
                variants={v.stagger(0.05)}
                {...revealOnce}
                className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {layer.nodes.map((node) => (
                  <motion.li
                    key={node.title}
                    variants={v.fadeUp}
                    className="rounded-lg border border-ink-700 bg-ink-900 p-4"
                  >
                    <p className="text-sm font-semibold text-silver-100">{node.title}</p>
                    {node.lines?.map((line) => (
                      <p key={line} className="mt-1 text-xs leading-relaxed text-silver-500">
                        {line}
                      </p>
                    ))}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {li < data.layers.length - 1 && (
              <div className="relative flex h-12 items-center justify-center" aria-hidden="true">
                <span className="absolute inset-y-0 w-px overflow-hidden bg-ink-700">
                  <motion.span
                    className="absolute inset-0 block origin-top bg-accent-600"
                    initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                </span>
                <motion.span
                  initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.3 }}
                  className="relative grid h-6 w-6 place-items-center rounded-full border border-ink-700 bg-ink-950"
                >
                  <ArrowDown className="h-3 w-3 text-accent-500" aria-hidden="true" />
                </motion.span>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.footnote && (
        <p className="mt-8 max-w-prose text-sm leading-relaxed text-silver-500">{data.footnote}</p>
      )}
    </Section>
  )
}

/* ------------------------------------------------------------- walkthrough */

/**
 * One run, start to finish. A scroll-linked rail fills as the visitor moves
 * down the steps, so the sequence reads as a single journey.
 */
export const Walkthrough = ({ data }) => {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  if (!data?.steps?.length) return null

  return (
    <Section muted>
      <SectionHeader
        eyebrow={data.eyebrow ?? 'One run, end to end'}
        title={data.headline}
        description={data.intro}
      />

      <div ref={ref} className="relative">
        <div
          className="absolute bottom-0 left-[0.9375rem] top-2 w-px bg-ink-700 md:left-[1.1875rem]"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-accent-500 to-accent-700"
            style={reduced ? { scaleY: 1 } : { scaleY: progress }}
          />
        </div>

        <ol className="space-y-5">
          {data.steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px 0px -15% 0px' }}
              transition={{ duration: 0.5, ease: EASE }}
              className="group relative flex gap-5 md:gap-7"
            >
              <span className="relative z-10 shrink-0">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-ink-700 bg-ink-900 font-display text-[11px] font-semibold text-accent-400 transition-colors group-hover:border-accent-600 md:h-10 md:w-10 md:text-xs">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <div className="min-w-0 flex-1 pb-1">
                <h3 className="text-base font-semibold text-silver-100 md:text-lg">{step.title}</h3>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-silver-400">
                  {step.text}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {data.caption && (
        <p className="mt-8 text-xs leading-relaxed text-silver-500">{data.caption}</p>
      )}
    </Section>
  )
}

/* -------------------------------------------------------- component table */

/**
 * The parts that make up the system — agents, services, modules — each with the
 * guardrail that keeps it honest. The guardrail line is the interesting part:
 * it is what separates a demo from something that can run unattended.
 */
export const ComponentList = ({ data }) => {
  const v = useMotionVariants()
  if (!data?.items?.length) return null

  return (
    <Section>
      <SectionHeader
        eyebrow={data.eyebrow ?? 'The parts'}
        title={data.headline}
        description={data.intro}
      />
      <motion.ol variants={v.stagger(0.06)} {...revealOnce} className="space-y-4">
        {data.items.map((item, i) => (
          <motion.li
            key={item.name}
            variants={v.fadeUp}
            className="surface surface-hover grid gap-4 p-6 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-7 md:p-7"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-700 bg-ink-900 font-display text-xs font-semibold text-accent-400">
              {item.index ?? String(i + 1)}
            </span>
            <div>
              <h3 className="text-base font-semibold text-silver-100">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{item.what}</p>
            </div>
            {item.guardrail && (
              <div className="rounded-lg border border-ink-800 bg-ink-900 p-4">
                <p className="font-display text-[11px] font-semibold uppercase tracking-eyebrow text-accent-400">
                  {item.guardrailLabel ?? 'Guardrail'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{item.guardrail}</p>
              </div>
            )}
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  )
}

/* ----------------------------------------------------------------- roadmap */

export const Roadmap = ({ data }) => {
  const v = useMotionVariants()
  if (!data?.groups?.length) return null

  return (
    <Section muted>
      <SectionHeader
        eyebrow={data.eyebrow ?? 'Roadmap'}
        title={data.headline}
        description={data.intro}
      />
      <motion.div
        variants={v.stagger(0.07)}
        {...revealOnce}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {data.groups.map((group) => (
          <motion.div key={group.title} variants={v.fadeUp} className="surface p-7">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-accent-500" aria-hidden="true" />
              <h3 className="text-base font-semibold text-silver-100">{group.title}</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-silver-400">
                  <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-silver-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

/* -------------------------------------------------------------- tech stack */

export const TechStack = ({ data }) => {
  const v = useMotionVariants()
  if (!data?.groups?.length) return null

  return (
    <Section>
      <SectionHeader
        eyebrow="Technology"
        title={data.headline ?? 'What it runs on.'}
        description={data.intro}
      />
      <motion.dl variants={v.stagger(0.05)} {...revealOnce} className="grid gap-4 md:grid-cols-2">
        {data.groups.map((group) => (
          <motion.div key={group.title} variants={v.fadeUp} className="surface p-6">
            <dt className="text-sm font-semibold text-silver-100">{group.title}</dt>
            <dd className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[11px] text-silver-400"
                >
                  {item}
                </span>
              ))}
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </Section>
  )
}

/* ------------------------------------------------------------- closing line */

export const ClosingStatement = ({ text }) => {
  const v = useMotionVariants()
  if (!text) return null

  return (
    <Section>
      <motion.p
        variants={v.fadeUp}
        {...revealOnce}
        className="mx-auto max-w-3xl text-center font-display text-xl leading-relaxed text-silver-200 md:text-2xl"
      >
        {text}
      </motion.p>
    </Section>
  )
}
