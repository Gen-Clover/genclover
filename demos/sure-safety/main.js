import '@fontsource-variable/archivo/wdth.css'
import './style.css'
import { CATEGORIES, PRODUCTS, productBy, categoryBy, HAZARDS, SERVICES, COMPANY } from './site.js'
import { reply, chipAction, GREETING } from './assistant.js'
import * as views from './views.js'
import {
  icon, paintIcons, esc, $, $$, reduced, asset, toast, demoNote,
  quoteList, onQuote, addToQuote, setQty, clearQuote, saveLead, openOverlay, closeOverlay, overlayOpen,
} from './ui.js'

const main = $('#main')

/* ================================================================== router */
const routes = [
  [/^\/?$/, () => views.home(), mountHome],
  [/^\/products\/?$/, () => views.products(), mountCatalog],
  [/^\/products\/([\w-]+)$/, (m) => (categoryBy[m[1]] ? views.products(m[1]) : views.notFound()), mountCatalog],
  [/^\/product\/([\w-]+)$/, (m) => views.product(m[1]), mountProduct],
  [/^\/services\/?$/, () => views.services(), () => {}],
  [/^\/contact\/?$/, () => views.contact(), mountContact],
]

const parse = () => {
  const [path, query = ''] = location.hash.replace(/^#/, '').split('?')
  return { path: path || '/', params: new URLSearchParams(query) }
}

let lastPath = null
const render = () => {
  const { path, params } = parse()
  const route = routes.find(([re]) => re.test(path))
  const swap = () => {
    if (route) {
      const m = path.match(route[0])
      main.innerHTML = route[1](m)
      route[2](params, m)
    } else main.innerHTML = views.notFound()
    $$('.bar__link').forEach((a) => a.classList.toggle('is-on', path.startsWith(`/${a.dataset.nav}`) || (a.dataset.nav === 'products' && path.startsWith('/product'))))
    if (path !== lastPath) {
      const target = params.has('find') ? $('#finder') : null
      target ? target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }) : scrollTo(0, 0)
    }
    lastPath = path
    reveal()
  }
  if (document.startViewTransition && !reduced && lastPath !== null && path !== lastPath) document.startViewTransition(swap)
  else swap()
  closeOverlay()
}
addEventListener('hashchange', render)

