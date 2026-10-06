import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/inter/wght.css'
import './style.css'
import { createStudio } from './models.js'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (id) => document.getElementById(id)

const COLOURS = { Clay: '#c4562a', Ocean: '#2f5f9e', Sage: '#8fa35c', Slate: '#4b5563', Plum: '#5b3f7a' }

const CATEGORIES = [
  { name: 'Doctor stools', kind: 'doctor', count: 6, text: 'A contoured seat and a backrest that follows the spine, for the dentist who works seated all day.' },
  { name: 'Assistant stools', kind: 'assistant', count: 4, text: 'Taller, with a foot ring and a curved arm to lean on while reaching across the chair.' },
  { name: 'Saddle chairs', kind: 'saddle', count: 3, text: 'An open hip angle that keeps the back upright through long procedures.' },
  { name: 'Headrests', kind: 'headrest', count: 5, text: 'Replacement headrests in every colour, with a quick-fit mount.' },
  { name: 'Instrument trays', kind: 'tray', count: 4, text: 'Steady, easy-wipe trays on a swing arm, sized for a full set of instruments.' },
  { name: 'Foot controls', kind: 'footControl', count: 2, text: 'A low, weighted pedal that stays where you put it.' },
]

const PRODUCTS = [
  { name: 'Doctor Stool', model: 'Model S1', kind: 'doctor', colour: 'Clay', tag: 'Best seller' },
  { name: 'Assistant Stool', model: 'Model S2', kind: 'assistant', colour: 'Slate', tag: 'With foot ring' },
  { name: 'Saddle Chair', model: 'Model S3', kind: 'saddle', colour: 'Ocean', tag: 'Ergonomic' },
  { name: 'Chair Headrest', model: 'Model H1', kind: 'headrest', colour: 'Sage', tag: 'Quick fit' },
  { name: 'Instrument Tray', model: 'Model T1', kind: 'tray', colour: 'Slate', tag: 'Swing arm' },
  { name: 'Foot Control', model: 'Model F1', kind: 'footControl', colour: 'Clay', tag: 'Weighted' },
]

/* hero: a stool turning in the room */
const hero = createStudio($('heroModel'), { reduced, spin: 0.3 })
hero?.show('doctor', COLOURS.Clay)

/* categories beside the turning product */
const stage = createStudio($('stageModel'), { reduced, spin: 0.5, zoom: 0.95 })
let current = 0
let colour = 'Clay'
let touched = false

$('cats').innerHTML = CATEGORIES.map(
  (c, i) => `<li><button type="button" data-i="${i}"><span class="cat__top">${c.name}<small>${c.count} models</small></span><span class="cat__text">${c.text}</span></button></li>`
).join('')
$('swatches').innerHTML = Object.entries(COLOURS)
  .map(([n, c]) => `<button type="button" data-c="${n}" style="--c:${c}" aria-label="${n}"></button>`)
  .join('')

const pick = (i, c = colour) => {
  current = i
  colour = c
  document.querySelectorAll('#cats button').forEach((b, k) => b.classList.toggle('is-on', k === i))
  document.querySelectorAll('#swatches button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === c)))
  $('stageNum').textContent = String(i + 1).padStart(2, '0')
  stage?.show(CATEGORIES[i].kind, COLOURS[c])
}
document.querySelectorAll('#cats button').forEach((b) =>
  b.addEventListener('click', () => {
    touched = true
    pick(Number(b.dataset.i))
  })
)
document.querySelectorAll('#swatches button').forEach((b) =>
  b.addEventListener('click', () => {
    touched = true
    pick(current, b.dataset.c)
  })
)
pick(0)
if (!reduced) setInterval(() => !touched && pick((current + 1) % CATEGORIES.length), 4200)

/* product grid: each picture is a still rendered from the 3D model */
const snap = createStudio($('snap'), { reduced: true, zoom: 0.9 })
const price = () => '₹XX,XXX'
$('grid').innerHTML = PRODUCTS.map(
  (p, i) => `<article class="card reveal" style="transition-delay:${i * 70}ms">
    <div class="card__img"><img alt="${p.name} in ${p.colour}" ${snap ? `src="${snap.snapshot(p.kind, COLOURS[p.colour])}"` : ''} /><span class="card__tag">${p.tag}</span></div>
    <div class="card__body"><h3>${p.name}</h3><p>${p.model} · ${p.colour} upholstery</p>
      <div class="card__row"><span class="price">${price()}</span><button type="button" class="add" data-name="${p.name}">Add to cart</button></div></div>
  </article>`
).join('')

/* a working cart, for the demo */
let count = 0
const toast = $('toast')
let toastTimer
document.querySelectorAll('.add').forEach((b) =>
  b.addEventListener('click', () => {
    count++
    $('cartCount').textContent = count
    const cart = document.querySelector('.cart')
    cart.classList.remove('bump')
    void cart.offsetWidth
    cart.classList.add('bump')
    b.classList.add('is-added')
    b.textContent = 'Added ✓'
    setTimeout(() => {
      b.classList.remove('is-added')
      b.textContent = 'Add to cart'
    }, 1600)
    toast.textContent = `${b.dataset.name} added to your cart`
    toast.classList.add('is-on')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2200)
  })
)

/* nav turns solid after the hero; cards rise in */
addEventListener('scroll', () => document.querySelector('.nav').classList.toggle('is-solid', scrollY > 60), { passive: true })
const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))), { rootMargin: '0px 0px -8% 0px' })
document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
