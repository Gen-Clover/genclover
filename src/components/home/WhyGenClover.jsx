import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import { CloverMark } from '../brand/Logo'
import { differentiators } from '../../data/process'
import { brandPillars } from '../../data/taxonomy'
import { site } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/**
 * 04 — Why Gen Clover. Approach and value. (Spec §5.2)
 * Capability and process proof only — no client counts, no satisfaction scores.
 */
const WhyGenClover = () => {
  const v = useMotionVariants()

  return (
    <Section muted>
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader
            index="04"
            eyebrow="Why Gen Clover"
            title="Technology at the center. Four ideas working together."
            description={site.meaning}
            className="mb-10"
          />

          {/* Intelligence → Innovation → Automation → Growth */}
          <motion.ol
            variants={v.stagger(0.07)}
            {...revealOnce}
            className="relative space-y-5 border-l border-ink-700 pl-7"
          >
            <div
              className="absolute -left-px top-2 h-16 w-px bg-gradient-to-b from-accent-500 to-transparent"
              aria-hidden="true"
            />
            {brandPillars.map((pillar) => (
              <motion.li key={pillar.label} variants={v.fadeUp} className="relative">
                <span
                  className="absolute -left-[33px] top-1.5 h-2 w-2 rounded-full border border-accent-600 bg-ink-900"
                  aria-hidden="true"
                />
                <h3 className="font-display text-sm font-semibold uppercase tracking-brand text-silver-100">
                  {pillar.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-silver-400">
                  {pillar.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>

          <div className="mt-10 flex items-center gap-4 rounded-xl border border-ink-700 bg-ink-850 p-5">
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
