import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js/min'

/**
 * How Clovi reads what people type. One parser per question, each returning
 * either a clean value or `{ error }` with a message that says what to do.
 * They understand the everyday ways of answering ("next month", "five years",
 * "2 weeks", "my email is ...") and never silently guess: an answer that means
 * nothing gets a friendly re-ask instead of being stored.
 *
 * Pure functions, shared with the API (Node) where it matters, and exercised
 * by scripts/clovi-qa.mjs.
 */

const norm = (text) => String(text ?? '').trim().replace(/\s+/g, ' ')
const lower = (text) => norm(text).toLowerCase()
const has = (text, re) => re.test(lower(text))

/* ---------------------------------------------------------------- words */

const LATIN = /[a-z]/i
const LETTER = /\p{L}/u
const KEYBOARD_MASH = /(asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwer|wert|erty|rtyu|tyui|yuio|uiop|zxcv|xcvb|cvbn|vbnm|jkl;|lkj)/i

/**
 * Whether text reads like words rather than keyboard mashing. Non-Latin
 * scripts (Hindi and others) are accepted as written.
 */
export const looksLikeWords = (text, { minWords = 1 } = {}) => {
  const t = norm(text)
  const words = t.split(' ').filter((w) => LETTER.test(w))
  if (words.length < minWords) return false
  const latin = t.replace(/[^a-z]/gi, '')
  if (!latin) return words.length >= minWords // non-Latin script
  if (KEYBOARD_MASH.test(latin)) return false
  if (/(.)\1{3,}/i.test(latin)) return false // aaaa, xxxx
  const vowels = (latin.match(/[aeiou]/gi) ?? []).length
  const ratio = vowels / latin.length
  return ratio >= 0.2 && ratio <= 0.75
}

/* ------------------------------------------------------------------ yes/no */

