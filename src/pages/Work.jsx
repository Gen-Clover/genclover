import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import { SplitScreen, GlassPanel, panelSwap } from '../components/ui/SplitScreen'
import Button from '../components/ui/Button'
import ProjectVisual from '../components/ui/ProjectVisual'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { publishedProjects, getProjectsByCategory, projectMeta } from '../data/projects'
import { workCategories } from '../data/taxonomy'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * Work hub. (Spec §7, §21)
 *
 * Screen 1: an index of every project on the left; hovering one shows its
 * animated architecture map, summary and stack in the panel on the right.
 * Below: every project as a card, with its category and industry.
 */

const ProjectPreview = ({ project }) => {
  const { category, industry } = projectMeta(project)
  return (
    <motion.div {...panelSwap} className="flex flex-col">
      <ProjectVisual project={project} aspect="aspect-[16/8] [@media(max-height:800px)]:aspect-[16/6]" />
      <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-brand text-silver-500">
        {[category?.label, industry?.label].filter(Boolean).join(' · ')}
      </p>
      <h2 className="mt-2 text-xl font-semibold leading-snug text-silver-100 xl:text-2xl">
        {project.title}
      </h2>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-silver-300 [@media(min-height:860px)]:line-clamp-3">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 6).map((tech) => (
          <li
            key={tech}
            className="rounded border border-ink-700 bg-ink-950/70 px-2 py-0.5 text-[11px] text-silver-400"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Button to={`${routes.work}/${project.slug}`} size="sm">
          Read the case study
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  )
}

const Work = () => {
  usePageMeta(pageMeta.work)
  const v = useMotionVariants()
  const [active, setActive] = useState(publishedProjects[0]?.slug)
  const activeProject = publishedProjects.find((p) => p.slug === active) ?? publishedProjects[0]
  const categories = workCategories.filter((c) => getProjectsByCategory(c.id).length > 0)

  return (
    <>
      <SplitScreen
        label="Work"
        left={
          <>
            <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)}>
              <motion.p variants={v.fadeUp} className="eyebrow">
                Work
              </motion.p>
              <motion.h1
                variants={v.fadeUp}
                className="mt-3 text-4xl leading-[1.05] tracking-tight [@media(min-height:820px)]:xl:text-5xl"
              >
                Work we have delivered.
              </motion.h1>
              <motion.p variants={v.fadeUp} className="mt-3 max-w-xl text-base leading-relaxed text-silver-400">
                Each project has a full write-up of the problem, the approach and how the system was
                built. Hover one to preview it.
              </motion.p>
              <motion.ul variants={v.fadeUp} className="mt-4 flex flex-wrap gap-1.5 [@media(max-height:800px)]:hidden" aria-label="Project categories">
                {categories.map((c) => (
                  <li
                    key={c.id}
                    className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-silver-500"
                  >
                    {c.label}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Project index — scrolls inside itself if the screen is short */}
            <motion.ol
              initial="hidden"
              animate="visible"
              variants={v.stagger(0.025, 0.2)}
              className="mt-5 min-h-0 flex-initial divide-y divide-ink-800 overflow-y-auto rounded-xl border border-ink-800 bg-ink-900/40"
            >
              {publishedProjects.map((project, i) => {
                const { category } = projectMeta(project)
                const selected = project.slug === activeProject?.slug
                return (
                  <motion.li key={project.slug} variants={v.fadeUp}>
                    <Link
                      to={`${routes.work}/${project.slug}`}
                      onMouseEnter={() => setActive(project.slug)}
                      onFocus={() => setActive(project.slug)}
                      className={`group flex items-center gap-4 px-4 py-1.5 transition-colors [@media(min-height:900px)]:py-2 [@media(min-height:1000px)]:py-2.5 ${
                        selected ? 'bg-accent-950/40' : 'hover:bg-ink-900'
                      }`}
                    >
                      <span
                        className={`w-6 shrink-0 font-display text-[11px] font-semibold tracking-brand ${
                          selected ? 'text-accent-400' : 'text-silver-600'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate text-sm font-medium ${
                          selected ? 'text-silver-100' : 'text-silver-300'
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="hidden shrink-0 text-[11px] text-silver-600 xl:inline">
                        {category?.label}
                      </span>
                      <ArrowUpRight
                        className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-accent-400' : 'text-silver-700'}`}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ol>
          </>
        }
        right={
          <GlassPanel>
            <AnimatePresence mode="wait">
              {activeProject && <ProjectPreview key={activeProject.slug} project={activeProject} />}
            </AnimatePresence>
          </GlassPanel>
        }
      />

      <Section>
        <SectionHeader
          eyebrow="All projects"
          title="Every project, in full."
          description="Each card opens a case study with the architecture, the safeguards and the technology behind it."
          action={
            <Button to={routes.startProject} size="md">
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
        <motion.div
          variants={v.stagger(0.05)}
          {...revealOnce}
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
