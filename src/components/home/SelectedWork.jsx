import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import Button from '../ui/Button'
import WorkCard from '../work/WorkCard'
import { featuredProjects } from '../../data/projects'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/** 02 — Selected Work. Strongest 6–8 items. (Spec §5.2, §20) */
const SelectedWork = () => {
  const v = useMotionVariants()

  if (featuredProjects.length === 0) return null

  return (
    <Section id="work" muted>
      <SectionHeader
        index="02"
        eyebrow="Selected Work"
        title="Work we have delivered."
        description="AI, data, application and website projects, each with a full case study of the problem, the approach and how the system was built."
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
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {featuredProjects.map((project, i) => (
          <WorkCard key={project.slug} project={project} priority={i < 3} />
        ))}
      </motion.div>
    </Section>
  )
}

export default SelectedWork
