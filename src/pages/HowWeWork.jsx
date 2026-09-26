import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, FileText, Flag, Users, Wrench } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import { SplitScreen, GlassPanel } from '../components/ui/SplitScreen'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import Faq from '../components/ui/Faq'
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

/** Vertical list of stages (tabs). */
const StageTabs = ({ active, setActive, compact = false }) => {
  const tabsRef = useRef([])
  const onKeyDown = (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    const next = (active + keys[e.key] + processSteps.length) % processSteps.length
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Delivery stages"
      onKeyDown={onKeyDown}
      className={
        compact
          ? 'grid gap-1'
          : '-mx-4 flex gap-2 overflow-x-auto px-4 pb-2'
      }
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
            onMouseEnter={compact ? () => setActive(i) : undefined}
            className={`group relative flex shrink-0 items-center gap-4 rounded-lg border px-4 text-left transition-colors ${
              compact ? 'w-full py-2' : 'py-3'
            } ${
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
            {compact && (
              <span className="ml-auto hidden truncate text-xs text-silver-600 xl:block">
                {s.summary.replace(/\.$/, '')}
              </span>
            )}
            {selected && (
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent-500" aria-hidden="true" />
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Detail of the selected stage. */
const StagePanel = ({ active, setActive }) => {
  const reduced = useReducedMotion()
  const step = processSteps[active]
  const Icon = step.icon
  const columns = [
    { title: 'What we do', items: step.weDo, icon: Wrench },
    { title: 'What we need from you', items: step.youBring, icon: Users },
    { title: 'What you get', items: step.youGet, icon: FileText },
  ]

  return (
    <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.number}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent-800 bg-accent-950/50">
              <Icon className="h-5 w-5 text-accent-400" aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">
                Stage {step.number} · {step.title}
              </p>
              <h3 className="mt-1.5 text-xl font-semibold leading-snug text-silver-100 xl:text-2xl">
                {step.question}
              </h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-silver-400">
            {step.detail}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {columns.map((col) => {
              const ColIcon = col.icon
              return (
                <div key={col.title} className="tile rounded-xl border border-ink-800 bg-ink-950/70 p-4">
                  <p className="flex items-center gap-2 font-display text-[10px] font-semibold uppercase tracking-brand text-silver-400">
                    <ColIcon className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
                    {col.title}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-silver-300">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent-800/60 bg-accent-950/30 p-4">
            <Flag className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-silver-200">
              <span className="font-semibold text-silver-100">Before we move on: </span>
              {step.gate}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="text-silver-500 transition-colors hover:text-silver-200 disabled:invisible"
            >
              ← {processSteps[active - 1]?.title}
            </button>
            <button
              type="button"
              onClick={() => setActive(Math.min(processSteps.length - 1, active + 1))}
              disabled={active === processSteps.length - 1}
              className="font-medium text-accent-400 transition-colors hover:text-accent-300 disabled:invisible"
            >
              Next: {processSteps[active + 1]?.title} →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ----------------------------------------------------------------- page */

const HowWeWork = () => {
  usePageMeta(pageMeta.howWeWork)
  const v = useMotionVariants()
  const [stage, setStage] = useState(0)

  return (
    <>
      <SplitScreen
        label="How We Work"
        cols="lg:grid-cols-[0.8fr_1.2fr]"
        left={
          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)}>
            <motion.p variants={v.fadeUp} className="eyebrow">
              How We Work
            </motion.p>
            <motion.h1
              variants={v.fadeUp}
              className="mt-3 text-4xl leading-[1.05] tracking-tight xl:text-[2.75rem]"
            >
              What working together actually looks like.
            </motion.h1>
            <motion.p variants={v.fadeUp} className="mt-3 text-base leading-relaxed text-silver-400">
              Every stage answers one question, produces something you can review, and ends with a
              decision. Pick a stage.
            </motion.p>
            <motion.div variants={v.fadeUp} className="mt-5 hidden lg:block">
              <StageTabs active={stage} setActive={setStage} compact />
            </motion.div>
            <motion.div variants={v.fadeUp} className="mt-5">
              <Button to={routes.startProject} size="md">
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        }
        right={
          <GlassPanel>
            <StagePanel active={stage} setActive={setStage} />
          </GlassPanel>
        }
      />

      {/* Small screens: the stage explorer below the intro */}
      <Section className="lg:hidden">
        <StageTabs active={stage} setActive={setStage} />
        <div className="surface surface-static mt-4 p-6">
          <StagePanel active={stage} setActive={setStage} />
        </div>
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
                className="tile flex gap-5 rounded-xl border border-ink-800 bg-ink-950 p-5"
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
            <Faq items={processFaqs} />
          </motion.div>
        </div>
      </Section>

      <FinalCTA
        title="Ready for stage one?"
        description="Every engagement starts with Discover: a conversation about what you are trying to change. Start there, and we will map out what the next stages would look like for you."
        primaryLabel="Start with Discover"
        location="how_we_work"
      />
    </>
  )
}

export default HowWeWork
