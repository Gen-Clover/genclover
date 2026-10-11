/**
 * The hero's tooth chart: both arches seen from above, as a dentist draws
 * them, with every tooth numbered the way clinics number them (FDI: the first
 * digit is the quarter of the mouth, the second counts back from the middle).
 *
 * Teeth are laid along an elliptical arch by their real relative widths, so
 * the chart reads correctly to a dentist. Each treatment owns a set of teeth;
 * hovering or tapping any of them selects that treatment.
 */

/** Per tooth position 1-8 from the midline: width along the arch, depth, roundness (higher is squarer). */
const KINDS = [
  { kind: 'incisor', w: 8.6, d: 6.6, n: 2.6 },
  { kind: 'incisor', w: 6.8, d: 6.2, n: 2.4 },
  { kind: 'canine', w: 7.8, d: 8.0, n: 2.1 },
  { kind: 'premolar', w: 7.0, d: 9.0, n: 2.6 },
  { kind: 'premolar', w: 6.8, d: 9.0, n: 2.6 },
  { kind: 'molar', w: 10.2, d: 11.0, n: 3.4 },
  { kind: 'molar', w: 9.4, d: 10.6, n: 3.4 },
  { kind: 'molar', w: 8.6, d: 10.0, n: 3.2 },
]

export const TREATMENTS = [
  {
    id: 'veneers',
    name: 'Porcelain veneers',
    line: 'Thin shells that reshape chipped or uneven front teeth.',
    visits: '2 visits',
    teeth: [11, 12, 21, 22],
  },
  {
    id: 'whitening',
    name: 'Whitening',
    line: 'Several shades lighter in one sitting, without the sensitivity.',
    visits: '1 visit',
    teeth: [31, 32, 41, 42],
  },
  {
    id: 'aligners',
    name: 'Clear aligners',
    line: 'Invisible trays that straighten teeth while you carry on as usual.',
    visits: '6 to 12 months',
    teeth: [13, 23, 33, 43],
  },
  {
    id: 'fillings',
    name: 'Tooth-coloured fillings',
    line: 'Cavities repaired in a shade matched to your own tooth.',
    visits: '1 visit',
    teeth: [14, 15, 24, 25, 34, 35, 44, 45],
  },
  {
    id: 'rootcanal',
    name: 'Root canal',
    line: 'Saves an infected tooth, usually finished in a single sitting.',
    visits: '1 to 2 visits',
    teeth: [16, 17, 26, 27],
  },
  {
    id: 'implants',
    name: 'Implants',
    line: 'A titanium root and a porcelain crown in place of a lost tooth.',
    visits: '3 visits',
    teeth: [36, 37, 46, 47],
  },
  {
    id: 'wisdom',
    name: 'Wisdom teeth',
    line: 'Careful removal under local anaesthetic, with a calm recovery plan.',
    visits: '1 visit',
    teeth: [18, 28, 38, 48],
  },
]

/** The tooth drawn as an implant awaiting its crown. */
const IMPLANT = 36

const PX = 6.1 // drawing units per millimetre
const round = (v) => Math.round(v * 10) / 10

/** A rounded tooth outline in local space: x along the arch, y outward (cheek side). */
const outline = ({ w, d, n, kind }) => {
  const pts = []
  for (let i = 0; i < 48; i++) {
    const t = (i / 48) * Math.PI * 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    let x = (w / 2) * Math.sign(c) * Math.abs(c) ** (2 / n)
    let y = (d / 2) * Math.sign(s) * Math.abs(s) ** (2 / n)
    // front teeth are wider on the lip side; canines come to a soft point
    if (kind === 'incisor') x *= 1 + 0.16 * (y / (d / 2))
    if (kind === 'canine') y *= 1 + 0.12 * Math.abs(c) ** 6 * (y > 0 ? 1 : 0)
    pts.push(`${round(x)} ${round(y)}`)
  }
  return `M${pts.join('L')}Z`
}

/** The grooves on the biting surface. */
const grooves = ({ w, d, kind }) => {
  const a = round(w * 0.3)
  const b = round(d * 0.3)
  if (kind === 'molar') return `M${-a} 0Q0 ${round(-d * 0.08)} ${a} 0M${round(-w * 0.06)} ${-b}Q${round(w * 0.04)} 0 ${round(-w * 0.04)} ${b}`
  if (kind === 'premolar') return `M${-a} 0Q0 ${round(d * 0.08)} ${a} 0`
  if (kind === 'canine') return `M0 ${round(-d * 0.2)}L0 ${round(d * 0.25)}`
  return `M${round(-w * 0.32)} ${round(-d * 0.12)}Q0 ${round(-d * 0.2)} ${round(w * 0.32)} ${round(-d * 0.12)}`
}

/**
 * Teeth for one arch. `dir` is 1 for the upper arch (front teeth at the top)
 * and -1 for the lower one. Returns each tooth's position, angle and number.
 */
