// Self-check for the job workflow: node templates/kaarigar/jobs.check.mjs
import assert from 'node:assert/strict'
import { nextStage, advance, invoiceStep, missing } from './jobs.js'

const job = { id: 1, stage: 'new', tech: null, checks: [false, false], photo: null, signed: false, invoice: null }
assert.equal(nextStage(job), null) // can't schedule without a technician
job.tech = 'ravi'
advance(job)
assert.equal(job.stage, 'scheduled')
advance(job)
advance(job)
assert.equal(job.stage, 'onsite')
assert.deepEqual(missing(job), ['checklist', 'photo', 'signature'])
assert.throws(() => advance(job)) // proof of work is required
assert.throws(() => invoiceStep(job)) // no invoice before the work is done
job.checks = [true, true]
job.photo = 'blob:x'
job.signed = true
advance(job)
assert.equal(job.stage, 'done')
assert.equal(job.invoice, 'draft')
invoiceStep(job)
invoiceStep(job)
assert.equal(job.invoice, 'paid')
assert.throws(() => invoiceStep(job))
assert.equal(nextStage(job), null)
console.log('kaarigar jobs: ok')
