import '@fontsource/lexend/400.css'
import '@fontsource/lexend/500.css'
import '@fontsource/lexend/600.css'
import '@fontsource/lexend/700.css'
import './style.css'
import { DOCTORS, REASONS, toMin, fromMin, label, availability, firstFree, tokenOf, queueFor, validPhone } from './clinic.js'

const $ = (s) => document.querySelector(s)
const $$ = (s) => [...document.querySelectorAll(s)]
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const docById = (id) => DOCTORS.find((d) => d.id === id)
const initials = (name) => name.replace(/^Dr\.\s*/, '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('')

// demo clock: the clinic day is always mid-morning, so there is something to see
let now = toMin('10:40')
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() + i)
  return { date: iso(d), wd: d.toLocaleDateString('en-IN', { weekday: 'short' }), day: d.getDate(), mon: d.toLocaleDateString('en-IN', { month: 'short' }), closed: d.getDay() === 0, i }
})
const TODAY = DAYS[0].date
const dayName = (date) => {
  const d = DAYS.find((x) => x.date === date)
  return d.i === 0 ? 'Today' : d.i === 1 ? 'Tomorrow' : `${d.wd}, ${d.day} ${d.mon}`
}
const nowFor = (date) => (date === TODAY ? now : null)

/* ---------- seed bookings ---------- */
let seq = 0
const bookings = []
const seed = (doctor, time, name, reason, status, date = TODAY) => bookings.push({ id: ++seq, doctor, date, time, name, phone: '98XXXXXX10', reason, status })
;[
  ['mehta', '09:00', 'Kavya Nair', 'Fever or cold', 'done'],
  ['mehta', '09:15', 'Rohan Gupta', 'Report review', 'done'],
  ['mehta', '09:45', 'Imran Sheikh', 'Follow-up visit', 'noshow'],
  ['mehta', '10:00', 'Pooja Desai', 'Fever or cold', 'done'],
  ['mehta', '10:15', 'Arvind Pillai', 'Report review', 'in'],
  ['mehta', '10:30', 'Sneha Kulkarni', 'Fever or cold', 'arrived'],
  ['mehta', '10:45', 'Manoj Yadav', 'Follow-up visit', 'arrived'],
  ['mehta', '11:30', 'Farah Ali', 'Something else', 'booked'],
  ['mehta', '12:15', 'Gaurav Bose', 'Fever or cold', 'booked'],
  ['khan', '10:00', 'Baby Aarav', 'Child check-up', 'done'],
  ['khan', '10:20', 'Myra Joshi', 'Fever or cold', 'in'],
  ['khan', '10:40', 'Vihaan Rao', 'Child check-up', 'arrived'],
  ['khan', '11:00', 'Anika Sen', 'Follow-up visit', 'booked'],
  ['khan', '12:40', 'Kabir Malhotra', 'Child check-up', 'booked'],
  ['iyer', '09:30', 'Tanvi Shah', 'Skin concern', 'done'],
  ['iyer', '10:00', 'Neil Fernandes', 'Skin concern', 'done'],
  ['iyer', '10:30', 'Divya Menon', 'Follow-up visit', 'in'],
  ['iyer', '11:00', 'Harsh Vora', 'Skin concern', 'arrived'],
  ['iyer', '12:30', 'Leena Thomas', 'Skin concern', 'booked'],
].forEach((b) => seed(...b))
const tomorrow = DAYS.find((d) => d.i >= 1 && !d.closed).date
seed('mehta', '09:30', 'Sameer Khanna', 'Follow-up visit', 'booked', tomorrow)
seed('iyer', '10:30', 'Riya Batra', 'Skin concern', 'booked', tomorrow)

