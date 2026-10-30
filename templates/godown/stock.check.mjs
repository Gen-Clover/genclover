// Self-check for the stock rules: node templates/godown/stock.check.mjs
import assert from 'node:assert/strict'
import { available, isLow, shortfall, reserve, pack, ship, needs, make, suggestQty, receive } from './stock.js'

const items = [
  { sku: 'bolt', onHand: 50, reserved: 10, reorder: 20, bom: [['steel', 1.1], ['box', 1]] },
  { sku: 'steel', onHand: 30, reserved: 0, reorder: 40 },
  { sku: 'box', onHand: 100, reserved: 0, reorder: 10 },
]
const [bolt, steel] = items
assert.equal(available(bolt), 40)
assert.equal(isLow(steel), true)

const order = { id: 'SO-1', status: 'new', lines: [['bolt', 45]] }
assert.deepEqual(shortfall(order, items), [['bolt', 5]])
assert.throws(() => reserve(order, items)) // can't reserve what isn't there

assert.deepEqual(needs('bolt', 30, items).map((r) => r.short), [3, 0]) // 33 kg steel needed, 30 on hand
assert.throws(() => make('bolt', 30, items))
make('bolt', 20, items)
assert.equal(steel.onHand, 8) // 30 - 22
assert.equal(bolt.onHand, 70)

reserve(order, items)
assert.equal(bolt.reserved, 55)
assert.throws(() => ship(order, items)) // must be packed first
pack(order)
ship(order, items)
assert.equal(order.status, 'shipped')
assert.equal(bolt.onHand, 25)
assert.equal(bolt.reserved, 10)

assert.equal(suggestQty(steel), 72) // back up to 80 kg
receive('steel', 72, items)
assert.equal(isLow(steel), false)
console.log('godown stock: ok')
