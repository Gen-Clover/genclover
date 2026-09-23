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
}

/** Fields that must never leave the browser as analytics payload. */
const BLOCKED_KEYS = new Set(['name', 'email', 'phone', 'company', 'details', 'message'])

const scrub = (payload = {}) =>
  Object.fromEntries(Object.entries(payload).filter(([key]) => !BLOCKED_KEYS.has(key)))

export const trackEvent = (name, payload = {}) => {
  if (typeof window === 'undefined') return

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
