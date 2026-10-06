import '@fontsource-variable/archivo/wght.css'
import '@fontsource-variable/inter/wght.css'
import './style.css'
import { buildChair, createStage, Group, BoxGeometry, Mesh, MeshStandardMaterial } from './chair.js'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (id) => document.getElementById(id)
const COLOURS = { Ocean: '#2f5f9e', Graphite: '#3a3f47', Sage: '#7c9a5a', Caramel: '#b9784a', Plum: '#6b3f7a' }

/* ---------------- hero: one chair, turning and reclining */
const hero = createStage($('hero'), { camera: [7.4, 3.2, 7.4], look: [-1.6, 1.15, 0], fov: 28 })
let heroChair
if (hero) {
  heroChair = buildChair(COLOURS.Ocean)
  hero.scene.add(heroChair)
  hero.loop((t) => {
    heroChair.rotation.y = reduced ? -0.5 : -0.5 + Math.sin(t * 0.25) * 0.6
    const recline = reduced ? 0.3 : (Math.sin(t * 0.6) * 0.5 + 0.5) * 0.55
    heroChair.userData.hinge.rotation.z = -recline
    $('recline').textContent = `${Math.round(recline * 57)}°`
  })
}
$('swatches').innerHTML = Object.entries(COLOURS)
  .map(([n, c], i) => `<button type="button" style="--c:${c}" aria-label="${n}" aria-pressed="${i === 0}"></button>`)
  .join('')
document.querySelectorAll('#swatches button').forEach((b, i) =>
  b.addEventListener('click', () => {
    heroChair?.userData.vinyl.color.set(Object.values(COLOURS)[i])
    document.querySelectorAll('#swatches button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
  })
)

/* ---------------- the production line */
const STAGES = ['base', 'seat', 'back', 'unit', 'light']
const SPACING = 3.2
const COUNT = 7
const line = createStage($('lineCanvas'), { camera: [0, 7, 11], look: [0, 0.6, 0], fov: 34 })
if (line) {
  // the conveyor: a belt and its rollers
  const belt = new Mesh(new BoxGeometry(COUNT * SPACING, 0.12, 1.6), new MeshStandardMaterial({ color: '#253349', roughness: 0.7 }))
  belt.position.y = -0.06
  belt.receiveShadow = true
  line.scene.add(belt)
  const stripes = new Group()
  for (let i = 0; i < 40; i++) {
    const s = new Mesh(new BoxGeometry(0.05, 0.01, 1.6), new MeshStandardMaterial({ color: '#50a7ff', emissive: '#50a7ff', emissiveIntensity: 0.4 }))
    s.position.set(-COUNT * SPACING / 2 + i * 0.6, 0.005, 0)
    stripes.add(s)
  }
  line.scene.add(stripes)
  // station gantries
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * SPACING
    const frame = new Group()
    ;[-0.95, 0.95].forEach((z) => {
      const post = new Mesh(new BoxGeometry(0.08, 3, 0.08), new MeshStandardMaterial({ color: '#3d4b63' }))
      post.position.set(x, 1.5, z)
      frame.add(post)
    })
    const beam = new Mesh(new BoxGeometry(0.1, 0.1, 2), new MeshStandardMaterial({ color: '#50a7ff', emissive: '#1e5aa8', emissiveIntensity: 0.6 }))
    beam.position.set(x, 3, 0)
    frame.add(beam)
    line.scene.add(frame)
  }

  const chairs = Array.from({ length: COUNT }, (_, i) => {
    const c = buildChair(Object.values(COLOURS)[i % 5])
    c.scale.setScalar(0.62)
    c.userData.offset = i * SPACING
    line.scene.add(c)
    return c
  })
  const span = COUNT * SPACING
  const lights = [...document.querySelectorAll('#stations li')]

  line.loop((t) => {
    const travel = reduced ? 0 : (t * 0.9) % span
    stripes.position.x = reduced ? 0 : (t * 0.9) % 0.6
    let active = -1
    chairs.forEach((c) => {
      const x = ((c.userData.offset + travel) % span) - span / 2
      c.position.set(x, 0, 0)
      // a stage appears once the chair has reached that station, scaling in
      STAGES.forEach((name, i) => {
        const at = (i - 2) * SPACING - 0.6
        const k = Math.min(1, Math.max(0, (x - at) / 0.6))
        c.userData.stages[name].scale.setScalar(Math.max(0.0001, k))
        if (Math.abs(x - (i - 2) * SPACING) < 0.5) active = i
      })
      c.userData.hinge.rotation.z = -0.25
    })
    lights.forEach((l, i) => l.classList.toggle('is-on', i === active))
  })
}

/* ---------------- the range: stills rendered from the model */
const snap = document.createElement('canvas')
snap.className = 'snap'
document.body.append(snap)
const RANGE = [
  ['VX-7 Signature', 'Flagship unit with memory positions and a ceiling-free light arm.', 'Ocean'],
  ['VX-5 Practice', 'The everyday workhorse: quiet lift, easy-clean seams.', 'Graphite'],
  ['VX-3 Compact', 'A smaller footprint for tight surgeries and mobile clinics.', 'Caramel'],
]
const studio = createStage(snap, { camera: [5, 3, 5.6], look: [-0.4, 1.1, 0], fov: 30 })
const shots = RANGE.map(([, , colour]) => {
  if (!studio) return ''
  const c = buildChair(COLOURS[colour])
  c.rotation.y = -0.5
  c.userData.hinge.rotation.z = -0.3
  studio.scene.add(c)
  const url = studio.still()
  studio.scene.remove(c)
  return url
})
$('cards').innerHTML = RANGE.map(
  ([name, text], i) => `<article class="card"><img alt="${name}" src="${shots[i]}" /><div><h3>${name}</h3><p>${text}</p></div></article>`
).join('')

/* ---------------- counters */
const io = new IntersectionObserver((es) =>
  es.forEach((e) => {
    if (!e.isIntersecting) return
    e.target.querySelectorAll('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count)
      const start = performance.now()
      const step = (now) => {
        const p = reduced ? 1 : Math.min(1, (now - start) / 1400)
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
    io.unobserve(e.target)
  })
)
io.observe(document.querySelector('.line__stats'))
