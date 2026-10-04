import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { CloverMark } from '../brand/Logo'
import { routes, site } from '../../data/site'
import { useMotionVariants, EASE } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/**
 * Homepage hero. The headline is specified content (Spec §5.1).
 *
 * Beside it, a browser window builds a product in front of the visitor:
 * blocks fly in from scattered positions and snap into a layout. It cycles
 * through a website, a web app, an online store and an AI assistant on its
 * own, and the chips let a visitor pick one; picking stops the cycle.
 */

const CYCLE_MS = 5200

/* ------------------------------------------------------------ the blocks */

const Bar = ({ w = '100%', h = 'h-1.5', tone = 'bg-silver-600/40' }) => <span className={`block rounded-full ${h} ${tone}`} style={{ width: w }} />

const BLOCKS = {
  nav: () => (
    <div className="flex h-full items-center gap-2 px-2">
      <span className="h-3 w-3 rounded-full bg-accent-500" />
      <Bar w="18%" />
      <span className="ml-auto flex w-2/5 gap-1.5">
        <Bar /> <Bar /> <Bar />
      </span>
      <span className="h-3.5 w-10 rounded-full bg-accent-600" />
    </div>
  ),
  headline: () => (
    <div className="flex h-full flex-col justify-center gap-2 p-2">
      <Bar w="90%" h="h-3" tone="bg-silver-300/80" />
      <Bar w="70%" h="h-3" tone="bg-silver-300/80" />
      <Bar w="80%" />
      <Bar w="55%" />
    </div>
  ),
  image: () => (
    <div className="relative h-full overflow-hidden rounded-md bg-gradient-to-br from-accent-700/70 via-accent-900/60 to-ink-800">
      <span className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-accent-400/40 blur-md" />
      <span className="absolute bottom-2 left-2 h-10 w-16 rounded-md bg-ink-950/50" />
    </div>
  ),
  button: () => (
    <div className="flex h-full items-center gap-2 px-2">
      <span className="h-5 w-20 rounded-md bg-accent-600" />
      <span className="h-5 w-14 rounded-md border border-ink-600" />
    </div>
  ),
  card: () => (
    <div className="flex h-full flex-col gap-1.5 rounded-md border border-ink-700 bg-ink-900/80 p-2">
      <span className="h-4 w-4 rounded bg-accent-600/80" />
      <Bar w="80%" h="h-1.5" tone="bg-silver-400/70" />
      <Bar w="60%" />
    </div>
  ),
  sidebar: () => (
    <div className="flex h-full flex-col gap-2 rounded-md bg-ink-900/80 p-2">
      <span className="mb-1 h-3 w-3 rounded-full bg-accent-500" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Bar key={i} w={i === 1 ? '90%' : '75%'} tone={i === 1 ? 'bg-accent-500' : 'bg-silver-600/40'} />
      ))}
    </div>
  ),
  kpi: ({ value }) => (
    <div className="flex h-full flex-col justify-between rounded-md border border-ink-700 bg-ink-900/80 p-2">
      <Bar w="50%" />
      <span className="font-display text-base font-semibold leading-none text-silver-100">{value}</span>
      <span className="h-1.5 w-8 rounded-full bg-emerald-500/70" />
    </div>
  ),
  chart: () => (
    <div className="flex h-full flex-col rounded-md border border-ink-700 bg-ink-900/80 p-2">
      <Bar w="35%" />
      <div className="mt-2 flex flex-1 items-end gap-1.5">
        {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
          <motion.span
            key={i}
            className={`flex-1 rounded-sm ${i === 5 ? 'bg-accent-500' : 'bg-silver-600/40'}`}
            initial={{ height: '10%' }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: EASE }}
          />
        ))}
      </div>
    </div>
  ),
  table: () => (
    <div className="flex h-full flex-col gap-2 rounded-md border border-ink-700 bg-ink-900/80 p-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${i === 2 ? 'bg-accent-500' : 'bg-silver-600/50'}`} />
          <Bar w="55%" />
          <Bar w="20%" tone="bg-silver-400/50" />
        </div>
      ))}
    </div>
  ),
  banner: () => (
    <div className="flex h-full items-center justify-between rounded-md bg-gradient-to-r from-accent-800/80 to-ink-800 px-3">
      <div className="flex w-1/2 flex-col gap-1.5">
        <Bar w="90%" h="h-2.5" tone="bg-silver-100/80" />
        <Bar w="60%" tone="bg-silver-300/60" />
      </div>
      <span className="h-5 w-16 rounded-md bg-silver-100/90" />
    </div>
  ),
  product: ({ hot }) => (
    <div className="flex h-full flex-col gap-1.5 rounded-md border border-ink-700 bg-ink-900/80 p-1.5">
      <span className={`flex-1 rounded ${hot ? 'bg-gradient-to-br from-accent-600/80 to-accent-900/60' : 'bg-ink-700'}`} />
      <Bar w="80%" tone="bg-silver-400/60" />
      <div className="flex items-center justify-between">
        <span className="font-display text-[10px] font-semibold text-silver-200">₹X,XXX</span>
        <span className="h-3.5 w-3.5 rounded bg-accent-600" />
      </div>
    </div>
  ),
  convos: () => (
    <div className="flex h-full flex-col gap-2 rounded-md bg-ink-900/80 p-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`flex items-center gap-1.5 rounded p-1 ${i === 0 ? 'bg-ink-700' : ''}`}>
          <span className={`h-3 w-3 shrink-0 rounded-full ${i === 0 ? 'bg-accent-500' : 'bg-silver-600/50'}`} />
          <Bar w="70%" />
        </div>
      ))}
    </div>
  ),
  chat: () => (
    <div className="flex h-full flex-col justify-end gap-2 p-2">
      {[
        { me: false, w: '62%' },
        { me: true, w: '48%' },
        { me: false, w: '70%' },
      ].map((m, i) => (
        <motion.div
          key={i}
          className={`flex ${m.me ? 'justify-end' : ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.5, duration: 0.4 }}
        >
          <span className={`flex flex-col gap-1 rounded-lg p-2 ${m.me ? 'bg-accent-600/90' : 'bg-ink-700'}`} style={{ width: m.w }}>
            <Bar w="90%" tone={m.me ? 'bg-white/70' : 'bg-silver-400/60'} />
            <Bar w="60%" tone={m.me ? 'bg-white/50' : 'bg-silver-600/50'} />
          </span>
        </motion.div>
      ))}
      <motion.span
        className="flex w-12 gap-1 rounded-lg bg-ink-700 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-silver-400" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </motion.span>
    </div>
  ),
  input: () => (
    <div className="flex h-full items-center gap-2 rounded-full border border-ink-600 bg-ink-900/80 px-3">
      <Bar w="55%" />
      <span className="ml-auto h-5 w-5 rounded-full bg-accent-600" />
    </div>
  ),
}

/** Each build: grid placements on a 12 x 8 board. [kind, col, row, props] */
const BUILDS = [
  {
    id: 'website',
    label: 'Website',
    url: 'yourbrand.com',
    blocks: [
      ['nav', '1 / 13', '1 / 2'],
      ['headline', '1 / 7', '2 / 5'],
      ['image', '7 / 13', '2 / 6'],
      ['button', '1 / 7', '5 / 6'],
      ['card', '1 / 5', '6 / 9'],
      ['card', '5 / 9', '6 / 9'],
      ['card', '9 / 13', '6 / 9'],
    ],
  },
  {
    id: 'app',
    label: 'Web app',
    url: 'app.yourbrand.com',
    blocks: [
      ['sidebar', '1 / 3', '1 / 9'],
      ['kpi', '3 / 6', '1 / 3', { value: '1,284' }],
      ['kpi', '6 / 9', '1 / 3', { value: '96.4%' }],
      ['kpi', '9 / 13', '1 / 3', { value: '42' }],
      ['chart', '3 / 9', '3 / 9'],
      ['table', '9 / 13', '3 / 9'],
    ],
  },
  {
    id: 'store',
    label: 'Online store',
    url: 'shop.yourbrand.com',
    blocks: [
      ['nav', '1 / 13', '1 / 2'],
      ['banner', '1 / 13', '2 / 4'],
      ['product', '1 / 4', '4 / 9', { hot: true }],
      ['product', '4 / 7', '4 / 9'],
      ['product', '7 / 10', '4 / 9', { hot: true }],
      ['product', '10 / 13', '4 / 9'],
    ],
  },
  {
    id: 'ai',
    label: 'AI assistant',
    url: 'help.yourbrand.com',
    blocks: [
      ['convos', '1 / 4', '1 / 9'],
      ['chat', '4 / 13', '1 / 8'],
      ['input', '4 / 13', '8 / 9'],
    ],
  },
]

/** Fixed scatter, so server and browser renders agree. */
const SCATTER = [
  [-90, -60, -8], [120, -40, 6], [-60, 90, 5], [80, 110, -7], [-130, 30, 9], [40, -110, -5], [140, 70, 4],
]

const block = (reduced) => ({
  hidden: (i) => (reduced ? { opacity: 0 } : { opacity: 0, x: SCATTER[i % 7][0], y: SCATTER[i % 7][1], rotate: SCATTER[i % 7][2], scale: 0.8 }),
  visible: (i) => ({ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { delay: 0.08 * i, duration: 0.7, ease: EASE } }),
  exit: (i) =>
    reduced
      ? { opacity: 0 }
      : { opacity: 0, x: -SCATTER[i % 7][1] * 0.6, y: SCATTER[i % 7][0] * 0.4, rotate: -SCATTER[i % 7][2], scale: 0.85, transition: { delay: 0.03 * i, duration: 0.35 } },
})

const Builder = () => {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(false)
  const build = BUILDS[index]
  const variants = block(reduced)

  useEffect(() => {
    if (picked || reduced) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % BUILDS.length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [picked, reduced])

  return (
    <div className="relative">
      {/* the window */}
      <div className="relative rounded-2xl border border-ink-700 bg-ink-900/80 shadow-lift backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-ink-800 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-600" />
          <AnimatePresence mode="wait">
            <motion.span
              key={build.url}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mx-auto rounded-md bg-ink-950/70 px-3 py-0.5 font-mono text-[11px] text-silver-500"
            >
              {build.url}
            </motion.span>
          </AnimatePresence>
          <span className="w-12" />
        </div>
        <div className="aspect-[16/11] p-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={build.id}
              className="grid h-full grid-cols-12 grid-rows-8 gap-2"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {build.blocks.map(([kind, col, row, props], i) => {
                const Block = BLOCKS[kind]
                return (
                  <motion.div key={`${build.id}-${i}`} custom={i} variants={variants} style={{ gridColumn: col, gridRow: row }} className="min-h-0">
                    <Block {...props} />
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* pick what to build */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-display text-[11px] uppercase tracking-brand text-silver-500">Build a</span>
        {BUILDS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setPicked(true)
              setIndex(i)
            }}
            className={`relative overflow-hidden rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              i === index ? 'border-accent-600 text-white' : 'border-ink-700 text-silver-400 hover:text-silver-100'
            }`}
            aria-pressed={i === index}
          >
            {i === index && (
              <motion.span
                key={`${b.id}-${picked}`}
                className="absolute inset-0 origin-left bg-accent-600"
                initial={{ scaleX: picked || reduced ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: picked || reduced ? 0 : CYCLE_MS / 1000, ease: 'linear' }}
              />
            )}
            <span className="relative">{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const HeroBuilder = () => {
  const v = useMotionVariants()

  return (
    <section className="relative isolate overflow-hidden bg-ink-950" aria-labelledby="hero-heading">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 -top-32 h-[42rem] w-[42rem] rounded-full bg-accent-900/25 blur-[150px]" aria-hidden="true" />

      <div className="container relative grid items-center gap-12 pb-14 pt-28 lg:min-h-[100svh] lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-10 lg:pt-24">
        <motion.div initial="hidden" animate="visible" variants={v.stagger(0.1, 0.05)}>
          <motion.div variants={v.fadeUp} className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent-600" aria-hidden="true" />
            <p className="eyebrow">{site.domains}</p>
          </motion.div>

          <motion.h1 id="hero-heading" variants={v.riseIn} className="mt-6 text-4xl leading-[1.06] tracking-tight sm:text-5xl xl:text-[3.6rem]">
            We design and build digital products that move businesses
            <span className="text-accent-500"> forward.</span>
          </motion.h1>

          <motion.p variants={v.fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-silver-400">
            Websites, web applications, AI-powered solutions and digital experiences designed around your business,
            your users and your goals.
          </motion.p>

          <motion.div variants={v.fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to={routes.startProject} size="lg" onClick={() => trackEvent(events.START_PROJECT_CTA, { location: 'hero' })}>
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to={routes.work} size="lg" variant="secondary">
              View Our Work
            </Button>
          </motion.div>

          <motion.p variants={v.fadeUp} className="mt-9 font-display text-[11px] uppercase tracking-brand text-silver-600">
            {site.philosophy}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
        >
          {/* the brand ring and clover, centred on the window's right edge: half
              behind the window, half beside it, as on the brand cover */}
          <div
            className="pointer-events-none absolute left-full top-[46%] -z-10 hidden h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 lg:block"
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full border border-accent-700/40" />
            <div className="animate-ring-pulse absolute inset-0 rounded-full shadow-glow-ring" />
            <div className="absolute inset-[14%] rounded-full bg-gradient-to-b from-accent-950/50 to-transparent blur-3xl" />
            <div className="absolute inset-0 grid place-items-center">
              <CloverMark className="h-56 w-56 opacity-25" />
            </div>
          </div>
          <Builder />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroBuilder
