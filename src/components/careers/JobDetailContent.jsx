import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Send, Mail, ExternalLink, XCircle } from 'lucide-react'
import Button from '../ui/Button'
import { DepartmentIcon, StatusBadge, JobFacts } from './JobCard'
import ApplyDialog from './ApplyDialog'
import {
  departmentLabel,
  employmentTypeLabel,
  workplaceLabel,
  formatExperience,
  formatSalary,
} from '../../lib/jobs'
import { routes } from '../../data/site'

/**
 * Opens the apply form for `job`, or a general application when `job` is null.
 * Replaces the old mailto: links, which depend on the visitor's computer
 * having a mail app configured and so often did nothing.
 */
export const ApplyButton = ({ job = null, children, ...buttonProps }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} {...buttonProps}>
        {children}
      </Button>
      {open && <ApplyDialog job={job} onClose={() => setOpen(false)} />}
    </>
  )
}

const Section = ({ title, children }) => (
  <section className="border-t border-ink-800 pt-5">
    <h3 className="text-sm font-semibold uppercase tracking-brand text-silver-300 font-display">{title}</h3>
    <div className="mt-3">{children}</div>
  </section>
)

/** Apply button, or the closed notice with a general application instead. */
export const ApplyBlock = ({ job, className = '' }) =>
  job.status === 'open' ? (
    <div className={className}>
      <ApplyButton job={job} size="md">
        <Send className="h-4 w-4" aria-hidden="true" />
        Apply for this role
      </ApplyButton>
      <p className="mt-2 text-xs leading-relaxed text-silver-500">
        A short form and your CV. Takes about two minutes.
      </p>
    </div>
  ) : (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      <span className="inline-flex items-center gap-2 text-sm text-silver-400">
        <XCircle className="h-4 w-4 text-silver-500" aria-hidden="true" />
        Applications for this role are closed.
      </span>
      <ApplyButton variant="secondary" size="sm">
        <Mail className="h-4 w-4" aria-hidden="true" />
        Send a general application
      </ApplyButton>
    </div>
  )

/**
 * The whole role: header, key facts and the description sections.
 * Used in the careers detail pane (`inPane`) and on /careers/:id.
 */
const JobDetailContent = ({ job, inPane = false, headingLevel: H = 'h2' }) => {
  const salary = formatSalary(job.salary)
  const facts = [
    ['Experience', formatExperience(job)],
    ['Job type', employmentTypeLabel(job.employmentType)],
    ['Workplace', workplaceLabel(job.workplace)],
    ['Location', job.locations?.length ? job.locations.join(', ') : 'Anywhere'],
    ['Department', departmentLabel(job.department)],
    ['Openings', job.openings ? String(job.openings) : null],
    ['Posted', new Date(job.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
    ['Salary', salary],
  ].filter(([, value]) => value)

  return (
    <article>
      <header>
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-ink-700 bg-ink-900">
            <DepartmentIcon department={job.department} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <H className={`font-semibold leading-tight text-silver-100 ${inPane ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
                {job.title}
              </H>
              <StatusBadge status={job.status} />
            </div>
            <p className="mt-1 text-sm text-silver-400">{departmentLabel(job.department)} · Gen Clover</p>
            <JobFacts job={job} className="mt-2" />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <ApplyBlock job={job} />
          {inPane && (
            <Link
              to={`${routes.careers}/${job.id}`}
              className="inline-flex items-center gap-1.5 py-2 text-sm text-silver-400 transition-colors hover:text-accent-400"
            >
              Open full page
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </header>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink-800 bg-ink-800 sm:grid-cols-4">
        {facts.map(([label, value]) => (
          <div key={label} className="bg-ink-900 px-3.5 py-2.5">
            <dt className="text-[11px] uppercase tracking-brand text-silver-600 font-display">{label}</dt>
            <dd className="mt-0.5 text-sm text-silver-200">{value}</dd>
          </div>
        ))}
        {/* Fill the last row so the grid never shows an empty gap. */}
        {Array.from({ length: (4 - (facts.length % 4)) % 4 }, (_, i) => (
          <div key={i} className={`bg-ink-900 ${i === 0 && facts.length % 2 === 1 ? '' : 'hidden sm:block'}`} aria-hidden="true" />
        ))}
      </dl>

      <div className="mt-5 space-y-5">
        {job.summary && <p className="text-sm leading-relaxed text-silver-300">{job.summary}</p>}

        <Section title="About the role">
          <p className="whitespace-pre-line text-sm leading-relaxed text-silver-400">{job.description}</p>
        </Section>

        {job.responsibilities?.length > 0 && (
          <Section title="What you will do">
            <ul className="space-y-2">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-silver-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.requirements?.length > 0 && (
          <Section title="What we are looking for">
            <ul className="space-y-2">
              {job.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-silver-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.niceToHave?.length > 0 && (
          <Section title="Nice to have">
            <ul className="space-y-2">
              {job.niceToHave.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-silver-400">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.skills?.length > 0 && (
          <Section title="Skills">
            <ul className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <li key={skill} className="rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1 text-xs text-silver-300">
                  {skill}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </article>
  )
}

export default JobDetailContent
