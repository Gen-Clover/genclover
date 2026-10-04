import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BadgeCheck, FileText, Users, Wrench } from 'lucide-react'
import { processSteps } from '../../data/process'
import { EASE } from '../../lib/motion'

/**
 * The seven stages around a dial, because the process is a loop: Grow feeds
 * the next Discover. Choosing a station turns the dial until it sits at the
 * top; the panel beside it opens that stage (what we do, what you bring, what
 * you get, and what has to be agreed before moving on). Arrow keys turn it,
 * and until someone does, it gives itself a slow tour.
 */

const COUNT = processSteps.length
const STEP = 360 / COUNT
const TOUR_MS = 6000

const TABS = [
  { id: 'weDo', label: 'We do', icon: Wrench },
  { id: 'youBring', label: 'You bring', icon: Users },
  { id: 'youGet', label: 'You get', icon: FileText },
]

const StageDial = () => {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [turns, setTurns] = useState(0) // whole rotations, so the dial always takes the short way
  const [tab, setTab] = useState('weDo')
  const [touched, setTouched] = useState(false)

  const goTo = (i, byUser = true) => {
    if (byUser) setTouched(true)
    const next = (i + COUNT) % COUNT
    // Rotate forward past Grow back to Discover rather than spinning backwards.
    if (next === 0 && active === COUNT - 1) setTurns((t) => t + 1)
    if (next === COUNT - 1 && active === 0) setTurns((t) => t - 1)
    setActive(next)
  }

  useEffect(() => {
    if (touched || reduced) return undefined
    const timer = setInterval(() => goTo(active + 1, false), TOUR_MS)
    return () => clearInterval(timer)
  })

  const stage = processSteps[active]
  const rotation = -active * STEP - turns * 360

  return (
    <div
      className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          goTo(active + 1)
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          goTo(active - 1)
        }
      }}
    >
      {/* the dial */}
      <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="200" cy="200" r="160" className="fill-none stroke-ink-800" strokeWidth="22" />
          <circle cx="200" cy="200" r="160" className="fill-none stroke-ink-600" strokeWidth="1.5" strokeDasharray="4 8" />
          {/* how far round the loop the chosen stage is: from station 01 to it,
              turning with the dial so it always ends at the station on top */}
          <motion.g initial={false} animate={{ rotate: rotation }} transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}>
            <motion.circle
              cx="200"
              cy="200"
              r="160"
              className="fill-none stroke-accent-500"
              strokeWidth="4"
              strokeLinecap="round"
              transform="rotate(-90 200 200)"
              initial={false}
              animate={{ pathLength: Math.max(0.001, active / COUNT) }}
              transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
            />
          </motion.g>
          <circle cx="200" cy="200" r="118" className="fill-ink-900/70 stroke-ink-700" strokeWidth="1" />
        </svg>

        {/* stations ride the turning ring; their labels stay upright */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ rotate: rotation }}
          transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
        >
          {processSteps.map((s, i) => {
            const angle = (i * STEP - 90) * (Math.PI / 180)
            const x = 50 + 40 * Math.cos(angle)
            const y = 50 + 40 * Math.sin(angle)
            const on = i === active
            return (
              <motion.button
                key={s.number}
                type="button"
                data-tick
                onClick={() => goTo(i)}
                className="absolute focus-visible:outline-none"
                // centred through Framer: its rotate would overwrite a Tailwind translate
                style={{ left: `${x}%`, top: `${y}%`, x: '-50%', y: '-50%' }}
                initial={false}
                animate={{ rotate: -rotation }}
                transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
                aria-label={`${s.number} ${s.title}`}
                aria-pressed={on}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-full border-2 font-display text-xs font-semibold transition-all duration-500 sm:h-14 sm:w-14 ${
                    on
                      ? 'scale-110 border-accent-400 bg-accent-600 text-white shadow-[0_0_34px_rgb(var(--glow-accent)/0.6)]'
                      : i < active
                        ? 'border-accent-700 bg-ink-950 text-accent-300'
                        : 'border-ink-600 bg-ink-950 text-silver-500 hover:border-silver-500 hover:text-silver-200'
                  }`}
                >
                  {s.number}
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* the hub */}
        <div className="absolute inset-[26%] grid place-items-center rounded-full text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="px-2"
            >
              <stage.icon className="mx-auto h-6 w-6 text-accent-400" aria-hidden="true" />
              <p className="mt-2 font-display text-2xl font-bold text-silver-100 sm:text-3xl">{stage.title}</p>
              <p className="mt-1 text-xs italic leading-snug text-silver-400 sm:text-sm">{stage.question}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="absolute bottom-[3%] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] uppercase tracking-brand text-silver-600">
          Grow feeds the next Discover
        </p>
      </div>

      {/* the stage, opened */}
      <div className="surface surface-static p-6" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.number}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <p className="eyebrow">Stage {stage.number} of {String(COUNT).padStart(2, '0')}</p>
            <h2 className="mt-2 text-2xl font-semibold text-silver-100">{stage.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-silver-400">{stage.detail}</p>

            <div className="mt-5 flex gap-1 rounded-lg border border-ink-700 bg-ink-950/60 p-1" role="tablist" aria-label={`${stage.title} details`}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => {
                    setTouched(true)
                    setTab(t.id)
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-colors ${
                    tab === t.id ? 'bg-accent-600 text-white' : 'text-silver-400 hover:text-silver-100'
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.label}
                </button>
              ))}
            </div>
            <ul className="mt-4 min-h-[6.5rem] space-y-2" role="tabpanel">
              {stage[tab].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-silver-200">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-accent-800/50 bg-accent-950/30 p-4">
              <p className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                Before we move on
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-silver-200">{stage.gate}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StageDial