const layArch = ({ cx, top, a, b, dir, quadrants, scale }) => {
  // sample the half-ellipse and measure along it
  const samples = []
  let len = 0
  let prev = null
  for (let i = 0; i <= 400; i++) {
    const phi = (i / 400) * Math.PI * 0.56
    const p = { x: a * Math.sin(phi), y: b * (1 - Math.cos(phi)) }
    if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y)
    samples.push({ ...p, len, phi })
    prev = p
  }
  const at = (l) => samples.find((s) => s.len >= l) ?? samples[samples.length - 1]

  const teeth = []
  for (const [q, side] of quadrants) {
    let run = 0
    KINDS.forEach((k, i) => {
      const w = k.w * PX * scale
      const gap = 3
      const mid = at(run + w / 2)
      run += w + gap
      const x = cx + side * mid.x
      const y = top + dir * mid.y
      // follow the arch's tangent, turned so each tooth's outer side faces the lips and cheeks
      const ang = (Math.atan2(b * Math.sin(mid.phi), a * Math.cos(mid.phi)) * 180) / Math.PI
      const rot = dir === 1 ? 180 + side * ang : -side * ang
      teeth.push({ num: q * 10 + i + 1, x, y, rot, ...k, w, d: k.d * PX * scale, side, dir })
    })
  }
  return teeth
}

export const buildArch = () => {
  const upper = layArch({ cx: 300, top: 52, a: 214, b: 236, dir: 1, quadrants: [[1, -1], [2, 1]], scale: 1 })
  const lower = layArch({ cx: 300, top: 668, a: 200, b: 226, dir: -1, quadrants: [[4, -1], [3, 1]], scale: 0.94 })
  const teeth = [...upper, ...lower]
  const owner = Object.fromEntries(TREATMENTS.flatMap((t) => t.teeth.map((n) => [n, t.id])))

  // one continuous band of gum per arch, back molar to back molar
  const band = (arch, right) => {
    const sorted = [...arch.filter((t) => t.side === -1).reverse(), ...arch.filter((t) => t.side === 1)]
    return `<path class="band" d="M${sorted.map((t) => `${round(t.x)} ${round(t.y)}`).join('L')}" style="stroke-width:${right}"/>`
  }
  const gums = band(upper, 70) + band(lower, 66) + teeth
    .map((t) => `<ellipse class="gum" data-t="${owner[t.num]}" cx="${round(t.x)}" cy="${round(t.y)}" rx="${round(t.w * 0.78)}" ry="${round(t.d * 0.78)}" transform="rotate(${round(t.rot)} ${round(t.x)} ${round(t.y)})"/>`)
    .join('')

  const body = teeth
    .map((t) => {
      const order = (t.num % 10) + (t.dir === -1 ? 3 : 0)
      const isImplant = t.num === IMPLANT
      const shape = outline(t)
      const crown = isImplant
        ? `<path class="tooth__ghost" d="${shape}"/><path class="tooth__crown" d="${shape}"/><circle class="tooth__post" r="${round(t.w * 0.14)}"/><path class="tooth__post-x" d="M${round(-t.w * 0.24)} 0H${round(t.w * 0.24)}M0 ${round(-t.w * 0.24)}V${round(t.w * 0.24)}"/>`
        : `<path class="tooth__body" d="${shape}"/><path class="tooth__groove" d="${grooves(t)}"/>`
      return `<g class="tooth${isImplant ? ' tooth--implant' : ''}" data-t="${owner[t.num]}" data-n="${t.num}" transform="translate(${round(t.x)} ${round(t.y)}) rotate(${round(t.rot)})"><g class="tooth__in" style="--o:${order}">${crown}</g></g>`
    })
    .join('')

  // tooth numbers sit just outside the arch
  const labels = teeth
    .map((t) => {
      const rad = (t.rot * Math.PI) / 180
      const off = t.d / 2 + 15
      const lx = t.x - Math.sin(rad) * off
      const ly = t.y + Math.cos(rad) * off + 4
      return `<text class="num" data-t="${owner[t.num]}" x="${round(lx)}" y="${round(ly)}">${t.num}</text>`
    })
    .join('')

  // invisible hit areas: one per treatment, so a whole group is one button for the keyboard
  const groups = TREATMENTS.map(
    (tr) =>
      `<g class="hit" data-t="${tr.id}" tabindex="0" role="button" aria-label="${tr.name}, teeth ${tr.teeth.join(', ')}">${teeth
        .filter((t) => owner[t.num] === tr.id)
        .map((t) => `<ellipse cx="${round(t.x)}" cy="${round(t.y)}" rx="${round(t.w * 0.75)}" ry="${round(t.d * 0.75)}" transform="rotate(${round(t.rot)} ${round(t.x)} ${round(t.y)})"/>`)
        .join('')}</g>`,
  ).join('')

  return `<svg class="arch__svg" viewBox="0 0 600 720" role="group" aria-label="Tooth chart: choose a treatment">
  <defs>
    <radialGradient id="enamelFill" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fbfaf6"/><stop offset=".6" stop-color="#e9ece6"/><stop offset="1" stop-color="#c9d1cb"/></radialGradient>
  </defs>
  <g class="gums">${gums}</g>
  <g class="teeth">${body}</g>
  <g class="nums" aria-hidden="true">${labels}</g>
  <g class="hits">${groups}</g>
</svg>`
}
