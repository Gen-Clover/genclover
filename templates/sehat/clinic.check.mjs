// Self-check for the scheduling rules: node templates/sehat/clinic.check.mjs
import assert from 'node:assert/strict'
import { DOCTORS, slotsFor, availability, firstFree, tokenOf, queueFor, label, validPhone } from './clinic.js'

const [mehta, khan] = DOCTORS
const s = slotsFor(mehta)
assert.equal(s[0], '09:00')
assert.equal(s.at(-1), '12:45') // last slot still ends by 13:00
assert.ok(!s.includes('11:00') && !s.includes('11:15')) // breaks skipped
assert.equal(slotsFor(khan).length, 11) // 12 twenty-minute slots minus one break

const d = '2026-11-02'
const bookings = [
  { id: 1, doctor: 'mehta', date: d, time: '09:30', status: 'arrived' },
  { id: 2, doctor: 'mehta', date: d, time: '09:00', status: 'in' },
  { id: 3, doctor: 'mehta', date: d, time: '10:00', status: 'cancelled' },
  { id: 4, doctor: 'mehta', date: d, time: '09:15', status: 'arrived' },
  { id: 5, doctor: 'mehta', date: d, time: '10:15', status: 'booked' },
]
const av = availability(mehta, d, bookings, 9 * 60 + 20)
assert.equal(av.find((x) => x.time === '09:30').taken, true)
assert.equal(av.find((x) => x.time === '10:00').taken, false) // cancelled frees the slot
assert.equal(av.find((x) => x.time === '09:15').past, true)
assert.equal(firstFree(mehta, d, bookings, 9 * 60 + 20), '09:45')

assert.equal(tokenOf(bookings[0], bookings), 3) // 09:00, 09:15, 09:30
const q = queueFor('mehta', d, bookings)
assert.equal(q.current.id, 2)
assert.deepEqual(q.waiting.map((b) => b.id), [4, 1])
assert.deepEqual(q.later.map((b) => b.id), [5])

assert.equal(label('13:05'), '1:05 pm')
assert.equal(label('09:00'), '9:00 am')
assert.ok(validPhone('98765 43210') && !validPhone('12345'))
console.log('sehat clinic: ok')
