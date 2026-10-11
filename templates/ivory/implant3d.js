/**
 * The implant film: a dental implant assembled in real time as the visitor
 * scrolls. Titanium root, then abutment, then a porcelain crown, then the
 * finished tooth settles into gum and bone between two natural teeth.
 *
 * Every part is modelled here from lathe profiles and vertex shaping, lit by a
 * warm key and a cool rim. `progress` (0 to 1) drives the whole sequence.
 */
import {
  ACESFilmicToneMapping,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SplineCurve,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  CylinderGeometry,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const seg = (p, a, b) => ease(clamp01((p - a) / (b - a)))
const mix = (a, b, t) => a + (b - a) * t

/** A smooth lathe from a handful of profile points (x = radius, y = height). */
const lathe = (pts, segments = 96, smooth = 80) =>
  new LatheGeometry(new SplineCurve(pts.map(([x, y]) => new Vector2(x, y))).getPoints(smooth), segments)

/** A molar crown: squared off, four cusps, a central pit and two grooves. */
const molarCrown = () => {
  const g = lathe([
    [0.0, -0.29],
    [0.2, -0.31],
    [0.28, -0.34],
    [0.36, -0.25],
    [0.415, -0.11],
    [0.43, 0.01],
    [0.41, 0.12],
    [0.355, 0.2],
    [0.27, 0.245],
    [0.14, 0.255],
    [0.0, 0.235],
  ])
  const p = g.attributes.position
  const v = new Vector3()
  const cusps = [0, 1, 2, 3].map((k) => [Math.cos(Math.PI / 4 + (k * Math.PI) / 2) * 0.2, Math.sin(Math.PI / 4 + (k * Math.PI) / 2) * 0.2])
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const th = Math.atan2(v.z, v.x)
    const sq = 1 + 0.075 * Math.cos(4 * th - Math.PI)
    v.x *= sq * 1.08
    v.z *= sq * 0.94
    const top = clamp01((v.y - 0.06) / 0.16)
    let dy = 0
    for (const [cx, cz] of cusps) dy += 0.1 * Math.exp(-((v.x - cx) ** 2 + (v.z - cz) ** 2) / 0.009)
    dy -= 0.08 * Math.exp(-(v.x ** 2 + v.z ** 2) / 0.01)
    dy -= 0.026 * (Math.exp(-(v.x ** 2) / 0.003) + Math.exp(-(v.z ** 2) / 0.003))
    v.y += dy * top
    p.setXYZ(i, v.x, v.y, v.z)
  }
  g.deleteAttribute('normal')
  g.deleteAttribute('uv')
  const welded = mergeVertices(g, 1e-4)
  welded.computeVertexNormals()
  return welded
}

/** The titanium root: a tapered core with a helical thread. */
const fixture = (titanium) => {
  const group = new Group()
  const radius = (y) => mix(0.165, 0.215, clamp01((y + 1.55) / 0.95))
  const core = lathe(
    [
      [0.0, -1.63],
      [0.08, -1.615],
      [0.14, -1.575],
      [0.165, -1.5],
      [0.2, -1.0],
      [0.215, -0.62],
      [0.232, -0.585],
      [0.232, -0.505],
      [0.13, -0.5],
      [0.0, -0.5],
    ],
    64,
    60,
  )
  group.add(new Mesh(core, titanium))

  const pts = []
  const pitch = 0.085
  for (let t = 0; t <= 11 * Math.PI * 2; t += 0.12) {
    const y = -1.52 + (t / (Math.PI * 2)) * pitch
    if (y > -0.63) break
    const r = radius(y) - 0.004
    pts.push(new Vector3(Math.cos(t) * r, y, Math.sin(t) * r))
  }
  const thread = new TubeGeometry(new CatmullRomCurve3(pts), pts.length * 2, 0.036, 6, false)
  group.add(new Mesh(thread, titanium))

  // the hex socket that the abutment locks into
  const socket = new Mesh(new CylinderGeometry(0.09, 0.09, 0.012, 6), new MeshStandardMaterial({ color: 0x1b1d20, metalness: 0.6, roughness: 0.6 }))
  socket.position.y = -0.497
  group.add(socket)
  return group
}

