import '@fontsource-variable/hanken-grotesk/wght.css'
import '@fontsource/instrument-serif/400-italic.css'
import './style.css'
import { DOCS, CATEGORIES } from './docs.js'
import { COLUMNS, amount, checkTotals, toCSV } from './sheet.js'

const $ = (s) => document.querySelector(s)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const rupees = (n) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const money = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 })
const ddmmyyyy = (iso) => iso.split('-').reverse().join('/')

const ORDER = ['vendor', 'number', 'date', 'subtotal', 'tax', 'total']
const form = $('#fields')
const bed = $('#bed')
const docWrap = $('#docWrap')
let rows = []
let run = 0 // bumped by each new read so an older one stops mid-way
let touched = false
let photoUrl

$('#category').innerHTML = '<option value="">Choose…</option>' + CATEGORIES.map((c) => `<option>${c}</option>`).join('')

/* ---------- drawing a bill ---------- */
const docHTML = (d) => {
  const f = (key, text) => `<span data-f="${key}"${d.faded?.includes(key) ? ' class="is-faded"' : ''}>${esc(text)}</span>`
  const title = { thermal: '', invoice: '<p class="doc__kind">Tax invoice</p>', slip: '<p class="doc__kind">Customer copy</p>' }[d.look]
  return `<article class="doc doc--${d.look}">
    ${title}
    <h3>${f('vendor', d.vendor)}</h3>
    ${d.lines.map((l) => `<p class="doc__meta">${esc(l)}</p>`).join('')}
    <div class="doc__rows">
      <p><span>${d.look === 'invoice' ? 'Invoice no.' : 'Bill'}</span>${f('number', d.number)}</p>
      <p><span>Date</span>${f('date', ddmmyyyy(d.date))}</p>
    </div>
    <div class="doc__items">${d.items.map(([n, v]) => `<p><span>${esc(n)}</span><span>${money(v)}</span></p>`).join('')}</div>
    <div class="doc__sums">
      ${d.subtotal != null ? `<p><span>Subtotal</span>${f('subtotal', money(d.subtotal))}</p>` : ''}
      ${d.tax != null ? `<p><span>${d.taxLabel}</span>${f('tax', money(d.tax))}</p>` : ''}
      <p class="doc__total"><span>Total</span>${f('total', money(d.total))}</p>
    </div>
    <p class="doc__foot">${d.look === 'invoice' ? 'Payment due in 15 days' : 'Thank you, visit again'}</p>
    <i class="doc__code" aria-hidden="true"></i>
  </article>`
}

$('#samples').innerHTML = DOCS.map(
  (d) => `<button class="sample" type="button" draggable="true" data-doc="${d.id}" style="--tilt:${d.tilt}deg">
    <span class="sample__mini" aria-hidden="true">${docHTML(d)}</span>
    <span class="sample__label">${d.label}</span>
  </button>`,
).join('')

/* ---------- fields ---------- */
const field = (key) => form.querySelector(`[data-key="${key}"]`)

const resetFields = () => {
  form.reset()
  form.classList.remove('is-busy')
  form.querySelectorAll('.f').forEach((el) => el.classList.remove('is-filled', 'is-low', 'is-missing'))
  form.querySelectorAll('.conf').forEach((el) => (el.textContent = ''))
  bed.querySelectorAll('.mark').forEach((el) => el.remove())
  $('#note').hidden = true
  updateCheck()
}

const values = () => Object.fromEntries(new FormData(form))

const CHECKS = {
  idle: 'Totals will be checked here',
  ok: 'Subtotal + tax matches the total',
  mismatch: "Subtotal + tax doesn't match the total. Check the bill",
  partial: 'No tax shown on this bill. Total kept as-is',
  incomplete: 'Add a total to save this bill',
}
function updateCheck() {
  const v = values()
  const any = Object.values(v).some(Boolean)
  const state = any ? checkTotals(v) : 'idle'
  const low = form.querySelectorAll('.is-low').length
  $('#check').dataset.state = state
  $('#check').textContent = CHECKS[state] + (low && state !== 'idle' ? ` · ${low} field${low > 1 ? 's' : ''} to review` : '')
  $('#add').disabled = !(v.vendor.trim() && amount(v.total) != null)
}
form.addEventListener('input', (e) => {
  e.target.closest('.f')?.classList.remove('is-low')
  updateCheck()
})