/* ===================================================================== home */
function mountHome(params) {
  // hazard finder
  const grid = $('#finderGrid')
  const pick = (id, focus = false) => {
    const h = HAZARDS.find((x) => x.id === id) ?? HAZARDS[0]
    $$('.hazard').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.hazard === h.id)))
    $('#finderLabel').textContent = `${h.label} · ${h.products.length} products`
    grid.classList.add('is-swapping')
    setTimeout(() => {
      grid.innerHTML = h.products.map((s) => views.productCard(productBy[s])).join('')
      grid.dataset.hazard = h.id
      grid.classList.remove('is-swapping')
    }, reduced ? 0 : 160)
    if (focus) $(`#hz-${h.id}`).focus()
  }
  $$('.hazard').forEach((b) => b.addEventListener('click', () => pick(b.dataset.hazard)))
  $('.hazards').addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return
    e.preventDefault()
    const i = HAZARDS.findIndex((h) => h.id === document.activeElement.dataset.hazard)
    pick(HAZARDS[(i + (e.key === 'ArrowDown' ? 1 : -1) + HAZARDS.length) % HAZARDS.length].id, true)
  })
  grid.dataset.hazard = HAZARDS[0].id
  if (params.get('hazard')) pick(params.get('hazard'))
  $('[data-add-all]').addEventListener('click', () => {
    const h = HAZARDS.find((x) => x.id === grid.dataset.hazard)
    h.products.forEach((s) => addToQuote(s))
    toast(`${icon('check')}<span>Added ${h.products.length} products for ${esc(h.label.toLowerCase())} to your quote list.</span>`)
  })

  // helmet spotlight
  const showSpot = (slug) => {
    const p = productBy[slug]
    $$('[data-spot]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.spot === slug)))
    $('#spotInfo').innerHTML = views.spotInfo(p)
    const colours = p.gallery.filter((g) => g.swatch)
    $('#spotSwatches').innerHTML = colours
      .map((g, i) => `<button type="button" role="radio" class="swatch swatch--lg" style="--c:${g.swatch}" aria-checked="${i === 0}" data-img="${g.img}" aria-label="${esc(g.label)}"><span>${esc(g.label)}</span></button>`)
      .join('')
    setSpotImage(colours[0].img, `${p.name} helmet in ${colours[0].label.toLowerCase()}`)
    $$('#spotSwatches .swatch').forEach((s) =>
      s.addEventListener('click', () => {
        $$('#spotSwatches .swatch').forEach((x) => x.setAttribute('aria-checked', String(x === s)))
        setSpotImage(s.dataset.img, `${p.name} helmet in ${s.getAttribute('aria-label').toLowerCase()}`)
      }),
    )
  }
  $$('[data-spot]').forEach((b) => b.addEventListener('click', () => showSpot(b.dataset.spot)))
  showSpot('freedom')

  // services
  const showSvc = (id) => {
    $$('[data-svc]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.svc === id)))
    $('#svcPanel').innerHTML = views.svcPanel(SERVICES.find((s) => s.id === id))
  }
  $$('[data-svc]').forEach((b) => b.addEventListener('click', () => showSvc(b.dataset.svc)))
  showSvc(SERVICES[0].id)
}

/** Crossfade the spotlight helmet with a short blur, so colour changes read as one object. */
const setSpotImage = (name, alt) => {
  const box = $('#spotImg')
  const next = new Image()
  next.src = asset(`g/${name}.webp`)
  next.alt = alt
  next.className = 'is-entering'
  box.appendChild(next)
  const old = [...box.querySelectorAll('img')].filter((i) => i !== next)
  requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('is-entering')))
  setTimeout(() => old.forEach((o) => o.remove()), reduced ? 0 : 450)
}

/* ================================================================== catalog */
function mountCatalog() {
  const input = $('#filter')
  const cards = $$('#catalogGrid .card')
  const names = cards.map((c) => {
    const p = productBy[c.dataset.slug]
    return `${p.name} ${p.sku ?? ''} ${(p.standards ?? []).join(' ')} ${categoryBy[p.cat].label}`.toLowerCase()
  })
  input.addEventListener('input', () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean)
    let shown = 0
    cards.forEach((c, i) => {
      const ok = words.every((w) => names[i].includes(w))
      c.hidden = !ok
      shown += ok
    })
    $('#filterCount').textContent = `${shown} product${shown === 1 ? '' : 's'}`
    $('#filterEmpty').hidden = shown > 0
  })
  $('[data-assist-filter]')?.addEventListener('click', () => openAssist(input.value || 'What do you stock?'))
}

/* ================================================================== product */
function mountProduct() {
  const setMain = (name, label) => {
    const box = $('#pdpMain img')
    box.style.opacity = 0
    setTimeout(() => {
      box.src = asset(`g/${name}.webp`)
      box.alt = `${box.alt.split(',')[0]}, ${label}`
      box.onload = () => (box.style.opacity = 1)
    }, reduced ? 0 : 140)
    $$('.thumb').forEach((t) => t.classList.toggle('is-on', t.dataset.gal === name))
    $$('.swatch[data-gal]').forEach((s) => s.setAttribute('aria-checked', String(s.dataset.gal === name)))
    if ($('#pdpColour') && $(`.swatch[data-gal="${name}"]`)) $('#pdpColour').textContent = label
  }
  $$('[data-gal]').forEach((b) => b.addEventListener('click', () => setMain(b.dataset.gal, b.dataset.label)))
  const qty = $('#pdpQty')
  $$('[data-step]').forEach((b) => b.addEventListener('click', () => (qty.value = Math.max(1, (+qty.value || 1) + (+b.dataset.step) * (+qty.value >= 50 ? 10 : 1)))))
  $('[data-add-qty]')?.addEventListener('click', (e) => {
    const slug = e.currentTarget.dataset.addQty
    addToQuote(slug, Math.max(1, +qty.value || 1))
    toast(`${icon('check')}<span>${esc(qty.value)} × ${esc(productBy[slug].name)} added. <button class="link" type="button" data-quote-open>Open quote list</button></span>`)
  })
}

/* ================================================================== contact */
function mountContact() {
  const items = Object.entries(quoteList())
  $('#rfqItems').innerHTML = items.length
    ? `<p>From your quote list</p><ul>${items.map(([s, q]) => `<li><img src="${asset(`p/${s}.webp`)}" alt="" /><span>${esc(productBy[s].name)}</span><b>× ${q}</b></li>`).join('')}</ul>`
    : `<p class="rfq__hint">${icon('clipboard-text')} Tip: add products to your quote list as you browse and they’ll appear here.</p>`
  wireForm($('#rfq'), $('#rfqDone'))
}

/** Validate a quote form; on success show the reference and what sales would receive. */
function wireForm(form, done) {
  const need = (id, ok) => {
    const f = $(`#${id}`, form)
    const bad = !ok(f.value.trim())
    f.setAttribute('aria-invalid', String(bad))
    f.closest('.field').querySelector('.err').hidden = !bad
    return bad
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const ids = $$('input[required]', form).map((i) => i.id)
    const bad = ids.map((id) => need(id, id.toLowerCase().includes('phone') || id.toLowerCase().includes('contact') ? (v) => /\S+@\S+\.\S+/.test(v) || v.replace(/\D/g, '').length >= 10 : (v) => v.length > 1))
    if (bad.some(Boolean)) return $(`#${ids[bad.indexOf(true)]}`, form).focus()
    const data = Object.fromEntries(new FormData(form))
    const ref = `RFQ-${Math.floor(10000 + Math.random() * 89999)}`
    const items = Object.entries(quoteList())
    saveLead({ ref, ...data, items, at: new Date().toISOString(), source: 'quote form' })
    done.innerHTML = `${icon('check', 'done-ico')}<h3>Enquiry ${ref} received.</h3>
      <p>Thank you, ${esc(data.name.split(' ')[0])}. In the live site this goes straight to ${COMPANY.email} and your CRM. This demo doesn’t send anything.</p>
      ${items.length ? `<p class="done-sub">${items.length} product${items.length > 1 ? 's' : ''} from your quote list included.</p>` : ''}
      <button class="btn btn--ghost" type="button" data-reset>Start a new enquiry</button>`
    done.hidden = false
    done.querySelector('[data-reset]').addEventListener('click', () => {
      form.reset()
      clearQuote()
      done.hidden = true
      if (form.id === 'rfq') mountContact()
    })
  })
  $$('input', form).forEach((i) => i.addEventListener('input', () => i.closest('.field')?.querySelector('.err') && (i.closest('.field').querySelector('.err').hidden = true)))
}

/* ============================================================ global wiring */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button, a')
  if (!t) return
  if (t.dataset.add) {
    e.preventDefault()
    addToQuote(t.dataset.add)
    t.classList.add('is-added')
    setTimeout(() => t.classList.remove('is-added'), 1200)
    toast(`${icon('check')}<span>${esc(productBy[t.dataset.add].name)} added. <button class="link" type="button" data-quote-open>Open quote list</button></span>`)
  } else if (t.hasAttribute('data-quote-open')) openQuote()
  else if (t.hasAttribute('data-whatsapp')) openWhatsApp(t.dataset.whatsapp)
  else if (t.hasAttribute('data-assist')) openAssist(t.dataset.assist)
  else if (t.hasAttribute('data-open-search')) openPalette()
  else if (t.dataset.demo) demoNote(t.dataset.demo)
})
$('#scrim').addEventListener('click', closeOverlay)
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (overlayOpen()) closeOverlay()
    else if (!$('#assist').hidden) closeAssist()
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    openPalette()
  }
})
$('#openSearch').addEventListener('click', openPalette)