/* ---------- shared bits ---------- */
const avatar = (doc, cls = '') => `<span class="ava ${cls}" style="--h:${doc.hue}" aria-hidden="true">${initials(doc.name)}</span>`
let toastTimer
const toast = (msg) => {
  $('#toast').textContent = msg
  $('#toast').classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => $('#toast').classList.remove('is-on'), 2800)
}
const badges = { desk: 0, doctor: 0 }
const bump = (view) => {
  if (view === current) return
  badges[view]++
  const b = $(`[data-badge="${view}"]`)
  b.textContent = badges[view]
  b.hidden = false
  b.classList.remove('is-pop')
  void b.offsetWidth
  b.classList.add('is-pop')
}

const tickClock = () => ($('#clock').textContent = `Demo clock · ${label(fromMin(now))}`)
tickClock()

/* ---------- view switching ---------- */
let current = 'patient'
const movePill = () => {
  const on = $('[data-view][aria-selected="true"]')
  const pill = $('.roles__pill')
  pill.style.width = `${on.offsetWidth}px`
  pill.style.transform = `translateX(${on.offsetLeft}px)`
}
const show = (view) => {
  current = view
  $$('[data-view]').forEach((b) => b.setAttribute('aria-selected', b.dataset.view === view))
  $$('.view').forEach((v) => (v.hidden = v.id !== view))
  if (badges[view]) {
    badges[view] = 0
    $(`[data-badge="${view}"]`).hidden = true
  }
  movePill()
  render()
}
$('#roles').addEventListener('click', (e) => {
  const b = e.target.closest('[data-view]')
  if (b) show(b.dataset.view)
})
addEventListener('resize', movePill)
document.fonts.ready.then(movePill)

/* ---------- patient ---------- */
const pick = { doc: null, date: TODAY, time: null, reason: null }
let lastBooking = null

$('#reasons').innerHTML = REASONS.map((r) => `<button type="button" role="radio" aria-checked="false" data-reason="${r}">${r}</button>`).join('')

function renderPatient() {
  $('#docs').innerHTML = DOCTORS.map((doc) => {
    const free = firstFree(doc, pick.date, bookings, nowFor(pick.date))
    return `<button type="button" class="doc${pick.doc === doc.id ? ' is-on' : ''}" data-doc="${doc.id}" style="--h:${doc.hue}">
      ${avatar(doc)}
      <span><b>${doc.name}</b><small>${doc.role}</small></span>
      <em>${free ? `Next free ${label(free)}` : 'Full on this day'}</em>
    </button>`
  }).join('')

  $('#days').innerHTML = DAYS.map(
    (d) => `<button type="button" class="day${pick.date === d.date ? ' is-on' : ''}" data-date="${d.date}" ${d.closed ? 'disabled' : ''}>
      <small>${d.i === 0 ? 'Today' : d.wd}</small><b>${d.day}</b><small>${d.closed ? 'Closed' : d.mon}</small>
    </button>`,
  ).join('')

  const doc = docById(pick.doc)
  if (!doc) {
    $('#slots').innerHTML = '<p class="muted">Choose a doctor to see open times.</p>'
  } else {
    const all = availability(doc, pick.date, bookings, nowFor(pick.date)).filter((s) => !s.past)
    const group = (name, list) =>
      list.length
        ? `<div class="slot-group"><p>${name}</p><div>${list
            .map((s) => `<button type="button" class="slot${pick.time === s.time ? ' is-on' : ''}" data-time="${s.time}" ${s.taken ? 'disabled aria-label="' + label(s.time) + ', booked"' : ''}>${label(s.time)}</button>`)
            .join('')}</div></div>`
        : ''
    const html = group('Morning', all.filter((s) => toMin(s.time) < 720)) + group('Afternoon', all.filter((s) => toMin(s.time) >= 720))
    $('#slots').innerHTML = html || '<p class="muted">No times left on this day. Try another day.</p>'
  }
  $$('[data-reason]').forEach((b) => b.setAttribute('aria-checked', b.dataset.reason === pick.reason))
  renderTicket()
}