const setConf = (key, c) => {
  const el = field(key)
  el.classList.add('is-filled')
  el.classList.toggle('is-low', c < 75)
  el.querySelector('.conf').textContent = c < 75 ? `Check · ${c}%` : `${c}%`
}

// a chip with the value flies from the bill to its input
const fly = (from, to, text) => {
  if (reduced) return Promise.resolve()
  const a = from.getBoundingClientRect()
  const b = to.getBoundingClientRect()
  const chip = document.createElement('span')
  chip.className = 'chip'
  chip.textContent = text
  chip.style.left = `${a.left}px`
  chip.style.top = `${a.top}px`
  document.body.append(chip)
  const anim = chip.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${(b.left - a.left) * 0.5}px, ${(b.top - a.top) * 0.5 - 40}px) scale(1.08)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${b.left - a.left + 10}px, ${b.top - a.top + 8}px) scale(0.9)`, opacity: 0 },
    ],
    { duration: 640, easing: 'cubic-bezier(.5,0,.3,1)' },
  )
  return anim.finished.then(() => chip.remove())
}

const mark = (el) => {
  const box = el.getBoundingClientRect()
  const base = bed.getBoundingClientRect()
  const m = document.createElement('i')
  m.className = 'mark'
  Object.assign(m.style, { left: `${box.left - base.left - 4}px`, top: `${box.top - base.top - 3}px`, width: `${box.width + 8}px`, height: `${box.height + 6}px` })
  bed.append(m)
}

/* ---------- reading ---------- */
const status = (t) => ($('#status').textContent = t)

const scan = async () => {
  $('#empty').hidden = true
  bed.classList.remove('is-scanning')
  void bed.offsetWidth
  bed.classList.add('is-scanning')
  status('Scanning…')
  await wait(1300)
  bed.classList.remove('is-scanning')
}

const load = (html) => {
  docWrap.className = 'doc-wrap'
  docWrap.innerHTML = html
  void docWrap.offsetWidth
  docWrap.classList.add('is-in')
}

async function read(doc) {
  const me = ++run
  const stale = () => me !== run
  resetFields()
  form.classList.add('is-busy')
  $('#src').textContent = doc.label
  document.querySelectorAll('.sample').forEach((b) => b.classList.toggle('is-on', b.dataset.doc === doc.id))
  load(docHTML(doc))
  await wait(450)
  if (stale()) return
  await scan()
  if (stale()) return
  status('Reading fields…')

  let found = 0
  for (const key of ORDER) {
    const el = docWrap.querySelector(`[data-f="${key}"]`)
    const input = form.elements[key]
    if (!el) {
      field(key).classList.add('is-missing')
      field(key).querySelector('.conf').textContent = 'Not on bill'
      continue
    }
    mark(el)
    await fly(el, input, el.textContent)
    if (stale()) return
    input.value = key === 'date' ? doc.date : doc[key]
    setConf(key, doc.conf[key])
    found++
    await wait(140)
  }
  form.elements.category.value = doc.category
  setConf('category', doc.conf.category)
  updateCheck()
  form.classList.remove('is-busy')
  status(`Read ${found + 1} of 7 fields`)
}

async function readPhoto(file) {
  if (!file?.type.startsWith('image/')) return
  const me = ++run
  resetFields()
  document.querySelectorAll('.sample').forEach((b) => b.classList.remove('is-on'))
  if (photoUrl) URL.revokeObjectURL(photoUrl)
  photoUrl = URL.createObjectURL(file)
  $('#src').textContent = 'Your photo'
  load(`<img class="doc-photo" src="${photoUrl}" alt="Your uploaded bill" />`)
  await wait(450)
  await scan()
  if (me !== run) return
  $('#note').textContent = "This demo can only read the sample bills, so type this one's details in. Your photo never leaves your browser."
  $('#note').hidden = false
  status('Photo loaded')
  form.elements.vendor.focus()
}

/* ---------- choosing a bill ---------- */
const pick = (id) => {
  touched = true
  read(DOCS.find((d) => d.id === id))
}
$('#samples').addEventListener('click', (e) => {
  const b = e.target.closest('[data-doc]')
  if (b) pick(b.dataset.doc)
})
$('#samples').addEventListener('dragstart', (e) => {
  const b = e.target.closest('[data-doc]')
  if (b) e.dataTransfer.setData('text/plain', `kagaz:${b.dataset.doc}`)
})
$('#file').addEventListener('change', (e) => {
  touched = true
  readPhoto(e.target.files[0])
  e.target.value = ''
})
for (const zone of [$('#scanner'), $('#drop')]) {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault()
    zone.classList.add('is-over')
  })
  zone.addEventListener('dragleave', () => zone.classList.remove('is-over'))
  zone.addEventListener('drop', (e) => {
    e.preventDefault()
    zone.classList.remove('is-over')
    const file = e.dataTransfer.files[0]
    const text = e.dataTransfer.getData('text/plain')
    if (file) {
      touched = true
      readPhoto(file)
    } else if (text.startsWith('kagaz:')) pick(text.slice(6))
  })
}

/* ---------- the sheet ---------- */
const renderRows = (fresh) => {
  $('#rows').innerHTML = rows.length
    ? rows
        .map(
          (r, i) => `<tr${i === fresh ? ' class="is-new"' : ''}>
        <td>${esc(r.vendor)}</td><td>${r.date ? ddmmyyyy(r.date) : '—'}</td><td>${esc(r.number || '—')}</td>
        <td><span class="cat">${esc(r.category || 'Other')}</span></td>
        <td class="num">${r.tax ? rupees(amount(r.tax)) : '—'}</td><td class="num"><b>${rupees(amount(r.total))}</b></td>
        <td><button type="button" class="rm" data-rm="${i}" aria-label="Remove ${esc(r.vendor)}">×</button></td>
      </tr>`,
        )
        .join('')
    : '<tr class="placeholder"><td colspan="7">Bills you add show up here</td></tr>'
  $('#rowCount').textContent = `${rows.length} bill${rows.length === 1 ? '' : 's'}`
  $('#sum').textContent = rupees(rows.reduce((s, r) => s + amount(r.total), 0))
  $('#export').disabled = !rows.length
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  if ($('#add').disabled) return
  run++
  touched = true
  rows.push(Object.fromEntries(COLUMNS.map(([k]) => [k, values()[k]?.trim() ?? ''])))
  docWrap.classList.add('is-filed')
  renderRows(rows.length - 1)
  status('Added to the sheet')
  await wait(500)
  docWrap.innerHTML = ''
  $('#empty').hidden = false
  $('#src').textContent = 'Nothing read yet'
  document.querySelectorAll('.sample').forEach((b) => b.classList.remove('is-on'))
  resetFields()
})

$('#rows').addEventListener('click', (e) => {
  const b = e.target.closest('[data-rm]')
  if (!b) return
  rows.splice(Number(b.dataset.rm), 1)
  renderRows()
})

$('#export').addEventListener('click', () => {
  // the BOM makes spreadsheet apps read ₹ and accents as UTF-8
  const blob = new Blob(['﻿' + toCSV(rows)], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'kagaz-expenses.csv'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
})

renderRows()
updateCheck()
// first visit: read the café receipt on its own
setTimeout(() => !touched && read(DOCS[0]), 1400)
