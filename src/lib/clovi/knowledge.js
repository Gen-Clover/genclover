import { services, PRICING_STATEMENT } from '../../data/services'
import { publishedProjects } from '../../data/projects'
import { industryPages } from '../../data/industries'
import {
  processSteps,
  carePlans,
  CARE_PRICING_NOTE,
  differentiators,
  startingPoints,
  processFaqs,
} from '../../data/process'
import { projectDescription } from '../../data/projectSeo'
import { getIndustry, getWorkCategory } from '../../data/taxonomy'
import { contact, routes } from '../../data/site'

/**
 * What Clovi knows, and how it finds an answer, all in the browser.
 *
 * Built from the same data files the website renders, so every answer matches
 * the site and a new service, case study or industry is known automatically.
 * No AI model: questions are matched by keyword search with synonyms and
 * light stemming. Nothing here may state a fact the site does not.
 */

/* --------------------------------------------------------------- search */

const STOP = new Set(
  'a an the and or but of to in on for with at by from is are was were be been do does did can could would should will i you we our your my me us it its this that these those what which who how when where why any some about into as if please tell know want need looking there here have has get build built make create develop offer provide service services company done anything something everything thing things like just also really much many very ever lot possible able'.split(' ')
)

/** Words that mean the same thing to a visitor. Keys and values are stems. */
const SYNONYMS = {
  price: ['cost', 'pricing', 'quote', 'budget', 'rate', 'charge', 'fee', 'expensive', 'cheap', 'afford', 'estimate'],
  time: ['timeline', 'long', 'duration', 'deadline', 'fast', 'quick', 'week', 'month', 'deliver'],
  job: ['career', 'hiring', 'hire', 'vacancy', 'opening', 'role', 'position', 'intern', 'internship', 'join', 'apply', 'resume', 'cv', 'jobs'],
  website: ['site', 'webpage', 'landing', 'wordpress', 'redesign'],
  app: ['application', 'webapp', 'portal', 'dashboard', 'saas', 'platform', 'software'],
  ai: ['artificial', 'intelligence', 'ml', 'machine', 'learning', 'genai', 'llm', 'gpt', 'chatbot', 'agent', 'automation', 'automate'],
  data: ['analytics', 'bi', 'power', 'dashboard', 'report', 'reporting', 'warehouse', 'etl', 'sql', 'tableau'],
  ecommerce: ['commerce', 'shop', 'store', 'shopify', 'cart', 'online', 'retail'],
  seo: ['marketing', 'google', 'ranking', 'traffic', 'search'],
  devops: ['cloud', 'aws', 'azure', 'gcp', 'deploy', 'deployment', 'infrastructure', 'mlops', 'hosting', 'server'],
  support: ['maintenance', 'maintain', 'care', 'update', 'bug', 'after', 'launch', 'retainer'],
  location: ['located', 'locate', 'based', 'office', 'city', 'country', 'chandigarh', 'india', 'timezone', 'zone', 'address'],
  contact: ['email', 'phone', 'call', 'reach', 'talk', 'meet', 'meeting', 'number', 'whatsapp'],
  process: ['work', 'approach', 'method', 'methodology', 'step', 'stage', 'discover', 'agile'],
  portfolio: ['case', 'study', 'studies', 'example', 'previous', 'past'],
}
const SYNONYM_OF = {}
for (const [key, words] of Object.entries(SYNONYMS)) {
  SYNONYM_OF[key] = key
  for (const w of words) SYNONYM_OF[w] ??= key
}

const stem = (w) =>
  w.length > 4 ? w.replace(/(ies)$/, 'y').replace(/(ing|ed|es|s)$/, '') : w.replace(/s$/, '')

export const tokens = (text) =>
  String(text ?? '')
    .toLowerCase()
    .replace(/e-commerce/g, 'ecommerce')
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^\.+|\.+$/g, ''))
    .filter((w) => w && !STOP.has(w))
    .flatMap((w) => {
      const s = stem(w)
      const syn = SYNONYM_OF[w] ?? SYNONYM_OF[s]
      return syn && syn !== s ? [s, syn] : [s]
    })

