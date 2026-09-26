import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Maximize2 } from 'lucide-react'
import ProjectVisual from '../ui/ProjectVisual'
import DiagramPreview from './DiagramPreview'
import { projectMeta } from '../../data/projects'
import { useMotionVariants } from '../../lib/motion'
import { canHover } from '../../lib/pointer'
import { trackEvent, events } from '../../lib/analytics'

/** Pause before the hover preview opens, so sweeping across cards does not flash it. */
const HOVER_DELAY_MS = 180

/**
 * A single Work item. (Spec §7, §21)
 *
 * Every card links to a dedicated detail page. The visual is the project's own
 * architecture, drawn from its case study. Hovering the diagram (only the
 * diagram, not the whole card) opens it enlarged; the expand button does the
 * same for touch screens and keyboards.
 */
const WorkCard = ({ project, priority = false, className = '' }) => {
  const v = useMotionVariants()
  const { industry, category } = projectMeta(project)
  const visualRef = useRef(null)
  const timer = useRef(null)
  const [preview, setPreview] = useState(null) // null | 'hover' | 'modal'

  const cs = project.caseStudy
  const hasDiagram = Boolean(cs?.diagram || cs?.architecture?.layers?.length || cs?.flow?.length)
  const href = `/work/${project.slug}`

  const track = () =>
    trackEvent(events.WORK_CARD_CLICK, {
      project: project.slug,
      category: project.category,
      status: project.status,
    })

  const onEnter = () => {
    if (!hasDiagram || !canHover()) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPreview((p) => p ?? 'hover'), HOVER_DELAY_MS)
  }
  const onLeave = () => {
    clearTimeout(timer.current)
    setPreview((p) => (p === 'hover' ? null : p))
  }
  const close = useCallback(() => setPreview(null), [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <motion.article
      variants={v.fadeUp}
      className={`surface surface-hover group relative flex h-full flex-col overflow-hidden rounded-xl ${className}`}
    >
      {/* The diagram: hover target for the preview, and a link like the rest of the card */}
      <div ref={visualRef} className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <Link to={href} onClick={track} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
          <ProjectVisual
            project={project}
            aspect="aspect-[16/9]"
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        {hasDiagram && (
          <button
            type="button"
            onClick={() => {
              clearTimeout(timer.current)
              setPreview('modal')
            }}
            aria-label={`Enlarge the ${project.title} architecture diagram`}
            title="Enlarge diagram"
            className="expand-hint absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center rounded-lg border border-ink-700 bg-ink-900/80 text-silver-300 backdrop-blur-sm transition-colors hover:border-accent-600 hover:text-accent-400"
          >
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <Link to={href} onClick={track} className="block flex-1 p-5 md:p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-silver-500">
          <span>{category?.label}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-600" />
          <span>{industry?.label}</span>
        </div>

        <h3 className="mt-3 flex items-start justify-between gap-3 text-lg font-semibold text-silver-100 transition-colors group-hover:text-accent-400">
          <span>{project.title}</span>
          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-silver-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
            aria-hidden="true"
          />
        </h3>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-silver-400 sm:line-clamp-3">
          {project.summary}
        </p>

        <ul className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
          {project.technologies.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[11px] text-silver-400"
            >
              {tech}
            </li>
          ))}
        </ul>
      </Link>

      {hasDiagram && (
        <DiagramPreview project={project} mode={preview} anchorRef={visualRef} onClose={close} />
      )}
    </motion.article>
  )
}

export default WorkCard
