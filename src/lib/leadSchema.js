import { serviceEnquiryOptions } from '../data/services'
import {
  businessTypeOptions,
  regionOptions,
  budgetOptions,
  timelineOptions,
} from '../data/industries'

/**
 * The Start a Project brief. (Spec §9)
 *
 * One declarative definition of the eight steps, shared by the form UI and the
 * client-side validator. The serverless handler in /api/lead.js re-validates
 * everything independently — this is for the visitor's benefit, not for trust.
 */

export const STEPS = [
  {
    id: 'service',
    number: 1,
    kind: 'choice',
    question: 'What do you need?',
    help: 'Pick the closest fit. We will work out the detail together.',
    options: serviceEnquiryOptions,
    required: true,
  },
  {
    id: 'businessType',
    number: 2,
    kind: 'choice',
    question: 'What type of business?',
    help: 'This helps us pitch the conversation at the right level.',
    options: businessTypeOptions,
    required: true,
  },
  {
    id: 'region',
    number: 3,
    kind: 'choice',
    question: 'Where are you located?',
    help: 'So we can suggest sensible times to talk.',
    options: regionOptions,
    required: true,
  },
  {
    id: 'budget',
    number: 4,
    kind: 'choice',
    question: 'Approximate budget?',
    help: 'Optional. A rough range helps us propose something realistic rather than generic.',
    options: budgetOptions,
    required: false,
  },
  {
    id: 'timeline',
    number: 5,
    kind: 'choice',
    question: 'What is your timeline?',
    help: 'Optional, and an honest "not sure" is genuinely fine.',
    options: timelineOptions,
    required: false,
  },
  {
    id: 'details',
    number: 6,
    kind: 'text',
    question: 'Tell us about your project.',
    help: 'Goals, requirements, what is working now and what is not. The more context, the more useful our reply.',
    field: {
      name: 'details',
      label: 'Project details',
      type: 'textarea',
      placeholder: 'Tell us about your project, goals and requirements.',
      required: true,
      minLength: 20,
      maxLength: 4000,
    },
  },
  {
    id: 'contact',
    number: 7,
    kind: 'fields',
    question: 'How do we reach you?',
    help: 'We use these details only to respond to this enquiry.',
    fields: [
      { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name', maxLength: 120 },
      { name: 'company', label: 'Company name', type: 'text', required: false, autoComplete: 'organization', maxLength: 160 },
      { name: 'email', label: 'Business email', type: 'email', required: true, autoComplete: 'email', maxLength: 200 },
      { name: 'phone', label: 'Phone number', type: 'tel', required: true, autoComplete: 'tel', maxLength: 40 },
    ],
  },
  {
    id: 'consent',
    number: 8,
    kind: 'consent',
    question: 'One last thing.',
    help: 'Please confirm you are happy for us to get in touch.',
    label:
      'I agree to be contacted regarding this enquiry and acknowledge the privacy notice.',
    required: true,
  },
]

export const TOTAL_STEPS = STEPS.length

export const initialLeadState = {
  service: '',
  businessType: '',
  region: '',
  budget: '',
  timeline: '',
  details: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  consent: false,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Deliberately permissive: international numbers vary far more than most
// regexes assume, and rejecting a valid number costs more than a loose match.
const PHONE_RE = /^[+()\d][\d\s\-().]{6,}$/

/** Validate one field. Returns an error string, or null when valid. */
export const validateField = (name, value, allValues = {}) => {
  const trimmed = typeof value === 'string' ? value.trim() : value

  switch (name) {
    case 'service':
      return trimmed ? null : 'Please choose the service you need.'
    case 'businessType':
      return trimmed ? null : 'Please choose a business type.'
    case 'region':
      return trimmed ? null : 'Please choose your location.'
    case 'details':
      if (!trimmed) return 'Please tell us a little about the project.'
      if (trimmed.length < 20) return 'A sentence or two more would really help us.'
      if (trimmed.length > 4000) return 'Please keep this under 4000 characters.'
      return null
    case 'name':
      return trimmed ? null : 'Please enter your name.'
    case 'email':
      if (!trimmed) return 'Please enter an email address.'
      return EMAIL_RE.test(trimmed) ? null : 'That does not look like a valid email address.'
    case 'phone':
      if (!trimmed) return 'Please enter a phone number.'
      return PHONE_RE.test(trimmed) ? null : 'Please enter a valid phone number.'
    case 'consent':
      return value === true ? null : 'We need your agreement before we can contact you.'
    default:
      return null
  }
}

/** Field names that a given step is responsible for. */
export const fieldsForStep = (step) => {
  if (step.kind === 'choice') return [step.id]
  if (step.kind === 'text') return [step.field.name]
  if (step.kind === 'fields') return step.fields.map((f) => f.name)
  if (step.kind === 'consent') return ['consent']
  return []
}

/** Validate every field a step owns. Returns { [field]: message }. */
export const validateStep = (step, values) => {
  const errors = {}
  fieldsForStep(step).forEach((name) => {
    const message = validateField(name, values[name], values)
    if (message) errors[name] = message
  })
  return errors
}

/** Validate the whole brief — the final gate before submitting. */
export const validateAll = (values) => {
  const errors = {}
  STEPS.forEach((step) => Object.assign(errors, validateStep(step, values)))
  return errors
}
