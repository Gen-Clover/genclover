/**
 * The Arden dental unit, drawn in SVG (side view, 800 x 560).
 *
 * One drawing, two renderings:
 *   paint  soft gradients in a palette, for the hero and the collection;
 *   line   strokes only, every part grouped by assembly stage, for the
 *          production blueprint that draws itself.
 */

export const PALETTES = {
  aurum: { name: 'Aurum', up: '#b47d55', upDark: '#865636', shell: '#c9ccd0', shellDark: '#7f848a', metal: '#9a9ea4' },
  alba: { name: 'Alba', up: '#f6f6f3', upDark: '#d6d8d4', shell: '#eef0f1', shellDark: '#c4c8cc', metal: '#c9cdd1' },
  marine: { name: 'Marine', up: '#3d5396', upDark: '#26366b', shell: '#f6f7f8', shellDark: '#cfd3d8', metal: '#d4d8dc' },
}

/** [stage, label, list of [kind, attributes]]. kind: path | rect | circle | ellipse | line */
const PARTS = [
  ['base', 'Base & footprint', [
    ['path', { d: 'M150 520 Q150 492 185 490 L575 488 Q615 488 622 506 L628 520 Z', f: 'shell' }],
    ['path', { d: 'M470 488 L520 470 L600 470 Q620 472 624 490', f: 'shell' }],
    ['rect', { x: 70, y: 506, width: 46, height: 14, rx: 6, f: 'metal' }],
    ['path', { d: 'M116 514 Q160 528 200 512', f: 'none', s: 1 }],
  ]],
  ['lift', 'Lift column', [
    ['path', { d: 'M250 490 L300 400 L392 400 L420 490 Z', f: 'shellDark' }],
    ['path', { d: 'M282 440 L404 440', f: 'none', s: 1 }],
  ]],
  ['seat', 'Seat & leg rest', [
    ['path', { d: 'M232 404 L562 384 Q590 384 596 398 L252 428 Z', f: 'shell' }],
    ['path', { d: 'M236 384 Q400 362 592 352 Q614 352 612 368 Q606 382 584 384 Q400 396 252 404 Q228 402 236 384 Z', f: 'up' }],
    ['path', { d: 'M300 380 Q420 368 560 362', f: 'none', s: 1 }],
  ]],
  ['back', 'Backrest & headrest', [
    ['path', { d: 'M230 382 Q186 322 148 252 Q138 230 158 222 Q178 216 190 234 Q228 300 266 364 Z', f: 'up' }],
    ['path', { d: 'M164 232 Q200 296 240 360', f: 'none', s: 1 }],
    ['ellipse', { cx: 128, cy: 202, rx: 34, ry: 17, transform: 'rotate(-58 128 202)', f: 'up' }],
    ['path', { d: 'M150 228 L140 214', f: 'none', s: 3 }],
    ['path', { d: 'M248 344 Q290 336 330 338', f: 'none', s: 9, c: 'upDark' }],
  ]],
  ['unit', 'Cuspidor & delivery unit', [
    ['rect', { x: 372, y: 262, width: 70, height: 140, rx: 18, f: 'shell' }],
    ['ellipse', { cx: 420, cy: 262, rx: 40, ry: 11, f: 'shellDark' }],
    ['path', { d: 'M436 262 Q440 236 452 236', f: 'none', s: 3 }],
    ['path', { d: 'M470 320 L630 262', f: 'none', s: 12, c: 'shell' }],
    ['rect', { x: 604, y: 238, width: 150, height: 30, rx: 10, f: 'shell' }],
    ['rect', { x: 690, y: 214, width: 46, height: 26, rx: 4, f: 'metal' }],
    ['path', { d: 'M624 268 Q616 390 640 396 Q656 398 650 268', f: 'none', s: 2 }],
    ['path', { d: 'M654 268 Q646 400 670 404 Q686 406 680 268', f: 'none', s: 2 }],
    ['path', { d: 'M684 268 Q676 396 700 400 Q716 402 710 268', f: 'none', s: 2 }],
    ['path', { d: 'M714 268 Q706 388 730 392 Q746 394 740 268', f: 'none', s: 2 }],
  ]],
  ['light', 'Operating light', [
    ['path', { d: 'M472 400 L472 118 L330 118 L330 140', f: 'none', s: 10, c: 'shell' }],
    ['circle', { cx: 318, cy: 176, r: 38, f: 'shellDark' }],
    ['circle', { cx: 318, cy: 176, r: 24, f: 'glow' }],
  ]],
]

const ATTRS = (a) =>
  Object.entries(a)
    .filter(([k]) => !['f', 's', 'c'].includes(k))
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')

export const chairSVG = ({ mode = 'paint', palette = PALETTES.aurum, id = 'c' } = {}) => {
  const paint = mode === 'paint'
  const fill = (f) => {
    if (!paint || f === 'none') return 'none'
    if (f === 'glow') return `url(#${id}-glow)`
    if (f === 'up') return `url(#${id}-up)`
    if (f === 'shell') return `url(#${id}-shell)`
    return palette[f] ?? f
  }
  const groups = PARTS.map(([stage, label, shapes]) => {
    const body = shapes
      .map(([tag, a]) => {
        const stroke = paint ? (a.f === 'none' ? palette[a.c ?? 'shellDark'] : 'rgba(0,0,0,.08)') : 'currentColor'
        const width = paint ? (a.s ?? 1) : Math.min(a.s ?? 1.4, 3)
        return `<${tag} ${ATTRS(a)} fill="${fill(a.f)}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`
      })
      .join('')
    return `<g class="part" data-stage="${stage}" aria-label="${label}">${body}</g>`
  })
  const defs = paint
    ? `<defs>
        <linearGradient id="${id}-up" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${palette.up}"/><stop offset="1" stop-color="${palette.upDark}"/></linearGradient>
        <linearGradient id="${id}-shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="${palette.shell}"/><stop offset="1" stop-color="${palette.shellDark}"/></linearGradient>
        <radialGradient id="${id}-glow"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fffbea"/><stop offset="1" stop-color="#e9e3cf"/></radialGradient>
        <radialGradient id="${id}-shadow"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse cx="400" cy="524" rx="330" ry="16" fill="url(#${id}-shadow)"/>`
    : ''
  return `<svg viewBox="40 90 740 450" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An Arden dental unit">${defs}${groups.join('')}</svg>`
}

export const STAGES = PARTS.map(([stage, label]) => ({ stage, label }))
