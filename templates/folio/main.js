import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/newsreader/wght.css'
import '@fontsource-variable/newsreader/wght-italic.css'
import './style.css'

/* ------------------------------------------------------------- plates */

const asset = (name) => new URL(`./assets/${name}`, import.meta.url).href

const PLATES = [
  { file: asset('plate-prison.jpg'), title: 'The Prisons, from the Water', place: 'Riva degli Schiavoni' },
  { file: asset('plate-bridge-of-sighs.jpg'), title: 'Bridge of Sighs', place: 'Rio di Palazzo' },
  { file: asset('plate-mendicanti.jpg'), title: 'Rio dei Mendicanti', place: 'Castello' },
  { file: asset('plate-canal.jpg'), title: 'Boats at the Mooring', place: 'A side canal' },
  { file: asset('plate-ponte-panada.jpg'), title: 'Ponte Panada', place: 'Fondamenta Nuove' },
  { file: asset('plate-san-giuseppe.jpg'), title: 'San Giuseppe', place: 'Castello' },
  { file: asset('plate-grand-canal.jpg'), title: 'The Grand Canal', place: 'Canal Grande' },
  { file: asset('plate-rialto.jpg'), title: 'Under the Rialto', place: 'San Polo' },
  { file: asset('plate-salute.jpg'), title: 'Santa Maria della Salute', place: 'Dorsoduro' },
]

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const RATIO = 1.44
const STRIPS = 14
const CURL = 34 // degrees of curl at the middle of a turn
const MAGNIFY = 2.4

const $ = (id) => document.getElementById(id)
const desk = $('desk')
const tilt = $('tilt')
const book = $('book')
const loupe = $('loupe')
const lens = $('lens')
const captionBox = $('caption')
const hint = $('hint')

/* -------------------------------------------------------- spread art */

// Each spread is painted once onto a canvas: paper, the watercolour soaked
// into it, the fold of the gutter and a pencilled caption. The page turn,
// the magnifier and the zoom all read from that one picture.

const ART_W = 2200
const ART_H = Math.round(ART_W / RATIO)

let paperTile
const makePaperTile = () => {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#f5eee1'
  g.fillRect(0, 0, 512, 512)
  const pixels = g.getImageData(0, 0, 512, 512)
  for (let i = 0; i < pixels.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14
    pixels.data[i] += n
    pixels.data[i + 1] += n
    pixels.data[i + 2] += n * 0.9
  }
  g.putImageData(pixels, 0, 0)
  // a few long fibres, the way cotton paper shows under raking light
  g.strokeStyle = 'rgba(120, 100, 70, 0.07)'
  for (let i = 0; i < 70; i++) {
    g.beginPath()
    const x = Math.random() * 512
    const y = Math.random() * 512
    g.moveTo(x, y)
    g.quadraticCurveTo(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40, x + (Math.random() - 0.5) * 70, y + (Math.random() - 0.5) * 70)
    g.stroke()
  }
  return c
}

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

const spreadCache = new Map()

