import '@fontsource-variable/archivo/wdth.css'
import './style.css'
import { LEADS } from './leads.js'
import { LANES, triage, draft, highlight } from './triage.js'

const $ = (s) => document.querySelector(s)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const narrow = matchMedia('(max-width: 860px)')
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const LANE_NAME = Object.fromEntries(LANES)

const leads = []
let seq = 0
let openId = null
let tone = 'friendly'
let typing = 0
let replied = 0
let pipeline = Promise.resolve()

/* ---------- small helpers ---------- */
const hue = (name) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)
const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
const avatarStyle = (name) => `--h:${hue(name)}`
const ago = (at) => {
  const m = Math.round((Date.now() - at) / 60000)
  return m < 1 ? 'just now' : `${m} min ago`
}
const find = (id) => leads.find((l) => l.id === id)

let toastTimer
const toast = (text) => {
  $('#toast').textContent = text
  $('#toast').classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => $('#toast').classList.remove('is-on'), 2600)
}

/* ---------- lanes ---------- */
$('#lanes').innerHTML = LANES.map(
  ([id, label]) => `<section class="lane" data-lane="${id}" aria-label="${label}">
    <header class="lane__head"><i></i><h2>${label}</h2><span class="lane__count" data-count="${id}">0</span></header>
    <ul class="lane__list" data-list="${id}"><li class="lane__empty">Nothing here</li></ul>
  </section>`,
).join('')

const cardHTML = (l) => `<button type="button" class="card" data-id="${l.id}" data-lane="${l.tri.lane}" style="${avatarStyle(l.name)}">
  <span class="avatar" aria-hidden="true">${initials(l.name)}</span>
  <span class="card__main">
    <span class="card__top"><b>${esc(l.name)}</b><time>${ago(l.at)}</time></span>
    <span class="card__text">${esc(l.text)}</span>
    <span class="card__tags"><span class="tag">${l.tri.typeLabel}</span><span class="tag tag--lane">${LANE_NAME[l.tri.lane]}</span></span>
  </span>
  <span class="card__reading" aria-hidden="true">Reading…</span>
</button>`

const makeCard = (l) => {
  const li = document.createElement('li')
  li.innerHTML = cardHTML(l)
  return li
}

// highest score first within a lane
const placeIn = (li, l) => {
  const list = $(`[data-list="${l.tri.lane}"]`)
  const after = [...list.querySelectorAll('.card')].find((c) => find(Number(c.dataset.id)).tri.score < l.tri.score)
  list.insertBefore(li, after?.parentElement ?? null)
}

const refresh = () => {
  for (const [id] of LANES) {
    const n = leads.filter((l) => !l.done && l.tri.lane === id).length
    $(`[data-count="${id}"]`).textContent = n
    $(`[data-list="${id}"]`).classList.toggle('is-empty', !n)
  }
  $('#statSorted').textContent = leads.length
  $('#statOpen').textContent = leads.filter((l) => !l.done && l.tri.lane !== 'filtered').length
  $('#statDone').textContent = replied
  document.querySelectorAll('.card time').forEach((t) => (t.textContent = ago(find(Number(t.closest('.card').dataset.id)).at)))
}
setInterval(refresh, 30000)

const add = (src, at = Date.now()) => {
  const l = { id: ++seq, name: src.name, channel: src.channel, text: src.text, at, tri: triage(src.text), done: false }
  leads.push(l)
  return l
}

