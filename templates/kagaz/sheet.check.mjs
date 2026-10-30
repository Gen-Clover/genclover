// Self-check for the sheet helpers: node templates/kagaz/sheet.check.mjs
import assert from 'node:assert/strict'
import { amount, checkTotals, toCSV } from './sheet.js'

assert.equal(amount('₹ 8,850.00'), 8850)
assert.equal(amount(''), null)
assert.equal(checkTotals({ subtotal: '500', tax: '25', total: '525' }), 'ok')
assert.equal(checkTotals({ subtotal: '500', tax: '25', total: '520' }), 'mismatch')
assert.equal(checkTotals({ subtotal: '', tax: '', total: '2,400' }), 'partial')
assert.equal(checkTotals({ subtotal: '1', tax: '1', total: '' }), 'incomplete')

const csv = toCSV([{ vendor: 'Say "hi", co', date: '2026-10-02', number: '=1+1', total: 525 }])
const [head, row] = csv.split('\r\n')
assert.equal(head, '"Vendor","Date","Bill no.","Category","Subtotal","Tax","Total"')
assert.equal(row, `"Say ""hi"", co","2026-10-02","'=1+1","","","","525"`)
console.log('kagaz sheet: ok')
