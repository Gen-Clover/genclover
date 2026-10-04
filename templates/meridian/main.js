import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/inter/wght.css'
import './style.css'
import { createTower, FLOORS } from './tower.js'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (id) => document.getElementById(id)

/* ------------------------------------------------------------- the homes */

const HOMES = {
  '2bhk': { name: '2 BHK', size: 'X,XXX sq ft', price: '₹X.XX Cr', blurb: 'Two bedrooms, a corner living room and a deep balcony.' },
  '3bhk': { name: '3 BHK', size: 'X,XXX sq ft', price: '₹X.XX Cr', blurb: 'Three bedrooms, a study nook and a wraparound balcony.' },
  '4bhk': { name: '4 BHK', size: 'X,XXX sq ft', price: '₹X.XX Cr', blurb: 'Four bedrooms and a separate family lounge, on the upper floors.' },
  penthouse: { name: 'Penthouse', size: 'X,XXX sq ft', price: 'On request', blurb: 'A whole floor, a private terrace and views on every side.' },
}

/** Rooms on a 300 × 200 board: [label, x, y, w, h]. */
const PLANS = {
  '2bhk': [['Living', 0, 0, 170, 110], ['Kitchen', 170, 0, 60, 70], ['Bath', 170, 70, 60, 40], ['Bedroom', 230, 0, 70, 110], ['Bedroom', 0, 110, 120, 90], ['Bath', 120, 110, 50, 50], ['Balcony', 170, 110, 130, 90]],
  '3bhk': [['Living', 0, 0, 150, 100], ['Dining', 150, 0, 80, 100], ['Kitchen', 230, 0, 70, 60], ['Bath', 230, 60, 70, 40], ['Bedroom', 0, 100, 100, 100], ['Bedroom', 100, 100, 90, 100], ['Bedroom', 190, 100, 110, 70], ['Balcony', 190, 170, 110, 30]],
  '4bhk': [['Living', 0, 0, 130, 90], ['Family', 130, 0, 90, 90], ['Kitchen', 220, 0, 80, 55], ['Bath', 220, 55, 80, 35], ['Bedroom', 0, 90, 80, 110], ['Bedroom', 80, 90, 80, 110], ['Bedroom', 160, 90, 70, 110], ['Bedroom', 230, 90, 70, 110]],
  penthouse: [['Grand living', 0, 0, 180, 120], ['Kitchen', 180, 0, 70, 70], ['Bar', 250, 0, 50, 70], ['Suite', 180, 70, 120, 130], ['Bedroom', 0, 120, 90, 80], ['Bedroom', 90, 120, 90, 80]],
}

const planSvg = (type) => {
  const rooms = PLANS[type]
  const parts = rooms.map(([label, x, y, w, h]) => {
    const cx = x + w / 2
    const cy = y + h / 2
    return `<rect class="room" x="${x + 6}" y="${y + 6}" width="${w}" height="${h}"/>
      <path class="wall" pathLength="1" d="M${x + 6} ${y + 6}h${w}v${h}h-${w}z"/>
      <text class="label" x="${cx + 6}" y="${cy + 9}" text-anchor="middle">${label.toUpperCase()}</text>`
  })
  // a few door swings, where rooms meet the living space
  const doors = rooms
    .slice(1, 4)
    .map(([, x, y, , h]) => `<path class="door" d="M${x + 6} ${y + 6 + h - 22}a18 18 0 0 1 18 18"/>`)
  return `<svg viewBox="0 0 312 212" aria-hidden="true">${parts.join('')}${doors.join('')}
    <path class="wall" pathLength="1" style="stroke-width:5" d="M6 6h300v200h-300z"/></svg>`
}

/* ------------------------------------------------------------- the floors */

/** Tower floor index (0 at the bottom) → what is on it. Floors 1–2 are the podium. */
const floorInfo = (i) => {
  const number = i + 3
  const type = i < 11 ? (i % 2 ? '3bhk' : '2bhk') : i < 20 ? '3bhk' : i < 22 ? '4bhk' : 'penthouse'
  const homes = { '2bhk': 4, '3bhk': 3, '4bhk': 2, penthouse: 1 }[type]
  const free = (i * 7 + 3) % (homes + 2)
  const available = Math.min(free, homes)
  return { number, type, homes, available, ...HOMES[type] }
}

/* -------------------------------------------------------------- the hero */

const tip = $('tip')
const panel = $('panel')
const hint = $('hint')
if (!matchMedia('(hover: hover)').matches) hint.textContent = 'Tap a floor · Drag to turn'
let tower = null