const paintSpread = async (index) => {
  const plate = PLATES[index]
  const [img] = await Promise.all([loadImage(plate.file), document.fonts.load('italic 40px "Instrument Serif"')])
  paperTile ??= makePaperTile()

  const c = document.createElement('canvas')
  c.width = ART_W
  c.height = ART_H
  const g = c.getContext('2d')

  g.fillStyle = g.createPattern(paperTile, 'repeat')
  g.fillRect(0, 0, ART_W, ART_H)

  // painting: fitted inside the margins, multiplied so it sits in the paper
  const maxW = ART_W * 0.86
  const maxH = ART_H * 0.76
  const scale = Math.min(maxW / img.width, maxH / img.height)
  const w = img.width * scale
  const h = img.height * scale
  const x = (ART_W - w) / 2
  const y = ART_H * 0.075 + (maxH - h) / 2
  g.save()
  g.globalCompositeOperation = 'multiply'
  g.globalAlpha = 0.97
  g.drawImage(img, x, y, w, h)
  g.restore()

  // the fold: darker in the gutter, lighter on the rise just beside it
  const fold = g.createLinearGradient(ART_W / 2 - ART_W * 0.08, 0, ART_W / 2 + ART_W * 0.08, 0)
  fold.addColorStop(0, 'rgba(70, 50, 25, 0)')
  fold.addColorStop(0.38, 'rgba(255, 250, 240, 0.12)')
  fold.addColorStop(0.47, 'rgba(70, 50, 25, 0.16)')
  fold.addColorStop(0.5, 'rgba(70, 50, 25, 0.34)')
  fold.addColorStop(0.53, 'rgba(70, 50, 25, 0.16)')
  fold.addColorStop(0.62, 'rgba(255, 250, 240, 0.12)')
  fold.addColorStop(1, 'rgba(70, 50, 25, 0)')
  g.fillStyle = fold
  g.fillRect(0, 0, ART_W, ART_H)

  // outer edges catch a little shadow
  const edges = g.createLinearGradient(0, 0, ART_W, 0)
  edges.addColorStop(0, 'rgba(80, 60, 30, 0.12)')
  edges.addColorStop(0.03, 'rgba(80, 60, 30, 0)')
  edges.addColorStop(0.97, 'rgba(80, 60, 30, 0)')
  edges.addColorStop(1, 'rgba(80, 60, 30, 0.12)')
  g.fillStyle = edges
  g.fillRect(0, 0, ART_W, ART_H)

  // pencilled caption and folio numbers
  g.fillStyle = 'rgba(62, 52, 40, 0.58)'
  g.font = 'italic 40px "Instrument Serif"'
  g.textBaseline = 'alphabetic'
  g.fillText(`Pl. ${String(index + 1).padStart(2, '0')}  ·  ${plate.title}`, ART_W * 0.07, ART_H * 0.93)
  g.textAlign = 'right'
  g.fillText(plate.place, ART_W * 0.93, ART_H * 0.93)
  g.font = 'italic 30px "Instrument Serif"'
  g.fillStyle = 'rgba(62, 52, 40, 0.38)'
  g.textAlign = 'center'
  g.fillText(String(index * 2 + 1), ART_W * 0.25, ART_H * 0.975)
  g.fillText(String(index * 2 + 2), ART_W * 0.75, ART_H * 0.975)

  const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', 0.88))
  return URL.createObjectURL(blob)
}

const spread = (index) => {
  if (!spreadCache.has(index)) spreadCache.set(index, paintSpread(index))
  return spreadCache.get(index)
}

/* ------------------------------------------------------------- state */

let current = 0
let turn = null // { a, b, p }: p = 0 shows spread a, p = 1 shows spread b
let urls = {}
let zoom = 1
let pan = { x: 0, y: 0 }

const width = () => desk.clientWidth
const bg = (url) => `url("${url}")`

/* ------------------------------------------------------------ render */

const el = (tag, className) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  return node
}

let strips = []
let fall = null

const build = () => {
  book.textContent = ''
  strips = []
  fall = null
  const W = width()

  if (!turn) {
    const full = el('div', 'spread')
    full.style.backgroundImage = bg(urls[current])
    book.append(full)
  } else {
    const left = el('div', 'half half--left')
    left.style.backgroundImage = bg(urls[turn.a])
    const right = el('div', 'half half--right')
    right.style.backgroundImage = bg(urls[turn.b])
    fall = el('div', 'fall')
    const leaf = el('div', 'leaf')
    leaf.style.setProperty('--strips', STRIPS)
    const stripW = W / 2 / STRIPS
    let host = leaf
    for (let i = 0; i < STRIPS; i++) {
      const strip = el('div', i === STRIPS - 1 ? 'strip strip--edge' : 'strip')
      const front = el('div', 'face face--front')
      const back = el('div', 'face face--back')
      // the front shows spread a's right page; the back, once the leaf lies
      // on the left, shows spread b's left page
      front.style.backgroundImage = bg(urls[turn.a])
      front.style.backgroundPosition = `${-(W / 2 + i * stripW)}px 0`
      back.style.backgroundImage = bg(urls[turn.b])
      back.style.backgroundPosition = `${-(W / 2 - (i + 1) * stripW)}px 0`
      strip.append(front, back)
      host.append(strip)
      host = strip
      strips.push({ strip, front, back })
    }
    book.append(left, right, fall, leaf)
  }

  const back = el('button', 'hit hit--back')
  back.setAttribute('aria-label', 'Previous plate')
  back.tabIndex = -1
  const next = el('button', 'hit hit--next')
  next.setAttribute('aria-label', 'Next plate')
  next.tabIndex = -1
  book.append(back, next)
  book.setAttribute('aria-label', `Plate ${current + 1}: ${PLATES[current].title}, ${PLATES[current].place}`)
  pose()
}

