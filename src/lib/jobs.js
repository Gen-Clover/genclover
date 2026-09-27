/**
 * The job model, shared by the careers pages, the admin portal and the API.
 *
 * One definition of the fields, their options and their validation, so the
 * browser and /api/admin/jobs can never disagree about what a valid post is.
 * This file must stay dependency-free (and use explicit .js imports if it ever
 * gains any), because the serverless functions import it directly in Node.
 */

/* ---------------------------------------------------------------- options */

export const workplaceOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
]

export const employmentTypeOptions = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
]

export const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'ai', label: 'AI & Automation' },
  { value: 'design', label: 'Design' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'marketing', label: 'Marketing & SEO' },
  { value: 'sales', label: 'Sales & Business' },
  { value: 'operations', label: 'Operations' },
]

/** open → listed and accepting; closed → listed as a record; draft → admin only. */
export const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
]

export const salaryPeriodOptions = [
  { value: 'year', label: 'per year' },
  { value: 'month', label: 'per month' },
  { value: 'hour', label: 'per hour' },
]

export const datePostedOptions = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Past 24 hours' },
  { value: '7', label: 'Past week' },
  { value: '30', label: 'Past month' },
  { value: '90', label: 'Past 3 months' },
]

/** Naukri-style: the visitor's own experience, matched against each role's range. */
export const experienceFilterOptions = [
  { value: '', label: 'Any experience' },
  { value: '0', label: 'Fresher (0 years)' },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map((n) => ({
    value: String(n),
    label: `${n} year${n === 1 ? '' : 's'}`,
  })),
]

export const sortOptions = [
  { value: 'recent', label: 'Most recent' },
  { value: 'relevance', label: 'Most relevant' },
  { value: 'experience', label: 'Experience: low to high' },
]

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value
export const workplaceLabel = (v) => labelOf(workplaceOptions, v)
export const employmentTypeLabel = (v) => labelOf(employmentTypeOptions, v)
export const departmentLabel = (v) => labelOf(departmentOptions, v)

/* ------------------------------------------------------------- formatting */

export const formatExperience = ({ experienceMin: min, experienceMax: max }) => {
  if (min == null && max == null) return 'Any experience'
  if (min === 0 && (max == null || max === 0)) return max === 0 ? 'Fresher' : 'Any experience'
  if (max == null) return `${min}+ years`
  if (min == null || min === max) return `${max} year${max === 1 ? '' : 's'}`
  return `${min}–${max} years`
}

const DAY = 24 * 60 * 60 * 1000

/** "Posted today", "3 days ago", "2 weeks ago", "4 months ago". */
export const formatPosted = (iso, now = Date.now()) => {
  const days = Math.floor((now - new Date(iso).getTime()) / DAY)
  if (!Number.isFinite(days)) return ''
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) {
    const w = Math.floor(days / 7)
    return `${w} week${w === 1 ? '' : 's'} ago`
  }
  if (days < 365) {
    const m = Math.floor(days / 30)
    return `${m} month${m === 1 ? '' : 's'} ago`
  }
  const y = Math.floor(days / 365)
  return `${y} year${y === 1 ? '' : 's'} ago`
}

