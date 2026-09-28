import { readAttribution } from '../analytics'
import { transcriptOf } from './engine'

/**
 * Clovi's network calls. Project leads and contact details go to /api/clovi;
 * job applications go to /api/apply, the same endpoint as the careers form, so
 * the hiring email is identical.
 */

const page = () => (typeof window === 'undefined' ? '/' : window.location.pathname + window.location.search)

const post = async (url, body) => {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong.')
  return data
}

const contactOf = (s) => ({ ...s.contact, purpose: s.purpose ?? 'question' })

export const cloviApi = {
  contact: (s) => post('/api/clovi', { action: 'contact', contact: contactOf(s), sourcePage: page() }),

  lead: (s) =>
    post('/api/clovi', { action: 'lead', contact: contactOf(s), lead: s.lead, attribution: readAttribution(), sourcePage: page() }),

  apply: async (s) => {
    const file = s.job.cv
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
      reader.onerror = () => reject(new Error('That file could not be read.'))
      reader.readAsDataURL(file)
    })
    const skills = Object.entries(s.job.skills ?? {}).map(([k, v]) => `${k}: ${v}`)
    return post('/api/apply', {
      jobId: s.job.jobId,
      name: s.contact.name,
      email: s.contact.email,
      phone: s.contact.phone,
      phoneCountry: s.contact.phoneCountry,
      city: s.job.city,
      experienceYears: s.job.experienceYears,
      noticePeriod: s.job.noticePeriod,
      profileUrl: s.job.profileUrl ?? '',
      note: ['Applied through the Clovi chat assistant.', skills.length ? `Self-rated skills: ${skills.join('; ')}` : ''].filter(Boolean).join('\n'),
      consent: true,
      cv: { name: file.name, type: file.type, data },
      elapsedMs: Date.now() - s.startedAt,
      sourcePage: `Clovi chat on ${page()}`,
    })
  },

  transcriptBody: (s) => ({
    action: 'transcript',
    contact: contactOf(s),
    messages: transcriptOf(s),
    unanswered: s.unanswered,
    outcome: { lead: s.sent.lead, application: s.sent.application, handoff: s.handoff },
    sourcePage: page(),
  }),

  transcript: (s) => post('/api/clovi', cloviApi.transcriptBody(s)),

  /** For page close: the browser delivers it even as the tab goes away. */
  transcriptBeacon: (s) => {
    try {
      const blob = new Blob([JSON.stringify(cloviApi.transcriptBody(s))], { type: 'application/json' })
      return navigator.sendBeacon?.('/api/clovi', blob) ?? false
    } catch {
      return false
    }
  },

  jobs: async () => {
    const response = await fetch('/api/jobs', { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error('Roles unavailable')
    return (await response.json()).jobs ?? []
  },
}
