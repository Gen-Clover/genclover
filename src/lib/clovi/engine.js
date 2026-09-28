import { purposes, budgetRanges, budgetCurrencyFor, BOT_NAME } from './schema'
import { search, curatedById, projectsForService, projectCard, serviceByTitle } from './knowledge'
import {
  parseYesNo,
  parsePurpose,
  parseName,
  firstName,
  parseEmail,
  parsePhone,
  parseBusinessType,
  parseTimeline,
  parseBudget,
  parseDetails,
  parseExperience,
  parseNotice,
  parseCity,
  parseSkillLevel,
  SKILL_LEVELS,
  parseProfileLink,
  isSmallTalk,
  isRude,
  isRestart,
  isBack,
  editField,
  isRealQuestion,
} from './parse'
import { serviceEnquiryOptions } from '../../data/services'
import { businessTypeOptions, timelineOptions } from '../../data/leadOptions'
import { experienceYearOptions, noticePeriodOptions, cvProblem } from '../application'
import { formatExperience, locationText } from '../jobs'
import { routes, contact as company } from '../../data/site'

/**
 * Clovi's conversation: a small state machine that runs entirely in the
 * browser. `reply(state, input, ctx)` returns the next state; `ctx` supplies
 * the network (send contact / lead / application, list open roles), so this
 * file stays free of fetch calls. Every typed answer goes through a parser in
 * parse.js, which either returns a clean value or a message saying what to do.
 *
 * Flow: purpose → name → email → mobile (emailed to the team at once) →
 *   project: service → business type → timeline → budget → details → lead email
 *   job:     role → experience → notice → city → skills → profile → CV → confirm → application email
 *   question: straight to answers
 * then "chat": answers from the site's content, cards, and a hand-off to the team.
 * At any question: "back" goes to the previous one; "change my email/number/name" edits the contact.
 */

