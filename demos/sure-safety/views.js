/** Page views. Each returns HTML; main.js mounts it and wires the behaviour. */
import { CATEGORIES, categoryBy, PRODUCTS, productBy, inCategory, HAZARDS, SERVICES, COMPANY, CLIENT_LOGOS, TESTIMONIALS } from './site.js'
import { icon, esc, asset } from './ui.js'
import { PLANT_SVG } from './plant.js'

const img = (p) => asset(`p/${p.slug}.webp`)
const gal = (name) => asset(`g/${name}.webp`)
const stdBadges = (p, max = 3) =>
  (p.standards ?? [])
    .filter((s) => !s.startsWith('CM/L'))
    .slice(0, max)
    .map((s) => `<span class="std">${esc(s)}</span>`)
    .join('')

export const productCard = (p, { lazy = true } = {}) => `
  <article class="card" data-slug="${p.slug}">
    <a class="card__link" href="#/product/${p.slug}">
      <div class="card__img"><img src="${img(p)}" alt="" ${lazy ? 'loading="lazy"' : ''} /></div>
      <div class="card__body">
        <p class="card__cat">${esc(categoryBy[p.cat].label)}${p.brand ? ` · ${esc(p.brand)}` : ''}</p>
        <h3 class="card__name">${esc(p.name)}</h3>
        ${p.standards ? `<div class="card__std">${stdBadges(p, 2)}</div>` : ''}
      </div>
    </a>
    <button class="card__qv" type="button" data-qv="${p.slug}" aria-label="Quick view of ${esc(p.name)}">${icon('eye')}<span>Quick view</span></button>
    <button class="card__add" type="button" data-add="${p.slug}" aria-label="Add ${esc(p.name)} to quote list">${icon('plus')}<span>Quote</span></button>
  </article>`

/* ------------------------------------------------------------------ home */

/** The stations of the line, in page order. The pipe on the right joins them. */
export const STATIONS = [
  ['top', 'Intake'],
  ['gauges', 'Output'],
  ['conveyor', 'The range'],
  ['finder', 'Hazards'],
  ['qc', 'Quality'],
  ['stations', 'Services'],
  ['clients', 'Clients'],
  ['faq', 'Questions'],
  ['talk', 'Dispatch'],
]
const UNIQUE_COUNT = PRODUCTS.filter((p, i) => PRODUCTS.findIndex((x) => x.name === p.name) === i).length
const stationNo = (id) => String(STATIONS.findIndex(([s]) => s === id)).padStart(2, '0')
const tag = (id) => `<p class="station-tag"><span>${stationNo(id)}</span>${esc(STATIONS.find(([s]) => s === id)[1])}</p>`

const QC = ['freedom', 'vento', 'wind', 'tough-hat']

const FAQ = [
  ['Are Saviour helmets ISI certified?', 'Yes. Saviour industrial helmets are made to IS 2925:1984 under ISI licence CM/L-7572484. Freedom, Wind and the Electrical Helmet are also tested to EN 397:2012, and the Fire Pro helmet meets IS 2745:1983.'],
  ['Can you print our logo on helmets?', 'Yes. Logo printing and reflective strips are available on Saviour helmets for bulk orders. Mention it in your quote and the sales team will confirm the options.'],
  ['Do you only sell your own brand?', 'No. Alongside our own Saviour range we distribute 3M, Honeywell, Ansell, BATA, Respirex, Pelican and Demron, so one order can cover a whole site.'],
  ['Can your team visit our site?', 'Yes. Our consultants run industrial hygiene studies, fire and safety audits, HAZOP studies and respirator fit testing at your location.'],
  ['How do I get a price?', 'Add products to your quote list as you browse, or describe what you need. Sales prices every order by model, quantity and branding, and replies with a written quote.'],
  ['Where are you based?', 'Our plant and office are at Plot 42, NH 8, Chhani, Vadodara, Gujarat. We supply sites across India.'],
]

