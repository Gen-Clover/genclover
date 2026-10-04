import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useMotionValueEvent, useTransform } from 'framer-motion'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { processSteps } from '../../data/process'
import { routes } from '../../data/site'
import { EASE } from '../../lib/motion'

/**
 * How we work, as a journey. The section pins while the visitor scrolls: the
 * road draws itself, a light travels from stop to stop, and the card below
 * shows the stage it has reached (the question it answers and what has to be
 * signed off before moving on). Stops can be clicked to jump. With reduced
 * motion the section does not pin; the stops are simply clickable.
 */

const ROAD = 'M30 150C150 40 260 40 380 115S600 205 720 115 940 25 1060 95 1170 150 1170 150'
const LAST = processSteps.length - 1

const ProcessJourney = () => {
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const roadRef = useRef(null)
  const [stops, setStops] = useState([])
  const [step, setStep] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })
  const [dot, setDot] = useState({ x: 30, y: 150 })

  // Stops sit at equal distances along the road; measured once it is drawn.
  useEffect(() => {
    const road = roadRef.current
    if (!road) return
    const length = road.getTotalLength()
    setStops(processSteps.map((_, i) => road.getPointAtLength((length * i) / LAST)))
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!reduced) setStep(Math.min(LAST, Math.max(0, Math.round(p * LAST))))
  })
  useMotionValueEvent(progress, 'change', (p) => {
    const road = roadRef.current
    if (!road || reduced) return
    const point = road.getPointAtLength(road.getTotalLength() * Math.min(1, Math.max(0, p)))
    setDot({ x: point.x, y: point.y })
  })

  const drawn = useTransform(progress, (p) => Math.min(1, Math.max(0.001, p)))

  const jump = (i) => {
    if (reduced) {
      setStep(i)
      return
    }
    const section = sectionRef.current
    const top = section.getBoundingClientRect().top + window.scrollY
    const travel = section.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (travel * i) / LAST, behavior: 'smooth' })
  }

  const current = processSteps[step]
  const Icon = current.icon
  const staticDot = stops[step] ?? { x: 30, y: 150 }

  return (
    <section ref={sectionRef} className="relative bg-ink-950" style={{ height: reduced ? 'auto' : '340vh' }} aria-label="How we work">
      <div className={`${reduced ? '' : 'sticky top-0 h-[100svh]'} flex flex-col overflow-hidden`}>
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container relative flex flex-1 flex-col justify-center py-20 lg:pt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">How we work</p>
              <h2 className="mt-3 text-3xl leading-tight md:text-4xl">Seven stops. No surprises.</h2>
            </div>
            <Link to={routes.howWeWork} className="hidden shrink-0 items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 sm:inline-flex">
              The full process
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* the road */}
          <div className="relative mt-6 md:mt-10">
            <svg viewBox="0 0 1200 230" className="h-auto w-full overflow-visible" aria-hidden="true">
              <path d={ROAD} fill="none" className="stroke-ink-800" strokeWidth="18" strokeLinecap="round" />
              <path ref={roadRef} d={ROAD} fill="none" className="stroke-ink-600" strokeWidth="1.5" strokeDasharray="10 12" />
              <motion.path
                d={ROAD}
                fill="none"
                className="stroke-accent-500"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: reduced ? step / LAST + 0.001 : drawn }}
              />
              <circle cx={reduced ? staticDot.x : dot.x} cy={reduced ? staticDot.y : dot.y} r="16" className="fill-accent-500/25" />
              <circle cx={reduced ? staticDot.x : dot.x} cy={reduced ? staticDot.y : dot.y} r="7" className="fill-accent-400" />
            </svg>

            {/* stops, as real buttons laid over the drawing */}
            {stops.map((point, i) => {
              const passed = i <= step
              return (
                <button
                  key={processSteps[i].number}
                  type="button"
                  data-tick
                  onClick={() => jump(i)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(point.x / 1200) * 100}%`, top: `${(point.y / 230) * 100}%` }}
                  aria-label={`${processSteps[i].number} ${processSteps[i].title}`}
                  aria-current={i === step ? 'step' : undefined}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 font-display text-[11px] font-semibold transition-all duration-500 md:h-11 md:w-11 ${
                      i === step
                        ? 'scale-110 border-accent-400 bg-accent-600 text-white shadow-[0_0_30px_rgb(var(--glow-accent)/0.6)]'
                        : passed
                          ? 'border-accent-600 bg-ink-950 text-accent-300'
                          : 'border-ink-600 bg-ink-950 text-silver-500 group-hover:border-silver-500'
                    }`}
                  >
                    {processSteps[i].number}
                  </span>
                  <span
                    className={`absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-xs font-medium transition-colors md:block ${
                      i % 2 ? 'top-full mt-2' : 'bottom-full mb-2'
                    } ${i === step ? 'text-silver-100' : 'text-silver-500'}`}
                  >
                    {processSteps[i].title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* the stage reached */}
          <div className="mt-8 min-h-[13rem] md:mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.number}
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: EASE }}
                className="grid gap-6 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-10"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-6xl font-bold leading-none text-accent-500/90 md:text-7xl">{current.number}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-ink-700 bg-ink-900">
                    <Icon className="h-5 w-5 text-accent-400" aria-hidden="true" />
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-silver-100 md:text-3xl">{current.title}</h3>
                  <p className="mt-2 text-lg italic text-silver-300">{current.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-silver-500">{current.summary}</p>
                </div>
                <div className="rounded-xl border border-accent-800/50 bg-accent-950/30 p-4">
                  <p className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    Before we move on
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-silver-200">{current.gate}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {!reduced && (
            <p className="mt-6 text-center font-display text-[11px] uppercase tracking-brand text-silver-600">
              {step < LAST ? 'Keep scrolling to travel the road' : 'And then we keep going'}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProcessJourney
