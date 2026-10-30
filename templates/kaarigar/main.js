import '@fontsource/chakra-petch/600.css'
import '@fontsource/chakra-petch/700.css'
import '@fontsource-variable/inter/wght.css'
import './style.css'
import { STAGES, TECHS, CHECKLISTS, missing, nextStage, advance, invoiceStep } from './jobs.js'

const $ = (s) => document.querySelector(s)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const techById = (id) => TECHS.find((t) => t.id === id)
const initials = (name) => name.split(' ').map((w) => w[0]).join('')
const PRICE = '₹X,XXX'

/* ---------- jobs ---------- */
const job = (id, customer, area, issue, skill, tech, stage, slot, at, extra = {}) => ({
  id, customer, area, issue, skill, tech, stage, slot, at,
  checks: CHECKLISTS[skill].map(() => stage === 'done'),
  photo: null, signed: stage === 'done', invoice: null, ...extra,
})
const jobs = [
  job('K-201', 'Mehra residence', 'Kothrud', 'Kitchen sink leaking under the cabinet', 'Plumbing', 'ravi', 'onsite', '9:30 – 11:00', [110, 120], { checks: [true, false, false] }),
  job('K-202', 'Brew Lab Café', 'Baner', 'Two split ACs not cooling', 'AC service', 'joseph', 'enroute', '10:30 – 12:00', [250, 150]),
  job('K-203', 'Sharma flat', 'Aundh', 'Main switch keeps tripping', 'Electrical', 'salma', 'scheduled', '12:00 – 1:30', [220, 70]),
  job('K-204', 'Green Leaf Clinic', 'Shivaji Nagar', 'Ceiling fan rewiring', 'Electrical', 'salma', 'done', '9:00 – 10:00', [320, 120], { invoice: 'sent', photo: 'sample' }),
  job('K-205', 'Patel house', 'Kothrud', 'New geyser installation', 'Plumbing', 'ravi', 'scheduled', '2:00 – 4:00', [45, 70]),
  job('K-206', 'Joshi villa', 'Pashan', 'Yearly AC service, 3 units', 'AC service', 'joseph', 'done', '8:30 – 10:00', [150, 40], { invoice: 'paid', photo: 'sample' }),
  job('K-207', 'Office 4B, Tech Park', 'Hinjewadi', 'Socket sparking near the pantry', 'Electrical', null, 'new', 'Today, any time', [30, 190]),
  job('K-208', 'Iyer flat', 'Baner', 'Bathroom tap dripping', 'Plumbing', null, 'new', 'Tomorrow morning', [290, 195]),
]
const byId = (id) => jobs.find((j) => j.id === id)
const where = {} // technician -> [x, y] on the map
TECHS.forEach((t) => {
  const busy = jobs.find((j) => j.tech === t.id && ['enroute', 'onsite'].includes(j.stage))
  where[t.id] = busy?.stage === 'onsite' ? busy.at : t.home
})

let toastTimer
const toast = (msg) => {
  $('#toast').textContent = msg
  $('#toast').classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => $('#toast').classList.remove('is-on'), 2800)
}

