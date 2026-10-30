import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/hanken-grotesk/wght.css'
import './style.css'

const A = (f) => `./assets/${f}.jpg`
const SIZES = ['S', 'M', 'L', 'XL', '2XL']
const PRICE = '₹X,XXX'
const C = { white: '#f4f4f2', black: '#1a1a1a', ash: '#9b9d98', bottle: '#2f4a3c', sky: '#8fb3d9', rust: '#b5532f' }

// Demo catalogue. Prices are placeholders; "new" orders the Newest sort.
const PRODUCTS = [
  { id: 'neem', name: 'Neem Leaf Embroidery', cat: 'embroidery', imgs: ['neem', 'layer'], dots: ['white', 'ash'], new: 5 },
  { id: 'monsoon', name: 'Monsoon Tie-Dye', cat: 'dye', imgs: ['monsoon', 'wild'], dots: ['sky', 'rust'], badge: 'sale', new: 8 },
  { id: 'night', name: 'Night Shift Graphic', cat: 'print', imgs: ['charcoal', 'ash'], dots: ['black'], new: 3 },
  { id: 'bones', name: 'Peace Bones Tee', cat: 'print', imgs: ['bones', 'charcoal'], dots: ['black', 'white'], badge: 'out', new: 9 },
  { id: 'oldcity', name: 'Old City Back Print', cat: 'print', imgs: ['oldcity', 'wild'], dots: ['black'], badge: 'sale', new: 2 },
  { id: 'blank', name: 'Blank Canvas Heavyweight', cat: 'blank', imgs: ['blank', 'cargo'], dots: ['white', 'black', 'ash', 'bottle'], new: 11 },
  { id: 'ash', name: 'Ash Melange Drop', cat: 'blank', imgs: ['ash', 'ash-2'], dots: ['ash'], new: 7 },
  { id: 'stone', name: 'Stone Wash Oversized', cat: 'dye', imgs: ['layer', 'ash-2'], dots: ['ash', 'black'], badge: 'new', new: 4 },
  { id: 'tram', name: 'Tram Line Embroidered', cat: 'embroidery', imgs: ['cargo', 'neem'], dots: ['white'], new: 6 },
  { id: 'wild', name: 'Wild Ink Tee', cat: 'print', imgs: ['wild', 'bones'], dots: ['white', 'sky'], new: 10 },
  { id: 'lotus', name: 'Lotus Chest Stitch', cat: 'embroidery', imgs: ['ash-2', 'blank'], dots: ['ash', 'white'], badge: 'new', new: 12 },
]
const byId = (id) => PRODUCTS.find((p) => p.id === id)
const BADGE = { new: ['New', ''], sale: ['Sale', 'badge--sale'], out: ['Sold out', 'badge--out'] }

const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const HEART = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>'

const priceHtml = (p) =>
  p.badge === 'sale' ? `<s>${PRICE}</s><span class="is-sale">${PRICE}</span>` : PRICE

/* ---------- state ---------- */
const cart = [] // { id, size, qty }
const wish = new Set()

const bumpCount = (el, n) => {
  el.textContent = n
  el.hidden = n === 0
  el.classList.remove('is-bump')
  void el.offsetWidth
  el.classList.add('is-bump')
}

let toastTimer
const toast = (msg) => {
  const t = $('#toast')
  t.textContent = msg
  t.classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600)
}

const addToCart = (id, size, qty = 1) => {
  const p = byId(id)
  if (p.badge === 'out') return toast('Sold out. Add it to your wishlist for the restock.')
  if (!size) return toast('Pick a size first.')
  const line = cart.find((l) => l.id === id && l.size === size)
  line ? (line.qty += qty) : cart.push({ id, size, qty })
  bumpCount($('#cartCount'), cart.reduce((n, l) => n + l.qty, 0))
  toast(`${p.name} (${size}) added to your bag.`)
  if (!$('#cart').hidden) renderCart()
}

