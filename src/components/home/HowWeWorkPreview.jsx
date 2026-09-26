import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import Button from '../ui/Button'
import { ProcessRail } from '../process/ProcessFlow'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/**
 * 02 — How We Work.
 *
 * The seven stages play as a flow rather than sitting in a static grid: the
 * rail advances Discover → Grow on its own, filling each connector as it goes,
 * and the stage below explains itself as it becomes active. Hovering or
 * focusing pauses it so a visitor can read at their own pace.
 */
const HowWeWorkPreview = () => {
  const v = useMotionVariants()

  return (
    <Section>
      <SectionHeader
        index="02"
        eyebrow="How We Work"
        title="A process built to remove surprises."
        description="Seven stages, each with a defined output. You always know what is being worked on, what comes next, and what has been agreed."
        action={
          <Button to={routes.howWeWork} variant="secondary" size="md">
            The full process
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <motion.div variants={v.fadeUp} {...revealOnce}>
        <ProcessRail />
      </motion.div>
    </Section>
  )
}

export default HowWeWorkPreview
