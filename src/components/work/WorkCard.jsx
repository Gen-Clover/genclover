import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import ProjectVisual from '../ui/ProjectVisual'
import { projectMeta } from '../../data/projects'
import { useMotionVariants } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/**
 * A single Work item. (Spec §7, §21)
 *
 * Every card links to a dedicated detail page. The visual is the project's own
 * delivery flow, drawn from its case study.
 */
const WorkCard = ({ project, priority = false, className = '' }) => {
  const v = useMotionVariants()
  const { industry, category } = projectMeta(project)

  return (
    <motion.article variants={v.fadeUp} className={`group ${className}`}>
      <Link
        to={`/work/${project.slug}`}
        className="surface surface-hover block h-full overflow-hidden rounded-xl"
        onClick={() =>
          trackEvent(events.WORK_CARD_CLICK, {
            project: project.slug,
            category: project.category,
            status: project.status,
          })
        }
      >
        <div className="relative overflow-hidden">
          <ProjectVisual
            project={project}
            aspect="aspect-[16/9]"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-silver-500">
            <span>{category?.label}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-600" />
            <span>{industry?.label}</span>
          </div>

          <h3 className="mt-3 flex items-start justify-between gap-3 text-lg font-semibold text-silver-100 transition-colors group-hover:text-white">
            <span>{project.title}</span>
            <ArrowUpRight
              className="mt-0.5 h-4 w-4 shrink-0 text-silver-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
              aria-hidden="true"
            />
          </h3>

          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-silver-400">
            {project.summary}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[11px] text-silver-400"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.article>
  )
}

export default WorkCard