// a stand-in "after" photo, drawn rather than shipped, for people without one handy
const samplePhoto = (j) => {
  const tint = { Plumbing: '#3d7bd9', Electrical: '#e0a100', 'AC service': '#2aa58b' }[j.skill]
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 160'><rect width='240' height='160' fill='#d9d4cb'/><rect y='110' width='240' height='50' fill='#bfb7aa'/><rect x='60' y='30' width='120' height='80' rx='6' fill='#f4f1ea' stroke='#8f8778' stroke-width='3'/><circle cx='120' cy='70' r='22' fill='${tint}' opacity='.85'/><path d='M108 70l8 8 16-16' stroke='#fff' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/><text x='12' y='150' font-family='sans-serif' font-size='11' fill='#5b5447'>${j.id} · after</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
const photoSrc = (j) => (j.photo === 'sample' ? samplePhoto(j) : j.photo)

/* ---------- map ---------- */
function renderMap() {
  const roads = 'M0 100 H360 M0 160 C90 150 200 175 360 140 M120 0 V220 M240 0 C230 80 260 140 250 220 M0 40 C100 50 180 30 360 60'
  const pins = jobs
    .filter((j) => j.stage !== 'new')
    .map((j) => {
      const t = techById(j.tech)
      return `<g class="pin is-${j.stage}" transform="translate(${j.at[0]} ${j.at[1]})" style="--h:${t.hue}"><circle r="9" /><text y="3.5">${j.id.slice(-2)}</text></g>`
    })
    .join('')
  const dots = TECHS.map(
    (t) => `<g class="tech" data-tech-dot="${t.id}" style="--h:${t.hue};transform:translate(${where[t.id][0]}px, ${where[t.id][1]}px)"><circle r="13" class="tech__halo" /><circle r="8" /><text y="3">${t.name[0]}</text></g>`,
  ).join('')
  $('#map').innerHTML = `<rect width="360" height="220" class="map__bg" /><path d="${roads}" class="map__roads" />${pins}${dots}`
}
// move dots without redrawing, so the CSS transition can glide them
const moveDots = () => TECHS.forEach((t) => {
  const g = document.querySelector(`[data-tech-dot="${t.id}"]`)
  if (g) g.style.transform = `translate(${where[t.id][0]}px, ${where[t.id][1]}px)`
})

/* ---------- office board ---------- */
let flash = null
const INVOICE = { draft: 'Invoice draft', sent: 'Invoice sent', paid: 'Paid' }

function cardHTML(j) {
  const t = techById(j.tech)
  const assign =
    j.stage === 'new'
      ? `<label class="assign"><span class="sr">Assign ${j.id}</span><select data-assign="${j.id}"><option value="">Assign technician…</option>${TECHS.filter((x) => x.skill === j.skill)
          .concat(TECHS.filter((x) => x.skill !== j.skill))
          .map((x) => `<option value="${x.id}">${x.name}${x.skill === j.skill ? ' ★' : ''}</option>`)
          .join('')}</select></label>`
      : ''
  const done =
    j.stage === 'done'
      ? `<div class="proof">${j.photo ? `<img src="${photoSrc(j)}" alt="Photo proof for ${j.id}" />` : ''}<span>${j.signed ? '✓ Signed' : ''}</span></div>
        <div class="inv is-${j.invoice}"><span>${INVOICE[j.invoice]} · ${PRICE}</span>${j.invoice === 'draft' ? `<button type="button" data-inv="${j.id}">Send</button>` : j.invoice === 'sent' ? `<button type="button" data-inv="${j.id}">Mark paid</button>` : ''}</div>`
      : ''
  const need = j.stage === 'onsite' ? missing(j) : []
  return `<article class="card${flash === j.id ? ' is-flash' : ''}" data-card="${j.id}" style="--h:${t?.hue ?? 0}">
    <header><b>${j.id}</b><span class="tag">${j.skill}</span></header>
    <h3>${esc(j.customer)}</h3>
    <p class="card__issue">${esc(j.issue)}</p>
    <p class="card__meta">${esc(j.area)} · ${j.slot}</p>
    ${t ? `<p class="card__tech"><span class="ava" aria-hidden="true">${initials(t.name)}</span>${t.name}</p>` : ''}
    ${need.length ? `<p class="card__need">Waiting on: ${need.join(', ')}</p>` : ''}
    ${assign}${done}
  </article>`
}

function renderBoard() {
  $('#board').innerHTML = STAGES.map(([id, label]) => {
    const list = jobs.filter((j) => j.stage === id)
    return `<section class="col" data-stage="${id}"><h2>${label}<span>${list.length}</span></h2><div class="col__list">${list.map(cardHTML).join('') || '<p class="col__empty">—</p>'}</div></section>`
  }).join('')
  const unpaid = jobs.filter((j) => j.invoice === 'sent' || j.invoice === 'draft').length
  $('#stats').innerHTML = [
    ['Jobs today', jobs.length],
    ['In the field', jobs.filter((j) => ['enroute', 'onsite'].includes(j.stage)).length],
    ['Completed', jobs.filter((j) => j.stage === 'done').length],
    ['Awaiting payment', unpaid],
  ]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('')
  flash = null
}

$('#board').addEventListener('change', (e) => {
  const sel = e.target.closest('[data-assign]')
  if (!sel?.value) return
  const j = byId(sel.dataset.assign)
  j.tech = sel.value
  advance(j)
  flash = j.id
  toast(`${j.id} sent to ${techById(j.tech).name.split(' ')[0]}'s phone`)
  refresh()
})
$('#board').addEventListener('click', (e) => {
  const b = e.target.closest('[data-inv]')
  if (!b) return
  const j = byId(b.dataset.inv)
  invoiceStep(j)
  flash = j.id
  toast(j.invoice === 'sent' ? `Invoice for ${j.id} sent to ${j.customer}` : `${j.id} marked paid`)
  if (j.invoice === 'sent') autoPay(j)
  refresh()
})
// customers pay from the link in the invoice; the demo pays a few seconds later
const autoPay = (j) => setTimeout(() => {
  if (j.invoice !== 'sent') return
  invoiceStep(j)
  flash = j.id
  toast(`${j.customer} paid ${j.id} online`)
  refresh()
}, reduced ? 1500 : 6000)

/* ---------- technician app ---------- */
let techId = 'ravi'
let openJob = null

$('#techs').innerHTML = TECHS.map(
  (t) => `<button type="button" role="radio" aria-checked="${t.id === techId}" data-tech="${t.id}" style="--h:${t.hue}"><span class="ava" aria-hidden="true">${initials(t.name)}</span>${t.name.split(' ')[0]}<small>${t.skill}</small></button>`,
).join('')
$('#techs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tech]')
  if (!b) return
  techId = b.dataset.tech
  openJob = null
  document.querySelectorAll('[data-tech]').forEach((x) => x.setAttribute('aria-checked', x === b))
  renderApp()
})

