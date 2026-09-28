import { purposes, budgetRanges, budgetCurrencyFor, validateName, validateEmail, validatePhone, BOT_NAME } from './schema'
import { search, curatedById, projectsForService, projectCard, serviceByTitle } from './knowledge'
import { serviceEnquiryOptions } from '../../data/services'
import { businessTypeOptions, timelineOptions } from '../../data/leadOptions'
import { experienceYearOptions, noticePeriodOptions } from '../application'
import { formatExperience, locationText } from '../jobs'
import { routes, contact as company } from '../../data/site'

/**
 * Clovi's conversation: a small state machine that runs entirely in the
 * browser. `reply(state, input, ctx)` returns the next state; `ctx` supplies
 * the network (send contact / lead / application, list open roles), so this
 * file stays free of fetch calls and easy to follow.
 *
 * Flow: purpose → name → email → mobile (emailed to the team at once) →
 *   project: service → business type → timeline → budget → details → lead email
 *   job:     role → experience → notice → city → skills → profile → CV → application email
 *   question: straight to answers
 * then "chat": answers from the site's content, cards, and a hand-off to the team.
 */

let seq = 0
const id = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`
const bot = (text, extra = {}) => ({ id: id(), from: 'bot', text, ...extra })
const user = (text) => ({ id: id(), from: 'user', text })
const chip = (label, value = label) => ({ label, value })
const first = (name) => String(name).trim().split(/\s+/)[0]

const CHAT_CHIPS = (s) =>
  [
    !s.sent.lead && chip('Start a project', 'go:project'),
    chip('Open roles', 'go:job'),
    chip('See our work', 'ask:See our work'),
    chip('Talk to a person', 'go:handoff'),
  ].filter(Boolean)

export const initialState = () => ({
  v: 1,
  step: 'purpose',
  purpose: null,
  contact: { name: '', email: '', phone: '', phoneCountry: 'IN' },
  lead: {},
  job: {},
  messages: [
    bot(`Hi, I’m ${BOT_NAME} 🍀 Gen Clover’s assistant. I can answer questions, show you our work, take a project brief, or help you apply for a role.`),
    bot('What brings you here today?', { chips: purposes.map((p) => chip(p.label, `purpose:${p.value}`)) }),
  ],
  sent: { contact: false, lead: false, application: false, transcriptAt: 0 },
  unanswered: [],
  handoff: false,
  startedAt: Date.now(),
})

const say = (s, ...msgs) => ({ ...s, messages: [...s.messages, ...msgs] })

/** Match typed text to one of the offered options (label contains / contained). */
const matchOption = (text, options) => {
  const t = String(text).trim().toLowerCase()
  if (!t) return null
  return (
    options.find((o) => o.label.toLowerCase() === t) ??
    options.find((o) => o.label.toLowerCase().includes(t) || t.includes(o.label.toLowerCase().split(' ')[0]))
  )
}

/* ---------------------------------------------------------------- steps */

const ASK = {
  name: (s) =>
    bot(
      s.purpose === 'job'
        ? 'Great, let’s find you a role. First, what’s your name?'
        : s.purpose === 'project'
          ? 'Brilliant, let’s talk about your project. First, what’s your name?'
          : 'Happy to help. First, what’s your name?',
      { note: 'By sharing your details you agree to our Privacy notice. We use them only to reply to you.' }
    ),
  email: (s) => bot(`Nice to meet you, ${first(s.contact.name)}! What’s your email address?`),
  phone: () => bot('And your mobile number? The team may call or WhatsApp you about this.', { input: 'phone' }),
  p_service: () =>
    bot('What do you need? Pick the closest fit, or just describe it.', {
      chips: serviceEnquiryOptions.map((o) => chip(o.label, `service:${o.value}`)),
    }),
  p_type: () => bot('What kind of business is it for?', { chips: businessTypeOptions.map((o) => chip(o.label, `type:${o.value}`)) }),
  p_timeline: () =>
    bot('When would you like to get started?', {
      chips: timelineOptions.map((o) => chip(o.label, `timeline:${o.value}`)),
    }),
  p_budget: (s) =>
    bot('Roughly what budget do you have in mind? A range is fine, and “not sure” is completely okay.', {
      chips: [...budgetRanges[budgetCurrencyFor(s.contact.phoneCountry)].map((r) => chip(r, `budget:${r}`)), chip('Not sure yet', 'budget:')],
    }),
  p_details: () => bot('Last one: in a sentence or two, what are you trying to build or fix?'),
}

const toStep = (s, step) => ({ ...say(s, ASK[step](s)), step })

/* ------------------------------------------------------------- job flow */

const roleCard = (j) => ({
  kind: 'role',
  title: j.title,
  meta: `${locationText(j)} · ${formatExperience(j)}`,
  text: j.summary,
  to: `${routes.careers}/${j.id}`,
  value: `role:${j.id}`,
})

const startJobs = async (s, ctx) => {
  const jobs = (await ctx.jobs().catch(() => [])).filter((j) => j.status === 'open')
  const next = { ...s, step: 'j_role', job: {}, openJobs: jobs.map((j) => ({ id: j.id, title: j.title, skills: j.skills ?? [], experienceMin: j.experienceMin ?? 0 })) }
  if (jobs.length === 0) {
    return say(
      next,
      bot('There are no open roles right now, but we read every general application and keep good ones on file.', {
        chips: [chip('Send a general application', 'role:general'), chip('Ask a question', 'go:chat')],
      })
    )
  }
  return say(
    next,
    bot(jobs.length === 1 ? 'We’re hiring for this role right now:' : `We’re hiring for ${jobs.length} roles right now:`, {
      cards: jobs.map(roleCard),
      chips: [...jobs.map((j) => chip(`Apply: ${j.title}`, `role:${j.id}`)), chip('General application', 'role:general')],
    })
  )
}

const EXP_CHIPS = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '15', '21'].map((v) => {
  const o = experienceYearOptions.find((x) => x.value === v)
  return chip(v === '0' ? 'Fresher' : v === '21' ? '20+ years' : o.label, `exp:${v}`)
})

const SKILL_LEVELS = [chip('Expert', 'Expert'), chip('Comfortable', 'Comfortable'), chip('Learning', 'Learning')]

const nextSkill = (s) => {
  const role = s.openJobs?.find((j) => j.id === s.job.jobId)
  const pending = (role?.skills ?? []).slice(0, 3).filter((k) => !(k in (s.job.skills ?? {})))
  if (pending.length === 0) return null
  return pending[0]
}

const askSkillOrProfile = (s) => {
  const skill = nextSkill(s)
  if (skill) return { ...say(s, bot(`How would you rate yourself in ${skill}?`, { chips: SKILL_LEVELS })), step: 'j_skill', pendingSkill: skill }
  return {
    ...say(s, bot('Do you have a LinkedIn or portfolio link? Paste it here, or skip.', { chips: [chip('Skip', 'skip')] })),
    step: 'j_link',
  }
}

/* --------------------------------------------------------------- answers */

const answerFrom = (doc, s) => {
  const chips = (doc.chips ?? []).map((c) =>
    /start a project/i.test(c) ? chip(c, 'go:project') : /talk to a person/i.test(c) ? chip(c, 'go:handoff') : chip(c, `ask:${c}`)
  )
  return bot(doc.answer, {
    cards: doc.cards,
    links: doc.links,
    chips: chips.length ? chips : CHAT_CHIPS(s),
  })
}

const INTENTS = [
  [/^(hi|hello|hey|hii+|namaste|good (morning|afternoon|evening))\b/i, 'greet'],
  [/\b(thanks|thank you|thx|great|awesome|perfect|cool)\b/i, 'thanks'],
  [/\b(bye|goodbye|see you|that'?s all)\b/i, 'bye'],
  [/\b(human|person|someone|real|agent|representative|call me|callback)\b/i, 'handoff'],
  [/\bwho are you\b|\bare you (a )?(bot|human|ai|real)\b|\byour name\b/i, 'clovi'],
  [/\b(services?|what do you (do|build|offer)|what can you (do|build))\b/i, 'services'],
  [/\b(start|begin|new) (a )?project\b|\bhire you\b|\bwork with you\b|\bget a quote\b/i, 'project'],
  [/\b(jobs?|careers?|hiring|vacanc|openings?|apply|internship)\b/i, 'jobs'],
]

/** Suggested questions go straight to their answer rather than through search. */
const CHIP_ANSWERS = {
  'see our work': 'work',
  'what do you build?': 'services',
  'how do you work?': 'process',
  'how much does it cost?': 'pricing',
  'pricing': 'pricing',
  'contact the team': 'contact',
  'ways to start': 'start',
  'support after launch': 'support',
  'discover stage': 'step:Discover',
}

const answerQuestion = async (s, text, ctx) => {
  const direct = CHIP_ANSWERS[text.trim().toLowerCase()]
  if (direct) return say(s, answerFrom(curatedById(direct), s))
  const intent = INTENTS.find(([re]) => re.test(text))?.[1]
  if (intent === 'greet') return say(s, bot(`Hi ${first(s.contact.name) || 'there'}! What would you like to know?`, { chips: CHAT_CHIPS(s) }))
  if (intent === 'thanks') return say(s, bot('Happy to help! Anything else?', { chips: CHAT_CHIPS(s) }))
  if (intent === 'bye') return say(s, bot(`Thanks for stopping by${s.contact.name ? `, ${first(s.contact.name)}` : ''}. The team has your details and will be in touch. 🍀`))
  if (intent === 'handoff') return handoff(s, ctx)
  if (intent === 'project' && !s.sent.lead) return toStep({ ...s, purpose: s.purpose ?? 'project' }, 'p_service')
  if (intent === 'jobs') return startJobs(s, ctx)
  if (intent === 'clovi' || intent === 'services') return say(s, answerFrom(curatedById(intent), s))

  const doc = search(text)
  if (doc?.id === 'jobs') return startJobs(s, ctx)
  if (doc) return say(s, answerFrom(doc, s))

  return say(
    { ...s, unanswered: [...s.unanswered, text].slice(-20) },
    bot(`I don’t have a confident answer to that, so I’ve noted it for the team. They’ll reply to ${s.contact.email || 'you'} by email. Meanwhile, is there something else I can help with?`, {
      chips: CHAT_CHIPS(s),
    })
  )
}

const handoff = async (s, ctx) => {
  const next = say(
    { ...s, handoff: true },
    bot(`Done. I’ve asked the team to get in touch with you at ${s.contact.email}${s.contact.phone ? ' or on your mobile' : ''}, usually within one working day. You can also email ${company.email} directly.`, {
      chips: CHAT_CHIPS({ ...s, handoff: true }).filter((c) => c.value !== 'go:handoff'),
    })
  )
  await ctx.transcript(next).catch(() => {})
  return { ...next, sent: { ...next.sent, transcriptAt: next.messages.length } }
}

/* ---------------------------------------------------------------- reply */

/**
 * input: { kind: 'text', text } | { kind: 'chip', value, label } |
 *        { kind: 'phone', phone, country } | { kind: 'file', file }
 */
export const reply = async (state, input, ctx) => {
  let s = state
  const echo = input.kind === 'chip' ? input.label : input.kind === 'phone' ? input.phone : input.kind === 'file' ? `📎 ${input.file.name}` : input.text
  if (echo) s = say(s, user(echo))
  const value = input.kind === 'chip' ? input.value : ''
  const text = input.kind === 'text' ? input.text.trim() : ''

  // Chips that work from anywhere once the visitor has shared their details.
  if (!['purpose', 'name', 'email', 'phone'].includes(s.step)) {
    if (value === 'go:project') return toStep({ ...s, lead: {} }, 'p_service')
    if (value === 'go:job') return startJobs(s, ctx)
    if (value === 'go:handoff') return handoff(s, ctx)
    if (value === 'go:chat') return { ...say(s, bot('Sure, what would you like to know?', { chips: CHAT_CHIPS(s) })), step: 'chat' }
    if (value.startsWith('ask:')) return answerQuestion({ ...s, step: 'chat' }, value.slice(4), ctx)
  }

  switch (s.step) {
    case 'purpose': {
      const p = value.startsWith('purpose:') ? value.slice(8) : matchOption(text, purposes.map((x) => ({ label: x.label, value: x.value })))?.value
      if (!p) return say(s, bot('Tap one of the options above so I can point you the right way.'))
      return toStep({ ...s, purpose: p }, 'name')
    }
    case 'name': {
      const err = validateName(text)
      if (err) return say(s, bot(err))
      return toStep({ ...s, contact: { ...s.contact, name: text.replace(/\s+/g, ' ').slice(0, 120) } }, 'email')
    }
    case 'email': {
      const err = validateEmail(text)
      if (err) return say(s, bot(err))
      return toStep({ ...s, contact: { ...s.contact, email: text.toLowerCase() } }, 'phone')
    }
    case 'phone': {
      if (input.kind !== 'phone') return say(s, bot('Please enter your mobile number in the box below, with your country code.', { input: 'phone' }))
      const err = validatePhone(input.phone, input.country)
      if (err) return say(s, bot(err, { input: 'phone' }))
      s = { ...s, contact: { ...s.contact, phone: input.phone, phoneCountry: input.country } }
      try {
        await ctx.contact(s)
        s = { ...s, sent: { ...s.sent, contact: true } }
      } catch {
        // Keep going; the transcript at the end still carries the details.
      }
      const thanks = bot(`Thanks, ${first(s.contact.name)}! You’re all set.`)
      if (s.purpose === 'project') return toStep(say(s, thanks), 'p_service')
      if (s.purpose === 'job') return startJobs(say(s, thanks), ctx)
      return { ...say(s, thanks, bot('What would you like to know about Gen Clover?', { chips: [chip('What do you build?', 'ask:What do you build?'), chip('See our work', 'ask:See our work'), chip('How do you work?', 'ask:How do you work?'), chip('Pricing', 'ask:How much does it cost?')] })), step: 'chat' }
    }

    /* ----- project */
    case 'p_service': {
      let v = value.startsWith('service:') ? value.slice(8) : null
      if (!v && text) {
        const doc = search(text)
        v = doc?.type === 'service' ? doc.slug : matchOption(text, serviceEnquiryOptions)?.value ?? serviceByTitle(text)?.slug
      }
      if (!v) return say(s, bot('Which of these is closest? If none fits, pick “Other”.', { chips: serviceEnquiryOptions.map((o) => chip(o.label, `service:${o.value}`)) }))
      return toStep({ ...s, lead: { ...s.lead, service: v } }, 'p_type')
    }
    case 'p_type': {
      const v = value.startsWith('type:') ? value.slice(5) : matchOption(text, businessTypeOptions)?.value
      if (!v) return say(s, ASK.p_type(s))
      return toStep({ ...s, lead: { ...s.lead, businessType: v } }, 'p_timeline')
    }
    case 'p_timeline': {
      const v = value.startsWith('timeline:') ? value.slice(9) : matchOption(text, timelineOptions)?.value ?? 'not-sure'
      return toStep({ ...s, lead: { ...s.lead, timeline: v } }, 'p_budget')
    }
    case 'p_budget': {
      const v = value.startsWith('budget:') ? value.slice(7) : text.slice(0, 60)
      return toStep({ ...s, lead: { ...s.lead, budget: v } }, 'p_details')
    }
    case 'p_details': {
      if (text.length < 10) return say(s, bot('Could you add a little more? Even one sentence helps the team reply with something useful.'))
      s = { ...s, lead: { ...s.lead, details: text.slice(0, 4000) } }
      const similar = projectsForService(s.lead.service, 2)
      try {
        const result = await ctx.lead(s)
        s = { ...s, sent: { ...s.sent, lead: true }, step: 'chat' }
        return say(
          s,
          bot(`Perfect, your brief is with the team 🎉 Someone will reply within one or two working days${result?.confirmation ? `, and a confirmation is on its way to ${s.contact.email}` : ''}.`),
          similar.length
            ? bot('While you wait, here’s similar work we’ve delivered:', { cards: similar.map(projectCard), chips: CHAT_CHIPS(s) })
            : bot('Anything else I can help with?', { chips: CHAT_CHIPS(s) })
        )
      } catch {
        return say(
          { ...s, step: 'chat' },
          bot(`Sorry, I couldn’t send that just now. I’ve kept everything, and the team will still see this conversation. You can also email ${company.email}.`, { chips: CHAT_CHIPS(s) })
        )
      }
    }

    /* ----- job */
    case 'j_role': {
      const v = value.startsWith('role:') ? value.slice(5) : matchOption(text, (s.openJobs ?? []).map((j) => ({ label: j.title, value: j.id })))?.value
      if (!v) return startJobs(s, ctx)
      const role = s.openJobs?.find((j) => j.id === v)
      return {
        ...say({ ...s, job: { jobId: v === 'general' ? 'general' : v, title: role?.title ?? 'General application', skills: {} } }, bot(`${role ? `Great choice: ${role.title}.` : 'A general application it is.'} How many years of experience do you have in total?`, { chips: EXP_CHIPS })),
        step: 'j_exp',
      }
    }
    case 'j_exp': {
      const v = value.startsWith('exp:') ? value.slice(4) : (() => { const n = parseInt(text, 10); return Number.isFinite(n) ? String(Math.min(Math.max(n, 0), 21)) : null })()
      if (v == null) return say(s, bot('Tap the closest option, or type a number of years.', { chips: EXP_CHIPS }))
      s = { ...s, job: { ...s.job, experienceYears: v } }
      const role = s.openJobs?.find((j) => j.id === s.job.jobId)
      const notes = []
      if (role && Number(v) < role.experienceMin) notes.push(bot(`This role asks for ${role.experienceMin}+ years, but I’ll still pass your profile on. Strong candidates are always considered.`))
      return { ...say(s, ...notes, bot('When could you start?', { chips: noticePeriodOptions.map((o) => chip(o.label, `notice:${o.value}`)) })), step: 'j_notice' }
    }
    case 'j_notice': {
      const v = value.startsWith('notice:') ? value.slice(7) : matchOption(text, noticePeriodOptions)?.value
      if (!v) return say(s, bot('Pick the closest option.', { chips: noticePeriodOptions.map((o) => chip(o.label, `notice:${o.value}`)) }))
      return { ...say({ ...s, job: { ...s.job, noticePeriod: v } }, bot('Which city are you based in?')), step: 'j_city' }
    }
    case 'j_city': {
      if (text.length < 2) return say(s, bot('Which city are you based in?'))
      return askSkillOrProfile({ ...s, job: { ...s.job, city: text.slice(0, 80) } })
    }
    case 'j_skill': {
      const level = value || matchOption(text, SKILL_LEVELS)?.value || text.slice(0, 40)
      return askSkillOrProfile({ ...s, job: { ...s.job, skills: { ...s.job.skills, [s.pendingSkill]: level } }, pendingSkill: null })
    }
    case 'j_link': {
      const link = value === 'skip' ? '' : text
      return {
        ...say({ ...s, job: { ...s.job, profileUrl: link } }, bot('Almost done. Please upload your CV (PDF or Word, up to 3 MB).', { input: 'file' })),
        step: 'j_cv',
      }
    }
    case 'j_cv': {
      if (input.kind !== 'file') return say(s, bot('Use the 📎 button below to attach your CV.', { input: 'file' }))
      s = { ...s, job: { ...s.job, cv: input.file } }
      return {
        ...say(s, bot('Shall I send your application to the hiring team?', {
          chips: [chip('Yes, send my application', 'confirm:yes'), chip('Not yet', 'confirm:no')],
          note: 'By sending it you agree to Gen Clover using these details and your CV for this and future roles, and keeping them on file until you ask for them to be deleted.',
        })),
        step: 'j_confirm',
      }
    }
    case 'j_confirm': {
      if (value !== 'confirm:yes') return { ...say(s, bot('No problem. Your details are saved in this chat if you change your mind.', { chips: [chip('Send my application', 'confirm:yes'), ...CHAT_CHIPS(s)] })), step: 'j_confirm' }
      try {
        const result = await ctx.apply(s)
        s = { ...s, sent: { ...s.sent, application: true }, step: 'chat', job: { ...s.job, cv: null } }
        return say(s, bot(`Application sent, ${first(s.contact.name)} 🎉 The team reads every one, together with your CV${result?.confirmation ? `, and a confirmation is on its way to ${s.contact.email}` : ''}. Good luck!`, { chips: CHAT_CHIPS(s) }))
      } catch (error) {
        return { ...say(s, bot(`${error.message || 'That didn’t go through.'} You can try again, or email your CV to ${company.email}.`, { chips: [chip('Try again', 'confirm:yes')] })), step: 'j_confirm' }
      }
    }

    /* ----- answers */
    default:
      if (!text) return say(s, bot('What would you like to know?', { chips: CHAT_CHIPS(s) }))
      return answerQuestion({ ...s, step: 'chat' }, text, ctx)
  }
}

/** The transcript lines for the team's email: what was said, plus card titles. */
export const transcriptOf = (s) =>
  s.messages.map((m) => ({
    from: m.from,
    text: [m.text, ...(m.cards ?? []).map((c) => `[${c.title}]`)].filter(Boolean).join('\n'),
  }))