const showTip = (floor, x, y) => {
  if (floor == null) {
    tip.hidden = true
    return
  }
  const f = floorInfo(floor)
  tip.innerHTML = `<b>Floor ${f.number}</b><span>${f.name} · ${f.homes} home${f.homes > 1 ? 's' : ''} on this floor</span>
    <span class="avail">${f.available ? `${f.available} available · from ${f.price}` : 'Sold out'}</span>`
  tip.style.left = `${Math.min(x, innerWidth - 230)}px`
  tip.style.top = `${y}px`
  tip.hidden = false
  hint.classList.add('is-done')
}

const showPanel = (floor) => {
  if (floor == null) {
    panel.hidden = true
    return
  }
  const f = floorInfo(floor)
  $('panelBody').innerHTML = `
    <p class="eyebrow">Floor ${f.number} of ${FLOORS + 2}</p>
    <h3>${f.name}</h3>
    <p class="sub">${f.blurb}</p>
    <div class="plan">${planSvg(f.type)}</div>
    <dl>
      <div><dt>Carpet area</dt><dd>${f.size}</dd></div>
      <div><dt>Price</dt><dd>${f.price}</dd></div>
      <div><dt>On this floor</dt><dd>${f.homes} home${f.homes > 1 ? 's' : ''}</dd></div>
      <div><dt>Available</dt><dd>${f.available ? f.available : 'Sold out'}</dd></div>
    </dl>
    <a class="btn" href="#visit" data-home="${f.type}" data-floor="${f.number}">Book a visit for floor ${f.number}</a>`
  panel.hidden = false
  requestAnimationFrame(() => requestAnimationFrame(() => panel.querySelector('.plan').classList.add('is-drawn')))
  tip.hidden = true
}

tower = createTower($('tower'), { onHover: showTip, onSelect: showPanel, reduced })
$('panelClose').addEventListener('click', () => tower?.select(null))
addEventListener('keydown', (e) => e.key === 'Escape' && tower?.select(null))

/* light: day, dusk or night */
const moodButtons = [...document.querySelectorAll('.mood button')]
moodButtons.forEach((b) =>
  b.addEventListener('click', () => {
    const mood = b.dataset.mood
    document.body.dataset.mood = mood
    moodButtons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
    tower?.setMood(mood)
  })
)

/* --------------------------------------------------------------- homes */

$('homesList').innerHTML = Object.entries(HOMES)
  .map(
    ([type, h]) => `<article class="home reveal">
      <div class="plan">${planSvg(type)}</div>
      <h3>${h.name}</h3>
      <p>${h.blurb}</p>
      <div class="meta"><span>${h.size}</span><b>${h.price}</b></div>
    </article>`
  )
  .join('')
$('homeSelect').innerHTML = Object.entries(HOMES)
  .map(([type, h]) => `<option value="${type}">${h.name}</option>`)
  .join('')

/* ------------------------------------------------------------ amenities */

const ICON = {
  pool: '<path d="M3 17c2 0 2-1.5 4.5-1.5S9.5 17 12 17s2.5-1.5 4.5-1.5S19 17 21 17M3 21c2 0 2-1.5 4.5-1.5S9.5 21 12 21s2.5-1.5 4.5-1.5S19 21 21 21M8 14V5a2 2 0 0 1 4 0M16 14V5a2 2 0 0 0-4 0M8 9h8"/>',
  lounge: '<path d="M4 20V10a8 8 0 0 1 16 0v10M4 20h16M9 20v-5h6v5M12 2v2"/>',
  gym: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
  kids: '<circle cx="12" cy="6" r="3"/><path d="M6 21l2-8h8l2 8M9 13l-3-3M15 13l3-3"/>',
  work: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  spa: '<path d="M12 21c-5 0-8-3-8-7 3 0 6 1 8 4 2-3 5-4 8-4 0 4-3 7-8 7ZM12 18c-2-3-2-7 0-11 2 4 2 8 0 11Z"/>',
  garden: '<path d="M12 21v-8M12 13c0-4 3-7 7-7 0 4-3 7-7 7ZM12 15c0-3-2-5-5-5 0 3 2 5 5 5Z"/>',
  club: '<path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"/>',
}
const AMENITIES = [
  ['pool', 'Infinity pool', 'On the podium deck, facing west.'],
  ['lounge', 'Sky lounge', 'At the top, for residents only.'],
  ['gym', 'Fitness studio', 'Open early, open late.'],
  ['kids', "Children's play", 'Indoor and outdoor, supervised.'],
  ['work', 'Co-working', 'Quiet desks and two meeting rooms.'],
  ['spa', 'Spa and sauna', 'Steam, sauna and treatment rooms.'],
  ['garden', 'Landscaped podium', 'A garden above the street.'],
  ['club', 'Clubhouse', 'A hall for parties and gatherings.'],
]
$('amenityList').innerHTML = AMENITIES.map(
  ([icon, title, text]) => `<li class="amenity reveal"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[icon]}</svg><h3>${title}</h3><p>${text}</p></li>`
).join('')