/** Bend the leaf for the current progress, and light each strip by its angle. */
const pose = () => {
  if (!turn) return
  const p = turn.p
  const bend = Math.sin(Math.PI * p) * CURL
  const first = -180 * p + bend
  const step = (-2 * bend) / STRIPS
  let angle = first
  strips.forEach(({ strip, front, back }, i) => {
    strip.style.transform = `rotateY(${(i === 0 ? first : step).toFixed(3)}deg)`
    const a = Math.abs(Math.cos((angle * Math.PI) / 180))
    const b = Math.abs(Math.cos(((angle + step) * Math.PI) / 180))
    for (const face of [front, back]) {
      face.style.setProperty('--shade-a', ((1 - a) * 0.5).toFixed(3))
      face.style.setProperty('--shade-b', ((1 - b) * 0.5).toFixed(3))
    }
    angle += step
  })
  fall?.style.setProperty('--lift', Math.sin(Math.PI * p).toFixed(3))
}

/* ----------------------------------------------------------- captions */

const showCaption = (index) => {
  const plate = PLATES[index]
  const title = el('p', 'plate-title is-arriving')
  title.textContent = plate.title
  const meta = el('p', 'plate-meta is-arriving')
  meta.textContent = `Plate ${String(index + 1).padStart(2, '0')} of ${PLATES.length} · ${plate.place}`
  for (const old of captionBox.children) {
    old.classList.add('is-leaving')
    setTimeout(() => old.remove(), 400)
  }
  captionBox.append(title, meta)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    title.classList.remove('is-arriving')
    meta.classList.remove('is-arriving')
  }))
  document.querySelectorAll('.plate-index li').forEach((li, i) => li.classList.toggle('is-current', i === index))
  $('back').disabled = index === 0
  $('next').disabled = index === PLATES.length - 1
}

/* -------------------------------------------------------------- turns */

let animating = false

const prepare = async (a, b) => {
  const [ua, ub] = await Promise.all([spread(a), spread(b)])
  urls[a] = ua
  urls[b] = ub
}

const animateTo = (target, duration) =>
  new Promise((resolve) => {
    const from = turn.p
    if (reduced || duration <= 0) {
      turn.p = target
      pose()
      return resolve()
    }
    const start = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      turn.p = from + (target - from) * eased
      pose()
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })

const settle = (index) => {
  current = index
  turn = null
  build()
  showCaption(current)
  updateLens()
  // have the neighbours ready before anyone asks for them
  if (current + 1 < PLATES.length) spread(current + 1)
  if (current > 0) spread(current - 1)
}

/** Turn from the current spread to any other, forwards or back. */
const goTo = async (target) => {
  if (animating || target === current || target < 0 || target >= PLATES.length) return
  animating = true
  const forward = target > current
  const a = forward ? current : target
  const b = forward ? target : current
  await prepare(a, b)
  turn = { a, b, p: forward ? 0 : 1 }
  build()
  hideLensDuringTurn(true)
  await animateTo(forward ? 1 : 0, 900)
  settle(target)
  hideLensDuringTurn(false)
  animating = false
  hint.classList.add('is-done')
}

$('next').addEventListener('click', () => goTo(current + 1))
$('back').addEventListener('click', () => goTo(current - 1))
addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return
  if (e.key === 'ArrowRight') goTo(current + 1)
  if (e.key === 'ArrowLeft') goTo(current - 1)
})

/* ------------------------------------------------------ drag to turn */

let drag = null

