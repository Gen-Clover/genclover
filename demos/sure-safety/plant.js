/**
 * The plant: an illustrated industrial site, one zone per hazard, drawn in line on
 * graphite. Each zone carries its own small working motion (molten metal pouring,
 * an arc between insulators, bubbling tanks, a harnessed worker, smoke, a fan and
 * its noise, flames and mist, grinder sparks). Zones are keyed by hazard id.
 */

const zone = (id, label, x, body) => `
  <g class="pl-zone" data-zone="${id}" style="--d:${x / 1600}">
    <g class="pl-rise">${body}</g>
    <g class="pl-sign" transform="translate(${x} 70)">
      <line class="pl-pole" x1="0" y1="14" x2="0" y2="36" />
      <rect class="pl-sign-box" x="-62" y="-10" width="124" height="30" rx="4" />
      <text class="pl-sign-text" x="0" y="10">${label}</text>
    </g>
  </g>`

/** A few sparks, each with its own drift and delay. */
const sparks = (cx, cy, n, spread = 1) =>
  Array.from({ length: n }, (_, i) => {
    const a = (-0.9 + (i / (n - 1)) * 1.8) * spread
    return `<circle class="pl-spark" cx="${cx}" cy="${cy}" r="${1.6 + (i % 3) * 0.5}" style="--sx:${Math.round(Math.sin(a) * 46)}px;--sy:${Math.round(-30 - Math.cos(a) * 26)}px;--t:${(0.7 + (i % 4) * 0.18).toFixed(2)}s;--dl:${((i * 0.13) % 0.9).toFixed(2)}s" />`
  }).join('')

const puffs = (cx, cy, n, cls = 'pl-smoke') =>
  Array.from({ length: n }, (_, i) => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${10 + i * 3}" style="--dl:${(i * (3.6 / n)).toFixed(2)}s" />`).join('')

const windows = (x, y, cols, rows, w = 12, h = 10, gx = 20, gy = 18, lit = []) =>
  Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    return `<rect class="pl-win${lit.includes(i) ? ' pl-win--lit' : ''}" x="${x + c * gx}" y="${y + r * gy}" width="${w}" height="${h}" rx="1.5" style="--dl:${((i * 0.7) % 5).toFixed(1)}s" />`
  }).join('')