// header: solid once scrolled, mega menu, mobile menu
new IntersectionObserver(([en]) => $('#bar').classList.toggle('is-scrolled', !en.isIntersecting)).observe($('.util'))
$('#mega').innerHTML = `<div class="mega__grid">${CATEGORIES.map((c) => `<a href="#/products/${c.slug}"><img src="${asset(`${c.face}.webp`)}" alt="" loading="lazy" /><span><b>${esc(c.label)}</b><small>${esc(c.line)}</small></span></a>`).join('')}</div>
  <div class="mega__foot"><a href="#/products">All ${PRODUCTS.length} products ${icon('arrow-right')}</a><a href="#/?find">Not sure? Start from a hazard ${icon('arrow-right')}</a></div>`
$('#footCats').innerHTML = `<h4>Products</h4>${CATEGORIES.slice(0, 9).map((c) => `<a href="#/products/${c.slug}">${esc(c.label)} protection</a>`).join('')}<a href="#/products">All categories</a>`
$('#openMenu').addEventListener('click', () => {
  $('#menu').innerHTML = `<div class="menu__head"><img src="${asset('brand/suresafety.webp')}" alt="Sure Safety" /><button class="icon-btn" type="button" data-close aria-label="Close">${icon('x')}</button></div>
    <nav><a href="#/products">Products</a><a href="#/?find">Hazard finder</a><a href="#/services">Services</a><a href="#/contact">Request a quote</a></nav>
    <div class="menu__cats">${CATEGORIES.map((c) => `<a href="#/products/${c.slug}">${esc(c.label)}</a>`).join('')}</div>
    <button class="btn btn--wa" type="button" data-whatsapp>${icon('whatsapp-logo')} Chat on WhatsApp</button>`
  $('#menu [data-close]').addEventListener('click', closeOverlay)
  openOverlay($('#menu'))
})

/* ======================================================== search palette */
function openPalette() {
  const el = $('#palette')
  el.innerHTML = `<div class="palette__box">
    <label class="palette__field">${icon('magnifying-glass')}<input id="palQ" type="search" placeholder="Search products, models or standards" autocomplete="off" aria-controls="palList" /><kbd>Esc</kbd></label>
    <ul class="palette__list" id="palList" role="listbox"></ul>
    <p class="palette__foot">${icon('sparkle')} Can’t find it? <button class="link" type="button" id="palAsk">Ask Sure Assist</button></p></div>`
  const q = $('#palQ', el)
  const list = $('#palList', el)
  const uniq = PRODUCTS.filter((p, i) => PRODUCTS.findIndex((x) => x.name === p.name) === i)
  let sel = 0
  const draw = () => {
    const words = q.value.toLowerCase().split(/\s+/).filter(Boolean)
    const hits = words.length
      ? uniq.filter((p) => words.every((w) => `${p.name} ${p.sku ?? ''} ${(p.standards ?? []).join(' ')} ${categoryBy[p.cat].label}`.toLowerCase().includes(w))).slice(0, 8)
      : ['freedom', 'electrical-helmet', 'scba-pro', 't-560-safety-rescue-harness-with-trauma-strap', 'heatstar-aluminized-aramide-gloves', 'chemguard-plus'].map((s) => productBy[s])
    sel = Math.min(sel, Math.max(0, hits.length - 1))
    list.innerHTML = hits.length
      ? hits.map((p, i) => `<li role="option" aria-selected="${i === sel}"><a href="#/product/${p.slug}"><img src="${asset(`p/${p.slug}.webp`)}" alt="" /><span><b>${esc(p.name)}</b><small>${esc(categoryBy[p.cat].label)}${p.sku ? ` · ${esc(p.sku)}` : ''}</small></span>${icon('arrow-right')}</a></li>`).join('')
      : `<li class="palette__none">No product matches “${esc(q.value)}”.</li>`
    list.dataset.count = hits.length
  }
  q.addEventListener('input', () => ((sel = 0), draw()))
  q.addEventListener('keydown', (e) => {
    const n = +list.dataset.count
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + n) % Math.max(n, 1)
      draw()
    } else if (e.key === 'Enter') $$('a', list)[sel]?.click()
  })
  $('#palAsk', el).addEventListener('click', () => {
    const text = q.value
    closeOverlay()
    openAssist(text || 'What do you stock?')
  })
  draw()
  openOverlay(el, { focus: '#palQ' })
}

