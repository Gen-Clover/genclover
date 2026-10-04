import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/inter/wght.css'
import './style.css'
import { createBottleScene, FLAVOURS } from './bottle.js'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (id) => document.getElementById(id)

/* The bottle labels are drawn with the page fonts, so wait for them. */
const fontsReady = Promise.all([
  document.fonts.load('800 92px "Archivo Variable"'),
  document.fonts.load('500 30px "Inter Variable"'),
]).catch(() => {})

requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')))

/* ---------------------------------------------------------- 3D bottles */

let product = null
fontsReady.then(() => {
  createBottleScene($('heroBottle'), [{ flavour: 'green', x: 0, scale: 1 }], { camera: { y: 1.6, z: 9.5, lookY: 1.2 }, reduced })
  createBottleScene(
    $('trio'),
    [
      { flavour: 'sunrise', x: -1.15, y: 0.15, z: 0.2, tilt: 0.42, turn: 0.4 },
      { flavour: 'green', x: 0.05, y: 0.55, z: -0.3, tilt: 0, turn: 0 },
      { flavour: 'berry', x: 1.35, y: 0.05, z: 0.5, tilt: -1.15, turn: -0.3 },
    ],
    { spin: 0.12, camera: { y: 2.4, z: 11, lookY: 1.25 }, reduced }
  )
  product = createBottleScene($('productBottle'), [{ flavour: 'green' }], { camera: { y: 1.5, z: 8.4, lookY: 1.2 }, reduced })
  createBottleScene(
    $('cheers'),
    [
      { flavour: 'green', x: -1.05, y: 0.2, tilt: -0.3, turn: 0.3 },
      { flavour: 'sunrise', x: 1.05, y: 0.2, tilt: 0.3, turn: -0.3 },
    ],
    { spin: 0, interactive: false, camera: { y: 1.4, z: 7.5, lookY: 1.5 }, reduced }
  )
})

/* -------------------------------------------- story: words fill in */

const story = $('storyText')
story.innerHTML = story.textContent
  .split(' ')
  .map((w) => `<span class="w">${w}</span>`)
  .join(' ')
const words = [...story.querySelectorAll('.w')]

/* ------------------------------------------ why: cards at their own pace */

const drifting = [...document.querySelectorAll('[data-speed]')]

const onScroll = () => {
  const vh = innerHeight
  // the story fills in from when it enters until it reaches the middle
  const r = story.getBoundingClientRect()
  const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
  const lit = reduced ? words.length : Math.round(p * words.length)
  words.forEach((w, i) => w.classList.toggle('on', i < lit))

  if (!reduced && innerWidth > 860) {
    for (const el of drifting) {
      const b = el.getBoundingClientRect()
      const offset = (b.top + b.height / 2 - vh / 2) * Number(el.dataset.speed)
      el.style.transform = `translateY(${offset.toFixed(1)}px)`
    }
  }
}
addEventListener('scroll', onScroll, { passive: true })
onScroll()

/* ------------------------------------------------------- the line-up */

const LINEUP = {
  green: {
    text: 'Crisp apple, cool cucumber, leafy greens, lemon and a little ginger. Balanced, bright and easy to make a habit of.',
    notes: ['Pressed cold, never heated, so the taste stays fresh.', 'Six whole ingredients, all of them on the label.', 'No added sugar, concentrates or preservatives.'],
  },
  sunrise: {
    text: 'Orange, carrot and ripe mango with a warm pinch of turmeric. A golden glass that tastes like a good morning.',
    notes: ['Pressed cold the morning it is bottled.', 'Five whole ingredients, nothing from a powder.', 'Sweet from fruit alone, with nothing added.'],
  },
  berry: {
    text: 'Strawberry and raspberry, sharpened with apple and deepened with beetroot. Bold colour, gentle sweetness.',
    notes: ['Pressed cold for a deep, natural colour.', 'Four whole ingredients and that is all.', 'No added sugar, colouring or flavouring.'],
  },
}
const NOTE_TITLES = ['Cold pressed', 'Whole ingredients', 'Nothing added']
const order = Object.keys(LINEUP)
let current = 0

const showFlavour = (i, fromUser = true) => {
  current = (i + order.length) % order.length
  const key = order[current]
  const f = FLAVOURS[key]
  $('productName').textContent = f.name
  $('productText').textContent = LINEUP[key].text
  $('accordion').innerHTML = LINEUP[key].notes
    .map((n, k) => `<details ${k === 0 ? 'open' : ''}><summary>${NOTE_TITLES[k]}</summary><p>${n}</p></details>`)
    .join('')
  $('product').style.setProperty('--accent', f.juice)
  document.querySelectorAll('#flavourDots button').forEach((b, k) => b.setAttribute('aria-pressed', String(k === current)))
  if (fromUser) product?.setFlavour(key)
}
$('flavourDots').innerHTML = order
  .map((key) => `<button type="button" style="--c:${FLAVOURS[key].juice}" aria-label="${FLAVOURS[key].name}"></button>`)
  .join('')
document.querySelectorAll('#flavourDots button').forEach((b, k) => b.addEventListener('click', () => showFlavour(k)))
$('prev').addEventListener('click', () => showFlavour(current - 1))
$('next').addEventListener('click', () => showFlavour(current + 1))
showFlavour(0, false)

/* ------------------------------------------------- the moving ribbon */

