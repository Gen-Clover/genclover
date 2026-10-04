import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Quaternion,
  Raycaster,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

/**
 * The Meridian tower: a twisting residential tower on a landscaped podium,
 * drawn entirely in code. Floors light up under the pointer and can be
 * picked; the scene can be relit for day, dusk or night.
 */

export const FLOORS = 24
const FLOOR_H = 0.3
const TWIST = 0.055 // radians per floor
const PODIUM_H = 0.5

/** Lighting presets. Each value is eased toward on every frame. */
export const MOODS = {
  day: { hemiSky: '#d8ecff', hemiGround: '#b8a98c', hemi: 1.15, sun: '#fff3dd', sunI: 2.4, sunPos: [6, 9, 5], interior: 0.08, glass: '#7f9fbd', glassO: 0.55, spire: 0.2, stars: 0, pool: '#7fb6d6' },
  dusk: { hemiSky: '#f6c2a0', hemiGround: '#2e2442', hemi: 0.8, sun: '#ffb27a', sunI: 1.15, sunPos: [8, 2.2, 3], interior: 0.95, glass: '#46506e', glassO: 0.5, spire: 1, stars: 0.25, pool: '#8a9cc4' },
  night: { hemiSky: '#33406a', hemiGround: '#07080f', hemi: 0.38, sun: '#9fb4ff', sunI: 0.45, sunPos: [-5, 7, 4], interior: 1.7, glass: '#1c2436', glassO: 0.42, spire: 1.6, stars: 1, pool: '#2a3f6e' },
}

/** A rounded rectangle footprint. */
const footprint = (w, d, r) => {
  const s = new Shape()
  const x = -w / 2
  const y = -d / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + d - r)
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d)
  s.lineTo(x + r, y + d)
  s.quadraticCurveTo(x, y + d, x, y + d - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

const extrude = (shape, depth) => {
  const g = new ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 6 })
  g.rotateX(-Math.PI / 2) // extrude upward
  return g
}

const softShadow = () => {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64)
  grad.addColorStop(0, 'rgba(0,0,0,0.55)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new CanvasTexture(c)
}

const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

