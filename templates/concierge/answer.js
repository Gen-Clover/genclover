// Picks the FAQ that best answers a question. Plain keyword scoring, no AI:
// enough to show how an assistant grounded in a business's own FAQs behaves.
// shortcut: keyword overlap, not semantic search; swap for embeddings in a real build.

const STOP = new Set(
  'a an the is are am do does did you your i me my we our us can could would should to for of in on at it its and or what whats how when where which who with any have has be will there this that from by about if please tell know get much many'.split(' '),
)

export const tokens = (text) =>
  text
    .toLowerCase()
    .replace(/'s\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w))

const GREETING = /^\s*(hi|hello|hey|namaste|good (morning|evening|afternoon))\b/i
const HUMAN = /\b(human|person|someone|agent|call me|talk to|speak to)\b/i

/** Returns { kind: 'answer', faq } | { kind: 'greeting' } | { kind: 'human' } | { kind: 'unknown' } */
export const answer = (question, faqs) => {
  if (HUMAN.test(question)) return { kind: 'human' }
  const words = tokens(question)
  let best = null
  let bestScore = 0
  for (const faq of faqs) {
    const keys = new Set(tokens(`${faq.keys} ${faq.q}`))
    const score = words.reduce((n, w) => n + (keys.has(w) ? 1 : 0), 0)
    if (score > bestScore) [best, bestScore] = [faq, score]
  }
  if (best) return { kind: 'answer', faq: best }
  return GREETING.test(question) ? { kind: 'greeting' } : { kind: 'unknown' }
}
