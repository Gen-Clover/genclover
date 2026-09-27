import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X, Upload, FileText, Check, Loader2, AlertTriangle } from 'lucide-react'
import Button from '../ui/Button'
import { TextField, PhoneField, ConsentField, FieldError } from '../form/fields'
import EmailOptions from './EmailOptions'
import {
  initialApplication,
  validateApplication,
  cvProblem,
  CV_ACCEPT,
  experienceYearOptions,
  noticePeriodOptions,
} from '../../lib/application'
import { getDialCodeOptions } from '../../lib/intlOptions'
import { contact, routes } from '../../data/site'

const selectClasses = (invalid) =>
  `h-[46px] w-full rounded-lg border bg-ink-900 px-3.5 text-base text-silver-100 outline-none transition-colors focus:border-accent-600 sm:h-11 sm:text-sm ${
    invalid ? 'border-accent-600' : 'border-ink-700 hover:border-ink-600'
  }`

const Select = ({ name, label, options, value, onChange, error, placeholder }) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-sm font-medium text-silver-200">
      {label}
    </label>
    <select
      id={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      className={selectClasses(Boolean(error))}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <FieldError id={`${name}-error`} message={error} />
  </div>
)

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('That file could not be read.'))
    reader.readAsDataURL(file)
  })

/**
 * The apply form, in a dialog over the role. Sends to /api/apply, which emails
 * the application with the CV attached. `job` is null for a general application.
 * For people who would rather write their own email, the Gmail / Outlook /
 * copy options sit at the bottom, since a plain mailto: link often goes nowhere.
 */