const ribbon = $('ribbonText')
if (!reduced) {
  let offset = 0
  const step = () => {
    offset = (offset - 0.6) % 1600
    ribbon.setAttribute('startOffset', offset)
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* ---------------------------------------------------------- reviews */

const REVIEWS = [
  'Fresh, bright and not too sweet. The green one is now part of my morning, every morning.',
  'I keep a bottle in my bag after the gym. It tastes like actual fruit, which is rare.',
  'My kids ask for the orange one by name. I like that I can read every ingredient.',
  'Cold, crisp and honest. The berry juice is the best thing in my fridge right now.',
  'Delivery is quick and the bottles are always fresh. Easy habit to keep.',
]

/**
 * A halftone portrait, drawn rather than photographed: a simple head and
 * shoulders, sampled into dots whose size follows how dark each spot is.
 */
const halftone = (canvas, seed) => {
  const W = 130
  const H = 150
  const ratio = 2
  canvas.width = W * ratio
  canvas.height = H * ratio
  const src = document.createElement('canvas')
  src.width = W
  src.height = H
  const g = src.getContext('2d')
  const shade = (v) => `rgb(${v},${v},${v})`
  g.fillStyle = shade(238)
  g.fillRect(0, 0, W, H)
  const hairDark = 40 + (seed * 37) % 60
  // the sketch is drawn small, then framed closer so the face fills the card
  g.setTransform(1.45, 0, 0, 1.45, -W * 0.225, -8)
  // shoulders
  g.fillStyle = shade(120 + (seed * 23) % 60)
  g.beginPath()
  g.ellipse(W / 2, H + 14, 58, 52, 0, 0, Math.PI * 2)
  g.fill()
  // neck and face
  g.fillStyle = shade(170)
  g.fillRect(W / 2 - 11, 82, 22, 26)
  const face = g.createRadialGradient(W / 2 - 8, 62, 4, W / 2, 68, 34)
  face.addColorStop(0, shade(214))
  face.addColorStop(1, shade(150))
  g.fillStyle = face
  g.beginPath()
  g.ellipse(W / 2, 66, 25, 31, 0, 0, Math.PI * 2)
  g.fill()
  // hair, in one of a few styles
  g.fillStyle = shade(hairDark)
  g.beginPath()
  if (seed % 3 === 0) {
    g.ellipse(W / 2, 46, 30, 22, 0, Math.PI, 0)
    g.fill()
    g.fillRect(W / 2 - 30, 46, 10, 50)
    g.fillRect(W / 2 + 20, 46, 10, 50)
  } else if (seed % 3 === 1) {
    g.ellipse(W / 2, 48, 28, 20, 0, Math.PI, 0)
    g.fill()
    g.beginPath()
    g.arc(W / 2, 22, 13, 0, Math.PI * 2)
    g.fill()
  } else {
    g.ellipse(W / 2, 50, 27, 17, 0, Math.PI * 1.05, -0.05)
    g.fill()
  }
  // eyes and smile
  g.fillStyle = shade(60)
  g.beginPath()
  g.arc(W / 2 - 9, 66, 2.4, 0, Math.PI * 2)
  g.arc(W / 2 + 9, 66, 2.4, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = shade(90)
  g.lineWidth = 2
  g.beginPath()
  g.arc(W / 2, 78, 7, 0.2, Math.PI - 0.2)
  g.stroke()

  g.setTransform(1, 0, 0, 1, 0, 0)
  const data = g.getImageData(0, 0, W, H).data
  const out = canvas.getContext('2d')
  out.fillStyle = '#f6f6f2'
  out.fillRect(0, 0, canvas.width, canvas.height)
  out.fillStyle = '#1d1f1a'
  const step = 3.2
  for (let y = 0; y < H; y += step) {
    for (let x = (Math.round(y / step) % 2) * (step / 2); x < W; x += step) {
      const v = data[(Math.floor(y) * W + Math.floor(x)) * 4] / 255
      const r = (1 - v) * step * 0.62
      if (r < 0.15) continue
      out.beginPath()
      out.arc(x * ratio, y * ratio, r * ratio, 0, Math.PI * 2)
      out.fill()
    }
  }
}

const reviews = $('reviews')
reviews.innerHTML = REVIEWS.map(
  (q) => `<figure class="review"><canvas aria-hidden="true"></canvas><div><blockquote>“${q}”</blockquote><figcaption>Customer name · sample review</figcaption></div></figure>`
).join('')
const cards = [...reviews.querySelectorAll('.review')]
cards.forEach((c, i) => halftone(c.querySelector('canvas'), i + 1))

let centre = 1
let touched = false
const placeReviews = () => {
  const gap = Math.min(470, innerWidth * 0.86)
  cards.forEach((c, i) => {
    let d = i - centre
    if (d > cards.length / 2) d -= cards.length
    if (d < -cards.length / 2) d += cards.length
    const on = d === 0
    c.style.transform = `translateX(calc(-50% + ${d * gap}px)) scale(${on ? 1 : 0.9})`
    c.style.opacity = Math.abs(d) > 1 ? '0' : on ? '1' : '0.75'
    c.style.zIndex = on ? 2 : 1
    c.style.pointerEvents = Math.abs(d) > 1 ? 'none' : 'auto'
  })
}
cards.forEach((c, i) =>
  c.addEventListener('click', () => {
    touched = true
    centre = i
    placeReviews()
  })
)
reviews.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  touched = true
  centre = (centre + (e.key === 'ArrowRight' ? 1 : -1) + cards.length) % cards.length
  placeReviews()
})
addEventListener('resize', placeReviews)
placeReviews()
if (!reduced)
  setInterval(() => {
    if (touched) return
    centre = (centre + 1) % cards.length
    placeReviews()
  }, 3800)

/* ----------------------------------------------------------- fades */

const faders = document.querySelectorAll('.sheet > *, .story > .chip, .story__scene, .words > .chip, .words > h2, .footer__top')
faders.forEach((el) => el.classList.add('fade'))
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    }),
  { rootMargin: '0px 0px -8% 0px' }
)
faders.forEach((el) => io.observe(el))
