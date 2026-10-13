import '@fontsource-variable/manrope/wght'
import '@fontsource-variable/geist-mono/wght'
import './style.css'
import { CATEGORIES, PRODUCTS, productBy, categoryBy, HAZARDS, SERVICES, COMPANY } from './site.js'
import { startSparks, mountPipe } from './line.js'
import { reply, chipAction, GREETING } from './assistant.js'
import * as views from './views.js'
import { startSmoothScroll, mountMotion, scrollToTop, scrollToEl, pauseScroll } from './motion.js'
import {
  icon, paintIcons, esc, $, $$, reduced, asset, toast, demoNote,
  quoteList, onQuote, addToQuote, setQty, clearQuote, saveLead, openOverlay, closeOverlay, overlayOpen, botFace,
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
let routeCleanup = () => {}
const render = () => {
  const { path, params } = parse()
  const route = routes.find(([re]) => re.test(path))
  const swap = () => {
    routeCleanup()
    routeCleanup = () => {}
    if (route) {
      const m = path.match(route[0])
      main.innerHTML = route[1](m)
      route[2](params, m)
    } else main.innerHTML = views.notFound()
    $$('.bar__link').forEach((a) => a.classList.toggle('is-on', a.dataset.nav === 'home' ? path === '/' && !params.has('find') : a.dataset.nav === 'finder' ? params.has('find') : path.startsWith(`/${a.dataset.nav}`) || (a.dataset.nav === 'products' && path.startsWith('/product'))))
    if (path !== lastPath) {
      const target = params.has('find') ? $('#finder') : null
      target ? setTimeout(() => scrollToEl(target), 60) : scrollToTop()
    }
    lastPath = path
    mountMotion(main)
  }
  if (document.startViewTransition && !reduced && lastPath !== null && path !== lastPath) document.startViewTransition(swap)
  else swap()
  closeOverlay()
}
addEventListener('hashchange', render)

/* ===================================================================== home */
function mountHome(params) {
  const timers = []
  const every = (fn, ms) => timers.push(setInterval(() => document.visibilityState === 'visible' && fn(), ms))
  routeCleanup = () => timers.forEach(clearInterval)

  /* the plant: zones light up, the readout follows, the full kit opens in a sheet */
  const card = $('#plantCard')
  const plant = $('.plant')
  let current = null
  let touring = !reduced
  const show = (id, { fromUser = false, scroll = true } = {}) => {
    const h = HAZARDS.find((x) => x.id === id) ?? HAZARDS[0]
    if (fromUser) touring = false
    if (h.id === current) return
    current = h.id
    plant.dataset.active = h.id
    $$('.pl-zone', plant).forEach((z) => z.classList.toggle('is-on', z.dataset.zone === h.id))
    $$('.hazard').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.hazard === h.id)))
    const top = h.products.slice(0, 4).map((s) => productBy[s])
    card.innerHTML = `<div class="plant-card__in">
      <div class="plant-card__txt"><p class="plant-card__k">${icon(h.icon)} ${esc(h.line)}</p><h3>${esc(h.label)}</h3></div>
      <div class="plant-card__kit">${top.map((p, i) => `<a href="#/product/${p.slug}" style="--i:${i}" title="${esc(p.name)}"><img src="${asset(`p/${p.slug}.webp`)}" alt="${esc(p.name)}" /></a>`).join('')}</div>
      <button class="btn btn--accent" type="button" data-see-kit="${h.id}">See the kit · ${h.products.length} <i class="btn__ball">${icon('arrow-up-right')}</i></button></div>`
    const sc = $('#plantScroll')
    if (scroll && sc.scrollWidth > sc.clientWidth) {
      const hit = $(`[data-hit="${h.id}"]`, plant).getBoundingClientRect()
      const box = sc.getBoundingClientRect()
      sc.scrollTo({ left: sc.scrollLeft + hit.left - box.left - (box.width - hit.width) / 2, behavior: reduced ? 'auto' : 'smooth' })
    }
  }
  const order = HAZARDS.map((h) => h.id)
  every(() => touring && show(order[(order.indexOf(current) + 1) % order.length], { scroll: false }), 3400)
  $$('.pl-hit', plant).forEach((hit) => {
    const id = hit.dataset.hit
    hit.setAttribute('aria-label', HAZARDS.find((h) => h.id === id).label)
    hit.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && show(id, { fromUser: true, scroll: false }))
    hit.addEventListener('click', () => (show(id, { fromUser: true, scroll: false }), openKit(id)))
    hit.addEventListener('focus', () => show(id, { fromUser: true }))
    hit.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openKit(id)))
  })
  $$('.hazard').forEach((b) => b.addEventListener('click', () => show(b.dataset.hazard, { fromUser: true })))
  card.addEventListener('click', (e) => {
    const b = e.target.closest('[data-see-kit]')
    if (b) openKit(b.dataset.seeKit)
  })
  show(params.get('hazard') ?? HAZARDS[0].id, { fromUser: !!params.get('hazard') })
  if (params.get('hazard')) setTimeout(() => openKit(params.get('hazard')), 600)

  /* showroom: four Saviour helmets, each in its real colourways */
  const showSpot = (slug) => {
    const p = productBy[slug]
    $$('[data-spot]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.spot === slug)))
    $('#spotInfo').innerHTML = views.spotInfo(p)
    const colours = p.gallery.filter((g) => g.swatch)
    $('#spotSwatches').innerHTML = colours
      .map((g, i) => `<button type="button" role="radio" class="swatch swatch--lg" style="--c:${g.swatch}" aria-checked="${i === 0}" data-img="${g.img}" aria-label="${esc(g.label)}"><span>${esc(g.label)}</span></button>`)
      .join('')
    setHelmet(colours[0].img, `${p.name} helmet in ${colours[0].label.toLowerCase()}`, colours[0].swatch)
    // the scanner passes again for each new helmet
    const bay = $('.qc__bay')
    bay.classList.remove('is-scanning')
    void bay.offsetWidth
    bay.classList.add('is-scanning')
    $$('#spotSwatches .swatch').forEach((s) =>
      s.addEventListener('click', () => {
        $$('#spotSwatches .swatch').forEach((x) => x.setAttribute('aria-checked', String(x === s)))
        setHelmet(s.dataset.img, `${p.name} helmet in ${s.getAttribute('aria-label').toLowerCase()}`, s.style.getPropertyValue('--c'))
      }),
    )
  }
  $$('[data-spot]').forEach((b) => b.addEventListener('click', () => showSpot(b.dataset.spot)))
  showSpot('freedom')

  /* service stations: one opens at a time */
  const stns = $$('.stn')
  const openStn = (b) => stns.forEach((s) => {
    s.classList.toggle('is-open', s === b)
    s.setAttribute('aria-expanded', String(s === b))
  })
  stns.forEach((b) => {
    b.addEventListener('click', () => openStn(b))
    b.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && matchMedia('(min-width: 961px)').matches && openStn(b))
  })

  /* hero: the helmet widget changes colour */
  $$('#heroDots button').forEach((d) =>
    d.addEventListener('click', () => {
      $$('#heroDots button').forEach((x) => x.setAttribute('aria-pressed', String(x === d)))
      const img = $('#heroHelm')
      img.classList.add('is-swap')
      setTimeout(() => {
        img.src = asset(`helm/${d.dataset.helm}.webp`)
        img.classList.remove('is-swap')
      }, reduced ? 0 : 180)
    }),
  )

  /* conveyor: runs by itself; the visitor can drag, swipe, wheel or step it */
  const stopBelt = mountBelt($('#beltLane'))

  /* hero sparks and the pipe */
  const stopSparks = startSparks($('#sparks'))
  const stopPipe = mountPipe()

  /* testimonials */
  const quotes = $$('.quote')
  let qi = 0
  const showQuote = (i) => {
    qi = (i + quotes.length) % quotes.length
    quotes.forEach((q, j) => q.classList.toggle('is-on', j === qi))
    $$('[data-quote-i]').forEach((b, j) => b.setAttribute('aria-current', String(j === qi)))
  }
  $$('[data-quote-i]').forEach((b) => b.addEventListener('click', () => showQuote(+b.dataset.quoteI)))
  if (!reduced) every(() => showQuote(qi + 1), 6500)

  const prev = routeCleanup
  routeCleanup = () => (prev(), stopSparks(), stopPipe(), stopBelt())
  if (params.get('to')) setTimeout(() => scrollToEl($(`#${params.get('to')}`)), 80)
}

