import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/bodoni-moda/opsz-italic.css'
import '@fontsource-variable/hanken-grotesk/wght.css'
import '@fontsource/la-belle-aurore/400.css'
import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createImplantFilm } from './implant3d.js'

gsap.registerPlugin(ScrollTrigger)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
const $ = (id) => document.getElementById(id)

/* title card, then the curtain opens */
document.body.classList.add('is-loading')
const intro = $('intro')
const started = performance.now()
requestAnimationFrame(() => ($('introBar').style.transform = 'scaleX(0.35)'))
const openCurtain = () => {
  $('introBar').style.transform = 'scaleX(1)'
  setTimeout(
    () => {
      intro.classList.add('is-done')
      document.body.classList.remove('is-loading')
      document.body.classList.add('is-ready')
      setTimeout(() => intro.classList.add('is-gone'), 1500)
    },
    reduced ? 0 : 450,
  )
}
const whenLoaded = () => setTimeout(openCurtain, reduced ? 0 : Math.max(0, 1300 - (performance.now() - started)))
if (document.readyState === 'complete') whenLoaded()
else addEventListener('load', whenLoaded, { once: true })

/* smooth scroll, kept in step with the scroll-driven scenes */
let lenis = null
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'))
    if (!target) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(target, { duration: 1.6 })
    else target.scrollIntoView()
  }),
)

ScrollTrigger.create({ start: 80, end: 'max', onToggle: (s) => $('nav').classList.toggle('is-solid', s.isActive) })

/* the implant film */
let film = null
try {
  film = createImplantFilm($('film'))
} catch (err) {
  console.warn('3D unavailable, showing the photo instead.', err)
  $('film').hidden = true
  $('filmFallback').hidden = false
}
const prologue = document.querySelector('.prologue')
const chapters = [...document.querySelectorAll('.chapter')]
const stops = [...document.querySelectorAll('.rail li')]
const setScene = (p) => {
  film?.setProgress(p)
  prologue.classList.toggle('is-off', p > 0.07)
  chapters.forEach((c) => c.classList.toggle('is-on', p >= +c.dataset.from && p < +c.dataset.to))
  stops.forEach((s, i) => s.classList.toggle('is-on', p >= +s.dataset.at && (i === stops.length - 1 || p < +stops[i + 1].dataset.at)))
  $('railFill').style.transform = `scaleX(${p})`
}
ScrollTrigger.create({ trigger: '.film', start: 'top top', end: 'bottom bottom', onUpdate: (s) => setScene(s.progress) })
setScene(0)
if (film) {
  new IntersectionObserver(([e]) => (e.isIntersecting ? film.start() : film.stop())).observe($('film'))
  addEventListener('resize', () => film.resize())
  if (fine && !reduced) addEventListener('pointermove', (e) => film.setPointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5))
}

/* results: drag to compare, two cases */
const compare = $('compare')
$('compareRange').addEventListener('input', (e) => compare.style.setProperty('--x', `${e.target.value}%`))
const CASES = [
  { src: './assets/smile.jpg', after: 'After: an even, bright smile', before: 'Before: the same smile, duller and uneven in shade' },
  { src: './assets/veneers.jpg', after: 'After: a smile with porcelain veneers', before: 'Before: the same smile, darker and uneven' },
]
const caseUrls = CASES.map((c) => new URL(c.src, import.meta.url).href)
document.querySelectorAll('.cases button').forEach((b) =>
  b.addEventListener('click', () => {
    if (b.getAttribute('aria-selected') === 'true') return
    document.querySelectorAll('.cases button').forEach((x) => x.setAttribute('aria-selected', String(x === b)))
    const c = CASES[+b.dataset.case]
    compare.classList.add('is-swapping')
    setTimeout(() => {
      $('after').src = $('before').src = caseUrls[+b.dataset.case]
      $('after').alt = c.after
      $('before').alt = c.before
      compare.classList.remove('is-swapping')
    }, 350)
  }),
)

/* the doctor: the signature writes itself, the photo drifts */
new IntersectionObserver(
  ([e], io) => {
    if (!e.isIntersecting) return
    e.target.classList.add('is-in')
    io.disconnect()
  },
  { threshold: 0.4 },
).observe($('doctor'))

const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.fromTo('.doctor__photo img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.doctor', start: 'top bottom', end: 'bottom top', scrub: true } })
  gsap.fromTo('.consult__bg', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.consult', start: 'top bottom', end: 'top top', scrub: true } })
  // section titles rise in once
  gsap.utils.toArray('.results h2, .tech__title, .treatments h2, .consult h2').forEach((h) =>
    gsap.from(h, { y: 60, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } }),
  )
})

/* technology: vertical scroll drives a sideways reel */
mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
  const track = $('techTrack')
  const distance = () => track.scrollWidth - (innerWidth - track.getBoundingClientRect().left) + 64
  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: { trigger: '#techPin', start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
  })
})

/* treatments: a preview follows the pointer */
if (fine) {
  const peek = $('peek')
  const img = $('peekImg')
  let x = 0
  let y = 0
  let tx = 0
  let ty = 0
  const follow = () => {
    x += (tx - x) * 0.14
    y += (ty - y) * 0.14
    peek.style.transform = `translate(${x + 40}px, ${y - 190}px) rotate(${(tx - x) * 0.03}deg)`
    requestAnimationFrame(follow)
  }
  requestAnimationFrame(follow)
  document.querySelectorAll('#index li').forEach((li) => {
    const src = new URL(li.dataset.img, import.meta.url).href
    li.addEventListener('pointerenter', () => {
      if (img.src !== src) img.src = src
      peek.classList.add('is-on')
    })
  })
  $('index').addEventListener('pointerleave', () => peek.classList.remove('is-on'))
  $('index').addEventListener('pointermove', (e) => {
    tx = e.clientX
    ty = e.clientY
  })
}

/* reviews */
const voices = [...document.querySelectorAll('.voice')]
let voice = 0
const showVoice = (i) => {
  voice = (i + voices.length) % voices.length
  voices.forEach((v, j) => v.classList.toggle('is-on', j === voice))
  $('voiceCount').textContent = `${voice + 1} / ${voices.length}`
}
let voiceTimer = reduced ? 0 : setInterval(() => showVoice(voice + 1), 6500)
const nudge = (d) => {
  clearInterval(voiceTimer)
  showVoice(voice + d)
}
$('voicePrev').addEventListener('click', () => nudge(-1))
$('voiceNext').addEventListener('click', () => nudge(1))

/* consultation form */
const form = $('consultForm')
const flag = (id, bad) => {
  $(`${id}Error`).hidden = !bad
  $(id).setAttribute('aria-invalid', String(bad))
  return bad
}
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const d = new FormData(form)
  const badName = flag('cName', !(d.get('name') || '').trim())
  const badPhone = flag('cPhone', (d.get('phone') || '').replace(/\D/g, '').length < 10)
  if (badName || badPhone) return $(badName ? 'cName' : 'cPhone').focus()
  const btn = $('cSubmit')
  btn.disabled = true
  btn.textContent = 'Sending…'
  setTimeout(
    () => {
      $('sentTitle').textContent = `Thank you, ${d.get('name').trim().split(' ')[0]}.`
      $('sentText').textContent = `We will call within the hour about ${d.get('treatment').toLowerCase()}. This is a demo, so nothing was sent.`
      $('sent').hidden = false
      btn.disabled = false
      btn.textContent = 'Book a free consultation'
    },
    reduced ? 0 : 900,
  )
})
;['cName', 'cPhone'].forEach((id) => $(id).addEventListener('input', () => flag(id, false)))