const toggleWish = (id) => {
  wish.has(id) ? wish.delete(id) : wish.add(id)
  $$(`.heart[data-id="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', wish.has(id)))
  bumpCount($('#wishCount'), wish.size)
  if (!$('#wish').hidden) renderWish()
}

/* ---------- product grid ---------- */
let tab = 'all'
const grid = $('#grid')

const cardHtml = (p, i) => {
  const [label, cls] = BADGE[p.badge] || []
  return `<article class="card" style="--i:${i}">
    <div class="card__media">
      <img src="${A(p.imgs[0])}" alt="${p.name}" loading="lazy" />
      <img src="${A(p.imgs[1])}" alt="" loading="lazy" />
      <button class="card__open" type="button" data-quick="${p.id}" aria-label="Quick view: ${p.name}"></button>
      ${label ? `<span class="badge ${cls}">${label}</span>` : ''}
      <button class="heart" type="button" data-id="${p.id}" aria-pressed="${wish.has(p.id)}" aria-label="Save ${p.name}">${HEART}</button>
      ${p.badge === 'out' ? '' : `<div class="quick"><span>Add</span>${SIZES.map((s) => `<button type="button" data-add="${p.id}" data-size="${s}">${s}</button>`).join('')}</div>`}
    </div>
    <div class="card__info">
      <div><h3 class="card__name"><button type="button" data-quick="${p.id}">${p.name}</button></h3><p class="price">${priceHtml(p)}</p></div>
      <div class="dots" aria-label="Colours">${p.dots.map((d) => `<i style="--c:${C[d]}" title="${d}"></i>`).join('')}</div>
    </div>
  </article>`
}

const renderGrid = () => {
  const sort = $('#sort').value
  let list = PRODUCTS.filter((p) => tab === 'all' || p.cat === tab)
  if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'new') list = [...list].sort((a, b) => a.new - b.new)
  grid.innerHTML = list.length ? list.map(cardHtml).join('') : '<p class="empty">Nothing here yet.</p>'
}

const setTab = (t) => {
  tab = t
  $$('.tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === t))
  renderGrid()
}

$('.tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-tab]')
  if (b) setTab(b.dataset.tab)
})
$('#sort').addEventListener('change', renderGrid)
$$('[data-jump]').forEach((a) => a.addEventListener('click', () => setTab(a.dataset.jump)))

// one delegated handler for every card, drawer and modal action
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-add],[data-quick],.heart,[data-open],[data-close]')
  if (!t) return
  if (t.dataset.add) addToCart(t.dataset.add, t.dataset.size)
  else if (t.dataset.quick) openQuick(t.dataset.quick)
  else if (t.classList.contains('heart')) toggleWish(t.dataset.id)
  else if (t.dataset.open) open(t.dataset.open)
  else if (t.dataset.close !== undefined) closeAll()
})

/* ---------- size picker + qty (shared by look, quick view, spotlight) ---------- */
const sizePicker = (el, disabled) => {
  el.innerHTML = SIZES.map((s) => `<button type="button" role="radio" aria-checked="false" ${disabled ? 'disabled' : ''}>${s}</button>`).join('')
  el.onclick = (e) => {
    const b = e.target.closest('button')
    if (!b) return
    $$('button', el).forEach((x) => x.setAttribute('aria-checked', x === b))
  }
  return () => $('[aria-checked="true"]', el)?.textContent
}
const qtyHtml = '<div class="qty"><button type="button" data-step="-1" aria-label="Fewer">−</button><output>1</output><button type="button" data-step="1" aria-label="More">+</button></div>'
const qtyControl = (el) => {
  const out = $('output', el)
  el.onclick = (e) => {
    const b = e.target.closest('[data-step]')
    if (b) out.textContent = Math.min(9, Math.max(1, +out.textContent + +b.dataset.step))
  }
  return () => +out.textContent
}

/* ---------- overlays ---------- */
let lastFocus
const scrim = $('#scrim')
const open = (id) => {
  lastFocus = document.activeElement
  closeAll(false)
  if (id === 'cart') renderCart()
  if (id === 'wish') renderWish()
  const el = $('#' + id)
  el.hidden = false
  if (id !== 'search') scrim.hidden = false
  document.body.classList.add('is-locked')
  ;(id === 'search' ? $('#searchInput') : $('.x', el))?.focus()
}
function closeAll(restore = true) {
  ;['cart', 'wish', 'quick', 'search'].forEach((id) => ($('#' + id).hidden = true))
  scrim.hidden = true
  document.body.classList.remove('is-locked')
  if (restore) lastFocus?.focus?.()
}
scrim.addEventListener('click', () => closeAll())
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeAll())

const drawerHead = (title) => `<div class="drawer__head"><h2>${title}</h2><button class="x" type="button" data-close aria-label="Close">×</button></div>`

function renderCart() {
  const el = $('#cart')
  if (!cart.length) {
    el.innerHTML = `${drawerHead('Your bag')}<div class="drawer__body"><div class="drawer__empty"><p>Your bag is empty.</p><a class="btn btn--ink" href="#shop" data-close>Shop the drop</a></div></div>`
    return
  }
  el.innerHTML = `${drawerHead('Your bag')}
    <div class="drawer__body">${cart.map((l, i) => {
      const p = byId(l.id)
      return `<div class="line"><img src="${A(p.imgs[0])}" alt="" />
        <div><h3>${p.name}</h3><p>Size ${l.size} · ${PRICE}</p>
          <div class="qty"><button type="button" data-line="${i}" data-d="-1" aria-label="Fewer">−</button><output>${l.qty}</output><button type="button" data-line="${i}" data-d="1" aria-label="More">+</button></div></div>
        <button class="line__rm" type="button" data-line="${i}" data-d="x">Remove</button></div>`
    }).join('')}</div>
    <div class="drawer__foot"><p><span>Subtotal</span><span>${PRICE}</span></p><small>Shipping and taxes at checkout.</small>
      <button class="btn btn--ink btn--wide" type="button" id="checkout">Checkout <span class="btn__arrow">→</span></button></div>`
  el.onclick = (e) => {
    if (e.target.closest('#checkout')) return toast('This is a demo store, so checkout is switched off.')
    const b = e.target.closest('[data-line]')
    if (!b) return
    const l = cart[+b.dataset.line]
    if (b.dataset.d === 'x') cart.splice(+b.dataset.line, 1)
    else l.qty = Math.max(1, Math.min(9, l.qty + +b.dataset.d))
    $('#cartCount').textContent = cart.reduce((n, x) => n + x.qty, 0)
    $('#cartCount').hidden = !cart.length
    renderCart()
  }
}

function renderWish() {
  const el = $('#wish')
  const items = [...wish].map(byId)
  el.innerHTML = `${drawerHead('Wishlist')}<div class="drawer__body">${
    items.length
      ? items.map((p) => `<div class="line"><img src="${A(p.imgs[0])}" alt="" /><div><h3>${p.name}</h3><p>${PRICE}</p></div>
          <button class="line__rm" type="button" data-quick="${p.id}">View</button></div>`).join('')
      : '<div class="drawer__empty"><p>Tap the heart on any tee to save it here.</p></div>'
  }</div>`
}

function openQuick(id) {
  const p = byId(id)
  const el = $('#quick')
  const [label] = BADGE[p.badge] || []
  el.innerHTML = `<div class="modal__box">
    <button class="x" type="button" data-close aria-label="Close">×</button>
    <img src="${A(p.imgs[0])}" alt="${p.name}" />
    <div class="modal__info">
      <p class="kicker">${label || p.cat}</p>
      <h2>${p.name}</h2>
      <p class="price">${priceHtml(p)}</p>
      <p class="lede">Oversized fit in 240 GSM cotton with a drop shoulder. Finished by hand in our studio.</p>
      <div class="sizes-pick" role="radiogroup" aria-label="Size"></div>
      ${qtyHtml}
      <button class="btn btn--ink btn--wide" type="button" data-q-add ${p.badge === 'out' ? 'disabled' : ''}>${p.badge === 'out' ? 'Sold out' : 'Add to bag'}</button>
    </div></div>`
  const size = sizePicker($('.sizes-pick', el), p.badge === 'out')
  const qty = qtyControl($('.qty', el))
  $('[data-q-add]', el).onclick = () => {
    if (!size()) return toast('Pick a size first.')
    addToCart(id, size(), qty())
    closeAll()
  }
  open('quick')
}

/* ---------- search ---------- */
const searchInput = $('#searchInput')
const runSearch = () => {
  const q = searchInput.value.trim().toLowerCase()
  const hits = q
    ? PRODUCTS.filter((p) => `${p.name} ${p.cat} ${p.dots.join(' ')} oversized`.toLowerCase().includes(q))
    : PRODUCTS.slice(0, 4)
  $('#searchResults').innerHTML = hits.length
    ? hits.map((p) => `<button type="button" data-quick="${p.id}"><img src="${A(p.imgs[0])}" alt="" />${p.name}</button>`).join('')
    : `<p class="empty">No tees match "${searchInput.value.replace(/[<>&"]/g, '')}".</p>`
}
searchInput.addEventListener('input', runSearch)
$('.search__trend').addEventListener('click', (e) => {
  const b = e.target.closest('[data-q]')
  if (!b) return
  searchInput.value = b.dataset.q
  runSearch()
})
$('#search').insertAdjacentHTML('afterbegin', '<button class="x" type="button" data-close aria-label="Close search">×</button>')
$('#search').addEventListener('click', (e) => e.target.id === 'search' && closeAll())

