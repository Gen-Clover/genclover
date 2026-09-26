import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertTriangle, Check } from 'lucide-react'
import Button from '../../components/ui/Button'
import { TextField, FieldError } from '../../components/form/fields'
import JobCard from '../../components/careers/JobCard'
import { adminApi } from '../../lib/adminApi'
import {
  emptyJob,
  validateJob,
  departmentOptions,
  employmentTypeOptions,
  workplaceOptions,
  statusOptions,
  salaryPeriodOptions,
} from '../../lib/jobs'
import { useAdmin } from './AdminApp'

/* The form keeps lists as text (one item per line, or comma separated) and
   numbers as strings; validateJob turns both back into the stored shape. */
/** yyyy-mm-dd in the admin's own time zone, for the date input. */
const localDate = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const toForm = (job) => ({
  ...job,
  locations: (job.locations ?? []).join('; '),
  skills: (job.skills ?? []).join(', '),
  responsibilities: (job.responsibilities ?? []).join('\n'),
  requirements: (job.requirements ?? []).join('\n'),
  niceToHave: (job.niceToHave ?? []).join('\n'),
  openings: job.openings ?? '',
  experienceMin: job.experienceMin ?? '',
  experienceMax: job.experienceMax ?? '',
  salary: {
    ...job.salary,
    min: job.salary?.min ?? '',
    max: job.salary?.max ?? '',
  },
  postedDate: localDate(job.postedAt),
})

const toPayload = (form, original) => {
  const { postedDate, ...rest } = form
  // Keep the original timestamp unless the date itself was changed.
  const sameDay = original && localDate(original.postedAt) === postedDate
  return { ...rest, postedAt: sameDay ? original.postedAt : new Date(`${postedDate}T09:00:00`).toISOString() }
}

const selectClasses = (invalid) =>
  `h-[46px] w-full rounded-lg border bg-ink-900 px-3.5 text-base text-silver-100 outline-none transition-colors focus:border-accent-600 sm:h-11 sm:text-sm ${
    invalid ? 'border-accent-600' : 'border-ink-700 hover:border-ink-600'
  }`

