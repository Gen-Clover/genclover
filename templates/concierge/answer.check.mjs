// Self-check for the matcher: node templates/concierge/answer.check.mjs
import assert from 'node:assert/strict'
import { answer } from './answer.js'
import { BUSINESSES } from './businesses.js'

const [bakery, physio, cowork] = BUSINESSES
const hit = (q, b) => answer(q, b.faqs).faq?.q

// every suggested question except the last lands on an FAQ; the last is a deliberate gap
for (const b of BUSINESSES) {
  b.ask.slice(0, -1).forEach((q) => assert.equal(answer(q, b.faqs).kind, 'answer', `${b.id}: ${q}`))
  assert.equal(answer(b.ask.at(-1), b.faqs).kind, 'unknown', `${b.id}: ${b.ask.at(-1)}`)
}
assert.equal(hit('Birthday cake for Saturday?', bakery), 'Can I order a custom cake?')
assert.equal(hit("Do I need a doctor's referral?", physio), 'Do I need a referral?')
assert.equal(hit('What does a hot desk cost?', cowork), 'What plans do you have?')
assert.equal(answer('hello there', bakery.faqs).kind, 'greeting')
assert.equal(answer('can I talk to a person', bakery.faqs).kind, 'human')
// a taught FAQ is found straight away
assert.equal(hit('Do you have parking?', { faqs: [...bakery.faqs, { q: 'Is there parking nearby?', a: '…', keys: '' }] }), 'Is there parking nearby?')
console.log('concierge matcher: ok')