let seq = 0
const id = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`
const bot = (text, extra = {}) => ({ id: id(), from: 'bot', text, ...extra })
const user = (text) => ({ id: id(), from: 'user', text })
const chip = (label, value = label) => ({ label, value })
const first = (name) => firstName(name)

const CHAT_CHIPS = (s) =>
  [
    chip(s.sent.lead ? 'Another project' : 'Start a project', 'go:project'),
    chip('Open roles', 'go:job'),
    chip('See our work', 'ask:See our work'),
    !s.handoff && chip('Talk to a person', 'go:handoff'),
  ].filter(Boolean)

export const initialState = () => ({
  v: 2,
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
  editing: null,
  startedAt: Date.now(),
})

const say = (s, ...msgs) => ({ ...s, messages: [...s.messages, ...msgs] })

/** Match typed text to one of the offered options by label. */
const matchOption = (text, options) => {
  const t = String(text).trim().toLowerCase()
  if (!t) return null
  return (
    options.find((o) => o.label.toLowerCase() === t) ??
    options.find((o) => t.length >= 3 && o.label.toLowerCase().includes(t)) ??
    options.find((o) => t.includes(o.label.toLowerCase()))
  )
}

/* ------------------------------------------------------------- questions */

const EXP_CHIPS = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '15', '21'].map((v) => {
  const o = experienceYearOptions.find((x) => x.value === v)
  return chip(v === '0' ? 'Fresher' : v === '21' ? '20+ years' : o.label, `exp:${v}`)
})
const NOTICE_CHIPS = noticePeriodOptions.map((o) => chip(o.label, `notice:${o.value}`))
const SKILL_CHIPS = SKILL_LEVELS.map((l) => chip(l, `skill:${l}`))
const PURPOSE_CHIPS = purposes.map((p) => chip(p.label, `purpose:${p.value}`))

/** The question for each step, so any step can be asked again (after "back", an edit or an error). */
const ASK = {
  purpose: () => bot('What brings you here today?', { chips: PURPOSE_CHIPS }),
  name: (s) =>
    bot(
      s.purpose === 'job'
        ? 'Great, let’s find you a role. First, what’s your name?'
        : s.purpose === 'project'
          ? 'Brilliant, let’s talk about your project. First, what’s your name?'
          : 'Happy to help. First, what’s your name?',
      { note: 'By sharing your details you agree to our Privacy notice. We use them only to reply to you.' }
    ),
  email: (s) => bot(s.editing ? 'What’s the right email address?' : `Nice to meet you, ${first(s.contact.name)}! What’s your email address?`),
  phone: (s) => bot(s.editing ? 'What’s the right mobile number? Pick the country code first if it isn’t India.' : 'And your mobile number? The team may call or WhatsApp you about this.', { input: 'phone' }),
  p_service: () => bot('What do you need? Pick the closest fit, or just describe it.', { chips: serviceEnquiryOptions.map((o) => chip(o.label, `service:${o.value}`)) }),
  p_type: () => bot('What kind of business is it for?', { chips: businessTypeOptions.map((o) => chip(o.label, `type:${o.value}`)) }),
  p_timeline: () => bot('When would you like to get started?', { chips: timelineOptions.map((o) => chip(o.label, `timeline:${o.value}`)) }),
  p_budget: (s) =>
    bot('Roughly what budget do you have in mind? A range is fine, and “not sure” is completely okay.', {
      chips: [...budgetRanges[budgetCurrencyFor(s.contact.phoneCountry)].map((r) => chip(r, `budget:${r}`)), chip('Not sure yet', 'budget:')],
    }),
  p_details: () => bot('Last one: in a sentence or two, what are you trying to build or fix?'),
  j_exp: () => bot('How many years of experience do you have in total?', { chips: EXP_CHIPS }),
  j_notice: () => bot('When could you start?', { chips: NOTICE_CHIPS }),
  j_city: () => bot('Which city are you based in?'),
  j_skill: (s) => bot(`How would you rate yourself in ${s.pendingSkill}?`, { chips: SKILL_CHIPS }),
  j_link: () => bot('Do you have a LinkedIn or portfolio link? Paste it here, or skip.', { chips: [chip('Skip', 'skip')] }),
  j_cv: () =>
    bot('Almost done. Please upload your CV (PDF or Word, up to 3 MB) with the 📎 button.', {
      input: 'file',
      chips: [chip('I don’t have my CV handy', 'nocv')],
    }),
}

const askAgain = (s, step, lead) => ({ ...say(s, ...(lead ? [bot(lead)] : []), ASK[step](s)), step })
const retry = (s, message, step = s.step) => say(s, bot(message, { chips: ASK[step]?.(s)?.chips, input: ASK[step]?.(s)?.input }))

/** The previous question for "back". */
const PREV = {
  email: 'name', phone: 'email',
  p_type: 'p_service', p_timeline: 'p_type', p_budget: 'p_timeline', p_details: 'p_budget',
  j_notice: 'j_exp', j_city: 'j_notice', j_link: 'j_city', j_cv: 'j_link', j_confirm: 'j_cv',
}

/* -------------------------------------------------------------- job flow */

const roleCard = (j) => ({
  kind: 'role',
  title: j.title,
  meta: `${locationText(j)} · ${formatExperience(j)}`,
  text: j.summary,
  to: `${routes.careers}/${j.id}`,
})

const startJobs = async (s, ctx) => {
  let jobs
  try {
    jobs = (await ctx.jobs()).filter((j) => j.status === 'open')
  } catch {
    return say(
      { ...s, step: 'chat' },
      bot('I couldn’t load the open roles just now. You can see them on the careers page, or send a general application here.', {
        links: [{ label: 'Careers', to: routes.careers }],
        chips: [chip('Send a general application', 'role:general'), ...CHAT_CHIPS(s)],
      })
    )
  }
  const next = {
    ...s,
    step: 'j_role',
    job: {},
    openJobs: jobs.map((j) => ({ id: j.id, title: j.title, skills: j.skills ?? [], experienceMin: j.experienceMin ?? 0 })),
  }
  if (jobs.length === 0) {
    return say(next, bot('There are no open roles right now, but we read every general application and keep good ones on file.', {
      chips: [chip('Send a general application', 'role:general'), chip('Ask a question', 'go:chat')],
    }))
  }
  return say(next, bot(jobs.length === 1 ? 'We’re hiring for this role right now:' : `We’re hiring for ${jobs.length} roles right now:`, {
    cards: jobs.map(roleCard),
    chips: [...jobs.map((j) => chip(`Apply: ${j.title}`, `role:${j.id}`)), chip('General application', 'role:general')],
  }))
}

const nextSkill = (s) => {
  const role = s.openJobs?.find((j) => j.id === s.job.jobId)
  return (role?.skills ?? []).slice(0, 3).find((k) => !(k in (s.job.skills ?? {}))) ?? null
}

const askSkillOrLink = (s) => {
  const skill = nextSkill(s)
  if (skill) return askAgain({ ...s, pendingSkill: skill }, 'j_skill')
  return askAgain(s, 'j_link')
}

/** The last question before an application is sent. */
const askConfirm = (s) => ({
  ...say(
    { ...s, fixing: false },
    bot(`Here’s what I’ll send: ${s.job.title}, ${experienceYearOptions.find((o) => o.value === s.job.experienceYears)?.label ?? ''} experience, based in ${s.job.city}, with your CV (${s.job.cv?.name}). Shall I send your application to the hiring team?`, {
      chips: [chip('Yes, send my application', 'confirm:yes'), chip('Not yet', 'confirm:no')],
      note: 'By sending it you agree to Gen Clover using these details and your CV for this and future roles, and keeping them on file until you ask for them to be deleted.',
    })
  ),
  step: 'j_confirm',
})

/** After a correction, go straight back to sending instead of re-asking everything. */
const continueJob = (s, next) => (s.fixing && s.job.cv ? askConfirm(s) : next(s))

/** Which question to go back to when the server rejects an application field. */
const FIELD_STEP = { profileUrl: 'j_link', city: 'j_city', experienceYears: 'j_exp', noticePeriod: 'j_notice', cv: 'j_cv' }

/* --------------------------------------------------------------- answers */

/** Suggested questions go straight to their answer rather than through search. */
const CHIP_ANSWERS = {
  'see our work': 'work',
  'what do you build?': 'services',
  'how do you work?': 'process',
  'how much does it cost?': 'pricing',
  pricing: 'pricing',
  'contact the team': 'contact',
  'ways to start': 'start',
  'support after launch': 'support',
  'discover stage': 'step:Discover',
}

const answerFrom = (doc, s) => {
  const chips = (doc.chips ?? []).map((c) =>
    /start a project/i.test(c) ? chip(c, 'go:project') : /talk to a person/i.test(c) ? chip(c, 'go:handoff') : chip(c, `ask:${c}`)
  )
  return bot(doc.answer, { cards: doc.cards, links: doc.links, chips: chips.length ? chips : CHAT_CHIPS(s) })
}

const INTENTS = [
  [/^(hi|hello|hey|hii+|namaste|good (morning|afternoon|evening))\b/i, 'greet'],
  [/\b(thanks|thank you|thx|awesome|perfect)\b/i, 'thanks'],
  [/\b(bye|goodbye|see you|that'?s all)\b/i, 'bye'],
  [/\b(human|person|someone|real person|agent|representative|call me|callback|speak to)\b/i, 'handoff'],
  [/\bwho are you\b|\bare you (a )?(bot|human|ai|real)\b|\byour name\b/i, 'clovi'],
  [/\b(services?|what do you (do|build|offer)|what can you (do|build))\b/i, 'services'],
  [/\b(start|begin|new|another) (a )?(new )?project\b|\bhire you\b|\bwork with you\b|\bget a quote\b/i, 'project'],
  [/\b(jobs?|careers?|hiring|vacanc|openings?|apply|internship)\b/i, 'jobs'],
]

const handoff = async (s, ctx) => {
  const next = say(
    { ...s, handoff: true, step: 'chat' },
    bot(`Done. I’ve asked the team to get in touch with you at ${s.contact.email}${s.contact.phone ? ' or on your mobile' : ''}, usually within one working day. You can also email ${company.email} directly.`, {
      chips: CHAT_CHIPS({ ...s, handoff: true }),
    })
  )
  await ctx.transcript(next).catch(() => {})
  return { ...next, sent: { ...next.sent, transcriptAt: next.messages.length } }
}

const answerQuestion = async (s, text, ctx) => {
  s = { ...s, step: 'chat' }
  const direct = CHIP_ANSWERS[text.trim().toLowerCase()]
  if (direct) return say(s, answerFrom(curatedById(direct), s))

  if (isRude(text)) return say(s, bot('Sorry I haven’t been more helpful. Would you like someone from the team to get in touch instead?', { chips: CHAT_CHIPS(s) }))
  if (isSmallTalk(text)) return say(s, bot('What would you like to know? You can ask me anything about Gen Clover, or tap an option.', { chips: CHAT_CHIPS(s) }))
  if (/^(tell me more|more|go on|explain|details|and\??)$/i.test(text.trim()))
    return say(s, bot('Happy to. Which part? You can ask about our services, a case study, how we work, pricing, or open roles.', { chips: CHAT_CHIPS(s) }))

  const intent = INTENTS.find(([re]) => re.test(text))?.[1]
  if (intent === 'greet') return say(s, bot(`Hi ${first(s.contact.name) || 'there'}! What would you like to know?`, { chips: CHAT_CHIPS(s) }))
  if (intent === 'thanks') return say(s, bot('Happy to help! Anything else?', { chips: CHAT_CHIPS(s) }))
  if (intent === 'bye') return say(s, bot(`Thanks for stopping by${s.contact.name ? `, ${first(s.contact.name)}` : ''}. The team has your details and will be in touch. 🍀`))
  if (intent === 'handoff') return handoff(s, ctx)
  if (intent === 'project') {
    if (s.sent.lead)
      return say(s, bot('Your first brief is already with the team. Shall we start a new one for a different project?', {
        chips: [chip('Yes, a new project', 'go:project'), chip('No, thanks', 'go:chat')],
      }))
    return askAgain({ ...s, purpose: s.purpose ?? 'project', lead: {} }, 'p_service')
  }
  if (intent === 'jobs') return startJobs(s, ctx)
  if (intent === 'clovi' || intent === 'services') return say(s, answerFrom(curatedById(intent), s))

  const doc = search(text)
  if (doc?.id === 'jobs') return startJobs(s, ctx)
  if (doc) return say(s, answerFrom(doc, s))

  // Only real questions go to the team, not typos or one-word replies.
  if (!isRealQuestion(text))
    return say(s, bot('Sorry, I didn’t quite get that. Could you ask it another way, or tap an option?', { chips: CHAT_CHIPS(s) }))
  return say(
    { ...s, unanswered: [...s.unanswered, text].slice(-20) },
    bot(`I don’t have a confident answer to that, so I’ve noted it for the team. They’ll reply to ${s.contact.email || 'you'} by email. Meanwhile, is there something else I can help with?`, { chips: CHAT_CHIPS(s) })
  )
}

/* --------------------------------------------------------- contact steps */

/** After the contact is complete (or corrected), continue where the visitor was. */
const afterContact = async (s, ctx) => {
  const updating = s.editing
  try {
    await ctx.contact(s, { updated: Boolean(updating) })
    s = { ...s, sent: { ...s.sent, contact: true } }
  } catch {
    // Keep going; the transcript at the end still carries the details.
  }
  if (updating) {
    const resume = updating.resume
    s = { ...s, editing: null }
    const done = bot(`Updated ✓ The team has your new ${updating.field === 'phone' ? 'number' : updating.field}.`)
    if (resume && ASK[resume] && resume !== 'chat') return { ...say(s, done, ASK[resume](s)), step: resume }
    return { ...say(s, done, bot('Anything else?', { chips: CHAT_CHIPS(s) })), step: 'chat' }
  }
  const thanks = bot(`Thanks, ${first(s.contact.name)}! You’re all set.`)
  if (s.purpose === 'project') return askAgain(say(s, thanks), 'p_service')
  if (s.purpose === 'job') return startJobs(say(s, thanks), ctx)
  return {
    ...say(s, thanks, bot('What would you like to know about Gen Clover?', {
      chips: [chip('What do you build?', 'ask:What do you build?'), chip('See our work', 'ask:See our work'), chip('How do you work?', 'ask:How do you work?'), chip('Pricing', 'ask:How much does it cost?')],
    })),
    step: 'chat',
  }
}

/* ----------------------------------------------------------------- reply */

/**
 * input: { kind: 'text', text } | { kind: 'chip', value, label } |
 *        { kind: 'phone', phone, country } | { kind: 'file', file }
 */
export const reply = async (state, input, ctx) => {
  let s = state
  const echo = input.kind === 'chip' ? input.label : input.kind === 'phone' ? input.phone : input.kind === 'file' ? `📎 ${input.file?.name}` : input.text
  if (echo) s = say(s, user(echo))
  const value = input.kind === 'chip' ? input.value : ''
  const text = input.kind === 'text' ? String(input.text ?? '').trim().slice(0, 1000) : ''
  const contactDone = !['purpose', 'name', 'email', 'email_fix', 'phone'].includes(s.step) || s.editing

  /* ----- works at any question */
  if (text && isRestart(text)) return say(s, bot('To start over, tap ↻ at the top of this chat. Or just carry on from here.'))
  if (text && isBack(text) && PREV[s.step] && !s.editing) return askAgain(s, PREV[s.step], 'Sure, let’s go back.')
  if (text && contactDone && !s.editing) {
    const field = editField(text)
    if (field) return askAgain({ ...s, editing: { field, resume: s.step } }, field, 'No problem, let’s fix that.')
  }

  // Chips that work from anywhere once the visitor has shared their details.
  if (contactDone && !s.editing) {
    if (value === 'go:project') return askAgain({ ...s, lead: {}, purpose: s.purpose ?? 'project' }, 'p_service')
    if (value === 'go:job') return startJobs(s, ctx)
    if (value === 'go:handoff') return handoff(s, ctx)
    if (value === 'go:chat') return { ...say(s, bot('Sure, what would you like to know?', { chips: CHAT_CHIPS(s) })), step: 'chat' }
    if (value.startsWith('ask:')) return answerQuestion(s, value.slice(4), ctx)
  }

  switch (s.step) {
    case 'purpose': {
      const p = value.startsWith('purpose:') ? value.slice(8) : parsePurpose(text)
      if (p) return askAgain({ ...s, purpose: p }, 'name')
      if (/^(hi|hello|hey|hii+|namaste)\b/i.test(text)) return retry(s, 'Hello! 👋 Are you here to start a project, explore jobs, or ask a question?')
      return retry(s, 'I can help with a project, a job, or a question. Which one? Tap an option below.')
    }

    case 'name': {
      const r = parseName(text)
      if (r.error) return retry(s, r.error)
      s = { ...s, contact: { ...s.contact, name: r.value } }
      return s.editing ? afterContact(s, ctx) : askAgain(s, 'email')
    }

    case 'email': {
      const r = parseEmail(text)
      if (r.error) return retry(s, r.error)
      if (r.suggestion)
        return {
          ...say({ ...s, pendingEmail: r.value, suggestedEmail: r.suggestion }, bot(`Did you mean ${r.suggestion}?`, {
            chips: [chip(`Yes, ${r.suggestion}`, 'email:suggested'), chip(`No, use ${r.value}`, 'email:typed')],
          })),
          step: 'email_fix',
        }
      s = { ...s, contact: { ...s.contact, email: r.value } }
      return s.editing ? afterContact(s, ctx) : askAgain(s, 'phone')
    }

    case 'email_fix': {
      const yes = value === 'email:suggested' || (text && parseYesNo(text) === true)
      const no = value === 'email:typed' || (text && parseYesNo(text) === false)
      if (!yes && !no) {
        const r = text ? parseEmail(text) : null
        if (r?.value && !r.suggestion) {
          s = { ...s, contact: { ...s.contact, email: r.value } }
          return s.editing ? afterContact(s, ctx) : askAgain(s, 'phone')
        }
        return say(s, bot(`Is ${s.suggestedEmail} right?`, { chips: [chip(`Yes, ${s.suggestedEmail}`, 'email:suggested'), chip(`No, use ${s.pendingEmail}`, 'email:typed')] }))
      }
      s = { ...s, contact: { ...s.contact, email: yes ? s.suggestedEmail : s.pendingEmail }, pendingEmail: null, suggestedEmail: null }
      return s.editing ? afterContact({ ...s, step: 'email' }, ctx) : askAgain(s, 'phone')
    }

    case 'phone': {
      if (input.kind !== 'phone') {
        // Typed into the message box by mistake: try it as a number anyway.
        if (text && /\d{6,}/.test(text.replace(/\D/g, ''))) input = { kind: 'phone', phone: text, country: s.contact.phoneCountry || 'IN' }
        else return retry(s, 'Please enter your mobile number in the box below, with your country code.')
      }
      const r = parsePhone(input.phone, input.country)
      if (r.error) return retry(s, r.error)
      s = { ...s, contact: { ...s.contact, phone: r.value, phoneCountry: r.country } }
      return afterContact(s, ctx)
    }

    /* ----- project */
    case 'p_service': {
      let v = value.startsWith('service:') ? value.slice(8) : null
      if (!v && text) {
        if (/\b(not sure|don'?t know|dont know|no idea|idk|unsure|other|something else)\b/i.test(text)) v = 'other'
        else if (/\b(mobile|ios|android|iphone)\b/i.test(text)) v = 'other'
        else {
          const doc = search(text)
          v = doc?.type === 'service' ? doc.slug : matchOption(text, serviceEnquiryOptions)?.value ?? serviceByTitle(text)?.slug
        }
      }
      if (!v) return retry(s, 'I’m not sure which that is. Pick the closest option below, or “Other” if none fits.')
      const note = /\b(mobile|ios|android|iphone)\b/i.test(text) ? [bot('Native mobile apps aren’t one of our listed services, but I’ll note it and the team will advise.')] : []
      return askAgain(say({ ...s, lead: { ...s.lead, service: v } }, ...note), 'p_type')
    }
    case 'p_type': {
      const v = value.startsWith('type:') ? value.slice(5) : matchOption(text, businessTypeOptions)?.value ?? parseBusinessType(text)
      if (!v) return retry(s, 'Which is closest? Pick one below, or “Other”.')
      return askAgain({ ...s, lead: { ...s.lead, businessType: v } }, 'p_timeline')
    }
    case 'p_timeline': {
      const v = value.startsWith('timeline:') ? value.slice(9) : parseTimeline(text) ?? matchOption(text, timelineOptions)?.value
      if (!v) return retry(s, 'Roughly when? Tap an option, or say something like “next month”. “Not sure” is fine too.')
      return askAgain({ ...s, lead: { ...s.lead, timeline: v } }, 'p_budget')
    }
    case 'p_budget': {
      let v
      if (value.startsWith('budget:')) v = value.slice(7)
      else {
        const r = parseBudget(text)
        if (r.error) return retry(s, r.error)
        v = r.value
      }
      return askAgain({ ...s, lead: { ...s.lead, budget: v } }, 'p_details')
    }
    case 'p_details': {
      const r = value === 'retry:lead' && s.lead.details ? { value: s.lead.details } : parseDetails(text)
      if (r.error) return retry(s, r.error)
      s = { ...s, lead: { ...s.lead, details: r.value } }
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
      } catch (error) {
        const field = Object.keys(error.errors ?? {})[0]
        const step = { service: 'p_service', businessType: 'p_type', timeline: 'p_timeline', details: 'p_details' }[field]
        if (step) return askAgain(s, step, `${error.errors[field]} Let’s fix that one.`)
        return say({ ...s, step: 'p_details' }, bot(`Sorry, I couldn’t send that just now. Please try again in a moment, or email ${company.email}.`, { chips: [chip('Try again', 'retry:lead')] }))
      }
    }

    /* ----- job */
    case 'j_role': {
      let v = value.startsWith('role:') ? value.slice(5) : null
      if (!v && text) {
        if (/\bgeneral\b|\bany\b|\bother\b/i.test(text)) v = 'general'
        else v = matchOption(text, (s.openJobs ?? []).map((j) => ({ label: j.title, value: j.id })))?.value
        if (!v) {
          const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
          v = s.openJobs?.find((j) => words.some((w) => j.title.toLowerCase().includes(w)))?.id
        }
      }
      if (!v)
        return say(s, bot('That role isn’t open right now. You can apply for an open role, or send a general application and we’ll keep it on file.', {
          chips: [...(s.openJobs ?? []).map((j) => chip(`Apply: ${j.title}`, `role:${j.id}`)), chip('General application', 'role:general')],
        }))
      const role = s.openJobs?.find((j) => j.id === v)
      if (s.sent.application && s.job?.appliedFor === v)
        return say(s, bot('You’ve already applied for this one; the team has it. Anything else?', { chips: CHAT_CHIPS(s) }))
      return askAgain(
        { ...s, job: { jobId: role ? v : 'general', title: role?.title ?? 'General application', skills: {} } },
        'j_exp',
        role ? `Great choice: ${role.title}.` : 'A general application it is.'
      )
    }
    case 'j_exp': {
      let v
      if (value.startsWith('exp:')) v = value.slice(4)
      else {
        const r = parseExperience(text)
        if (r.error) return retry(s, r.error)
        v = r.value
      }
      s = { ...s, job: { ...s.job, experienceYears: v } }
      if (s.fixing && s.job.cv) return askConfirm(s)
      const role = s.openJobs?.find((j) => j.id === s.job.jobId)
      const notes = role && Number(v) < role.experienceMin ? [bot(`This role asks for ${role.experienceMin}+ years, but I’ll still pass your profile on. Strong candidates are always considered.`)] : []
      return askAgain(say(s, ...notes), 'j_notice')
    }
    case 'j_notice': {
      const v = value.startsWith('notice:') ? value.slice(7) : matchOption(text, noticePeriodOptions)?.value ?? parseNotice(text)
      if (!v) return retry(s, 'Roughly when could you start? Tap an option, or say something like “1 month”.')
      s = { ...s, job: { ...s.job, noticePeriod: v } }
      return continueJob(s, (x) => askAgain(x, 'j_city'))
    }
    case 'j_city': {
      const r = parseCity(text)
      if (r.error) return retry(s, r.error)
      return continueJob({ ...s, job: { ...s.job, city: r.value } }, askSkillOrLink)
    }
    case 'j_skill': {
      const level = value.startsWith('skill:') ? value.slice(6) : parseSkillLevel(text)
      if (!level) return retry(s, `How would you rate yourself in ${s.pendingSkill}? Expert, comfortable, or still learning?`)
      return askSkillOrLink({ ...s, job: { ...s.job, skills: { ...s.job.skills, [s.pendingSkill]: level } }, pendingSkill: null })
    }
    case 'j_link': {
      const r = value === 'skip' ? { value: '' } : parseProfileLink(text)
      if (r.error) return retry(s, r.error)
      s = { ...s, job: { ...s.job, profileUrl: r.value } }
      if (s.fixing && s.job.cv) return askConfirm(s)
      return askAgain(s, 'j_cv')
    }
    case 'j_cv': {
      if (value === 'nocv' || (text && /\b(no|don'?t|dont|not|later|haven'?t)\b.*\b(cv|resume)\b|\b(cv|resume)\b.*\b(later|not ready)\b/i.test(text))) {
        return say(s, bot('A CV helps the team a lot. You can attach it now, or I can pass your details to the hiring team and you email the CV to them later.', {
          chips: [chip('Send my details without a CV', 'cv:skip'), chip('I’ll attach it now', 'cv:attach')],
          input: 'file',
        }))
      }
      if (value === 'cv:attach') return say(s, bot('Use the 📎 button below to attach it.', { input: 'file' }))
      if (value === 'cv:skip') {
        const next = say(
          { ...s, step: 'chat', handoff: true, jobHandoff: true },
          bot(`Done. I’ve sent your details to the hiring team. Please email your CV to ${company.email} with “${s.job.title}” in the subject, and they’ll take it from there.`, { chips: CHAT_CHIPS({ ...s, handoff: true }) })
        )
        await ctx.transcript(next).catch(() => {})
        return { ...next, sent: { ...next.sent, transcriptAt: next.messages.length } }
      }
      if (input.kind !== 'file') return retry(s, 'Use the 📎 button below to attach your CV, or tap “I don’t have my CV handy”.')
      const problem = cvProblem(input.file)
      if (problem) return retry(s, problem)
      return askConfirm({ ...s, job: { ...s.job, cv: input.file } })
    }
    case 'j_confirm': {
      const yes = value === 'confirm:yes' || (text && parseYesNo(text) === true)
      if (!yes) {
        if (value === 'confirm:no' || (text && parseYesNo(text) === false))
          return say(s, bot('No problem. Your answers are saved in this chat. Send it whenever you’re ready, or type “back” to change something.', {
            chips: [chip('Send my application', 'confirm:yes'), ...CHAT_CHIPS(s)],
          }))
        return say(s, bot('Shall I send it? Tap “Yes, send my application”, or type “back” to change an answer.', {
          chips: [chip('Yes, send my application', 'confirm:yes'), chip('Not yet', 'confirm:no')],
        }))
      }
      if (!s.job.cv) return askAgain({ ...s, fixing: true }, 'j_cv', 'I need your CV again (the page reloaded).')
      try {
        const result = await ctx.apply(s)
        s = { ...s, sent: { ...s.sent, application: true }, step: 'chat', job: { ...s.job, cv: null, appliedFor: s.job.jobId } }
        return say(s, bot(`Application sent, ${first(s.contact.name)} 🎉 The team reads every one, together with your CV${result?.confirmation ? `, and a confirmation is on its way to ${s.contact.email}` : ''}. Good luck!`, { chips: CHAT_CHIPS(s) }))
      } catch (error) {
        const field = Object.keys(error.errors ?? {}).find((k) => FIELD_STEP[k])
        if (field) return askAgain({ ...s, fixing: true, job: field === 'cv' ? { ...s.job, cv: null } : s.job }, FIELD_STEP[field], `${error.errors[field]} Let’s fix that one.`)
        const contactField = ['name', 'email', 'phone'].find((k) => error.errors?.[k])
        if (contactField) return askAgain({ ...s, editing: { field: contactField, resume: 'j_confirm' } }, contactField, `${error.errors[contactField]} Let’s fix that one.`)
        return say(s, bot(`${error.message || 'That didn’t go through.'} You can try again, or email your CV to ${company.email}.`, { chips: [chip('Try again', 'confirm:yes')] }))
      }
    }

    /* ----- answers */
    default:
      if (!text) return say(s, bot('What would you like to know?', { chips: CHAT_CHIPS(s) }))
      return answerQuestion(s, text, ctx)
  }
}

/** The transcript lines for the team's email: what was said, plus card titles. */
export const transcriptOf = (s) =>
  s.messages.map((m) => ({
    from: m.from,
    text: [m.text, ...(m.cards ?? []).map((c) => `[${c.title}]`)].filter(Boolean).join('\n'),
  }))