export function home() {
  const count = (cat) => inCategory(cat).length
  const belt = CATEGORIES.map(
    (c) => `<a class="crate" href="#/products/${c.slug}"><span class="crate__img"><img src="${asset(`${c.face}.webp`)}" alt="" loading="lazy" /></span><span class="crate__name">${esc(c.label)}</span><span class="crate__n">${count(c.slug)}</span></a>`,
  ).join('')
  return `
  <svg class="pipe" id="pipe" aria-hidden="true"><path class="pipe__shell" /><path class="pipe__core" /><path class="pipe__flow" /></svg>

  <section class="hero" id="top" data-station="top">
    <div class="hero__frame">
      <img class="hero__photo" src="${asset('photo/line-hero.jpg')}" alt="Orange robot arms working along a production line" />
      <canvas class="hero__sparks" id="sparks" aria-hidden="true"></canvas>
      <div class="hero__shade" aria-hidden="true"></div>
      <div class="hero__copy">
        <p class="hero__kicker"><img src="${asset('brand/saviour.webp')}" alt="Saviour" width="96" height="38" /> Made in Vadodara</p>
        <h1 class="hero__title split">Safeguarding industries.<br /><em class="hero__hl">Protecting workers.</em></h1>
        <p class="hero__sub">Head-to-toe PPE from our own Saviour line and the brands your sites already trust, with the consultants who test the air your teams breathe.</p>
        <div class="hero__actions">
          <a class="btn btn--accent btn--lg" href="#/products">Explore products <i class="btn__ball">${icon('arrow-up-right')}</i></a>
          <button class="btn btn--glass btn--lg" type="button" data-assist="Which helmet do you recommend for a steel plant?">${icon('sparkle')} Ask Sure Assist</button>
        </div>
      </div>
      <a class="glass glass--isi" href="#/product/freedom">
        <span class="glass__k">${icon('shield-check')} ISI licensed</span>
        <b>IS 2925:1984</b><small>CM/L-7572484</small>
      </a>
      <div class="glass glass--helm">
        <img src="${asset('helm/freedom-1.webp')}" alt="Freedom helmet" id="heroHelm" />
        <div><span class="glass__k">Saviour Freedom</span><div class="dots" id="heroDots">${['freedom-1:#e2522b', 'freedom-007:#e9c43b', 'freedom-hdpa-2:#2f5fc4', 'freedom-05:#1f9a54'].map((d, i) => `<button type="button" style="--c:${d.split(':')[1]}" data-helm="${d.split(':')[0]}" aria-pressed="${i === 0}" aria-label="Colour ${i + 1}"></button>`).join('')}</div></div>
      </div>
      <div class="glass glass--count"><b data-count="2200" data-suffix="+">2,200+</b><small>products,<br />head to toe</small></div>
      <button class="hero__search" type="button" data-open-search>${icon('magnifying-glass')}<span>Search products or a model</span><kbd>Ctrl K</kbd></button>
    </div>
  </section>

  <section class="gauges" id="gauges" data-station="gauges">
    ${[
      [2200, '+', 'Products in the range', 0.92],
      [20, '', 'Categories of protection', 0.62],
      [15, '+', 'Years of industrial hygiene', 0.5],
      [35, '', 'Industry leaders served', 0.74],
    ]
      .map(
        ([n, suf, label, f]) => `<div class="gauge reveal-up" style="--f:${f}">
        <svg viewBox="0 0 120 70" aria-hidden="true"><path class="gauge__track" d="M10 62 A50 50 0 0 1 110 62"/><path class="gauge__fill" d="M10 62 A50 50 0 0 1 110 62" pathLength="1"/>${Array.from({ length: 11 }, (_, i) => {
          const a = Math.PI * (1 - i / 10)
          return `<line class="gauge__tick" x1="${(60 + Math.cos(a) * 42).toFixed(1)}" y1="${(62 - Math.sin(a) * 42).toFixed(1)}" x2="${(60 + Math.cos(a) * 37).toFixed(1)}" y2="${(62 - Math.sin(a) * 37).toFixed(1)}"/>`
        }).join('')}<g class="gauge__needle"><line x1="60" y1="62" x2="60" y2="22"/><circle cx="60" cy="62" r="5"/></g></svg>
        <b data-count="${n}" data-suffix="${suf}">${n.toLocaleString('en-IN')}${suf}</b><span>${esc(label)}</span></div>`,
      )
      .join('')}
  </section>

  <section class="conveyor" id="conveyor" data-station="conveyor">
    <div class="sec-top">${tag('conveyor')}<h2 class="h2 split">Every risk, on one line.</h2><a class="btn btn--line" href="#/products">All ${UNIQUE_COUNT} products <i class="btn__ball">${icon('arrow-up-right')}</i></a></div>
    <div class="conveyor__bay">
      <figure class="conveyor__photo"><img src="${asset('photo/line-cell.jpg')}" alt="A robot cell on a production line" loading="lazy" /><figcaption><b>${CATEGORIES.length}</b> categories<br />head to toe</figcaption></figure>
      <div class="belt">
        <div class="belt__head">
          <p class="belt__live" id="beltLive"><i></i> <span>Line running</span></p>
          <p class="belt__hint">Drag or swipe the line. Click a crate to open the range.</p>
          <div class="belt__arrows"><button type="button" class="icon-btn icon-btn--sm" data-belt="-1" aria-label="Scroll back">${icon('arrow-right', 'flip')}</button><button type="button" class="icon-btn icon-btn--sm" data-belt="1" aria-label="Scroll on">${icon('arrow-right')}</button></div>
        </div>
        <div class="belt__lane" id="beltLane" tabindex="0" aria-label="Product categories, scrollable"><div class="belt__run">${belt}${belt.replace(/<a /g, '<a aria-hidden="true" tabindex="-1" ')}</div></div>
        <div class="belt__rollers" aria-hidden="true">${'<i></i>'.repeat(26)}</div>
      </div>
    </div>
  </section>

  <section class="plant-sec" id="finder" data-station="finder">
    <div class="sec-top">${tag('finder')}<h2 class="h2 split">Walk the plant.</h2><p class="lede">Every area of a site has its own hazard. Pick one and we’ll pull the kit that answers it.</p></div>
    <div class="plant-stage">
      <div class="plant-scroll" id="plantScroll">${PLANT_SVG}</div>
      <div class="plant-card" id="plantCard" aria-live="polite"></div>
    </div>
    <div class="hazards" role="tablist" aria-label="Hazards">${HAZARDS.map((h, i) => `<button class="hazard" role="tab" type="button" data-hazard="${h.id}" aria-selected="${i === 0}">${icon(h.icon)}<b>${esc(h.label)}</b></button>`).join('')}</div>
  </section>

  <section class="qc" id="qc" data-station="qc">
    <div class="qc__bay">
      <div class="qc__tabs" role="tablist" aria-label="Helmet">${QC.map((s, i) => `<button role="tab" type="button" data-spot="${s}" aria-selected="${i === 0}">${esc(productBy[s].name)}</button>`).join('')}</div>
      <div class="qc__rig" aria-hidden="true"><i class="qc__arm"></i><i class="qc__laser"></i></div>
      <div class="qc__helmet" id="spotImg"></div>
      <div class="qc__turntable" aria-hidden="true"><i></i></div>
      <div class="qc__swatches" id="spotSwatches" role="radiogroup" aria-label="Colour"></div>
    </div>
    <div class="qc__sheet" id="spotInfo"></div>
  </section>

  <section class="stations" id="stations" data-station="stations">
    <div class="sec-top">${tag('stations')}<h2 class="h2 split">We test the site, not just sell the kit.</h2></div>
    <div class="stations__row" id="stationRow">
      ${SERVICES.map(
        (s, i) => `<button class="stn${i === 0 ? ' is-open' : ''}" type="button" data-stn="${s.id}" aria-expanded="${i === 0}">
          <span class="stn__no">${String(i + 1).padStart(2, '0')}</span>
          <span class="stn__title">${esc(s.title)}</span>
          <span class="stn__body">
            <img src="${asset(`photo/${s.photo}.jpg`)}" alt="" loading="lazy" />
            <span class="stn__text"><b>${esc(s.title)}</b><em>${esc(s.line)}</em><span class="stn__items">${s.items.map((x) => `<span>${icon('check')}${esc(x)}</span>`).join('')}</span></span>
          </span>
        </button>`,
      ).join('')}
    </div>
    <div class="stations__foot"><button class="btn btn--accent" type="button" data-assist="I'd like to book a site visit">Book a site visit <i class="btn__ball">${icon('arrow-up-right')}</i></button><p>AIHA and NABL accredited · 15+ years of industrial hygiene</p></div>
  </section>

  <section class="clients" id="clients" data-station="clients">
    <div class="sec-top">${tag('clients')}<h2 class="h2 split">Trusted on India’s biggest sites.</h2></div>
    <div class="logos">
      ${[0, 1].map((row) => {
        const set = CLIENT_LOGOS.filter((_, i) => i % 2 === row)
        return `<div class="logos__row logos__row--${row}"><ul>${[...set, ...set].map((c, i) => `<li${i >= set.length ? ' aria-hidden="true"' : ''}><img src="${asset(c.img)}" alt="${i >= set.length ? '' : esc(c.name)}" loading="lazy" /></li>`).join('')}</ul></div>`
      }).join('')}
    </div>
    <div class="voice">
      <img class="voice__bg" src="${asset('photo/line-blur.jpg')}" alt="" loading="lazy" />
      <div class="voice__glass" id="quotes">
        ${TESTIMONIALS.map((t, i) => `<figure class="quote${i === 0 ? ' is-on' : ''}"><blockquote>“${esc(t.quote)}”</blockquote><figcaption><b>${esc(t.who)}</b>${esc(t.role)}</figcaption></figure>`).join('')}
        <div class="quotes__nav">${TESTIMONIALS.map((_, i) => `<button type="button" data-quote-i="${i}" aria-label="Testimonial ${i + 1}" aria-current="${i === 0}"></button>`).join('')}</div>
      </div>
    </div>
  </section>

  <section class="faq" id="faq" data-station="faq">
    <div class="faq__head">${tag('faq')}<h2 class="h2 split">Questions buyers ask.</h2><p class="lede">Anything else? Sure Assist answers from the full catalogue.</p><button class="btn btn--line" type="button" data-assist="">${icon('sparkle')} Ask Sure Assist</button></div>
    <div class="faq__list">${FAQ.map(([q, a], i) => `<details class="qa"${i === 0 ? ' open' : ''}><summary>${esc(q)}<i>${icon('plus')}</i></summary><p>${esc(a)}</p></details>`).join('')}</div>
  </section>

  <section class="talk" id="talk" data-station="talk">
    <img class="talk__bg" src="${asset('photo/arm-dark.jpg')}" alt="" loading="lazy" />
    <div class="talk__copy">
      ${tag('talk')}
      <h2 class="talk__title split">Let’s talk.</h2>
      <p>Send your PPE list or a tender reference. We price every order by model, quantity and branding.</p>
      <div class="talk__actions">
        <a class="btn btn--accent btn--lg" href="#/contact">Request a quote <i class="btn__ball">${icon('arrow-up-right')}</i></a>
        <button class="btn btn--glass btn--lg" type="button" data-quote-open>${icon('clipboard-text')} Quote list</button>
        <button class="btn btn--glass btn--lg" type="button" data-whatsapp>${icon('whatsapp-logo')} WhatsApp</button>
      </div>
    </div>
  </section>`
}

