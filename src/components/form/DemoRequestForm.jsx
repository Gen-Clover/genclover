import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Check, Loader2 } from 'lucide-react'
import Button from '../ui/Button'
import { ConsentField, OptionGrid, PhoneField, TextField } from './fields'
import {
  DEMO_AUTHORISATION,
  DEMO_CONTACT_CONSENT,
  demoTypeOptions,
  initialDemoRequest,
  templateChoiceOptions,
  validateDemoRequest,
} from '../../lib/demoRequest'
import { websiteTemplates } from '../../data/templates'
import { getDialCodeOptions } from '../../lib/intlOptions'
import { routes, contact } from '../../data/site'
import { trackEvent, events, readAttribution } from '../../lib/analytics'

/**
 * Book a demo. (Templates)
 *
 * One screen, two kinds of demo: a redesign of the visitor's current website
 * (needs its address and their permission to use its material) or a demo built
 * on one of our templates. Links can preselect either with ?type= and
 * ?template=. Validated with the same rules /api/demo uses.
 */

const FIELDS = {
  websiteUrl: {
    name: 'websiteUrl',
    label: 'Your current website',
    type: 'url',
    placeholder: 'https://yourbusiness.com',
    autoComplete: 'url',
    required: true,
    maxLength: 300,
  },
  businessName: { name: 'businessName', label: 'Business name', type: 'text', autoComplete: 'organization', required: true, maxLength: 160 },
  name: { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name', required: true, maxLength: 120 },
  email: { name: 'email', label: 'Business email', type: 'email', autoComplete: 'email', required: true, maxLength: 200 },
  phone: { name: 'phone', label: 'Phone number', type: 'tel-intl', countryName: 'phoneCountry', autoComplete: 'tel-national', required: true, maxLength: 30 },
  notes: {
    name: 'notes',
    label: 'Anything we should know?',
    type: 'textarea',
    placeholder: 'What you like or dislike about your current site, the pages that matter most, a good time for the call…',
    required: false,
    maxLength: 2000,
  },
}

/** For a redesign, a template is only a style to lean towards; '' keeps their own look. */
const redesignStyleOptions = [
  { value: '', label: 'No, keep my current look' },
  ...websiteTemplates.map((t) => ({ value: t.slug, label: `Lean towards ${t.name}` })),
]

const Fieldset = ({ legend, help, children }) => (
  <fieldset className="border-t border-ink-800 px-5 py-6 first:border-t-0 md:px-7">
    <legend className="sr-only">{legend}</legend>
    <p className="text-base font-semibold text-silver-100" aria-hidden="true">
      {legend}
    </p>
    {help && <p className="mt-1 text-sm leading-relaxed text-silver-400">{help}</p>}
    <div className="mt-4">{children}</div>
  </fieldset>
)

const DemoRequestForm = () => {
  const [searchParams] = useSearchParams()
  const [values, setValues] = useState(initialDemoRequest)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState(null)
  const [confirmedTo, setConfirmedTo] = useState(null)
  const [startedAt] = useState(() => Date.now())
  const honeypotRef = useRef(null)
  const formRef = useRef(null)
  const countryOptions = useMemo(getDialCodeOptions, [])
  const redesign = values.demoType === 'redesign'

  // Applied after mount rather than in useState, so the pre-rendered HTML and
  // the first client render match.
  useEffect(() => {
    const type = searchParams.get('type')
    const template = searchParams.get('template')
    setValues((current) => ({
      ...current,
      ...(demoTypeOptions.some((o) => o.value === type) ? { demoType: type } : {}),
      ...(templateChoiceOptions.some((o) => o.value === template) ? { template } : {}),
      // A template link with no type means "a demo of this template".
      ...(!type && template ? { demoType: 'template' } : {}),
    }))
  }, [searchParams])

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  const handleBlur = (name) => {
    const message = validateDemoRequest(values).errors[name]
    setErrors((current) => ({ ...current, [name]: message }))
  }

  const changeType = (name, demoType) => {
    setValue(name, demoType)
    // "Not sure yet" only makes sense for a template demo; '' only for a redesign.
    setValues((current) => ({
      ...current,
      template: demoType === 'redesign' && current.template === 'not-sure' ? '' : current.template,
    }))
  }

  const showErrors = (fieldErrors) => {
    setErrors(fieldErrors)
    // Move to the first problem so keyboard and screen reader users land on it.
    requestAnimationFrame(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { errors: fieldErrors } = validateDemoRequest(values)
    if (Object.keys(fieldErrors).length > 0) {
      trackEvent(events.FORM_ERROR, { form: 'demo', step: 'validate' })
      showErrors(fieldErrors)
      return
    }

    setStatus('submitting')
    setSubmitError(null)
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          company_website: honeypotRef.current?.value ?? '',
          elapsedMs: Date.now() - startedAt,
          sourcePage: window.location.pathname + window.location.search,
          attribution: readAttribution(),
        }),
      })
      const payload = await response.json().catch(() => ({}))

      if (response.status === 400 && payload.errors && typeof payload.errors === 'object') {
        setStatus('idle')
        showErrors(payload.errors)
        return
      }
      if (!response.ok) throw new Error(payload.message || 'We could not send your request just now.')

      trackEvent(events.DEMO_SUBMIT, { demo_type: values.demoType, template: values.template || undefined })
      setConfirmedTo(payload.confirmation === true ? values.email.trim() : null)
      setStatus('success')
    } catch (error) {
      trackEvent(events.FORM_ERROR, { form: 'demo', step: 'submit' })
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
        <h2 className="mt-6 text-2xl font-semibold text-silver-100">Thank you. Demo request received.</h2>
        {confirmedTo && (
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-silver-300">
            We have sent a confirmation to <span className="break-all font-medium text-silver-100">{confirmedTo}</span>
            {redesign ? ', with a copy of the permission you gave us' : ''}. If it is not in your inbox in a few
            minutes, check your spam folder.
          </p>
        )}
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-silver-400">
          {redesign
            ? 'We will look at your current site, build a first version of the redesign, and get in touch to arrange a call to walk you through it.'
            : 'We will set the template up with your business in mind and get in touch to arrange a call to walk you through it.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to={`${routes.services}/websites#templates`} variant="secondary" size="md">
            Browse templates
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
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="surface surface-static overflow-hidden">
      <Fieldset legend="What kind of demo?">
        <OptionGrid
          name="demoType"
          options={demoTypeOptions}
          value={values.demoType}
          error={errors.demoType}
          onChange={changeType}
          className="sm:grid-cols-2"
        />
      </Fieldset>

      {redesign ? (
        <Fieldset
          legend="About your business"
          help="We work from what is on your site today: your name, logo, photos and words."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField field={FIELDS.websiteUrl} value={values.websiteUrl} error={errors.websiteUrl} onChange={setValue} onBlur={handleBlur} />
            </div>
            <TextField field={FIELDS.businessName} value={values.businessName} error={errors.businessName} onChange={setValue} onBlur={handleBlur} />
          </div>
          <p className="mb-2 mt-6 text-sm font-medium text-silver-200">
            Start from one of our templates?
            <span className="ml-1.5 text-xs text-silver-600">(optional)</span>
          </p>
          <OptionGrid
            name="template"
            options={redesignStyleOptions}
            value={values.template}
            error={errors.template}
            onChange={setValue}
            className="sm:grid-cols-2"
          />
        </Fieldset>
      ) : (
        <Fieldset legend="Which template?" help="We set it up with your business name and a sample of your content.">
          <OptionGrid
            name="template"
            options={templateChoiceOptions}
            value={values.template}
            error={errors.template}
            onChange={setValue}
            className="sm:grid-cols-2"
          />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <TextField field={FIELDS.businessName} value={values.businessName} error={errors.businessName} onChange={setValue} onBlur={handleBlur} />
          </div>
        </Fieldset>
      )}

      <Fieldset legend="How do we reach you?" help="We use these details only to arrange and share your demo.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField field={FIELDS.name} value={values.name} error={errors.name} onChange={setValue} onBlur={handleBlur} />
          <TextField field={FIELDS.email} value={values.email} error={errors.email} onChange={setValue} onBlur={handleBlur} />
          <PhoneField
            field={FIELDS.phone}
            value={values.phone}
            country={values.phoneCountry}
            countryOptions={countryOptions}
            errors={errors}
            onChange={setValue}
            onBlur={handleBlur}
          />
          <div className="sm:col-span-2">
            <TextField field={FIELDS.notes} value={values.notes} error={errors.notes} onChange={setValue} onBlur={handleBlur} />
          </div>
        </div>
      </Fieldset>

      <Fieldset legend={redesign ? 'Your permission' : 'One last thing'}>
        <div className="space-y-3">
          {redesign && (
            <ConsentField
              name="authorisation"
              checked={values.authorisation}
              error={errors.authorisation}
              label={DEMO_AUTHORISATION.text}
              onChange={setValue}
            />
          )}
          <ConsentField checked={values.consent} error={errors.consent} label={DEMO_CONTACT_CONSENT} onChange={setValue} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-silver-500">
          {redesign && 'We email you a copy of exactly what you agreed to. '}
          We never sell your details. See our{' '}
          <Link to={routes.privacy} className="text-accent-400 hover:text-accent-300">
            privacy notice
          </Link>
          .
        </p>
      </Fieldset>

      {/* Honeypot: visually hidden and off the tab order, never filled by a human */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input ref={honeypotRef} id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && (
        <div role="alert" className="mx-5 mb-5 flex items-start gap-3 rounded-lg border border-accent-700 bg-accent-950/50 p-4 md:mx-7">
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

      <div className="flex flex-col gap-4 border-t border-ink-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <p className="text-sm leading-relaxed text-silver-400">Your demo is private and shared only with you.</p>
        <Button type="submit" size="md" disabled={status === 'submitting'} className="shrink-0">
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Request my demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default DemoRequestForm
