import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { processSteps } from '../../data/process'
import { EASE } from '../../lib/motion'

/**
 * The Discover → Grow delivery flow, animated.
 *
 * Two presentations of the same seven stages from data/process.js:
 *
 *   <ProcessRail />     compact, for the homepage. A horizontal rail whose
 *                       connectors fill one after another as the flow advances
 *                       by itself, with the active stage explained below it.
 *   <ProcessTimeline /> expanded, for the How We Work page. A vertical timeline
 *                       whose progress line is bound to scroll position.
 *
 * Both respect prefers-reduced-motion: the rail stops auto-advancing (and stays
 * fully operable by click and arrow key), and the timeline draws its line
 * immediately instead of following the scroll.
 */

const ADVANCE_MS = 3200

/* ------------------------------------------------------------------ rail */

export const ProcessRail = () => {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const tabsRef = useRef([])

  // Auto-advance so the flow plays itself; pauses on hover/focus, and never
  // runs at all for visitors who prefer reduced motion.
  useEffect(() => {
    if (reduced || paused) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % processSteps.length), ADVANCE_MS)
    return () => clearInterval(id)
  }, [reduced, paused])

  const handleKeyDown = useCallback((e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    setActive((i) => {
      const next = (i + keys[e.key] + processSteps.length) % processSteps.length
      tabsRef.current[next]?.focus()
      return next
    })
  }, [])

  const activeStep = processSteps[active]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* ------------------------------------------------------- the rail */}
      <div
        role="tablist"
        aria-label="Our delivery process, Discover through Grow"
        onKeyDown={handleKeyDown}
        className="flex items-start justify-between gap-1 sm:gap-2"
      >
        {processSteps.map((step, i) => {
          const isActive = i === active
          const isPassed = i < active

          return (
            <div key={step.number} className="flex min-w-0 flex-1 items-start">
              <button
                ref={(el) => (tabsRef.current[i] = el)}
                type="button"
                role="tab"
                id={`process-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`process-panel-${i}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                className="group flex shrink-0 flex-col items-center gap-2.5 rounded-lg px-1 py-1"
              >
                {/* Node */}
                <span className="relative grid h-8 w-8 place-items-center sm:h-9 sm:w-9">
                  {isActive && !reduced && (
                    <span
                      className="animate-node-pulse absolute inset-0 rounded-full bg-accent-500"
                      aria-hidden="true"
                    />
                  )}
                  <motion.span
                    animate={{
                      scale: isActive ? 1 : 0.88,
                    }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                    className={`relative grid h-full w-full place-items-center rounded-full border font-display text-[11px] font-semibold transition-colors duration-300 sm:text-xs ${
                      isActive
                        ? 'border-accent-500 bg-accent-600 text-white'
                        : isPassed
                          ? 'border-accent-700 bg-accent-950 text-accent-300'
                          : 'border-ink-600 bg-ink-850 text-silver-500 group-hover:border-ink-500'
                    }`}
                  >
                    {step.number}
                  </motion.span>
                </span>

                {/* Label — hidden on the narrowest screens, where the panel carries it */}
                <span
                  className={`hidden text-center text-[11px] font-medium leading-tight transition-colors duration-300 sm:block md:text-xs ${
                    isActive ? 'text-silver-100' : 'text-silver-500 group-hover:text-silver-300'
                  }`}
                >
                  {step.title}
                </span>
              </button>

              {/* Connector, filling left to right as the flow advances */}
              {i < processSteps.length - 1 && (
                <span
                  className="relative mt-4 h-px min-w-0 flex-1 overflow-hidden bg-ink-700 sm:mt-[1.125rem]"
                  aria-hidden="true"
                >
                  <motion.span
                    className="absolute inset-0 block origin-left bg-accent-500"
                    initial={false}
                    animate={{ scaleX: i < active ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                  />
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ------------------------------------------------ the active stage */}
      <div className="mt-8">
        {processSteps.map((step, i) => {
          const isActive = i === active
          const Icon = step.icon
          return (
            <div
              key={step.number}
              id={`process-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`process-tab-${i}`}
              hidden={!isActive}
            >
              <motion.div
                initial={false}
                animate={
                  isActive
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: reduced ? 0 : 8 }
                }
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                className="surface flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6 md:p-8"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-900">
                  <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-xs font-semibold tracking-brand text-silver-500">
                      {step.number}
                    </span>
                    <h3 className="text-lg font-semibold text-silver-100 md:text-xl">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2 font-display text-sm text-silver-300">{step.summary}</p>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-silver-400">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Stage {activeStep.number}: {activeStep.title}. {activeStep.summary}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------- timeline */

export const ProcessTimeline = () => {
  const reduced = useReducedMotion()
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.55'],
  })
  // Spring-smoothed so the line glides rather than tracking every scroll tick.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  return (
    <div ref={containerRef} className="relative">
      {/* Rail track + the portion drawn so far */}
      <div
        className="absolute bottom-0 left-[1.4375rem] top-2 w-px bg-ink-700 md:left-[1.6875rem]"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-accent-500 via-accent-600 to-accent-700"
          style={reduced ? { scaleY: 1 } : { scaleY: progress }}
        />
      </div>

      <ol className="space-y-6">
        {processSteps.map((step) => {
          const Icon = step.icon
          return (
            <motion.li
              key={step.number}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px 0px -20% 0px' }}
              transition={{ duration: 0.55, ease: EASE }}
              className="group relative flex gap-5 md:gap-8"
            >
              {/* Node sitting on the rail */}
              <span className="relative z-10 shrink-0 pt-1">
                <motion.span
                  initial={reduced ? false : { scale: 0.7, opacity: 0.4 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-140px 0px -20% 0px' }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
                  className="grid h-12 w-12 place-items-center rounded-full border border-ink-700 bg-ink-900 transition-colors duration-300 group-hover:border-accent-600 md:h-14 md:w-14"
                >
                  <Icon
                    className="h-5 w-5 text-accent-500 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                </motion.span>
              </span>

              <div className="surface surface-hover min-w-0 flex-1 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs font-semibold tracking-brand text-silver-500">
                    {step.number}
                  </span>
                  <span className="h-px w-6 bg-accent-600" aria-hidden="true" />
                </div>

                <h2 className="mt-3 text-xl font-semibold text-silver-100 md:text-2xl">
                  {step.title}
                </h2>
                <p className="mt-2 font-display text-sm text-silver-300">{step.summary}</p>
                <p className="mt-4 max-w-prose text-base leading-relaxed text-silver-400">
                  {step.detail}
                </p>
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