export const createTower = (canvas, { onHover, onSelect, reduced = false } = {}) => {
  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 200)
  const random = seeded(11)

  const hemi = new HemisphereLight('#ffffff', '#000000', 1)
  const sun = new DirectionalLight('#ffffff', 2)
  scene.add(hemi, sun)

  const world = new Group()
  scene.add(world)

  /* ground, shadow, pool, trees */
  const ground = new Mesh(new CylinderGeometry(4.2, 4.4, 0.12, 64), new MeshStandardMaterial({ color: '#2b2e33', roughness: 0.95 }))
  ground.position.y = -0.06
  world.add(ground)
  const lawn = new Mesh(new CylinderGeometry(3.9, 3.9, 0.02, 64), new MeshStandardMaterial({ color: '#4d6e46', roughness: 1 }))
  lawn.position.y = 0.01
  world.add(lawn)
  const shadow = new Mesh(new PlaneGeometry(4.4, 4.4), new MeshBasicMaterial({ map: softShadow(), transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.025
  world.add(shadow)
  const poolMat = new MeshStandardMaterial({ color: '#7fb6d6', roughness: 0.1, metalness: 0.3, emissive: '#000000' })
  const pool = new Mesh(new BoxGeometry(2.2, 0.02, 0.5), poolMat)
  pool.position.set(0, 0.03, 2.35)
  world.add(pool)

  const trees = new InstancedMesh(new IcosahedronGeometry(0.16, 1), new MeshStandardMaterial({ color: '#4f7a45', roughness: 0.9, flatShading: true }), 26)
  const trunks = new InstancedMesh(new CylinderGeometry(0.018, 0.024, 0.16, 6), new MeshStandardMaterial({ color: '#5b4636' }), 26)
  const m = new Matrix4()
  const q = new Quaternion()
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + random() * 0.15
    const r = 3.05 + random() * 0.6
    const s = 0.75 + random() * 0.6
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (z > 1.9 && Math.abs(x) < 1.4) {
      m.makeScale(0, 0, 0) // keep the pool clear
    } else m.compose(new Vector3(x, 0.26 * s, z), q, new Vector3(s, s, s))
    trees.setMatrixAt(i, m)
    m.compose(new Vector3(x, 0.08, z), q, new Vector3(1, 1, 1))
    trunks.setMatrixAt(i, m)
  }
  world.add(trees, trunks)

  /* podium */
  const podium = new Mesh(extrude(footprint(2.9, 2.3, 0.3), PODIUM_H), new MeshStandardMaterial({ color: '#d9d4cb', roughness: 0.7 }))
  world.add(podium)
  const lobbyMat = new MeshStandardMaterial({ color: '#f6d9a8', emissive: '#ffcf8a', emissiveIntensity: 0.6, transparent: true, opacity: 0.85 })
  const lobby = new Mesh(extrude(footprint(2.92, 2.32, 0.3), 0.22), lobbyMat)
  lobby.position.y = 0.06
  world.add(lobby)

  /* the tower, floor by floor */
  const tower = new Group()
  tower.position.y = PODIUM_H
  world.add(tower)

  const slabMat = new MeshStandardMaterial({ color: '#ece8e1', roughness: 0.6 })
  const glassMat = new MeshStandardMaterial({ color: '#46506e', roughness: 0.08, metalness: 0.65, transparent: true, opacity: 0.5 })
  const mullionMat = new MeshStandardMaterial({ color: '#2a2d33', roughness: 0.4, metalness: 0.5 })
  const edgeMat = new LineBasicMaterial({ color: '#f2c36b', transparent: true, opacity: 0 })

  const floors = []
  for (let i = 0; i < FLOORS; i++) {
    const g = new Group()
    g.position.y = i * FLOOR_H
    g.rotation.y = i * TWIST
    const taper = 1 - (i / FLOORS) * 0.12
    const w = 1.7 * taper
    const d = 1.25 * taper

    const slab = new Mesh(extrude(footprint(w + 0.2, d + 0.2, 0.22), 0.035), slabMat)
    g.add(slab)

    const interiorMat = new MeshStandardMaterial({ color: '#2b2621', emissive: '#ffcc88', emissiveIntensity: 0 })
    const interior = new Mesh(extrude(footprint(w - 0.12, d - 0.12, 0.16), FLOOR_H - 0.07), interiorMat)
    interior.position.y = 0.035
    g.add(interior)

    const glass = new Mesh(extrude(footprint(w, d, 0.2), FLOOR_H - 0.04), glassMat)
    glass.position.y = 0.035
    glass.userData.floor = i
    g.add(glass)

    const edges = new LineSegments(new EdgesGeometry(glass.geometry, 30), edgeMat.clone())
    edges.position.y = 0.035
    g.add(edges)

    floors.push({ group: g, interior, interiorMat, glass, edges, lit: 0.35 + random() * 0.65, glow: 0 })
    tower.add(g)
  }

  // Vertical fins around each floor, one instanced mesh for the whole tower.
  const FINS_PER_FLOOR = 28
  const fins = new InstancedMesh(new BoxGeometry(0.018, FLOOR_H - 0.04, 0.03), mullionMat, FLOORS * FINS_PER_FLOOR)
  let n = 0
  const shapePoints = (w, d) => footprint(w, d, 0.2).getSpacedPoints(FINS_PER_FLOOR).slice(0, FINS_PER_FLOOR)
  for (let i = 0; i < FLOORS; i++) {
    const taper = 1 - (i / FLOORS) * 0.12
    const pts = shapePoints(1.7 * taper + 0.01, 1.25 * taper + 0.01)
    const rot = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), i * TWIST)
    for (const p of pts) {
      const v = new Vector3(p.x, PODIUM_H + i * FLOOR_H + FLOOR_H / 2 + 0.015, -p.y).applyQuaternion(rot)
      m.compose(v, rot, new Vector3(1, 1, 1))
      fins.setMatrixAt(n++, m)
    }
  }
  world.add(fins)

  /* crown: rooftop garden and a spire */
  const topY = PODIUM_H + FLOORS * FLOOR_H
  const crown = new Group()
  crown.position.y = topY
  crown.rotation.y = FLOORS * TWIST
  const roof = new Mesh(extrude(footprint(1.6, 1.15, 0.2), 0.05), slabMat)
  crown.add(roof)
  const garden = new InstancedMesh(new IcosahedronGeometry(0.07, 0), new MeshStandardMaterial({ color: '#5d8a4f', flatShading: true }), 12)
  for (let i = 0; i < 12; i++) {
    m.compose(new Vector3((random() - 0.5) * 1.2, 0.1, (random() - 0.5) * 0.8), q, new Vector3(1, 1, 1))
    garden.setMatrixAt(i, m)
  }
  crown.add(garden)
  const spire = new Mesh(new ConeGeometry(0.035, 1.1, 8), mullionMat)
  spire.position.set(0.4, 0.6, 0)
  crown.add(spire)
  const beaconMat = new MeshBasicMaterial({ color: '#ff5a4a' })
  const beacon = new Mesh(new IcosahedronGeometry(0.035, 1), beaconMat)
  beacon.position.set(0.4, 1.17, 0)
  crown.add(beacon)
  const crownLight = new PointLight('#ffd29a', 0, 3)
  crownLight.position.set(0, 0.4, 0)
  crown.add(crownLight)
  world.add(crown)

  /* stars, faded in at night */
  const starGeo = new BufferGeometry()
  const starPos = new Float32Array(600 * 3)
  for (let i = 0; i < 600; i++) {
    const a = random() * Math.PI * 2
    const e = 0.15 + random() * 1.2
    const r = 60
    starPos[i * 3] = Math.cos(a) * Math.cos(e) * r
    starPos[i * 3 + 1] = Math.sin(e) * r
    starPos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r
  }
  starGeo.setAttribute('position', new BufferAttribute(starPos, 3))
  const starMat = new PointsMaterial({ color: '#ffffff', size: 0.18, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending })
  scene.add(new Points(starGeo, starMat))

  /* ------------------------------------------------------------ mood */

  const target = { ...MOODS.dusk }
  const now = {
    hemiSky: new Color(target.hemiSky),
    hemiGround: new Color(target.hemiGround),
    sun: new Color(target.sun),
    glass: new Color(target.glass),
    pool: new Color(target.pool),
    hemi: target.hemi,
    sunI: target.sunI,
    sunPos: new Vector3(...target.sunPos),
    interior: target.interior,
    glassO: target.glassO,
    spire: target.spire,
    stars: target.stars,
  }
  const setMood = (name) => Object.assign(target, MOODS[name])

  /* ---------------------------------------------------------- camera */

  const view = { rotation: -0.5, targetRotation: -0.5, focusY: 3.9, targetFocusY: 3.9, distance: 24, targetDistance: 24 }
  let selected = null
  let hovered = null

  const layout = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // narrow screens step back so the whole tower fits; wide ones shift it
    // right, clear of the headline
    view.baseDistance = camera.aspect < 0.8 ? 34 : camera.aspect < 1.2 ? 25 : 20
    camera.filmOffset = camera.aspect > 1.2 ? -5 : 0
    camera.updateProjectionMatrix()
    if (selected == null) view.targetDistance = view.baseDistance
  }
  layout()
  addEventListener('resize', layout)

  /* ------------------------------------------------------- pointer */

  const ray = new Raycaster()
  const pointer = new Vector2()
  let drag = null
  let idleSince = performance.now()

  const pick = (e) => {
    const r = canvas.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(pointer, camera)
    const hit = ray.intersectObjects(floors.map((f) => f.glass))[0]
    return hit ? hit.object.userData.floor : null
  }

  canvas.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, start: view.targetRotation, moved: false }
    canvas.setPointerCapture(e.pointerId)
  })
  canvas.addEventListener('pointermove', (e) => {
    idleSince = performance.now()
    if (drag) {
      const dx = e.clientX - drag.x
      if (Math.abs(dx) > 4) drag.moved = true
      view.targetRotation = drag.start + dx * 0.008
    }
    if (e.pointerType !== 'mouse') return
    const floor = pick(e)
    if (floor !== hovered) {
      hovered = floor
      canvas.style.cursor = floor == null ? 'grab' : 'pointer'
    }
    onHover?.(floor, e.clientX, e.clientY)
  })
  canvas.addEventListener('pointerup', (e) => {
    const wasDrag = drag?.moved
    drag = null
    if (wasDrag) return
    const floor = pick(e)
    if (e.pointerType !== 'mouse') {
      hovered = floor
      onHover?.(floor, e.clientX, e.clientY)
    }
    if (floor != null) select(floor)
  })
  canvas.addEventListener('pointerleave', () => {
    if (drag) return
    hovered = null
    onHover?.(null)
  })

  const select = (floor) => {
    selected = floor
    if (floor == null) {
      view.targetFocusY = 3.9
      view.targetDistance = view.baseDistance
    } else {
      view.targetFocusY = PODIUM_H + floor * FLOOR_H + FLOOR_H / 2
      view.targetDistance = view.baseDistance * 0.5
      // face the floor's long side toward the camera
      view.targetRotation = -floor * TWIST - 0.35
    }
    onSelect?.(floor)
  }

  /* ---------------------------------------------------------- frame */

  const ease = (a, b, k) => a + (b - a) * k
  let last = performance.now()

  const frame = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000)
    last = t
    if (!document.hidden) {
      const k = reduced ? 1 : 1 - Math.pow(0.001, dt) // frame-rate independent easing

      // mood
      now.hemiSky.lerp(new Color(target.hemiSky), k)
      now.hemiGround.lerp(new Color(target.hemiGround), k)
      now.sun.lerp(new Color(target.sun), k)
      now.glass.lerp(new Color(target.glass), k)
      now.pool.lerp(new Color(target.pool), k)
      now.sunPos.lerp(new Vector3(...target.sunPos), k)
      for (const key of ['hemi', 'sunI', 'interior', 'glassO', 'spire', 'stars']) now[key] = ease(now[key], target[key], k)
      hemi.color.copy(now.hemiSky)
      hemi.groundColor.copy(now.hemiGround)
      hemi.intensity = now.hemi
      sun.color.copy(now.sun)
      sun.intensity = now.sunI
      sun.position.copy(now.sunPos)
      glassMat.color.copy(now.glass)
      glassMat.opacity = now.glassO
      poolMat.color.copy(now.pool)
      poolMat.emissive.copy(now.pool).multiplyScalar(now.stars * 0.25)
      lobbyMat.emissiveIntensity = 0.2 + now.interior * 0.5
      crownLight.intensity = now.spire * 1.5
      beaconMat.color.setRGB(1, 0.35, 0.3).multiplyScalar(0.4 + 0.6 * Math.max(0, Math.sin(t / 400)) * now.spire)
      starMat.opacity = now.stars

      // floors: lit windows, hover and selection glow
      floors.forEach((f, i) => {
        const focus = i === hovered || i === selected
        f.glow = ease(f.glow, focus ? 1 : 0, reduced ? 1 : 0.2)
        const twinkle = now.interior > 0.5 && !reduced ? 0.06 * Math.sin(t / 900 + i * 1.7) : 0
        f.interiorMat.emissiveIntensity = now.interior * f.lit + twinkle + f.glow * 1.4
        f.interiorMat.emissive.set(f.glow > 0.05 ? '#ffc46b' : '#ffcc88')
        f.edges.material.opacity = f.glow
        f.group.scale.setScalar(1 + f.glow * 0.035)
      })

      // camera
      const idle = t - idleSince > 2500 && !drag && selected == null
      if (idle && !reduced) view.targetRotation += dt * 0.12
      view.rotation = ease(view.rotation, view.targetRotation, reduced ? 1 : 0.08)
      view.focusY = ease(view.focusY, view.targetFocusY, reduced ? 1 : 0.06)
      view.distance = ease(view.distance, view.targetDistance, reduced ? 1 : 0.06)
      world.rotation.y = view.rotation
      camera.position.set(view.distance * 0.82, view.focusY + view.distance * 0.28, view.distance * 0.57)
      camera.lookAt(0, view.focusY, 0)

      renderer.render(scene, camera)
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  /** Where a floor sits on screen, for placing labels. */
  const floorOnScreen = (floor) => {
    const v = new Vector3(0, PODIUM_H + floor * FLOOR_H + FLOOR_H / 2, 0).project(camera)
    const r = canvas.getBoundingClientRect()
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height }
  }

  return { setMood, select, floorOnScreen }
}

