import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
 * A compact heading, then every project as a card straight away. Each card
 * carries its category, industry and an animated architecture map drawn from
 * its case study.
 */
const Work = () => {
  usePageMeta(pageMeta.work)
  const v = useMotionVariants()
  const categories = workCategories.filter((c) => getProjectsByCategory(c.id).length > 0)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-accent-900/25 blur-[130px]"
          aria-hidden="true"
        />
        <div className="container relative pb-14 pt-28 md:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={v.stagger(0.06)}
            className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-2xl">
              <motion.p variants={v.fadeUp} className="eyebrow">
                Work
              </motion.p>
              <motion.h1 variants={v.fadeUp} className="mt-3 text-4xl leading-[1.05] tracking-tight xl:text-5xl">
                Work we have delivered.
              </motion.h1>
              <motion.p variants={v.fadeUp} className="mt-3 text-base leading-relaxed text-silver-400">
                Each project opens a full case study: the problem, the approach, the architecture and
                the technology behind it.
              </motion.p>
            </div>
            <motion.div variants={v.fadeUp} className="flex flex-col gap-4 lg:items-end">
              <ul className="flex flex-wrap gap-1.5 lg:justify-end" aria-label="Project categories">
                {categories.map((c) => (
                  <li
                    key={c.id}
                    className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-silver-500"
                  >
                    {c.label}
                  </li>
                ))}
              </ul>
              <Button to={routes.startProject} size="md">
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>

          <h2 className="sr-only">All projects</h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={v.stagger(0.05, 0.2)}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {publishedProjects.map((project, i) => (
              <WorkCard key={project.slug} project={project} priority={i < 6} />
            ))}
          </motion.div>
        </div>
      </section>

      <FinalCTA
        title="Seen something close to what you need?"
        description="Point us to the project nearest to yours and tell us what is different. We will come back with how we would build it for you."
        location="work_hub"
      />
    </>
  )
}

export default Work