const Select = ({ name, label, options, value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-sm font-medium text-silver-200">
      {label}
    </label>
    <select
      id={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      aria-invalid={Boolean(error)}
      className={selectClasses(Boolean(error))}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <FieldError id={`${name}-error`} message={error} />
  </div>
)

const Hint = ({ children }) => <p className="mt-1.5 text-xs text-silver-600">{children}</p>

const Card = ({ title, description, children }) => (
  <section className="surface surface-static p-5 md:p-6">
    <h2 className="text-base font-semibold text-silver-100">{title}</h2>
    {description && <p className="mt-1 text-sm text-silver-500">{description}</p>}
    <div className="mt-5 space-y-5">{children}</div>
  </section>
)

const AdminJobEditor = () => {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { onExpired } = useAdmin()

  const [original, setOriginal] = useState(null)
  const [form, setForm] = useState(() => (isNew ? toForm(emptyJob()) : null))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ busy: false, message: null, saved: false })

  useEffect(() => {
    if (isNew) return
    adminApi
      .listJobs()
      .then((jobs) => {
        const job = jobs.find((j) => j.id === id)
        if (!job) return navigate('/admin', { replace: true })
        setOriginal(job)
        setForm(toForm(job))
      })
      .catch((err) => (err.status === 401 ? onExpired() : setStatus({ busy: false, message: err.message })))
  }, [id, isNew, navigate, onExpired])

  const preview = useMemo(
    () => (form ? { ...validateJob(toPayload(form, original)).values, id: 'preview' } : null),
    [form, original]
  )

  if (!form) {
    return (
      <div className="grid place-items-center py-20">
        {status.message ? (
          <p className="text-sm text-accent-400">{status.message}</p>
        ) : (
          <Loader2 className="h-6 w-6 animate-spin text-silver-500" aria-label="Loading" />
        )}
      </div>
    )
  }

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
    setStatus((s) => (s.saved ? { ...s, saved: false } : s))
  }
  const setSalary = (key, value) => {
    setForm((f) => ({ ...f, salary: { ...f.salary, [key]: value } }))
    setErrors((e) => ({ ...e, salary: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = toPayload(form, original)
    const { errors: found } = validateJob(payload)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setStatus({ busy: false, message: 'Please fix the highlighted fields.' })
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }

    setStatus({ busy: true, message: null })
    try {
      const saved = isNew ? await adminApi.createJob(payload) : await adminApi.updateJob(id, payload)
      setOriginal(saved)
      setForm(toForm(saved))
      setStatus({ busy: false, message: null, saved: true })
      if (isNew) navigate(`/admin/jobs/${saved.id}`, { replace: true })
    } catch (err) {
      if (err.status === 401) return onExpired()
      if (err.errors) setErrors(err.errors)
      setStatus({ busy: false, message: err.message })
    }
  }

  const field = (name, label, extra = {}) => ({ name, label, type: 'text', required: true, ...extra })

  return (
    <form onSubmit={onSubmit} noValidate>
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-silver-500 hover:text-accent-400">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All job posts
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-silver-100">{isNew ? 'Post a job' : `Edit: ${original?.title}`}</h1>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card title="Basics">
            <TextField field={field('title', 'Job title', { placeholder: 'e.g. Senior React Developer', maxLength: 120 })} value={form.title} error={errors.title} onChange={set} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select name="department" label="Department" options={departmentOptions} value={form.department} onChange={set} error={errors.department} />
              <Select name="employmentType" label="Job type" options={employmentTypeOptions} value={form.employmentType} onChange={set} error={errors.employmentType} />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-silver-200">Workplace</legend>
              <div className="grid grid-cols-3 gap-2" role="radiogroup">
                {workplaceOptions.map((o) => (
                  <label
                    key={o.value}
                    className={`flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm transition-colors ${
                      form.workplace === o.value
                        ? 'border-accent-600 bg-accent-950/50 text-silver-100'
                        : 'border-ink-700 bg-ink-900 text-silver-300 hover:border-ink-600'
                    }`}
                  >
                    <input type="radio" name="workplace" value={o.value} checked={form.workplace === o.value} onChange={() => set('workplace', o.value)} className="sr-only" />
                    {o.label}
                  </label>
                ))}
              </div>
              <FieldError id="workplace-error" message={errors.workplace} />
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
              <div>
                <TextField
                  field={field('locations', 'Locations', { required: form.workplace !== 'remote', placeholder: 'Chandigarh, India; Mohali, India' })}
                  value={form.locations}
                  error={errors.locations}
                  onChange={set}
                />
                <Hint>Separate several with semicolons. Optional for remote roles.</Hint>
              </div>
              <TextField field={field('openings', 'Openings', { type: 'number', required: false })} value={form.openings} error={errors.openings} onChange={set} />
            </div>
          </Card>

          <Card title="Experience and pay" description="Used by the experience filter on the careers page. Leave the maximum blank for “3+ years”.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField field={field('experienceMin', 'Minimum years', { type: 'number' })} value={form.experienceMin} error={errors.experienceMin} onChange={set} />
              <TextField field={field('experienceMax', 'Maximum years', { type: 'number', required: false })} value={form.experienceMax} error={errors.experienceMax} onChange={set} />
            </div>
            <div className="grid gap-5 sm:grid-cols-[1fr_1fr_6rem_8rem]">
              <TextField field={field('salaryMin', 'Salary from', { type: 'number', required: false })} value={form.salary.min} onChange={(_, v) => setSalary('min', v)} />
              <TextField field={field('salaryMax', 'Salary to', { type: 'number', required: false })} value={form.salary.max} onChange={(_, v) => setSalary('max', v)} />
              <TextField field={field('salaryCurrency', 'Currency', { maxLength: 3 })} value={form.salary.currency} onChange={(_, v) => setSalary('currency', v.toUpperCase())} />
              <Select name="salaryPeriod" label="Period" options={salaryPeriodOptions} value={form.salary.period} onChange={(_, v) => setSalary('period', v)} />
            </div>
            <FieldError id="salary-error" message={errors.salary} />
            <label className="flex cursor-pointer items-center gap-3 text-sm text-silver-300">
              <input
                type="checkbox"
                checked={form.salary.visible}
                onChange={(e) => setSalary('visible', e.target.checked)}
                className="h-4 w-4 accent-accent-600"
              />
              Show the salary on the careers page
            </label>
          </Card>

          <Card title="Description">
            <div>
              <TextField field={field('summary', 'Summary', { maxLength: 240, placeholder: 'One or two sentences shown at the top of the role.' })} value={form.summary} error={errors.summary} onChange={set} />
              <Hint>{form.summary.length}/240 characters. Also used as the search snippet unless you set one below.</Hint>
            </div>
            <TextField field={field('description', 'About the role', { type: 'textarea', maxLength: 5000 })} value={form.description} error={errors.description} onChange={set} />
            <div>
              <TextField field={field('responsibilities', 'What you will do', { type: 'textarea' })} value={form.responsibilities} error={errors.responsibilities} onChange={set} />
              <Hint>One responsibility per line.</Hint>
            </div>
            <div>
              <TextField field={field('requirements', 'What we are looking for', { type: 'textarea' })} value={form.requirements} error={errors.requirements} onChange={set} />
              <Hint>One requirement per line.</Hint>
            </div>
            <div>
              <TextField field={field('niceToHave', 'Nice to have', { type: 'textarea', required: false })} value={form.niceToHave} onChange={set} />
              <Hint>One per line.</Hint>
            </div>
            <div>
              <TextField field={field('skills', 'Skills', { required: false, placeholder: 'React, Node.js, PostgreSQL' })} value={form.skills} onChange={set} />
              <Hint>Comma separated. Shown as tags, and matched by the keyword search.</Hint>
            </div>
          </Card>

          <Card title="Applications and search">
            <div>
              <TextField field={field('applyEmail', 'Applications go to', { type: 'email', required: false, placeholder: 'contact@genclover.com' })} value={form.applyEmail} error={errors.applyEmail} onChange={set} />
              <Hint>Leave blank to use contact@genclover.com.</Hint>
            </div>
            <div>
              <TextField field={field('metaDescription', 'Search snippet', { required: false, maxLength: 170 })} value={form.metaDescription} onChange={set} />
              <Hint>About 150–160 characters for Google and link previews. Leave blank to use the summary.</Hint>
            </div>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20">
          <section className="surface surface-static p-5">
            <h2 className="text-base font-semibold text-silver-100">Publishing</h2>
            <fieldset className="mt-4">
              <legend className="sr-only">Status</legend>
              <div className="space-y-2">
                {statusOptions.map((o) => (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                      form.status === o.value ? 'border-accent-600 bg-accent-950/40' : 'border-ink-700 bg-ink-900 hover:border-ink-600'
                    }`}
                  >
                    <input type="radio" name="status" checked={form.status === o.value} onChange={() => set('status', o.value)} className="mt-0.5 accent-accent-600" />
                    <span>
                      <span className="block font-medium text-silver-100">{o.label}</span>
                      <span className="block text-xs text-silver-500">
                        {o.value === 'open' && 'Listed on the careers page and accepting applications.'}
                        {o.value === 'closed' && 'Listed as closed. Not indexed by search engines.'}
                        {o.value === 'draft' && 'Only visible here in the admin portal.'}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <FieldError id="status-error" message={errors.status} />
            </fieldset>

            <div className="mt-4">
              <label htmlFor="postedDate" className="mb-2 block text-sm font-medium text-silver-200">
                Posted on
              </label>
              <input
                id="postedDate"
                type="date"
                value={form.postedDate}
                onChange={(e) => set('postedDate', e.target.value)}
                className={selectClasses(Boolean(errors.postedAt))}
              />
              <FieldError id="postedAt-error" message={errors.postedAt} />
              <Hint>Drives “Date posted” filtering and the “x days ago” label.</Hint>
            </div>

            {status.message && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-accent-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {status.message}
              </p>
            )}
            {status.saved && (
              <p role="status" className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
                <Check className="h-4 w-4" aria-hidden="true" />
                Saved. {form.status === 'draft' ? 'Drafts stay private.' : 'It is live on the careers page.'}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <Button type="submit" size="md" className="flex-1" disabled={status.busy}>
                {status.busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isNew ? (form.status === 'open' ? 'Publish job' : 'Save job') : 'Save changes'}
              </Button>
              <Button to="/admin" variant="secondary" size="md">
                Cancel
              </Button>
            </div>
          </section>

          {preview && (
            <section>
              <p className="mb-2 font-display text-[11px] uppercase tracking-brand text-silver-600">Preview on the careers page</p>
              <div className="pointer-events-none">
                <JobCard job={{ ...preview, title: preview.title || 'Job title' }} to="#" />
              </div>
            </section>
          )}
        </aside>
      </div>
    </form>
  )
}

export default AdminJobEditor
