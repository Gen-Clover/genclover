import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three'

/**
 * A Velmora dental unit, modelled in code: base, lift, seat, reclining back
 * and headrest, delivery arm with handpieces, cuspidor post and the overhead
 * light. Parts are grouped by assembly stage, so the production line can
 * build a chair up piece by piece.
 */

const shell = new MeshStandardMaterial({ color: '#f2f3f5', roughness: 0.35, metalness: 0.05 })
const grey = new MeshStandardMaterial({ color: '#b8bdc4', roughness: 0.4, metalness: 0.3 })
const dark = new MeshStandardMaterial({ color: '#2b2f36', roughness: 0.6 })
const glow = new MeshStandardMaterial({ color: '#ffffff', emissive: '#e8f2ff', emissiveIntensity: 1.2 })

const part = (g, geo, mat, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) => {
  const m = new Mesh(geo, mat)
  m.position.set(...p)
  m.rotation.set(...r)
  m.scale.set(...s)
  m.castShadow = true
  g.add(m)
  return m
}

export const buildChair = (color = '#2f5f9e') => {
  const vinyl = new MeshStandardMaterial({ color, roughness: 0.5 })
  const chair = new Group()
  const stages = { base: new Group(), seat: new Group(), back: new Group(), unit: new Group(), light: new Group() }
  Object.values(stages).forEach((s) => chair.add(s))

  // 1 base and lift
  part(stages.base, new BoxGeometry(2.2, 0.12, 0.9), shell, [0, 0.06, 0])
  part(stages.base, new BoxGeometry(0.8, 0.5, 0.6), shell, [0.2, 0.35, 0])
  part(stages.base, new BoxGeometry(0.5, 0.1, 0.35), grey, [-1.1, 0.06, 0.55])

  // 2 seat and leg rest
  part(stages.seat, new BoxGeometry(1.2, 0.18, 0.62), grey, [0.1, 0.68, 0])
  part(stages.seat, new CapsuleGeometry(0.28, 1.3, 6, 16), vinyl, [-0.3, 0.83, 0], [0, 0, Math.PI / 2 - 0.08], [1, 0.45, 1])

  // 3 backrest and headrest, hinged so it can recline
  const hinge = new Group()
  hinge.position.set(0.55, 0.82, 0)
  stages.back.add(hinge)
  part(hinge, new CapsuleGeometry(0.29, 0.75, 6, 16), vinyl, [0.42, 0.42, 0], [0, 0, -0.85], [1, 1, 0.42])
  part(hinge, new CapsuleGeometry(0.16, 0.18, 6, 12), vinyl, [0.92, 0.88, 0], [0, 0, -0.9], [1, 1, 0.55])
  part(hinge, new BoxGeometry(0.08, 0.16, 0.7), grey, [0.15, 0.1, 0])
  chair.userData.hinge = hinge

  // 4 delivery unit: post, arm, tray of handpieces, cuspidor
  part(stages.unit, new CylinderGeometry(0.07, 0.07, 1.1, 16), shell, [-0.15, 1.2, -0.55])
  part(stages.unit, new BoxGeometry(0.9, 0.06, 0.12), shell, [-0.55, 1.75, -0.55])
  part(stages.unit, new BoxGeometry(0.55, 0.08, 0.38), shell, [-1.0, 1.7, -0.35])
  for (let i = 0; i < 4; i++) {
    part(stages.unit, new CylinderGeometry(0.018, 0.018, 0.3, 8), dark, [-1.18 + i * 0.12, 1.88, -0.2], [0.3, 0, 0])
    part(stages.unit, new TorusGeometry(0.16, 0.008, 6, 16, Math.PI), grey, [-1.18 + i * 0.12, 1.58, -0.2], [0, Math.PI / 2, Math.PI])
  }
  part(stages.unit, new CylinderGeometry(0.16, 0.1, 0.16, 24), shell, [0.95, 1.15, -0.5])
  part(stages.unit, new CylinderGeometry(0.06, 0.06, 0.55, 12), shell, [0.95, 0.8, -0.5])

  // 5 overhead light
  part(stages.light, new CylinderGeometry(0.05, 0.05, 1.5, 12), shell, [0.95, 1.7, -0.55])
  part(stages.light, new BoxGeometry(0.06, 0.06, 0.9), shell, [0.95, 2.43, -0.15])
  part(stages.light, new TorusGeometry(0.17, 0.05, 10, 32), shell, [0.95, 2.2, 0.28], [0.6, 0, 0])
  part(stages.light, new CylinderGeometry(0.15, 0.15, 0.02, 24), glow, [0.95, 2.19, 0.29], [0.6 + Math.PI / 2, 0, 0])

  chair.userData.stages = stages
  chair.userData.vinyl = vinyl
  return chair
}

/** Renderer, camera, lights and a shadow floor for one canvas. */
export const createStage = (canvas, { camera: c = [5, 3.2, 6], look = [0, 1, 0], fov = 30 } = {}) => {
  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: devicePixelRatio < 1.5, alpha: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.shadowMap.enabled = true
  const scene = new Scene()
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100)
  camera.position.set(...c)
  camera.lookAt(...look)
  scene.add(new HemisphereLight('#f4f8ff', '#8b93a1', 1.6))
  const key = new DirectionalLight('#ffffff', 2.2)
  key.position.set(4, 8, 5)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = key.shadow.camera.bottom = -10
  key.shadow.camera.right = key.shadow.camera.top = 10
  scene.add(key)
  const floor = new Mesh(new PlaneGeometry(60, 60), new ShadowMaterial({ opacity: 0.2 }))
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const fit = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  fit()
  new ResizeObserver(fit).observe(canvas)
  let visible = true
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas)

  const loop = (update) => {
    let last = performance.now()
    const frame = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      if (visible && !document.hidden) {
        update(t / 1000, dt)
        renderer.render(scene, camera)
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }
  /** Render once and hand back a picture (read in the same task as the render). */
  const still = () => {
    renderer.render(scene, camera)
    return canvas.toDataURL('image/png')
  }
  return { scene, camera, loop, still }
}

export { Group, BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry }
