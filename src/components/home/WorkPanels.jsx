import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import ProjectVisual from '../ui/ProjectVisual'
import { homepageProjects, projectMeta } from '../../data/projects'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { canHover } from '../../lib/pointer'
import { trackEvent, events } from '../../lib/analytics'

/**
 * Selected work: the three flagship projects as panels side by side. One is
 * open at a time, showing the system as built and a line on what it does; the
 * others stay folded to their number and name. Hover (or tap) opens a panel.
 */
const WorkPanels = () => {
  const v = useMotionVariants()
  const [open, setOpen] = useState(0)

  if (homepageProjects.length === 0) return null

  return (
    <section className="bg-ink-900 py-20 md:py-24" aria-label="Selected work">
      <div className="container">
        <motion.div variants={v.fadeUp} {...revealOnce} className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">Built, shipped, running.</h2>
          </div>
          <Link to={routes.work} className="hidden shrink-0 items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 sm:inline-flex">
            All work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div variants={v.fadeUp} {...revealOnce} className="flex flex-col gap-3 lg:h-[30rem] lg:flex-row">
          {homepageProjects.map((project, i) => {
            const isOpen = open === i
            const { category, industry } = projectMeta(project)
            const href = `${routes.work}/${project.slug}`
            return (
              <article
                key={project.slug}
                // Opened by real pointer movement only: when the panels resize under a still
                // pointer, a neighbour must not open in turn.
                onPointerMove={(e) => e.pointerType === 'mouse' && open !== i && setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => !canHover() && setOpen(i)}
                style={{ flexGrow: isOpen ? 3.2 : 1 }}
                className={`group relative overflow-hidden rounded-2xl border bg-ink-950 transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:basis-0 ${
                  isOpen ? 'border-accent-700/70' : 'cursor-pointer border-ink-700 hover:border-ink-600'
                }`}
              >
                {isOpen ? (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex h-full flex-col"
                  >
                    <div className="relative min-h-0 flex-1 border-b border-ink-800 bg-ink-900/60">
                      <ProjectVisual project={project} aspect="aspect-[16/9] lg:aspect-auto lg:h-full" priority={i === 0} />
                    </div>
                    <div className="flex flex-col gap-3 p-6 md:flex-row md:items-end md:justify-between">
                      <div className="max-w-2xl">
                        <p className="font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">
                          {[category?.label, industry?.label].filter(Boolean).join(' · ')}
                        </p>
                        <h3 className="mt-1.5 text-xl font-semibold leading-snug text-silver-100">{project.title}</h3>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-silver-400">{project.summary}</p>
                      </div>
                      <Link
                        to={href}
                        onClick={() => trackEvent(events.WORK_CARD_CLICK, { project: project.slug, location: 'home_panels' })}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-500"
                      >
                        Case study
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="flex h-full w-full items-center gap-4 p-5 text-left lg:flex-col lg:items-start lg:justify-between lg:p-6"
                    aria-label={`Show ${project.title}`}
                  >
                    <span className="font-display text-3xl font-bold text-ink-600 transition-colors group-hover:text-accent-500 lg:text-5xl">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-semibold leading-snug text-silver-300 lg:[writing-mode:vertical-rl] lg:rotate-180 lg:text-lg">
                      {project.title}
                    </span>
                  </button>
                )}
              </article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default WorkPanels
