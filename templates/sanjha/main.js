import '@fontsource-variable/bodoni-moda/wght.css'
import '@fontsource-variable/hanken-grotesk/wght.css'
import './style.css'
import { MILESTONES, timeline, progress, decide, fileSize } from './portal.js'

const $ = (s) => document.querySelector(s)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const STARTED_UP_TO = 1 // kickoff and moodboard happened before the demo opens

let toastTimer
const toast = (msg) => {
  $('#toast').textContent = msg
  $('#toast').classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => $('#toast').classList.remove('is-on'), 2800)
}

/* ---------- previews, drawn in SVG ---------- */
const jar = (lid, label, ink, name) => `<svg viewBox="0 0 200 150" aria-hidden="true">
  <rect width="200" height="150" fill="${label}" opacity=".18"/>
  <rect x="70" y="18" width="60" height="18" rx="4" fill="${lid}"/>
  <path d="M64 40h72c6 0 10 4 10 10v76c0 8-6 14-14 14H68c-8 0-14-6-14-14V50c0-6 4-10 10-10z" fill="#f4efe6"/>
  <rect x="54" y="66" width="92" height="46" fill="${label}"/>
  <circle cx="100" cy="80" r="7" fill="${ink}"/>
  <text x="100" y="102" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="${ink}">${name}</text>
</svg>`
const page = (accent) => `<svg viewBox="0 0 200 150" aria-hidden="true">
  <rect width="200" height="150" fill="#efe8dc"/>
  <rect x="20" y="14" width="160" height="122" rx="6" fill="#fffdf8"/>
  <rect x="20" y="14" width="160" height="16" rx="6" fill="#1f1b17"/>
  <rect x="32" y="42" width="70" height="10" rx="2" fill="#1f1b17"/>
  <rect x="32" y="58" width="50" height="6" rx="2" fill="#b9ae9c"/>
  <rect x="32" y="72" width="34" height="12" rx="6" fill="${accent}"/>
  <rect x="112" y="40" width="56" height="50" rx="4" fill="${accent}" opacity=".35"/>
  <rect x="32" y="100" width="40" height="26" rx="3" fill="#e9e1d3"/><rect x="80" y="100" width="40" height="26" rx="3" fill="#e9e1d3"/><rect x="128" y="100" width="40" height="26" rx="3" fill="#e9e1d3"/>
</svg>`

/* ---------- state ---------- */
const approvals = [
  { id: 'labelA', milestone: 'labels', title: 'Label concept A · Sunrise', by: 'Arjun', version: 1, status: 'pending', art: () => jar('#c9852c', '#f2b544', '#3b2a12', 'MARIGOLD') },
  { id: 'labelB', milestone: 'labels', title: 'Label concept B · Field', by: 'Arjun', version: 1, status: 'pending', art: (v) => jar('#4b6b4f', v > 1 ? '#a8c49a' : '#c9d6bf', '#24321f', 'MARIGOLD') },
  { id: 'home', milestone: 'web', title: 'Homepage design', by: 'Meher', version: 1, status: 'pending', art: () => page('#e0673f') },
]
// approvals only show up once the studio has delivered them
const delivered = new Set(['labelA', 'labelB'])

const files = [
  { name: 'Brand guidelines.pdf', size: 4404019, by: 'Inkpot', when: '28 Sep', v: 3 },
  { name: 'Moodboard.pdf', size: 8178892, by: 'Inkpot', when: '9 Oct', v: 2, tag: 'Approved' },
  { name: 'Label concepts.pdf', size: 6081740, by: 'Inkpot', when: '21 Oct', v: 1, tag: 'In review' },
  { name: 'Product photos.zip', size: 52428800, by: 'You', when: '15 Oct', v: 1 },
  { name: 'Ingredient list.xlsx', size: 38912, by: 'You', when: '16 Oct', v: 1 },
]

const PEOPLE = { Arjun: { hue: 200, role: 'Designer' }, Meher: { hue: 330, role: 'Project lead' }, You: { hue: 28 } }
const messages = [
  { who: 'Meher', text: 'Morning Nisha! Moodboard is signed off, thanks for the quick turnaround.', when: 'Mon' },
  { who: 'You', text: 'Loved it. The team is excited about the warmer palette.', when: 'Mon' },
  { who: 'Arjun', text: "Both label concepts are up for review. A is bolder for shelf impact, B is calmer and more 'field fresh'. Approve one or both, and tell us what to change.", when: '10:12' },
]

