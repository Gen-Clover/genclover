// Turns a typed message like "2 butter naan and a dal" into cart lines.
// shortcut: keyword matching, not a language model; fine for a demo menu of ~15 items.

const NUM = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }
const words = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)

export const parseOrder = (text, menu) => {
  const lines = []
  for (const part of text.toLowerCase().split(/,|\band\b|\+|&|\n|\bwith\b/)) {
    const w = words(part)
    const n = w.find((t) => /^\d+$/.test(t) || NUM[t])
    const qty = n ? Math.min(20, Math.max(1, /^\d+$/.test(n) ? +n : NUM[n])) : 1
    let best = null
    let score = 0
    for (const item of menu) {
      const keys = new Set(words(`${item.keys} ${item.name}`))
      const s = w.reduce((sum, t) => sum + (keys.has(t) || keys.has(t.replace(/s$/, '')) ? 1 : 0), 0)
      if (s > score) [best, score] = [item, s]
    }
    if (!best) continue
    const line = lines.find((l) => l.id === best.id)
    line ? (line.qty += qty) : lines.push({ id: best.id, qty })
  }
  return lines
}