const ApplyDialog = ({ job, onClose }) => {
  const [values, setValues] = useState(initialApplication)
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [openedAt] = useState(() => Date.now())
  const panelRef = useRef(null)
  const honeypotRef = useRef(null)
  const countryOptions = useMemo(getDialCodeOptions, [])

  const role = job?.title ?? 'General application'
  const to = job?.applyEmail || contact.email
  const subject = job ? `Application: ${job.title}` : 'General application'

  // Dialog behaviour: lock page scroll, Escape closes, focus moves in and back.
  useEffect(() => {
    const previous = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('input, select, textarea, button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [onClose])

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
  }

  const pickFile = (picked) => {
    setFile(picked ?? null)
    setErrors((e) => ({ ...e, cv: picked ? cvProblem(picked) ?? undefined : undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const { errors: found } = validateApplication(values)
    const fileError = cvProblem(file)
    if (fileError) found.cv = fileError
    if (Object.keys(found).length > 0) {
      setErrors(found)
      const firstId = Object.keys(found)[0] === 'cv' ? 'cv' : Object.keys(found)[0]
      document.getElementById(firstId)?.focus()
      return
    }

    setStatus('sending')
    setMessage(null)
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          jobId: job?.id ?? 'general',
          cv: { name: file.name, type: file.type, data: await readAsBase64(file) },
          company_website: honeypotRef.current?.value ?? '',
          elapsedMs: Date.now() - openedAt,
          sourcePage: window.location.pathname + window.location.search,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (response.status === 400 && payload.errors) {
        setErrors(payload.errors)
        setStatus('idle')
        return
      }
      if (!response.ok) throw new Error(payload.message || 'We could not send your application just now.')
      setConfirmed(payload.confirmation === true)
      setStatus('sent')
    } catch (error) {
      setMessage(error.message)
      setStatus('error')
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && status !== 'sending' && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-ink-700 bg-ink-950 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-800 px-5 py-4 md:px-6">
          <div>
            <p className="eyebrow">Apply</p>
            <h2 id="apply-title" className="mt-1 text-lg font-semibold text-silver-100">
              {role}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-lg text-silver-400 hover:bg-ink-800 hover:text-silver-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="px-6 py-10 text-center" role="status">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent-700 bg-accent-950">
              <Check className="h-5 w-5 text-accent-400" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-silver-100">Application sent.</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-silver-400">
              Thank you. A person on our team reads every application, together with your CV, and we
              will be in touch.
              {confirmed && (
                <>
                  {' '}We have sent a confirmation to{' '}
                  <span className="break-all font-medium text-silver-200">{values.email}</span>.
                </>
              )}
            </p>
            <Button type="button" variant="secondary" size="md" className="mt-7" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField field={{ name: 'name', label: 'Full name', type: 'text', required: true, autoComplete: 'name', maxLength: 120 }} value={values.name} error={errors.name} onChange={set} />
                <TextField field={{ name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', maxLength: 200 }} value={values.email} error={errors.email} onChange={set} />
                <PhoneField
                  field={{ name: 'phone', label: 'Phone', countryName: 'phoneCountry', required: true, autoComplete: 'tel-national', maxLength: 30 }}
                  value={values.phone}
                  country={values.phoneCountry}
                  countryOptions={countryOptions}
                  errors={errors}
                  onChange={set}
                />
                <TextField field={{ name: 'city', label: 'Current city', type: 'text', required: true, autoComplete: 'address-level2', maxLength: 80, placeholder: 'e.g. Pune' }} value={values.city} error={errors.city} onChange={set} />
                <Select name="experienceYears" label="Total experience" placeholder="Choose" options={experienceYearOptions} value={values.experienceYears} onChange={set} error={errors.experienceYears} />
                <Select name="noticePeriod" label="When could you start?" placeholder="Choose" options={noticePeriodOptions} value={values.noticePeriod} onChange={set} error={errors.noticePeriod} />
              </div>

              <TextField field={{ name: 'profileUrl', label: 'LinkedIn or portfolio', type: 'url', required: false, autoComplete: 'url', maxLength: 300, placeholder: 'https://linkedin.com/in/you' }} value={values.profileUrl} error={errors.profileUrl} onChange={set} />

              {/* CV */}
              <div>
                <span className="mb-2 block text-sm font-medium text-silver-200">CV</span>
                <label
                  htmlFor="cv"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3.5 transition-colors ${
                    errors.cv ? 'border-accent-600' : 'border-ink-600 bg-ink-900 hover:border-accent-700/60'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    pickFile(e.dataTransfer.files?.[0])
                  }}
                >
                  {file ? (
                    <FileText className="h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
                  ) : (
                    <Upload className="h-5 w-5 shrink-0 text-silver-500" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1 text-sm">
                    {file ? (
                      <>
                        <span className="block truncate font-medium text-silver-100">{file.name}</span>
                        <span className="text-xs text-silver-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB · click to change
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="block text-silver-200">Upload your CV, or drop it here</span>
                        <span className="text-xs text-silver-500">PDF or Word, up to 3 MB</span>
                      </>
                    )}
                  </span>
                  <input
                    id="cv"
                    type="file"
                    accept={CV_ACCEPT}
                    className="sr-only"
                    aria-invalid={Boolean(errors.cv)}
                    aria-describedby={errors.cv ? 'cv-error' : undefined}
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                </label>
                <FieldError id="cv-error" message={errors.cv} />
              </div>

              <div>
                <label htmlFor="note" className="mb-2 block text-sm font-medium text-silver-200">
                  Anything you would like us to know
                  <span className="ml-1.5 text-xs text-silver-600">(optional)</span>
                </label>
                <textarea
                  id="note"
                  rows={3}
                  maxLength={2000}
                  value={values.note}
                  onChange={(e) => set('note', e.target.value)}
                  placeholder="A line on why this role, or a link to something you have built."
                  className="w-full resize-y rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-base leading-relaxed text-silver-100 outline-none transition-colors placeholder:text-silver-600 hover:border-ink-600 focus:border-accent-600 sm:text-sm"
                />
              </div>

              <ConsentField
                checked={values.consent}
                error={errors.consent}
                onChange={set}
                label="I agree to Gen Clover using these details and my CV to consider me for this and future roles, and keeping them on file until I ask for them to be deleted. "
              >
                <Link to={routes.privacy} target="_blank" className="text-accent-400 hover:text-accent-300">
                  Privacy notice
                </Link>
              </ConsentField>

              {/* Honeypot: hidden from people and the tab order */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                <label htmlFor="apply_company_website">Company website</label>
                <input ref={honeypotRef} id="apply_company_website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {status === 'error' && (
                <div role="alert" className="flex items-start gap-3 rounded-lg border border-accent-700 bg-accent-950/50 p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-silver-200">
                    {message} Please try again, or email your CV to us using one of the options below.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-ink-800 px-5 py-4 md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <EmailOptions to={to} subject={subject} />
                <Button type="submit" size="md" className="ml-auto" disabled={status === 'sending'}>
                  {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {status === 'sending' ? 'Sending…' : 'Submit application'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

export default ApplyDialog
