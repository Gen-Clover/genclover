import { getCountries, getCountryCallingCode } from 'libphonenumber-js/min'

/**
 * Option lists for the Start a Project brief that come from the platform rather
 * than from hand-maintained tables: ISO 4217 currencies from the browser's Intl
 * data, and country calling codes from libphonenumber's metadata.
 */

/** Used when the browser cannot enumerate currencies (older Safari/Firefox). */
const FALLBACK_CURRENCIES = [
  'INR', 'USD', 'EUR', 'GBP', 'AED', 'SAR', 'QAR', 'SGD', 'AUD', 'CAD', 'NZD', 'JPY',
  'CHF', 'SEK', 'NOK', 'DKK', 'HKD', 'MYR', 'ZAR', 'KWD', 'OMR', 'BHD',
]

/** Shown first because most inquiries use them. */
const PINNED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED']

const safeDisplayNames = (type) => {
  try {
    return new Intl.DisplayNames(['en'], { type })
  } catch {
    return null
  }
}

const currencySymbol = (code) => {
  try {
    const parts = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value ?? code
  } catch {
    return code
  }
}

let currencyCache = null

export const getCurrencyOptions = () => {
  if (currencyCache) return currencyCache
  let codes = FALLBACK_CURRENCIES
  try {
    if (typeof Intl.supportedValuesOf === 'function') codes = Intl.supportedValuesOf('currency')
  } catch {
    /* keep the fallback */
  }
  const names = safeDisplayNames('currency')
  const toOption = (code) => {
    const name = names?.of(code) ?? code
    const symbol = currencySymbol(code)
    return {
      value: code,
      label: `${code} · ${name}`,
      display: `${code} · ${name}`,
      hint: symbol !== code ? symbol : undefined,
      keywords: symbol,
    }
  }
  const pinned = PINNED_CURRENCIES.filter((c) => codes.includes(c))
  const rest = codes.filter((c) => !pinned.includes(c)).sort()
  currencyCache = [...pinned, ...rest].map(toOption)
  return currencyCache
}

/** Sensible starting currency for each region answer. */
export const currencyForRegion = (region) =>
  ({
    india: 'INR',
    usa: 'USD',
    uk: 'GBP',
    europe: 'EUR',
    'middle-east': 'AED',
    'asia-pacific': 'USD',
  })[region] ?? 'USD'

/** Sensible starting phone country for each region answer. */
export const countryForRegion = (region) =>
  ({ india: 'IN', usa: 'US', uk: 'GB', 'middle-east': 'AE' })[region] ?? 'IN'

let countryCache = null

export const getDialCodeOptions = () => {
  if (countryCache) return countryCache
  const names = safeDisplayNames('region')
  countryCache = getCountries()
    .map((iso) => {
      const dial = `+${getCountryCallingCode(iso)}`
      const name = names?.of(iso) ?? iso
      return {
        value: iso,
        label: `${name} (${dial})`,
        display: `${iso} ${dial}`,
        keywords: `${dial} ${getCountryCallingCode(iso)} ${iso}`,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))
  return countryCache
}

/** Format a budget amount for display in the chosen currency. */
export const formatBudget = (amount, currency) => {
  const n = Number(amount)
  if (!amount || !Number.isFinite(n)) return ''
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return `${currency} ${n.toLocaleString('en')}`
  }
}
