import { getStatus } from '../../data/taxonomy'

/** Neutral metadata pill — industry, technology, capability. */
export const Badge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-md border border-ink-700 bg-ink-800/70 px-2.5 py-1 text-xs font-medium text-silver-300 ${className}`}
  >
    {children}
  </span>
)

/**
 * Project status badge. (Spec §7.2 / §21)
 * Every published Work item must carry one of these, and the wording comes from
 * the taxonomy — never from a component — so a concept can never be relabeled
 * as client work by accident.
 */
/**
 * Client and internal use a genuinely different hue rather than an inverted
 * neutral, so they need an explicit per-theme value. The `dark:` variant is
 * wired to `[data-theme="dark"]` in tailwind.config.js.
 */
const statusStyles = {
  client:
    'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-600/40 dark:bg-emerald-950/50 dark:text-emerald-300',
  concept: 'border-accent-700/50 bg-accent-950/60 text-accent-300',
  internal:
    'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700/40 dark:bg-sky-950/50 dark:text-sky-300',
  confidential: 'border-ink-600 bg-ink-800 text-silver-300',
}

export const StatusBadge = ({ status, className = '' }) => {
  const resolved = getStatus(status)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-brand ${
        statusStyles[resolved.id]
      } ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      {resolved.publicLabel}
    </span>
  )
}

export default Badge
