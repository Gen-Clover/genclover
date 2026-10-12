/**
 * Motion for the whole site: smooth scrolling, headings that rise in line by line,
 * numbers that count up, category tiles that fly in and settle, and the scroll and
 * pointer parallax on the hero kit and photo bands. Everything is torn down between
 * pages and skipped under reduced motion.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { $$, reduced } from './ui.js'

gsap.registerPlugin(ScrollTrigger)

export let lenis = null
export function startSmoothScroll() {
  if (reduced) return
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
/** Overlays scroll inside themselves; the page underneath must not move. */
export const pauseScroll = (on) => (on ? lenis?.stop() : lenis?.start())
export const scrollToTop = () => (lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0))
export const scrollToEl = (el) => (lenis ? lenis.scrollTo(el, { offset: -80, duration: 1.2 }) : el.scrollIntoView())

const inView = (els, fn, margin = '0px 0px -12% 0px') => {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return
        fn(e.target)
        io.unobserve(e.target)
      }),
    { rootMargin: margin },
  )
  els.forEach((el) => io.observe(el))
  return io
}

/** Wrap each word of a heading so it can rise out of its own line. */
const split = (el) => {
  if (el.dataset.split) return
  el.dataset.split = '1'
  let i = 0
  const walk = (node) => {
    ;[...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) return frag.append(part)
          const w = document.createElement('span')
          w.className = 'w'
          w.innerHTML = `<span style="--i:${i++}">${part}</span>`
          frag.append(w)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1) walk(n)
    })
  }
  walk(el)
}

const countUp = (el) => {
  const to = +el.dataset.count
  const suffix = el.dataset.suffix ?? ''
  const fmt = (n) => Math.round(n).toLocaleString('en-IN') + suffix
  if (reduced) return (el.textContent = fmt(to))
  const o = { n: 0 }
  gsap.to(o, { n: to, duration: to > 100 ? 1.8 : 1.1, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(o.n)) })
}

let cleanups = []
export function mountMotion(root) {
  cleanups.forEach((fn) => fn())
  cleanups = []
  ScrollTrigger.getAll().forEach((t) => t.kill())

  // headings
  const heads = $$('.split, .h1', root)
  heads.forEach(split)
  if (reduced) heads.forEach((h) => h.classList.add('is-in'))
  else {
    const io = inView(heads, (h) => h.classList.add('is-in'))
    cleanups.push(() => io.disconnect())
  }

  // counters
  const counters = $$('[data-count]', root)
  const cio = inView(counters, countUp)
  cleanups.push(() => cio.disconnect())

  // category tiles fly in from scattered positions and settle
  const tiles = $$('.cat, .cat-row', root)
  tiles.forEach((t, i) => {
    const r = (n) => ((Math.sin(i * 12.9898 + n) * 43758.5453) % 1 + 1) % 1
    t.style.setProperty('--fx', `${Math.round((r(1) - 0.5) * 160)}px`)
    t.style.setProperty('--fy', `${Math.round(60 + r(2) * 120)}px`)
    t.style.setProperty('--fr', `${Math.round((r(3) - 0.5) * 24)}deg`)
    t.style.setProperty('--fd', `${(i % 9) * 55}ms`)
  })
  if (reduced) tiles.forEach((t) => t.classList.add('is-in'))
  else if (tiles.length) {
    const tio = inView([$$('.cats', root)[0]].filter(Boolean), () => tiles.forEach((t) => t.classList.add('is-in')), '0px 0px -20% 0px')
    cleanups.push(() => tio.disconnect())
  }

  // generic reveals
  const ups = $$('.reveal-up', root)
  if (reduced) ups.forEach((u) => u.classList.add('is-in'))
  else {
    const uio = inView(ups, (u) => u.classList.add('is-in'))
    cleanups.push(() => uio.disconnect())
  }

  if (reduced) return

  // hero kit: pieces separate as the page scrolls, and lean toward the pointer
  const kit = $$('.kit', root)[0]
  if (kit) {
    $$('.kit__item', kit).forEach((item, i) => {
      const depth = [-1.6, -0.9, 0.6, -0.3, 0.4, 1.2, 1.4, 2][i] ?? 0
      item.style.setProperty('--depth', depth)
      gsap.to(item, { y: depth * 60, ease: 'none', scrollTrigger: { trigger: kit, start: 'top 20%', end: 'bottom top', scrub: 0.6 } })
    })
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let raf = 0
      const move = (e) => {
        const b = kit.getBoundingClientRect()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          kit.style.setProperty('--px', ((e.clientX - b.left) / b.width - 0.5).toFixed(3))
          kit.style.setProperty('--py', ((e.clientY - b.top) / b.height - 0.5).toFixed(3))
        })
      }
      const leave = () => {
        kit.style.setProperty('--px', 0)
        kit.style.setProperty('--py', 0)
      }
      kit.addEventListener('pointermove', move)
      kit.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        kit.removeEventListener('pointermove', move)
        kit.removeEventListener('pointerleave', leave)
      })
    }
  }

  // photo bands drift slower than the page
  $$('.maker__bg, .page-hero--photo > img', root).forEach((img) =>
    gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }),
  )
  // the maker facts slide in one after another
  const facts = $$('.maker__facts > div', root)
  if (facts.length) gsap.from(facts, { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: facts[0], start: 'top 85%' } })
  // service photos open like a shutter as they arrive
  $$('.svc-item figure', root).forEach((f) =>
    gsap.fromTo(f, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 80%' } }),
  )
  // product cards rise in rows
  ScrollTrigger.batch($$('#catalogGrid .card, .pdp__rel .card', root), {
    start: 'top 92%',
    onEnter: (b) => gsap.fromTo(b, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'expo.out', overwrite: true }),
  })
  requestAnimationFrame(() => ScrollTrigger.refresh())
}
