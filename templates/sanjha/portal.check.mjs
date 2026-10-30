// Self-check for the portal rules: node templates/sanjha/portal.check.mjs
import assert from 'node:assert/strict'
import { MILESTONES, timeline, progress, decide, fileSize } from './portal.js'

const approvals = [
  { id: 'a', milestone: 'labels', status: 'pending' },
  { id: 'b', milestone: 'labels', status: 'pending' },
  { id: 'c', milestone: 'web', status: 'pending' },
]
let line = timeline(MILESTONES, approvals, 1)
assert.deepEqual(line.map((m) => m.stage), ['done', 'done', 'review', 'todo', 'todo', 'todo'])
assert.equal(progress(line), 33)

assert.throws(() => decide(approvals, 'a', 'changes', '  ')) // changes need a note
decide(approvals, 'a', 'changes', 'Warmer green please')
assert.equal(timeline(MILESTONES, approvals, 1)[2].stage, 'changes')

decide(approvals, 'a', 'approved')
decide(approvals, 'b', 'approved')
assert.throws(() => decide(approvals, 'b', 'changes', 'x')) // approved is final
line = timeline(MILESTONES, approvals, 1)
assert.deepEqual(line.map((m) => m.stage).slice(2, 5), ['done', 'review', 'todo'])
assert.equal(progress(line), 50)

decide(approvals, 'c', 'approved')
line = timeline(MILESTONES, approvals, 1)
assert.equal(line[4].stage, 'current') // build starts once design is signed off

assert.equal(fileSize(900), '900 B')
assert.equal(fileSize(2.5 * 1048576), '2.5 MB')
console.log('sanjha portal: ok')
