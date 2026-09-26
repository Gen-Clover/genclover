import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import Button from '../ui/Button'
import { industryPages } from '../../data/industries'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/** 06 — Industries. Business sectors we work across. (Spec §5.2, §13) */
const IndustriesStrip = () => {
  const v = useMotionVariants()

  return (
    <Section muted>
      <SectionHeader
        index="06"
        eyebrow="Industries"
        title="Different sectors. The same engineering discipline."
        description="Every industry brings its own constraints, vocabulary and definition of done. We start by learning yours."
        action={
          <Button to={routes.industries} variant="secondary" size="md">
            All industries
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <motion.ul variants={v.stagger(0.04)} {...revealOnce} className="flex flex-wrap gap-2.5">
        {industryPages.map((industry) => {
          return (
            <motion.li key={industry.id} variants={v.fadeUp}>
              <Link
                to={`${routes.industries}/${industry.id}`}
                className="group inline-flex items-center gap-2.5 rounded-lg border border-ink-700 bg-ink-850 px-4 py-3 transition-colors hover:border-accent-700/60 hover:bg-ink-800"
              >
                <span className="text-sm font-medium text-silver-200 group-hover:text-silver-100">
                  {industry.label}
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-silver-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent-400"
                  aria-hidden="true"
                />
              </Link>
            </motion.li>
          )
        })}
      </motion.ul>
    </Section>
  )
}

export default IndustriesStrip
