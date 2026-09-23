import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import { testimonials, verifiedStats, capabilityProof, PROOF_POLICY_NOTE } from '../../data/proof'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/**
 * 08 — Proof. Verified proof only. (Spec §5.2, §14, §18)
 *
 * Stats and testimonials render only when the corresponding arrays in
 * proof.js have approved entries. Until then the section stands on capability
 * and process proof, which is what we can actually substantiate today.
 */
const Proof = () => {
  const v = useMotionVariants()
  const hasStats = verifiedStats.length > 0
  const hasTestimonials = testimonials.length > 0

  return (
    <Section muted>
      <SectionHeader
        index="08"
        eyebrow="Proof"
        title="What we will stand behind."
        description="We would rather show you how we work than publish numbers we cannot substantiate."
      />

      {/* Verified metrics — appears only once approved figures exist */}
      {hasStats && (
        <motion.ul
          variants={v.stagger(0.06)}
          {...revealOnce}
          className="mb-10 grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-4"
        >
          {verifiedStats.map((stat) => (
            <motion.li key={stat.label} variants={v.fadeUp} className="bg-ink-950 p-7">
              <p className="font-display text-4xl font-bold text-silver-100">{stat.value}</p>
              <p className="mt-2 text-sm text-silver-400">{stat.label}</p>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <motion.ul
        variants={v.stagger(0.06)}
        {...revealOnce}
        className="grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2"
      >
        {capabilityProof.map((item) => {
          const Icon = item.icon
          return (
            <motion.li key={item.title} variants={v.fadeUp} className="bg-ink-950 p-7">
              <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold text-silver-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{item.description}</p>
            </motion.li>
          )
        })}
      </motion.ul>

      {/* Verified testimonials — appears only once approved quotes exist */}
      {hasTestimonials && (
        <motion.ul
          variants={v.stagger(0.08)}
          {...revealOnce}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          {testimonials.map((t) => (
            <motion.li key={t.name} variants={v.fadeUp} className="surface p-7">
              <Quote className="h-5 w-5 text-accent-600" aria-hidden="true" />
              <blockquote className="mt-4 text-base leading-relaxed text-silver-200">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 text-sm text-silver-400">
                <span className="font-medium text-silver-200">{t.name}</span>
                {' - '}
                {t.role}, {t.company}
              </figcaption>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <motion.p
        variants={v.fadeUp}
        {...revealOnce}
        className="mt-8 max-w-prose text-sm leading-relaxed text-silver-500"
      >
        {PROOF_POLICY_NOTE}
      </motion.p>
    </Section>
  )
}

export default Proof
