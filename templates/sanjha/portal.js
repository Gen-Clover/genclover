// Project state rules for the client portal: approvals move the timeline on.

export const MILESTONES = [
  { id: 'kickoff', name: 'Kickoff', date: '2 Oct' },
  { id: 'mood', name: 'Moodboard', date: '9 Oct' },
  { id: 'labels', name: 'Label concepts', date: '23 Oct' },
  { id: 'web', name: 'Website design', date: '6 Nov' },
  { id: 'build', name: 'Build', date: '27 Nov' },
  { id: 'launch', name: 'Launch', date: '8 Dec' },
]

// a milestone is done when every approval attached to it is approved
function stageOf(milestone, approvals) {
  const own = approvals.filter((a) => a.milestone === milestone.id)
  if (own.every((a) => a.status === 'approved')) return 'done'
  return own.some((a) => a.status === 'changes') ? 'changes' : 'review'
}

// walk the timeline in order: everything up to the first unfinished milestone is done
export function timeline(milestones, approvals, startedUpTo) {
  let open = false
  return milestones.map((m, i) => {
    if (open) return { ...m, stage: 'todo' }
    const hasApprovals = approvals.some((a) => a.milestone === m.id)
    const stage = hasApprovals ? stageOf(m, approvals) : i <= startedUpTo ? 'done' : 'current'
    if (stage !== 'done') open = true
    return { ...m, stage }
  })
}

export const progress = (line) => Math.round((line.filter((m) => m.stage === 'done').length / line.length) * 100)

export function decide(approvals, id, verdict, note = '') {
  const a = approvals.find((x) => x.id === id)
  if (!a || a.status === 'approved') throw new Error(`approval ${id} is closed`)
  if (verdict === 'changes' && !note.trim()) throw new Error('say what to change')
  a.status = verdict
  a.note = note.trim()
  return a
}

export const fileSize = (bytes) => (bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1048576).toFixed(1)} MB`)
