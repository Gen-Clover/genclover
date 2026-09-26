import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, Search, Loader2, AlertTriangle, Lock, Unlock } from 'lucide-react'
import Button from '../../components/ui/Button'
import { StatusBadge } from '../../components/careers/JobCard'
import { adminApi } from '../../lib/adminApi'
import { departmentLabel, formatPosted, locationText, statusOptions } from '../../lib/jobs'
import { routes } from '../../data/site'
import { useAdmin } from './AdminApp'

/** Every role, newest first, with quick close/reopen and delete. */
const AdminJobs = () => {
  const { onExpired } = useAdmin()
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  const handle = useCallback(
    (err) => {
      if (err.status === 401) onExpired()
      else setError(err.message)
    },
    [onExpired]
  )

  useEffect(() => {
    adminApi.listJobs().then(setJobs).catch(handle)
  }, [handle])

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase()
    return (jobs ?? []).filter(
      (j) =>
        (!status || j.status === status) &&
        (!term || `${j.title} ${departmentLabel(j.department)} ${(j.skills ?? []).join(' ')}`.toLowerCase().includes(term))
    )
  }, [jobs, q, status])

  const counts = useMemo(
    () => Object.fromEntries(statusOptions.map((o) => [o.value, (jobs ?? []).filter((j) => j.status === o.value).length])),
    [jobs]
  )

  const setJobStatus = async (job, next) => {
    setBusyId(job.id)
    setError(null)
    try {
      const saved = await adminApi.updateJob(job.id, { ...job, status: next })
      setJobs((list) => list.map((j) => (j.id === job.id ? saved : j)))
    } catch (err) {
      handle(err)
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (job) => {
    if (!window.confirm(`Delete “${job.title}”? This cannot be undone. Closing it keeps it as a record instead.`)) return
    setBusyId(job.id)
    setError(null)
    try {
      await adminApi.deleteJob(job.id)
      setJobs((list) => list.filter((j) => j.id !== job.id))
    } catch (err) {
      handle(err)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-silver-100">Job posts</h1>
          <p className="mt-1 text-sm text-silver-500">
            Open roles are listed and accept applications. Closed roles stay listed as a record. Drafts are only visible here.
          </p>
        </div>
        <Button to="/admin/jobs/new" size="md">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Post a job
        </Button>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:max-w-md">
        {statusOptions.map((o) => (
          <div key={o.value} className="bg-ink-900 px-4 py-3">
            <dt className="font-display text-[11px] uppercase tracking-brand text-silver-600">{o.label}</dt>
            <dd className="mt-0.5 text-xl font-semibold text-silver-100">{jobs ? counts[o.value] : '–'}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <label className="relative">
          <span className="sr-only">Search posts</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, department, skill"
            className="h-9 w-72 max-w-full rounded-lg border border-ink-600 bg-ink-900 pl-9 pr-3 text-sm text-silver-100 outline-none placeholder:text-silver-600 focus:border-accent-600"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="h-9 rounded-lg border border-ink-600 bg-ink-900 px-2.5 text-sm text-silver-200 outline-none focus:border-accent-600"
        >
          <option value="">All statuses</option>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-accent-700 bg-accent-950/50 p-3 text-sm text-silver-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-ink-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ink-900 font-display text-[11px] uppercase tracking-brand text-silver-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Posted</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800">
            {!jobs ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-silver-500">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-label="Loading" />
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-silver-500">
                  {jobs.length === 0 ? 'No job posts yet.' : 'No posts match.'}
                </td>
              </tr>
            ) : (
              visible.map((job) => (
                <tr key={job.id} className="bg-ink-950 hover:bg-ink-900/60">
                  <td className="px-4 py-3">
                    <Link to={`/admin/jobs/${job.id}`} className="font-medium text-silver-100 hover:text-accent-400">
                      {job.title}
                    </Link>
                    <div className="text-xs text-silver-500">{departmentLabel(job.department)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-silver-400">{locationText(job)}</td>
                  <td className="px-4 py-3 text-silver-400" title={new Date(job.postedAt).toLocaleString()}>
                    {formatPosted(job.postedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {busyId === job.id && <Loader2 className="mr-1 h-4 w-4 animate-spin text-silver-500" aria-label="Saving" />}
                      <IconLink to={`/admin/jobs/${job.id}`} label="Edit" icon={Pencil} />
                      {job.status !== 'draft' && (
                        <IconLink to={`${routes.careers}/${job.id}`} label="View on site" icon={Eye} newTab />
                      )}
                      {job.status === 'open' ? (
                        <IconButton label="Close applications" icon={Lock} disabled={busyId === job.id} onClick={() => setJobStatus(job, 'closed')} />
                      ) : (
                        <IconButton
                          label={job.status === 'draft' ? 'Publish' : 'Reopen'}
                          icon={Unlock}
                          disabled={busyId === job.id}
                          onClick={() => setJobStatus(job, 'open')}
                        />
                      )}
                      <IconButton label="Delete" icon={Trash2} danger disabled={busyId === job.id} onClick={() => remove(job)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const iconClasses = (danger) =>
  `grid h-8 w-8 place-items-center rounded-md text-silver-400 transition-colors disabled:opacity-40 ${
    danger ? 'hover:bg-accent-950 hover:text-accent-400' : 'hover:bg-ink-800 hover:text-silver-100'
  }`

const IconButton = ({ label, icon: Icon, onClick, disabled, danger }) => (
  <button type="button" title={label} aria-label={label} onClick={onClick} disabled={disabled} className={iconClasses(danger)}>
    <Icon className="h-4 w-4" aria-hidden="true" />
  </button>
)

const IconLink = ({ to, label, icon: Icon, newTab }) => (
  <Link to={to} title={label} aria-label={label} target={newTab ? '_blank' : undefined} className={iconClasses(false)}>
    <Icon className="h-4 w-4" aria-hidden="true" />
  </Link>
)

export default AdminJobs