/* ---------- render ---------- */
function renderTimeline() {
  const line = timeline(MILESTONES, approvals.filter((a) => delivered.has(a.id)), STARTED_UP_TO)
  const pct = progress(line)
  const idx = line.findIndex((m) => m.stage !== 'done')
  $('#steps').innerHTML = line
    .map((m) => `<li class="is-${m.stage}"><i aria-hidden="true">${m.stage === 'done' ? '✓' : ''}</i><b>${m.name}</b><small>${m.date}</small>${m.stage === 'review' ? '<em>Needs you</em>' : m.stage === 'changes' ? '<em>Changes asked</em>' : ''}</li>`)
    .join('')
  const reached = idx < 0 ? line.length - 1 : idx
  $('#trackFill').style.width = `${(reached / (line.length - 1)) * 100}%`
  $('#pct').textContent = `${pct}%`
  $('#ringBar').style.strokeDashoffset = 327 * (1 - pct / 100)
  const waiting = approvals.filter((a) => delivered.has(a.id) && a.status === 'pending').length
  const cur = line[reached]
  $('#heroSub').innerHTML = idx < 0 ? 'All done. Launched!' : `Now: <b>${cur.name}</b> · due ${cur.date}${waiting ? ` · <span class="hl">${waiting} waiting for your approval</span>` : ''}`
}

const STATUS = { pending: 'Ready for review', changes: 'Changes requested', approved: 'Approved' }
function renderApprovals() {
  const list = approvals.filter((a) => delivered.has(a.id) && a.status !== 'approved')
  $('#approvalCount').textContent = list.filter((a) => a.status === 'pending').length || ''
  $('#approvals').innerHTML = list.length
    ? list
        .map(
          (a) => `<article class="appr is-${a.status}" data-appr="${a.id}">
        <div class="appr__art">${a.art(a.version)}<span class="v">v${a.version}</span></div>
        <div class="appr__body">
          <h3>${a.title}</h3>
          <p class="appr__meta">${STATUS[a.status]} · from ${a.by}</p>
          ${
            a.status === 'changes'
              ? `<p class="appr__note">“${esc(a.note)}”</p><p class="appr__wait"><i></i>Studio is working on v${a.version + 1}</p>`
              : `<div class="appr__acts">
                <button type="button" class="btn" data-act="approve">Approve</button>
                <button type="button" class="btn btn--ghost" data-act="ask">Request changes</button>
              </div>
              <form class="appr__ask" data-ask hidden><textarea rows="2" maxlength="300" placeholder="What should change?" aria-label="What should change"></textarea><button class="btn" type="submit">Send to studio</button></form>`
          }
        </div>
      </article>`,
        )
        .join('')
    : `<div class="empty"><span>✓</span><p>Nothing waiting for you.</p><small>New work from the studio shows up here.</small></div>`
}

const icon = (name) => {
  const ext = name.split('.').pop().toLowerCase()
  const kind = ext === 'pdf' ? 'pdf' : ['zip', 'rar'].includes(ext) ? 'zip' : ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) ? 'img' : ['xlsx', 'csv', 'xls'].includes(ext) ? 'sheet' : 'doc'
  return `<span class="ficon is-${kind}" aria-hidden="true">${ext.slice(0, 4).toUpperCase()}</span>`
}
function renderFiles() {
  $('#files').innerHTML = files
    .map(
      (f, i) => `<li class="${f.fresh ? 'is-fresh' : ''}${f.uploading ? ' is-up' : ''}">${icon(f.name)}
      <span class="file__main"><b>${esc(f.name)}</b><small>${f.uploading ? 'Uploading…' : `${fileSize(f.size)} · ${f.by === 'You' ? 'you' : f.by} · ${f.when}`}</small>${f.uploading ? '<i class="bar"><i></i></i>' : ''}</span>
      <span class="file__tags">${f.v > 1 ? `<em>v${f.v}</em>` : ''}${f.tag ? `<em class="${f.tag === 'Approved' ? 'ok' : ''}">${f.tag}</em>` : ''}</span>
    </li>`,
    )
    .join('')
  files.forEach((f) => delete f.fresh)
}

const ava = (who) => `<span class="ava" style="--h:${PEOPLE[who].hue}" aria-hidden="true">${who === 'You' ? 'NK' : who.slice(0, 2).toUpperCase()}</span>`
function renderThread() {
  $('#thread').innerHTML = messages
    .map((m) =>
      m.typing
        ? `<li class="msg">${ava(m.who)}<div class="bubble typing"><i></i><i></i><i></i></div></li>`
        : `<li class="msg${m.who === 'You' ? ' is-me' : ''}${m.fresh ? ' is-fresh' : ''}">${m.who === 'You' ? '' : ava(m.who)}<div class="bubble">${m.who === 'You' ? '' : `<b>${m.who} <small>${PEOPLE[m.who].role}</small></b>`}<p>${esc(m.text)}</p><time>${m.when}</time></div></li>`,
    )
    .join('')
  messages.forEach((m) => delete m.fresh)
  $('#thread').scrollTop = $('#thread').scrollHeight
}

const clock = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
async function studioSays(who, text, delay = 1300) {
  const typing = { who, typing: true }
  messages.push(typing)
  renderThread()
  await wait(delay)
  messages.splice(messages.indexOf(typing), 1, { who, text, when: clock(), fresh: true })
  renderThread()
}

function renderAll() {
  renderTimeline()
  renderApprovals()
  renderFiles()
  renderThread()
}