export const formatSalary = (salary) => {
  if (!salary?.visible || (!salary.min && !salary.max)) return null
  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: salary.currency || 'INR',
      maximumFractionDigits: 0,
      notation: n >= 100000 ? 'compact' : 'standard',
    }).format(n)
  const period = labelOf(salaryPeriodOptions, salary.period || 'year')
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} ${period}`
  return `${salary.min ? 'From ' + fmt(salary.min) : 'Up to ' + fmt(salary.max)} ${period}`
}

export const locationText = (job) =>
  [workplaceLabel(job.workplace), ...(job.locations ?? [])].filter(Boolean).join(' · ')

/* -------------------------------------------------------------- filtering */

export const emptyFilters = {
  q: '',
  loc: '',
  workplace: [],
  type: [],
  dept: [],
  exp: '',
  posted: '',
  hideClosed: false,
  sort: 'recent',
}

const haystack = (job) =>
  [
    job.title,
    departmentLabel(job.department),
    job.summary,
    ...(job.skills ?? []),
    ...(job.locations ?? []),
    job.description,
  ]
    .join(' ')
    .toLowerCase()

/** Title and skill hits count most, then summary, then the body. */
const relevance = (job, terms) =>
  terms.reduce((score, t) => {
    if (job.title.toLowerCase().includes(t)) score += 6
    if ((job.skills ?? []).some((s) => s.toLowerCase().includes(t))) score += 4
    if ((job.summary ?? '').toLowerCase().includes(t)) score += 2
    if ((job.description ?? '').toLowerCase().includes(t)) score += 1
    return score
  }, 0)

/**
 * The predicate for one facet. `except` lets the filter menus count how many
 * roles each option would show with every *other* filter applied.
 */
const matches = (job, f, except, now) => {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean)
  if (except !== 'q' && terms.length && !terms.every((t) => haystack(job).includes(t))) return false

  const loc = f.loc.trim().toLowerCase()
  if (except !== 'loc' && loc) {
    const where = [workplaceLabel(job.workplace), ...(job.locations ?? [])].join(' ').toLowerCase()
    if (!where.includes(loc)) return false
  }

  if (except !== 'workplace' && f.workplace.length && !f.workplace.includes(job.workplace)) return false
  if (except !== 'type' && f.type.length && !f.type.includes(job.employmentType)) return false
  if (except !== 'dept' && f.dept.length && !f.dept.includes(job.department)) return false

  if (except !== 'exp' && f.exp !== '') {
    const years = Number(f.exp)
    if ((job.experienceMin ?? 0) > years) return false
    if (job.experienceMax != null && job.experienceMax < years) return false
  }

  if (except !== 'posted' && f.posted) {
    if (now - new Date(job.postedAt).getTime() > Number(f.posted) * DAY) return false
  }

  if (except !== 'hideClosed' && f.hideClosed && job.status !== 'open') return false
  return true
}

export const filterJobs = (jobs, f, now = Date.now()) => {
  const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean)
  const result = jobs.filter((job) => matches(job, f, null, now))

  const byRecent = (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
  const sorters = {
    recent: byRecent,
    relevance: (a, b) => relevance(b, terms) - relevance(a, terms) || byRecent(a, b),
    experience: (a, b) => (a.experienceMin ?? 0) - (b.experienceMin ?? 0) || byRecent(a, b),
  }
  // Open roles always come first; closed ones stay as a record underneath.
  const openFirst = (a, b) => (a.status === 'open' ? 0 : 1) - (b.status === 'open' ? 0 : 1)
  return result.sort((a, b) => openFirst(a, b) || (sorters[f.sort] ?? byRecent)(a, b))
}

/** How many roles an option would show, given every other active filter. */
export const countFor = (jobs, f, facet, predicate, now = Date.now()) =>
  jobs.filter((job) => matches(job, f, facet, now) && predicate(job)).length

export const activeFilterCount = (f) =>
  f.workplace.length + f.type.length + f.dept.length + (f.exp !== '' ? 1 : 0) + (f.posted ? 1 : 0) + (f.hideClosed ? 1 : 0)

/* ------------------------------------------------------------- validation */

const LIMITS = {
  title: 120,
  summary: 240,
  description: 5000,
  listItem: 300,
  listLength: 25,
  location: 80,
  skill: 40,
  meta: 170,
}

const text = (v, max) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : ''

/** Accepts an array or newline/comma separated text, trims, drops blanks and duplicates. */
const list = (v, maxItem, sep = /\n/) => {
  const raw = Array.isArray(v) ? v : typeof v === 'string' ? v.split(sep) : []
  const seen = new Set()
  return raw
    .map((item) => text(String(item ?? '').replace(/^\s*[-•*]\s*/, ''), maxItem))
    .filter((item) => item && !seen.has(item.toLowerCase()) && seen.add(item.toLowerCase()))
    .slice(0, LIMITS.listLength)
}

const intOrNull = (v, max) => {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isInteger(n) && n >= 0 && n <= max ? n : NaN
}

const oneOf = (options, v) => options.some((o) => o.value === v)

/** URL-safe id from a title, with a short random suffix so reposts never collide. */
export const makeJobId = (title) => {
  const slug = text(title, 80)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${slug || 'role'}-${Math.random().toString(36).slice(2, 6)}`
}

export const isValidJobId = (id) => typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,80}$/.test(id)

