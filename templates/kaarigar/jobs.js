// Job workflow rules shared by the office board and the technician app.

export const STAGES = [
  ['new', 'New'],
  ['scheduled', 'Scheduled'],
  ['enroute', 'En route'],
  ['onsite', 'On site'],
  ['done', 'Done'],
]

export const TECHS = [
  { id: 'ravi', name: 'Ravi Kumar', skill: 'Plumbing', hue: 24, home: [70, 150] },
  { id: 'salma', name: 'Salma Qureshi', skill: 'Electrical', hue: 205, home: [300, 60] },
  { id: 'joseph', name: 'Joseph Dsouza', skill: 'AC service', hue: 150, home: [190, 175] },
]

export const CHECKLISTS = {
  Plumbing: ['Water supply shut off', 'Leak fixed and tested', 'Area cleaned up'],
  Electrical: ['Power isolated at the board', 'Wiring checked and fixed', 'Tested with the customer'],
  'AC service': ['Filters cleaned', 'Gas pressure checked', 'Cooling tested for 10 minutes'],
}

const ORDER = STAGES.map(([id]) => id)

// what a job still needs before the technician can mark it done
export const missing = (job) => {
  const out = []
  if (job.checks.some((c) => !c)) out.push('checklist')
  if (!job.photo) out.push('photo')
  if (!job.signed) out.push('signature')
  return out
}

// the one step forward a job can take, or null
export function nextStage(job) {
  if (job.stage === 'new') return job.tech ? 'scheduled' : null
  if (job.stage === 'onsite') return missing(job).length ? null : 'done'
  const i = ORDER.indexOf(job.stage)
  return i >= 0 && i < ORDER.length - 1 ? ORDER[i + 1] : null
}

export function advance(job) {
  const to = nextStage(job)
  if (!to) throw new Error(`job ${job.id} can't move on from ${job.stage}`)
  job.stage = to
  if (to === 'done') job.invoice = 'draft'
  return job
}

// invoices only exist once the work is done: draft -> sent -> paid
export function invoiceStep(job) {
  const flow = { draft: 'sent', sent: 'paid' }
  if (job.stage !== 'done' || !flow[job.invoice]) throw new Error(`invoice for job ${job.id} can't move on`)
  job.invoice = flow[job.invoice]
  return job
}
