import '@fontsource-variable/schibsted-grotesk/wght.css'
import '@fontsource-variable/newsreader/wght-italic.css'
import './style.css'
import { BUSINESSES } from './businesses.js'
import { answer } from './answer.js'

const $ = (s) => document.querySelector(s)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

const chat = $('#chat')
const msg = $('#msg')
let biz, faqs, gaps, stats, session, busy

/* ---------- business switcher ---------- */
$('#biz').innerHTML =
  '<span class="biz__pill" aria-hidden="true"></span>' +
  BUSINESSES.map((b) => `<button type="button" role="tab" data-biz="${b.id}"><span aria-hidden="true">${b.icon}</span>${b.kind}</button>`).join('')
const movePill = () => {
  const on = $('[data-biz][aria-selected="true"]')
  const pill = $('.biz__pill')
  pill.style.width = `${on.offsetWidth}px`
  pill.style.transform = `translateX(${on.offsetLeft}px)`
}
addEventListener('resize', movePill)
document.fonts.ready.then(movePill)

// glass cards: a soft glow follows the pointer
document.querySelectorAll('.brain, .widget, .stats, .how > div').forEach((el) => {
  el.classList.add('glass')
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  })
})
$('#biz').addEventListener('click', (e) => {
  const b = e.target.closest('[data-biz]')
  if (b && b.dataset.biz !== biz.id) load(b.dataset.biz)
})

function load(id) {
  biz = BUSINESSES.find((b) => b.id === id)
  faqs = biz.faqs.map((f) => ({ ...f }))
  gaps = []
  stats = { answered: 0, leads: 0, times: [] }
  session = Symbol(id) // stale replies from the previous business check this and stop
  busy = false
  document.documentElement.style.setProperty('--accent', biz.accent)
  document.querySelectorAll('[data-biz]').forEach((b) => b.setAttribute('aria-selected', b.dataset.biz === id))
  movePill()
  $('#bizName').textContent = biz.name
  $('#avatar').textContent = biz.icon
  chat.innerHTML = ''
  renderFaqs()
  renderGaps()
  renderStats()
  renderSuggest()
  botSay(biz.hello)
}

/* ---------- knowledge panel ---------- */
function renderFaqs(hitIndex = -1, newIndex = -1) {
  $('#faqCount').textContent = `${faqs.length} answers`
  $('#faqs').innerHTML = faqs
    .map((f, i) => `<li class="faq${i === hitIndex ? ' is-hit' : ''}${i === newIndex ? ' is-new' : ''}" data-i="${i}"><h4>${esc(f.q)}</h4><p>${esc(f.a)}</p></li>`)
    .join('')
  // scroll only the list, never the page, so the chat stays in view on phones
  const el = $(`.faq[data-i="${hitIndex >= 0 ? hitIndex : newIndex}"]`)
  const list = $('#faqs')
  if (el) list.scrollTo({ top: el.offsetTop - list.offsetTop - 8, behavior: reduced ? 'auto' : 'smooth' })
}

function renderGaps() {
  $('#gaps').hidden = !gaps.length
  $('#gapList').innerHTML = gaps.map((q, i) => `<li><span>“${esc(q)}”</span><button type="button" data-gap="${i}">Teach an answer</button></li>`).join('')
}
$('#gapList').addEventListener('click', (e) => {
  const b = e.target.closest('[data-gap]')
  if (!b) return
  $('#teachQ').value = gaps[+b.dataset.gap]
  $('#teachA').focus()
  $('#teach').classList.add('is-flash')
  setTimeout(() => $('#teach').classList.remove('is-flash'), 1200)
})

$('#teach').addEventListener('submit', (e) => {
  e.preventDefault()
  const q = $('#teachQ').value.trim()
  const a = $('#teachA').value.trim()
  if (!q || !a) return (q ? $('#teachA') : $('#teachQ')).focus()
  faqs.push({ q, a, keys: '' })
  gaps = gaps.filter((g) => g.toLowerCase() !== q.toLowerCase())
  $('#teachQ').value = $('#teachA').value = ''
  renderFaqs(-1, faqs.length - 1)
  renderGaps()
  botSay(`Got it. I can now answer “${q}”. Try asking me.`)
})

