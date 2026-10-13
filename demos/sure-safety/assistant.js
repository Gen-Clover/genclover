/**
 * Sure Assist: answers questions about the catalogue and captures enquiries.
 * It runs in the browser and answers only from the catalogue, the datasheet
 * details and the company facts, so it never invents a specification or a price.
 *
 *   reply(text, state) -> { text, products?, chips?, lead?, state }
 */
import { PRODUCTS, productBy, CATEGORIES, categoryBy, HAZARDS, SERVICES, COMPANY } from './site.js'

const norm = (s) => ` ${s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.+\-\s]/g, ' ').replace(/\s+/g, ' ')} `
const has = (q, words) => words.some((w) => q.includes(` ${w}`))

/** Plain words mapped to the categories and hazards buyers mean by them. */
const TOPICS = [
  { words: ['helmet', 'helmets', 'hard hat', 'hardhat', 'head', 'bump cap'], cat: 'head-protection' },
  { words: ['goggle', 'goggles', 'glasses', 'spectacle', 'eyewear', 'eye'], cat: 'eye-protection' },
  { words: ['face shield', 'visor', 'welding helmet', 'face'], cat: 'face-protection' },
  { words: ['ear', 'earplug', 'ear plug', 'muff', 'muffs', 'hearing'], cat: 'ear-protection' },
  { words: ['mask', 'respirator', 'breathing', 'scba', 'ffp', 'p2', 'dust', 'eebd', 'airline'], cat: 'respiratory-protection' },
  { words: ['glove', 'gloves', 'hand', 'sleeve'], cat: 'hand-protection' },
  { words: ['suit', 'coverall', 'apron', 'body', 'jacket', 'workwear'], cat: 'body-protection' },
  { words: ['shoe', 'shoes', 'boot', 'boots', 'footwear', 'gumboot', 'feet'], cat: 'feet-protection' },
  { words: ['harness', 'lanyard', 'fall', 'arrestor', 'lifeline', 'tripod', 'davit', 'net'], cat: 'fall-protection' },
  { words: ['torch', 'flashlight', 'headlamp', 'lamp', 'lighting', 'light'], cat: 'flash-light' },
  { words: ['detector', 'gas detector', 'gas monitor'], cat: 'gas-protection' },
  { words: ['eyewash', 'eye wash', 'shower'], cat: 'chemical-splash' },
  { words: ['blower', 'exhauster', 'fume extractor', 'ventilation'], cat: 'ventilation' },
  { words: ['blanket'], cat: 'performance-fabric' },
  { words: ['chlorine'], cat: 'chlorine-safety' },
  { words: ['cone', 'reflective', 'road'], cat: 'road-safety' },
  { words: ['wind sock', 'windsock', 'wind indicator'], cat: 'wind-indicator' },
  { words: ['rescue boat', 'line throwing', 'tent'], cat: 'rescue' },
  { words: ['water mist', 'extinguish', 'suppression', 'fire stop', 'fr coating'], cat: 'fire-protection' },
]
const HAZARD_WORDS = {
  heat: ['heat', 'hot', 'furnace', 'foundry', 'molten', 'aluminized', 'radiant', 'steel plant'],
  electrical: ['electrical', 'electric', 'arc', 'shock', 'voltage', 'live line', 'substation', 'switchgear', 'lineman'],
  chemical: ['chemical', 'acid', 'alkali', 'corrosive', 'splash', 'solvent', 'pharma'],
  height: ['height', 'scaffold', 'tower', 'roof', 'fall', 'confined space'],
  air: ['dust', 'fume', 'fumes', 'gas', 'smoke', 'vapour', 'vapor', 'toxic', 'welding fume'],
  noise: ['noise', 'loud', 'decibel', 'db', 'hearing'],
  fire: ['fire', 'firefighter', 'fireman', 'firefighting', 'ev battery', 'evacuation'],
  impact: ['cut', 'cuts', 'sharp', 'glass', 'sheet metal', 'impact', 'falling object'],
}

