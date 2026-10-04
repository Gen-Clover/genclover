import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { carePlans, CARE_PRICING_NOTE } from '../../data/process'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce, EASE } from '../../lib/motion'

/**
 * After launch: the three care plans as a garden that grows when it scrolls
 * into view. A seedling for Care, a young plant for Growth, a tree for a
 * Dedicated Partner. What each plan includes appears on hover (always shown
 * where there is no hover).
 */

const draw = (delay) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { delay, duration: 1, ease: EASE } },
})
const pop = (delay) => ({
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { delay, type: 'spring', stiffness: 220, damping: 14 } },
})

/** Placed by the group; the path inside only scales, so the two never clash. */
const Leaf = ({ x, y, r = 0, s = 1, delay, accent }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <motion.path
      d="M0 0C6-10 20-12 28-6C20 2 8 4 0 0Z"
      className={accent ? 'fill-accent-500' : 'fill-silver-500/70'}
      variants={pop(delay)}
      style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}
    />
  </g>
)

const Ground = () => (
  <>
    <path d="M30 200h140" className="stroke-ink-600" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 206h80" className="stroke-ink-700" strokeWidth="2" strokeLinecap="round" />
  </>
)

const Seedling = () => (
  <>
    <Ground />
    <motion.path d="M100 200C100 180 98 168 100 150" className="stroke-silver-500" strokeWidth="3" fill="none" strokeLinecap="round" variants={draw(0.1)} />
    <Leaf x={100} y={160} r={-35} delay={0.9} />
    <Leaf x={100} y={156} r={-150} s={0.9} delay={1.05} accent />
  </>
)

const YoungPlant = () => (
  <>
    <Ground />
    <motion.path d="M100 200C102 160 96 130 100 90" className="stroke-silver-500" strokeWidth="3.5" fill="none" strokeLinecap="round" variants={draw(0.2)} />
    <Leaf x={100} y={175} r={-25} s={1.1} delay={1} />
    <Leaf x={100} y={160} r={-160} s={1.1} delay={1.1} />
    <Leaf x={100} y={135} r={-30} delay={1.2} />
    <Leaf x={100} y={120} r={-150} delay={1.3} accent />
    <motion.circle cx="100" cy="86" r="7" className="fill-accent-500" variants={pop(1.5)} />
  </>
)

const Tree = () => (
  <>
    <Ground />
    <motion.path d="M100 200C98 170 102 140 100 110M100 150C88 136 78 128 66 124M100 136C114 122 124 116 136 114" className="stroke-silver-500" strokeWidth="4" fill="none" strokeLinecap="round" variants={draw(0.3)} />
    {[
      [100, 78, 34],
      [66, 108, 24],
      [136, 100, 26],
      [80, 70, 22],
      [122, 68, 22],
    ].map(([cx, cy, r], i) => (
      <motion.circle key={i} cx={cx} cy={cy} r={r} className="fill-ink-700 stroke-silver-600" strokeWidth="1.5" variants={pop(1.1 + i * 0.12)} />
    ))}
    {[
      [92, 72],
      [118, 88],
      [70, 104],
      [138, 96],
      [104, 58],
    ].map(([cx, cy], i) => (
      <motion.circle key={`f${i}`} cx={cx} cy={cy} r="4.5" className="fill-accent-500" variants={pop(1.8 + i * 0.1)} />
    ))}
  </>
)

const PLANTS = [Seedling, YoungPlant, Tree]

const CareGarden = () => {
  const v = useMotionVariants()

  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 md:py-24" aria-label="After launch">
      <div className="container">
        <motion.div variants={v.fadeUp} {...revealOnce} className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">After launch</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-4xl">Launch is where things start growing.</h2>
        </motion.div>

        <ul className="grid gap-5 md:grid-cols-3">
          {carePlans.map((plan, i) => {
            const Plant = PLANTS[i] ?? Tree
            return (
              <li
                key={plan.name}
                className={`group relative flex flex-col rounded-2xl border p-6 transition-colors duration-500 ${
                  plan.highlighted ? 'border-accent-800/70 bg-ink-900' : 'border-ink-800 bg-ink-900/50 hover:border-ink-700'
                }`}
              >
                <motion.svg
                  viewBox="0 0 200 220"
                  className="mx-auto h-56 w-56 overflow-visible transition-transform duration-700 group-hover:-translate-y-1"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  aria-hidden="true"
                >
                  <Plant />
                </motion.svg>
                <p className="mt-4 text-center font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">{plan.positioning}</p>
                <h3 className="mt-1 text-center text-2xl font-semibold text-silver-100">{plan.name}</h3>
                <p className="mt-2 text-center text-sm leading-relaxed text-silver-400">{plan.description}</p>
                <ul className="mt-4 grid max-h-0 gap-1.5 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 [@media(hover:none)]:max-h-none [@media(hover:none)]:opacity-100">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-silver-300">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>

        <motion.p variants={v.fadeUp} {...revealOnce} className="mt-8 text-center text-sm text-silver-500">
          {CARE_PRICING_NOTE}{' '}
          <Link to={routes.startProject} className="inline-flex items-center gap-1 font-medium text-accent-400 hover:text-accent-300">
            Talk to us
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </motion.p>
      </div>
    </section>
  )
}

export default CareGarden
