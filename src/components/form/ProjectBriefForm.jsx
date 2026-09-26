import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, AlertTriangle, Loader2 } from 'lucide-react'
import Button from '../ui/Button'
import { parsePhoneNumber } from 'libphonenumber-js/min'
import { OptionGrid, TextField, ConsentField, BudgetField, PhoneField } from './fields'
import {
  STEPS,
  TOTAL_STEPS,
  initialLeadState,
  validateStep,
  validateAll,
  validateField,
  fieldsForStep,
  normalizeAmount,
} from '../../lib/leadSchema'
import {
  getCurrencyOptions,
  getDialCodeOptions,
  currencyForRegion,
  countryForRegion,
  formatBudget,
} from '../../lib/intlOptions'
import { routes, contact } from '../../data/site'
import { trackEvent, events, readAttribution } from '../../lib/analytics'

/**
 * Multi-step project brief. (Spec §9, §10)
 *
 * - Visible progress, Back/Next that preserve everything entered.
 * - Inline validation on blur and on advance; nothing is validated before the
 *   visitor has had a chance to answer it.
 * - Submits to the serverless endpoint at /api/lead. No mailto anywhere.
 * - Includes a honeypot field that real people never see or fill.
 */
const ProjectBriefForm = () => {
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState(initialLeadState)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null)
  const [startedAt] = useState(() => Date.now())
  const honeypotRef = useRef(null)
  const headingRef = useRef(null)
  const hasStarted = useRef(false)
  const reduced = useReducedMotion()
  const currencyOptions = useMemo(getCurrencyOptions, [])
  const countryOptions = useMemo(getDialCodeOptions, [])

  const step = STEPS[stepIndex]
  const isLast = stepIndex === TOTAL_STEPS - 1
  const progress = ((stepIndex + 1) / TOTAL_STEPS) * 100

  // Move focus to the new question so screen reader users follow the change.
  useEffect(() => {
    if (status === 'idle') headingRef.current?.focus()
  }, [stepIndex, status])

  // Spec §16 — form abandonment by step.
  useEffect(() => {
    const onBeforeUnload = () => {
      if (hasStarted.current && status !== 'success') {
        trackEvent(events.FORM_ABANDON, { step: step.id, stepNumber: step.number })
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [step, status])

  const setValue = useCallback(
    (name, value) => {
      if (!hasStarted.current) {
        hasStarted.current = true
        trackEvent(events.FORM_START)
      }
      setValues((prev) => {
        const next = { ...prev, [name]: value }
        // The location answer sets sensible defaults the visitor can still change.
        if (name === 'region') {
          if (!prev.budgetCurrency) next.budgetCurrency = currencyForRegion(value)
          if (!prev.phoneCountry) next.phoneCountry = countryForRegion(value)
        }
        return next
      })
      // Clear an existing error as soon as the visitor starts fixing it.
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
    },
    []
  )

  const handleBlur = useCallback(
    (name) => {
      const message = validateField(name, values[name], values)
      setErrors((prev) => ({ ...prev, [name]: message ?? undefined }))
    },
    [values]
  )

  const goNext = () => {
    const stepErrors = validateStep(step, values)
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }))
      return
    }
    trackEvent(events.FORM_STEP, { step: step.id, stepNumber: step.number })
    if (!isLast) setStepIndex((i) => i + 1)
  }

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))

  /** Show these errors and go back to the first step that has one. */
  const showErrors = (found) => {
    setErrors(found)
    const firstBad = STEPS.findIndex((s) => fieldsForStep(s).some((name) => found[name]))
    if (firstBad >= 0) setStepIndex(firstBad)
  }

  /**
   * Enter in a single-line field means "Continue" on every step but the last.
   * Browsers only submit on Enter when a form has a submit button or a lone
   * text field, so without this Enter either did nothing or submitted the whole
   * brief. Textareas keep Enter for new lines; the searchable selects use it to
   * pick an option (they call preventDefault).
   */
  const handleEnter = (e) => {
    if (e.key !== 'Enter' || e.defaultPrevented || isLast) return
    const t = e.target
    if (t.tagName !== 'INPUT' || t.type === 'checkbox' || t.getAttribute('role') === 'combobox') return
    e.preventDefault()
    goNext()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Only the last step has a submit button, but guard anyway: an early submit
    // must never validate every step and jump ahead.
    if (!isLast) {
      goNext()
      return
    }

    const allErrors = validateAll(values)
    if (Object.keys(allErrors).length > 0) {
      showErrors(allErrors)
      return
    }

    setStatus('submitting')
    setSubmitError(null)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          budgetAmount: normalizeAmount(values.budgetAmount),
          budgetCurrency: normalizeAmount(values.budgetAmount) ? values.budgetCurrency : '',
          phone: toInternational(values.phone, values.phoneCountry),
          // Anti-spam signals, checked server-side.
          company_website: honeypotRef.current?.value ?? '',
          elapsedMs: Date.now() - startedAt,
          sourcePage: window.location.pathname + window.location.search,
          attribution: readAttribution(),
        }),
      })

      const payload = await response.json().catch(() => ({}))

      // The server re-validates everything; highlight whatever it rejected.
      if (response.status === 400 && payload.errors && typeof payload.errors === 'object') {
        const fieldErrors = Object.fromEntries(
          Object.entries(payload.errors).filter(([name]) => name in initialLeadState)
        )
        if (Object.keys(fieldErrors).length > 0) {
          trackEvent(events.FORM_ERROR, { step: step.id })
          setStatus('idle')
          showErrors(fieldErrors)
          return
        }
      }

      if (!response.ok) {
        throw new Error(payload.message || 'We could not send your inquiry just now.')
      }

      trackEvent(events.FORM_SUBMIT, { service: values.service, region: values.region })
      setStatus('success')
    } catch (error) {
      trackEvent(events.FORM_ERROR, { step: step.id })
      setSubmitError(error.message)
      setStatus('error')
    }
  }

  /* ------------------------------------------------------------- success */
  if (status === 'success') {
    return (
      <div className="surface surface-static p-8 text-center md:p-12" role="status" aria-live="polite">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent-700 bg-accent-950">
          <Check className="h-6 w-6 text-accent-400" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold text-silver-100">Thank you. Brief received.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-silver-400">
          We read every inquiry properly rather than replying with a template, so give us a
          working day or two. If it is urgent, email us directly at{' '}
          <a href={`mailto:${contact.email}`} className="text-accent-400 hover:text-accent-300">
            {contact.email}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to={routes.work} variant="secondary" size="md">
            Browse our work
          </Button>
          <Button to={routes.home} variant="ghost" size="md">
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------------- form */
  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleEnter}
      noValidate
      className="surface surface-static overflow-hidden"
    >
      {/* Progress */}
      <div className="border-b border-ink-800 px-6 py-5 md:px-8">
        <div className="flex items-center justify-between text-xs">
          <span className="font-display uppercase tracking-brand text-silver-400">
            Step {step.number} of {TOTAL_STEPS}
          </span>
          <span className="text-silver-600">{Math.round(progress)}%</span>
        </div>
        <div
          className="mt-3 h-1 overflow-hidden rounded-full bg-ink-700"
          role="progressbar"
          aria-valuenow={step.number}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label="Project brief progress"
        >
          <motion.div
            className="h-full rounded-full bg-accent-600"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="px-6 py-8 md:px-8 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              /* Focused programmatically so the step change is announced; the
                 visible ring is suppressed because the visitor did not Tab here. */
              className="text-xl font-semibold text-silver-100 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-2xl"
            >
              {step.question}
            </h2>
            <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-silver-400">
              {step.help}
            </p>

            <div className="mt-7">
              {step.kind === 'choice' && (
                <OptionGrid
                  name={step.id}
                  options={step.options}
                  value={values[step.id]}
                  error={errors[step.id]}
                  onChange={setValue}
                />
              )}

              {step.kind === 'budget' && (
                <BudgetField
                  currency={values.budgetCurrency || 'USD'}
                  amount={values.budgetAmount}
                  currencyOptions={currencyOptions}
                  error={errors.budgetAmount}
                  onChange={setValue}
                  onBlur={handleBlur}
                  preview={formatBudget(
                    normalizeAmount(values.budgetAmount),
                    values.budgetCurrency || 'USD'
                  )}
                />
              )}

              {step.kind === 'text' && (
                <TextField
                  field={step.field}
                  value={values[step.field.name]}
                  error={errors[step.field.name]}
                  onChange={setValue}
                  onBlur={handleBlur}
                />
              )}

              {step.kind === 'fields' && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {step.fields.map((field) => (
                    <div
                      key={field.name}
                      className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
                    >
                      {field.type === 'tel-intl' ? (
                        <PhoneField
                          field={field}
                          value={values[field.name]}
                          country={values[field.countryName]}
                          countryOptions={countryOptions}
                          errors={errors}
                          onChange={setValue}
                          onBlur={handleBlur}
                        />
                      ) : (
                        <TextField
                          field={field}
                          value={values[field.name]}
                          error={errors[field.name]}
                          onChange={setValue}
                          onBlur={handleBlur}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {step.kind === 'consent' && (
                <>
                  <ConsentField
                    checked={values.consent}
                    error={errors.consent}
                    label={step.label}
                    onChange={setValue}
                  />
                  <p className="mt-4 text-xs leading-relaxed text-silver-500">
                    We store only what is needed to respond to this inquiry and we never sell your
                    details. See our{' '}
                    <Link to={routes.privacy} className="text-accent-400 hover:text-accent-300">
                      privacy notice
                    </Link>
                    .
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Honeypot — visually hidden and off the tab order, never filled by a human */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor="company_website">Company website</label>
          <input
            ref={honeypotRef}
            id="company_website"
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {status === 'error' && (
          <div
            role="alert"
            className="mt-7 flex items-start gap-3 rounded-lg border border-accent-700 bg-accent-950/50 p-4"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-silver-200">
              {submitError} You can try again, or email us directly at{' '}
              <a href={`mailto:${contact.email}`} className="text-accent-400 hover:text-accent-300">
                {contact.email}
              </a>
              .
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 border-t border-ink-800 px-6 py-5 md:px-8">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={goBack}
          disabled={stepIndex === 0}
          className={stepIndex === 0 ? 'invisible' : ''}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>

        {isLast ? (
          <Button type="submit" size="md" disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Submit brief
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        ) : (
          <Button type="button" size="md" onClick={goNext}>
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </form>
  )
}

/** "+91 98765 43210" style, so the inquiry email is unambiguous. */
const toInternational = (phone, country) => {
  try {
    return parsePhoneNumber(phone, country).formatInternational()
  } catch {
    return phone
  }
}

export default ProjectBriefForm
