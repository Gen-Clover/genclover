import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, FileText, Flag, Plus, Users, Wrench } from 'lucide-react'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import {
  processSteps,
  carePlans,
  CARE_PRICING_NOTE,
  rhythm,
  groundRules,
  startingPoints,
  processFaqs,
} from '../data/process'
import { PRICING_STATEMENT } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * How We Work. (Spec §11, §12)
 *
 * The homepage already shows the seven stages as a rail. This page goes a
 * level deeper instead of repeating it: a stage explorer (what we do, what we
 * need from you, what you get, and the gate before the next stage), how clients
 * stay informed, the rules that hold on every engagement, ways to start,
 * continuous care and common questions.
 */

/* ------------------------------------------------------ stage explorer */

const StageExplorer = () => {
  const [active, setActive] = useState(0)
  const tabsRef = useRef([])
  const reduced = useReducedMotion()
  const step = processSteps[active]
  const Icon = step.icon

  const onKeyDown = (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    const next = (active + keys[e.key] + processSteps.length) % processSteps.length
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  const columns = [
    { title: 'What we do', items: step.weDo, icon: Wrench },
    { title: 'What we need from you', items: step.youBring, icon: Users },
    { title: 'What you get', items: step.youGet, icon: FileText },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10">
      {/* Stage list: horizontal scroll on small screens, vertical on large */}
      <div
        role="tablist"
        aria-label="Delivery stages"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {processSteps.map((s, i) => {
          const selected = i === active
          return (
            <button
              key={s.number}
              ref={(el) => (tabsRef.current[i] = el)}
              type="button"
              role="tab"
              id={`stage-tab-${i}`}
              aria-selected={selected}
              aria-controls="stage-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group relative flex shrink-0 items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors lg:w-full ${
                selected
                  ? 'border-accent-700/70 bg-accent-950/40'
                  : 'border-transparent hover:border-ink-700 hover:bg-ink-900'
              }`}
            >
              <span
                className={`font-display text-xs font-semibold tracking-brand ${
                  selected ? 'text-accent-400' : 'text-silver-600'
                }`}
              >
                {s.number}
              </span>
              <span
                className={`text-sm font-semibold ${selected ? 'text-silver-100' : 'text-silver-400 group-hover:text-silver-200'}`}
              >
                {s.title}
              </span>
              {selected && (
                <span
                  className="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-accent-500 lg:block"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>

      <div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${active}`}
        className="surface relative overflow-hidden p-6 md:p-9"
      >
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.div
            key={step.number}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent-800 bg-accent-950/50">
                <Icon className="h-5 w-5 text-accent-400" aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow">
                  Stage {step.number} · {step.title}
                </p>
                <h3 className="mt-2 text-2xl font-semibold leading-snug text-silver-100 md:text-3xl">
                  {step.question}
                </h3>
              </div>
            </div>

            <p className="mt-6 max-w-prose text-base leading-relaxed text-silver-400">{step.detail}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {columns.map((col) => {
                const ColIcon = col.icon
                return (
                  <div key={col.title} className="rounded-xl border border-ink-800 bg-ink-950/70 p-5">
                    <p className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-brand text-silver-400">
                      <ColIcon className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
                      {col.title}
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {col.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-silver-300">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-accent-800/60 bg-accent-950/30 p-5">
              <Flag className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-silver-200">
                <span className="font-semibold text-silver-100">Before we move on: </span>
                {step.gate}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setActive((i) => Math.max(0, i - 1))}
                disabled={active === 0}
                className="text-silver-500 transition-colors hover:text-silver-200 disabled:invisible"
              >
                ← {processSteps[active - 1]?.title}
              </button>
              <button
                type="button"
                onClick={() => setActive((i) => Math.min(processSteps.length - 1, i + 1))}
                disabled={active === processSteps.length - 1}
                className="font-medium text-accent-400 transition-colors hover:text-accent-300 disabled:invisible"
              >
                Next: {processSteps[active + 1]?.title} →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ FAQ */

const Faq = () => {
  const [open, setOpen] = useState(0)
  return (
    <ul className="divide-y divide-ink-800 rounded-xl border border-ink-800 bg-ink-950">
      {processFaqs.map((faq, i) => {
        const expanded = open === i
        return (
          <li key={faq.question}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`faq-${i}`}
                id={`faq-q-${i}`}
                onClick={() => setOpen(expanded ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-medium text-silver-100 transition-colors hover:text-white"
              >
                {faq.question}
                <Plus
                  className={`h-4 w-4 shrink-0 text-accent-500 transition-transform ${expanded ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`faq-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              hidden={!expanded}
              className="px-6 pb-6 text-sm leading-relaxed text-silver-400"
            >
              {faq.answer}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ----------------------------------------------------------------- page */

const HowWeWork = () => {
  usePageMeta(pageMeta.howWeWork)
  const v = useMotionVariants()

  return (
    <>
      <PageHero
        eyebrow="How We Work"
        title="What working together actually looks like."
        description="The stages are the easy part. This is the detail behind them: what we do at each step, what we need from you, what you get, and how you always know where things stand."
      >
        <Button to={routes.startProject} size="lg">
          Start a Project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PageHero>

      {/* Stage explorer */}
      <Section>
        <SectionHeader
          eyebrow="Stage by stage"
          title="Every stage answers one question."
          description="Pick a stage to see who does what, what it produces, and the decision that has to be made before the next one starts."
        />
        <motion.div variants={v.fadeUp} {...revealOnce}>
          <StageExplorer />
        </motion.div>
      </Section>

      {/* Rhythm */}
      <Section muted>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeader
            eyebrow="Staying informed"
            title="You should never have to ask how it is going."
            description="A predictable rhythm of updates and demos, so progress is visible without meetings for the sake of meetings."
            className="!mb-0"
          />
          <motion.ol variants={v.stagger(0.07)} {...revealOnce} className="relative space-y-4">
            {rhythm.map((item, i) => (
              <motion.li
                key={item.title}
                variants={v.fadeUp}
                className="flex gap-5 rounded-xl border border-ink-800 bg-ink-950 p-5"
              >
                <span className="font-display text-sm font-semibold tracking-brand text-accent-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-silver-100">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-silver-400">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Section>

      {/* Ground rules */}
      <Section>
        <SectionHeader
          eyebrow="Ground rules"
          title="What holds on every engagement."
          description="Whatever the size or type of project, these do not change."
        />
        <motion.ul
          variants={v.stagger(0.06)}
          {...revealOnce}
          className="grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 md:grid-cols-2"
        >
          {groundRules.map((rule) => (
            <motion.li key={rule.title} variants={v.fadeUp} className="bg-ink-950 p-7">
              <Check className="h-5 w-5 text-accent-500" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-silver-100">{rule.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{rule.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* Ways to start */}
      <Section muted>
        <SectionHeader
          eyebrow="Ways to start"
          title="You do not have to commit to everything at once."
          description="Most engagements begin in one of these ways. Tell us where you are, and we will suggest the right starting point."
        />
        <motion.ul variants={v.stagger(0.07)} {...revealOnce} className="grid gap-5 md:grid-cols-2">
          {startingPoints.map((point) => (
            <motion.li key={point.title} variants={v.fadeUp} className="surface flex flex-col p-7">
              <h3 className="text-lg font-semibold text-silver-100">{point.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-silver-400">{point.description}</p>
              <p className="mt-5 border-t border-ink-800 pt-4 text-sm text-silver-300">
                <span className="font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">
                  Good for
                </span>
                <span className="ml-2">{point.fit}</span>
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* Continuous care */}
      <Section>
        <SectionHeader
          eyebrow="After launch"
          title="Launch is where the product starts earning."
          description="Three levels of ongoing care. Which one fits depends on how much the product is expected to change."
        />
        <motion.ul variants={v.stagger(0.08)} {...revealOnce} className="grid gap-5 md:grid-cols-3">
          {carePlans.map((plan) => (
            <motion.li
              key={plan.name}
              variants={v.fadeUp}
              className={`surface flex flex-col p-7 ${plan.highlighted ? 'border-accent-800/70 bg-ink-850' : ''}`}
            >
              <p className="eyebrow">{plan.positioning}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-silver-100">{plan.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-silver-400">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-silver-300">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <p className="rounded-xl border border-ink-800 bg-ink-900 p-6 text-sm leading-relaxed text-silver-400">
            {CARE_PRICING_NOTE}
          </p>
          <p className="rounded-xl border border-ink-800 bg-ink-900 p-6 text-sm leading-relaxed text-silver-400">
            {PRICING_STATEMENT}
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section muted>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeader
            eyebrow="Questions"
            title="Before you ask."
            description="The questions we hear most often at the start of an engagement."
            className="!mb-0"
          />
          <motion.div variants={v.fadeUp} {...revealOnce}>
            <Faq />
          </motion.div>
        </div>
      </Section>

      <FinalCTA location="how_we_work" />
    </>
  )
}

export default HowWeWork
