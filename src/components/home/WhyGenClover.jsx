import { motion } from 'framer-motion'
import { Target, Code2, ShieldCheck, MessagesSquare, Blocks, RefreshCw } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import { CloverMark } from '../brand/Logo'
import { differentiators } from '../../data/process'
import { site } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/**
 * 05 — Why Gen Clover. Approach and value. (Spec §5.2)
 * Header across the top with the meaning of the name beside it, then the six
 * working commitments as an even three-column grid.
 */
const ICONS = {
  alignment: Target,
  quality: Code2,
  security: ShieldCheck,
  communication: MessagesSquare,
  extensible: Blocks,
  partnership: RefreshCw,
}

const WhyGenClover = () => {
  const v = useMotionVariants()

  return (
    <Section muted>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <SectionHeader
          index="05"
          eyebrow="Why Gen Clover"
          title="What working with us looks like."
          className="!mb-0"
        />
        <motion.div
          variants={v.fadeUp}
          {...revealOnce}
          className="flex items-start gap-4 rounded-xl border border-ink-700 bg-ink-850 p-5"
        >
          <CloverMark className="h-10 w-10 shrink-0" />
          <div>
            <p className="text-sm leading-relaxed text-silver-300">{site.meaning}</p>
            <p className="mt-1.5 font-display text-xs uppercase tracking-brand text-accent-400">
              {site.tagline}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.ul
        variants={v.stagger(0.06)}
        {...revealOnce}
        tabIndex={0}
        aria-label="Swipe for more"
        className="mobile-carousel mt-10 grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3"
      >
        {differentiators.map((item, i) => {
          const Icon = ICONS[item.key] ?? Target
          return (
            <motion.li
              key={item.title}
              variants={v.fadeUp}
              className="group relative bg-ink-950 p-7 transition-colors hover:bg-ink-900"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900 transition-colors group-hover:border-accent-700/60">
                  <Icon className="h-[18px] w-[18px] text-accent-500" aria-hidden="true" />
                </span>
                <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-6 text-base font-semibold text-silver-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{item.description}</p>
            </motion.li>
          )
        })}
      </motion.ul>
    </Section>
  )
}

export default WhyGenClover