function renderTicket() {
  const b = lastBooking
  const doc = docById(b?.doctor ?? pick.doc)
  $('#ticket').classList.toggle('is-booked', !!b)
  $('#tState').textContent = b ? 'Booked' : 'Your visit'
  $('#tDoc').textContent = doc ? doc.name : '—'
  $('#tDay').textContent = b ? dayName(b.date) : pick.doc ? dayName(pick.date) : '—'
  $('#tTime').textContent = b ? label(b.time) : pick.time ? label(pick.time) : '—'
  $('#tToken').hidden = !b
  $('#again').hidden = !b
  if (b) {
    $('#tTokenNo').textContent = tokenOf(b, bookings)
    $('#tRoom').textContent = `${doc.room} · ${b.status === 'cancelled' ? 'Cancelled by the clinic' : 'arrive 10 minutes early'}`
  }
  $('#tHint').textContent = b ? `Booked for ${b.name}. Show this token at the front desk.` : 'Choose a doctor, day and time to see your visit here.'
}

$('#docs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-doc]')
  if (!b) return
  pick.doc = b.dataset.doc
  pick.time = null
  renderPatient()
})
$('#days').addEventListener('click', (e) => {
  const b = e.target.closest('[data-date]')
  if (!b) return
  pick.date = b.dataset.date
  pick.time = null
  renderPatient()
})
$('#slots').addEventListener('click', (e) => {
  const b = e.target.closest('[data-time]')
  if (!b) return
  pick.time = b.dataset.time
  renderPatient()
})
$('#reasons').addEventListener('click', (e) => {
  const b = e.target.closest('[data-reason]')
  if (!b) return
  pick.reason = b.dataset.reason
  renderPatient()
})

