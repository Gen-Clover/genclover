// Rule-based triage: what kind of enquiry it is, how urgent, and a draft reply.
// shortcut: keyword rules, not a language model; swap for an LLM classifier in a real build.

const TYPES = [
  ['spam', 'Spam', ['seo', 'backlink', 'guest post', 'crypto', 'lottery', 'click here', 'rank #1', 'guaranteed']],
  ['support', 'Problem', ['broken', 'crack', 'leak', 'damag', 'not working', 'issue', 'problem', 'complain', 'refund', 'wrong', 'defect']],
  ['billing', 'Billing', ['invoice', 'payment', 'paid', 'receipt', 'gst', 'bill', 'instalment', 'bank details']],
  ['quote', 'New project', ['quote', 'estimate', 'cost', 'budget', 'redesign', 'renovat', 'makeover', 'kitchen', 'living room', 'bedroom', 'home office']],
  ['partner', 'Partnership', ['partner', 'collaborat', 'supplier', 'showroom', 'wholesale', 'catalogue', 'trade']],
  ['job', 'Job seeker', ['job', 'intern', 'hiring', 'vacanc', 'portfolio', 'resume', 'cv', 'apply']],
]

const URGENCY = [
  ['urgent', 3], ['asap', 3], ['immediately', 3], ['emergency', 3], ['today', 3], ['leak', 2],
  ['failed', 2], ['tomorrow', 2], ['by friday', 2], ['this week', 2], ['next week', 1], ['move in', 2],
  ['lakh', 2], ['deadline', 2], ['no rush', -2], ['just exploring', -1],
]
const BASE = { support: 2, quote: 1, billing: 1 }

export const LANES = [
  ['now', 'Reply now'],
  ['today', 'Today'],
  ['week', 'This week'],
  ['filtered', 'Filtered'],
]

// matches at a word start, so "cv" doesn't fire inside other words
const pattern = (word) => new RegExp(`(^|[^a-z])(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i')
const has = (text, word) => pattern(word).test(text)

export function triage(text) {
  let type = ['general', 'General', []]
  for (const [id, label, words] of TYPES) {
    const hits = words.filter((w) => has(text, w))
    if (hits.length > type[2].length) type = [id, label, hits]
  }
  const [id, label, hits] = type
  const urgent = URGENCY.filter(([w]) => has(text, w))
  const base = BASE[id] ?? 0
  const score = Math.max(0, base + urgent.reduce((s, [, p]) => s + p, 0))
  const lane = id === 'spam' ? 'filtered' : score >= 5 ? 'now' : score >= 3 ? 'today' : 'week'
  return {
    type: id,
    typeLabel: label,
    score,
    lane,
    words: [...new Set([...hits, ...urgent.map(([w]) => w)])],
    reasons: [...(base ? [[label, base]] : []), ...urgent],
  }
}

// wraps each signal (to the end of its word) in <mark>; `html` must already be escaped
export const highlight = (html, words) => words.reduce((h, w) => h.replace(new RegExp(`${pattern(w).source}([a-z]*)`, 'gi'), '$1<mark>$2$3</mark>'), html)

const BODY = {
  quote: "Thanks for getting in touch about your project, we'd love to help. Could you send a few photos and the rough size of the space? Our designer can visit this week, and you'll have a quote within 48 hours of the visit.",
  support: "I'm sorry about this, it shouldn't have happened. I've flagged it to our site team as a priority, and someone will call you within 2 hours to book a visit. Any photos you can send will help us bring the right parts.",
  billing: "Thanks for flagging this. I've passed it to our accounts team, and they'll reply today with everything you need.",
  partner: 'Thanks for thinking of us. Could you send your catalogue and trade terms? Our design lead will review them and get back to you next week.',
  job: "Thanks for your interest in joining us. I've passed your portfolio to our design lead, and we'll be in touch if there's a fit for the next intake.",
  general: 'Thanks for your message. One of our team will get back to you shortly.',
}

export function draft(name, type, tone = 'friendly') {
  if (type === 'spam') return ''
  const first = name.trim().split(/\s+/)[0] || 'there'
  const [hello, bye] = tone === 'formal' ? [`Dear ${first},`, 'Kind regards,'] : [`Hi ${first},`, 'Cheers,']
  return `${hello}\n\n${BODY[type]}\n\n${bye}\nOkra Interiors`
}
