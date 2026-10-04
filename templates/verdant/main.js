import '@fontsource/lexend/300.css'
import '@fontsource/lexend/400.css'
import '@fontsource/lexend/500.css'
import './style.css'
import { startScene } from './scene.js'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const phone = () => matchMedia('(max-width: 820px)').matches

/* ---------------------------------------------------------------- scene */

startScene(document.getElementById('scene'), { reduced })

/* ------------------------------------------------------------- parallax */

// Each layer drifts against the pointer by its data-depth, eased toward the
// target every frame so it trails the hand slightly, like objects in air.
const layers = [...document.querySelectorAll('[data-depth]')].map((el) => ({
  el,
  depth: Number(el.dataset.depth),
  x: 0,
  y: 0,
}))
const pointer = { x: 0, y: 0 }

addEventListener('pointermove', (event) => {
  pointer.x = event.clientX / innerWidth - 0.5
  pointer.y = event.clientY / innerHeight - 0.5
})

const drift = () => {
  if (!phone()) {
    for (const layer of layers) {
      layer.x += (-pointer.x * layer.depth - layer.x) * 0.06
      layer.y += (-pointer.y * layer.depth * 0.6 - layer.y) * 0.06
      layer.el.style.translate = `${layer.x.toFixed(2)}px ${layer.y.toFixed(2)}px`
    }
  }
  requestAnimationFrame(drift)
}
if (!reduced) requestAnimationFrame(drift)

/* ---------------------------------------------------------- photo reveal */

// A cover of panel-coloured tiles that drop away in a random order, so each
// photo resolves out of the card rather than fading in.
const revealPhoto = (figure) => {
  const canvas = figure.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  const { width, height } = figure.getBoundingClientRect()
  const ratio = Math.min(devicePixelRatio, 2)
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  ctx.scale(ratio, ratio)

  const size = Math.max(10, Math.round(width / 18))
  const cols = Math.ceil(width / size)
  const rows = Math.ceil(height / size)
  // Earlier for tiles near the top-left corner, with noise so it reads organic.
  const tiles = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) tiles.push({ c, r, at: ((c / cols + r / rows) / 2) * 0.6 + Math.random() * 0.4 })
  }

  const paint = (progress) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#f4f3ec'
    for (const tile of tiles) {
      if (tile.at > progress) ctx.fillRect(tile.c * size, tile.r * size, size + 0.5, size + 0.5)
    }
  }

  paint(0)
  if (reduced) {
    paint(1.01)
    figure.classList.add('is-shown')
    return
  }
  const delay = Number(figure.dataset.reveal) || 0
  const duration = 900
  setTimeout(() => {
    figure.classList.add('is-shown')
    const start = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      paint(t * 1.01)
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, delay)
}

const photos = [...document.querySelectorAll('[data-reveal]')]
Promise.all(photos.map((f) => f.querySelector('img').decode().catch(() => {}))).then(() => photos.forEach(revealPhoto))

/* --------------------------------------------------------------- dock */

document.querySelectorAll('.dock-link:not(.dock-logo)').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    document.querySelector('.dock-link.is-current')?.classList.remove('is-current')
    link.classList.add('is-current')
  })
})