/* =========================================================== quote drawer */
function drawQuote() {
  const entries = Object.entries(quoteList())
  const total = entries.reduce((n, [, q]) => n + q, 0)
  const badge = $('#quoteCount')
  badge.hidden = !entries.length
  badge.textContent = entries.length
  const el = $('#quoteDrawer')
  el.innerHTML = `<div class="drawer__head"><h2>Quote list</h2><button class="icon-btn" type="button" data-close aria-label="Close">${icon('x')}</button></div>
    ${
      entries.length
        ? `<ul class="drawer__list">${entries
            .map(
              ([s, q]) => `<li><img src="${asset(`p/${s}.webp`)}" alt="" /><div><a href="#/product/${s}">${esc(productBy[s].name)}</a><small>${esc(categoryBy[productBy[s].cat].label)}${productBy[s].sku ? ` · ${esc(productBy[s].sku)}` : ''}</small>
              <div class="stepper stepper--sm"><button type="button" data-q="${s}" data-d="-1" aria-label="Fewer">${icon('minus')}</button><input type="number" min="0" value="${q}" data-qi="${s}" aria-label="Quantity of ${esc(productBy[s].name)}" /><button type="button" data-q="${s}" data-d="1" aria-label="More">${icon('plus')}</button></div></div>
              <button class="icon-btn icon-btn--sm" type="button" data-rm="${s}" aria-label="Remove ${esc(productBy[s].name)}">${icon('trash')}</button></li>`,
            )
            .join('')}</ul>
          <div class="drawer__foot"><p><b>${entries.length}</b> product${entries.length > 1 ? 's' : ''}, <b>${total}</b> units</p><a class="btn btn--primary btn--lg" href="#/contact">Request a quote ${icon('arrow-right')}</a><button class="link" type="button" data-clear>Clear list</button></div>`
        : `<div class="drawer__empty">${icon('clipboard-text')}<p><b>Your quote list is empty.</b>Add products as you browse, then send one enquiry for everything.</p><a class="btn btn--primary" href="#/products">Browse products</a></div>`
    }`
  $('[data-close]', el).addEventListener('click', closeOverlay)
  $$('[data-q]', el).forEach((b) => b.addEventListener('click', () => setQty(b.dataset.q, (quoteList()[b.dataset.q] ?? 0) + +b.dataset.d)))
  $$('[data-qi]', el).forEach((i) => i.addEventListener('change', () => setQty(i.dataset.qi, Math.max(0, +i.value || 0))))
  $$('[data-rm]', el).forEach((b) => b.addEventListener('click', () => setQty(b.dataset.rm, 0)))
  $('[data-clear]', el)?.addEventListener('click', clearQuote)
}
onQuote(() => {
  drawQuote()
  if (overlayOpen() === $('#quoteDrawer')) $('#quoteDrawer .drawer__list button, #quoteDrawer a')?.focus?.()
  if (parse().path === '/contact') mountContactItems()
})
const mountContactItems = () => {
  const box = $('#rfqItems')
  if (!box || !$('#rfqDone').hidden) return
  const items = Object.entries(quoteList())
  box.innerHTML = items.length
    ? `<p>From your quote list</p><ul>${items.map(([s, q]) => `<li><img src="${asset(`p/${s}.webp`)}" alt="" /><span>${esc(productBy[s].name)}</span><b>× ${q}</b></li>`).join('')}</ul>`
    : `<p class="rfq__hint">${icon('clipboard-text')} Tip: add products to your quote list as you browse and they’ll appear here.</p>`
}
function openQuote() {
  drawQuote()
  openOverlay($('#quoteDrawer'))
}

