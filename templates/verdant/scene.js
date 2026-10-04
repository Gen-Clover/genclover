import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'

/**
 * The living corner of the Verdant hero: roots that grow out of the bottom
 * left as a wireframe, moss that swells along them once they have passed,
 * pale flowers and fern fronds at their tips, pollen drifting through the
 * whole frame and a butterfly that flies in and settles on the longest root.
 *
 * Everything is generated here, so the scene needs no model files.
 */

const FOV = 35
const CAMERA_Z = 12

/** Small deterministic random, so the composition is the same on every visit. */
const seeded = (seed) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeBack = (t) => {
  const c = 1.9
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}

/* ------------------------------------------------------------- roots */

/** Root paths in board space: origin at the bottom-left corner, y up. */
const ROOTS = [
  { points: [[-0.6, -0.5, 0], [0.8, 0.55, 0.4], [2.2, 1.15, 0.2], [3.4, 0.95, -0.2], [4.3, 1.5, 0.3]], r: [0.24, 0.035], delay: 0.15, duration: 2.6 },
  { points: [[-0.7, 1.4, -0.2], [0.5, 1.85, 0.3], [1.5, 2.85, 0], [2.3, 3.6, 0.4]], r: [0.17, 0.03], delay: 0.45, duration: 2.2 },
  { points: [[0.3, -0.7, 0.3], [1.4, 0.15, 0.6], [2.8, 0.05, 0.5], [4.2, -0.3, 0.2], [5.7, 0.25, 0]], r: [0.2, 0.03], delay: 0.3, duration: 2.8 },
  { points: [[-0.5, 2.7, 0], [0.45, 2.45, 0.4], [1.05, 3.4, 0.2], [0.85, 4.35, 0]], r: [0.13, 0.025], delay: 0.8, duration: 2 },
  { points: [[2.2, 1.15, 0.2], [2.6, 1.95, 0.5], [3.35, 2.45, 0.3], [3.75, 3.25, 0.1]], r: [0.08, 0.02], delay: 1.6, duration: 1.6 },
  { points: [[1.0, -0.7, -0.4], [2.0, -0.1, -0.5], [3.0, 0.6, -0.6], [3.55, 1.6, -0.4]], r: [0.13, 0.025], delay: 0.6, duration: 2.1 },
]

const RINGS = 64
const SIDES = 9

/**
 * A tapering tube drawn as a grid of lines: rings around the root plus lines
 * along it. Indices are written ring by ring, so revealing a growing slice of
 * them grows the root from its base to its tip.
 */
const buildRoot = (curve, [r0, r1], random) => {
  const frames = curve.computeFrenetFrames(RINGS, false)
  const positions = new Float32Array((RINGS + 1) * SIDES * 3)
  const wobble = random() * 10
  for (let i = 0; i <= RINGS; i++) {
    const t = i / RINGS
    const centre = curve.getPointAt(t)
    const radius = MathUtils.lerp(r0, r1, Math.pow(t, 0.8)) * (1 + 0.14 * Math.sin(t * 22 + wobble))
    for (let j = 0; j < SIDES; j++) {
      const angle = (j / SIDES) * Math.PI * 2
      const offset = frames.normals[i].clone().multiplyScalar(Math.cos(angle) * radius)
        .add(frames.binormals[i].clone().multiplyScalar(Math.sin(angle) * radius))
      const k = (i * SIDES + j) * 3
      positions[k] = centre.x + offset.x
      positions[k + 1] = centre.y + offset.y
      positions[k + 2] = centre.z + offset.z
    }
  }
  const index = []
  for (let i = 0; i <= RINGS; i++) {
    for (let j = 0; j < SIDES; j++) {
      const a = i * SIDES + j
      index.push(a, i * SIDES + ((j + 1) % SIDES))
      if (i < RINGS) index.push(a, a + SIDES)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setIndex(index)
  geometry.setDrawRange(0, 0)
  return geometry
}

/* ----------------------------------------------------------- flowers */

const flowerShape = () => {
  const shape = new Shape()
  const petals = 5
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2
    const b = ((i + 0.5) / petals) * Math.PI * 2
    const c = ((i + 1) / petals) * Math.PI * 2
    const inner = 0.2
    if (i === 0) shape.moveTo(Math.cos(a) * inner, Math.sin(a) * inner)
    shape.bezierCurveTo(Math.cos(a) * 1.05, Math.sin(a) * 1.05, Math.cos(b) * 1.25, Math.sin(b) * 1.25, Math.cos(b) * 1, Math.sin(b) * 1)
    shape.bezierCurveTo(Math.cos(b) * 0.8, Math.sin(b) * 0.8, Math.cos(c) * 1.05, Math.sin(c) * 1.05, Math.cos(c) * inner, Math.sin(c) * inner)
  }
  return new ShapeGeometry(shape, 8)
}

/* -------------------------------------------------------------- ferns */

/** A frond as line segments, listed from the base up so it can unfurl. */
const buildFrond = (length, random) => {
  const points = []
  const stem = (t) => new Vector3(Math.sin(t * 1.6) * 0.18 * length, t * length, Math.sin(t * 2.4) * 0.06)
  const steps = 26
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps
    const t1 = (i + 1) / steps
    points.push(stem(t0), stem(t1))
    if (i > 1 && i < steps - 1) {
      const leaf = (1 - t0) * 0.32 * length * (0.85 + random() * 0.3)
      const base = stem(t0)
      for (const side of [-1, 1]) {
        const tip = base.clone().add(new Vector3(side * leaf, leaf * 0.45, side * 0.04))
        const mid = base.clone().lerp(tip, 0.5).add(new Vector3(0, leaf * 0.12, 0))
        points.push(base, mid, mid, tip)
      }
    }
  }
  const geometry = new BufferGeometry().setFromPoints(points)
  geometry.setDrawRange(0, 0)
  return geometry
}

