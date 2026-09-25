import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PageHero, Section } from '../components/ui/Section'
import Button from '../components/ui/Button'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { publishedProjects, getProjectsByCategory } from '../data/projects'
import { workCategories } from '../data/taxonomy'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants } from '../lib/motion'

/**
 * Work hub. (Spec §7, §21)
 *
 * With a small body of work, one list reads better than a filtered view: the
 * categories are shown as plain labels in the hero, and every project is listed
 * underneath. Each card carries its own category and industry. Old
 * `?category=` links still land here and simply show everything.
 */
const Work = () => {
  usePageMeta(pageMeta.work)
  const v = useMotionVariants()

  const categories = workCategories.filter((c) => getProjectsByCategory(c.id).length > 0)

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Work we have delivered."
        description="Websites, applications, AI, data and platform projects, each with a full write-up of the problem, the approach and how the system was built."
      >
        <div className="flex flex-col gap-8">
          <ul className="flex flex-wrap gap-2" aria-label="Project categories">
            {categories.map((category) => (
              <li
                key={category.id}
                className="rounded-md border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-silver-400"
              >
                {category.label}
              </li>
            ))}
          </ul>
          <div>
            <Button to={routes.startProject} size="lg">
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </PageHero>

      <Section>
        <h2 className="sr-only">All projects</h2>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={v.stagger(0.05)}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {publishedProjects.map((project, i) => (
            <WorkCard key={project.slug} project={project} priority={i < 3} />
          ))}
        </motion.div>
      </Section>

      <FinalCTA
        title="Want to see how this would work for you?"
        description="Tell us about the project and we will show you the closest thing we have built, and what we would do differently for your situation."
        location="work_hub"
      />
    </>
  )
}

export default Work