/* ---------- approvals ---------- */
$('#approvals').addEventListener('click', async (e) => {
  const card = e.target.closest('[data-appr]')
  const act = e.target.closest('[data-act]')?.dataset.act
  if (!card || !act) return
  const a = approvals.find((x) => x.id === card.dataset.appr)
  if (act === 'ask') {
    const form = card.querySelector('[data-ask]')
    form.hidden = !form.hidden
    if (!form.hidden) form.querySelector('textarea').focus()
    return
  }
  decide(approvals, a.id, 'approved')
  const file = files.find((f) => f.name.startsWith(a.milestone === 'labels' ? 'Label' : 'Homepage'))
  if (file && approvals.filter((x) => x.milestone === a.milestone).every((x) => x.status === 'approved')) file.tag = 'Approved'
  if (!reduced) await card.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.03)', opacity: 1, offset: 0.3 }, { transform: 'translateX(60px)', opacity: 0 }], { duration: 520, easing: 'ease-in' }).finished
  toast(`${a.title} approved`)
  renderAll()
  afterApproval(a)
})

$('#approvals').addEventListener('submit', async (e) => {
  e.preventDefault()
  const card = e.target.closest('[data-appr]')
  const a = approvals.find((x) => x.id === card.dataset.appr)
  const note = e.target.querySelector('textarea').value
  if (!note.trim()) return e.target.querySelector('textarea').focus()
  decide(approvals, a.id, 'changes', note)
  messages.push({ who: 'You', text: `Changes on ${a.title}: ${note.trim()}`, when: clock(), fresh: true })
  renderAll()
  await studioSays(a.by, `Got it, thanks Nisha. Working on v${a.version + 1} now.`)
  // the studio comes back with a new version
  await wait(5000)
  a.version++
  a.status = 'pending'
  a.note = ''
  files.unshift({ name: `${a.title.split(' · ')[0]} v${a.version}.pdf`, size: 2400000 + a.version * 310000, by: 'Inkpot', when: 'Today', v: a.version, tag: 'In review', fresh: true })
  toast(`v${a.version} of ${a.title} is ready`)
  renderAll()
  studioSays(a.by, `v${a.version} is up with your changes. Have a look when you can.`)
})

async function afterApproval(a) {
  const left = approvals.filter((x) => x.milestone === a.milestone && x.status !== 'approved')
  if (left.length) return studioSays(a.by, `Thanks! Noted the approval on ${a.title.split(' · ')[1] ?? a.title}.`)
  const m = MILESTONES.find((x) => x.id === a.milestone)
  await studioSays('Meher', `${m.name} signed off. We're moving on to the next stage.`)
  // after labels, the homepage design lands for review
  if (a.milestone === 'labels' && !delivered.has('home')) {
    await wait(2500)
    delivered.add('home')
    files.unshift({ name: 'Homepage design.pdf', size: 3984588, by: 'Inkpot', when: 'Today', v: 1, tag: 'In review', fresh: true })
    toast('New for review: Homepage design')
    renderAll()
    studioSays('Meher', 'Homepage design is ready for your review. It uses the label palette you approved.')
  }
}

/* ---------- files ---------- */
async function share(list) {
  const added = [...list].slice(0, 6).map((f) => ({ name: f.name, size: f.size, by: 'You', when: 'Today', v: 1, uploading: true, fresh: true }))
  if (!added.length) return
  files.unshift(...added)
  renderFiles()
  await wait(1400)
  added.forEach((f) => (f.uploading = false))
  renderFiles()
  toast(`${added.length} file${added.length > 1 ? 's' : ''} shared with Inkpot Studio`)
  studioSays('Arjun', `Got ${added.length > 1 ? 'the files' : added[0].name}, thanks!`, 1600)
}
$('#upload').addEventListener('change', (e) => {
  share(e.target.files)
  e.target.value = ''
})
const drop = $('#drop')
drop.addEventListener('dragover', (e) => {
  e.preventDefault()
  drop.classList.add('is-over')
})
drop.addEventListener('dragleave', () => drop.classList.remove('is-over'))
drop.addEventListener('drop', (e) => {
  e.preventDefault()
  drop.classList.remove('is-over')
  share(e.dataTransfer.files)
})

/* ---------- messages ---------- */
const REPLIES = [
  [/launch|date|when|deadline|timeline/i, 'Meher', "We're on track: build starts once the homepage is approved, and launch is planned for 8 Dec."],
  [/invoice|bill|payment|cost|price/i, 'Meher', "I'll share the next invoice in Files once this stage closes. Nothing due right now."],
  [/call|meet|chat/i, 'Meher', 'Happy to. Does Thursday 4 pm work for a 20-minute call?'],
]
$('#compose').addEventListener('submit', (e) => {
  e.preventDefault()
  const text = $('#msg').value.trim()
  if (!text) return
  messages.push({ who: 'You', text, when: clock(), fresh: true })
  $('#msg').value = ''
  renderThread()
  const [, who, reply] = REPLIES.find(([re]) => re.test(text)) ?? [null, 'Arjun', "Thanks, noted! We'll get back to you on this today."]
  studioSays(who, reply, 1600)
})

renderAll()