book.addEventListener('pointerdown', async (e) => {
  if (animating || e.button !== 0) return
  const rect = book.getBoundingClientRect()
  if (zoom > 1) {
    drag = { mode: 'pan', x: e.clientX, y: e.clientY, start: { ...pan } }
    book.setPointerCapture(e.pointerId)
    return
  }
  const onRight = e.clientX - rect.left > rect.width / 2
  if (onRight && current === PLATES.length - 1) return
  if (!onRight && current === 0) return
  drag = { mode: 'turn', forward: onRight, x: e.clientX, moved: false, id: e.pointerId }
  book.setPointerCapture(e.pointerId)
  animating = true
  const a = onRight ? current : current - 1
  const b = onRight ? current + 1 : current
  await prepare(a, b)
  if (!drag) return
  turn = { a, b, p: onRight ? 0 : 1 }
  build()
  hideLensDuringTurn(true)
})

book.addEventListener('pointermove', (e) => {
  if (!drag) return
  if (drag.mode === 'pan') {
    pan.x = drag.start.x + (e.clientX - drag.x) / zoom
    pan.y = drag.start.y + (e.clientY - drag.y) / zoom
    clampPan()
    applyZoom()
    return
  }
  const dx = e.clientX - drag.x
  if (Math.abs(dx) > 4) drag.moved = true
  if (!turn) return
  const travel = width() * 0.75
  turn.p = drag.forward ? Math.min(1, Math.max(0, -dx / travel)) : Math.min(1, Math.max(0, 1 - dx / travel))
  pose()
})

const endDrag = async () => {
  if (!drag) return
  const d = drag
  drag = null
  if (d.mode === 'pan') return
  // wait for the spreads if the pointer was faster than the paint
  while (!turn) await new Promise((r) => setTimeout(r, 16))
  const { a, b } = turn
  let toB
  if (!d.moved) toB = d.forward // a tap turns the page
  else toB = d.forward ? turn.p > 0.22 : turn.p > 0.78
  await animateTo(toB ? 1 : 0, 600 * (toB ? 1 - turn.p : turn.p) + 150)
  settle(toB ? b : a)
  hideLensDuringTurn(false)
  animating = false
  if (toB !== !d.forward || d.moved) hint.classList.add('is-done')
}
book.addEventListener('pointerup', endDrag)
book.addEventListener('pointercancel', endDrag)

/* -------------------------------------------------------------- tilt */

desk.addEventListener('pointermove', (e) => {
  if (drag || zoom > 1 || reduced) return
  const r = desk.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  tilt.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`
})
desk.addEventListener('pointerleave', () => (tilt.style.transform = ''))

/* -------------------------------------------------------------- zoom */

const LEVELS = [1, 1.25, 1.5, 2, 2.5]

const clampPan = () => {
  const W = width()
  const H = W / RATIO
  const maxX = (W * (zoom - 1)) / (2 * zoom)
  const maxY = (H * (zoom - 1)) / (2 * zoom)
  pan.x = Math.max(-maxX, Math.min(maxX, pan.x))
  pan.y = Math.max(-maxY, Math.min(maxY, pan.y))
}

const applyZoom = () => {
  book.style.transform = zoom === 1 ? '' : `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
  desk.classList.toggle('is-zoomed', zoom > 1)
  $('zoomLevel').textContent = `${Math.round(zoom * 100)}%`
  loupe.classList.toggle('is-off', zoom > 1 || !loupeOn)
}

const stepZoom = (dir) => {
  const i = LEVELS.indexOf(zoom)
  zoom = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, i + dir))]
  if (zoom === 1) pan = { x: 0, y: 0 }
  tilt.style.transform = ''
  clampPan()
  applyZoom()
}
$('zoomIn').addEventListener('click', () => stepZoom(1))
$('zoomOut').addEventListener('click', () => stepZoom(-1))

/* ------------------------------------------------------------- loupe */

let loupeOn = true
let lensAt = { x: 0, y: 0 } // centre of the lens, in book pixels

const updateLens = () => {
  const W = width()
  const H = W / RATIO
  const size = loupe.offsetWidth
  loupe.style.transform = `translate(${lensAt.x - size / 2}px, ${lensAt.y - size / 2}px)`
  if (!urls[current]) return
  lens.style.backgroundImage = bg(urls[current])
  lens.style.backgroundSize = `${W * MAGNIFY}px ${H * MAGNIFY}px`
  lens.style.backgroundPosition = `${-(lensAt.x * MAGNIFY - size / 2)}px ${-(lensAt.y * MAGNIFY - size / 2)}px`
}

