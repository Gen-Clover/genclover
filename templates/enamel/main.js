import '@fontsource-variable/schibsted-grotesk/wght.css'
import '@fontsource/ms-madi/400.css'
import './style.css'
import { buildArch, TREATMENTS } from './arch.js'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (id) => document.getElementById(id)

/* nav turns solid once the hero has scrolled away */
new IntersectionObserver(([e]) => $('nav').classList.toggle('is-solid', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(
  document.querySelector('.hero__actions'),
)

/* hero: the tooth chart picks the treatment shown in the card */
$('chart').innerHTML = buildArch()
const teethLayer = document.querySelector('.teeth')
const parts = [...document.querySelectorAll('.tooth, .gum, .num')]
let current = null

const show = (id) => {
  if (id === current) return
  current = id
  const t = TREATMENTS.find((x) => x.id === id)
  teethLayer.classList.add('has-focus')
  parts.forEach((el) => el.classList.toggle('is-on', el.dataset.t === id))

  const swap = () => {
    $('cardName').textContent = t.name
    $('cardLine').textContent = t.line
    $('cardVisits').textContent = t.visits
    $('cardTeeth').textContent = `Teeth ${t.teeth.join(' ')}`
  }
  if (reduced) return swap()
  const card = $('cardIn')
  card.classList.add('is-swapping')
  setTimeout(() => {
    swap()
    card.classList.remove('is-swapping')
  }, 180)
}

// the chart tours itself until someone touches it
let tour = 0
let touring = !reduced
const step = () => show(TREATMENTS[tour++ % TREATMENTS.length].id)
let timer = setInterval(() => touring && step(), 3200)
setTimeout(step, reduced ? 0 : 1500)
const stopTour = () => {
  touring = false
  clearInterval(timer)
}
new IntersectionObserver(([e]) => {
  if (!touring) return
  clearInterval(timer)
  if (e.isIntersecting) timer = setInterval(step, 3200)
}).observe($('arch'))

document.querySelectorAll('.hit').forEach((g) => {
  const pick = () => {
    stopTour()
    show(g.dataset.t)
  }
  g.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && pick())
  g.addEventListener('click', pick)
  g.addEventListener('focus', pick)
  g.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick()))
})

/* treatments: one strip open at a time */
const strips = [...document.querySelectorAll('.strip')]
const open = (s) =>
  strips.forEach((x) => {
    x.classList.toggle('is-open', x === s)
    x.setAttribute('aria-expanded', String(x === s))
  })
strips.forEach((s) => {
  s.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && open(s))
  s.addEventListener('click', () => open(s))
  s.addEventListener('focus', () => open(s))
})

/* the room opens out (browsers without scroll timelines get a one-off reveal) */
const once = (el, cls, threshold) =>
  new IntersectionObserver(
    (es, io) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add(cls)
        io.unobserve(e.target)
      }),
    { threshold },
  ).observe(el)
if (!CSS.supports('animation-timeline: view()')) once($('studioFrame'), 'is-open', 0.3)
once($('visitTrack'), 'is-in', 0.3)

/* reviews: a second copy makes the band loop without a seam */
if (!reduced) {
  const row = document.querySelector('.marquee__row')
  row.insertAdjacentHTML('beforeend', row.innerHTML.replace(/<li>/g, '<li aria-hidden="true">'))
}

/* booking: next ten opening days, with a few slots already taken */
const DAY = 864e5
const days = []
for (let d = new Date(Date.now() + DAY); days.length < 10; d = new Date(d.getTime() + DAY)) days.push(d)
$('days').innerHTML = days
  .map((d, i) => {
    const closed = d.getDay() === 0
    const label = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    return `<label><input type="radio" name="day" value="${i}" ${closed ? 'disabled' : ''} aria-label="${label}${closed ? ', closed' : ''}" /><span><small>${d.toLocaleDateString('en-IN', { weekday: 'short' })}</small><strong>${d.getDate()}</strong><small>${d.toLocaleDateString('en-IN', { month: 'short' })}</small></span></label>`
  })
  .join('')
const firstOpen = $('days').querySelector('input:enabled')
firstOpen.checked = true

const SLOTS = ['09:30', '10:15', '11:00', '11:45', '12:30', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15']
const renderTimes = () => {
  const day = Number(new FormData($('picker')).get('day'))
  $('times').innerHTML = SLOTS.map(
    (t, i) => `<label><input type="radio" name="time" value="${t}" ${(i * 7 + day * 3) % 5 === 0 ? 'disabled' : ''} aria-label="${t}${(i * 7 + day * 3) % 5 === 0 ? ', taken' : ''}" /><span>${t}</span></label>`,
  ).join('')
}
renderTimes()
$('days').addEventListener('change', renderTimes)

const setError = (input, errorId, bad) => {
  $(errorId).hidden = !bad
  if (input) input.setAttribute('aria-invalid', String(bad))
  return bad
}
$('picker').addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(e.target)
  const phoneOk = (data.get('phone') || '').replace(/\D/g, '').length >= 10
  const bad = [
    setError(null, 'timeError', !data.get('time')),
    setError($('name'), 'nameError', !(data.get('name') || '').trim()),
    setError($('phone'), 'phoneError', !phoneOk),
  ]
  if (bad.some(Boolean)) {
    e.target.querySelector('[aria-invalid="true"], .times input:enabled')?.focus()
    return
  }
  const btn = $('submit')
  btn.disabled = true
  btn.textContent = 'Booking…'
  setTimeout(
    () => {
      const day = days[Number(data.get('day'))].toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
      $('doneTitle').textContent = `See you soon, ${data.get('name').trim().split(' ')[0]}.`
      $('doneText').textContent = `${data.get('treatment')} on ${day} at ${data.get('time')}. We will call to confirm. This is a demo, so nothing was sent.`
      $('done').hidden = false
      btn.disabled = false
      btn.textContent = 'Book a visit'
      $('again').focus()
    },
    reduced ? 0 : 900,
  )
})
$('again').addEventListener('click', () => {
  $('picker').reset()
  firstOpen.checked = true
  renderTimes()
  $('done').hidden = true
  $('name').focus()
})
;['name', 'phone'].forEach((id) => $(id).addEventListener('input', () => setError($(id), `${id}Error`, false)))
$('times').addEventListener('change', () => ($('timeError').hidden = true))
