import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import Button from '../ui/Button'
import WorkCard from '../work/WorkCard'
import { homepageProjects } from '../../data/projects'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { useSwipeRow } from '../ui/SwipeRow'

/** 03 — Selected Work. The three flagship projects; the rest are on /work. */
const SelectedWork = () => {
  const v = useMotionVariants()
  const work = useSwipeRow(homepageProjects.length, 'Selected work')

  if (homepageProjects.length === 0) return null

  return (
    <Section id="work" muted>
      <SectionHeader
        index="03"
        eyebrow="Selected Work"
        title="Work we have delivered."
        description="Three recent projects across AI and data, each with a full case study of the problem, the approach and how the system was built."
        action={
          <Button to={routes.work} variant="secondary" size="md">
            View all work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <motion.div
        variants={v.stagger(0.07)}
        {...revealOnce}
        ref={work.ref}
        {...work.props}
        className="mobile-carousel grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {homepageProjects.map((project, i) => (
          <WorkCard key={project.slug} project={project} priority={i < 3} />
        ))}
      </motion.div>
      {work.dots}
    </Section>
  )
}

export default SelectedWork
