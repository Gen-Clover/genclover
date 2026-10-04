import '@fontsource-variable/inter/wght.css'
import './style.css'
import { drawAvatars } from './avatars.js'

drawAvatars()

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

/* ----------------------------------------------------------------- hero */

const hero = document.querySelector('.hero__image img')
const markLoaded = () => requestAnimationFrame(() => document.body.classList.add('is-loaded'))
if (hero.complete) markLoaded()
else hero.addEventListener('load', markLoaded, { once: true })

/* -------------------------------------------------- reveal on scroll */

// Siblings that arrive together are staggered slightly, so a row of cards
// settles left to right instead of all at once.
const revealer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const siblings = [...entry.target.parentElement.children].filter((el) => el.classList.contains('reveal'))
      entry.target.style.setProperty('--stagger', `${Math.max(0, siblings.indexOf(entry.target)) * 70}ms`)
      entry.target.classList.add('is-in')
      revealer.unobserve(entry.target)
    }
  },
  { rootMargin: '0px 0px -8% 0px' }
)
document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el))

/* ----------------------------------------- scrolled state, section rail */

const onScroll = () => document.body.classList.toggle('is-scrolled', scrollY > innerHeight * 0.6)
addEventListener('scroll', onScroll, { passive: true })
onScroll()

const railLinks = [...document.querySelectorAll('.rail a')]
const sections = [...document.querySelectorAll('[data-section]')]
const tracker = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const index = sections.indexOf(entry.target)
      railLinks.forEach((link, i) => link.classList.toggle('is-current', i === index))
    }
  },
  { rootMargin: '-45% 0px -50% 0px' }
)
sections.forEach((section) => tracker.observe(section))

/* ----------------------------------------------------------- care cards */

// One card is always "lit": the one under the pointer or keyboard focus.
const cards = [...document.querySelectorAll('.care__card')]
const light = (card) => cards.forEach((c) => c.classList.toggle('is-active', c === card))
cards.forEach((card) => {
  card.addEventListener('pointerenter', () => light(card))
  card.addEventListener('focus', () => light(card))
})

/* -------------------------------------------------------------- reviews */

const track = document.querySelector('.reviews__track')
const pageBy = (dir) => {
  const card = track.querySelector('.review')
  const step = card.getBoundingClientRect().width + 40
  track.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' })
}
document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => pageBy(Number(button.dataset.scroll))))
track.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); pageBy(1) }
  if (e.key === 'ArrowLeft') { e.preventDefault(); pageBy(-1) }
})

// Drag to scroll with a mouse; touch already scrolls natively.
let drag = null
track.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse') return
  drag = { x: e.clientX, left: track.scrollLeft, moved: false }
  track.setPointerCapture(e.pointerId)
})
track.addEventListener('pointermove', (e) => {
  if (!drag) return
  const dx = e.clientX - drag.x
  if (Math.abs(dx) > 3) {
    drag.moved = true
    track.classList.add('is-dragging')
  }
  track.scrollLeft = drag.left - dx
})
const endDrag = () => {
  if (!drag) return
  drag = null
  track.classList.remove('is-dragging')
}
track.addEventListener('pointerup', endDrag)
track.addEventListener('pointercancel', endDrag)

/* ------------------------------------------------------------------ faq */

// Only one answer open at a time keeps the list short and scannable.
const answers = [...document.querySelectorAll('.faq__list details')]
answers.forEach((d) =>
  d.addEventListener('toggle', () => {
    if (d.open) answers.forEach((other) => other !== d && (other.open = false))
  })
)

/* -------------------------------------------------------------- booking */

const dialog = document.getElementById('booking')
const form = document.getElementById('bookingForm')
const done = document.getElementById('bookingDone')
const error = document.getElementById('bookingError')

document.querySelectorAll('[data-book]').forEach((button) =>
  button.addEventListener('click', () => {
    form.hidden = false
    done.hidden = true
    error.textContent = ''
    dialog.showModal()
  })
)
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close() // a click on the backdrop
})
done.querySelector('[data-close]').addEventListener('click', () => dialog.close())

form.addEventListener('submit', (e) => {
  if (e.submitter?.value === 'cancel') return
  e.preventDefault()
  const name = form.elements.name.value.trim()
  const digits = form.elements.phone.value.replace(/\D/g, '')
  if (name.length < 2) {
    error.textContent = 'Please enter your name.'
    form.elements.name.focus()
    return
  }
  if (digits.length < 10 || digits.length > 12) {
    error.textContent = 'Please enter a 10-digit mobile number.'
    form.elements.phone.focus()
    return
  }
  // A template: in a real build this goes to the clinic's booking inbox or CRM.
  form.hidden = true
  done.hidden = false
  form.reset()
})
