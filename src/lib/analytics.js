/**
 * Analytics event hooks. (Spec §16)
 *
 * This is a thin, provider-agnostic seam. It pushes to `window.dataLayer` and
 * calls `window.gtag` when either exists, and is a silent no-op otherwise — so
 * the site works with no analytics installed and needs no code change when a
 * provider is added later.
 *
 * Spec §16: do not collect unnecessary sensitive information. Only pass
 * low-cardinality descriptors here (service slug, category, page path). Never
 * pass a name, email, phone number or free-text project description.
 */

export const events = {
  START_PROJECT_CTA: 'start_project_cta_click',
  WORK_CARD_CLICK: 'work_card_click',
  SERVICE_CTA_CLICK: 'service_cta_click',
  FORM_START: 'lead_form_start',
  FORM_STEP: 'lead_form_step_complete',
  FORM_ABANDON: 'lead_form_abandon',
  FORM_SUBMIT: 'lead_form_submit',
  FORM_ERROR: 'lead_form_error',
  JOB_APPLY: 'job_application_submit',
  TEMPLATE_OPEN: 'website_template_open',
  DEMO_CTA: 'demo_cta_click',
  DEMO_SUBMIT: 'demo_request_submit',
}

import { logVisitEvent } from './visitorLog'

/** Fields that must never leave the browser as analytics payload. */
const BLOCKED_KEYS = new Set(['name', 'email', 'phone', 'company', 'details', 'message'])

const scrub = (payload = {}) =>
  Object.fromEntries(Object.entries(payload).filter(([key]) => !BLOCKED_KEYS.has(key)))

/**
 * Google Analytics 4. Loaded only when VITE_GA_MEASUREMENT_ID is set (Vercel →
 * Settings → Environment Variables, e.g. G-XXXXXXXXXX), so local development and
 * preview builds without it send nothing. Page views, including in-app
 * navigation, come from GA4's enhanced measurement ("page changes based on
 * browser history events", on by default), so nothing here tracks routes.
 */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export const initAnalytics = () => {
  if (typeof window === 'undefined' || !GA_ID || window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js reads the arguments object itself, as in Google's snippet.
    window.dataLayer.push(arguments) // eslint-disable-line prefer-rest-params
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(script)
}

export const trackEvent = (name, payload = {}) => {
  if (typeof window === 'undefined') return

  logVisitEvent(name, scrub(payload))

  const data = {
    ...scrub(payload),
    page_path: window.location.pathname,
    page_search: window.location.search || undefined,
  }

  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...data })
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, data)
      // GA4's recommended lead event: mark it as a key event in GA4 and import it into Google Ads.
      if (name === events.FORM_SUBMIT || name === 'clovi_lead_submit')
        window.gtag('event', 'generate_lead', { ...data, lead_type: 'project', lead_source: name === 'clovi_lead_submit' ? 'chat' : 'form' })
      if (name === events.DEMO_SUBMIT) window.gtag('event', 'generate_lead', { ...data, lead_type: 'demo', lead_source: 'form' })
    }
  } catch {
    // Analytics must never break a user interaction.
  }
}

/**
 * Source and campaign attribution. (Spec §16)
 * Captured once per session so it can travel with the lead record even if the
 * visitor navigates several pages before enquiring.
 */
const ATTRIBUTION_KEY = 'gc_attribution'

export const captureAttribution = () => {
  if (typeof window === 'undefined') return
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return
    const params = new URLSearchParams(window.location.search)
    const attribution = {
      landingPage: window.location.pathname,
      referrer: document.referrer || null,
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
      capturedAt: new Date().toISOString(),
    }
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution))
  } catch {
    // Private browsing or blocked storage — attribution is optional.
  }
}

export const readAttribution = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
