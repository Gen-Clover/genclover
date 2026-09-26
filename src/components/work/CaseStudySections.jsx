import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { Check, ArrowRight, ShieldCheck, Sparkles, Pause, Play, Maximize2 } from 'lucide-react'
import { SectionHeader, Section } from '../ui/Section'
import ProjectVisual from '../ui/ProjectVisual'
import DiagramPreview from './DiagramPreview'
import { useMotionVariants, revealOnce, EASE } from '../../lib/motion'
import { useAutoAdvance } from '../../lib/useAutoAdvance'
import { routes } from '../../data/site'

/**
 * Case-study sections for the project page. (Spec §7.3)
 *
 * The page tells each thing once:
 *   Story          challenge → approach → outcome, one chapter each
 *   HowItWorks     the architecture diagram beside a step-by-step walkthrough
 *   InsideTheSystem the parts and the safeguards, as tabs
 *   BuiltWith      the stack and the services applied
 *   Roadmap, ClosingStatement
 *
 * Every section is data-driven and renders only when the project carries that
 * content, so a lightly documented project degrades gracefully. Each one
 * prefers the detailed case-study version of a piece of content and falls
 * back to the short project copy, never showing both.
 *
 * All motion is routed through useMotionVariants / useReducedMotion, so a
 * visitor with prefers-reduced-motion gets the same content without movement.
 */

/* ---------------------------------------------------------------- counter */

/** Counts the number inside a stat up from zero the first time it is seen. */
const CountUp = ({ value }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const match = String(value).match(/^([^\d]*)([\d,.]+)(.*)$/)
  const [shown, setShown] = useState(match && !reduced ? `${match[1]}0${match[3]}` : String(value))

  useEffect(() => {
    if (!match || reduced || !inView) return undefined
    const [, prefix, digits, suffix] = match
    const target = Number(digits.replace(/,/g, ''))
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
    const grouped = digits.includes(',')
    const controls = animate(0, target, {
      duration: Math.min(1.6, 0.6 + target / 400),
      ease: EASE,
      onUpdate: (n) => {
        const num = grouped
          ? Math.round(n).toLocaleString('en')
          : n.toFixed(decimals)
        setShown(`${prefix}${num}${suffix}`)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value])

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  )
}

/** Key figures about the system as built. Never performance claims. */
export const HeroStats = ({ stats }) => {
  const v = useMotionVariants()
  if (!stats?.length) return null
  return (
    <motion.ul
      variants={v.stagger(0.08, 0.35)}
      initial="hidden"
      animate="visible"
      className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.li key={stat.label} variants={v.fadeUp} className="bg-ink-950/90 p-5 md:p-6">
          <p className="font-display text-3xl font-bold leading-none text-silver-100 md:text-4xl">
            <CountUp value={stat.value} />
            {stat.unit && <span className="ml-1 text-base font-medium text-silver-400">{stat.unit}</span>}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-silver-400 md:text-sm">{stat.label}</p>
        </motion.li>
      ))}
    </motion.ul>
  )
}

/* ------------------------------------------------------------------ story */