/* ---------- stats ---------- */
function renderStats(bump) {
  $('#statAnswered').textContent = stats.answered
  $('#statLeads').textContent = stats.leads
  const t = stats.times
  $('#statSpeed').textContent = t.length ? `${(t.reduce((a, b) => a + b, 0) / t.length / 1000).toFixed(1)}s` : '–'
  if (bump) {
    const el = $(bump)
    el.classList.remove('is-bump')
    void el.offsetWidth
    el.classList.add('is-bump')
  }
}

/* ---------- chat ---------- */
function renderSuggest() {
  $('#suggest').innerHTML = biz.ask.map((q) => `<button type="button">${esc(q)}</button>`).join('')
}
$('#suggest').addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (b) ask(b.textContent)
})

const bubble = (cls, html) => {
  const el = document.createElement('div')
  el.className = `msg msg--${cls}`
  el.innerHTML = html
  chat.append(el)
  chat.scrollTop = chat.scrollHeight
  return el
}

// types the reply out word by word, like a streamed answer
async function botSay(text, extra = '') {
  const s = session
  const el = bubble('bot', '')
  const words = text.split(' ')
  for (let i = 0; i < words.length; i++) {
    if (s !== session) return
    el.textContent = words.slice(0, i + 1).join(' ')
    chat.scrollTop = chat.scrollHeight
    await wait(22)
  }
  if (extra) el.insertAdjacentHTML('beforeend', extra)
  chat.scrollTop = chat.scrollHeight
  return el
}

async function ask(text) {
  const q = text.trim()
  if (!q || busy) return
  busy = true
  const s = session
  const started = performance.now()
  bubble('you', esc(q))
  msg.value = ''
  const dots = bubble('bot', `<span class="thinking"><span class="typing" aria-hidden="true"><i></i><i></i><i></i></span><span>Searching ${faqs.length} answers…</span></span>`)
  dots.style.padding = '0'
  const brain = $('.brain')
  brain.style.setProperty('--scan-h', `${$('.faqs-wrap').offsetHeight}px`)
  brain.classList.add('is-scanning')
  await wait(900 + Math.random() * 500)
  brain.classList.remove('is-scanning')
  if (s !== session) return
  dots.remove()

  const res = answer(q, faqs)
  if (res.kind === 'answer') {
    const i = faqs.indexOf(res.faq)
    renderFaqs(i)
    await botSay(res.faq.a, `<br><button class="src" type="button" data-src="${i}">From: ${esc(res.faq.q)}</button>`)
    stats.answered++
    stats.times.push(performance.now() - started)
    renderStats('#statAnswered')
  } else if (res.kind === 'greeting') {
    await botSay(biz.hello)
  } else {
    if (res.kind === 'unknown' && !gaps.includes(q)) gaps.push(q)
    renderGaps()
    renderFaqs()
    const intro = res.kind === 'human' ? 'Sure, I will get someone from the team.' : "I don't have that answer yet, so I'll pass it to the team."
    const el = await botSay(
      `${intro} Where can they reach you?`,
      '<form class="lead"><input placeholder="Phone or email" aria-label="Phone or email" autocomplete="off" /><button type="submit">Send</button></form>',
    )
    if (el) wireLead($('.lead', el), q)
  }
  if (s === session) busy = false
}

function wireLead(form, q) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = form.querySelector('input')
    const v = input.value.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && !/^\+?[\d\s-]{8,15}$/.test(v)) {
      input.value = ''
      input.placeholder = 'Enter a valid phone or email'
      return input.focus()
    }
    form.classList.add('lead--done')
    bubble('you', esc(v))
    stats.leads++
    renderStats('#statLeads')
    await botSay(`Thanks! The team at ${biz.name} will get back to you about “${q}”. (Demo: nothing was sent.)`)
  })
}

chat.addEventListener('click', (e) => {
  const b = e.target.closest('[data-src]')
  if (b) renderFaqs(+b.dataset.src)
})
$('#compose').addEventListener('submit', (e) => {
  e.preventDefault()
  ask(msg.value)
})

/* ---------- start, with one example question asked for the visitor ---------- */
load(BUSINESSES[0].id)
let touched = false
;['pointerdown', 'keydown'].forEach((t) => addEventListener(t, () => (touched = true), { once: true }))
if (!reduced) {
  setTimeout(async () => {
    if (touched) return
    const q = biz.ask[0]
    for (let i = 1; i <= q.length; i++) {
      if (touched) return (msg.value = '')
      msg.value = q.slice(0, i)
      await wait(55)
    }
    ask(q)
  }, 1600)
}