/** The QC sheet for one helmet: each standard is ticked as the scanner passes. */
export const spotInfo = (p) => `
  <p class="qc__sku">Model ${esc(p.sku)}</p>
  <h2 class="qc__name">${esc(p.name)}</h2>
  <p class="qc__sum">${esc(p.summary)}</p>
  <ul class="qc__checks">
    ${(p.standards ?? []).map((s, i) => `<li style="--i:${i}">${icon('check')}<span>${s.startsWith('CM/L') ? 'ISI licence' : 'Tested to'}</span><b>${esc(s)}</b></li>`).join('')}
    ${p.specs ? ['Material', 'Ventilation holes', 'Suspension', 'Size'].filter((k) => p.specs[k]).map((k, i) => `<li style="--i:${i + (p.standards?.length ?? 0)}">${icon('check')}<span>${esc(k)}</span><b>${esc(p.specs[k])}</b></li>`).join('') : ''}
  </ul>
  <div class="qc__actions">
    <a class="btn btn--accent" href="#/product/${p.slug}">View ${esc(p.name)} <i class="btn__ball">${icon('arrow-up-right')}</i></a>
    <button class="btn btn--line" type="button" data-add="${p.slug}">${icon('plus')} Add to quote</button>
  </div>`

/** The full kit for one hazard, in a sheet. */
export const kitSheet = (h) => `
  <div class="sheet__head"><div><p class="sheet__k">The kit for</p><h2>${esc(h.label)}</h2></div>
  <div class="sheet__acts"><button class="btn btn--accent" type="button" data-add-all="${h.id}">${icon('plus')} Add all ${h.products.length}</button><button class="icon-btn" type="button" data-close aria-label="Close">${icon('x')}</button></div></div>
  <div class="grid grid--sheet">${h.products.map((s) => productCard(productBy[s])).join('')}</div>`

