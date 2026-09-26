import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import Button from '../ui/Button'
import { carePlans, CARE_PRICING_NOTE } from '../../data/process'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/**
 * 07 — Continuous Care. (Spec §5.2, §12)
 * No prices: pricing is handled through the internal Commercial Engine.
 */
const ContinuousCare = () => {
  const v = useMotionVariants()

  return (
    <Section>
      <SectionHeader
        index="07"
        eyebrow="Continuous Care"
        title="Launch is a milestone, not the finish line."
        description="Most of the value in a digital product accumulates after it goes live. Three levels of ongoing support, scoped to what your product actually needs."
      />

      <motion.ul
        variants={v.stagger(0.08)}
        {...revealOnce}
        tabIndex={0}
        aria-label="Swipe for more"
        className="mobile-carousel grid gap-5 md:grid-cols-3"
      >
        {carePlans.map((plan) => (
          <motion.li
            key={plan.name}
            variants={v.fadeUp}
            className={`surface flex flex-col p-7 ${
              plan.highlighted ? 'border-accent-800/70 bg-ink-850' : ''
            }`}
          >
            {plan.highlighted && (
              <span
                className="absolute inset-x-0 top-0 h-px bg-accent-line"
                aria-hidden="true"
              />
            )}
            <p className="eyebrow">{plan.positioning}</p>
            <h3 className="mt-3 font-display text-xl font-semibold text-silver-100">{plan.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-silver-400">{plan.description}</p>

            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-silver-300">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        variants={v.fadeUp}
        {...revealOnce}
        className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-ink-800 bg-ink-900 p-6 sm:flex-row sm:items-center"
      >
        <p className="max-w-prose text-sm text-silver-400">{CARE_PRICING_NOTE}</p>
        <Button to={routes.startProject} variant="secondary" size="sm" className="shrink-0">
          Talk to us
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </motion.div>
    </Section>
  )
}

export default ContinuousCare