/** A blank post for the admin editor. */
export const emptyJob = () => ({
  title: '',
  department: 'engineering',
  employmentType: 'full-time',
  workplace: 'remote',
  locations: ['Chandigarh, India'],
  openings: 1,
  experienceMin: 0,
  experienceMax: null,
  salary: { min: null, max: null, currency: 'INR', period: 'year', visible: false },
  summary: '',
  description: '',
  responsibilities: [],
  requirements: [],
  niceToHave: [],
  skills: [],
  applyEmail: '',
  metaDescription: '',
  status: 'draft',
  postedAt: new Date().toISOString(),
})

/**
 * Validates and normalises a job from the admin form (or the API body).
 * Returns { values, errors }; `values` is safe to store only when errors is empty.
 */
export const validateJob = (input = {}) => {
  const errors = {}
  const salaryIn = input.salary ?? {}

  const values = {
    title: text(input.title, LIMITS.title),
    department: input.department,
    employmentType: input.employmentType,
    workplace: input.workplace,
    // Semicolons, because a location like "Chandigarh, India" has its own comma.
    locations: list(input.locations, LIMITS.location, /[\n;]/),
    openings: intOrNull(input.openings, 500),
    experienceMin: intOrNull(input.experienceMin, 40),
    experienceMax: intOrNull(input.experienceMax, 40),
    salary: {
      min: intOrNull(salaryIn.min, 1e9),
      max: intOrNull(salaryIn.max, 1e9),
      currency: /^[A-Z]{3}$/.test(salaryIn.currency ?? '') ? salaryIn.currency : 'INR',
      period: oneOf(salaryPeriodOptions, salaryIn.period) ? salaryIn.period : 'year',
      visible: Boolean(salaryIn.visible),
    },
    summary: text(input.summary, LIMITS.summary),
    description: text(input.description, LIMITS.description),
    responsibilities: list(input.responsibilities, LIMITS.listItem),
    requirements: list(input.requirements, LIMITS.listItem),
    niceToHave: list(input.niceToHave, LIMITS.listItem),
    skills: list(input.skills, LIMITS.skill, /[\n,]/),
    applyEmail: text(input.applyEmail, 200).toLowerCase(),
    metaDescription: text(input.metaDescription, LIMITS.meta),
    status: input.status,
    postedAt: input.postedAt,
  }

  if (values.title.length < 3) errors.title = 'Give the role a title.'
  if (!oneOf(departmentOptions, values.department)) errors.department = 'Pick a department.'
  if (!oneOf(employmentTypeOptions, values.employmentType)) errors.employmentType = 'Pick a job type.'
  if (!oneOf(workplaceOptions, values.workplace)) errors.workplace = 'Pick remote, hybrid or on-site.'
  if (values.workplace !== 'remote' && values.locations.length === 0)
    errors.locations = 'Hybrid and on-site roles need at least one location.'
  if (Number.isNaN(values.openings)) errors.openings = 'Use a whole number.'
  if (Number.isNaN(values.experienceMin)) errors.experienceMin = 'Use whole years between 0 and 40.'
  if (Number.isNaN(values.experienceMax)) errors.experienceMax = 'Use whole years between 0 and 40.'
  if (
    values.experienceMin != null &&
    values.experienceMax != null &&
    !Number.isNaN(values.experienceMin) &&
    !Number.isNaN(values.experienceMax) &&
    values.experienceMax < values.experienceMin
  )
    errors.experienceMax = 'Maximum must be at least the minimum.'
  if (Number.isNaN(values.salary.min) || Number.isNaN(values.salary.max))
    errors.salary = 'Use whole numbers for the salary range.'
  else if (values.salary.min && values.salary.max && values.salary.max < values.salary.min)
    errors.salary = 'Maximum salary must be at least the minimum.'
  if (values.summary.length < 20) errors.summary = 'Write a one or two sentence summary (20+ characters).'
  if (values.description.length < 40) errors.description = 'Describe the role in a short paragraph or two.'
  if (values.responsibilities.length === 0) errors.responsibilities = 'Add at least one responsibility.'
  if (values.requirements.length === 0) errors.requirements = 'Add at least one requirement.'
  if (values.applyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.applyEmail))
    errors.applyEmail = 'That email address does not look right.'
  if (!oneOf(statusOptions, values.status)) errors.status = 'Pick a status.'
  const posted = new Date(values.postedAt)
  if (Number.isNaN(posted.getTime())) errors.postedAt = 'Pick the date the role was posted.'
  else values.postedAt = posted.toISOString()

  if (!values.metaDescription) values.metaDescription = values.summary.slice(0, LIMITS.meta)

  return { values, errors }
}