/* -------------------------------------------------------------- products */
/** Some products are listed under two categories; the full list shows each once. */
const UNIQUE = PRODUCTS.filter((p, i) => PRODUCTS.findIndex((x) => x.name === p.name) === i)

/** The round category chips across the top of every catalogue page. */
const catRow = (cat) => `
  <nav class="cat-row-nav" aria-label="Categories">
    <div class="cat-orbs" id="catOrbs">
      <a class="orb${cat ? '' : ' is-on'}" href="#/products"><span class="orb__img orb__img--all">${icon('magnifying-glass')}</span><b>All</b><small>${UNIQUE.length}</small></a>
      ${CATEGORIES.map((x) => `<a class="orb${x.slug === cat ? ' is-on' : ''}" href="#/products/${x.slug}"><span class="orb__img"><img src="${asset(`${x.face}.webp`)}" alt="" loading="lazy" /></span><b>${esc(x.label)}</b><small>${inCategory(x.slug).length}</small></a>`).join('')}
    </div>
  </nav>`

const toolbar = (list) => {
  const brands = [...new Set(list.map((p) => p.brand).filter(Boolean))]
  const certified = list.some((p) => p.standards)
  return `<div class="shop__tools">
    <label class="filter">${icon('magnifying-glass')}<input type="search" id="filter" placeholder="Filter by name or model" aria-label="Filter products" autocomplete="off" /></label>
    <div class="facets" role="group" aria-label="Refine">
      <button type="button" class="facet is-on" data-facet="all">All</button>
      ${brands.map((b) => `<button type="button" class="facet" data-facet="brand:${esc(b)}">${esc(b)}</button>`).join('')}
      ${certified ? `<button type="button" class="facet" data-facet="certified">${icon('certificate')} Certified</button>` : ''}
    </div>
    <p class="catalog__count" id="filterCount" aria-live="polite">${list.length} products</p>
  </div>`
}