$('#details').addEventListener('submit', (e) => {
  e.preventDefault()
  const name = $('#pName').value.trim()
  const phone = $('#pPhone').value.trim()
  const err =
    !pick.doc ? 'Choose a doctor first.' : !pick.time ? 'Pick a time.' : name.length < 2 ? 'Enter your name.' : !validPhone(phone) ? 'Enter a 10-digit mobile number.' : !pick.reason ? 'Choose a reason for the visit.' : ''
  $('#pError').textContent = err
  if (err) return
  // someone else may have taken the slot since it was picked
  if (availability(docById(pick.doc), pick.date, bookings).find((s) => s.time === pick.time)?.taken) {
    $('#pError').textContent = 'That time was just taken. Please pick another.'
    pick.time = null
    return renderPatient()
  }
  lastBooking = { id: ++seq, doctor: pick.doc, date: pick.date, time: pick.time, name, phone, reason: pick.reason, status: 'booked', fresh: true }
  bookings.push(lastBooking)
  deskDate = pick.date
  selected = lastBooking.id
  bump('desk')
  toast('Booked. It just appeared on the front desk calendar.')
  $('#details').reset()
  pick.time = null
  pick.reason = null
  renderPatient()
  if (!reduced) $('#ticket').animate([{ transform: 'rotate(-3deg) scale(.96)' }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.3,1.6,.5,1)' })
})
$('#again').addEventListener('click', () => {
  lastBooking = null
  renderPatient()
  $('#docs').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
})

/* ---------- front desk ---------- */
let deskDate = TODAY
let selected = null
let walkIn = null // { doctor, time } while booking a walk-in
const OPEN = toMin('09:00')
const CLOSE = toMin('14:00')
const PX = 2.6 // pixels per minute

const STATUS = { booked: 'Booked', arrived: 'Arrived', in: 'With doctor', done: 'Seen', noshow: 'No-show' }

function renderDesk() {
  $('#deskDays').innerHTML = DAYS.filter((d) => !d.closed)
    .slice(0, 5)
    .map((d) => `<button type="button" class="${deskDate === d.date ? 'is-on' : ''}" data-desk-date="${d.date}">${d.i === 0 ? 'Today' : d.i === 1 ? 'Tomorrow' : `${d.wd} ${d.day}`}</button>`)
    .join('')
  const day = bookings.filter((b) => b.date === deskDate && b.status !== 'cancelled')
  const count = (s) => day.filter((b) => b.status === s).length
  $('#tally').innerHTML = [
    ['Booked', day.length],
    ['Waiting', count('arrived')],
    ['Seen', count('done')],
    ['No-shows', count('noshow')],
  ]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('')

  const hours = []
  for (let t = OPEN; t <= CLOSE; t += 60) hours.push(`<span class="cal__hour" style="top:${(t - OPEN) * PX}px">${label(fromMin(t)).replace(':00', '')}</span>`)
  const nowLine = deskDate === TODAY ? `<i class="cal__now" style="top:${(now - OPEN) * PX}px"><b>${label(fromMin(now))}</b></i>` : ''

  const cols = DOCTORS.map((doc) => {
    const off = [
      [OPEN, toMin(doc.start)],
      [toMin(doc.end), CLOSE],
      ...doc.breaks.map((b) => [toMin(b), toMin(b) + doc.slot]),
    ]
      .filter(([a, b]) => b > a)
      .map(([a, b]) => `<i class="cal__off" style="top:${(a - OPEN) * PX}px;height:${(b - a) * PX}px"></i>`)
      .join('')
    const free = availability(doc, deskDate, bookings, nowFor(deskDate))
      .filter((s) => !s.taken && !s.past)
      .map((s) => `<button type="button" class="cal__free" data-free="${doc.id}|${s.time}" style="top:${(toMin(s.time) - OPEN) * PX}px;height:${doc.slot * PX - 3}px" aria-label="Free at ${label(s.time)}, add a walk-in"><span>+ Walk-in</span></button>`)
      .join('')
    const blocks = day
      .filter((b) => b.doctor === doc.id)
      .map(
        (b) => `<button type="button" class="appt is-${b.status}${selected === b.id ? ' is-sel' : ''}${b.fresh ? ' is-fresh' : ''}" data-appt="${b.id}" style="top:${(toMin(b.time) - OPEN) * PX}px;height:${doc.slot * PX - 3}px">
          <b>${esc(b.name)}</b><small>${label(b.time)} · ${STATUS[b.status]}</small>
        </button>`,
      )
      .join('')
    return `<div class="cal__col" style="--h:${doc.hue}">
      <div class="cal__head">${avatar(doc, 'ava--sm')}<span><b>${doc.name}</b><small>${doc.role}</small></span></div>
      <div class="cal__body" style="height:${(CLOSE - OPEN) * PX}px">${off}${free}${blocks}</div>
    </div>`
  }).join('')
  $('#cal').style.setProperty('--px', `${PX}px`)
  $('#cal').innerHTML = `<div class="cal__axis"><div class="cal__head"></div><div class="cal__body" style="height:${(CLOSE - OPEN) * PX}px">${hours.join('')}</div></div>${cols}<div class="cal__lines" style="top:0">${nowLine}</div>`
  bookings.forEach((b) => delete b.fresh)
  renderPanel()
}

function renderPanel() {
  const b = bookings.find((x) => x.id === selected)
  if (walkIn) {
    const doc = docById(walkIn.doctor)
    $('#panel').innerHTML = `<p class="panel__eyebrow">Walk-in</p>
      <h2>${label(walkIn.time)} with ${doc.name}</h2>
      <form id="walkForm" class="panel__form">
        <label class="field"><span>Patient name</span><input id="wName" maxlength="40" autocomplete="off" required /></label>
        <div class="panel__actions"><button class="btn" type="submit">Add and check in</button><button class="btn btn--ghost" type="button" data-act="close">Cancel</button></div>
      </form>`
    $('#wName').focus()
    return
  }
  if (!b) {
    $('#panel').innerHTML = `<div class="panel__empty"><svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="9" width="36" height="32" rx="6" /><path d="M6 18h36M16 5v8M32 5v8M15 27h6M15 33h12" /></svg><p>Tap an appointment to check a patient in, or an empty slot to add a walk-in.</p></div>`
    return
  }
  const doc = docById(b.doctor)
  const acts = {
    booked: [['arrive', 'Mark arrived', ''], ['noshow', 'No-show', 'ghost'], ['cancel', 'Cancel', 'ghost']],
    arrived: [['unarrive', 'Undo arrival', 'ghost']],
    noshow: [['arrive', 'They came after all', '']],
    in: [],
    done: [],
  }[b.status]
  $('#panel').innerHTML = `<p class="panel__eyebrow">Token ${tokenOf(b, bookings)} · ${dayName(b.date)}</p>
    <h2>${esc(b.name)}</h2>
    <p class="status is-${b.status}">${STATUS[b.status]}</p>
    <dl class="panel__rows">
      <div><dt>Time</dt><dd>${label(b.time)}</dd></div>
      <div><dt>Doctor</dt><dd>${doc.name}</dd></div>
      <div><dt>Reason</dt><dd>${esc(b.reason)}</dd></div>
      <div><dt>Mobile</dt><dd>${esc(b.phone)}</dd></div>
    </dl>
    <div class="panel__actions">${acts.map(([a, t, k]) => `<button class="btn ${k ? 'btn--ghost' : ''}" type="button" data-act="${a}">${t}</button>`).join('')}</div>
    ${b.status === 'in' ? '<p class="muted">With the doctor now.</p>' : b.status === 'done' ? '<p class="muted">Visit complete.</p>' : ''}`
}

$('#deskDays').addEventListener('click', (e) => {
  const b = e.target.closest('[data-desk-date]')
  if (!b) return
  deskDate = b.dataset.deskDate
  selected = null
  walkIn = null
  renderDesk()
})
$('#cal').addEventListener('click', (e) => {
  const a = e.target.closest('[data-appt]')
  const f = e.target.closest('[data-free]')
  if (a) {
    selected = Number(a.dataset.appt)
    walkIn = null
  } else if (f) {
    const [doctor, time] = f.dataset.free.split('|')
    walkIn = { doctor, time }
    selected = null
  } else return
  renderDesk()
})
$('#panel').addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act
  if (!act) return
  if (act === 'close') {
    walkIn = null
    return renderDesk()
  }
  const b = bookings.find((x) => x.id === selected)
  if (!b) return
  if (act === 'arrive') {
    b.status = 'arrived'
    bump('doctor')
    toast(`${b.name.split(' ')[0]} checked in. Added to ${docById(b.doctor).name}'s queue.`)
  }
  if (act === 'unarrive') b.status = 'booked'
  if (act === 'noshow') b.status = 'noshow'
  if (act === 'cancel') {
    b.status = 'cancelled'
    selected = null
    toast('Cancelled. The slot is free again.')
  }
  renderDesk()
})
$('#panel').addEventListener('submit', (e) => {
  e.preventDefault()
  const name = $('#wName').value.trim()
  if (name.length < 2) return $('#wName').focus()
  const b = { id: ++seq, doctor: walkIn.doctor, date: deskDate, time: walkIn.time, name, phone: '—', reason: 'Walk-in', status: deskDate === TODAY ? 'arrived' : 'booked', fresh: true }
  bookings.push(b)
  walkIn = null
  selected = b.id
  if (b.status === 'arrived') bump('doctor')
  toast(`${name.split(' ')[0]} added${b.status === 'arrived' ? ' and checked in' : ''}.`)
  renderDesk()
})

