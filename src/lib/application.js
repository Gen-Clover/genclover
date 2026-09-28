import { isValidPhoneNumber } from 'libphonenumber-js/min'

/**
 * A job application, shared by the apply form and /api/apply so both validate
 * the same way. Keep imports to packages Node can load directly (the API
 * imports this file without a bundler).
 */

export const CV_MAX_BYTES = 3 * 1024 * 1024 // Microsoft Graph's limit for a single-request attachment

export const CV_TYPES = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
}
export const CV_ACCEPT = '.pdf,.doc,.docx,' + Object.keys(CV_TYPES).join(',')

export const noticePeriodOptions = [
  { value: 'immediate', label: 'Immediately' },
  { value: '15-days', label: 'Within 15 days' },
  { value: '30-days', label: '30 days' },
  { value: '60-days', label: '60 days' },
  { value: '90-days', label: '90 days' },
  { value: 'serving', label: 'Serving notice period' },
]

export const experienceYearOptions = [
  { value: '0', label: 'Fresher (under 1 year)' },
  ...Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} year${i ? 's' : ''}` })),
  { value: '21', label: 'More than 20 years' },
]

export const initialApplication = {
  name: '',
  email: '',
  phoneCountry: 'IN',
  phone: '',
  city: '',
  experienceYears: '',
  noticePeriod: '',
  profileUrl: '',
  note: '',
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

/**
 * A real public web address: http(s), a dotted domain with a proper ending,
 * not an IP or localhost, and no "@" before the domain (that is an email).
 */
const isHttpUrl = (value) => {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      !url.username &&
      /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(host) &&
      host !== 'localhost'
    )
  } catch {
    return false
  }
}

/** Cleans every field and returns { values, errors } keyed by field name. */
export const validateApplication = (input = {}) => {
  const errors = {}
  let profileUrl = text(input.profileUrl, 300)
  if (profileUrl && !/^https?:\/\//i.test(profileUrl)) profileUrl = `https://${profileUrl}`

  const values = {
    name: text(input.name, 120),
    email: text(input.email, 200).toLowerCase(),
    phoneCountry: text(input.phoneCountry, 2).toUpperCase(),
    phone: text(input.phone, 40),
    city: text(input.city, 80),
    experienceYears: text(input.experienceYears, 3),
    noticePeriod: text(input.noticePeriod, 20),
    profileUrl,
    note: text(input.note, 2000),
    consent: input.consent === true,
  }

  if (values.name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(values.email)) errors.email = 'That does not look like a valid email address.'
  if (!values.phoneCountry) errors.phoneCountry = 'Please choose a country code.'
  else if (!isValidPhoneNumber(values.phone, values.phoneCountry))
    errors.phone = 'That number does not look right for the selected country.'
  if (!values.city) errors.city = 'Please tell us where you are based.'
  if (!experienceYearOptions.some((o) => o.value === values.experienceYears))
    errors.experienceYears = 'Please choose your total experience.'
  if (!noticePeriodOptions.some((o) => o.value === values.noticePeriod))
    errors.noticePeriod = 'Please choose when you could start.'
  if (values.profileUrl && !isHttpUrl(values.profileUrl))
    errors.profileUrl = 'Please enter a full link, like https://linkedin.com/in/you.'
  if (!values.consent) errors.consent = 'We need your agreement to process your application.'

  return { values, errors }
}

/** Client-side check of the chosen file; the server re-checks the bytes. */
export const cvProblem = (file) => {
  if (!file) return 'Please attach your CV.'
  const byExtension = /\.(pdf|docx?)$/i.test(file.name)
  if (!CV_TYPES[file.type] && !byExtension) return 'Please upload a PDF or Word document.'
  if (file.size > CV_MAX_BYTES) return 'That file is over 3 MB. Please upload a smaller PDF.'
  if (file.size === 0) return 'That file is empty.'
  return null
}

export const experienceLabel = (v) => experienceYearOptions.find((o) => o.value === v)?.label ?? v
export const noticeLabel = (v) => noticePeriodOptions.find((o) => o.value === v)?.label ?? v