/** The conveyor: an endless scroller. It creeps along on its own, stops while the
 *  visitor hovers, drags or swipes it, and picks up again shortly after they let go. */
function mountBelt(lane) {
  if (!lane) return () => {}
  const run = lane.firstElementChild
  const live = $('#beltLive')
  const half = () => run.scrollWidth / 2
  let hovering = false
  let dragging = false
  let idleUntil = 0
  let raf = 0
  let carry = 0
  let startX = 0
  let startLeft = 0
  let moved = 0
  let wasStopped = null
  const hold = (ms = 2200) => (idleUntil = performance.now() + ms)
  const wrap = () => {
    const h = half()
    if (lane.scrollLeft >= h) lane.scrollLeft -= h
    else if (lane.scrollLeft <= 0) lane.scrollLeft += h
  }
  const tick = (t) => {
    raf = requestAnimationFrame(tick)
    const stopped = reduced || hovering || dragging || t < idleUntil
    if (stopped !== wasStopped) {
      wasStopped = stopped
      live.classList.toggle('is-stopped', stopped)
      live.querySelector('span').textContent = stopped ? 'Line paused' : 'Line running'
    }
    if (stopped) return
    carry += 0.5
    const step = Math.floor(carry)
    if (step) {
      lane.scrollLeft += step
      carry -= step
      wrap()
    }
  }
  lane.scrollLeft = 1
  raf = requestAnimationFrame(tick)
  lane.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && (hovering = true))
  lane.addEventListener('pointerleave', () => {
    hovering = false
    hold(700)
  })
  lane.addEventListener('wheel', () => hold(), { passive: true })
  lane.addEventListener('touchstart', () => hold(3200), { passive: true })
  lane.addEventListener('scroll', () => wrap(), { passive: true })
  // mouse drag; touch swipes natively
  lane.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    dragging = true
    moved = 0
    startX = e.clientX
    startLeft = lane.scrollLeft
  })
  const move = (e) => {
    if (!dragging) return
    const dx = e.clientX - startX
    moved = Math.max(moved, Math.abs(dx))
    if (moved > 4) lane.classList.add('is-dragging')
    lane.scrollLeft = startLeft - dx
  }
  const end = () => {
    if (!dragging) return
    dragging = false
    lane.classList.remove('is-dragging')
    hold()
  }
  addEventListener('pointermove', move)
  addEventListener('pointerup', end)
  // a drag must not open the crate under the pointer
  lane.addEventListener('click', (e) => {
    if (moved > 6) {
      e.preventDefault()
      e.stopPropagation()
    }
    moved = 0
  }, true)
  const stepBelt = (dir) => {
    hold(3200)
    const crate = run.querySelector('.crate')
    lane.scrollBy({ left: dir * (crate.offsetWidth + 14) * 2, behavior: reduced ? 'auto' : 'smooth' })
  }
  lane.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    stepBelt(e.key === 'ArrowRight' ? 1 : -1)
  })
  $$('[data-belt]').forEach((b) => b.addEventListener('click', () => stepBelt(+b.dataset.belt)))
  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('pointermove', move)
    removeEventListener('pointerup', end)
  }
}