/* ---------- doctor ---------- */
let docId = 'mehta'
const startedAt = {}

function renderDoctor() {
  $('#who').innerHTML = DOCTORS.map((d) => `<button type="button" role="radio" aria-checked="${d.id === docId}" data-who="${d.id}" style="--h:${d.hue}">${avatar(d, 'ava--sm')}${d.name}</button>`).join('')
  const doc = docById(docId)
  const q = queueFor(docId, TODAY, bookings)
  const c = q.current
  $('#now').style.setProperty('--h', doc.hue)
  $('#now').innerHTML = c
    ? `<p class="now__label">Now seeing</p>
      <p class="now__token">Token ${tokenOf(c, bookings)}</p>
      <h2>${esc(c.name)}</h2>
      <p class="now__reason">${esc(c.reason)} · booked ${label(c.time)}</p>
      <p class="now__timer">In the room for <b>${Math.max(1, now - (startedAt[c.id] ?? now - 6))} min</b></p>
      <div class="now__actions">
        <button class="btn btn--big" type="button" data-doc-act="next">${q.waiting.length ? 'Finish and call next' : 'Finish visit'}</button>
      </div>
      <p class="now__done">${q.done} seen today</p>`
    : `<p class="now__label">Now seeing</p>
      <h2 class="now__idle">${q.waiting.length ? 'Room is free' : 'No one waiting'}</h2>
      <p class="now__reason">${q.waiting.length ? `${q.waiting.length} waiting outside` : 'Patients appear here once the front desk checks them in.'}</p>
      <div class="now__actions">${q.waiting.length ? '<button class="btn btn--big" type="button" data-doc-act="call">Call next patient</button>' : ''}</div>
      <p class="now__done">${q.done} seen today</p>`

  $('#waitCount').textContent = q.waiting.length
  $('#waiting').innerHTML = q.waiting.length
    ? q.waiting
        .map(
          (b, i) => `<li${b.fresh ? ' class="is-fresh"' : ''}><span class="tok">${tokenOf(b, bookings)}</span><span><b>${esc(b.name)}</b><small>${esc(b.reason)}</small></span><em>~${(i + (c ? 1 : 0)) * doc.slot} min</em></li>`,
        )
        .join('')
    : '<li class="empty">No one in the waiting room</li>'
  $('#later').innerHTML = q.later.length
    ? q.later.map((b) => `<li><span class="tok">${tokenOf(b, bookings)}</span><span><b>${esc(b.name)}</b><small>${label(b.time)}</small></span></li>`).join('')
    : '<li class="empty">Nothing else booked today</li>'

  // the waiting-room screen shows every room
  $('#screenNow').innerHTML = c
    ? `<span>Now calling</span><b>Token ${tokenOf(c, bookings)}</b><small>${doc.room} · ${doc.name}</small>`
    : `<span>${doc.room}</span><b>Please wait</b><small>${doc.name}</small>`
  $('#screenRooms').innerHTML = DOCTORS.filter((d) => d.id !== docId)
    .map((d) => {
      const cur = queueFor(d.id, TODAY, bookings).current
      return `<li><span>${d.room}</span><b>${cur ? `Token ${tokenOf(cur, bookings)}` : '—'}</b></li>`
    })
    .join('')
}

$('#who').addEventListener('click', (e) => {
  const b = e.target.closest('[data-who]')
  if (!b) return
  docId = b.dataset.who
  renderDoctor()
})
$('#now').addEventListener('click', (e) => {
  const act = e.target.closest('[data-doc-act]')?.dataset.docAct
  if (!act) return
  const q = queueFor(docId, TODAY, bookings)
  if (q.current) q.current.status = 'done'
  // a visit takes demo time, so the clock moves on
  now = Math.min(now + 7, toMin('13:50'))
  tickClock()
  const next = q.waiting[0]
  if (next) {
    next.status = 'in'
    startedAt[next.id] = now
    toast(`Calling token ${tokenOf(next, bookings)}: ${next.name}`)
  }
  renderDoctor()
  if (next && !reduced) $('#screenNow').animate([{ transform: 'scale(1.06)', background: '#1dd3a7' }, { transform: 'none' }], { duration: 700, easing: 'ease-out' })
})

function render() {
  if (current === 'patient') renderPatient()
  if (current === 'desk') renderDesk()
  if (current === 'doctor') renderDoctor()
}
render()