/** A document: `title`/`keywords` weigh more than `body`. `answer` is what Clovi says. */
const doc = (d) => ({
  ...d,
  _title: new Set(tokens(`${d.title} ${d.keywords ?? ''}`)),
  _body: tokens(d.body ?? ''),
})

/* ------------------------------------------------------------ documents */

/** Words visitors use for each service that its page does not always say. */
const SERVICE_KEYWORDS = {
  websites: 'website site landing page corporate portfolio redesign wordpress restaurant brochure',
  'web-applications': 'web app portal dashboard saas internal tool crm erp booking',
  ecommerce: 'ecommerce shop store shopify cart checkout catalog',
  'ai-automation': 'ai chatbot assistant agent llm genai gpt automation automate workflow',
  'data-analytics': 'data analytics power bi dashboard report warehouse etl sql kpi',
  'technology-solutions': 'custom integration api system legacy modernization',
  'devops-mlops': 'devops mlops cloud aws azure gcp deployment ci cd kubernetes docker hosting',
  'digital-marketing-seo': 'seo marketing google ranking traffic ads content',
}

const serviceLink = (s) => ({ label: s.title, to: `${routes.services}/${s.slug}` })
const projectLink = (p) => ({ label: p.title, to: `${routes.work}/${p.slug}` })

export const projectCard = (p) => ({
  kind: 'project',
  title: p.title,
  meta: [getIndustry(p.industry)?.label, getWorkCategory(p.category)?.label].filter(Boolean).join(' · '),
  text: projectDescription(p).replace(/\s*Gen Clover case study\.?$/, ''),
  to: `${routes.work}/${p.slug}`,
})

export const projectsForService = (slug, limit = 2) =>
  publishedProjects
    .filter((p) => p.primaryService === slug || p.additionalServices?.includes(slug))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, limit)

const topTechnologies = (() => {
  const count = {}
  for (const p of publishedProjects) for (const t of p.technologies ?? []) count[t] = (count[t] ?? 0) + 1
  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([t]) => t)
})()