/** Spec words, and the detail fields that answer them. */
const ASKS = [
  { words: ['weight', 'weigh', 'weighs', 'heavy', 'light', 'grams', 'gms'], keys: ['Weight', 'Mass without visor'] },
  { words: ['size', 'fit', 'adjust'], keys: ['Size', 'Headband size'] },
  { words: ['material', 'made of', 'hdpe', 'abs', 'plastic'], keys: ['Material', 'Shell'] },
  { words: ['colour', 'color', 'colours', 'colors'], keys: ['Colours'] },
  { words: ['vent', 'ventilated', 'ventilation', 'holes', 'airflow'], keys: ['Ventilation holes', 'Ventilation'] },
  { words: ['suspension', 'harness', 'cradle'], keys: ['Suspension'] },
  { words: ['logo', 'branding', 'print'], keys: ['Logo'] },
]

const SCORE_WORDS = (p) => norm(`${p.name} ${categoryBy[p.cat].label} ${p.sub ?? ''} ${p.brand ?? ''} ${(p.standards ?? []).join(' ')} ${p.summary ?? ''}`)

const search = (q, limit = 3) => {
  const terms = q.trim().split(' ').filter((t) => t.length > 2 && !STOP.has(t))
  if (!terms.length) return []
  return PRODUCTS.map((p) => {
    const hay = SCORE_WORDS(p)
    let s = 0
    for (const t of terms) if (hay.includes(` ${t}`)) s += norm(p.name).includes(` ${t}`) ? 3 : 1
    if (p.summary) s += 0.5 // prefer products we can say more about
    return [s, p]
  })
    .filter(([s]) => s >= 3)
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([, p]) => p)
}
const STOP = new Set(['the', 'for', 'and', 'with', 'you', 'your', 'have', 'need', 'want', 'what', 'which', 'any', 'are', 'can', 'get', 'show', 'tell', 'about', 'some', 'our', 'work', 'workers', 'safety', 'protection', 'best', 'good', 'from', 'that', 'this', 'its', 'does', 'how', 'much', 'there'])

/** A named product in the question, longest name first so "tough hat helmet" beats "tough hat". */
const NAMED = PRODUCTS.filter((p) => p.summary)
  .map((p) => [norm(p.name).trim(), p])
  .concat([['fire pro', productBy['fire-man-helmet-fire-pro']], ['fireman helmet', productBy['fire-man-helmet-fire-pro']]])
  .sort((a, b) => b[0].length - a[0].length)
const namedIn = (q) => NAMED.find(([n]) => q.includes(` ${n} `))?.[1]

/** Standards as a sentence: the ISI licence number is named as a licence, not a standard. */
const standardsLine = (p) => {
  const std = p.standards.filter((s) => !s.startsWith('CM/L'))
  const lic = p.standards.find((s) => s.startsWith('CM/L'))
  const isi = std.find((s) => s.startsWith('IS '))
  return `${p.name} ${isi ? 'is ISI-marked to ' + isi + (lic ? ` (licence ${lic})` : '') : 'meets ' + list(std)}${isi && std.length > 1 ? ' and also meets ' + list(std.filter((s) => s !== isi)) : ''}.`
}

/** Products whose names carry a distinctive word from the question, like "SCBA" or "Zone 0". */
const byName = (q) => {
  const terms = q.trim().split(' ').filter((t) => (t.length > 2 || /\d/.test(t)) && !STOP.has(t))
  if (!terms.length) return []
  const words = (p) => norm(p.name).trim().split(' ')
  const hit = (p, t) => words(p).some((w) => w === t || (t.length > 3 && w.startsWith(t)) || (w.length > 3 && t.startsWith(w)))
  const named = (t) => unique(PRODUCTS.filter((p) => hit(p, t)))
  const full = unique(PRODUCTS.filter((p) => terms.every((t) => hit(p, t))))
  if (full.length) return full
  const rare = terms.map(named).filter((ps) => ps.length && ps.length <= 4)
  return rare.length ? rare.sort((a, b) => a.length - b.length)[0] : []
}

