import '@fontsource/lexend/400.css'
import '@fontsource/lexend/500.css'
import '@fontsource/lexend/600.css'
import '@fontsource/lexend/700.css'
import './style.css'
import { MENU, CATS } from './menu.js'
import { parseOrder } from './parse.js'

const $ = (s, el = document) => el.querySelector(s)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms))
const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const clock = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
const byId = (id) => MENU.find((m) => m.id === id)
const ITEM = '₹XXX'
const TOTAL = '₹X,XXX'

const thread = $('#thread')
const text = $('#text')
const cart = new Map() // id -> qty
let step = 'browse' // browse | address | done
let mode = 'delivery'
let mine = null // the visitor's current order

/* ---------- chat primitives ---------- */
const scrollDown = () => (thread.scrollTop = thread.scrollHeight)

const bubble = (who, html) => {
  const el = document.createElement('div')
  el.className = `b b--${who}`
  el.innerHTML = `${html}<time>${clock()}</time>`
  thread.append(el)
  scrollDown()
  return el
}
const you = (t) => bubble('you', esc(t))

// buttons under a bot message; the first tap answers it and locks the set
const actions = (list, row) => {
  const el = document.createElement('div')
  el.className = `acts${row ? ' acts--row' : ''}`
  el.innerHTML = list.map((a, i) => `<button type="button" data-i="${i}">${a.label}</button>`).join('')
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b || b.disabled) return
    el.querySelectorAll('button').forEach((x) => (x.disabled = true))
    const a = list[+b.dataset.i]
    if (!a.silent) you(b.textContent)
    a.on()
  })
  thread.append(el)
  scrollDown()
}

async function bot(html, acts, row) {
  const presence = $('#presence')
  presence.textContent = 'typing…'
  presence.classList.add('is-typing')
  const dots = bubble('bot', '<span class="typing" aria-label="Typing"><i></i><i></i><i></i></span>')
  dots.querySelector('time').remove()
  await wait(500 + Math.min(html.length, 240) * 2)
  dots.remove()
  presence.textContent = 'Business account'
  presence.classList.remove('is-typing')
  const el = bubble('bot', html)
  if (acts) actions(acts, row)
  return el
}

/* ---------- conversation ---------- */
const welcome = () =>
  bot("Hi! 👋 Welcome to <strong>Tadka Street Kitchen</strong>. What can I get you today?<br><br>Tap <strong>View menu</strong>, or just type your order, like <em>2 butter naan and a dal</em>.", [
    { label: '📖 View menu', on: openMenu, silent: true },
    { label: '📦 Track my order', on: track },
    { label: '⏰ Opening hours', on: () => bot('We are open <strong>12 noon to 11 pm</strong>, every day. Kitchen closes at 10:45 pm.') },
  ])

const cartLines = () =>
  [...cart].map(([id, q]) => `<li><span>${q}× ${byId(id).name}</span><span>${ITEM}</span></li>`).join('')
const cartCount = () => [...cart.values()].reduce((a, b) => a + b, 0)

const showCart = () =>
  bot(`🛒 <strong>Your cart</strong> (${cartCount()} items)<ul class="lines">${cartLines()}</ul><div class="total"><span>Total</span><span>${TOTAL}</span></div>`, [
    { label: '✅ Checkout', on: checkout },
    { label: '➕ Add more', on: openMenu, silent: true },
    { label: '🗑️ Clear cart', on: () => (cart.clear(), renderItems(), bot('Cart cleared. Tap the menu button whenever you are ready.')) },
  ])

const checkout = () =>
  bot('Delivery or pickup?', [
    { label: '🛵 Delivery', on: () => ((mode = 'delivery'), askAddress()) },
    { label: '🛍️ Pickup', on: () => ((mode = 'pickup'), askPay()) },
  ], true)

const askAddress = () =>
  bot('Deliver to your saved address?<div class="card">🏠 <strong>Home</strong><br>12, Sample Street, Your City</div>', [
    { label: 'Yes, deliver here', on: askPay },
    { label: 'Use another address', on: () => ((step = 'address'), bot('Sure, type the full address below.')) },
  ])

const askPay = () =>
  bot(`How would you like to pay ${TOTAL}?`, [
    { label: '⚡ UPI', on: payUpi },
    { label: mode === 'delivery' ? '💵 Cash on delivery' : '💵 Pay at the counter', on: place },
  ], true)

// a QR-looking pattern (random cells + three corner squares); decorative, encodes nothing
const fakeQr = () => {
  const N = 21
  const finder = (x, y) => `<path d="M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z" fill-rule="evenodd"/><path d="M${x + 2} ${y + 2}h3v3h-3z"/>`
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)
  let cells = ''
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && Math.random() < 0.48) cells += `M${x} ${y}h1v1h-1z`
  return `<svg class="qr" viewBox="-1 -1 23 23" aria-hidden="true"><g fill="#1d1a16">${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}<path d="${cells}"/></g></svg>`
}

