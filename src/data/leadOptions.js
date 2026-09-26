/**
 * Answer options for the Start a Project brief. (Spec §9)
 *
 * Kept free of imports so the serverless handler in /api/lead.js can load the
 * same lists the form shows, and a new option can never pass in the browser
 * but fail on the server. The service options live in services.js.
 */

/** Options for the Start a Project business-type step. (Spec §9, step 2) */
export const businessTypeOptions = [
  { value: 'startup', label: 'Startup' },
  { value: 'small-business', label: 'Small Business' },
  { value: 'growing-business', label: 'Growing Business' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'other', label: 'Other' },
]

/** Spec §9, step 3. */
export const regionOptions = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'UK' },
  { value: 'europe', label: 'Europe' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'asia-pacific', label: 'Asia-Pacific' },
  { value: 'other', label: 'Other' },
]

/** Spec §9, step 5 — optional. */
export const timelineOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-months', label: '1 – 2 months' },
  { value: '2-3-months', label: '2 – 3 months' },
  { value: '3-6-months', label: '3 – 6 months' },
  { value: '6-plus-months', label: '6+ months' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'not-sure', label: 'Not sure' },
]