/* ---------- hero deck: tap to send the top photo to the back ---------- */
const deck = $('#deck')
const deckNames = ['Old City Back Print', 'Wild Ink Tee', 'Neem Leaf Embroidery']
let deckTop = 0
const layDeck = () => {
  $$('.deck__card', deck).forEach((c) => (c.dataset.pos = (+c.dataset.i - deckTop + 3) % 3))
  $('#deckTag').textContent = deckNames[deckTop]
}
const shuffle = () => {
  deckTop = (deckTop + 1) % 3
  layDeck()
}
deck.addEventListener('click', shuffle)
deck.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), shuffle()))
layDeck()
let deckTimer = reduced ? null : setInterval(shuffle, 4200)
deck.addEventListener('pointerenter', () => clearInterval(deckTimer))

/* ---------- shop the look ---------- */
const LOOK = { cargo: 'blank', ash: 'ash' }
const showLook = (key) => {
  const p = byId(LOOK[key])
  $$('.spot').forEach((s) => s.classList.toggle('is-on', s.dataset.look === key))
  const panel = $('#lookPanel')
  panel.style.animation = 'none'
  void panel.offsetWidth
  panel.style.animation = ''
  panel.innerHTML = `<p class="kicker">Shop the look</p>
    <div class="look__item"><img src="${A(p.imgs[0])}" alt="" /><div><h3>${p.name}</h3><p class="price">${priceHtml(p)}</p></div></div>
    <div class="sizes-pick" role="radiogroup" aria-label="Size"></div>${qtyHtml}
    <button class="btn btn--ink btn--wide" type="button" id="lookAdd">Add to bag <span class="btn__arrow">→</span></button>
    <p class="lede" style="margin-top:14px">Tap the dots on the photo to see each piece.</p>`
  const size = sizePicker($('.sizes-pick', panel))
  const qty = qtyControl($('.qty', panel))
  $('#lookAdd').onclick = () => addToCart(p.id, size(), qty())
}
$$('.spot').forEach((s) => s.addEventListener('click', () => showLook(s.dataset.look)))
showLook('cargo')