const emptyState = `<div class="empty" id="filterEmpty" hidden>
  ${icon('magnifying-glass')}<p><b>Nothing matches that here.</b>Try a shorter word, or ask Sure to search the full range.</p>
  <button class="btn btn--line" type="button" data-assist-filter>Ask Sure</button></div>`

export function products(cat) {
  const c = cat ? categoryBy[cat] : null
  const crumbs = `<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${icon('caret-right')}${c ? `<a href="#/products">Products</a>${icon('caret-right')}<span>${esc(c.label)}</span>` : '<span>Products</span>'}</nav>`

  if (!c) {
    const shelves = CATEGORIES.map((x) => {
      const items = inCategory(x.slug).filter((p) => UNIQUE.includes(p))
      return `<section class="shelf" aria-labelledby="sh-${x.slug}">
        <div class="shelf__head"><div><h2 id="sh-${x.slug}">${esc(x.label)}</h2><p>${esc(x.line)}</p></div>
          <div class="shelf__acts"><a class="btn btn--line" href="#/products/${x.slug}">View all ${inCategory(x.slug).length} <i class="btn__ball">${icon('arrow-up-right')}</i></a>
          <button type="button" class="icon-btn icon-btn--sm" data-shelf="-1" aria-label="Scroll ${esc(x.label)} back">${icon('arrow-right', 'flip')}</button><button type="button" class="icon-btn icon-btn--sm" data-shelf="1" aria-label="Scroll ${esc(x.label)} on">${icon('arrow-right')}</button></div></div>
        <div class="shelf__row">${items.slice(0, 10).map((p) => productCard(p)).join('')}</div>
      </section>`
    }).join('')
    return `
  <section class="shop">
    ${crumbs}
    <div class="shop__title"><h1 class="h1">The catalogue</h1><p class="lede">${UNIQUE.length} products across ${CATEGORIES.length} categories, from our own Saviour line and the brands we distribute.</p></div>
    ${catRow(null)}
    <div class="feature">
      <a class="feat feat--big" href="#/products/head-protection">
        <span class="feat__k">Saviour · ISI licensed</span><b>Helmets made to IS 2925</b><span class="feat__go">Shop helmets ${icon('arrow-up-right')}</span>
        <img src="${asset('helm/freedom-1.webp')}" alt="" class="feat__img feat__img--a" /><img src="${asset('helm/vento-1-1.webp')}" alt="" class="feat__img feat__img--b" /><img src="${asset('helm/wind-5.webp')}" alt="" class="feat__img feat__img--c" />
      </a>
      <a class="feat" href="#/products/electrical-safety"><span class="feat__k">Arc flash</span><b>8.6 to 40 cal kits</b><span class="feat__go">Electrical ${icon('arrow-up-right')}</span><img src="${asset('p/40-cal-arc-kit.webp')}" alt="" class="feat__img" /></a>
      <a class="feat" href="#/products/respiratory-protection"><span class="feat__k">Breathing air</span><b>SCBA, escape sets and airline</b><span class="feat__go">Respiratory ${icon('arrow-up-right')}</span><img src="${asset('p/scba-pro.webp')}" alt="" class="feat__img" /></a>
      <a class="feat feat--dark" href="#/contact"><span class="feat__k">Bulk orders</span><b>Your logo on every helmet</b><p>Logo printing and reflective strips on Saviour helmets.</p><span class="feat__go">Request a quote ${icon('arrow-up-right')}</span></a>
    </div>
    <div class="shop__search">${toolbar(UNIQUE)}</div>
    <div class="grid" id="catalogGrid" hidden></div>
    ${emptyState}
    <div class="shelves" id="shelves">${shelves}</div>
  </section>`
  }

  const list = inCategory(cat)
  const stds = [...new Set(list.flatMap((p) => (p.standards ?? []).filter((s) => !s.startsWith('CM/L'))))]
  return `
  <section class="shop">
    ${crumbs}
    ${catRow(cat)}
    <div class="banner">
      <div class="banner__copy">
        <p class="banner__k">${list.length} products</p>
        <h1 class="h1">${esc(c.label)} protection</h1>
        <p class="lede">${esc(c.line)}</p>
        ${stds.length ? `<div class="banner__std">${stds.slice(0, 5).map((s) => `<span class="std">${esc(s)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="banner__art"><img src="${asset(`${c.face}.webp`)}" alt="" /></div>
    </div>
    ${toolbar(list)}
    <div class="grid" id="catalogGrid">${list.map((p, i) => productCard(p, { lazy: i > 7 })).join('')}</div>
    ${emptyState}
  </section>`
}

/** Quick view: the product without leaving the page. */
export const quickView = (p) => {
  const c = categoryBy[p.cat]
  const g = p.gallery ?? []
  const shots = g.length ? g.map((x) => ({ src: asset(`g/${x.img}.webp`), label: x.label, swatch: x.swatch })) : [{ src: img(p), label: p.name }]
  return `
  <div class="qv__box">
    <button class="icon-btn qv__x" type="button" data-close aria-label="Close">${icon('x')}</button>
    <div class="qv__thumbs" role="list">${shots.map((s, i) => `<button type="button" role="listitem" class="qv__thumb${i === 0 ? ' is-on' : ''}" data-shot="${i}" aria-label="${esc(s.label)}"><img src="${s.src}" alt="" /></button>`).join('')}</div>
    <div class="qv__stage"><img id="qvImg" src="${shots[0].src}" alt="${esc(p.name)}" />${shots.length > 1 ? `<span class="qv__label" id="qvLabel">${esc(shots[0].label)}</span>` : ''}</div>
    <div class="qv__info">
      <p class="pdp__cat">${esc(c.label)} protection${p.brand ? ` · ${esc(p.brand)}` : ''}</p>
      <h2 class="qv__name">${esc(p.name)}</h2>
      ${p.sku ? `<p class="sku">Model ${esc(p.sku)}</p>` : ''}
      <p class="qv__sum">${p.summary ? esc(p.summary) : `Part of our ${esc(c.label.toLowerCase())} range. The full datasheet comes with your quote.`}</p>
      ${p.standards ? `<div class="pdp__std">${p.standards.filter((s) => !s.startsWith('CM/L')).map((s) => `<span class="std">${esc(s)}</span>`).join('')}</div>` : ''}
      ${shots.some((s) => s.swatch) ? `<div class="qv__sw"><p>Colour</p><div>${shots.map((s, i) => (s.swatch ? `<button type="button" class="swatch" style="--c:${s.swatch}" data-shot="${i}" aria-label="${esc(s.label)}"></button>` : '')).join('')}</div></div>` : ''}
      <div class="qv__buy">
        <div class="stepper" aria-label="Quantity"><button type="button" data-qstep="-1" aria-label="Fewer">${icon('minus')}</button><input id="qvQty" type="number" min="1" value="${p.cat === 'head-protection' ? 50 : 10}" inputmode="numeric" aria-label="Quantity" /><button type="button" data-qstep="1" aria-label="More">${icon('plus')}</button></div>
        <button class="btn btn--accent" type="button" data-qv-add="${p.slug}">${icon('clipboard-text')} Add to quote</button>
      </div>
      <div class="qv__links"><a class="link" href="#/product/${p.slug}">Full details and specification ${icon('arrow-right')}</a><button class="link" type="button" data-assist="Tell me about the ${esc(p.name)}">${icon('sparkle')} Ask Sure about it</button></div>
    </div>
  </div>`
}

/* --------------------------------------------------------------- product */
export function product(slug) {
  const p = productBy[slug]
  if (!p) return notFound()
  const c = categoryBy[p.cat]
  const g = p.gallery ?? [{ img: null, label: p.name }]
  const swatches = g.filter((x) => x.swatch)
  const related = inCategory(p.cat).filter((x) => x.slug !== slug && x.name !== p.name).slice(0, 4)
  const accessories = (p.accessories ?? []).map((s) => productBy[s]).filter(Boolean)
  const lic = p.standards?.find((s) => s.startsWith('CM/L'))
  return `
  <section class="pdp">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${icon('caret-right')}<a href="#/products">Products</a>${icon('caret-right')}<a href="#/products/${c.slug}">${esc(c.label)}</a>${icon('caret-right')}<span>${esc(p.name)}</span></nav>
    <div class="pdp__top">
      <div class="pdp__gallery">
        <div class="pdp__main" id="pdpMain"><img src="${g[0].img ? gal(g[0].img) : img(p)}" alt="${esc(p.name)}${g[0].swatch ? `, ${esc(g[0].label)}` : ''}" /></div>
        ${g.length > 1 ? `<div class="pdp__thumbs" role="list">${g.map((x, i) => `<button type="button" role="listitem" class="thumb${i === 0 ? ' is-on' : ''}" data-gal="${x.img}" data-label="${esc(x.label)}" aria-label="Show ${esc(x.label)}"><img src="${gal(x.img)}" alt="" loading="lazy" /></button>`).join('')}</div>` : ''}
      </div>
      <div class="pdp__info">
        <p class="pdp__cat">${esc(c.label)} protection${p.sub ? ` · ${esc(p.sub)}` : ''}</p>
        <h1 class="h1 pdp__name">${esc(p.name)}</h1>
        <div class="pdp__meta">
          ${p.brand ? `<span class="brand-tag">${esc(p.brand)}</span>` : ''}
          ${p.sku ? `<span class="sku">Model ${esc(p.sku)}</span>` : ''}
        </div>
        ${p.standards ? `<div class="pdp__std">${p.standards.filter((s) => !s.startsWith('CM/L')).map((s) => `<span class="std std--lg">${icon('certificate')}${esc(s)}</span>`).join('')}${lic ? `<span class="pdp__lic">ISI licence ${esc(lic)}</span>` : ''}</div>` : ''}
        <p class="pdp__sum">${p.summary ? esc(p.summary) : `Part of our ${esc(c.label.toLowerCase())} range. The full datasheet, with materials, sizes and test results, comes with your quote.`}</p>
        ${swatches.length ? `<div class="pdp__swatches"><p>Colour <b id="pdpColour">${esc(swatches[0].label)}</b></p><div role="radiogroup" aria-label="Colour">${swatches.map((x, i) => `<button type="button" role="radio" aria-checked="${i === 0}" class="swatch" style="--c:${x.swatch}" data-gal="${x.img}" data-label="${esc(x.label)}" aria-label="${esc(x.label)}"></button>`).join('')}</div></div>` : ''}
        ${p.variants ? `<div class="pdp__variants"><p>Variants</p><ul>${p.variants.map((v) => `<li><span>${esc(v.name)}</span><code>${esc(v.sku)}</code></li>`).join('')}</ul></div>` : ''}
        <div class="pdp__buy">
          <div class="stepper" aria-label="Quantity"><button type="button" data-step="-1" aria-label="Fewer">${icon('minus')}</button><input id="pdpQty" type="number" min="1" value="${p.cat === 'head-protection' ? 50 : 10}" inputmode="numeric" aria-label="Quantity" /><button type="button" data-step="1" aria-label="More">${icon('plus')}</button></div>
          <button class="btn btn--primary btn--lg" type="button" data-add-qty="${p.slug}">${icon('clipboard-text')} Add to quote list</button>
        </div>
        <div class="pdp__aux">
          <button class="aux" type="button" data-assist="Tell me about the ${esc(p.name)}">${icon('sparkle')}<span><b>Ask Sure Assist</b>Specs, standards, alternatives</span></button>
          <button class="aux" type="button" data-whatsapp="Hi, I’d like details on the ${esc(p.name)}${p.sku ? ` (${esc(p.sku)})` : ''}.">${icon('whatsapp-logo')}<span><b>WhatsApp sales</b>Message the sales team</span></button>
          <button class="aux" type="button" data-demo="Datasheet downloads">${icon('file-pdf')}<span><b>Datasheet</b>PDF${p.sku ? `, ${esc(p.sku)}` : ''}</span></button>
        </div>
      </div>
    </div>

    ${
      p.specs || p.features || p.applications
        ? `<div class="pdp__detail">
      ${p.specs ? `<div class="pdp__block pdp__block--wide"><h2>Technical specification</h2><dl class="specs">${Object.entries(p.specs).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>` : ''}
      ${p.features ? `<div class="pdp__block"><h2>Features</h2><ul class="ticks">${p.features.map((f) => `<li>${icon('check')}${esc(f)}</li>`).join('')}</ul></div>` : ''}
      ${p.applications ? `<div class="pdp__block"><h2>Where it’s used</h2><ul class="tags">${p.applications.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
      ${p.care ? `<div class="pdp__block"><h2>Care</h2><ul class="ticks">${p.care.map((f) => `<li>${icon('check')}${esc(f)}</li>`).join('')}</ul></div>` : ''}
    </div>`
        : ''
    }
    ${accessories.length ? `<div class="pdp__rel"><h2 class="h3">Fits with</h2><div class="grid grid--4">${accessories.map((x) => productCard(x)).join('')}</div></div>` : ''}
    ${related.length ? `<div class="pdp__rel"><div class="sec-head"><h2 class="h3">More ${esc(c.label.toLowerCase())} protection</h2><a class="link" href="#/products/${c.slug}">See all ${inCategory(c.slug).length} ${icon('arrow-right')}</a></div><div class="grid grid--4">${related.map((x) => productCard(x)).join('')}</div></div>` : ''}
  </section>`
}

/* -------------------------------------------------------------- services */
export const services = () => `
  <section class="page-hero page-hero--photo">
    <img src="${asset('photo/refinery.jpg')}" alt="" />
    <div><nav class="crumbs crumbs--light" aria-label="Breadcrumb"><a href="#/">Home</a>${icon('caret-right')}<span>Services</span></nav>
    <h1 class="display display--md">Consulting, testing and training.</h1>
    <p class="lede">An AIHA and NABL accredited team with 15+ years of industrial hygiene, from noise maps to respirator fit tests.</p></div>
  </section>
  <section class="svc-list">
    ${SERVICES.map(
      (s, i) => `<article class="svc-item${i % 2 ? ' svc-item--flip' : ''}">
        <figure><img src="${asset(`photo/${s.photo}.jpg`)}" alt="" loading="lazy" /></figure>
        <div><h2 class="h2 split">${esc(s.title)}</h2><p class="lede">${esc(s.line)}</p><ul class="ticks ticks--2">${s.items.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
        <button class="btn btn--primary" type="button" data-assist="I'd like to book ${esc(s.title.toLowerCase())} for my site">Book a site visit ${icon('arrow-right')}</button></div>
      </article>`,
    ).join('')}
  </section>`

/* --------------------------------------------------------------- contact */
export const contact = () => `
  <section class="contact">
    <div class="contact__info">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${icon('caret-right')}<span>Contact</span></nav>
      <h1 class="h1">Request a quote.</h1>
      <p class="lede">Tell us what your sites need. A PPE list, a tender reference or a single product is enough to start.</p>
      <ul class="contact__ways">
        <li>${icon('map-pin')}<span><b>Visit</b>${COMPANY.address.join('<br />')}</span></li>
        <li>${icon('phone')}<span><b>Call</b>${COMPANY.phones.join('<br />')}</span></li>
        <li>${icon('envelope-simple')}<span><b>Write</b>${COMPANY.email}</span></li>
      </ul>
      <button class="btn btn--wa btn--lg" type="button" data-whatsapp>${icon('whatsapp-logo')} Chat on WhatsApp</button>
    </div>
    <form class="rfq" id="rfq" novalidate>
      <div class="rfq__items" id="rfqItems"></div>
      <div class="field"><label for="fName">Your name</label><input id="fName" name="name" autocomplete="name" required /><p class="err" hidden>Tell us who to ask for.</p></div>
      <div class="field"><label for="fCompany">Company</label><input id="fCompany" name="company" autocomplete="organization" required /><p class="err" hidden>Add your company or site.</p></div>
      <div class="field"><label for="fPhone">Phone or email</label><input id="fPhone" name="contact" autocomplete="email" required /><p class="err" hidden>Add a 10-digit phone number or an email.</p></div>
      <div class="field"><label for="fCity">City</label><input id="fCity" name="city" autocomplete="address-level2" /></div>
      <div class="field field--full"><label for="fMsg">What do you need?</label><textarea id="fMsg" name="message" rows="4" placeholder="For example: 300 ISI helmets in white with our logo, delivered to Jamnagar"></textarea></div>
      <button class="btn btn--primary btn--lg field--full" type="submit">Send enquiry ${icon('paper-plane-right')}</button>
      <div class="rfq__done" id="rfqDone" hidden></div>
    </form>
  </section>`

export const notFound = () => `<section class="empty-page"><h1 class="h1">We couldn’t find that page.</h1><p class="lede">It may have moved. The catalogue is a good place to start.</p><a class="btn btn--primary" href="#/products">Browse products</a></section>`
