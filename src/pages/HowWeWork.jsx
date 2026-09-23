import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { ProcessRail, ProcessTimeline } from '../components/process/ProcessFlow'
import { carePlans, CARE_PRICING_NOTE } from '../data/process'
import { PRICING_STATEMENT } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/** How We Work — the seven delivery stages in full. (Spec §11, §12) */
const HowWeWork = () => {
  usePageMeta(pageMeta.howWeWork)
  const v = useMotionVariants()

  return (
    <>
      <PageHero
        eyebrow="How We Work"
        title="Seven stages, each with a defined output."
        description="You should never have to ask what is happening or what comes next. Every stage produces something you can review before the following one begins."
      >
        <Button to={routes.startProject} size="lg">
          Start a Project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PageHero>

      {/* The flow, played as a rail — the same component the homepage uses */}
      <Section className="!pb-10">
        <motion.div variants={v.fadeUp} {...revealOnce}>
          <ProcessRail />
        </motion.div>
      </Section>

      {/* …then every stage in full, on a scroll-drawn timeline */}
      <Section className="!pt-4">
        <ProcessTimeline />
      </Section>

      {/* Continuous care, in full */}
      <Section muted>
        <SectionHeader
          eyebrow="Continuous Care"
          title="What happens after launch."
          description="Three levels of ongoing engagement. Which one fits depends on how much the product is expected to change."
        />

        <motion.ul variants={v.stagger(0.08)} {...revealOnce} className="grid gap-5 md:grid-cols-3">
          {carePlans.map((plan) => (
            <motion.li
              key={plan.name}
              variants={v.fadeUp}
              className={`surface flex flex-col p-7 ${
                plan.highlighted ? 'border-accent-800/70 bg-ink-850' : ''
              }`}
            >
              <p className="eyebrow">{plan.positioning}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-silver-100">
                {plan.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-silver-400">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-silver-300">
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <p className="rounded-xl border border-ink-800 bg-ink-950 p-6 text-sm leading-relaxed text-silver-400">
            {CARE_PRICING_NOTE}
          </p>
          <p className="rounded-xl border border-ink-800 bg-ink-950 p-6 text-sm leading-relaxed text-silver-400">
            {PRICING_STATEMENT}
          </p>
        </div>
      </Section>

      <FinalCTA location="how_we_work" />
    </>
  )
}

export default HowWeWork
