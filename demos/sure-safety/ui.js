/** Small shared helpers: icons, escaping, the quote list, toasts and overlays. */
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw'
import arrowUpRight from '@phosphor-icons/core/assets/regular/arrow-up-right.svg?raw'
import caretDown from '@phosphor-icons/core/assets/regular/caret-down.svg?raw'
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw'
import certificate from '@phosphor-icons/core/assets/regular/certificate.svg?raw'
import chat from '@phosphor-icons/core/assets/regular/chat-circle-dots.svg?raw'
import check from '@phosphor-icons/core/assets/regular/check.svg?raw'
import clipboard from '@phosphor-icons/core/assets/regular/clipboard-text.svg?raw'
import ear from '@phosphor-icons/core/assets/regular/ear.svg?raw'
import eye from '@phosphor-icons/core/assets/regular/eye.svg?raw'
import envelope from '@phosphor-icons/core/assets/regular/envelope-simple.svg?raw'
import factory from '@phosphor-icons/core/assets/regular/factory.svg?raw'
import filePdf from '@phosphor-icons/core/assets/regular/file-pdf.svg?raw'
import fire from '@phosphor-icons/core/assets/regular/fire.svg?raw'
import firstAid from '@phosphor-icons/core/assets/regular/first-aid.svg?raw'
import flask from '@phosphor-icons/core/assets/regular/flask.svg?raw'
import hardHat from '@phosphor-icons/core/assets/regular/hard-hat.svg?raw'
import lightning from '@phosphor-icons/core/assets/regular/lightning.svg?raw'
import listIcon from '@phosphor-icons/core/assets/regular/list.svg?raw'
import search from '@phosphor-icons/core/assets/regular/magnifying-glass.svg?raw'
import mapPin from '@phosphor-icons/core/assets/regular/map-pin.svg?raw'
import minus from '@phosphor-icons/core/assets/regular/minus.svg?raw'
import paperPlane from '@phosphor-icons/core/assets/regular/paper-plane-right.svg?raw'
import phone from '@phosphor-icons/core/assets/regular/phone.svg?raw'
import plus from '@phosphor-icons/core/assets/regular/plus.svg?raw'
import ruler from '@phosphor-icons/core/assets/regular/ruler.svg?raw'
import shieldCheck from '@phosphor-icons/core/assets/regular/shield-check.svg?raw'
import sparkle from '@phosphor-icons/core/assets/regular/sparkle.svg?raw'
import trash from '@phosphor-icons/core/assets/regular/trash.svg?raw'
import whatsapp from '@phosphor-icons/core/assets/regular/whatsapp-logo.svg?raw'
import wind from '@phosphor-icons/core/assets/regular/wind.svg?raw'
import x from '@phosphor-icons/core/assets/regular/x.svg?raw'

const ICONS = {
  'arrow-right': arrowRight, 'arrow-up-right': arrowUpRight, 'caret-down': caretDown, 'caret-right': caretRight, certificate,
  'chat-circle-dots': chat, check, 'clipboard-text': clipboard, ear, 'envelope-simple': envelope, eye, factory, 'file-pdf': filePdf,
  fire, 'first-aid': firstAid, flask, 'hard-hat': hardHat, lightning, list: listIcon, 'magnifying-glass': search,
  'map-pin': mapPin, minus, 'paper-plane-right': paperPlane, phone, plus, ruler, 'shield-check': shieldCheck, sparkle,
  trash, 'whatsapp-logo': whatsapp, wind, x,
}
export const icon = (name, cls = '') => `<i class="ico ${cls}" aria-hidden="true">${ICONS[name] ?? ''}</i>`
/** Fill every [data-icon] placeholder under a root. */
export const paintIcons = (root = document) =>
  root.querySelectorAll('[data-icon]').forEach((el) => {
    el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon))
    el.removeAttribute('data-icon')
  })

/** Sure, the assistant: a small robot in a Saviour hard hat. Eyes blink; while it thinks they scan. */
export const botFace = (cls = '') => `<svg class="bot ${cls}" viewBox="0 0 64 64" aria-hidden="true">
  <path class="bot__hat" d="M8 30c0-14 10.7-24 24-24s24 10 24 24z"/>
  <path class="bot__ridge" d="M28 7.5h8v22h-8z"/>
  <path class="bot__brim" d="M4 29.5h56a3 3 0 0 1 0 6H4a3 3 0 0 1 0-6z"/>
  <rect class="bot__head" x="12" y="34" width="40" height="24" rx="10"/>
  <rect class="bot__visor" x="16" y="38" width="32" height="15" rx="7.5"/>
  <g class="bot__eyes"><rect class="bot__eye" x="23" y="41.5" width="5" height="8" rx="2.5"/><rect class="bot__eye" x="36" y="41.5" width="5" height="8" rx="2.5"/></g>
  <circle class="bot__bolt" cx="12" cy="46" r="2.2"/><circle class="bot__bolt" cx="52" cy="46" r="2.2"/>
</svg>`

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export const $ = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
export const asset = (path) => new URL(`./assets/${path}`, import.meta.url).href

/* ------------------------------------------------------------------ storage */
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode: the list just won't survive a reload */
  }
}

/** The quote list: { slug: qty }. Listeners re-render the badge and drawer. */
const listeners = new Set()
let quote = read('ss-quote', {})
export const quoteList = () => quote
export const onQuote = (fn) => listeners.add(fn)
const emit = () => {
  write('ss-quote', quote)
  listeners.forEach((fn) => fn(quote))
}
export const addToQuote = (slug, qty = 1) => {
  quote = { ...quote, [slug]: (quote[slug] ?? 0) + qty }
  emit()
}
export const setQty = (slug, qty) => {
  const next = { ...quote }
  if (qty <= 0) delete next[slug]
  else next[slug] = qty
  quote = next
  emit()
}
export const clearQuote = () => {
  quote = {}
  emit()
}
export const saveLead = (lead) => write('ss-leads', [...read('ss-leads', []), lead])

/* ------------------------------------------------------------------- toast */
let toastTimer
export const toast = (html) => {
  const el = $('#toast')
  el.innerHTML = html
  el.classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3600)
}
export const demoNote = (what) => toast(`${icon('sparkle')}<span>${esc(what)} connects at launch. This demo doesn’t send anything.</span>`)

/* ---------------------------------------------------------------- overlays */
const scrim = () => $('#scrim')
let openEl = null
let lastFocus = null
export const openOverlay = (el, { focus } = {}) => {
  if (openEl && openEl !== el) closeOverlay()
  lastFocus = document.activeElement
  openEl = el
  el.hidden = false
  scrim().hidden = false
  requestAnimationFrame(() => {
    el.classList.add('is-open')
    scrim().classList.add('is-open')
    ;(focus ? $(focus, el) : el.querySelector('input, button, a'))?.focus()
  })
  document.documentElement.classList.add('is-locked')
}
export const closeOverlay = () => {
  if (!openEl) return
  const el = openEl
  openEl = null
  el.classList.remove('is-open')
  scrim().classList.remove('is-open')
  document.documentElement.classList.remove('is-locked')
  setTimeout(() => {
    if (openEl !== el) el.hidden = true
    if (!openEl) scrim().hidden = true
  }, reduced ? 0 : 280)
  lastFocus?.focus?.()
}
export const overlayOpen = () => openEl
