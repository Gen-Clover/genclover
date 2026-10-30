import '@fontsource-variable/archivo/wdth.css'
import './style.css'
import { available, isLow, shortfall, reserve, pack, ship, needs, make, suggestQty, receive } from './stock.js'

const $ = (s) => document.querySelector(s)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 1 })

/* ---------- data ---------- */
const items = [
  { sku: 'B-M8', name: 'M8 hex bolt', kind: 'fg', unit: 'boxes', onHand: 120, reserved: 0, reorder: 60, cap: 240, bom: [['R-WIRE', 1.1], ['R-ZINC', 0.04], ['R-CTN', 1]], shape: 'bolt' },
  { sku: 'N-M10', name: 'M10 hex nut', kind: 'fg', unit: 'boxes', onHand: 90, reserved: 0, reorder: 50, cap: 200, bom: [['R-WIRE', 0.6], ['R-ZINC', 0.03], ['R-CTN', 1]], shape: 'nut' },
  { sku: 'W-M8', name: 'M8 flat washer', kind: 'fg', unit: 'boxes', onHand: 140, reserved: 80, reorder: 40, cap: 240, bom: [['R-WIRE', 0.3], ['R-CTN', 1]], shape: 'washer' },
  { sku: 'A-M12', name: 'M12 anchor bolt', kind: 'fg', unit: 'boxes', onHand: 12, reserved: 0, reorder: 20, cap: 120, bom: [['R-WIRE', 2.4], ['R-ZINC', 0.08], ['R-CTN', 1]], shape: 'anchor' },
  { sku: 'R-WIRE', name: 'Steel wire rod', kind: 'raw', unit: 'kg', onHand: 260, reserved: 0, reorder: 150, cap: 600, supplier: 'Deccan Steel Traders', shape: 'coil' },
  { sku: 'R-ZINC', name: 'Zinc plating', kind: 'raw', unit: 'kg', onHand: 9, reserved: 0, reorder: 8, cap: 30, supplier: 'Coastal Chem Supplies', shape: 'drum' },
  { sku: 'R-CTN', name: 'Cartons', kind: 'raw', unit: 'pcs', onHand: 160, reserved: 0, reorder: 100, cap: 500, supplier: 'Kraft Box Co.', shape: 'carton' },
]
const item = (sku) => items.find((i) => i.sku === sku)

const orders = [
  { id: 'SO-3101', customer: 'Bharat Hardware Mart', city: 'Pune', due: 'Today', status: 'new', lines: [['B-M8', 40], ['W-M8', 30]] },
  { id: 'SO-3102', customer: 'Coastal Builders', city: 'Ratnagiri', due: 'Tomorrow', status: 'new', lines: [['A-M12', 30], ['N-M10', 60]] },
  { id: 'SO-3103', customer: 'Metro Industrial Supply', city: 'Nashik', due: 'Today', status: 'packed', lines: [['N-M10', 20]] },
  { id: 'SO-3104', customer: 'Sai Engineering Works', city: 'Pimpri', due: 'Today', status: 'picking', lines: [['W-M8', 80]] },
]
// SO-3103 was picked earlier, so its stock is already held
item('N-M10').reserved = 20

const ledger = [
  { text: 'Opening stock counted', delta: '', when: '08:00' },
  { text: 'SO-3104 reserved 80 M8 flat washer', delta: '−80', when: '09:12' },
]
const pos = [] // purchase orders in flight

let toastTimer
const toast = (msg) => {
  $('#toast').textContent = msg
  $('#toast').classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => $('#toast').classList.remove('is-on'), 2800)
}
const clock = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
const log = (text, delta = '') => ledger.unshift({ text, delta, when: clock(), fresh: true })

/* ---------- small drawings for each bin ---------- */
const SHAPES = {
  bolt: '<path d="M14 6h12v6H14zM18 12h4v22h-4z"/><path d="M18 16h4M18 20h4M18 24h4M18 28h4" class="cut"/>',
  nut: '<path d="M20 6l11 6.5v13L20 32 9 25.5v-13z"/><circle cx="20" cy="19" r="5" class="hole"/>',
  washer: '<circle cx="20" cy="20" r="12"/><circle cx="20" cy="20" r="5" class="hole"/>',
  anchor: '<path d="M17 4h6v24l3 6h-12l3-6z"/><path d="M17 12h6M17 16h6" class="cut"/>',
  coil: '<ellipse cx="20" cy="20" rx="13" ry="13"/><ellipse cx="20" cy="20" rx="8" ry="8" class="hole"/><path d="M7 20a13 13 0 0 1 26 0" class="cut"/>',
  drum: '<rect x="10" y="6" width="20" height="28" rx="3"/><path d="M10 14h20M10 26h20" class="cut"/>',
  carton: '<path d="M6 13l14-6 14 6v15l-14 6-14-6z"/><path d="M6 13l14 6 14-6M20 19v15" class="cut"/>',
}

/* ---------- render ---------- */
let filter = 'open'
const STATUS = { new: 'New', picking: 'Picking', packed: 'Packed', shipped: 'Shipped' }
const FILTERS = [
  ['open', 'Open'],
  ['shipped', 'Shipped'],
  ['all', 'All'],
]
let flash = null