const payUpi = () =>
  bot(`Scan or tap to pay <strong>${TOTAL}</strong>${fakeQr()}`, [
    {
      label: 'Pay now',
      silent: true,
      on: async () => {
        await bot('✅ Payment received. Thank you!')
        place()
      },
    },
  ])

const STAGES = [
  { key: 'new', label: 'New', c: 'var(--marigold)', next: 'Cook' },
  { key: 'cooking', label: 'Cooking', c: 'var(--chilli)', next: 'Send out' },
  { key: 'out', label: 'Out / ready', c: 'var(--blue)', next: 'Complete' },
  { key: 'done', label: 'Done', c: 'var(--leaf)' },
]

let seq = 1050
function place() {
  const order = { id: ++seq, lines: [...cart].map(([id, qty]) => ({ id, qty })), mode, stage: 0, at: Date.now(), yours: true }
  cart.clear()
  renderItems()
  step = 'done'
  mine = order
  addOrder(order)
  bot(`🎉 Order <strong>#${order.id}</strong> confirmed!<ul class="lines">${order.lines.map((l) => `<li><span>${l.qty}× ${byId(l.id).name}</span></li>`).join('')}</ul>${mode === 'delivery' ? 'Arriving in about <strong>35 min</strong>.' : 'Ready for pickup in about <strong>20 min</strong>.'} I will message you at each step.`)
  autoAdvance(order)
}

const statusText = (o) =>
  [
    `🧾 Order #${o.id} has reached the kitchen.`,
    `👨‍🍳 The kitchen has started cooking order <strong>#${o.id}</strong>.`,
    o.mode === 'delivery' ? `🛵 Order <strong>#${o.id}</strong> is on the way. About 15 minutes.` : `🛍️ Order <strong>#${o.id}</strong> is ready at the counter.`,
    o.mode === 'delivery' ? '✅ Delivered. Enjoy your meal!' : '✅ Picked up. Enjoy your meal!',
  ][o.stage]

function track() {
  if (!mine) return bot('You have no active orders right now. Tap <strong>View menu</strong> to start one.', [{ label: '📖 View menu', on: openMenu, silent: true }])
  bot(`${statusText(mine)}`)
}

function handle(raw) {
  const t = raw.trim()
  if (!t) return
  you(t)
  if (step === 'address') {
    step = 'browse'
    return bot(`Got it, delivering to:<div class="card">📍 ${esc(t)}</div>`).then(askPay)
  }
  const lines = parseOrder(t, MENU)
  if (lines.length) {
    lines.forEach((l) => cart.set(l.id, (cart.get(l.id) || 0) + l.qty))
    renderItems()
    return bot(`Added ${lines.map((l) => `<strong>${l.qty}× ${byId(l.id).name}</strong>`).join(', ')} 👍`).then(showCart)
  }
  const low = t.toLowerCase()
  if (/\b(menu|order|hungry|food)\b/.test(low)) return bot('Here is the menu 👇').then(openMenu)
  if (/\b(track|status|where|late)\b/.test(low)) return track()
  if (/\b(cart|bill|total|checkout)\b/.test(low)) return cart.size ? showCart() : bot('Your cart is empty. Tap the menu button to add something.')
  if (/^(hi|hello|hey|namaste|hii+)\b/.test(low)) return welcome()
  bot("Sorry, I didn't catch that. Try something like <em>2 veg samosa and a masala chai</em>, or tap the menu button.")
}

$('#composer').addEventListener('submit', (e) => {
  e.preventDefault()
  handle(text.value)
  text.value = ''
})

/* ---------- menu sheet ---------- */
const sheet = $('#sheet')
let cat = CATS[0]
$('#cats').innerHTML = CATS.map((c) => `<button type="button" role="tab" data-cat="${c}">${c}</button>`).join('')
$('#cats').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]')
  if (b) ((cat = b.dataset.cat), renderItems())
})

function renderItems() {
  document.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-selected', b.dataset.cat === cat))
  $('#items').innerHTML = MENU.filter((m) => m.cat === cat)
    .map((m, i) => {
      const q = cart.get(m.id) || 0
      return `<li class="item" style="--tint:${m.tint};animation-delay:${i * 40}ms">
        <span class="item__pic" aria-hidden="true">${m.emoji}</span>
        <div><h3><span class="veg" title="Vegetarian"></span>${m.name}</h3><p>${ITEM}</p></div>
        ${q ? `<span class="step"><button type="button" data-d="-1" data-id="${m.id}" aria-label="One less ${m.name}">−</button><output>${q}</output><button type="button" data-d="1" data-id="${m.id}" aria-label="One more ${m.name}">+</button></span>`
            : `<button class="step step--add" type="button" data-d="1" data-id="${m.id}">Add</button>`}
      </li>`
    })
    .join('')
  const n = cartCount()
  const btn = $('#sheetCart')
  btn.disabled = !n
  btn.textContent = n ? `View cart · ${n} item${n > 1 ? 's' : ''}` : 'Add items to your cart'
}
$('#items').addEventListener('click', (e) => {
  const b = e.target.closest('[data-d]')
  if (!b) return
  const q = Math.max(0, Math.min(20, (cart.get(b.dataset.id) || 0) + +b.dataset.d))
  q ? cart.set(b.dataset.id, q) : cart.delete(b.dataset.id)
  const scroll = $('#items').scrollTop
  renderItems()
  $('#items').scrollTop = scroll
  $('#items').querySelectorAll('.item').forEach((li) => (li.style.animation = 'none'))
})

