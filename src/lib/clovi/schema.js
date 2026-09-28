import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/min'

/**
 * Clovi, the Gen Clover chat assistant: the data model shared by the chat UI
 * and /api/clovi, so both validate the same way. The API imports this file
 * directly in Node, so keep imports to packages Node can load.
 */

export const BOT_NAME = 'Clovi'

export const purposes = [
  { value: 'project', label: 'Start a project' },
  { value: 'job', label: 'Explore jobs' },
  { value: 'question', label: 'Ask a question' },
]
export const purposeLabel = (v) => purposes.find((p) => p.value === v)?.label ?? v

/** Budget ranges offered in chat, by the visitor's phone country. Not a quote. */
export const budgetRanges = {
  INR: ['Under ₹5 lakh', '₹5–15 lakh', '₹15–50 lakh', '₹50 lakh+'],
  USD: ['Under $10k', '$10k–25k', '$25k–75k', '$75k+'],
}
export const budgetCurrencyFor = (country) => (country === 'IN' ? 'INR' : 'USD')

/** The Start a Project region, derived from the phone number's country. */
const EUROPE = 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE NO CH IS'.split(' ')
const MIDDLE_EAST = 'AE SA QA KW BH OM JO LB IL TR EG'.split(' ')
const ASIA_PACIFIC = 'SG AU NZ JP MY ID TH PH VN HK KR CN TW BD LK NP'.split(' ')
export const regionFor = (country) => {
  if (country === 'IN') return 'india'
  if (country === 'US') return 'usa'
  if (country === 'GB') return 'uk'
  if (EUROPE.includes(country)) return 'europe'
  if (MIDDLE_EAST.includes(country)) return 'middle-east'
  if (ASIA_PACIFIC.includes(country)) return 'asia-pacific'
  return 'other'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const clean = (value, max) =>
  typeof value === 'string'
    ? value
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, max)
    : ''

export const validateName = (v) => (clean(v, 120).length >= 2 ? null : 'Please tell me your name.')
export const validateEmail = (v) =>
  EMAIL_RE.test(clean(v, 200)) ? null : 'That email does not look quite right. Could you check it?'
export const validatePhone = (phone, country) => {
  if (!country) return 'Please choose your country code.'
  return isValidPhoneNumber(clean(phone, 40), country)
    ? null
    : 'That number does not look right for the country code. Could you check it?'
}

export const internationalPhone = (phone, country) => {
  try {
    return parsePhoneNumber(phone, country).formatInternational()
  } catch {
    return phone
  }
}

/** Cleans the contact block; returns { values, errors }. */
export const validateContact = (input = {}) => {
  const values = {
    name: clean(input.name, 120),
    email: clean(input.email, 200).toLowerCase(),
    phone: clean(input.phone, 40),
    phoneCountry: clean(input.phoneCountry, 2).toUpperCase(),
    purpose: input.purpose,
  }
  const errors = {}
  const n = validateName(values.name)
  const e = validateEmail(values.email)
  const p = validatePhone(values.phone, values.phoneCountry)
  if (n) errors.name = n
  if (e) errors.email = e
  if (p) errors.phone = p
  if (!purposes.some((x) => x.value === values.purpose)) errors.purpose = 'Unknown purpose.'
  return { values, errors }
}

/** Transcript limits, so one conversation cannot become a huge email. */
export const TRANSCRIPT_MAX_MESSAGES = 80
export const TRANSCRIPT_MAX_CHARS = 1200
