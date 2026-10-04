import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Target, Code2, ShieldCheck, MessagesSquare, Blocks, RefreshCw } from 'lucide-react'
import { differentiators } from '../../data/process'
import { CloverMark } from '../brand/Logo'
import { useMotionVariants, revealOnce, EASE } from '../../lib/motion'

/**
 * Working with us: the six commitments as a hand of cards, fanned out on the
 * table. One card at a time rises out of the fan and shows its promise in
 * full; it cycles on its own until someone hovers, focuses or taps a card.
 * On phones the hand becomes a row you swipe through.
 */
const ICONS = {
  alignment: Target,
  quality: Code2,
  security: ShieldCheck,
  communication: MessagesSquare,
  extensible: Blocks,
  partnership: RefreshCw,
}

const CYCLE_MS = 3600
const N = differentiators.length
const MID = (N - 1) / 2

/** A different quiet pattern on each card's face, so the hand reads as a set. */
const Pattern = ({ index }) => {
  const kinds = [
    <g key="rings">{[18, 34, 50, 66].map((r) => <circle key={r} cx="150" cy="40" r={r} />)}</g>,
    <g key="grid">{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${100 + i * 16} 0V120M100 ${i * 20}H200`} />)}</g>,
    <g key="shield">{[0, 1, 2, 3].map((i) => <path key={i} d={`M150 ${10 + i * 12}l${30 - i * 6} 10v20c0 18-${30 - i * 6} 30-${30 - i * 6} 30s-${30 - i * 6}-12-${30 - i * 6}-30V${20 + i * 12}z`} />)}</g>,
    <g key="waves">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M90 ${20 + i * 16}c20-14 40 14 60 0s40 14 60 0`} />)}</g>,
    <g key="blocks">{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={118 + c * 24} y={10 + r * 24} width="18" height="18" rx="3" />))}</g>,
    <g key="orbit"><circle cx="150" cy="45" r="40" /><circle cx="150" cy="45" r="22" /><path d="M110 45a40 40 0 0 1 80 0" /></g>,
  ]
  return (
    <svg viewBox="0 0 200 120" className="absolute right-0 top-0 h-28 w-48 fill-none stroke-accent-500/25" strokeWidth="1.2" aria-hidden="true">
      {kinds[index % kinds.length]}
    </svg>
  )
}

const Card = ({ item, index, active, compact }) => {
  const Icon = ICONS[item.key] ?? Target
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl border p-5 transition-colors duration-500 ${
        active ? 'border-accent-600/80 bg-ink-850 shadow-[0_30px_70px_-20px_rgb(var(--glow-accent)/0.55)]' : 'border-ink-700 bg-ink-850'
      }`}
    >
      {/* a solid card first, then the red wash, so nothing behind shows through */}
      <span className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-accent-950/70 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
      <Pattern index={index} />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className={`grid h-11 w-11 place-items-center rounded-xl border transition-colors ${active ? 'border-accent-600 bg-accent-600 text-white' : 'border-ink-700 bg-ink-950 text-accent-500'}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-xs font-semibold tracking-brand text-silver-600">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="mt-auto text-lg font-semibold leading-snug text-silver-100">{item.title}</h3>
        <p
          className={`overflow-hidden text-sm leading-relaxed text-silver-300 transition-all duration-500 ${
            active || compact ? 'mt-2 max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {item.description}
        </p>
        <CloverMark className={`absolute -bottom-1 -right-1 h-6 w-6 transition-opacity ${active ? 'opacity-80' : 'opacity-20'}`} />
      </div>
    </div>
  )
}

const Commitments = () => {
  const v = useMotionVariants()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (touched || reduced) return undefined
    const timer = setInterval(() => setActive((i) => (i + 1) % N), CYCLE_MS)
    return () => clearInterval(timer)
  }, [touched, reduced])

  const pick = (i) => {
    setTouched(true)
    setActive(i)
  }

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 md:py-24" aria-label="Working with us">
      <div className="pointer-events-none absolute left-1/2 top-2/3 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-accent-900/20 blur-[140px]" aria-hidden="true" />
      <div className="container relative">
        <motion.div variants={v.fadeUp} {...revealOnce} className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Working with us</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-4xl">Six promises, dealt face up.</h2>
          <p className="mt-3 text-sm text-silver-500">Pick a card. Every one of them holds on every project.</p>
        </motion.div>

        {/* the hand, fanned, on larger screens */}
        <div className="relative mx-auto mt-10 hidden h-[26rem] max-w-6xl md:block" role="list">
          {differentiators.map((item, i) => {
            const offset = i - MID
            const on = i === active
            return (
              <motion.button
                key={item.key}
                type="button"
                role="listitem"
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                aria-pressed={on}
                aria-label={`${item.title}. ${item.description}`}
                className="absolute bottom-0 left-1/2 h-80 w-60 text-left focus-visible:outline-none"
                style={{ marginLeft: '-7.5rem', transformOrigin: '50% 140%', zIndex: on ? 20 : 10 - Math.abs(Math.round(offset)) }}
                initial={reduced ? false : { opacity: 0, y: 120, rotate: 0, x: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                animate={{
                  x: offset * 150,
                  y: on ? -56 : Math.abs(offset) * Math.abs(offset) * 6,
                  rotate: on ? 0 : offset * 5,
                  scale: on ? 1.06 : 1,
                }}
                transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
              >
                <Card item={item} index={i} active={on} />
              </motion.button>
            )
          })}
        </div>

        {/* a row to swipe through on phones */}
        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
          {differentiators.map((item, i) => (
            <li key={item.key} className="h-72 w-[78%] shrink-0 snap-start">
              <Card item={item} index={i} active={false} compact />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Commitments