const hideLensDuringTurn = (hidden) => {
  loupe.style.opacity = hidden ? '0' : ''
}

let lensDrag = null
loupe.addEventListener('pointerdown', (e) => {
  e.stopPropagation()
  lensDrag = { x: e.clientX, y: e.clientY, start: { ...lensAt } }
  loupe.setPointerCapture(e.pointerId)
  hint.classList.add('is-done')
})
loupe.addEventListener('pointermove', (e) => {
  if (!lensDrag) return
  const W = width()
  lensAt.x = Math.max(0, Math.min(W, lensDrag.start.x + e.clientX - lensDrag.x))
  lensAt.y = Math.max(0, Math.min(W / RATIO, lensDrag.start.y + e.clientY - lensDrag.y))
  updateLens()
})
loupe.addEventListener('pointerup', () => (lensDrag = null))

$('loupeToggle').addEventListener('click', (e) => {
  loupeOn = !loupeOn
  e.currentTarget.setAttribute('aria-pressed', String(loupeOn))
  applyZoom()
})

/* ------------------------------------------------------------- index */

const list = $('plateIndex')
PLATES.forEach((plate, i) => {
  const li = el('li')
  const button = el('button')
  button.type = 'button'
  button.innerHTML = `<span class="num">${String(i + 1).padStart(2, '0')}</span><span class="name"></span><span class="place"></span>`
  button.querySelector('.name').textContent = plate.title
  button.querySelector('.place').textContent = plate.place
  button.addEventListener('click', () => {
    document.querySelector('.opening').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    setTimeout(() => goTo(i), reduced ? 0 : 450)
  })
  li.append(button)
  list.append(li)
})

/* ------------------------------------------------------- margin plants */

// The botanical plates are printed on old, yellowed paper. Measure that
// paper from the corners and fade everything close to it, leaving only the
// plant, so it sits directly on our page.
const liftPlant = async (img) => {
  const source = await loadImage(img.currentSrc || img.src)
  const c = document.createElement('canvas')
  c.width = source.naturalWidth
  c.height = source.naturalHeight
  const g = c.getContext('2d', { willReadFrequently: true })
  g.drawImage(source, 0, 0)
  const data = g.getImageData(0, 0, c.width, c.height)
  const px = data.data
  const sample = (x, y) => {
    const i = (Math.floor(y) * c.width + Math.floor(x)) * 4
    return [px[i], px[i + 1], px[i + 2]]
  }
  const corners = [[0.04, 0.04], [0.96, 0.04], [0.04, 0.96], [0.96, 0.96], [0.5, 0.03]].map(([x, y]) => sample(x * c.width, y * c.height))
  const paper = [0, 1, 2].map((k) => corners.reduce((sum, rgb) => sum + rgb[k], 0) / corners.length)
  for (let i = 0; i < px.length; i += 4) {
    const d = Math.hypot(px[i] - paper[0], px[i + 1] - paper[1], px[i + 2] - paper[2])
    px[i + 3] = Math.round(255 * Math.min(1, Math.max(0, (d - 26) / 60)))
  }
  g.putImageData(data, 0, 0)
  const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/png'))
  img.style.mixBlendMode = 'normal'
  img.src = URL.createObjectURL(blob)
}
document.querySelectorAll('.margin-plant, .about__plant').forEach((img) => liftPlant(img).catch(() => {}))

/* -------------------------------------------------------------- start */

const start = async () => {
  urls[0] = await spread(0)
  const W = width()
  lensAt = { x: W * 0.68, y: (W / RATIO) * 0.52 }
  settle(0)
}

let resizeTimer
addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    if (turn) return
    const W = width()
    lensAt.x = Math.min(lensAt.x, W)
    lensAt.y = Math.min(lensAt.y, W / RATIO)
    clampPan()
    applyZoom()
    build()
    updateLens()
  }, 120)
})

start()
