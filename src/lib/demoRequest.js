import { isValidPhoneNumber } from 'libphonenumber-js/min'
import { isHttpUrl } from './application.js'
import { websiteTemplates } from '../data/templates.js'

/**
 * A demo request from /book-a-demo, shared by the form and /api/demo so both
 * validate the same way. Keep imports to files Node can load directly (the API
 * imports this without a bundler).
 *
 * Two kinds of demo:
 *   template  a demo built on one of the templates on /services/websites
 *   redesign  a demo redesign of the visitor's existing website, built with
 *             their own name, logo, photos and copy. Needs the website address
 *             and the authorisation declaration below.
 */

export const demoTypeOptions = [
  {
    value: 'redesign',
    label: 'Redesign my existing website',
    description: 'We rebuild your current site as a demo, using your own brand, photos and content.',
  },
  {
    value: 'template',
    label: 'A demo built on a template',
    description: 'We set up one of our templates with your business name and a sample of your content.',
  },
]

/** "Not sure yet" lets someone ask for a template demo before choosing one. */
export const templateChoiceOptions = [
  ...websiteTemplates.map((t) => ({ value: t.slug, label: `${t.name} · ${t.style}` })),
  { value: 'not-sure', label: 'Not sure yet, recommend one' },
]

/**
 * What the visitor agrees to before we copy anything from their site. The
 * version is stored with every request, so if the wording changes we still
 * know exactly what each person agreed to.
 */
export const DEMO_AUTHORISATION = {
  version: '2026-10-04',
  text:
    'I confirm that I own the business at the website above, or am authorised to act for it. ' +
    'I give Gen Clover permission to use its brand name, logo, photographs, written content and any other ' +
    'material on that website to build a demo website for me to review. I understand the demo is private: ' +
    'Gen Clover will share it only with me, will not publish it or use it in its own marketing without my ' +
    'written agreement, and will delete it, with the material copied for it, if I ask.',
}

export const DEMO_CONTACT_CONSENT =
  'I agree to be contacted about this demo request and acknowledge the privacy notice.'

export const initialDemoRequest = {
  demoType: 'redesign',
  template: '',
  websiteUrl: '',
  businessName: '',
  name: '',
  email: '',
  phoneCountry: 'IN',
  phone: '',
  notes: '',
  authorisation: false,
  consent: false,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const text = (v, max) =>
  typeof v === 'string'
    ? v
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, max)
    : ''

/** "example.com" becomes "https://example.com", so people can type it either way. */
export const normalizeUrl = (value) => {
  const trimmed = text(value, 300)
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** Cleans every field and returns { values, errors } keyed by field name. */
export const validateDemoRequest = (input = {}) => {
  const errors = {}
  const values = {
    demoType: text(input.demoType, 20),
    template: text(input.template, 60),
    websiteUrl: normalizeUrl(input.websiteUrl),
    businessName: text(input.businessName, 160),
    name: text(input.name, 120),
    email: text(input.email, 200).toLowerCase(),
    phoneCountry: text(input.phoneCountry, 2).toUpperCase(),
    phone: text(input.phone, 40),
    notes: text(input.notes, 2000),
    authorisation: input.authorisation === true,
    consent: input.consent === true,
  }
  const redesign = values.demoType === 'redesign'

  if (!demoTypeOptions.some((o) => o.value === values.demoType)) errors.demoType = 'Please choose the kind of demo you would like.'
  if (values.template && !templateChoiceOptions.some((o) => o.value === values.template))
    errors.template = 'Please choose one of the listed templates.'
  if (values.demoType === 'template' && !values.template) errors.template = 'Please choose a template, or "Not sure yet".'

  if (redesign && !values.websiteUrl) errors.websiteUrl = 'Please enter the address of your current website.'
  else if (values.websiteUrl && !isHttpUrl(values.websiteUrl))
    errors.websiteUrl = 'Please enter a full web address, like https://yourbusiness.com.'

  if (values.businessName.length < 2) errors.businessName = 'Please enter your business name.'
  if (values.name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(values.email)) errors.email = 'That does not look like a valid email address.'
  if (!values.phoneCountry) errors.phoneCountry = 'Please choose a country code.'
  else if (!isValidPhoneNumber(values.phone, values.phoneCountry))
    errors.phone = 'That number does not look right for the selected country.'

  if (redesign && !values.authorisation)
    errors.authorisation = 'We can only use material from your website with your permission.'
  if (!values.consent) errors.consent = 'We need your agreement before we can contact you.'

  // A template demo copies nothing from anyone's site, so no permission is recorded.
  if (!redesign) values.authorisation = false

  return { values, errors }
}

export const demoTypeLabel = (v) => demoTypeOptions.find((o) => o.value === v)?.label ?? v
export const templateChoiceLabel = (v) => templateChoiceOptions.find((o) => o.value === v)?.label ?? v