const abutment = (titanium) =>
  new Mesh(
    lathe(
      [
        [0.0, -0.52],
        [0.12, -0.52],
        [0.2, -0.5],
        [0.21, -0.44],
        [0.272, -0.37],
        [0.272, -0.335],
        [0.205, -0.3],
        [0.17, -0.12],
        [0.148, -0.045],
        [0.0, -0.04],
      ],
      64,
      50,
    ),
    titanium,
  )

/** A natural tooth: the same crown on two tapering roots. */
const naturalTooth = (enamel, root) => {
  const g = new Group()
  const crown = new Mesh(molarCrown(), enamel)
  g.add(crown)
  for (const side of [-1, 1]) {
    const r = new Mesh(
      lathe([
        [0.0, -1.38],
        [0.04, -1.36],
        [0.1, -1.1],
        [0.15, -0.6],
        [0.17, -0.3],
        [0.0, -0.25],
      ]),
      root,
    )
    r.position.x = side * 0.13
    r.rotation.z = side * 0.07
    g.add(r)
  }
  return g
}

export function createImplantFilm(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.5

  const camera = new PerspectiveCamera(30, 1, 0.1, 50)

  const key = new DirectionalLight(0xffd3a6, 2.6)
  key.position.set(-3, 4, 3.5)
  const rim = new DirectionalLight(0x9fd3ff, 3.4)
  rim.position.set(3.5, 1.2, -3)
  const under = new DirectionalLight(0x8fd3ff, 0.6)
  under.position.set(0, -4, 2)
  scene.add(key, rim, under, new HemisphereLight(0xffffff, 0x101014, 0.25))

  // each part has its own material so the camera can pull focus by dimming the others
  const titanium = new MeshPhysicalMaterial({ color: 0xb8bfc6, metalness: 1, roughness: 0.26, clearcoat: 0.4, clearcoatRoughness: 0.2, transparent: true })
  const titanium2 = titanium.clone()
  const porcelain = new MeshPhysicalMaterial({ color: 0xf4efe6, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.4, sheenColor: new Color(0xfff4e6), transparent: true })
  const enamel = new MeshPhysicalMaterial({ color: 0xefe6d4, roughness: 0.36, clearcoat: 0.8, clearcoatRoughness: 0.16, transparent: true })
  const root = new MeshStandardMaterial({ color: 0xe0cfa6, roughness: 0.62, transparent: true })
  const gumMat = new MeshPhysicalMaterial({ color: 0xd9858c, roughness: 0.45, clearcoat: 0.5, transparent: true, opacity: 0, depthWrite: false })
  const boneMat = new MeshStandardMaterial({ color: 0xe9dcc0, roughness: 0.9, transparent: true, opacity: 0, depthWrite: false })

  const world = new Group()
  scene.add(world)

  const implant = new Group()
  const crown = new Mesh(molarCrown(), porcelain)
  const screw = fixture(titanium)
  const abut = abutment(titanium2)
  implant.add(crown, screw, abut)
  world.add(implant)

  const left = naturalTooth(enamel, root)
  const right = naturalTooth(enamel, root)
  world.add(left, right)

  const bone = new Mesh(new RoundedBoxGeometry(3.4, 1.42, 1.1, 6, 0.14), boneMat)
  const gum = new Mesh(new RoundedBoxGeometry(3.5, 0.34, 1.2, 6, 0.15), gumMat)
  bone.renderOrder = 2
  gum.renderOrder = 3
  world.add(bone, gum)

  const Y0 = 0.55 // where the assembled implant sits
  let progress = 0
  let shown = 0
  let wide = true
  const pointer = new Vector2()
  const look = new Vector3()

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    wide = camera.aspect > 1.1
    camera.updateProjectionMatrix()
  }
  resize()

  const frame = (time) => {
    const t = time / 1000
    shown += (progress - shown) * 0.08
    const p = shown
    const explode = seg(p, 0.07, 0.22)
    const close = seg(p, 0.74, 0.86)
    const jaw = seg(p, 0.78, 0.96)
    const sep = explode * (1 - close)
    const bump = (a, b) => seg(p, a, a + 0.05) * (1 - seg(p, b - 0.05, b))
    const focus = [bump(0.21, 0.4), bump(0.4, 0.57), bump(0.57, 0.75)]

    // the stage sits right of the titles on wide screens
    world.position.x = wide ? mix(0.62, 1.05, jaw) : 0
    world.position.y = wide ? 0 : 0.58
    world.rotation.y += (pointer.x * 0.25 - world.rotation.y) * 0.04
    world.rotation.x += (pointer.y * 0.08 - world.rotation.x) * 0.04

    // the implant turns slowly, then comes apart along its axis
    implant.rotation.y = mix(t * 0.32, 0.55, jaw)
    implant.rotation.z = mix(0.12, 0, Math.max(explode, jaw))
    implant.position.y = Math.sin(t * 1.1) * 0.03 * (1 - jaw)
    crown.position.y = Y0 + 0.95 * sep
    abut.position.y = Y0 + 0.45 * sep
    screw.position.y = Y0 - 0.25 * sep
    abut.rotation.y = sep * Math.PI * 0.5
    crown.rotation.x = -0.5 * focus[2]
    screw.rotation.y = -sep * Math.PI

    // focus pull: the part being described stays lit, the others fall back
    const parts = [
      [titanium, Y0 - 0.25 * sep - 1.06],
      [titanium2, Y0 + 0.45 * sep - 0.28],
      [porcelain, Y0 + 0.95 * sep - 0.03],
    ]
    const w = Math.min(1, focus[0] + focus[1] + focus[2])
    let focusY = 0
    parts.forEach(([mat, y], i) => {
      mat.opacity = 1 - 0.8 * (w - focus[i])
      focusY += y * focus[i]
    })
    focusY = w > 0 ? focusY / (focus[0] + focus[1] + focus[2]) : 0

    // finale: neighbours slide in, gum and bone appear around the implant
    for (const [tooth, side] of [
      [left, -1],
      [right, 1],
    ]) {
      tooth.visible = jaw > 0.001
      tooth.position.set(side * mix(3.6, 1.02, jaw), Y0, 0)
      tooth.rotation.y = side * 0.3
    }
    enamel.opacity = jaw
    root.opacity = jaw * 0.9
    bone.visible = gum.visible = jaw > 0.001
    bone.position.y = Y0 - 1.04
    gum.position.y = Y0 - 0.3
    boneMat.opacity = jaw * 0.26
    gumMat.opacity = jaw * 0.5
    bone.scale.y = gum.scale.y = mix(0.85, 1, jaw)

    // camera: the whole implant, back for the exploded view, in close on each part, round for the finale
    const far = wide ? 0 : 2.9
    camera.position.set(mix(0, 2.4, jaw), mix(0.1, 0.9, jaw), mix(mix(mix(5.5, 6.8, explode), 4.4, w), 7.4, jaw) + far)
    look.set(world.position.x * mix(0.12, 0.35, jaw), mix(mix(mix(Y0 - 0.62, Y0 - 0.2, explode), focusY, w), Y0 - 0.5, jaw), 0)
    camera.lookAt(look)

    renderer.render(scene, camera)
  }

  let raf = 0
  let running = false
  const loop = (time) => {
    frame(time)
    raf = requestAnimationFrame(loop)
  }

  return {
    setProgress: (v) => (progress = v),
    setPointer: (x, y) => pointer.set(x, y),
    resize,
    start: () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(loop)
    },
    stop: () => {
      running = false
      cancelAnimationFrame(raf)
    },
    renderOnce: () => frame(performance.now()),
  }
}
