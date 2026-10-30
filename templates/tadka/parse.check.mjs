// Self-check for the order parser: node templates/tadka/parse.check.mjs
import assert from 'node:assert/strict'
import { parseOrder } from './parse.js'
import { MENU } from './menu.js'

const p = (t) => parseOrder(t, MENU)
assert.deepEqual(p('2 butter naan and a dal makhani'), [{ id: 'naan', qty: 2 }, { id: 'dal', qty: 1 }])
assert.deepEqual(p('three chai, 1 samosa'), [{ id: 'chai', qty: 3 }, { id: 'samosa', qty: 1 }])
assert.deepEqual(p('butter paneer with 4 rotis'), [{ id: 'butterpaneer', qty: 1 }, { id: 'roti', qty: 4 }])
assert.deepEqual(p('2 naan and 1 naan'), [{ id: 'naan', qty: 3 }])
assert.deepEqual(p('veg biryani 500'), [{ id: 'biryani', qty: 20 }]) // quantity is capped
assert.deepEqual(p('hello there'), [])
console.log('tadka parser: ok')
