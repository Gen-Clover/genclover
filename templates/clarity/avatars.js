/**
 * Illustrated team avatars. Drawn here rather than photographed, so the
 * template never puts a placeholder name on a real person's face. A practice
 * swaps them for its own team photos.
 */

const PEOPLE = [
  { bg: '#dfe7e4', skin: '#c98e62', hair: '#1f1a17', style: 'short', glasses: true, scrub: '#0e6e6a' },
  { bg: '#ebe2d8', skin: '#b97d55', hair: '#231a15', style: 'long', glasses: false, scrub: '#3c5a8a' },
  { bg: '#e4e1ec', skin: '#d6a27a', hair: '#3a2a20', style: 'bun', glasses: true, scrub: '#7a4b6b' },
  { bg: '#dde4ea', skin: '#a8714b', hair: '#161312', style: 'parted', glasses: false, scrub: '#2f6b4f' },
]

/** Darken a hex colour by a fraction, for shading skin and hair. */
const shade = (hex, amount) => {
  const n = parseInt(hex.slice(1), 16)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - amount)))
  return `rgb(${c.join(',')})`
}

const HAIR_BACK = {
  long: (c) => `<path d="M150 118c-12 60-8 112 12 138h76c20-26 24-78 12-138z" fill="${c}"/>`,
  bun: (c) => `<circle cx="200" cy="74" r="22" fill="${c}"/>`,
  short: () => '',
  parted: () => '',
}

const HAIR_FRONT = {
  short: (c) => `<path d="M154 130c-6-44 18-66 48-66 30 0 50 20 44 66-6-18-20-30-44-30-24 0-40 10-48 30z" fill="${c}"/>`,
  parted: (c) => `<path d="M154 132c-8-46 16-70 48-70 32 0 52 24 44 70-4-14-12-26-26-32-10 8-30 12-52 10-6 6-11 13-14 22z" fill="${c}"/>`,
  long: (c) => `<path d="M154 136c-4-50 20-72 48-72s52 22 46 72c-14-20-26-34-48-38-14 14-30 26-46 38z" fill="${c}"/>`,
  bun: (c) => `<path d="M156 130c-4-42 18-62 46-62 28 0 48 20 42 62-8-16-22-28-44-28-22 0-36 10-44 28z" fill="${c}"/>`,
}

export const avatarSvg = (index) => {
  const p = PEOPLE[index % PEOPLE.length]
  const skinShadow = shade(p.skin, 0.16)
  const ink = '#2a2420'
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="400" height="300" fill="${p.bg}"/>
  <circle cx="320" cy="70" r="90" fill="#fff" opacity=".35"/>
  ${HAIR_BACK[p.style](p.hair)}
  <path d="M66 300c8-58 60-88 134-90 74 2 126 32 134 90z" fill="#f6f7f4"/>
  <path d="M168 214l32 52 32-52z" fill="${p.scrub}"/>
  <path d="M156 216l44 70M244 216l-44 70" stroke="#d9dcd6" stroke-width="3" fill="none"/>
  <path d="M172 214c-6 34 6 56 26 60M228 214c6 32-4 52-20 58" stroke="#3d4a52" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="204" cy="276" r="8" fill="#3d4a52"/><circle cx="204" cy="276" r="3.5" fill="#9aa7ad"/>
  <path d="M182 172h36v34c-10 12-26 12-36 0z" fill="${skinShadow}"/>
  <ellipse cx="156" cy="140" rx="9" ry="13" fill="${skinShadow}"/>
  <ellipse cx="244" cy="140" rx="9" ry="13" fill="${skinShadow}"/>
  <ellipse cx="200" cy="134" rx="45" ry="53" fill="${p.skin}"/>
  ${HAIR_FRONT[p.style](p.hair)}
  <path d="M176 124q8-5 16 0M208 124q8-5 16 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="184" cy="138" r="3.6" fill="${ink}"/><circle cx="216" cy="138" r="3.6" fill="${ink}"/>
  <path d="M200 144q-5 12 2 15" stroke="${skinShadow}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M186 166q14 11 28 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="174" cy="156" rx="8" ry="5" fill="#e07a6a" opacity=".22"/><ellipse cx="226" cy="156" rx="8" ry="5" fill="#e07a6a" opacity=".22"/>
  ${
    p.glasses
      ? `<g stroke="${ink}" stroke-width="2.6" fill="#fff" fill-opacity=".15"><rect x="168" y="127" width="30" height="22" rx="9"/><rect x="202" y="127" width="30" height="22" rx="9"/><path d="M198 136h4"/></g>`
      : ''
  }
</svg>`
}

export const drawAvatars = () => {
  document.querySelectorAll('[data-avatar]').forEach((el) => {
    el.innerHTML = avatarSvg(Number(el.dataset.avatar))
  })
}