const STAGE_LABEL = Object.fromEntries(STAGES)

function renderApp() {
  const t = techById(techId)
  const mine = jobs.filter((j) => j.tech === techId)
  const app = $('#app')
  app.style.setProperty('--h', t.hue)
  const j = openJob && byId(openJob)
  if (!j) {
    app.innerHTML = `<div class="app-head"><p>Good morning,</p><h2>${t.name.split(' ')[0]}</h2><span class="ava ava--lg" aria-hidden="true">${initials(t.name)}</span></div>
      <p class="app-sub">${mine.filter((x) => x.stage !== 'done').length} jobs left today</p>
      <ul class="app-list">${mine
        .map(
          (x) => `<li><button type="button" data-open="${x.id}" class="is-${x.stage}">
          <span class="app-list__slot">${x.slot}</span><b>${esc(x.customer)}</b><small>${esc(x.issue)}</small>
          <em>${STAGE_LABEL[x.stage]}</em></button></li>`,
        )
        .join('') || '<li class="empty">Nothing assigned yet. New jobs from the office land here.</li>'}</ul>`
    return
  }
  const checklist = CHECKLISTS[j.skill]
  const step = {
    scheduled: `<button class="go" type="button" data-step="go">Start travel</button>`,
    enroute: `<p class="eta"><i></i>On the way · ETA 12 min</p><button class="go" type="button" data-step="go">I've arrived</button>`,
    onsite: `<div class="block"><p class="block__label">Checklist</p>${checklist
      .map((c, i) => `<label class="check"><input type="checkbox" data-check="${i}" ${j.checks[i] ? 'checked' : ''} /><span>${c}</span></label>`)
      .join('')}</div>
      <div class="block"><p class="block__label">Photo proof</p>${
        j.photo
          ? `<img class="shot" src="${photoSrc(j)}" alt="Photo proof for ${j.id}" /><button class="link" type="button" data-step="retake">Retake</button>`
          : `<div class="shoot"><label class="shoot__btn"><input type="file" accept="image/*" capture="environment" data-photo /><span>Take photo</span></label><button type="button" class="shoot__btn shoot__btn--alt" data-step="sample">Use sample</button></div>`
      }</div>
      <div class="block"><p class="block__label">Customer signature ${j.signed ? '<b class="ok">✓</b>' : ''}</p><canvas class="sign" width="560" height="200" data-sign aria-label="Signature pad, draw with your finger or mouse"></canvas><button class="link" type="button" data-step="clear">Clear</button></div>
      <button class="go" type="button" data-step="go" ${nextStage(j) ? '' : 'disabled'}>${nextStage(j) ? 'Complete job' : `Still needed: ${missing(j).join(', ')}`}</button>`,
    done: `<div class="done"><span>✓</span><p>Job complete</p><small>${INVOICE[j.invoice]}. The office handles billing.</small></div>`,
  }[j.stage]
  app.innerHTML = `<div class="app-bar"><button type="button" data-step="back" aria-label="Back to my jobs">←</button><span>${j.id}</span><em class="is-${j.stage}">${STAGE_LABEL[j.stage]}</em></div>
    <div class="job">
      <h2>${esc(j.customer)}</h2>
      <p class="job__where">${esc(j.area)} · ${j.slot}</p>
      <p class="job__issue">${esc(j.issue)}</p>
      ${step}
    </div>`
  const pad = app.querySelector('[data-sign]')
  if (pad) setupPad(pad, j)
}