/** Before / after as a switch: the list swaps in place rather than sitting side by side. */
const BeforeAfterSwitch = ({ data }) => {
  const [side, setSide] = useState('after')
  const reduced = useReducedMotion()
  const sides = [
    { id: 'before', label: data.beforeLabel ?? 'Before', items: data.before },
    { id: 'after', label: data.afterLabel ?? 'After', items: data.after },
  ]
  const current = sides.find((s) => s.id === side)

  return (
    <div className="mt-8 rounded-xl border border-ink-800 bg-ink-950 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[11px] font-semibold uppercase tracking-eyebrow text-silver-500">
          {data.eyebrow ?? 'Where it started, and where it is now'}
        </p>
        <div role="tablist" aria-label="Compare before and after" className="relative flex rounded-lg border border-ink-700 bg-ink-900 p-1">
          {sides.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={side === s.id}
              onClick={() => setSide(s.id)}
              className={`relative min-h-[36px] rounded-md px-3.5 text-xs font-semibold transition-colors ${
                side === s.id ? 'text-silver-100' : 'text-silver-500 hover:text-silver-300'
              }`}
            >
              {side === s.id && (
                <motion.span
                  layoutId="before-after-pill"
                  className={`absolute inset-0 rounded-md ${s.id === 'after' ? 'bg-accent-600/80' : 'bg-ink-700'}`}
                  transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={side}
          role="tabpanel"
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: side === 'after' ? 16 : -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: side === 'after' ? -16 : 16 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mt-5 grid gap-3 sm:grid-cols-2"
        >
          {current.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-silver-300">
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${side === 'after' ? 'bg-accent-500' : 'bg-ink-500'}`}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      {data.footnote && <p className="mt-5 text-xs leading-relaxed text-silver-500">{data.footnote}</p>}
    </div>
  )
}

const Chapter = ({ chapter, index, onVisible }) => {
  const v = useMotionVariants()
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onVisible(index)
  }, [inView, index, onVisible])

  const Bullet = chapter.id === 'approach' ? Check : null

  return (
    <article ref={ref} id={`chapter-${chapter.id}`} className="scroll-mt-28 border-t border-ink-800 py-10 first:border-t-0 first:pt-0 md:py-14">
      <motion.div variants={v.fadeUp} {...revealOnce}>
        <p className="flex items-center gap-3 font-display text-xs font-semibold tracking-brand">
          <span className="text-silver-500">{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px w-6 bg-accent-600" aria-hidden="true" />
          <span className="uppercase text-accent-400">{chapter.label}</span>
        </p>
        <h2 className="mt-4 max-w-3xl text-2xl leading-tight md:text-3xl">{chapter.headline ?? chapter.label}</h2>
        {chapter.body && (
          <p className="mt-4 max-w-prose text-base leading-relaxed text-silver-400 md:text-lg">{chapter.body}</p>
        )}
      </motion.div>

      {chapter.points?.length > 0 && (
        <motion.ul
          variants={v.stagger(0.07)}
          {...revealOnce}
          className={`mt-8 grid gap-4 ${chapter.points.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
        >
          {chapter.points.map((point) => (
            <motion.li key={point.title} variants={v.fadeUp} className="surface p-5 md:p-6">
              {Bullet ? (
                <Bullet className="h-4 w-4 text-accent-500" aria-hidden="true" />
              ) : (
                <span className="block h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
              )}
              <h3 className="mt-3.5 text-base font-semibold text-silver-100">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{point.text}</p>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {chapter.outcomes?.length > 0 && (
        <motion.div variants={v.fadeUp} {...revealOnce} className="mt-8 rounded-xl border border-accent-800/50 bg-accent-950/20 p-5 md:p-6">
          <p className="eyebrow">What changed</p>
          <ul className="mt-4 space-y-3">
            {chapter.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-sm leading-relaxed text-silver-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                {o}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {chapter.beforeAfter?.before?.length > 0 && <BeforeAfterSwitch data={chapter.beforeAfter} />}

      {chapter.footnote && <p className="mt-6 max-w-prose text-sm leading-relaxed text-silver-500">{chapter.footnote}</p>}
    </article>
  )
}

/**
 * Challenge → approach → outcome. On large screens a chapter index stays
 * pinned beside the text, marks the chapter being read and fills as the
 * visitor scrolls through the story.
 */
export const Story = ({ project, cs }) => {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const [current, setCurrent] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  // The detailed version when there is one, the short project copy otherwise.
  const pick = (detail, prose) => detail?.intro ?? (detail?.points?.length ? null : prose)
  const chapters = [
    {
      id: 'challenge',
      label: 'Challenge',
      headline: cs?.challengeDetail?.headline,
      body: pick(cs?.challengeDetail, project.challenge),
      points: cs?.challengeDetail?.points,
      footnote: cs?.challengeDetail?.footnote,
    },
    {
      id: 'approach',
      label: 'Approach',
      headline: cs?.approachDetail?.headline,
      body: pick(cs?.approachDetail, project.approach),
      points: cs?.approachDetail?.points,
    },
    {
      id: 'outcome',
      label: 'Outcome',
      headline: cs?.atAGlance?.headline,
      body: pick(cs?.atAGlance, project.solution),
      points: cs?.atAGlance?.points,
      outcomes: project.outcomes,
      beforeAfter: cs?.beforeAfter,
    },
  ].filter((c) => c.body || c.points?.length || c.outcomes?.length)

  if (!chapters.length) return null

  return (
    <Section muted>
      <div ref={ref} className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-16">
        <nav aria-label="Case study chapters" className="hidden lg:block">
          <div className="sticky top-28">
            <p className="eyebrow">The story</p>
            <div className="relative mt-6 pl-5">
              <span className="absolute bottom-1 left-0 top-1 w-px bg-ink-700" aria-hidden="true" />
              <motion.span
                className="absolute bottom-1 left-0 top-1 w-px origin-top bg-accent-500"
                style={reduced ? { scaleY: 1 } : { scaleY: progress }}
                aria-hidden="true"
              />
              <ol className="space-y-5">
                {chapters.map((c, i) => (
                  <li key={c.id}>
                    <a
                      href={`#chapter-${c.id}`}
                      aria-current={current === i ? 'step' : undefined}
                      className={`group flex items-baseline gap-3 text-sm font-medium transition-colors ${
                        current === i ? 'text-silver-100' : 'text-silver-500 hover:text-silver-300'
                      }`}
                    >
                      <span className={`font-display text-xs tracking-brand ${current === i ? 'text-accent-400' : 'text-silver-600'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </nav>

        <div>
          {chapters.map((c, i) => (
            <Chapter key={c.id} chapter={c} index={i} onVisible={setCurrent} />
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ----------------------------------------------------------- how it works */

/**
 * The architecture diagram, with a button beneath it that opens it full size.
 * The button sits outside the diagram so it never covers part of it.
 */
const DiagramFrame = ({ project, footnote }) => {
  const [open, setOpen] = useState(null)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(null), [])
  return (
    <div ref={ref}>
      <ProjectVisual project={project} priority aspect="aspect-[16/9]" />
      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="text-xs leading-relaxed text-silver-500">{footnote}</p>
        <button
          type="button"
          onClick={() => setOpen('modal')}
          aria-label={`Enlarge the ${project.title} architecture diagram`}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-3 text-xs font-medium text-silver-300 transition-colors hover:border-accent-600 hover:text-accent-400"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Enlarge
        </button>
      </div>
      <DiagramPreview project={project} mode={open} anchorRef={ref} onClose={close} />
    </div>
  )
}

/** Steps that play themselves, with a progress bar on the current one. */
const StepPlayer = ({ steps, heading, caption }) => {
  const INTERVAL = 3400
  const { ref, active, choose, playing, stopped, toggle, reduced, holding } = useAutoAdvance(steps.length, {
    interval: INTERVAL,
    hold: 9000,
    amount: 0.3,
  })

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-4">
        {heading && <h3 className="text-lg font-semibold text-silver-100">{heading}</h3>}
        <p className="shrink-0 font-display text-xs tracking-brand text-silver-500">
          {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </p>
      </div>

      <ol className="mt-5 space-y-2">
        {steps.map((step, i) => {
          const isActive = i === active
          const done = i < active
          return (
            <li key={step.title}>
              <button
                type="button"
                onClick={() => choose(i)}
                aria-expanded={isActive}
                className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'border-accent-700/70 bg-accent-950/30'
                    : 'border-ink-800 bg-ink-950 hover:border-ink-600'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-display text-[11px] font-semibold transition-colors ${
                      isActive
                        ? 'border-accent-500 bg-accent-600 text-white'
                        : done
                          ? 'border-accent-700 bg-accent-950 text-accent-300'
                          : 'border-ink-600 bg-ink-900 text-silver-500'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-sm font-semibold ${isActive ? 'text-silver-100' : 'text-silver-300'}`}>
                    {step.title}
                  </span>
                </span>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key="text"
                      initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="block overflow-hidden"
                    >
                      <span className="block pl-10 pt-2 text-sm leading-relaxed text-silver-400">{step.text}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && playing && !holding && (
                  <motion.span
                    key={`bar-${active}`}
                    className="absolute inset-x-0 bottom-0 block h-0.5 origin-left bg-accent-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <div className="mt-3 flex items-center justify-between gap-4">
        {caption ? <p className="text-xs leading-relaxed text-silver-500">{caption}</p> : <span />}
        {!reduced && (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-md px-2 text-xs text-silver-500 transition-colors hover:text-silver-200"
          >
            {stopped ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            {stopped ? 'Play' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * The system in one place: the diagram, and beside it one run through the
 * system, step by step. Uses the case study's walkthrough when it has one,
 * else its delivery flow.
 */
export const HowItWorks = ({ project, cs }) => {
  const v = useMotionVariants()
  const steps = cs?.walkthrough?.steps?.length
    ? cs.walkthrough.steps
    : (cs?.flow ?? []).map((f) => ({ title: f.title, text: f.detail }))

  return (
    <Section>
      <SectionHeader
        eyebrow="How it works"
        title={cs?.architecture?.headline ?? 'How the system fits together.'}
        description={cs?.architecture?.intro}
      />
      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <motion.div variants={v.fadeUp} {...revealOnce} className="lg:sticky lg:top-28 lg:self-start">
          <DiagramFrame project={project} footnote={cs?.architecture?.footnote} />
        </motion.div>
        {steps.length > 0 && (
          <motion.div variants={v.fadeUp} {...revealOnce}>
            <StepPlayer
              steps={steps}
              heading={cs?.walkthrough?.headline ?? 'One run, step by step.'}
              caption={cs?.walkthrough?.caption}
            />
          </motion.div>
        )}
      </div>
    </Section>
  )
}

/* ------------------------------------------------------- inside the system */

const ComponentCards = ({ items }) => {
  const v = useMotionVariants()
  return (
    <motion.ul variants={v.stagger(0.06)} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2">
      {items.map((item, i) => (
        <motion.li key={item.name} variants={v.fadeUp} className="surface flex flex-col p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-ink-700 bg-ink-900 font-display text-xs font-semibold text-accent-400">
              {item.index ?? String(i + 1)}
            </span>
            <h4 className="text-base font-semibold text-silver-100">{item.name}</h4>
          </div>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-silver-400">{item.what}</p>
          {item.guardrail && (
            <p className="mt-4 border-t border-ink-800 pt-3 text-sm leading-relaxed text-silver-300">
              <span className="mr-2 font-display text-[10px] font-semibold uppercase tracking-eyebrow text-accent-400">
                {item.guardrailLabel ?? 'Guardrail'}
              </span>
              {item.guardrail}
            </p>
          )}
        </motion.li>
      ))}
    </motion.ul>
  )
}

const SafeguardCards = ({ points }) => {
  const v = useMotionVariants()
  return (
    <motion.ul
      variants={v.stagger(0.05)}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {points.map((point) => (
        <motion.li key={point.title} variants={v.fadeUp} className="surface p-5 md:p-6">
          <ShieldCheck className="h-4 w-4 text-accent-500" aria-hidden="true" />
          <h4 className="mt-3.5 text-base font-semibold text-silver-100">{point.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-silver-400">{point.text}</p>
        </motion.li>
      ))}
    </motion.ul>
  )
}

const FeatureList = ({ items }) => {
  const v = useMotionVariants()
  return (
    <motion.ul variants={v.stagger(0.04)} initial="hidden" animate="visible" className="grid gap-3 md:grid-cols-2">
      {items.map((feature) => (
        <motion.li
          key={feature}
          variants={v.fadeUp}
          className="tile flex items-start gap-3.5 rounded-lg border border-ink-800 bg-ink-900 px-5 py-4"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
          <span className="text-sm leading-relaxed text-silver-300">{feature}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}

/**
 * The parts of the system and the controls around them, as tabs. The plain
 * feature list is only used when a project has no component breakdown, since
 * the two describe the same things.
 */
export const InsideTheSystem = ({ project, cs }) => {
  const reduced = useReducedMotion()
  const tabs = [
    cs?.components?.items?.length && {
      id: 'parts',
      label: cs.components.eyebrow ?? 'The parts',
      headline: cs.components.headline,
      intro: cs.components.intro,
      render: () => <ComponentCards items={cs.components.items} />,
    },
    !cs?.components?.items?.length &&
      project.features?.length && {
        id: 'features',
        label: 'Key capabilities',
        headline: 'What it does.',
        render: () => <FeatureList items={project.features} />,
      },
    cs?.safeguards?.points?.length && {
      id: 'safeguards',
      label: cs.safeguards.eyebrow ?? 'Safeguards',
      headline: cs.safeguards.headline,
      intro: cs.safeguards.intro,
      render: () => <SafeguardCards points={cs.safeguards.points} />,
    },
  ].filter(Boolean)
  const [activeId, setActiveId] = useState(tabs[0]?.id)
  if (!tabs.length) return null
  const tab = tabs.find((t) => t.id === activeId) ?? tabs[0]

  return (
    <Section muted>
      <SectionHeader
        eyebrow="Inside the system"
        title={tabs.length > 1 ? 'What it is made of, and what keeps it safe.' : tab.headline}
      />

      {tabs.length > 1 && (
        <div role="tablist" aria-label="Inside the system" className="mb-8 flex flex-wrap gap-1 border-b border-ink-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`system-tab-${t.id}`}
              aria-selected={t.id === tab.id}
              aria-controls="system-panel"
              onClick={() => setActiveId(t.id)}
              className={`relative min-h-[44px] px-4 text-sm font-semibold transition-colors ${
                t.id === tab.id ? 'text-silver-100' : 'text-silver-500 hover:text-silver-300'
              }`}
            >
              {t.label}
              {t.id === tab.id && (
                <motion.span
                  layoutId="system-tab-underline"
                  className="absolute inset-x-2 -bottom-px h-0.5 bg-accent-500"
                  transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div id="system-panel" role={tabs.length > 1 ? 'tabpanel' : undefined} aria-labelledby={tabs.length > 1 ? `system-tab-${tab.id}` : undefined}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.length > 1 && tab.headline && (
              <h3 className="text-xl font-semibold text-silver-100 md:text-2xl">{tab.headline}</h3>
            )}
            {tab.intro && <p className="mt-3 max-w-prose text-sm leading-relaxed text-silver-400 md:text-base">{tab.intro}</p>}
            <div className={tabs.length > 1 && (tab.headline || tab.intro) ? 'mt-7' : ''}>{tab.render()}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------- built with */

/** The stack by layer, and the services the project drew on. */
export const BuiltWith = ({ project, cs, services }) => {
  const v = useMotionVariants()
  const groups = cs?.techStack?.groups?.length
    ? cs.techStack.groups
    : project.technologies?.length
      ? [{ title: 'Technology', items: project.technologies }]
      : []
  if (!groups.length && !services.length) return null

  return (
    <Section>
      <SectionHeader
        eyebrow="Built with"
        title={cs?.techStack?.headline ?? 'What it runs on.'}
        description={cs?.techStack?.intro}
      />
      {groups.length > 0 && (
        <motion.dl
          variants={v.stagger(0.05)}
          {...revealOnce}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {groups.map((group) => (
            <motion.div key={group.title} variants={v.fadeUp} className="surface p-5">
              <dt className="font-display text-[11px] font-semibold uppercase tracking-eyebrow text-silver-500">
                {group.title}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span key={item} className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-xs text-silver-300">
                    {item}
                  </span>
                ))}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      )}

      {services.length > 0 && (
        <motion.div variants={v.fadeUp} {...revealOnce} className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-display text-[11px] font-semibold uppercase tracking-eyebrow text-silver-500">
            Services applied
          </span>
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`${routes.services}/${service.slug}`}
              className="inline-flex min-h-[36px] items-center rounded-md border border-ink-700 bg-ink-900 px-3 text-xs text-silver-300 transition-colors hover:border-accent-700/60 hover:text-silver-100"
            >
              {service.title}
            </Link>
          ))}
        </motion.div>
      )}
    </Section>
  )
}

/* ----------------------------------------------------------------- roadmap */

export const Roadmap = ({ data }) => {
  const v = useMotionVariants()
  if (!data?.groups?.length) return null

  return (
    <Section muted>
      <SectionHeader eyebrow={data.eyebrow ?? 'Roadmap'} title={data.headline} description={data.intro} />
      <motion.div variants={v.stagger(0.07)} {...revealOnce} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data.groups.map((group) => (
          <motion.div key={group.title} variants={v.fadeUp} className="surface p-6 md:p-7">
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

/* ------------------------------------------------------------- closing line */

/** The closing line, revealed word by word. */
export const ClosingStatement = ({ text }) => {
  const reduced = useReducedMotion()
  if (!text) return null
  const words = text.split(' ')

  return (
    <Section>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.045 } } }}
        className="mx-auto max-w-3xl text-center font-display text-xl leading-relaxed text-silver-200 md:text-3xl"
      >
        {words.map((word, i) => (
          <span key={i}>
            <motion.span
              variants={{
                hidden: reduced ? { opacity: 1 } : { opacity: 0.12, y: 6 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </motion.p>
    </Section>
  )
}
