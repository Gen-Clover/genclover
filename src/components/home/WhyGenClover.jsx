import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import { CloverMark } from '../brand/Logo'
import { differentiators } from '../../data/process'
import { site } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/**
 * 05 — Why Gen Clover. Approach and value. (Spec §5.2)
 * The four brand pillars moved into the hero; this section keeps the meaning
 * behind the name and the working commitments.
 * Capability and process proof only — no client counts, no satisfaction scores.
 */
const WhyGenClover = () => {
  const v = useMotionVariants()

  return (
    <Section muted>
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader
            index="05"
            eyebrow="Why Gen Clover"
            title="What working with us looks like."
            description={site.meaning}
            className="mb-10"
          />

          <div className="flex items-center gap-4 rounded-xl border border-ink-700 bg-ink-850 p-5">
            <CloverMark className="h-9 w-9 shrink-0" />
            <p className="font-display text-sm tracking-wide text-silver-200">{site.tagline}</p>
          </div>
        </div>

        <motion.ul variants={v.stagger(0.06)} {...revealOnce} className="grid gap-px self-start overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2">
          {differentiators.map((item) => (
            <motion.li key={item.title} variants={v.fadeUp} className="bg-ink-900 p-6">
              <Check className="h-4 w-4 text-accent-500" aria-hidden="true" />
              <h3 className="mt-4 text-sm font-semibold text-silver-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{item.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  )
}

export default WhyGenClover
