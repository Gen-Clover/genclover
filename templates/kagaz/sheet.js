// Spreadsheet helpers: amount parsing, the totals check and CSV export.

export const COLUMNS = [
  ['vendor', 'Vendor'],
  ['date', 'Date'],
  ['number', 'Bill no.'],
  ['category', 'Category'],
  ['subtotal', 'Subtotal'],
  ['tax', 'Tax'],
  ['total', 'Total'],
]

// "₹ 8,850.00" -> 8850; empty or unreadable -> null
export const amount = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : null
}

export const checkTotals = ({ subtotal, tax, total }) => {
  const [s, t, g] = [amount(subtotal), amount(tax), amount(total)]
  if (g == null) return 'incomplete'
  if (s == null || t == null) return 'partial'
  return Math.abs(s + t - g) < 0.01 ? 'ok' : 'mismatch'
}

// Quote every cell and defuse values a spreadsheet would run as a formula.
const cell = (v) => {
  let s = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

export const toCSV = (rows) =>
  [COLUMNS.map(([, label]) => cell(label)), ...rows.map((r) => COLUMNS.map(([key]) => cell(r[key])))]
    .map((line) => line.join(','))
    .join('\r\n')
