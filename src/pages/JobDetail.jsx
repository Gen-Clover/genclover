import { useParams, Navigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import JobDetailContent from '../components/careers/JobDetailContent'
import { DepartmentIcon, StatusBadge } from '../components/careers/JobCard'
import { usePublicJob, usePublicJobs } from '../lib/jobsApi'
import { locationText } from '../lib/jobs'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'

/**
 * One role, on its own page (shared links, and small screens). The same
 * content as the careers detail pane, with other roles on the side, instead
 * of the old full-width, widely spaced sections.
 */
const JobDetail = () => {
  const { id } = useParams()
  const { job, loading, notFound } = usePublicJob(id)
  const { jobs } = usePublicJobs()

  usePageMeta({
    title: job ? `${job.title}, Careers | Gen Clover` : undefined,
    description: job?.metaDescription || job?.summary,
    path: `${routes.careers}/${id}`,
    // A closed role should not keep attracting search traffic.
    noIndex: job?.status === 'closed',
  })

  if (notFound) return <Navigate to={routes.careers} replace />

  const others = jobs
    .filter((j) => j.id !== id)
    .sort((a, b) => (a.status === 'open' ? 0 : 1) - (b.status === 'open' ? 0 : 1))
    .slice(0, 4)

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50" aria-hidden="true" />
      <div className="container relative pb-14 pt-24 md:pt-28">
        <Link
          to={routes.careers}
          className="-my-1.5 inline-flex items-center gap-2 py-1.5 text-sm text-silver-500 transition-colors hover:text-accent-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All roles
        </Link>

        <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="surface surface-static p-6 md:p-8">
            {loading || !job ? (
              <div className="space-y-4" aria-busy="true">
                <div className="h-8 w-2/3 animate-pulse rounded bg-ink-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-ink-800" />
                <div className="h-40 animate-pulse rounded bg-ink-800" />
              </div>
            ) : (
              <JobDetailContent job={job} headingLevel="h1" />
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            {others.length > 0 && (
              <div className="surface surface-static p-5">
                <p className="eyebrow">Other roles</p>
                <ul className="mt-3 divide-y divide-ink-800">
                  {others.map((other) => (
                    <li key={other.id}>
                      <Link
                        to={`${routes.careers}/${other.id}`}
                        className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <DepartmentIcon department={other.department} className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-silver-200 group-hover:text-accent-400">
                            {other.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-silver-500">{locationText(other)}</span>
                        </span>
                        <StatusBadge status={other.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={routes.careers}
                  className="mt-4 inline-block text-sm text-accent-400 transition-colors hover:text-accent-300"
                >
                  Search all roles →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

export default JobDetail