/* -------------------------------------------------------------- the map */

const HOME = [270, 215]
const PLACES = [
  { name: 'Metro station', time: 'X min', at: [360, 150], route: 'M270 215 L330 215 L330 150 L360 150' },
  { name: 'International school', time: 'X min', at: [150, 120], route: 'M270 215 L270 120 L150 120' },
  { name: 'City hospital', time: 'X min', at: [420, 300], route: 'M270 215 L330 215 L330 300 L420 300' },
  { name: 'Business district', time: 'X min', at: [110, 330], route: 'M270 215 L270 330 L110 330' },
  { name: 'Airport', time: 'XX min', at: [420, 60], route: 'M270 215 L330 215 L330 60 L420 60' },
]
$('map').innerHTML = `
  <path class="river" d="M-10 380 C 120 330, 200 400, 330 360 S 480 320, 540 340"/>
  <rect class="park" x="40" y="180" width="120" height="80" rx="12"/>
  <path class="road" d="M0 215 H520 M270 0 V420 M330 0 V420"/>
  <path class="road road--minor" d="M0 120 H330 M0 330 H520 M330 150 H520 M330 300 H520 M330 60 H520 M150 0 V215"/>
  ${PLACES.map((p, i) => `<path class="route" data-i="${i}" d="${p.route}"/>`).join('')}
  ${PLACES.map((p, i) => `<g class="poi" data-i="${i}"><circle cx="${p.at[0]}" cy="${p.at[1]}" r="8"/><text x="${p.at[0] + 13}" y="${p.at[1] + 4}">${p.name}</text></g>`).join('')}
  <g class="home-pin"><circle cx="${HOME[0]}" cy="${HOME[1]}" r="14"/><circle cx="${HOME[0]}" cy="${HOME[1]}" r="7"/></g>
  <text x="${HOME[0] - 14}" y="${HOME[1] - 14}" text-anchor="end" style="font:600 12px Inter Variable, sans-serif;fill:#e2b46a">Meridian</text>`

$('places').innerHTML = PLACES.map(
  (p, i) => `<li><button type="button" data-i="${i}" aria-pressed="false"><span class="dot"></span>${p.name}<span class="time">${p.time}</span></button></li>`
).join('')

let placeTouched = false
const showPlace = (i) => {
  document.querySelectorAll('#places button').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)))
  document.querySelectorAll('#map .route').forEach((r) => r.classList.toggle('is-on', Number(r.dataset.i) === i))
  document.querySelectorAll('#map .poi').forEach((r) => r.classList.toggle('is-on', Number(r.dataset.i) === i))
}
document.querySelectorAll('#places button').forEach((b) => {
  const pick = () => {
    placeTouched = true
    showPlace(Number(b.dataset.i))
  }
  b.addEventListener('mouseenter', pick)
  b.addEventListener('focus', pick)
  b.addEventListener('click', pick)
})
let placeIndex = 0
showPlace(0)
if (!reduced) setInterval(() => !placeTouched && showPlace((placeIndex = (placeIndex + 1) % PLACES.length)), 2600)

/* ---------------------------------------------------------- site visit */

const days = $('days')
const fmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
for (let d = 1; d <= 6; d++) {
  const date = new Date(Date.now() + d * 864e5)
  days.insertAdjacentHTML('beforeend', `<label class="chip"><input type="radio" name="day" value="${date.toISOString().slice(0, 10)}" ${d === 1 ? 'checked' : ''}/>${fmt.format(date)}</label>`)
}

// "Book a visit for floor N" in the floor panel fills in the form.
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-home]')
  if (!link) return
  $('homeSelect').value = link.dataset.home
  $('visitForm').dataset.floor = link.dataset.floor
})

$('visitForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const form = e.currentTarget
  const error = $('formError')
  if (form.elements.name.value.trim().length < 2) {
    error.textContent = 'Please enter your name.'
    return form.elements.name.focus()
  }
  const digits = form.elements.phone.value.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 12) {
    error.textContent = 'Please enter a 10-digit mobile number.'
    return form.elements.phone.focus()
  }
  // A template: in a real build this goes to the developer's sales CRM.
  error.textContent = ''
  form.querySelector('button[type="submit"]').hidden = true
  $('formDone').hidden = false
})

/* --------------------------------------------------------------- reveal */

const reveal = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-in')
      entry.target.querySelector('.plan')?.classList.add('is-drawn')
      reveal.unobserve(entry.target)
    }
  },
  { rootMargin: '0px 0px -10% 0px' }
)
document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el))
