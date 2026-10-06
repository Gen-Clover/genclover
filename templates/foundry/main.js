import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/inter/wght.css'
import './style.css'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (id) => document.getElementById(id)
const asset = (name) => new URL(`./assets/${name}`, import.meta.url).href

/* nav turns solid after the hero */
const nav = $('nav')
const onScroll = () => nav.classList.toggle('is-solid', scrollY > innerHeight * 0.8)
addEventListener('scroll', onScroll, { passive: true })
onScroll()

/* the production line: stations advance on their own, the view follows */
const STATION_MS = 3200
const stations = [...document.querySelectorAll('#stations li')]
const frame = $('lineImg').parentElement
stations.forEach((li) => {
  li.style.setProperty('--ms', `${STATION_MS}ms`)
  li.insertAdjacentHTML('beforeend', '<span class="bar" aria-hidden="true"></span>')
  new Image().src = asset(li.dataset.img) // preload
})
$('lineImg').remove()

let current = 0
let timer
const show = (i) => {
  current = i
  stations.forEach((li, k) => {
    li.classList.toggle('is-on', k === i)
    li.classList.toggle('is-done', k < i)
  })
  const img = new Image()
  img.src = asset(stations[i].dataset.img)
  img.alt = stations[i].querySelector('h3').textContent
  img.className = 'is-in'
  img.style.opacity = 0
  frame.prepend(img)
  requestAnimationFrame(() => {
    img.style.opacity = 1
    ;[...frame.querySelectorAll('img')].slice(1).forEach((old) => {
      old.style.opacity = 0
      setTimeout(() => old.remove(), 900)
    })
  })
  $('lineCap').textContent = img.alt
}
const play = () => {
  clearInterval(timer)
  if (!reduced) timer = setInterval(() => show((current + 1) % stations.length), STATION_MS)
}
stations.forEach((li, i) =>
  li.addEventListener('click', () => {
    show(i)
    play()
  })
)
show(0)
new IntersectionObserver(
  ([e]) => {
    if (e.isIntersecting) {
      show(current)
      play()
    } else clearInterval(timer)
  },
  { threshold: 0.3 }
).observe($('track'))

/* reveals and counters */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add('is-in')
      e.target.querySelectorAll('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const start = performance.now()
        const step = (now) => {
          const p = reduced ? 1 : Math.min(1, (now - start) / 1600)
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
      io.unobserve(e.target)
    }),
  { rootMargin: '0px 0px -10% 0px' }
)
document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