/* ======================================================== WhatsApp (mock) */
function openWhatsApp(prefill) {
  const el = $('#wa')
  const msg = prefill || 'Hi Sure Safety, I need help choosing PPE for my site.'
  el.innerHTML = `<div class="wa__box">
    <div class="wa__head"><img src="${asset('brand/favicon.png')}" alt="" /><p><b>Sure Safety</b><small>Business account · ${COMPANY.whatsapp}</small></p><button class="icon-btn icon-btn--light" type="button" data-close aria-label="Close">${icon('x')}</button></div>
    <div class="wa__chat" id="waChat"><p class="wa__day">Today</p><div class="wa__bubble wa__bubble--in">Hello! Thanks for contacting Sure Safety. How can we help you today?<time>now</time></div></div>
    <form class="wa__send" id="waForm"><textarea id="waText" rows="2" aria-label="Message">${esc(msg)}</textarea><button type="submit" aria-label="Send">${icon('paper-plane-right')}</button></form>
    <p class="wa__note">${icon('sparkle')} Demo preview: in the live site this opens WhatsApp with your message ready to send.</p></div>`
  $('[data-close]', el).addEventListener('click', closeOverlay)
  $('#waForm', el).addEventListener('submit', (e) => {
    e.preventDefault()
    const text = $('#waText', el).value.trim()
    if (!text) return
    const chat = $('#waChat', el)
    chat.insertAdjacentHTML('beforeend', `<div class="wa__bubble wa__bubble--out">${esc(text)}<time>now ${icon('check')}</time></div>`)
    $('#waText', el).value = ''
    setTimeout(() => {
      chat.insertAdjacentHTML('beforeend', `<div class="wa__bubble wa__bubble--in wa__bubble--sys">Message not sent: this is a demo. At launch, it reaches the sales team on ${esc(COMPANY.whatsapp)}.<time>now</time></div>`)
      chat.scrollTop = chat.scrollHeight
    }, reduced ? 0 : 700)
    chat.scrollTop = chat.scrollHeight
  })
  openOverlay(el, { focus: '#waText' })
}

/* =========================================================== Sure Assist */
const assist = $('#assist')
const launch = $('#assistLaunch')
let assistState = {}
let assistReady = false

function buildAssist() {
  assist.innerHTML = `<div class="assist__head"><span class="assist__avatar">${icon('sparkle')}</span><p><b>Sure Assist</b><small>Answers from the Sure Safety catalogue</small></p><button class="icon-btn icon-btn--sm" type="button" id="assistClose" aria-label="Close chat">${icon('x')}</button></div>
    <div class="assist__log" id="assistLog" role="log" aria-live="polite"></div>
    <form class="assist__form" id="assistForm"><input id="assistInput" autocomplete="off" placeholder="Ask about a product, hazard or standard" aria-label="Message Sure Assist" /><button type="submit" aria-label="Send">${icon('paper-plane-right')}</button></form>`
  $('#assistClose').addEventListener('click', closeAssist)
  $('#assistForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const v = $('#assistInput').value.trim()
    if (!v) return
    $('#assistInput').value = ''
    ask(v)
  })
  bot(GREETING)
  assistReady = true
}