const curated = [
  {
    id: 'pricing',
    title: 'pricing cost price quote budget how much',
    answer: `${PRICING_STATEMENT} ${processFaqs[0].answer}`,
    chips: ['Start a project', 'How do you work?'],
  },
  {
    id: 'timeline',
    title: 'how long timeline time duration deliver fast',
    answer:
      'It depends on the scope, so we do not quote a timeline blind. After a short Discover and Define phase you get a written scope, priorities and a delivery plan with milestones. If you share your timeline in a project brief, we will tell you honestly what fits.',
    chips: ['Start a project', 'How do you work?'],
  },
  {
    id: 'location',
    title: 'where based location office time zone',
    answer: processFaqs.find((f) => /based/i.test(f.question))?.answer,
    chips: ['Contact the team', 'What do you build?'],
  },
  {
    id: 'contact',
    title: 'contact email phone call reach talk meet human person',
    answer: `You can email the team at ${contact.email}, or send a project brief from Start a Project and someone will reply within one or two working days. I have your details already, so I can also pass a message to the team for you.`,
    chips: ['Talk to a person', 'Start a project'],
    links: [{ label: 'Start a Project', to: routes.startProject }],
  },
  {
    id: 'process',
    title: 'how do you work process approach method stages',
    answer: `Seven stages: ${processSteps.map((s) => s.title).join(' → ')}. Scope, decisions and trade-offs are written down, every change is reviewed before release, and you work directly with the people building your product.`,
    chips: ['Discover stage', 'Support after launch', 'Start a project'],
    links: [{ label: 'How we work', to: routes.howWeWork }],
  },
  {
    id: 'change',
    title: 'requirements change scope change',
    answer: processFaqs.find((f) => /change/i.test(f.question))?.answer,
  },
  {
    id: 'inhouse',
    title: 'in-house team work with our team developers extend augment',
    answer: processFaqs.find((f) => /in-house/i.test(f.question))?.answer,
    chips: ['Ways to start', 'Start a project'],
  },
  {
    id: 'need-from-us',
    title: 'what do you need from us our side involvement',
    answer: processFaqs.find((f) => /need from us/i.test(f.question))?.answer,
  },
  {
    id: 'support',
    title: 'support maintenance after launch care plan retainer updates',
    answer: `After launch there are three care plans: ${carePlans.map((p) => `${p.name} (${p.description.charAt(0).toLowerCase()}${p.description.slice(1, -1)})`).join('; ')}. ${CARE_PRICING_NOTE}`,
    chips: ['Start a project', 'How do you work?'],
  },
  {
    id: 'start',
    title: 'ways to start engagement options discovery take over existing product extend team',
    answer: `There are four ways to start: ${startingPoints.map((s) => `${s.title.toLowerCase()} (${s.fit.charAt(0).toLowerCase()}${s.fit.slice(1, -1)})`).join('; ')}.`,
    chips: ['Start a project'],
  },
  {
    id: 'why',
    title: 'why gen clover different better choose you',
    answer: differentiators.slice(0, 4).map((d) => `${d.title}: ${d.description}`).join(' '),
    chips: ['See our work', 'Start a project'],
  },
  {
    id: 'services',
    title: 'what do you do build offer services capabilities',
    answer: `We build ${services.map((s) => s.title).join(', ').replace(/, ([^,]*)$/, ' and $1')}. Which one are you interested in?`,
    chips: services.slice(0, 5).map((s) => s.title),
  },
  {
    id: 'industries',
    title: 'industries sectors domains who do you work with',
    answer: `We work across ${industryPages.map((i) => i.label).join(', ').replace(/, ([^,]*)$/, ' and $1')}.`,
    links: [{ label: 'Industries', to: routes.industries }],
  },
  {
    id: 'work',
    title: 'portfolio case studies examples previous projects work',
    answer: `We have ${publishedProjects.length} published case studies of delivered client work, from AI agents to data platforms and websites. Here are a few:`,
    cards: publishedProjects.filter((p) => p.featured).slice(0, 3).map(projectCard),
    links: [{ label: 'All our work', to: routes.work }],
  },
  {
    id: 'clients',
    title: 'client clients names references logos customers',
    answer:
      'We do not name clients unless they have approved it in writing, so the case studies describe the sector and the work rather than the company. The outcomes describe what each system does, never invented figures.',
    chips: ['See our work'],
  },
  {
    id: 'tech',
    title: 'technology tech stack tools languages frameworks',
    answer: `The tools come from the problem, not the other way round. Across our delivered work that includes ${topTechnologies.join(', ')}.`,
    chips: ['See our work'],
  },
  {
    id: 'privacy',
    title: 'privacy security confidential confidentiality nda sign agreement gdpr',
    answer:
      'We only use what you share to respond to you, and we never sell or share your details. For confidentiality needs on a project, mention them in your brief and we will agree how information is handled before you share anything sensitive.',
    links: [{ label: 'Privacy notice', to: routes.privacy }],
  },
  {
    id: 'audience',
    title: 'startups small business enterprise corporate who do you work with',
    answer:
      'Startups, small and growing businesses, corporates and enterprises, in India and internationally. We shape the engagement to where you are: a short discovery for an idea that needs shaping, or a full build for a defined product.',
    chips: ['Ways to start', 'Start a project'],
  },
  {
    id: 'jobs',
    title: 'jobs careers hiring openings vacancies roles apply join',
    answer: '', // filled in by the conversation engine with the live open roles
  },
  {
    id: 'mobile',
    title: 'mobile app ios android native iphone playstore appstore',
    answer:
      'We build websites and web applications that work well on phones and tablets. Native iOS or Android apps are not one of our listed services, but tell me about your idea and I will pass it to the team.',
    chips: ['Talk to a person', 'Start a project'],
  },
  {
    id: 'about',
    title: 'about gen clover who are you company team',
    answer:
      'Gen Clover is a technology and digital product company based in Chandigarh, India. We design and build websites, applications, AI and data solutions for businesses in India and internationally.',
    links: [{ label: 'About us', to: routes.about }],
  },
  {
    id: 'clovi',
    title: 'who are you clovi bot assistant robot human ai',
    answer:
      'I am Clovi, Gen Clover’s assistant. I can answer questions about what we build and how we work, show relevant case studies, take a project brief, and help you apply for open roles. Anything I cannot answer goes straight to the team.',
  },
]

