import {
  ACESFilmicToneMapping,
  Box3,
  BoxGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from 'three'

/**
 * Poise products, modelled in code: doctor, assistant and saddle stools, a
 * headrest, an instrument tray and a foot control. Each is a Group about 2
 * units tall, standing on y = 0, upholstered in the colour asked for.
 */

const frame = new MeshStandardMaterial({ color: '#e9e6e0', roughness: 0.45, metalness: 0.15 })
const chrome = new MeshStandardMaterial({ color: '#d6d9dd', roughness: 0.18, metalness: 0.9 })
const rubber = new MeshStandardMaterial({ color: '#3a3b3e', roughness: 0.8 })
const vinyl = (color) => new MeshStandardMaterial({ color, roughness: 0.55 })

const add = (group, geo, mat, [x = 0, y = 0, z = 0] = [], [rx = 0, ry = 0, rz = 0] = [], [sx = 1, sy = 1, sz = 1] = []) => {
  const m = new Mesh(geo, mat)
  m.position.set(x, y, z)
  m.rotation.set(rx, ry, rz)
  m.scale.set(sx, sy, sz)
  m.castShadow = true
  group.add(m)
  return m
}

/** Five-star base on casters, with the gas column up to `height`. */
const base = (g, height = 0.9, ring = false) => {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const leg = add(g, new BoxGeometry(0.62, 0.07, 0.1), frame, [Math.cos(a) * 0.31, 0.16, Math.sin(a) * 0.31], [0, -a, -0.06])
    leg.castShadow = true
    add(g, new SphereGeometry(0.065, 16, 12), rubber, [Math.cos(a) * 0.6, 0.07, Math.sin(a) * 0.6])
    add(g, new CylinderGeometry(0.02, 0.02, 0.09, 8), chrome, [Math.cos(a) * 0.6, 0.15, Math.sin(a) * 0.6])
  }
  add(g, new CylinderGeometry(0.09, 0.11, 0.18, 24), frame, [0, 0.22])
  add(g, new CylinderGeometry(0.075, 0.075, 0.34, 24), frame, [0, 0.45])
  add(g, new CylinderGeometry(0.035, 0.035, height - 0.6, 20), chrome, [0, 0.62 + (height - 0.6) / 2])
  if (ring) add(g, new TorusGeometry(0.34, 0.018, 10, 48), chrome, [0, 0.62], [Math.PI / 2, 0, 0])
}

/** A soft round seat: a flattened lathe, slightly dished. */
const seat = (g, mat, y, r = 0.42) => {
  const pts = [[0, 0], [r * 0.9, 0], [r, 0.04], [r * 1.02, 0.1], [r * 0.95, 0.15], [r * 0.5, 0.13], [0, 0.14]].map(([x, yy]) => new Vector2(x, yy))
  add(g, new LatheGeometry(pts, 48), mat, [0, y])
  add(g, new CylinderGeometry(r * 0.75, r * 0.6, 0.06, 32), frame, [0, y - 0.03])
}

const doctor = (color) => {
  const g = new Group()
  const mat = vinyl(color)
  base(g, 1.05)
  seat(g, mat, 1.05)
  add(g, new BoxGeometry(0.05, 0.55, 0.05), frame, [0, 1.45, -0.36])
  add(g, new CapsuleGeometry(0.1, 0.42, 6, 16), mat, [0, 1.75, -0.38], [0, 0, Math.PI / 2], [1, 1, 0.55])
  add(g, new CylinderGeometry(0.012, 0.012, 0.3, 8), chrome, [0.32, 0.98, 0.1], [0, 0, 1.2])
  return g
}

const assistant = (color) => {
  const g = new Group()
  const mat = vinyl(color)
  base(g, 1.3, true)
  seat(g, mat, 1.3, 0.38)
  add(g, new BoxGeometry(0.06, 0.5, 0.06), frame, [-0.3, 1.6, -0.12])
  // the curved arm that the assistant leans on
  add(g, new TorusGeometry(0.28, 0.07, 14, 40, Math.PI * 0.9), mat, [-0.12, 1.86, 0.02], [Math.PI / 2, 0, 0.6])
  return g
}