function renderKpis() {
  const open = orders.filter((o) => o.status !== 'shipped')
  $('#kpis').innerHTML = [
    ['Open orders', open.length, ''],
    ['Ready to ship', orders.filter((o) => o.status === 'packed').length, ''],
    ['Low stock', items.filter(isLow).length, items.some(isLow) ? 'warn' : ''],
    ['Shipped today', orders.filter((o) => o.status === 'shipped').length, 'ok'],
  ]
    .map(([k, v, c]) => `<div class="${c}"><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('')
}

function renderOrders() {
  $('#filters').innerHTML = FILTERS.map(([id, label]) => `<button type="button" role="tab" aria-selected="${filter === id}" data-filter="${id}">${label}</button>`).join('')
  const list = orders.filter((o) => (filter === 'all' ? true : filter === 'shipped' ? o.status === 'shipped' : o.status !== 'shipped'))
  $('#orders').innerHTML =
    list
      .map((o) => {
        const short = o.status === 'new' ? shortfall(o, items) : []
        const shortMap = Object.fromEntries(short)
        const action = {
          new: short.length ? '' : `<button class="btn" type="button" data-act="reserve" data-id="${o.id}">Reserve &amp; pick</button>`,
          picking: `<button class="btn" type="button" data-act="pack" data-id="${o.id}">Mark packed</button>`,
          packed: `<button class="btn btn--go" type="button" data-act="ship" data-id="${o.id}">Ship now</button>`,
          shipped: '<span class="done">Shipped</span>',
        }[o.status]
        return `<article class="order is-${o.status}${flash === o.id ? ' is-flash' : ''}">
          <header><b>${o.id}</b><span class="pill is-${o.status}">${STATUS[o.status]}</span><span class="due${o.due === 'Today' && o.status !== 'shipped' ? ' is-today' : ''}">${o.due}</span></header>
          <h3>${o.customer}<small>${o.city}</small></h3>
          <ul class="lines">${o.lines
            .map(([sku, qty]) => {
              const it = item(sku)
              const s = shortMap[sku]
              return `<li class="${s ? 'is-short' : ''}"><span>${it.name}</span><b>${qty} ${it.unit}</b>${o.status === 'new' ? `<em>${s ? `short ${s}` : 'in stock'}</em>` : ''}</li>`
            })
            .join('')}</ul>
          ${short.length ? `<div class="short">${short.map(([sku, n]) => `<button type="button" class="btn btn--make" data-make="${sku}" data-qty="${n}">Make ${n} ${item(sku).name}</button>`).join('')}</div>` : ''}
          <div class="order__act">${action}</div>
        </article>`
      })
      .join('') || '<p class="empty">No orders here.</p>'
  flash = null
}

function renderBins() {
  const group = (kind, title) =>
    `<p class="bins__title">${title}</p>` +
    items
      .filter((i) => i.kind === kind)
      .map((i) => {
        const free = Math.max(0, available(i))
        const pct = (n) => `${Math.min(100, (n / i.cap) * 100)}%`
        return `<div class="bin${isLow(i) ? ' is-low' : ''}" data-bin="${i.sku}">
          <svg viewBox="0 0 40 40" class="bin__art" aria-hidden="true">${SHAPES[i.shape]}</svg>
          <div class="bin__main">
            <p class="bin__name"><b>${i.name}</b><span>${i.sku}</span></p>
            <div class="meter" role="img" aria-label="${fmt(free)} free, ${fmt(i.reserved)} reserved, reorder at ${fmt(i.reorder)}">
              <i class="meter__free" style="width:${pct(free)}"></i><i class="meter__held" style="width:${pct(i.reserved)}"></i>
              <i class="meter__line" style="left:${pct(i.reorder)}"></i>
            </div>
            <p class="bin__nums"><b>${fmt(free)}</b> ${i.unit} free${i.reserved ? ` · ${fmt(i.reserved)} reserved` : ''}${isLow(i) ? ' · <em>Low</em>' : ''}</p>
          </div>
        </div>`
      })
      .join('')
  $('#bins').innerHTML = group('fg', 'Finished goods') + group('raw', 'Raw material')
}

function renderReorder() {
  const low = items.filter((i) => i.kind === 'raw' && isLow(i))
  const open = pos.filter((p) => !p.received)
  $('#reorder').innerHTML =
    low.length || open.length
      ? `<h3>Reorder</h3>${low
          .filter((i) => !open.some((p) => p.sku === i.sku))
          .map((i) => `<div class="po"><span><b>${i.name}</b><small>${i.supplier} · suggested ${fmt(suggestQty(i))} ${i.unit}</small></span><button class="btn" type="button" data-po="${i.sku}">Raise PO</button></div>`)
          .join('')}${open.map((p) => `<div class="po is-sent"><span><b>${p.id} · ${item(p.sku).name}</b><small>${fmt(p.qty)} ${item(p.sku).unit} on the way from ${item(p.sku).supplier}</small></span><i class="truck" aria-hidden="true">🚚</i></div>`).join('')}`
      : ''
  $('#reorder').hidden = !$('#reorder').innerHTML
}

function renderLedger() {
  $('#ledger').innerHTML = ledger
    .slice(0, 7)
    .map((l) => `<li${l.fresh ? ' class="is-fresh"' : ''}><time>${l.when}</time><span>${l.text}</span><b class="${l.delta.startsWith('+') ? 'up' : 'down'}">${l.delta}</b></li>`)
    .join('')
  ledger.forEach((l) => delete l.fresh)
}

function render() {
  renderKpis()
  renderOrders()
  renderBins()
  renderReorder()
  renderLedger()
}

// a bin's meter glows when its numbers change
const pulse = (skus) =>
  !reduced &&
  skus.forEach((sku) => document.querySelector(`[data-bin="${sku}"]`)?.animate([{ boxShadow: '0 0 0 3px #ffc531' }, { boxShadow: '0 0 0 0 transparent' }], { duration: 1200 }))

/* ---------- actions ---------- */
$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-filter]')
  if (!b) return
  filter = b.dataset.filter
  renderOrders()
})

$('#orders').addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]')
  const m = e.target.closest('[data-make]')
  if (m) return planRun(m.dataset.make, Number(m.dataset.qty))
  if (!b) return
  const o = orders.find((x) => x.id === b.dataset.id)
  if (b.dataset.act === 'reserve') {
    reserve(o, items)
    o.lines.forEach(([sku, q]) => log(`${o.id} reserved ${q} ${item(sku).name}`, `−${q}`))
    toast(`${o.id}: stock reserved, pick list sent to the floor`)
  }
  if (b.dataset.act === 'pack') {
    pack(o)
    toast(`${o.id} packed and ready to ship`)
  }
  if (b.dataset.act === 'ship') {
    ship(o, items)
    log(`${o.id} shipped to ${o.customer}`, '')
    toast(`${o.id} shipped. Invoice and e-way bill drafted.`)
  }
  flash = o.id
  render()
  pulse(o.lines.map(([sku]) => sku))
})

/* production runs */
let run = null
function planRun(sku, short) {
  const it = item(sku)
  const qty = Math.ceil(short / 10) * 10 // the line makes batches of 10 boxes
  run = { sku, qty }
  const req = needs(sku, qty, items)
  const blocked = req.some((r) => r.short > 0)
  $('#prod').hidden = false
  $('#prod').innerHTML = `<h3>Production run</h3>
    <p class="prod__what"><b>${qty} ${it.unit}</b> of ${it.name}</p>
    <ul>${req.map((r) => `<li class="${r.short ? 'is-short' : ''}"><span>${item(r.sku).name}</span><b>${fmt(r.need)} ${item(r.sku).unit}</b><em>${r.short ? `short ${fmt(r.short)}` : 'ok'}</em></li>`).join('')}</ul>
    <div class="prod__bar"><i id="prodBar"></i></div>
    <div class="prod__acts"><button class="btn" type="button" data-run="start" ${blocked ? 'disabled' : ''}>${blocked ? 'Not enough raw material' : 'Start run'}</button><button class="btn btn--ghost" type="button" data-run="cancel">Cancel</button></div>`
  $('#prod').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' })
}
$('#prod').addEventListener('click', async (e) => {
  const act = e.target.closest('[data-run]')?.dataset.run
  if (!act || !run) return
  if (act === 'cancel') {
    run = null
    $('#prod').hidden = true
    return
  }
  e.target.disabled = true
  e.target.textContent = 'Running on line 2…'
  $('#prodBar').style.transitionDuration = reduced ? '0s' : '2.4s'
  requestAnimationFrame(() => ($('#prodBar').style.width = '100%'))
  await wait(2500)
  const used = make(run.sku, run.qty, items)
  used.forEach((r) => log(`Used ${fmt(r.need)} ${item(r.sku).unit} ${item(r.sku).name}`, `−${fmt(r.need)}`))
  log(`Made ${run.qty} ${item(run.sku).name}`, `+${run.qty}`)
  toast(`${run.qty} ${item(run.sku).unit} of ${item(run.sku).name} made. The order can be picked now.`)
  const skus = [run.sku, ...used.map((r) => r.sku)]
  run = null
  $('#prod').hidden = true
  render()
  pulse(skus)
})

/* purchase orders: suppliers deliver a little later */
let poSeq = 870
$('#reorder').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-po]')
  if (!b) return
  const it = item(b.dataset.po)
  const po = { id: `PO-${++poSeq}`, sku: it.sku, qty: suggestQty(it), received: false }
  pos.push(po)
  toast(`${po.id} sent to ${it.supplier}`)
  renderReorder()
  await wait(7000)
  receive(po.sku, po.qty, items)
  po.received = true
  log(`${po.id} received from ${it.supplier}`, `+${fmt(po.qty)}`)
  toast(`${po.id} delivered: ${fmt(po.qty)} ${it.unit} ${it.name}`)
  render()
  pulse([po.sku])
})

render()
