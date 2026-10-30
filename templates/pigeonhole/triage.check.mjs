// Self-check for the triage rules: node templates/pigeonhole/triage.check.mjs
import assert from 'node:assert/strict'
import { triage, draft, highlight } from './triage.js'
import { LEADS } from './leads.js'

const t = (s) => triage(s)
assert.equal(t('The wardrobe hinge is broken, please come urgently').type, 'support')
assert.equal(t('The wardrobe hinge is broken, please come urgently').lane, 'now')
assert.equal(t('What would a home office makeover cost? No rush.').lane, 'week')
assert.equal(t('Cheap SEO, backlinks guaranteed').lane, 'filtered')
assert.equal(t('Hello, are you open on Sunday?').type, 'general')
assert.equal(t('I need a quote by friday for the kitchen').lane, 'today')
assert.equal(t('a recv issue').words.includes('cv'), false) // only matches at word starts
assert.equal(highlight('Kitchen is broken', ['broken', 'kitchen']), '<mark>Kitchen</mark> is <mark>broken</mark>')
assert.equal(highlight('it is leaking', ['leak']), 'it is <mark>leaking</mark>')
assert.ok(draft('Meera Shah', 'quote').startsWith('Hi Meera,'))
assert.ok(draft('Meera', 'billing', 'formal').startsWith('Dear Meera,'))
assert.equal(draft('X', 'spam'), '')
// every seeded lead lands where the demo expects it
for (const l of LEADS) assert.equal(triage(l.text).lane, l.expect, l.name)
console.log('pigeonhole triage: ok')