export const parseYesNo = (text) => {
  const t = lower(text).replace(/[!.]+$/, '')
  if (/^(y|yes|yeah|yep|yup|sure|ok|okay|okey|k|go|go ahead|do it|send|send it|please|yes please|confirm|correct|right|haan|ha|han)\b/.test(t)) return true
  if (/^(n|no|nope|nah|not yet|not now|wait|later|cancel|stop|don'?t|do not|nahi|na)\b/.test(t)) return false
  return null
}

/* ------------------------------------------------------------------ purpose */

export const parsePurpose = (text) => {
  const t = lower(text)
  if (/\b(job|jobs|career|careers|hiring|hire me|vacanc|opening|apply|applying|intern|internship|resume|cv|work for you|join)\b/.test(t)) return 'job'
  if (/\b(project|website|site|app|application|build|develop|quote|estimate|shop|store|ecommerce|e-commerce|ai|automation|dashboard|seo|software|need (a|an|help)|looking for)\b/.test(t)) return 'project'
  if (/\b(question|ask|query|know|info|information|learn|curious|about you|help)\b/.test(t) || /\?$/.test(t)) return 'question'
  return null
}

/* --------------------------------------------------------------------- name */

const NOT_NAMES = new Set(
  'hi hello hey hii yo hola namaste yes no ok okay sure test testing name my none na nothing anonymous user admin asdf abc xyz help start project job question'.split(' ')
)
const TITLES = /^(mr|mrs|ms|miss|dr|prof|sir|shri|smt)\.?$/i

/** "my name is rahul verma" → "Rahul Verma". */
export const parseName = (text) => {
  let t = norm(text)
    .replace(/^(hi|hello|hey)[,!.\s]+/i, '')
    .replace(/^(my name is|my name's|name is|name:|i am|i'm|im|this is|it's|its|call me)\s+/i, '')
    .replace(/[.!]+$/, '')
    .trim()
  if (!t || t.length < 2) return { error: 'Please tell me your name.' }
  if (t.includes('@')) return { error: 'That looks like an email address. What’s your name? I’ll ask for your email next.' }
  if (/\d/.test(t)) return { error: 'Names don’t usually have numbers in them. What should I call you?' }
  if (/https?:|www\./i.test(t)) return { error: 'What’s your name? (Just your name for now.)' }
  if (!LETTER.test(t)) return { error: 'Please type your name using letters.' }
  if (t.length > 60 || t.split(' ').length > 5) return { error: 'That’s a bit long for a name. Just your first and last name is perfect.' }
  if (NOT_NAMES.has(t.toLowerCase())) return { error: 'Nice to hear from you! What’s your name?' }
  if (/[^\p{L}\p{M}\s.'’-]/u.test(t)) return { error: 'Please use just letters for your name.' }
  if (LATIN.test(t) && !looksLikeWords(t)) return { error: 'Sorry, I didn’t catch that. What’s your name?' }
  // Tidy the case of all-lower or ALL-UPPER names; leave mixed case alone (McDonald, deSouza).
  if (t === t.toLowerCase() || t === t.toUpperCase()) t = t.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (m, p, c) => p + c.toUpperCase())
  return { value: t }
}

/** First name for greetings, skipping titles like "Dr." */
export const firstName = (name) => norm(name).split(' ').find((w) => !TITLES.test(w)) ?? norm(name).split(' ')[0] ?? ''

/* -------------------------------------------------------------------- email */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
const DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com', 'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.in': 'gmail.com',
  'yahoo.co': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.co': 'outlook.com', 'rediffmail.co': 'rediffmail.com',
}

/** Finds an email in a sentence ("my email is x@y.com", "x at y dot com"). */
export const parseEmail = (text) => {
  let t = lower(text)
    .replace(/^mailto:/, '')
    .replace(/\s+(at|\[at\]|\(at\))\s+/g, '@')
    .replace(/\s+(dot|\[dot\]|\(dot\))\s+/g, '.')
  const found = t.match(/[^\s@,;<>()]+@[^\s@,;<>()]+/)
  if (!found) {
    if (/\d{7,}/.test(t.replace(/[\s()+-]/g, ''))) return { error: 'That looks like a phone number. I’ll ask for that next. What’s your email address?' }
    return { error: 'That doesn’t look like an email address. It should look like name@example.com.' }
  }
  const email = found[0].replace(/[.,;:!?]+$/, '')
  if (!EMAIL_RE.test(email) || email.includes('..')) return { error: 'That email doesn’t look quite right. Could you check it? It should look like name@example.com.' }
  const [local, domain] = email.split('@')
  const fix = DOMAIN_TYPOS[domain]
  return fix ? { value: email, suggestion: `${local}@${fix}` } : { value: email }
}

/* -------------------------------------------------------------------- phone */

/**
 * Reads a mobile number with the country picked in the box, and works out the
 * real country when the visitor typed a + code (e.g. +1 with India selected).
 */
export const parsePhone = (phone, country) => {
  const raw = norm(phone)
  if (!raw) return { error: 'Please type your mobile number.' }
  if (/[a-z]/i.test(raw.replace(/\b(ext|x)\b/gi, ''))) return { error: 'A phone number should only have digits. Could you check it?' }
  const digits = raw.replace(/[^\d+]/g, '')
  // Obvious placeholders: all one digit, or 1234567890 / 9876543210.
  const national = digits.replace(/^\+\d{1,3}(?=\d{10}$)/, '').slice(-10)
  if (/^(\d)\1+$/.test(national) || '01234567890'.includes(national) || '09876543210'.includes(national))
    return { error: 'That looks like a placeholder number. Please enter your real mobile number.' }
  const attempts = [raw]
  // "919876543210" typed without the +.
  if (!digits.startsWith('+') && digits.length > 10) attempts.push(`+${digits}`)
  for (const attempt of attempts) {
    try {
      if (!isValidPhoneNumber(attempt, country)) continue
      const parsed = parsePhoneNumber(attempt, country)
      return { value: parsed.formatInternational(), country: parsed.country ?? country, national: parsed.formatNational() }
    } catch {
      // try the next form
    }
  }
  return { error: 'That number doesn’t look right for the country code. Could you check it, or pick a different country?' }
}

/* ------------------------------------------------------------------ project */

export const parseBusinessType = (text) => {
  const t = lower(text)
  if (/\b(start ?up|early stage|founder|new business|new company)\b/.test(t)) return 'startup'
  if (/\b(enterprise|large enterprise|conglomerate|group of companies)\b/.test(t)) return 'enterprise'
  if (/\b(corporate|corporation|mnc|multinational|big|large|listed)\b/.test(t)) return 'corporate'
  if (/\b(growing|scale ?up|scaling|mid ?size|medium|sme)\b/.test(t)) return 'growing-business'
  if (/\b(small|shop|store|local|family|msme)\b/.test(t)) return 'small-business'
  if (/\b(other|freelanc\w*|individual|personal|self|ngo|non ?profit|agency|government|school|college|trust)\b/.test(t)) return 'other'
  return null
}

export const parseTimeline = (text) => {
  const t = lower(text)
  if (/\b(asap|urgent|urgently|immediately|right away|now|today|this week|yesterday)\b/.test(t)) return 'asap'
  if (/\b(not sure|no idea|don'?t know|dont know|idk|unsure|maybe|undecided)\b/.test(t)) return 'not-sure'
  if (/\b(flexible|any ?time|whenever|no rush|no hurry)\b/.test(t)) return 'flexible'
  if (/\b(next year|6\+|six months|a year|later|(6|7|8|9|10|11|12) months)\b/.test(t)) return '6-plus-months'
  if (/\b(3|4|5|three|four|five) (months?|mo)\b|\bquarter\b/.test(t)) return '3-6-months'
  if (/\b(2|two) (months?|mo)\b|\b(6|7|8) weeks\b/.test(t)) return '2-3-months'
  if (/\b(next month|1 month|one month|a month|this month|few weeks|2 weeks|3 weeks|4 weeks|weeks)\b/.test(t)) return '1-2-months'
  return null
}

/** Budget as the visitor put it; "not sure" and the like mean no figure. */
export const parseBudget = (text) => {
  const t = norm(text)
  if (!t) return { error: 'A rough range is fine, or tap “Not sure yet”.' }
  if (/\b(not sure|no idea|don'?t know|idk|no budget|flexible|open|depends|tbd|discuss)\b/i.test(t)) return { value: '' }
  if (/\d/.test(t) && t.length <= 40) return { value: t }
  return { error: 'Could you give a rough figure, like “5 lakh” or “$10k”? Or tap “Not sure yet”.' }
}

/** A project description that gives the team something to work with. */
export const parseDetails = (text) => {
  const t = norm(text)
  if (t.length < 15 || !looksLikeWords(t, { minWords: 3 }))
    return { error: 'Could you describe it in a sentence? For example: “A website for my bakery with online orders.”' }
  return { value: t.slice(0, 4000) }
}

/* ---------------------------------------------------------------------- job */

const NUMBER_WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20 }

/** Total experience in whole years, as the value used by the apply form ('0'…'21'). */
export const parseExperience = (text) => {
  const t = lower(text)
  if (/\b(fresher|fresh|no experience|none|zero|student|graduate|just graduated|0)\b/.test(t) && !/\b[1-9]\d*\b/.test(t)) return { value: '0' }
  const word = Object.keys(NUMBER_WORDS).find((w) => new RegExp(`\\b${w}\\b`).test(t))
  const match = t.match(/-?\d+(\.\d+)?/)
  const n = match ? Number(match[0]) : word ? NUMBER_WORDS[word] : NaN
  if (!Number.isFinite(n)) return { error: 'How many years? Tap an option, or type a number like 3.' }
  if (n < 0) return { error: 'Experience can’t be negative. How many years have you worked?' }
  if (n > 50) return { error: 'That seems like a lot. How many years of experience do you have?' }
  if (/month/.test(t)) return { value: '0' }
  return { value: String(Math.min(Math.floor(n), 21)) }
}

export const parseNotice = (text) => {
  const t = lower(text)
  if (/\b(serving|on notice|notice period running)\b/.test(t)) return 'serving'
  if (/\b(immediate|immediately|now|asap|today|right away|anytime|any time|available|0 days|no notice)\b/.test(t)) return 'immediate'
  if (/\b(15|fifteen|two weeks|2 weeks|1 week|one week|10 days|a week)\b/.test(t)) return '15-days'
  if (/\b(90|three months|3 months|quarter)\b/.test(t)) return '90-days'
  if (/\b(60|two months|2 months)\b/.test(t)) return '60-days'
  if (/\b(30|thirty|one month|1 month|a month|4 weeks|month)\b/.test(t)) return '30-days'
  return null
}

export const parseCity = (text) => {
  const t = norm(text).replace(/[.!]+$/, '')
  if (!t) return { error: 'Which city are you based in?' }
  if (t.includes('@') || /https?:|www\./i.test(t)) return { error: 'Just the city name, please, for example Pune or Bengaluru.' }
  if (!/\p{L}{2,}/u.test(t) || /\d{3,}/.test(t)) return { error: 'Please type the name of your city, for example Pune or Bengaluru.' }
  if (t.length > 60) return { error: 'Just the city, please, for example Pune or Bengaluru.' }
  if (LATIN.test(t) && !looksLikeWords(t)) return { error: 'Sorry, I didn’t recognise that. Which city are you in?' }
  return { value: t }
}

export const SKILL_LEVELS = ['Expert', 'Comfortable', 'Learning']

export const parseSkillLevel = (text) => {
  const t = lower(text)
  const score = t.match(/\b(\d{1,2})\s*(\/|out of)\s*10\b/)
  if (score) return Number(score[1]) >= 8 ? 'Expert' : Number(score[1]) >= 5 ? 'Comfortable' : 'Learning'
  if (/\b(expert|advanced|pro|professional|strong|master|excellent|very good|great)\b/.test(t)) return 'Expert'
  if (/\b(comfortable|intermediate|good|decent|ok|okay|average|fine|working knowledge|confident)\b/.test(t)) return 'Comfortable'
  if (/\b(learning|beginner|basic|basics|new|weak|little|some|novice|no|none|never)\b/.test(t)) return 'Learning'
  return null
}

/** Profile link: a real public web address (LinkedIn, GitHub, a portfolio). */
export const parseProfileLink = (text) => {
  const t = norm(text)
  if (/^(skip|no|nope|none|na|n\/a|nil|-|not available|don'?t have( one)?|dont have|no link|nothing)$/i.test(t)) return { value: '' }
  let url = t
  // An @ is fine after the domain (medium.com/@name), not before it.
  if (url.split('/')[0].includes('@')) return { error: 'That looks like an email. I need a web link, like https://linkedin.com/in/you, or tap Skip.' }
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    const valid = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(host) && !/^\d+(\.\d+)*$/.test(host) && host !== 'localhost'
    if (!valid || /\s/.test(t)) throw new Error('bad')
    return { value: u.toString() }
  } catch {
    return { error: 'That doesn’t look like a link. Paste the full address, like https://linkedin.com/in/you, or tap Skip.' }
  }
}

/* ------------------------------------------------------------------ chat */

export const isSmallTalk = (text) => /^(ok(ay)?|k|kk|hmm+|hm+|yes|yeah|yep|no|nope|sure|fine|cool|nice|good|great|\?+|what|huh|lol|haha+|hehe+|😊|🙂|👍|👌|🙏)$/i.test(norm(text))
export const isRude = (text) => /\b(fuck|shit|bitch|bastard|idiot|stupid|useless|dumb|crap|chutiya|madarchod|bhenchod|bkl|mc|bc|harami|kamina)\b/i.test(text)
export const isRestart = (text) => /\b(restart|start over|start again|begin again|reset|new chat)\b/i.test(text)
export const isBack = (text) => /^(back|go back|previous|undo|wait go back|oops|mistake|wrong answer)$/i.test(norm(text))

/** "change my email", "my number is wrong", "update name" → the field to edit. */
export const editField = (text) => {
  const t = lower(text)
  if (!/\b(change|update|wrong|incorrect|correct|fix|edit|typo|mistake|new)\b/.test(t)) return null
  if (/\b(e-?mail|mail id|email id|email address)\b/.test(t)) return 'email'
  if (/\b(phone|mobile|number|whatsapp|contact number)\b/.test(t)) return 'phone'
  if (/\bname\b/.test(t)) return 'name'
  return null
}

/** Worth passing to the team as an unanswered question (not "ok" or a typo). */
export const isRealQuestion = (text) => {
  const t = norm(text)
  return t.length >= 8 && t.split(' ').length >= 2 && looksLikeWords(t)
}
