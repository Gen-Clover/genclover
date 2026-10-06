import '@fontsource/instrument-serif/400.css'
import '@fontsource-variable/inter/wght.css'
import './style.css'
import { chairSVG, STAGES } from './chair.js'

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (id) => document.getElementById(id)
const NOTES = {
  aurum: 'Aurum · burnt orange on pearl white',
  alba: 'Alba · ivory upholstery on a pearl shell',
  marine: 'Marine · sky blue on gloss white',
}

/* hero: the chair and its reflection; the room follows the finish */
const drawHero = (finish) => {
  $('heroPhoto').querySelectorAll('img').forEach((img) => img.classList.toggle('is-on', img.dataset.finish === finish))
  $('finishNote').textContent = NOTES[finish]
  document.body.dataset.finish = finish
  document.querySelectorAll('.finish-pick button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.finish === finish)))
}
document.querySelectorAll('.finish-pick button').forEach((b) => b.addEventListener('click', () => drawHero(b.dataset.finish)))
drawHero('aurum')

addEventListener('scroll', () => document.querySelector('.nav').classList.toggle('is-solid', scrollY > 80), { passive: true })

const rooms = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')), { threshold: 0.25 })
document.querySelectorAll('.room').forEach((r) => rooms.observe(r))

/* production: the blueprint draws itself one stage at a time, then starts over */
const STEP_MS = 2200
$('blueprint').innerHTML = chairSVG({ mode: 'line', id: 'b' })
const parts = [...$('blueprint').querySelectorAll('.part')]
$('steps').innerHTML = STAGES.map((s) => `<li style="--ms:${STEP_MS}ms">${s.label}</li>`).join('')
const steps = [...$('steps').children]
let stage = -1
let timer
const setStage = (i) => {
  stage = i
  parts.forEach((p, k) => {
    p.classList.toggle('is-drawn', k <= i)
    p.classList.toggle('is-on', k === i)
  })
  steps.forEach((s, k) => {
    s.classList.toggle('is-on', k === i)
    s.classList.toggle('is-done', k < i)
  })
  $('stageTag').textContent = i < 0 ? 'Ready' : `Stage ${String(i + 1).padStart(2, '0')} · ${STAGES[i].label}`
}
const tick = () => {
  if (stage >= STAGES.length - 1) {
    // hold the finished drawing, then wipe and rebuild
    setStage(STAGES.length)
    setTimeout(() => setStage(-1), 1600)
    setTimeout(() => setStage(0), 2400)
  } else setStage(stage + 1)
}
const play = () => {
  clearInterval(timer)
  if (reduced) return setStage(STAGES.length - 1)
  timer = setInterval(tick, STEP_MS)
}
steps.forEach((s, i) => s.addEventListener('click', () => (setStage(i), play())))
new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    if (stage < 0) setStage(0)
    play()
  } else clearInterval(timer)
}, { threshold: 0.3 }).observe($('blueprint'))