const docs = [
  ...curated.map((c) => doc({ ...c, type: 'faq', keywords: c.title, body: c.answer })),
  ...services.map((s) =>
    doc({
      id: `service:${s.slug}`,
      type: 'service',
      slug: s.slug,
      title: s.title,
      keywords: `${SERVICE_KEYWORDS[s.slug] ?? s.slug.replace(/-/g, ' ')} ${s.capabilities.map((c) => c.label).join(' ')}`,
      body: `${s.shortDescription} ${s.heroDescription} ${s.capabilities.map((c) => `${c.label} ${c.description}`).join(' ')}`,
      answer: `${s.shortDescription} This covers ${s.capabilities.slice(0, 4).map((c) => c.label.toLowerCase()).join(', ')}.`,
      links: [serviceLink(s)],
    })
  ),
  ...publishedProjects.map((p) =>
    doc({
      id: `project:${p.slug}`,
      type: 'project',
      title: p.title,
      keywords: (p.technologies ?? []).join(' '),
      body: `${getIndustry(p.industry)?.label} ${p.summary} ${(p.outcomes ?? []).join(' ')}`,
      answer: p.summary,
      cards: [projectCard(p)],
    })
  ),
  ...industryPages.map((i) =>
    doc({
      id: `industry:${i.id}`,
      type: 'industry',
      title: i.label,
      keywords: i.id.replace(/-/g, ' '),
      body: `${i.seoDescription} ${i.description}`,
      answer: i.seoDescription ?? i.description,
      links: [{ label: i.label, to: `${routes.industries}/${i.id}` }],
      cards: publishedProjects.filter((p) => p.industry === i.id).slice(0, 2).map(projectCard),
    })
  ),
  ...processSteps.map((s) =>
    doc({
      id: `step:${s.title}`,
      type: 'step',
      title: `${s.title} stage`,
      body: `${s.summary} ${s.detail} ${(s.weDo ?? []).join(' ')} ${(s.youGet ?? []).join(' ')}`,
      answer: `${s.title}: ${s.summary} ${s.detail}${s.youGet?.length ? ` You get: ${s.youGet.join(', ').toLowerCase()}.` : ''}`,
      links: [{ label: 'How we work', to: routes.howWeWork }],
    })
  ),
]

/**
 * The best answer for a question, or null when nothing matches well enough
 * (Clovi then says so and passes the question to the team).
 */
/** Every word Clovi's knowledge uses. Words outside it (filler, or off-topic) do not dilute a match. */
const VOCABULARY = new Set(docs.flatMap((d) => [...d._title, ...d._body]))

export const search = (question) => {
  const qs = new Set(tokens(question).filter((t) => VOCABULARY.has(t)))
  if (qs.size === 0) return null
  let best = null
  for (const d of docs) {
    let score = 0
    for (const t of qs) {
      if (d._title.has(t)) score += 3
      const inBody = d._body.filter((b) => b === t).length
      if (inBody) score += Math.min(inBody, 3) * 0.6
    }
    // Specific documents beat broad ones on an equal match.
    if (d.type === 'faq') score *= 1.1
    if (d.type === 'service' || d.type === 'industry') score *= 1.15
    const normalized = score / Math.sqrt(qs.size)
    if (!best || normalized > best.score) best = { doc: d, score: normalized }
  }
  return best && best.score >= 2.4 ? best.doc : null
}

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug)
export const serviceByTitle = (title) => services.find((s) => s.title.toLowerCase() === String(title).toLowerCase())
export const curatedById = (id) => docs.find((d) => d.id === id)