/** The full kit for a hazard, in a sheet over the page. */
function openKit(id) {
  const h = HAZARDS.find((x) => x.id === id)
  const el = $('#sheet')
  el.innerHTML = views.kitSheet(h)
  $('[data-close]', el).addEventListener('click', closeOverlay)
  $('[data-add-all]', el).addEventListener('click', () => {
    h.products.forEach((s) => addToQuote(s))
    toast(`${icon('check')}<span>Added ${h.products.length} products for ${esc(h.label.toLowerCase())} to your quote list.</span>`)
  })
  openOverlay(el)
}

/** Swap the floating helmet: the new colour rises in as the old one fades, and the stage glow follows. */
const setHelmet = (name, alt, glow) => {
  const box = $('#spotImg')
  if (glow) box.closest('.qc').style.setProperty('--glow', glow)
  const next = new Image()
  next.src = asset(`helm/${name}.webp`)
  next.alt = alt
  next.className = 'is-entering'
  box.appendChild(next)
  const old = [...box.querySelectorAll('img')].filter((i) => i !== next)
  old.forEach((o) => o.classList.add('is-leaving'))
  requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('is-entering')))
  setTimeout(() => old.forEach((o) => o.remove()), reduced ? 0 : 600)
}

/* ================================================================== catalog */
function mountCatalog() {
  const input = $('#filter')
  const grid = $('#catalogGrid')
  const shelves = $('#shelves')
  const allMode = !!shelves
  const base = [...new Set($$('.card', allMode ? shelves : grid).map((c) => c.dataset.slug))].map((s) => productBy[s])
  // the All page searches the whole catalogue, not just what the shelves show
  const pool = allMode ? PRODUCTS.filter((p, i) => PRODUCTS.findIndex((x) => x.name === p.name) === i) : base
  let facet = 'all'
  const text = (p) => `${p.name} ${p.sku ?? ''} ${(p.standards ?? []).join(' ')} ${categoryBy[p.cat].label} ${p.brand ?? ''}`.toLowerCase()
  const apply = () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean)
    const filtering = words.length || facet !== 'all'
    const hits = pool.filter((p) =>
      words.every((w) => text(p).includes(w)) &&
      (facet === 'all' || (facet === 'certified' ? !!p.standards : facet === `brand:${p.brand}`)),
    )
    if (allMode) {
      shelves.hidden = !!filtering
      grid.hidden = !filtering
      if (filtering) grid.innerHTML = hits.map((p) => views.productCard(p)).join('')
    } else {
      const ok = new Set(hits.map((p) => p.slug))
      $$('.card', grid).forEach((c) => (c.hidden = !ok.has(c.dataset.slug)))
    }
    $('#filterCount').textContent = `${filtering ? hits.length : pool.length} product${hits.length === 1 && filtering ? '' : 's'}`
    $('#filterEmpty').hidden = !filtering || hits.length > 0
  }
  input.addEventListener('input', apply)
  $$('[data-facet]').forEach((b) =>
    b.addEventListener('click', () => {
      facet = b.dataset.facet
      $$('[data-facet]').forEach((x) => x.classList.toggle('is-on', x === b))
      apply()
    }),
  )
  $('[data-assist-filter]')?.addEventListener('click', () => openAssist(input.value || 'What do you stock?'))
  // shelves scroll sideways by arrow
  $$('[data-shelf]').forEach((b) =>
    b.addEventListener('click', () => {
      const row = b.closest('.shelf').querySelector('.shelf__row')
      row.scrollBy({ left: +b.dataset.shelf * row.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' })
    }),
  )
  // keep the chosen category chip in view
  $('.orb.is-on')?.scrollIntoView({ block: 'nearest', inline: 'center' })
}

/** Quick view: the product in a panel, without leaving the catalogue. */
function openQuickView(slug) {
  const p = productBy[slug]
  const el = $('#qv')
  el.innerHTML = views.quickView(p)
  const shots = $$('.qv__thumb', el)
  const show = (i) => {
    const t = shots[i]
    const imgEl = $('#qvImg', el)
    imgEl.classList.add('is-swap')
    setTimeout(() => {
      imgEl.src = t.querySelector('img').src
      imgEl.classList.remove('is-swap')
    }, reduced ? 0 : 140)
    shots.forEach((s, j) => s.classList.toggle('is-on', j === i))
    $$('.swatch', el).forEach((s) => s.setAttribute('aria-checked', String(+s.dataset.shot === i)))
    if ($('#qvLabel', el)) $('#qvLabel', el).textContent = t.getAttribute('aria-label')
  }
  $$('[data-shot]', el).forEach((b) => b.addEventListener('click', () => show(+b.dataset.shot)))
  $$('.swatch', el)[0]?.setAttribute('aria-checked', 'true')
  const qty = $('#qvQty', el)
  $$('[data-qstep]', el).forEach((b) => b.addEventListener('click', () => (qty.value = Math.max(1, (+qty.value || 1) + +b.dataset.qstep * (+qty.value >= 50 ? 10 : 1)))))
  $('[data-qv-add]', el).addEventListener('click', () => {
    addToQuote(slug, Math.max(1, +qty.value || 1))
    toast(`${icon('check')}<span>${esc(qty.value)} × ${esc(p.name)} added. <button class="link" type="button" data-quote-open>Open quote list</button></span>`)
  })
  $('[data-close]', el).addEventListener('click', closeOverlay)
  openOverlay(el, { focus: '[data-qv-add]' })
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
  else if (t.dataset.qv) openQuickView(t.dataset.qv)
  else if (t.hasAttribute('data-open-search')) openPalette()
  else if (t.dataset.demo) demoNote(t.dataset.demo)
})
$('#scrim').addEventListener('click', closeOverlay)
new MutationObserver(() => pauseScroll(document.documentElement.classList.contains('is-locked'))).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
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
  <div class="mega__foot"><a href="#/products">All ${new Set(PRODUCTS.map((p) => p.name)).size} products ${icon('arrow-right')}</a><a href="#/?find">Not sure? Start from a hazard ${icon('arrow-right')}</a></div>`
// close the menu once a category is chosen, until the pointer leaves it
const megaWrap = $('.mega-wrap')
$('#mega').addEventListener('click', (e) => e.target.closest('a') && (megaWrap.classList.add('is-shut'), document.activeElement.blur()))
megaWrap.addEventListener('pointerleave', () => megaWrap.classList.remove('is-shut'))
$('#footCats').innerHTML = `<h4>Products</h4>${CATEGORIES.slice(0, 9).map((c) => `<a href="#/products/${c.slug}">${esc(c.label)} protection</a>`).join('')}<a href="#/products">All categories</a>`
$('#openMenu').addEventListener('click', () => {
  $('#menu').innerHTML = `<div class="menu__head"><img src="${asset('brand/suresafety.webp')}" alt="Sure Safety" /><button class="icon-btn" type="button" data-close aria-label="Close">${icon('x')}</button></div>
    <nav><a href="#/">Home</a><a href="#/products">Products</a><a href="#/?find">Hazard finder</a><a href="#/services">Services</a><a href="#/contact">Request a quote</a></nav>
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
  const count = new Set(PRODUCTS.map((p) => p.name)).size
  assist.innerHTML = `<div class="assist__head"><span class="assist__avatar" id="headBot">${botFace()}</span><p><b>Sure</b><small><i class="assist__on"></i>Safety assistant · knows all ${count} products</small></p><button class="icon-btn icon-btn--sm" type="button" id="assistClose" aria-label="Close chat">${icon('x')}</button><i class="assist__scan" aria-hidden="true"></i></div>
    <div class="assist__log" id="assistLog" role="log" aria-live="polite"></div>
    <form class="assist__form" id="assistForm"><input id="assistInput" autocomplete="off" placeholder="Ask about a product or hazard" aria-label="Message Sure Assist" /><button type="submit" aria-label="Send">${icon('paper-plane-right')}</button></form>`
  $('#assistClose').addEventListener('click', closeAssist)
  $('#assistForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const v = $('#assistInput').value.trim()
    if (!v) return
    $('#assistInput').value = ''
    ask(v)
  })
  log().innerHTML = `<div class="welcome">${botFace('bot--hero')}<h3>Hi, I’m Sure.</h3><p>I know every product in the catalogue, the standard each helmet meets, and what each service covers. I can also pass your enquiry to sales.</p>
    <div class="welcome__cards">${[
      ['lightning', 'Helmet for electrical work'],
      ['fire', 'Gloves for heat'],
      ['wind', 'Do you do fit testing?'],
      ['clipboard-text', 'Get a quote'],
    ].map(([ic, q], i) => `<button type="button" class="welcome__card" data-ask="${q}" style="--i:${i}">${icon(ic)}<span>${q}</span></button>`).join('')}</div></div>`
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
  el.innerHTML = `<span class="msg__bot">${botFace()}</span><p>${esc(r.text)}</p>
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
  typing.innerHTML = `<span class="msg__bot">${botFace('is-thinking')}</span><span class="think">Checking the catalogue<i></i></span>`
  $('#headBot').classList.add('is-thinking')
  $('.welcome', log())?.classList.add('is-gone')
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
      $('#headBot').classList.remove('is-thinking')
      assistState = r.state ?? assistState
      if (r.lead) saveLead({ ...r.lead, source: 'Sure Assist' })
      bot(r)
    },
    reduced ? 0 : 420 + Math.min(700, r.text.length * 4),
  )
}

/** On phones the chat is a full-screen sheet sized to the visible viewport, so it
 *  sits above the keyboard rather than behind it, and the page underneath is locked. */
const phone = matchMedia('(max-width: 600px)')
const fitViewport = () => {
  const vv = window.visualViewport
  if (!vv) return
  assist.style.setProperty('--vvh', `${vv.height}px`)
  assist.style.setProperty('--vvt', `${vv.offsetTop}px`)
  if (document.activeElement === $('#assistInput')) scrollLog()
}
function openAssist(prefill) {
  if (!assistReady) buildAssist()
  assist.hidden = false
  launch.setAttribute('aria-expanded', 'true')
  requestAnimationFrame(() => assist.classList.add('is-open'))
  document.body.classList.add('assist-on')
  if (phone.matches) {
    document.documentElement.classList.add('is-locked')
    fitViewport()
    window.visualViewport?.addEventListener('resize', fitViewport)
    window.visualViewport?.addEventListener('scroll', fitViewport)
  }
  if (prefill) ask(prefill)
  // the keyboard only opens when the visitor taps the box, not on its own
  else if (!phone.matches) $('#assistInput').focus()
}
function closeAssist() {
  document.documentElement.classList.remove('is-locked')
  window.visualViewport?.removeEventListener('resize', fitViewport)
  window.visualViewport?.removeEventListener('scroll', fitViewport)
  $('#assistInput')?.blur()
  assist.classList.remove('is-open')
  launch.setAttribute('aria-expanded', 'false')
  document.body.classList.remove('assist-on')
  setTimeout(() => (assist.hidden = true), reduced ? 0 : 260)
  launch.focus()
}
launch.addEventListener('click', () => (assist.hidden ? openAssist() : closeAssist()))
assist.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip, [data-ask]')
  if (chip) ask(chip.dataset.ask ?? chip.textContent)
  if (e.target.closest('.mini') && !e.target.closest('.mini__add') && matchMedia('(max-width: 700px)').matches) closeAssist()
})

/* the launcher: Sure peeks up, and once per visit offers a hint */
$('#launchBot').innerHTML = botFace()
const nudge = $('#nudge')
const seen = () => {
  try {
    return sessionStorage.getItem('ss-nudge') === '1'
  } catch {
    return false
  }
}
const hideNudge = () => {
  nudge.classList.remove('is-on')
  setTimeout(() => (nudge.hidden = true), 300)
  try {
    sessionStorage.setItem('ss-nudge', '1')
  } catch {
    /* fine */
  }
}
if (!seen() && !reduced)
  setTimeout(() => {
    if (!assist.hidden || seen()) return
    nudge.hidden = false
    requestAnimationFrame(() => nudge.classList.add('is-on'))
    setTimeout(hideNudge, 9000)
  }, 4500)
$('#nudgeX').addEventListener('click', hideNudge)
nudge.addEventListener('click', (e) => !e.target.closest('#nudgeX') && (hideNudge(), openAssist()))
launch.addEventListener('click', () => !nudge.hidden && hideNudge())

/* ====================================================================== go */
paintIcons()
drawQuote()
startSmoothScroll()
render()