export const PLANT_SVG = `
<svg class="plant" viewBox="0 40 1600 500" role="group" aria-label="An industrial site: choose an area to see the protection it needs">
  <defs>
    <linearGradient id="plSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15181b"/><stop offset="1" stop-color="#22262b"/></linearGradient>
    <radialGradient id="plGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ff8a3d" stop-opacity="0.9"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>
    <linearGradient id="plLiquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd6c2"/><stop offset="1" stop-color="#2f8f7f"/></linearGradient>
    <clipPath id="plTankA"><rect x="446" y="336" width="48" height="138" rx="10"/></clipPath>
    <clipPath id="plTankB"><rect x="521" y="366" width="58" height="108" rx="12"/></clipPath>
  </defs>
  <rect class="pl-sky" y="40" width="1600" height="500" fill="url(#plSky)"/>
  <g class="pl-clouds" aria-hidden="true">
    <path class="pl-cloud" d="M120 120h70a18 18 0 0 0-30-22 24 24 0 0 0-44 6 16 16 0 0 0 4 16z" style="--cd:70s"/>
    <path class="pl-cloud" d="M780 92h90a22 22 0 0 0-38-26 30 30 0 0 0-56 8 18 18 0 0 0 4 18z" style="--cd:95s;--co:-30s"/>
    <path class="pl-cloud" d="M1320 130h70a18 18 0 0 0-30-22 24 24 0 0 0-44 6 16 16 0 0 0 4 16z" style="--cd:80s;--co:-55s"/>
  </g>
  <line class="pl-horizon" x1="0" y1="480" x2="1600" y2="480"/>

  ${zone(
    'heat',
    'HEAT',
    125,
    `<rect class="pl-body" x="38" y="300" width="170" height="180"/>
     <path class="pl-body" d="M30 300 L123 252 L216 300 Z"/>
     <rect class="pl-body" x="162" y="196" width="24" height="96"/>
     <line class="pl-line" x1="162" y1="214" x2="186" y2="214"/><line class="pl-line" x1="162" y1="232" x2="186" y2="232"/>
     ${puffs(174, 190, 4)}
     <rect class="pl-glass" x="64" y="350" width="118" height="130"/>
     <circle class="pl-heatglow" cx="126" cy="470" r="70" fill="url(#plGlow)"/>
     <g class="pl-ladle"><path class="pl-metal" d="M84 362 h52 l-8 30 h-36 z"/><line class="pl-line" x1="76" y1="354" x2="144" y2="354"/><line class="pl-line" x1="110" y1="340" x2="110" y2="354"/></g>
     <path class="pl-pour" d="M128 384 C 136 410, 132 440, 130 470"/>
     <ellipse class="pl-pool" cx="130" cy="472" rx="30" ry="5"/>
     ${sparks(130, 468, 9)}`,
  )}

  ${zone(
    'electrical',
    'ELECTRICAL',
    320,
    `<rect class="pl-body" x="236" y="404" width="78" height="76" rx="3"/>
     ${[0, 1, 2, 3, 4].map((i) => `<line class="pl-line pl-faint" x1="${246 + i * 14}" y1="414" x2="${246 + i * 14}" y2="470"/>`).join('')}
     <path class="pl-line" d="M330 480 L352 250 L374 480 M337 410 L367 410 M341 360 L363 360 M345 310 L359 310 M337 410 L363 360 M367 410 L341 360 M341 360 L359 310 M363 360 L345 310"/>
     <line class="pl-line pl-thick" x1="318" y1="262" x2="386" y2="262"/>
     <line class="pl-line" x1="326" y1="292" x2="378" y2="292"/>
     <rect class="pl-insul" x="321" y="262" width="7" height="18" rx="2"/><rect class="pl-insul" x="376" y="262" width="7" height="18" rx="2"/>
     <path class="pl-wire" d="M324 280 Q 280 310 240 300"/><path class="pl-wire" d="M380 280 Q 410 300 420 290"/>
     <path class="pl-arc" d="M328 270 l8 -6 l6 8 l7 -9 l6 8 l7 -8 l6 7 l8 -6"/>
     <path class="pl-arc pl-arc--b" d="M328 274 l9 4 l6 -7 l8 6 l6 -6 l7 7 l7 -5 l6 4"/>
     <g transform="translate(276 432)"><path class="pl-warn" d="M0 -16 L15 10 L-15 10 Z"/><path class="pl-warn-bolt" d="M1 -8 L-4 2 H1 L-1 8 L5 -2 H0 Z"/></g>`,
  )}

  ${zone(
    'chemical',
    'CHEMICAL',
    512,
    `<rect class="pl-body" x="440" y="330" width="60" height="150" rx="12"/>
     <rect class="pl-body" x="515" y="360" width="70" height="120" rx="14"/>
     <g clip-path="url(#plTankA)"><path class="pl-liquid" d="M430 400 q 12 -6 24 0 t 24 0 t 24 0 t 24 0 V480 H430 Z"/>${[0, 1, 2].map((i) => `<circle class="pl-bubble" cx="${458 + i * 12}" cy="470" r="${2.5 + i}" style="--dl:${i * 0.9}s"/>`).join('')}</g>
     <g clip-path="url(#plTankB)"><path class="pl-liquid pl-liquid--b" d="M505 420 q 12 -6 24 0 t 24 0 t 24 0 t 24 0 V480 H505 Z"/>${[0, 1, 2].map((i) => `<circle class="pl-bubble" cx="${534 + i * 14}" cy="470" r="${2.5 + (i % 2)}" style="--dl:${0.4 + i * 0.8}s"/>`).join('')}</g>
     <path class="pl-line" d="M500 360 H515 M500 440 H515 M585 450 H600 V480"/>
     <circle class="pl-line" cx="507" cy="440" r="4"/>
     <path class="pl-drip" d="M600 452 q 3 6 0 9 q -3 -3 0 -9z"/>
     <g transform="translate(470 300)"><rect class="pl-diamond" x="-10" y="-10" width="20" height="20" transform="rotate(45)"/><text class="pl-diamond-t" x="0" y="4">8</text></g>`,
  )}

  ${zone(
    'height',
    'HEIGHT',
    710,
    `<path class="pl-line" d="M668 480 L688 160 L732 160 L752 480"/>
     ${[0, 1, 2, 3, 4, 5].map((i) => {
       const y1 = 480 - i * 53
       const y2 = y1 - 53
       const l1 = 668 + (i * 20) / 6
       const r1 = 752 - (i * 20) / 6
       const l2 = 668 + ((i + 1) * 20) / 6
       const r2 = 752 - ((i + 1) * 20) / 6
       return `<path class="pl-line pl-faint" d="M${l1} ${y1} L${r2} ${y2} M${r1} ${y1} L${l2} ${y2} M${l2} ${y2} H${r2}"/>`
     }).join('')}
     <rect class="pl-body" x="660" y="226" width="100" height="10"/>
     <line class="pl-line" x1="660" y1="226" x2="660" y2="206"/><line class="pl-line" x1="760" y1="226" x2="760" y2="206"/><line class="pl-line" x1="660" y1="206" x2="760" y2="206"/>
     <circle class="pl-beacon" cx="710" cy="152" r="6"/>
     <g class="pl-worker">
       <line class="pl-lanyard" x1="745" y1="206" x2="770" y2="244"/>
       <circle class="pl-person" cx="774" cy="232" r="7"/>
       <path class="pl-hardhat" d="M766 229 a8 7 0 0 1 16 0 z"/>
       <path class="pl-person-line" d="M774 239 V266 M774 247 L762 238 M774 247 L786 256 M774 266 L766 286 M774 266 L782 286"/>
       <path class="pl-harness" d="M769 243 L779 256 M779 243 L769 256"/>
     </g>`,
  )}

  ${zone(
    'air',
    'DUST & FUMES',
    905,
    `<rect class="pl-body" x="888" y="140" width="34" height="340"/>
     <rect class="pl-band" x="888" y="160" width="34" height="8"/><rect class="pl-band" x="888" y="186" width="34" height="8"/>
     ${puffs(905, 132, 5, 'pl-smoke pl-smoke--big')}
     <rect class="pl-body" x="822" y="390" width="62" height="90"/>
     <path class="pl-line" d="M884 410 H888 M853 390 V350 H888"/>
     ${windows(832, 404, 2, 3, 16, 12, 24, 22)}
     ${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="pl-dust" cx="${940 + (i % 3) * 14}" cy="${460 - (i % 2) * 20}" r="2" style="--dl:${(i * 0.45).toFixed(2)}s"/>`).join('')}
     <rect class="pl-body" x="930" y="420" width="50" height="60"/>`,
  )}

  ${zone(
    'noise',
    'NOISE',
    1100,
    `<rect class="pl-body" x="1026" y="350" width="150" height="130"/>
     <path class="pl-body" d="M1020 350 H1182 L1170 334 H1032 Z"/>
     <circle class="pl-glass" cx="1072" cy="415" r="30"/>
     <g class="pl-fan"><path class="pl-blade" d="M1072 415 L1072 389 A26 26 0 0 1 1094 402 Z"/><path class="pl-blade" d="M1072 415 L1094 428 A26 26 0 0 1 1072 441 Z"/><path class="pl-blade" d="M1072 415 L1050 428 A26 26 0 0 1 1050 402 Z"/></g>
     <circle class="pl-hub" cx="1072" cy="415" r="5"/>
     ${windows(1118, 372, 2, 3, 18, 12, 26, 22, [1])}
     ${[0, 1, 2].map((i) => `<path class="pl-wave" d="M1186 ${380 - i * 6} q ${18 + i * 12} ${35 + i * 6} 0 ${70 + i * 12}" style="--dl:${i * 0.4}s"/>`).join('')}`,
  )}

  ${zone(
    'fire',
    'FIRE',
    1300,
    `<rect class="pl-body" x="1222" y="380" width="160" height="100"/>
     <path class="pl-body" d="M1214 380 L1302 336 L1390 380 Z"/>
     <rect class="pl-glass" x="1240" y="404" width="40" height="76"/>
     ${windows(1300, 400, 3, 2, 14, 14, 24, 26, [0, 4])}
     <g class="pl-flames" transform="translate(1302 344)">
       <path class="pl-flame" d="M-14 0 C -16 -16, -4 -18, -6 -34 C 4 -22, 10 -18, 8 0 Z" style="--dl:0s"/>
       <path class="pl-flame pl-flame--hot" d="M-4 0 C -6 -12, 4 -14, 2 -26 C 10 -14, 12 -10, 10 0 Z" style="--dl:.25s"/>
       <path class="pl-flame" d="M6 0 C 6 -10, 16 -12, 14 -22 C 22 -12, 22 -6, 20 0 Z" style="--dl:.5s"/>
     </g>
     <path class="pl-line" d="M1400 480 V430 H1412"/><circle class="pl-accent" cx="1404" cy="426" r="4"/>
     ${Array.from({ length: 8 }, (_, i) => `<circle class="pl-mist" cx="1414" cy="430" r="2" style="--mx:${-30 - i * 9}px;--my:${-46 - (i % 3) * 12}px;--dl:${(i * 0.15).toFixed(2)}s"/>`).join('')}`,
  )}

  ${zone(
    'impact',
    'CUTS & IMPACT',
    1495,
    `<path class="pl-body" d="M1424 480 V360 L1458 330 V360 L1492 330 V360 L1526 330 V360 L1560 330 V480 Z"/>
     <rect class="pl-glass" x="1440" y="400" width="100" height="80"/>
     <rect class="pl-body" x="1470" y="440" width="38" height="40"/>
     <circle class="pl-disc" cx="1490" cy="436" r="10"/>
     ${sparks(1500, 436, 8, 0.7)}
     <line class="pl-line" x1="1424" y1="300" x2="1590" y2="300"/>
     <line class="pl-line" x1="1586" y1="300" x2="1586" y2="480"/>
     <g class="pl-hook"><line class="pl-line" x1="1560" y1="300" x2="1560" y2="356"/><path class="pl-line" d="M1560 356 a5 5 0 1 0 5 5"/><rect class="pl-crate" x="1546" y="366" width="28" height="22" rx="2"/></g>`,
  )}

  <g class="pl-road" aria-hidden="true">
    <line class="pl-lane" x1="0" y1="510" x2="1600" y2="510"/>
    <g class="pl-forklift">
      <rect class="pl-fork-body" x="0" y="484" width="34" height="18" rx="3"/>
      <path class="pl-line" d="M8 484 V470 H26 V484"/>
      <path class="pl-line" d="M34 474 V502 H50"/>
      <rect class="pl-fork-load" x="38" y="482" width="16" height="14" rx="1"/>
      <circle class="pl-wheel" cx="8" cy="504" r="5"/><circle class="pl-wheel" cx="28" cy="504" r="5"/>
      <circle class="pl-beacon pl-beacon--small" cx="17" cy="468" r="2.5"/>
    </g>
  </g>
  ${Object.entries({ heat: [26, 236], electrical: [226, 236], chemical: [426, 236], height: [616, 236], air: [810, 236], noise: [1010, 236], fire: [1206, 236], impact: [1410, 236] })
    .map(([id, [x]]) => `<rect class="pl-hit" data-hit="${id}" x="${x}" y="60" width="${id === 'impact' ? 186 : 196}" height="440" tabindex="0" role="button" aria-label="${id}"/>`)
    .join('')}
</svg>`
