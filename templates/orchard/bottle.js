import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from 'three'

/**
 * The sipsy bottle in 3D: a turned glass body (a lathe), the juice inside,
 * a ribbed cap and a printed label. One small scene per canvas, holding one
 * or more bottles. Bottles turn slowly on their own, follow a drag, and can
 * be re-dressed as another flavour.
 */

export const FLAVOURS = {
  green: {
    name: 'Green Garden',
    juice: '#5f8f2c',
    label: '#3f6b1c',
    ink: '#f3f6e8',
    lines: ['Apple', 'Cucumber', 'Kale', 'Spinach', 'Lemon', 'Ginger'],
  },
  sunrise: {
    name: 'Sunrise',
    juice: '#f0a020',
    label: '#e08a12',
    ink: '#fff8e8',
    lines: ['Orange', 'Carrot', 'Mango', 'Lemon', 'Turmeric'],
  },
  berry: {
    name: 'Berry Bright',
    juice: '#c2213c',
    label: '#a5182f',
    ink: '#fff0f2',
    lines: ['Strawberry', 'Raspberry', 'Apple', 'Beetroot'],
  },
}

/** The printed wrap: brand, tagline, ingredients and the small print. */
const labelTexture = (flavour) => {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = flavour.label
  g.fillRect(0, 0, c.width, c.height)
  // the front of the wrap is the middle third
  const x = 360
  g.fillStyle = flavour.ink
  g.font = '800 92px "Archivo Variable", "Archivo", sans-serif'
  g.fillText('sipsy', x, 130)
  g.beginPath()
  g.arc(x + 228, 54, 11, 0, Math.PI * 2) // the dot that makes the logo
  g.fill()
  g.font = '600 22px "Inter Variable", sans-serif'
  g.globalAlpha = 0.85
  g.fillText('100% FRUIT · 0% FUSS', x + 2, 170)
  g.globalAlpha = 1
  g.font = '500 30px "Inter Variable", sans-serif'
  flavour.lines.forEach((line, i) => g.fillText(line, x + 2, 236 + i * 36))
  g.font = '600 18px "Inter Variable", sans-serif'
  g.globalAlpha = 0.75
  g.fillText('COLD PRESSED · NO ADDED SUGAR', x + 2, 470)
  g.fillText('250 ml', x + 380, 470)
  g.globalAlpha = 1
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** Half the bottle's outline, bottom to top, for the lathe. */
const PROFILE = [
  [0, 0], [0.5, 0], [0.56, 0.04], [0.58, 0.12], [0.58, 1.7], [0.55, 1.86], [0.42, 2.02], [0.27, 2.12], [0.25, 2.2], [0.25, 2.34], [0.27, 2.36],
].map(([x, y]) => new Vector2(x, y))

const makeBottle = (flavour) => {
  const group = new Group()
  const glass = new Mesh(
    new LatheGeometry(PROFILE, 64),
    new MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.08, transmission: 0.6, thickness: 0.2, transparent: true, opacity: 0.35, clearcoat: 1 })
  )
  const juiceMat = new MeshStandardMaterial({ color: flavour.juice, roughness: 0.35 })
  const juice = new Mesh(new LatheGeometry(PROFILE.slice(0, 6).map((p) => new Vector2(p.x * 0.96, Math.min(p.y, 1.82))), 48), juiceMat)
  const labelMat = new MeshStandardMaterial({ map: labelTexture(flavour), roughness: 0.6 })
  const label = new Mesh(new CylinderGeometry(0.595, 0.595, 1.25, 64, 1, true), labelMat)
  label.position.y = 0.92
  label.rotation.y = -Math.PI // the printed front faces the camera
  const cap = new Mesh(new CylinderGeometry(0.29, 0.29, 0.3, 40), new MeshStandardMaterial({ color: '#f4f2ec', roughness: 0.5 }))
  cap.position.y = 2.46
  // ribs on the cap
  for (let i = 0; i < 28; i++) {
    const rib = new Mesh(new CylinderGeometry(0.012, 0.012, 0.26, 4), cap.material)
    const a = (i / 28) * Math.PI * 2
    rib.position.set(Math.cos(a) * 0.295, 2.46, Math.sin(a) * 0.295)
    group.add(rib)
  }
  group.add(juice, label, glass, cap)
  group.userData = { juiceMat, labelMat, flavour }
  return group
}

const dress = (bottle, flavour) => {
  const { juiceMat, labelMat } = bottle.userData
  juiceMat.color = new Color(flavour.juice)
  labelMat.map.dispose()
  labelMat.map = labelTexture(flavour)
  labelMat.needsUpdate = true
  bottle.userData.flavour = flavour
}

/**
 * bottles: [{ flavour, x, y, z, tilt, scale }]
 * options: { spin, interactive, camera: { y, z, fov } }
 */
export const createBottleScene = (canvas, bottles, { spin = 0.25, interactive = true, camera: cam = {}, reduced = false } = {}) => {
  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(cam.fov ?? 28, 1, 0.1, 50)
  camera.position.set(0, cam.y ?? 1.5, cam.z ?? 8)
  camera.lookAt(0, cam.lookY ?? 1.25, 0)

  scene.add(new HemisphereLight('#ffffff', '#c9c2b2', 1.6))
  const key = new DirectionalLight('#fffaf0', 2.4)
  key.position.set(3, 5, 4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  scene.add(key)
  const rim = new DirectionalLight('#ffffff', 1.2)
  rim.position.set(-4, 3, -3)
  scene.add(rim)

  const floor = new Mesh(new PlaneGeometry(20, 20), new ShadowMaterial({ opacity: 0.18 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const made = bottles.map((b) => {
    const bottle = makeBottle(FLAVOURS[b.flavour])
    bottle.position.set(b.x ?? 0, b.y ?? 0, b.z ?? 0)
    bottle.rotation.z = b.tilt ?? 0
    bottle.scale.setScalar(b.scale ?? 1)
    bottle.traverse((m) => (m.castShadow = true))
    bottle.userData.base = b.turn ?? 0
    scene.add(bottle)
    return bottle
  })

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

  /* drag to turn; it eases back to spinning on its own */
  const state = { turn: 0, target: 0, drag: null, wobble: 0 }
  if (interactive) {
    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'pan-y'
    canvas.addEventListener('pointerdown', (e) => {
      state.drag = { x: e.clientX, start: state.target }
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = 'grabbing'
    })
    canvas.addEventListener('pointermove', (e) => {
      if (state.drag) state.target = state.drag.start + (e.clientX - state.drag.x) * 0.012
    })
    const end = () => {
      state.drag = null
      canvas.style.cursor = 'grab'
    }
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)
  }

  let visible = true
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(canvas)

  let last = performance.now()
  const frame = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000)
    last = t
    if (visible && !document.hidden) {
      if (!state.drag && !reduced) state.target += spin * dt
      state.turn += (state.target - state.turn) * (reduced ? 1 : 0.1)
      state.wobble = Math.max(0, state.wobble - dt * 1.6)
      made.forEach((b, i) => {
        b.rotation.y = b.userData.base + state.turn
        const bob = reduced ? 0 : Math.sin(t / 900 + i * 1.3) * 0.03
        b.position.y = (bottles[i].y ?? 0) + bob + Math.sin(state.wobble * 14) * state.wobble * 0.12
      })
      renderer.render(scene, camera)
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  return {
    /** Re-dress bottle i as another flavour, with a little hop. */
    setFlavour(name, i = 0) {
      if (!made[i]) return
      dress(made[i], FLAVOURS[name])
      state.wobble = 1
      state.target += Math.PI * 2
    },
  }
}