/** The same product listed under two categories counts once. */
const unique = (ps) => ps.filter((p, i) => ps.findIndex((x) => x.name === p.name) === i)

const list = (arr) => (arr.length > 1 ? `${arr.slice(0, -1).join(', ')} and ${arr.at(-1)}` : arr[0])
const QUOTE_CHIP = 'Get a quote'

/* ------------------------------------------------------------- the lead conversation */

const LEAD_STEPS = [
  { key: 'qty', ask: 'Roughly how many do you need?', chips: ['Under 50', '50 to 500', '500+', 'Not sure yet'] },
  { key: 'name', ask: 'Who should our sales team ask for?' },
  { key: 'company', ask: 'And which company or site is this for?' },
  { key: 'contact', ask: 'What’s the best phone number or email to reach you on?' },
]
const validContact = (v) => /\S+@\S+\.\S+/.test(v) || v.replace(/\D/g, '').length >= 10

const startLead = (need, state) => ({
  text: need ? `Happy to get you a quote for ${need}. ${LEAD_STEPS[0].ask}` : `Let’s get your enquiry to the sales team. What do you need? A product name or a short description is fine.`,
  chips: need ? LEAD_STEPS[0].chips : ['Helmets', 'Gloves', 'Arc flash kit', 'Fit testing'],
  state: { ...state, lead: { step: need ? 0 : -1, data: { need } } },
})

const continueLead = (raw, state) => {
  const lead = { ...state.lead, data: { ...state.lead.data } }
  if (/^(cancel|stop|never ?mind|no thanks)$/i.test(raw.trim())) return { text: 'No problem, I’ve dropped that enquiry. Ask me anything else.', state: { ...state, lead: null } }
  if (lead.step === -1) {
    lead.data.need = raw.trim()
    lead.step = 0
    return { text: `Got it: ${lead.data.need}. ${LEAD_STEPS[0].ask}`, chips: LEAD_STEPS[0].chips, state: { ...state, lead } }
  }
  const step = LEAD_STEPS[lead.step]
  if (step.key === 'contact' && !validContact(raw)) return { text: 'That doesn’t look like a phone number or email yet. Could you check it?', state }
  lead.data[step.key] = raw.trim()
  lead.step += 1
  const next = LEAD_STEPS[lead.step]
  if (next) return { text: lead.step === 2 ? `Thanks, ${lead.data.name.split(' ')[0]}. ${next.ask}` : next.ask, chips: next.chips, state: { ...state, lead } }
  const first = lead.data.name.split(' ')[0]
  return {
    text: `Thank you, ${first}. Your enquiry is with the sales team, and they usually reply within one working day.`,
    lead: { ...lead.data, products: state.focus ?? [], at: new Date().toISOString() },
    chips: ['Ask another question'],
    state: { ...state, lead: null },
  }
}

/* --------------------------------------------------------------------- answers */

export const GREETING = {
  text: `Hi, I’m Sure Assist. Ask me about any of our ${new Set(PRODUCTS.map((p) => p.name)).size} products: what suits a hazard, which standard a helmet meets, or what a model weighs. I can also pass your enquiry to sales.`,
  chips: ['Helmet for electrical work', 'Gloves for heat', 'Do you do fit testing?', 'Get a quote'],
}