const log = () => $('#assistLog')
const scrollLog = () => log().scrollTo({ top: log().scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
const userSays = (text) => {
  log().insertAdjacentHTML('beforeend', `<div class="msg msg--me">${esc(text)}</div>`)
  $$('.chips', log()).forEach((c) => c.remove())
  scrollLog()
}
function bot(r) {
  const el = document.createElement('div')
  el.className = 'msg msg--bot'
  el.innerHTML = `<p>${esc(r.text)}</p>
    ${r.products?.length ? `<div class="msg__cards">${r.products.map((p) => `<a class="mini" href="#/product/${p.slug}"><img src="${asset(`p/${p.slug}.webp`)}" alt="" /><span><b>${esc(p.name)}</b><small>${esc(categoryBy[p.cat].label)}${p.standards ? ` · ${esc(p.standards[0])}` : ''}</small></span><button type="button" class="mini__add" data-add="${p.slug}" aria-label="Add ${esc(p.name)} to quote list">${icon('plus')}</button></a>`).join('')}</div>` : ''}
    ${r.lead ? leadCard(r.lead) : ''}`
  log().appendChild(el)
  if (r.chips?.length) log().insertAdjacentHTML('beforeend', `<div class="chips">${r.chips.map((c) => `<button type="button" class="chip">${esc(c)}</button>`).join('')}</div>`)
  scrollLog()
}
const leadCard = (l) => {
  const items = (l.products ?? []).map((s) => productBy[s]?.name).filter(Boolean)
  return `<div class="lead"><p class="lead__title">${icon('check')} Enquiry captured</p>
    <dl><div><dt>Need</dt><dd>${esc(l.need ?? items.join(', ') ?? '-')}</dd></div><div><dt>Quantity</dt><dd>${esc(l.qty)}</dd></div><div><dt>Name</dt><dd>${esc(l.name)}</dd></div><div><dt>Company</dt><dd>${esc(l.company)}</dd></div><div><dt>Contact</dt><dd>${esc(l.contact)}</dd></div></dl>
    <p class="lead__note">At launch this lands in ${esc(COMPANY.email)} and your CRM, with the full chat attached. Nothing was sent from this demo.</p></div>`
}

function ask(text) {
  userSays(text)
  const typing = document.createElement('div')
  typing.className = 'msg msg--bot msg--typing'
  typing.innerHTML = '<i></i><i></i><i></i>'
  log().appendChild(typing)
  scrollLog()
  const special = chipAction(text, assistState)
  let r = special
  if (!r && /^See all \d+$/.test(text) && assistState.more) {
    location.hash = assistState.more
    r = { text: 'Opened the full list for you. Anything you’d like me to compare?', chips: ['Get a quote'], state: assistState }
  }
  r ??= reply(text, assistState)
  setTimeout(
    () => {
      typing.remove()
      assistState = r.state ?? assistState
      if (r.lead) saveLead({ ...r.lead, source: 'Sure Assist' })
      bot(r)
    },
    reduced ? 0 : 420 + Math.min(700, r.text.length * 4),
  )
}

function openAssist(prefill) {
  if (!assistReady) buildAssist()
  assist.hidden = false
  launch.setAttribute('aria-expanded', 'true')
  requestAnimationFrame(() => assist.classList.add('is-open'))
  document.body.classList.add('assist-on')
  if (prefill) ask(prefill)
  else $('#assistInput').focus()
}
function closeAssist() {
  assist.classList.remove('is-open')
  launch.setAttribute('aria-expanded', 'false')
  document.body.classList.remove('assist-on')
  setTimeout(() => (assist.hidden = true), reduced ? 0 : 260)
  launch.focus()
}
launch.addEventListener('click', () => (assist.hidden ? openAssist() : closeAssist()))
assist.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip')
  if (chip) ask(chip.textContent)
  if (e.target.closest('.mini') && !e.target.closest('.mini__add') && matchMedia('(max-width: 700px)').matches) closeAssist()
})

/* ======================================================= reveal on scroll */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((en) => {
      if (!en.isIntersecting) return
      en.target.classList.add('is-in')
      io.unobserve(en.target)
    }),
  { rootMargin: '0px 0px -10% 0px' },
)
const reveal = () => $$('.reveal-up', main).forEach((el) => io.observe(el))

/* ====================================================================== go */
paintIcons()
drawQuote()
render()