const saddle = (color) => {
  const g = new Group()
  const mat = vinyl(color)
  base(g, 1.2)
  // two rounded halves with a dip between them
  add(g, new SphereGeometry(0.3, 32, 20), mat, [-0.17, 1.27, 0], [0, 0, 0], [1, 0.42, 1.25])
  add(g, new SphereGeometry(0.3, 32, 20), mat, [0.17, 1.27, 0], [0, 0, 0], [1, 0.42, 1.25])
  add(g, new SphereGeometry(0.22, 24, 16), mat, [0, 1.3, -0.24], [0, 0, 0], [1.6, 0.5, 0.8])
  add(g, new CylinderGeometry(0.26, 0.2, 0.06, 32), frame, [0, 1.15])
  return g
}

const headrest = (color) => {
  const g = new Group()
  add(g, new CapsuleGeometry(0.28, 0.5, 8, 24), vinyl(color), [0, 1.3, 0], [0, 0, Math.PI / 2], [1, 1, 0.42])
  add(g, new BoxGeometry(0.1, 0.9, 0.08), frame, [0, 0.75, -0.06])
  add(g, new CylinderGeometry(0.04, 0.04, 0.4, 16), chrome, [0, 0.2, -0.06])
  return g
}

const tray = (color) => {
  const g = new Group()
  add(g, new BoxGeometry(1.1, 0.06, 0.7), frame, [0, 1.25])
  add(g, new BoxGeometry(1.0, 0.04, 0.6), vinyl(color), [0, 1.29])
  for (let i = 0; i < 4; i++) add(g, new CylinderGeometry(0.012, 0.012, 0.42, 8), chrome, [-0.3 + i * 0.18, 1.33, 0], [Math.PI / 2, 0, 0.2])
  add(g, new CylinderGeometry(0.03, 0.03, 0.8, 16), chrome, [0.45, 0.85, -0.25])
  add(g, new BoxGeometry(0.5, 0.05, 0.08), frame, [0.3, 0.45, -0.25])
  return g
}

const footControl = (color) => {
  const g = new Group()
  add(g, new CylinderGeometry(0.6, 0.66, 0.16, 48), frame, [0, 0.08])
  add(g, new CylinderGeometry(0.42, 0.46, 0.06, 40), vinyl(color), [0, 0.19])
  add(g, new TorusGeometry(0.62, 0.04, 10, 48, Math.PI), chrome, [0, 0.2, -0.05], [0, 0, 0])
  return g
}

export const MODELS = { doctor, assistant, saddle, headrest, tray, footControl }

/** Lift short pieces so every model sits in the middle of the frame. */
const centred = (kind, color) => {
  const m = MODELS[kind](color)
  const box = new Box3().setFromObject(m)
  const h = box.max.y - box.min.y
  if (h < 1.6) m.position.y = Math.max(0, 1 - (box.min.y + h / 2))
  return m
}

/**
 * A small studio: soft key light, floor shadow, transparent background.
 * Shows one model at a time, turning slowly; `show` swaps it with a hop.
 */
export const createStudio = (canvas, { reduced = false, spin = 0.35, zoom = 1 } = {}) => {
  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: devicePixelRatio < 1.5, alpha: true, preserveDrawingBuffer: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.shadowMap.enabled = true

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(2.6 / zoom, 2.1 / zoom, 4.4 / zoom)
  camera.lookAt(0, 1, 0)
  scene.add(new HemisphereLight('#fff8ee', '#b9ab97', 1.7))
  const key = new DirectionalLight('#fff3e2', 2.2)
  key.position.set(3, 6, 4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  scene.add(key)
  const floor = new Mesh(new PlaneGeometry(12, 12), new ShadowMaterial({ opacity: 0.16 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const holder = new Group()
  scene.add(holder)

  const layout = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  layout()
  new ResizeObserver(layout).observe(canvas)

  let visible = true
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas)
  let hop = 0
  let last = performance.now()
  const tick = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000)
    last = t
    if (visible && !document.hidden) {
      if (!reduced) holder.rotation.y += spin * dt
      hop = Math.max(0, hop - dt * 2)
      holder.position.y = Math.sin(hop * Math.PI) * 0.25
      holder.scale.setScalar(1 - Math.sin(hop * Math.PI) * 0.08)
      renderer.render(scene, camera)
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  return {
    show(kind, color) {
      holder.clear()
      holder.add(centred(kind, color))
      hop = reduced ? 0 : 1
    },
    /** A still of a model, for product cards. */
    snapshot(kind, color, angle = -0.6) {
      holder.clear()
      const m = centred(kind, color)
      m.rotation.y = angle
      holder.add(m)
      holder.rotation.y = 0
      renderer.render(scene, camera)
      return canvas.toDataURL('image/png')
    },
  }
}