export function reply(raw, state = {}) {
  const q = norm(raw)
  if (state.lead) return continueLead(raw, state)

  if (raw.trim() === QUOTE_CHIP || has(q, ['quote', 'price', 'pricing', 'cost', 'rate', 'buy', 'order', 'bulk', 'quotation', 'rfq', 'enquiry', 'inquiry'])) {
    const p = namedIn(q) ?? (state.focus?.length === 1 ? productBy[state.focus[0]] : null)
    const intro = has(q, ['price', 'pricing', 'cost', 'rate']) ? 'Prices depend on the model, quantity and any branding, so the sales team quotes each order. ' : ''
    const r = startLead(p?.name ?? null, { ...state, focus: p ? [p.slug] : state.focus })
    return { ...r, text: intro + r.text }
  }

  if (has(q, ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'])) return { ...GREETING, state }
  if (has(q, ['thank', 'thanks', 'great', 'perfect'])) return { text: 'Glad to help. Anything else you’d like to check?', chips: ['Get a quote', 'Where are you based?'], state }
  if (raw.trim() === 'Ask another question') return { text: 'Of course. What would you like to know?', chips: GREETING.chips, state }

  if (has(q, ['where', 'address', 'located', 'location', 'office', 'factory', 'visit', 'phone', 'call', 'email', 'contact', 'whatsapp', 'number'])) {
    return {
      text: `We’re at ${COMPANY.address.join(', ')}. Call ${COMPANY.phones[0]} or ${COMPANY.phones[1]}, write to ${COMPANY.email}, or message us on WhatsApp at ${COMPANY.whatsapp}.`,
      chips: ['Get a quote', 'Do you do fit testing?'],
      state,
    }
  }

  const brand = COMPANY.distributes.find((b) => q.includes(` ${b.toLowerCase()}`))
  if (brand || has(q, ['brands', 'brand', 'distribute', 'distributor', 'saviour'])) {
    return {
      text: `${brand ? `Yes, we supply ${brand}. ` : ''}Saviour is our own PPE brand, and we also distribute ${list(COMPANY.distributes)}. Tell me the product and I’ll check what we carry.`,
      chips: ['Show Saviour helmets', 'Get a quote'],
      state,
    }
  }

  const service = SERVICES.find((s) => [s.title, ...s.items].some((t) => q.includes(` ${norm(t).trim().split(' ').slice(0, 2).join(' ')}`))) ??
    (has(q, ['fit test', 'fit testing', 'nebosh', 'audit', 'hazop', 'consult', 'hygiene', 'noise mapping', 'air quality', 'heat stress', 'training']) &&
      SERVICES.find((s) => s.items.some((i) => has(q, norm(i).trim().split(' ').filter((w) => w.length > 3)))))
  if (service) {
    return { text: `Yes. ${service.line} That covers ${list(service.items.map((i) => i.toLowerCase()))}.`, chips: ['Book a site visit', 'Get a quote'], state: { ...state, focus: [] } }
  }
  if (raw.trim() === 'Book a site visit') return startLead('a site visit', state)
  if (raw.trim() === 'Show Saviour helmets') {
    const ps = ['freedom', 'vento', 'wind'].map((s) => productBy[s])
    return { text: 'Here are three Saviour helmets, all ISI-marked to IS 2925:1984.', products: ps, chips: ['Which is lightest?', 'Get a quote'], state: { ...state, focus: ps.map((p) => p.slug) } }
  }

  // a question about one named product
  const named = namedIn(q) ?? (has(q, ['it', 'this', 'that one', 'lightest', 'heaviest']) && state.focus?.length === 1 ? productBy[state.focus[0]] : null)
  if (named) {
    const ask = ASKS.find((a) => has(q, a.words))
    if (has(q, ['standard', 'standards', 'certified', 'certification', 'isi', 'bis', 'en 397', 'approved', 'compliant'])) {
      const text = named.standards ? standardsLine(named) : `I don’t have the certificate details for ${named.name} here. The sales team can send the test certificate with your quote.`
      return { text, products: [named], chips: [QUOTE_CHIP], state: { ...state, focus: [named.slug] } }
    }
    if (ask && named.specs) {
      const found = ask.keys.map((k) => named.specs[k] && `${k.toLowerCase()} ${named.specs[k]}`).filter(Boolean)
      if (found.length) return { text: `${named.name}: ${list(found)}.`, products: [named], chips: [QUOTE_CHIP, 'What standards does it meet?'], state: { ...state, focus: [named.slug] } }
    }
    if (ask) return { text: `The datasheet I have for ${named.name} doesn’t list that. I can ask the team to confirm it with your quote.`, products: [named], chips: [QUOTE_CHIP], state: { ...state, focus: [named.slug] } }
    return { text: named.summary ?? `${named.name} is in our ${categoryBy[named.cat].label.toLowerCase()} range.`, products: [named], chips: ['What standards does it meet?', QUOTE_CHIP], state: { ...state, focus: [named.slug] } }
  }
  if (raw.trim() === 'What standards does it meet?' && state.focus?.length === 1) return reply(`${productBy[state.focus[0]].name} standards`, state)
  if (raw.trim() === 'Which is lightest?') {
    return { text: 'Of the helmets with a published weight, the Electrical Helmet is about 325 g. For the others, the sales team can confirm weights with your quote.', products: [productBy['electrical-helmet']], chips: [QUOTE_CHIP], state: { ...state, focus: ['electrical-helmet'] } }
  }

  // a hazard, a category, or both ("gloves for heat")
  const hazard = HAZARDS.find((h) => has(q, HAZARD_WORDS[h.id]))
  const topic = TOPICS.find((t) => has(q, t.words))
  // a bare category word ("helmets") opens the range; anything more specific is matched by name
  const rest = topic ? topic.words.reduce((acc, w) => acc.replaceAll(` ${w}`, ' '), q) : q
  const exact = topic && !byName(rest).length ? [] : byName(q)
  if (exact.length && (!hazard || exact.every((p) => hazard.products.includes(p.slug)))) {
    const shown = exact.slice(0, 3)
    return { text: `${shown.length === 1 ? 'This is' : 'These are'} the closest match${shown.length === 1 ? '' : 'es'} by name. Tap one for its details.`, products: shown, chips: [QUOTE_CHIP], state: { ...state, focus: shown.map((p) => p.slug) } }
  }
  if (hazard || topic) {
    let ps
    if (hazard && topic) ps = hazard.products.map((s) => productBy[s]).filter((p) => p.cat === topic.cat || (topic.cat === 'hand-protection' && /glove/i.test(p.name)) || (topic.cat === 'head-protection' && /helmet/i.test(p.name)))
    if (!ps?.length && hazard) ps = hazard.products.map((s) => productBy[s])
    if (!ps?.length) ps = PRODUCTS.filter((p) => p.cat === topic.cat).sort((a, b) => Number(!!b.summary) - Number(!!a.summary))
    const shown = unique(ps).slice(0, 3)
    const where = hazard ? `for ${hazard.label.toLowerCase()}` : `in ${categoryBy[topic.cat].label.toLowerCase()} protection`
    const total = topic && !hazard ? PRODUCTS.filter((p) => p.cat === topic.cat).length : ps.length
    return {
      text: `Here ${shown.length === 1 ? 'is a good match' : 'are good matches'} ${where}${total > shown.length ? `, from ${total} in the range` : ''}. Tap one for its details.`,
      products: shown,
      chips: [QUOTE_CHIP, ...(total > shown.length ? [`See all ${total}`] : [])],
      state: { ...state, focus: shown.map((p) => p.slug), more: topic && !hazard ? `#/products/${topic.cat}` : hazard ? `#/?hazard=${hazard.id}` : null },
    }
  }

  const found = search(q)
  if (found.length) return { text: `These look closest to what you described.`, products: found, chips: [QUOTE_CHIP], state: { ...state, focus: found.map((p) => p.slug) } }

  return {
    text: `I couldn’t find that in the online catalogue. The team can check the full range, including the brands we distribute. Shall I pass it on?`,
    chips: ['Yes, pass it on', 'Show me categories'],
    state: { ...state, pending: raw.trim() },
  }
}

/** Chip shortcuts that depend on the last answer. */
export function chipAction(label, state) {
  if (label === 'Yes, pass it on') return startLead(state.pending, state)
  if (label === 'Show me categories') return { text: `We cover ${CATEGORIES.length} categories: ${list(CATEGORIES.map((c) => c.label.toLowerCase()))}. Which one should I open?`, chips: ['Helmets', 'Gloves', 'Respiratory', 'Fall'], state }
  return null
}
