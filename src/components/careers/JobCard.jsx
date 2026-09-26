import { Link } from 'react-router-dom'
import {
  Code,
  BarChart3,
  Bot,
  PenTool,
  Cloud,
  Megaphone,
  HeartHandshake,
  Settings,
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
} from 'lucide-react'
import {
  employmentTypeLabel,
  departmentLabel,
  formatExperience,
  formatPosted,
  locationText,
} from '../../lib/jobs'

const DEPARTMENT_ICONS = {
  engineering: Code,
  data: BarChart3,
  ai: Bot,
  design: PenTool,
  devops: Cloud,
  marketing: Megaphone,
  sales: HeartHandshake,
  operations: Settings,
}

export const DepartmentIcon = ({ department, className = 'h-5 w-5' }) => {
  const Icon = DEPARTMENT_ICONS[department] ?? Briefcase
  return <Icon className={`${className} text-accent-500`} aria-hidden="true" />
}

export const StatusBadge = ({ status, className = '' }) => {
  const styles = {
    open: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-600/50 dark:bg-transparent dark:text-emerald-400',
    closed: 'border-ink-600 text-silver-500',
    draft: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-600/50 dark:bg-transparent dark:text-amber-400',
  }
  const labels = { open: 'Open', closed: 'Closed', draft: 'Draft' }
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-brand ${styles[status] ?? styles.closed} ${className}`}
    >
      {labels[status] ?? status}
    </span>
  )
}

/** The small facts row used on cards and in the detail header. */
export const JobFacts = ({ job, className = '' }) => (
  <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-silver-500 ${className}`}>
    <li className="inline-flex items-center gap-1.5">
      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
      {locationText(job)}
    </li>
    <li className="inline-flex items-center gap-1.5">
      <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
      {employmentTypeLabel(job.employmentType)}
    </li>
    <li className="inline-flex items-center gap-1.5">
      <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
      {formatExperience(job)}
    </li>
    <li className="inline-flex items-center gap-1.5">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      {formatPosted(job.postedAt)}
    </li>
  </ul>
)

/**
 * One result in the list. On large screens it selects the role into the
 * detail pane (the link carries ?job=), on small screens it opens the full page.
 */
const JobCard = ({ job, to, selected, onSelect }) => (
  <Link
    to={to}
    onClick={onSelect}
    aria-current={selected ? 'true' : undefined}
    className={`group flex gap-4 rounded-xl border p-4 transition-colors ${
      selected
        ? 'border-accent-600 bg-accent-950/30'
        : 'border-ink-700 bg-ink-850/80 hover:border-accent-700/60 hover:bg-ink-800/80'
    }`}
  >
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-ink-700 bg-ink-900">
      <DepartmentIcon department={job.department} />
    </span>
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-silver-100 group-hover:text-accent-400">
          {job.title}
        </h3>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-0.5 text-sm text-silver-400">{departmentLabel(job.department)}</p>
      <JobFacts job={job} className="mt-2" />
      {job.skills?.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Skills">
          {job.skills.slice(0, 4).map((skill) => (
            <li
              key={skill}
              className="rounded border border-ink-700 bg-ink-900 px-1.5 py-0.5 text-[11px] text-silver-400"
            >
              {skill}
            </li>
          ))}
          {job.skills.length > 4 && (
            <li className="px-1 py-0.5 text-[11px] text-silver-600">+{job.skills.length - 4}</li>
          )}
        </ul>
      )}
    </div>
  </Link>
)

export default JobCard