// signature pad: pointer events cover mouse, pen and touch
function setupPad(canvas, j) {
  const ctx = canvas.getContext('2d')
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#1c1d1f'
  if (j.signed) {
    ctx.font = 'italic 64px Georgia, serif'
    ctx.fillStyle = '#1c1d1f'
    ctx.fillText(j.customer.split(' ')[0], 40, 130)
  }
  let last = null
  let ink = 0
  const pos = (e) => {
    const r = canvas.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * canvas.width, ((e.clientY - r.top) / r.height) * canvas.height]
  }
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId)
    last = pos(e)
  })
  canvas.addEventListener('pointermove', (e) => {
    if (!last) return
    const p = pos(e)
    ctx.beginPath()
    ctx.moveTo(...last)
    ctx.lineTo(...p)
    ctx.stroke()
    ink += Math.hypot(p[0] - last[0], p[1] - last[1])
    last = p
  })
  canvas.addEventListener('pointerup', () => {
    last = null
    // a dot or a slip isn't a signature
    if (ink > 120 && !j.signed) {
      j.signed = true
      refresh(true)
    }
  })
}

$('#app').addEventListener('click', (e) => {
  const open = e.target.closest('[data-open]')
  if (open) {
    openJob = open.dataset.open
    return renderApp()
  }
  const step = e.target.closest('[data-step]')?.dataset.step
  const j = openJob && byId(openJob)
  if (!step) return
  if (step === 'back') {
    openJob = null
    return renderApp()
  }
  if (step === 'sample') j.photo = 'sample'
  if (step === 'retake') j.photo = null
  if (step === 'clear') j.signed = false
  if (step === 'go') {
    advance(j)
    flash = j.id
    if (j.stage === 'enroute') {
      where[j.tech] = j.at
      toast(`${j.id}: ${techById(j.tech).name.split(' ')[0]} is on the way`)
    }
    if (j.stage === 'onsite') toast(`${j.id}: arrived on site`)
    if (j.stage === 'done') toast(`${j.id} done. Invoice drafted in the office.`)
  }
  refresh()
})
$('#app').addEventListener('change', (e) => {
  const j = byId(openJob)
  const c = e.target.closest('[data-check]')
  if (c) {
    j.checks[Number(c.dataset.check)] = c.checked
    return refresh(true)
  }
  const f = e.target.closest('[data-photo]')
  const file = f?.files[0]
  if (file?.type.startsWith('image/')) {
    if (j.photo?.startsWith('blob:')) URL.revokeObjectURL(j.photo)
    j.photo = URL.createObjectURL(file)
    flash = j.id
    refresh()
  }
})

// keepApp: update the office without redrawing the phone (keeps the signature pad mid-stroke)
function refresh(keepApp = false) {
  renderBoard()
  moveDots()
  if (!keepApp) renderApp()
  else {
    const go = $('#app [data-step="go"]')
    const j = byId(openJob)
    if (go && j) {
      go.disabled = !nextStage(j)
      go.textContent = nextStage(j) ? 'Complete job' : `Still needed: ${missing(j).join(', ')}`
    }
  }
  // pins change when a job starts or finishes
  if ($('#map').querySelectorAll('.pin').length !== jobs.filter((j) => j.stage !== 'new').length) {
    renderMap()
    requestAnimationFrame(moveDots)
  }
}

/* ---------- other technicians keep working on their own ---------- */
const autoplay = setInterval(() => {
  const j = jobs.find((x) => x.tech && x.tech !== techId && ['scheduled', 'enroute', 'onsite'].includes(x.stage))
  if (!j) return clearInterval(autoplay)
  if (j.stage === 'onsite') {
    j.checks = j.checks.map(() => true)
    j.photo = 'sample'
    j.signed = true
  }
  advance(j)
  if (j.stage === 'enroute') where[j.tech] = j.at
  flash = j.id
  refresh(true)
}, 9000)

renderMap()
refresh()
// anyone already on the road starts driving once the page is up
setTimeout(() => {
  jobs.filter((j) => j.stage === 'enroute').forEach((j) => (where[j.tech] = j.at))
  moveDots()
}, 600)
