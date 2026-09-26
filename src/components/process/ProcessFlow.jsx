import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useSpring, useReducedMotion, useInView } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import StageIcon from './StageIcon'
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
  const [hovered, setHovered] = useState(false)
  // Once the visitor picks a stage or presses pause, the rail stays where they
  // put it. Tapping on iOS never focuses a button, so focus alone cannot be
  // relied on to pause it.
  const [stopped, setStopped] = useState(false)
  const rootRef = useRef(null)
  const inView = useInView(rootRef, { amount: 0.4 })
  const tabsRef = useRef([])

  const playing = !reduced && !stopped && !hovered && inView

  // Auto-advance so the flow plays itself, only while it is on screen.
  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => setActive((i) => (i + 1) % processSteps.length), ADVANCE_MS)
    return () => clearInterval(id)
  }, [playing])

  const choose = useCallback((i) => {
    setStopped(true)
    setActive(i)
  }, [])

  const handleKeyDown = useCallback((e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    setStopped(true)
    setActive((i) => {
      const next = (i + keys[e.key] + processSteps.length) % processSteps.length
      tabsRef.current[next]?.focus()
      return next
    })
  }, [])

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ------------------------------------------------------- the rail */}
      <div
        role="tablist"
        aria-label="Our delivery process, Discover through Grow"
        onKeyDown={handleKeyDown}
        onFocusCapture={() => setStopped(true)}
        className="grid grid-cols-7"
      >
        {processSteps.map((step, i) => {
          const isActive = i === active
          const isPassed = i < active

          return (
            <div key={step.number} className="relative min-w-0">
              {/* Connector to the next stage, filling left to right as the flow
                  advances. Positioned from node centre to node centre so the
                  column can be the full tap target. */}
              {i < processSteps.length - 1 && (
                <span
                  className="absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-[1.375rem] h-px overflow-hidden bg-ink-700"
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

              <button
                ref={(el) => (tabsRef.current[i] = el)}
                type="button"
                role="tab"
                id={`process-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`process-panel-${i}`}
                aria-label={`Stage ${step.number}: ${step.title}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => choose(i)}
                className="group relative flex min-h-[44px] w-full flex-col items-center gap-2.5 rounded-lg"
              >
                {/* Node: an animated icon that shows what the stage is */}
                <span className="relative grid h-11 w-11 place-items-center">
                  {isActive && playing && (
                    <span
                      className="animate-node-pulse absolute inset-1 rounded-full bg-accent-500"
                      aria-hidden="true"
                    />
                  )}
                  <motion.span
                    animate={{ scale: isActive ? 1 : 0.86 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                    className={`relative grid h-full w-full place-items-center rounded-full border transition-colors duration-300 ${
                      isActive
                        ? 'border-accent-500 bg-accent-600 text-white'
                        : isPassed
                          ? 'border-accent-700 bg-accent-950 text-accent-300'
                          : 'border-ink-600 bg-ink-850 text-silver-500 group-hover:border-ink-500 group-hover:text-silver-300'
                    }`}
                  >
                    <StageIcon stage={step.title} fallback={step.icon} active={isActive} className="h-5 w-5" />
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
            </div>
          )
        })}
      </div>

      {/* ------------------------------------------------ the active stage */}
      {/* Every panel shares one grid cell, so the box is always as tall as the
          longest stage and the page below never jumps as the rail advances. */}
      <div className="mt-6 grid">
        {processSteps.map((step, i) => {
          const isActive = i === active
          return (
            <div
              key={step.number}
              id={`process-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`process-tab-${i}`}
              className={`[grid-area:1/1] ${isActive ? '' : 'invisible'}`}
            >
              <motion.div
                initial={false}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 8 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                className="surface surface-static flex h-full flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6 md:p-8"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-900 text-accent-500">
                  <StageIcon stage={step.title} fallback={step.icon} className="h-5 w-5" />
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

      {/* Pause / play, so the moving rail can always be stopped (WCAG 2.2.2) */}
      {!reduced && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setStopped((s) => !s)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-2 text-xs text-silver-500 transition-colors hover:text-silver-200"
          >
            {stopped ? (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {stopped ? 'Play the stages' : 'Pause'}
          </button>
        </div>
      )}
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
