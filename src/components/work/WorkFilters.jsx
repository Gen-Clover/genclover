import { motion, useReducedMotion } from 'framer-motion'
import { workFilters } from '../../data/taxonomy'
import { getProjectsByCategory } from '../../data/projects'

/**
 * Work category filters. (Spec §7.1)
 *
 * Rendered as a radiogroup so the whole set is reachable with one Tab stop and
 * navigable with arrow keys. Counts come from the project data, and a category
 * with no published work is disabled rather than hidden — that way the Work
 * taxonomy stays visible and honest instead of quietly shrinking.
 */
const WorkFilters = ({ active, onChange }) => {
  const reduced = useReducedMotion()

  const handleKeyDown = (e) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const available = workFilters.filter((f) => getProjectsByCategory(f.id).length > 0)
    const index = available.findIndex((f) => f.id === active)
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
    const next = available[(index + delta + available.length) % available.length]
    if (next) onChange(next.id)
  }

  return (
    <div
      role="radiogroup"
      aria-label="Filter work by category"
      onKeyDown={handleKeyDown}
      className="flex flex-wrap gap-2"
    >
      {workFilters.map((filter) => {
        const count = getProjectsByCategory(filter.id).length
        const isActive = active === filter.id
        const empty = count === 0

        return (
          <button
            key={filter.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${filter.label}, ${count} ${count === 1 ? 'project' : 'projects'}`}
            tabIndex={isActive ? 0 : -1}
            disabled={empty}
            onClick={() => onChange(filter.id)}
            className={`relative inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'border-accent-600 text-silver-100'
                : empty
                  ? 'cursor-not-allowed border-ink-800 text-silver-600'
                  : 'border-ink-700 text-silver-400 hover:border-ink-600 hover:text-silver-100'
            }`}
          >
            {isActive && !reduced && (
              <motion.span
                layoutId="work-filter-active"
                className="absolute inset-0 -z-10 rounded-lg bg-accent-950/70"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {isActive && reduced && (
              <span className="absolute inset-0 -z-10 rounded-lg bg-accent-950/70" />
            )}
            {filter.label}
            <span className={`text-xs ${isActive ? 'text-accent-400' : 'text-silver-600'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default WorkFilters