/* ---------- customiser ---------- */
const PLACES = {
  chest: { x: 248, y: 150, s: 0.5, w: 80 },
  centre: { x: 200, y: 236, s: 1, w: 170 },
  hem: { x: 200, y: 372, s: 0.62, w: 170 },
}
const tee = $('#tee')
const teeText = $('#teeText')
const custom = $('#customForm')
const customText = $('#customText')

const drawTee = (stitch) => {
  const f = new FormData(custom)
  const place = PLACES[f.get('place')]
  const thread = $('input[name="thread"]:checked', custom)
  tee.style.setProperty('--tee', f.get('tee'))
  tee.style.setProperty('--thread', thread.value)
  teeText.textContent = customText.value.trim() || 'Your words'
  teeText.setAttribute('x', 0)
  teeText.setAttribute('y', 0)
  // shrink long text so it never runs off the tee
  const w = teeText.getBBox().width || 1
  const s = Math.min(place.s, place.w / w)
  teeText.style.transform = `translate(${place.x}px, ${place.y}px) scale(${s})`
  $('#customNote').textContent = `${f.get('place')[0].toUpperCase() + f.get('place').slice(1)} · Thread colour: ${thread.dataset.name}`
  $('#textLeft').textContent = `${18 - customText.value.length} left`
  if (stitch && !reduced) {
    teeText.classList.remove('is-stitching')
    void teeText.getBBox()
    teeText.classList.add('is-stitching')
  }
}
custom.addEventListener('change', () => drawTee(true))
customText.addEventListener('input', () => drawTee(false))
custom.addEventListener('submit', (e) => {
  e.preventDefault()
  toast('Demo store: your design would go to the studio for a quote.')
})
document.fonts.ready.then(() => drawTee(false))
drawTee(false)

/* ---------- spotlight ---------- */
const spotMain = $('#spotMain')
$('.spotlight__thumbs').addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b || b.classList.contains('is-on')) return
  $$('.spotlight__thumbs button').forEach((x) => x.classList.toggle('is-on', x === b))
  spotMain.classList.add('is-fading')
  setTimeout(() => {
    spotMain.src = b.dataset.src
    spotMain.classList.remove('is-fading')
  }, reduced ? 0 : 180)
})
const spotSize = sizePicker($('#spotSizes'))
$('#spotAdd').addEventListener('click', () => addToCart('oldcity', spotSize()))

/* ---------- newsletter ---------- */
$('#news').addEventListener('submit', (e) => {
  e.preventDefault()
  const v = $('#newsEmail').value.trim()
  const msg = $('#newsMsg')
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  msg.classList.toggle('is-bad', !ok)
  msg.textContent = ok ? 'You are on the list. (Demo: nothing was sent.)' : 'Please enter a valid email.'
})

/* ---------- nav border + scroll reveals ---------- */
const nav = $('#nav')
addEventListener('scroll', () => nav.classList.toggle('is-scrolled', scrollY > 10), { passive: true })

const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add('is-in'), io.unobserve(en.target))),
  { rootMargin: '0px 0px -10% 0px' },
)
$$('.cats, .shop__head, .look, .custom__stage, .custom__form, .spotlight, .feed, .story > *').forEach((el) => {
  el.classList.add('reveal')
  io.observe(el)
})

renderGrid()