/* ------------------------------------------------------------- pollen */

const softDot = () => {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,252,230,0.55)')
  grad.addColorStop(1, 'rgba(255,252,230,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

/* ---------------------------------------------------------- butterfly */

const wingShape = () => {
  const s = new Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.04, 0.2, 0.3, 0.26, 0.29, 0.07)
  s.bezierCurveTo(0.28, -0.01, 0.13, -0.02, 0.02, -0.01)
  s.bezierCurveTo(0.15, -0.05, 0.22, -0.19, 0.09, -0.19)
  s.bezierCurveTo(0.03, -0.18, 0.0, -0.07, 0, 0)
  return new ShapeGeometry(s, 10)
}

const buildButterfly = () => {
  const root = new Group()
  root.scale.setScalar(1.45)
  const wingMaterial = new MeshStandardMaterial({ color: 0xeef3b0, emissive: 0x4a5022, roughness: 0.6, side: DoubleSide })
  const geometry = wingShape()
  const right = new Group()
  const left = new Group()
  const rightWing = new Mesh(geometry, wingMaterial)
  const leftWing = new Mesh(geometry, wingMaterial)
  leftWing.scale.x = -1
  right.add(rightWing)
  left.add(leftWing)
  const body = new Mesh(new CapsuleGeometry(0.012, 0.16, 4, 8), new MeshStandardMaterial({ color: 0x2c2f25, roughness: 0.8 }))
  root.add(right, left, body)
  root.userData = { right, left }
  return root
}

/* --------------------------------------------------------------- start */