/* ---------- arrival: read in the chute, then fly to a lane ---------- */
async function arrive(src) {
  const l = add(src)
  const chute = $('#chute')
  const li = makeCard(l)
  li.querySelector('.card').classList.add('is-reading')
  chute.replaceChildren(li)
  await wait(1100)
  li.querySelector('.card').classList.replace('is-reading', 'is-sorted')
  await wait(800)

  // a fixed clone flies to the lane, so the lane's scroll box can't clip it
  const first = li.getBoundingClientRect()
  const ghost = li.firstElementChild.cloneNode(true)
  placeIn(li, l)
  // scroll only the lane (not the page) so the new card is visible
  const box = li.parentElement.getBoundingClientRect()
  const at = li.getBoundingClientRect()
  if (at.top < box.top || at.bottom > box.bottom) li.parentElement.scrollTop += at.top - box.top
  const last = li.getBoundingClientRect()
  chute.innerHTML = '<p class="chute__idle">Waiting for the next enquiry…</p>'
  refresh()
  if (!reduced) {
    li.style.visibility = 'hidden'
    ghost.classList.add('ghost')
    Object.assign(ghost.style, { left: `${last.left}px`, top: `${last.top}px`, width: `${last.width}px` })
    document.body.append(ghost)
    ghost
      .animate(
        [
          { transform: `translate(${first.left - last.left}px, ${first.top - last.top}px)`, width: `${first.width}px` },
          { transform: 'none', width: `${last.width}px` },
        ],
        { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' },
      )
      .finished.then(() => {
        ghost.remove()
        li.style.visibility = ''
      })
    $(`.lane[data-lane="${l.tri.lane}"]`).animate([{ backgroundColor: 'var(--glow)' }, { backgroundColor: 'transparent' }], { duration: 1200, delay: 300 })
  }
  await wait(700)
}
const enqueue = (src) => (pipeline = pipeline.then(() => arrive(src)))

/* ---------- the reader ---------- */
async function typeDraft(text) {
  const me = ++typing
  const box = $('#rDraft')
  box.value = ''
  for (const word of text.split(/(?<=\s)/)) {
    if (me !== typing) return
    box.value += word
    await wait(16)
  }
}

function open(id) {
  const l = find(id)
  if (!l) return
  openId = id
  document.querySelectorAll('.card').forEach((c) => c.classList.toggle('is-open', Number(c.dataset.id) === id))
  $('#readerEmpty').hidden = true
  $('#readerBody').hidden = false
  $('#rAvatar').textContent = initials(l.name)
  $('#rAvatar').setAttribute('style', avatarStyle(l.name))
  $('#rName').textContent = l.name
  $('#rSub').textContent = `${l.channel} · ${ago(l.at)}`
  const pips = Array.from({ length: 8 }, (_, i) => `<i${i < l.tri.score ? ' class="on"' : ''}></i>`).join('')
  $('#rTags').innerHTML = `<span class="tag">${l.tri.typeLabel}</span>
    <span class="tag tag--lane" data-lane="${l.tri.lane}">${LANE_NAME[l.tri.lane]}</span>
    <span class="meter" data-lane="${l.tri.lane}" aria-label="Urgency ${l.tri.score} of 8">${pips}</span>`
  $('#rText').innerHTML = highlight(esc(l.text), l.tri.words)
  $('#rWhy').innerHTML = l.tri.reasons.length
    ? l.tri.reasons.map(([w, p]) => `<li class="${p < 0 ? 'neg' : ''}"><b>${p > 0 ? '+' : ''}${p}</b>${w === l.tri.typeLabel ? `${esc(w)} enquiry` : `“${esc(w)}”`}</li>`).join('')
    : l.tri.type === 'spam'
      ? l.tri.words.map((w) => `<li class="neg"><b>✕</b>“${esc(w)}”</li>`).join('')
      : '<li><b>0</b>No rush signals, so it can wait</li>'
  const spam = l.tri.type === 'spam'
  $('#rReply').hidden = spam
  $('#rSpam').hidden = !spam
  $('#readerBody').classList.remove('is-in')
  void $('#readerBody').offsetWidth
  $('#readerBody').classList.add('is-in')
  if (!spam) typeDraft(draft(l.name, l.tri.type, tone))
}

$('#lanes').addEventListener('click', (e) => {
  const c = e.target.closest('.card')
  if (!c) return
  open(Number(c.dataset.id))
  if (narrow.matches) $('#reader').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
})

$('.tone').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tone]')
  if (!b || b.dataset.tone === tone) return
  tone = b.dataset.tone
  document.querySelectorAll('[data-tone]').forEach((x) => x.setAttribute('aria-checked', x === b))
  const l = find(openId)
  if (l) typeDraft(draft(l.name, l.tri.type, tone))
})

// next to open: most urgent lane first, then highest score
const next = () => {
  const order = LANES.map(([id]) => id)
  return leads.filter((l) => !l.done).sort((a, b) => order.indexOf(a.tri.lane) - order.indexOf(b.tri.lane) || b.tri.score - a.tri.score)[0]
}

async function close(l, message) {
  l.done = true
  typing++
  const li = $(`.card[data-id="${l.id}"]`)?.parentElement
  toast(message)
  refresh()
  if (li && !reduced) {
    li.style.overflow = 'hidden'
    await li.animate(
      [
        { opacity: 1, transform: 'none', height: `${li.offsetHeight}px` },
        { opacity: 0, transform: 'translateX(40px)', height: `${li.offsetHeight}px`, offset: 0.5 },
        { opacity: 0, transform: 'translateX(40px)', height: '0px', marginTop: '0px' },
      ],
      { duration: 520, easing: 'ease-in-out' },
    ).finished
  }
  li?.remove()
  refresh()
  const n = next()
  if (n) open(n.id)
  else {
    openId = null
    $('#readerBody').hidden = true
    $('#readerEmpty').hidden = false
  }
}

$('#send').addEventListener('click', () => {
  const l = find(openId)
  if (!l || l.done) return
  if (!$('#rDraft').value.trim()) return toast('Write a reply first')
  replied++
  close(l, `Reply to ${l.name.split(' ')[0]} sent (demo, nothing left this page)`)
})
$('#bin').addEventListener('click', () => {
  const l = find(openId)
  if (l && !l.done) close(l, 'Spam deleted')
})
$('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#rDraft').value)
    toast('Reply copied')
  } catch {
    $('#rDraft').select()
    toast('Press Ctrl+C to copy')
  }
})

/* ---------- test enquiry ---------- */
$('#try').addEventListener('submit', (e) => {
  e.preventDefault()
  const name = $('#tryName').value.trim()
  const text = $('#tryText').value.trim()
  if (!name || !text) return
  $('#tryText').value = ''
  toast('Sent. Watch it get sorted')
  $('.chute').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  enqueue({ name, channel: 'Website form', text })
})

/* ---------- start: three already sorted, the rest trickle in ---------- */
const queue = [...LEADS]
;[42, 18, 9].forEach((min) => {
  const l = add(queue.shift(), Date.now() - min * 60000)
  placeIn(makeCard(l), l)
})
refresh()
open(next().id)

const drip = () => (queue.length ? enqueue(queue.shift()) : clearInterval(demo))
const demo = setInterval(drip, 6500)
setTimeout(drip, 1800)
