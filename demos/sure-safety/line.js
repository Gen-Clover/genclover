/**
 * The production line motifs: welding sparks over the hero photo, and the pipe that
 * runs down the page joining each station, drawn as the visitor scrolls.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced } from './ui.js'

gsap.registerPlugin(ScrollTrigger)

/** Sparks thrown from a few weld points on the photo; paused when off screen. */
export function startSparks(canvas) {
  if (!canvas || reduced) return () => {}
  const ctx = canvas.getContext('2d')
  const EMITTERS = [
    [0.6, 0.52],
    [0.79, 0.44],
    [0.7, 0.66],
  ]
  let w = 0
  let h = 0
  let raf = 0
  let visible = true
  const sparks = []
  const size = () => {
    const dpr = Math.min(devicePixelRatio, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  size()
  const emit = () => {
    const [ex, ey] = EMITTERS[(Math.random() * EMITTERS.length) | 0]
    const burst = 4 + ((Math.random() * 7) | 0)
    for (let i = 0; i < burst; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4
      const v = 1.6 + Math.random() * 3.6
      sparks.push({ x: ex * w, y: ey * h, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: 0.012 + Math.random() * 0.02 })
    }
  }
  let t = 0
  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!visible) return
    t++
    if (t % 5 === 0) emit()
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]
      s.vy += 0.09
      s.vx *= 0.99
      s.x += s.vx
      s.y += s.vy
      s.life -= s.decay
      if (s.life <= 0 || s.y > h) {
        sparks.splice(i, 1)
        continue
      }
      ctx.strokeStyle = `rgba(255, ${170 + s.life * 70}, ${80 * s.life}, ${s.life})`
      ctx.lineWidth = 1.6 * s.life + 0.4
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x - s.vx * 2.4, s.y - s.vy * 2.4)
      ctx.stroke()
    }
  }
  raf = requestAnimationFrame(frame)
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)
  addEventListener('resize', size)
  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    removeEventListener('resize', size)
  }
}

/**
 * The pipe: a spine in the right gutter with a small manifold at each station.
 * Its inner line fills as the page scrolls; flow keeps moving through it.
 */
export function mountPipe() {
  const svg = document.getElementById('pipe')
  if (!svg) return () => {}
  const main = svg.parentElement
  const NS = 'http://www.w3.org/2000/svg'
  let trigger = null
  const nodes = []

  const layout = () => {
    const desktop = matchMedia('(min-width: 1100px)').matches
    svg.style.display = desktop ? '' : 'none'
    if (!desktop) return
    const W = main.clientWidth
    const H = main.scrollHeight
    svg.setAttribute('width', W)
    svg.setAttribute('height', H)
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    const x = W - Math.max(18, (W - Math.min(W, 1400)) / 2 + 22)
    const stations = [...main.querySelectorAll('[data-station]')].slice(1).filter((s) => s.id !== 'talk')
    const hero = main.querySelector('.hero')
    let d = `M ${x} ${hero.offsetTop + hero.offsetHeight * 0.55}`
    const points = []
    const top0 = main.getBoundingClientRect().top
    for (const s of stations) {
      const tagEl = s.querySelector('.station-tag')
      const r = (tagEl ?? s).getBoundingClientRect()
      const yc = Math.round(r.top - top0 + (tagEl ? r.height / 2 : 60))
      points.push([s, yc])
      d += ` L ${x} ${yc - 30} Q ${x} ${yc - 16} ${x - 16} ${yc - 16} L ${x - 16} ${yc + 16} Q ${x} ${yc + 16} ${x} ${yc + 30}`
    }
    const last = stations.at(-1)
    const talk = main.querySelector('#talk')
    d += ` L ${x} ${(talk ? talk.offsetTop : last.offsetTop + last.offsetHeight) - 30}`
    svg.querySelectorAll('path').forEach((p) => p.setAttribute('d', d))
    svg.querySelector('.pipe__core').setAttribute('pathLength', '1')
    // valves at each station
    nodes.splice(0).forEach((n) => n.remove())
    points.forEach(([s, y], i) => {
      const g = document.createElementNS(NS, 'g')
      g.setAttribute('class', 'pipe__valve')
      g.setAttribute('transform', `translate(${x - 16} ${y})`)
      g.innerHTML = `<rect x="-11" y="-7" width="22" height="14" rx="3"/><circle r="4"/>`
      g.dataset.for = s.id
      svg.appendChild(g)
      nodes.push(g)
    })
  }

  const start = () => {
    layout()
    trigger?.kill()
    const core = svg.querySelector('.pipe__core')
    trigger = ScrollTrigger.create({
      trigger: main,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (st) => {
        core.style.strokeDashoffset = String(1 - Math.min(1, st.progress * 1.08))
        const line = scrollY + innerHeight * 0.6
        nodes.forEach((n) => {
          const sec = document.getElementById(n.dataset.for)
          n.classList.toggle('is-on', sec && sec.offsetTop + main.offsetTop < line)
        })
      },
    })
    trigger.refresh()
  }
  // after the page's own scroll scenes are set up (they reset all triggers)
  const t0 = setTimeout(start, 120)
  const ro = new ResizeObserver(() => {
    layout()
    ScrollTrigger.refresh()
  })
  ro.observe(main)
  return () => {
    clearTimeout(t0)
    ro.disconnect()
    trigger?.kill()
  }
}