function openMenu() {
  $('#openMenu').classList.remove('is-nudge')
  sheet.hidden = false
  renderItems()
  $('#sheetClose').focus()
}
const closeMenu = () => {
  sheet.hidden = true
  $('#openMenu').focus()
}
$('#openMenu').addEventListener('click', openMenu)
$('#sheetClose').addEventListener('click', closeMenu)
$('#sheetCart').addEventListener('click', () => {
  closeMenu()
  if (step === 'done') step = 'browse'
  you(`🛒 ${cartCount()} items in my cart`)
  showCart()
})
addEventListener('keydown', (e) => e.key === 'Escape' && !sheet.hidden && closeMenu())

/* ---------- kitchen board ---------- */
const orders = []
let today = 23

const age = (o) => {
  const m = Math.floor((Date.now() - o.at) / 60000)
  return m < 1 ? 'just now' : `${m} min`
}

function renderBoard() {
  $('#cols').innerHTML = STAGES.map((s, si) => {
    const list = orders.filter((o) => o.stage === si).slice(si === 3 ? -3 : 0).reverse()
    return `<div class="col" style="--c:${s.c}">
      <div class="col__head"><span>${s.label}</span><b>${orders.filter((o) => o.stage === si).length}</b></div>
      ${list.length ? list.map((o) => ticket(o, s)).join('') : '<p class="empty">Nothing here</p>'}
    </div>`
  }).join('')
  $('#statLive').textContent = orders.filter((o) => o.stage < 3).length
  $('#statToday').textContent = today
}

const ticket = (o, s) => `<article class="ticket${o.yours ? ' is-yours' : ''}${o.stage === 3 ? ' is-done' : ''}" style="--c:${s.c}">
  <div class="ticket__top"><span class="ticket__id">#${o.id}</span><span class="ticket__age">${age(o)}</span></div>
  <div class="ticket__tags"><span>💬 Chat</span><span>${o.mode === 'delivery' ? '🛵 Delivery' : '🛍️ Pickup'}</span>${o.yours ? '<span class="you">Your order</span>' : ''}</div>
  <ul>${o.lines.map((l) => `<li><b>${l.qty}×</b>${byId(l.id).name}</li>`).join('')}</ul>
  ${s.next ? `<button class="ticket__next" type="button" data-next="${o.id}">${s.next} →</button>` : ''}
</article>`

function addOrder(o) {
  orders.push(o)
  today++
  renderBoard()
  const dd = $('#statToday')
  dd.classList.remove('is-bump')
  void dd.offsetWidth
  dd.classList.add('is-bump')
}

function advance(o) {
  if (o.stage >= 3) return
  clearTimeout(o.timer)
  o.stage++
  renderBoard()
  if (o.yours) {
    const rate = [5, 4, 3].map((n) => ({ label: '⭐'.repeat(n), on: () => bot(`Thank you for the ${n}★ rating! See you again soon. 🙏`) }))
    bot(statusText(o), o.stage === 3 ? rate : null)
    if (o.stage === 3) mine = null
    autoAdvance(o)
  }
}
// the visitor's order moves on by itself unless the kitchen clicks first
const autoAdvance = (o) => {
  if (o.stage < 3) o.timer = setTimeout(() => advance(o), [7000, 9000, 9000][o.stage])
}
$('#cols').addEventListener('click', (e) => {
  const b = e.target.closest('[data-next]')
  if (b) advance(orders.find((o) => o.id === +b.dataset.next))
})

// a busy evening: a few orders already in, and one more arrives later
const sample = (id, lines, mode, stage, minsAgo) => ({ id, lines: lines.map(([i, qty]) => ({ id: i, qty })), mode, stage, at: Date.now() - minsAgo * 60000 })
orders.push(
  sample(1046, [['biryani', 2], ['lassi', 2]], 'delivery', 3, 31),
  sample(1047, [['butterpaneer', 1], ['naan', 3]], 'delivery', 2, 22),
  sample(1048, [['dal', 1], ['roti', 4], ['jamun', 2]], 'pickup', 1, 12),
  sample(1049, [['samosa', 4], ['chai', 4]], 'delivery', 0, 2),
)
seq = 1049
renderBoard()
setTimeout(() => addOrder(sample(++seq, [['chole', 2], ['soda', 1]], 'pickup', 0, 0)), 16000)
setInterval(renderBoard, 30000)

const tick = () => ($('#clock').textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
tick()
setInterval(tick, 1000)

/* ---------- start: the customer says hi ---------- */
thread.innerHTML = '<p class="day">Today</p>'
;(async () => {
  await wait(700)
  you('Hi')
  await welcome()
  $('#openMenu').classList.add('is-nudge')
})()