export const startScene = (canvas, { reduced = false } = {}) => {
  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return // No WebGL: the page still reads perfectly well without the scene.
  }
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.set(0, 0, CAMERA_Z)
  scene.add(new HemisphereLight(0xf4f7ea, 0x283024, 1.25))
  const sun = new DirectionalLight(0xfff5dc, 1.6)
  sun.position.set(3, 6, 8)
  scene.add(sun)

  const random = seeded(7)
  const board = new Group()
  scene.add(board)

  /* roots */
  const lineMaterial = new LineBasicMaterial({ color: 0xd2f6d2, transparent: true, opacity: 0.72 })
  const roots = ROOTS.map((def) => {
    // Paths are drawn on a square grid; flattening them keeps the roots low,
    // hugging the corner instead of climbing into the copy.
    const curve = new CatmullRomCurve3(def.points.map(([x, y, z]) => new Vector3(x, y * 0.66, z)), false, 'catmullrom', 0.4)
    const geometry = buildRoot(curve, def.r, random)
    board.add(new LineSegments(geometry, lineMaterial))
    return { ...def, curve, geometry, total: geometry.index.count }
  })

  /* moss along the roots, swelling once the growth has passed */
  const moss = []
  for (const root of roots) {
    const count = Math.round(root.r[0] * 150)
    for (let i = 0; i < count; i++) {
      const t = 0.06 + random() * 0.88
      const p = root.curve.getPointAt(t)
      const radius = MathUtils.lerp(root.r[0], root.r[1], t)
      const dir = new Vector3(random() - 0.5, random() * 0.8 + 0.2, random() - 0.3).normalize()
      p.addScaledVector(dir, radius * (0.7 + random() * 0.5))
      moss.push({ p, size: radius * (0.35 + random() * 0.65) + 0.02, at: root.delay + t * root.duration + 0.15, spin: random() * 6 })
    }
  }
  const mossMesh = new InstancedMesh(new IcosahedronGeometry(1, 1), new MeshStandardMaterial({ roughness: 0.95, flatShading: true }), moss.length)
  const greens = [0x6d983c, 0x8bbd4a, 0xa9d465, 0x587f33].map((c) => new Color(c))
  moss.forEach((m, i) => mossMesh.setColorAt(i, greens[i % greens.length]))
  board.add(mossMesh)

  /* flowers at and near the root tips */
  const petalGeometry = flowerShape()
  const petalMaterial = new MeshStandardMaterial({ color: 0xf6f3e6, emissive: 0x3a3a30, roughness: 0.7, side: DoubleSide })
  const heartGeometry = new SphereGeometry(0.22, 10, 8)
  const heartMaterial = new MeshStandardMaterial({ color: 0xe6cf72, roughness: 0.6 })
  const flowers = []
  for (const [rootIndex, t] of [[0, 0.98], [0, 0.72], [1, 0.97], [1, 0.6], [2, 0.99], [2, 0.55], [3, 0.98], [4, 0.97], [4, 0.7], [5, 0.98], [2, 0.82], [0, 0.42]]) {
    const root = roots[rootIndex]
    const flower = new Group()
    flower.add(new Mesh(petalGeometry, petalMaterial))
    const heart = new Mesh(heartGeometry, heartMaterial)
    heart.position.z = 0.05
    flower.add(heart)
    const p = root.curve.getPointAt(t)
    flower.position.copy(p).add(new Vector3(0, MathUtils.lerp(root.r[0], root.r[1], t) + 0.05, 0.12))
    flower.rotation.set(-0.3 + random() * 0.6, -0.4 + random() * 0.8, random() * 6)
    const size = 0.09 + random() * 0.07
    flowers.push({ flower, size, at: root.delay + t * root.duration + 0.35, sway: random() * 6 })
    flower.scale.setScalar(0.0001)
    board.add(flower)
  }

  /* ferns unfurling from three root ends */
  const frondMaterial = new LineBasicMaterial({ color: 0xa6dc8e, transparent: true, opacity: 0.85 })
  const fronds = [
    [1, 1, 1.35, 0.35],
    [3, 1, 1.1, -0.25],
    [5, 1, 0.95, 0.5],
    [0, 0.28, 1.2, -0.15],
  ].map(([rootIndex, t, length, lean]) => {
    const root = roots[rootIndex]
    const geometry = buildFrond(length, random)
    const line = new LineSegments(geometry, frondMaterial)
    line.position.copy(root.curve.getPointAt(t))
    line.rotation.z = lean
    board.add(line)
    return { line, geometry, lean, at: root.delay + t * root.duration + 0.2, total: geometry.attributes.position.count }
  })

  /* pollen through the whole frame, in view space so it ignores the board */
  const POLLEN = 240
  const pollenPositions = new Float32Array(POLLEN * 3)
  const pollenSeeds = Array.from({ length: POLLEN }, () => ({ speed: 0.08 + random() * 0.22, phase: random() * 6 }))
  const pollenMaterial = new PointsMaterial({
    size: 0.07,
    map: softDot(),
    color: 0xfffbe2,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const pollenGeometry = new BufferGeometry()
  pollenGeometry.setAttribute('position', new BufferAttribute(pollenPositions, 3))
  scene.add(new Points(pollenGeometry, pollenMaterial))

  /* butterfly: flies in along a curve, lands on the long root's tip */
  const butterfly = buildButterfly()
  board.add(butterfly)
  const landing = roots[0].curve.getPointAt(0.93).add(new Vector3(0, 0.07, 0.05))
  const flight = new CatmullRomCurve3([
    new Vector3(-2.5, 5.5, 2.5),
    new Vector3(0.8, 4.4, 1.8),
    new Vector3(2.6, 2.6, 1.2),
    new Vector3(4.9, 2.4, 0.9),
    new Vector3(5.2, 1.4, 0.6),
    landing.clone().add(new Vector3(0.1, 0.25, 0.1)),
    landing,
  ])
  const FLIGHT_START = 2.2
  const FLIGHT_TIME = 5.2

  /* ------------------------------------------------------------ layout */

  let view = { width: 1, height: 1 }
  const layout = () => {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    const visibleHeight = 2 * CAMERA_Z * Math.tan(MathUtils.degToRad(FOV / 2))
    view = { width: visibleHeight * camera.aspect, height: visibleHeight }
    if (camera.aspect < 1.4) {
      // Phones: the canvas is a band between the copy and the cards.
      board.scale.setScalar(1.75)
      board.position.set(-view.width / 2 - 0.2, -view.height / 2 + 0.9, 0)
    } else {
      board.scale.setScalar(Math.min(1.15, Math.max(0.85, camera.aspect / 1.6)))
      board.position.set(-view.width / 2 - 0.2, -view.height / 2 - 0.1, 0)
    }
    for (let i = 0; i < POLLEN; i++) {
      pollenPositions[i * 3] = (random() - 0.5) * view.width * 1.1
      pollenPositions[i * 3 + 1] = (random() - 0.5) * view.height * 1.1
      pollenPositions[i * 3 + 2] = (random() - 0.5) * 4
    }
    pollenGeometry.attributes.position.needsUpdate = true
  }
  layout()
  addEventListener('resize', layout)

  const pointer = { x: 0, y: 0 }
  addEventListener('pointermove', (e) => {
    pointer.x = e.clientX / innerWidth - 0.5
    pointer.y = e.clientY / innerHeight - 0.5
  })

  /* ------------------------------------------------------------- frame */

  const matrix = new Matrix4()
  const quaternion = new Quaternion()
  const scale = new Vector3()
  const ahead = new Vector3()
  let last = performance.now()
  let clock = reduced ? 30 : 0

  const update = (time, dt) => {
    for (const root of roots) {
      const p = easeOut(clamp01((time - root.delay) / root.duration))
      root.geometry.setDrawRange(0, Math.floor((p * root.total) / 2) * 2)
    }

    moss.forEach((m, i) => {
      const s = m.size * easeBack(clamp01((time - m.at) / 0.7))
      quaternion.setFromAxisAngle(ahead.set(0.3, 1, 0.2).normalize(), m.spin)
      matrix.compose(m.p, quaternion, scale.setScalar(Math.max(0.0001, s)))
      mossMesh.setMatrixAt(i, matrix)
    })
    mossMesh.instanceMatrix.needsUpdate = true

    for (const f of flowers) {
      f.flower.scale.setScalar(Math.max(0.0001, f.size * easeBack(clamp01((time - f.at) / 0.9))))
      f.flower.rotation.z += Math.sin(time * 0.6 + f.sway) * 0.0008
    }

    for (const f of fronds) {
      const p = easeOut(clamp01((time - f.at) / 2.2))
      f.geometry.setDrawRange(0, Math.floor((p * f.total) / 2) * 2)
      f.line.rotation.z = f.lean + Math.sin(time * 0.7 + f.lean * 9) * 0.035
    }

    pollenMaterial.opacity = 0.75 * clamp01((time - 0.8) / 2)
    for (let i = 0; i < POLLEN; i++) {
      const seed = pollenSeeds[i]
      const k = i * 3
      pollenPositions[k + 1] += seed.speed * dt
      pollenPositions[k] += Math.sin(time * 0.5 + seed.phase) * 0.0025
      if (pollenPositions[k + 1] > view.height * 0.56) pollenPositions[k + 1] = -view.height * 0.56
    }
    pollenGeometry.attributes.position.needsUpdate = true

    const { right, left } = butterfly.userData
    const f = clamp01((time - FLIGHT_START) / FLIGHT_TIME)
    if (f <= 0) {
      butterfly.visible = false
    } else if (f < 1) {
      butterfly.visible = true
      const eased = 1 - Math.pow(1 - f, 1.6)
      butterfly.position.copy(flight.getPointAt(eased))
      ahead.copy(flight.getPointAt(Math.min(1, eased + 0.01)))
      butterfly.lookAt(ahead)
      butterfly.rotateX(-Math.PI / 2)
      const flap = Math.sin(time * 26) * 1.05
      right.rotation.y = -flap
      left.rotation.y = flap
    } else {
      // Settled: wings held half open, with a slow breath and a flutter now and then.
      butterfly.visible = true
      butterfly.position.copy(landing)
      butterfly.rotation.set(-0.5, 0.35, -0.25)
      const rest = 0.55 + Math.sin(time * 1.3) * 0.18
      const flutter = Math.sin(time * 0.45) > 0.93 ? Math.sin(time * 30) * 0.5 : 0
      right.rotation.y = -(rest + flutter)
      left.rotation.y = rest + flutter
    }

    camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04
    camera.position.y += (-pointer.y * 0.45 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  }

  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!document.hidden) {
      if (!reduced) clock += dt
      update(clock, reduced ? 0 : dt)
      renderer.render(scene, camera)
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}
