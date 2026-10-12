/** Page views. Each returns HTML; main.js mounts it and wires the behaviour. */
import { CATEGORIES, categoryBy, PRODUCTS, productBy, inCategory, HAZARDS, SERVICES, INDUSTRIES, COMPANY } from './site.js'
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
    <button class="card__add" type="button" data-add="${p.slug}" aria-label="Add ${esc(p.name)} to quote list">${icon('plus')}<span>Quote</span></button>
  </article>`

/* ------------------------------------------------------------------ home */

/** The head-to-toe kit in the hero: [product, category, x%, y%, width%, label side]. */
const KIT = [
  ['freedom', 'head-protection', 50, 14, 31, 'r'],
  ['series-2-safety-eyewear', 'eye-protection', 50, 30.5, 27, 'l'],
  ['foldable-earmuffs', 'ear-protection', 81, 25, 15, 'b'],
  ['tiger-ffp-1-mask-with-valve', 'respiratory-protection', 50, 43, 16, 'r'],
  ['t-560-safety-rescue-harness-with-trauma-strap', 'fall-protection', 50, 66, 12.5, 'r'],
  ['black-pu-coated-on-hppe-liner-gloves-cut-5', 'hand-protection', 19, 58, 19, 'b'],
  ['chem-pro-gloves', 'hand-protection', 81, 60, 16, null],
  ['lion', 'feet-protection', 50, 89, 24, 'l'],
]

const SPOT = ['freedom', 'vento', 'wind', 'tough-hat']

export function home() {
  const count = (cat) => inCategory(cat).length
  const big = CATEGORIES.slice(0, 9)
  const rest = CATEGORIES.slice(9)
  return `
  <section class="hero">
    <div class="hero__copy">
      <img class="hero__brand" src="${asset('brand/saviour.webp')}" alt="Saviour, Performing PPE" width="170" height="67" />
      <h1 class="hero__title"><span>Safeguarding industries.</span> <span class="hero__accent">Protecting workers.</span></h1>
      <p class="hero__sub">Head-to-toe PPE from our own Saviour range and the brands your sites already trust, with the consultants who test the air your teams breathe.</p>
      <div class="hero__actions">
        <a class="btn btn--primary btn--lg" href="#/products">Explore products ${icon('arrow-right')}</a>
        <button class="btn btn--ghost btn--lg" type="button" data-assist="Which helmet do you recommend for a steel plant?">${icon('sparkle')} Ask Sure Assist</button>
      </div>
      <button class="hero__search" type="button" data-open-search>
        ${icon('magnifying-glass')}<span>Search ${PRODUCTS.length} products, a model or a standard</span><kbd>Ctrl K</kbd>
      </button>
    </div>
    <div class="kit" aria-label="Protection from head to toe">
      <div class="kit__axis" aria-hidden="true"></div>
      ${KIT.map(
        ([slug, cat, x, y, w, side], i) => `
        <a class="kit__item" href="#/products/${cat}" style="--x:${x}%;--y:${y}%;--w:${w}%;--i:${i}" aria-label="${esc(categoryBy[cat].label)} protection, ${count(cat)} products">
          <img src="${asset(`cut/${slug}.webp`)}" alt="" />
          ${side ? `<span class="kit__tag kit__tag--${side}"><b>${esc(categoryBy[cat].label)}</b>${count(cat)}</span>` : ''}
        </a>`,
      ).join('')}
      <p class="kit__caption"><b data-count="2200" data-suffix="+">2,200+</b> products, head to toe</p>
    </div>
  </section>

  <section class="proof" aria-label="Certifications and brands">
    <div class="proof__item">${icon('shield-check')}<p><b>ISI-licensed helmets</b>IS 2925:1984 · CM/L-7572484</p></div>
    <div class="proof__item">${icon('certificate')}<p><b>Tested to EN 397</b>On Freedom, Wind and Electrical helmets</p></div>
    <div class="proof__item">${icon('flask')}<p><b>AIHA and NABL accredited</b>Industrial hygiene team, 15+ years</p></div>
    <div class="proof__brands"><p>Also distributing</p><ul>${COMPANY.distributes.map((b) => `<li>${b}</li>`).join('')}</ul></div>
  </section>

  <section class="plant-sec" id="finder">
    <div class="plant-sec__inner">
      <div class="plant-head">
        <h2 class="h2 split">Walk the plant.</h2>
        <p class="lede">Every area of a site has its own hazard. Pick one and we’ll pull the kit that answers it.</p>
      </div>
      <div class="plant-stage">
        <div class="plant-scroll" id="plantScroll">${PLANT_SVG}</div>
        <div class="plant-card" id="plantCard" aria-live="polite"></div>
      </div>
      <div class="hazards" role="tablist" aria-label="Hazards">
        ${HAZARDS.map((h, i) => `<button class="hazard" role="tab" type="button" id="hz-${h.id}" data-hazard="${h.id}" aria-selected="${i === 0}" aria-controls="finderGrid">${icon(h.icon)}<b>${esc(h.label)}</b></button>`).join('')}
      </div>
      <div class="finder__main">
        <div class="finder__head"><p id="finderLabel">${esc(HAZARDS[0].label)}</p><button class="link link--light" type="button" data-add-all>${icon('plus')} Add all to quote list</button></div>
        <div class="grid grid--finder" id="finderGrid" role="tabpanel" aria-live="polite">${HAZARDS[0].products.map((s) => productCard(productBy[s])).join('')}</div>
      </div>
    </div>
  </section>

  <section class="spot" aria-label="Saviour helmets">
    <div class="spot__stage">
      <div class="spot__tabs" role="tablist" aria-label="Helmet">${SPOT.map((s, i) => `<button role="tab" type="button" data-spot="${s}" aria-selected="${i === 0}">${esc(productBy[s].name)}</button>`).join('')}</div>
      <p class="spot__ghost" id="spotGhost" aria-hidden="true">Freedom</p>
      <div class="spot__img" id="spotImg"><img src="${gal('freedom-1')}" alt="Freedom helmet in orange" /></div>
      <div class="spot__swatches" id="spotSwatches" role="radiogroup" aria-label="Colour"></div>
    </div>
    <div class="spot__info" id="spotInfo"></div>
  </section>

  <section class="cats" aria-labelledby="catsTitle">
    <div class="sec-head"><h2 class="h2 split" id="catsTitle">Every category of risk, in one catalogue.</h2><a class="link" href="#/products">All ${PRODUCTS.length} products ${icon('arrow-right')}</a></div>
    <div class="cats__grid">
      ${big
        .map(
          (c) => `<a class="cat" href="#/products/${c.slug}">
            <img src="${asset(`${c.face}.webp`)}" alt="" loading="lazy" />
            <span class="cat__name">${esc(c.label)}</span><span class="cat__count" data-count="${count(c.slug)}">${count(c.slug)}</span>
            <span class="cat__line">${esc(c.line)}</span></a>`,
        )
        .join('')}
    </div>
    <div class="cats__more">
      ${rest.map((c) => `<a class="cat-row" href="#/products/${c.slug}"><img src="${asset(`${c.face}.webp`)}" alt="" loading="lazy" /><span>${esc(c.label)}</span><b>${count(c.slug)}</b></a>`).join('')}
    </div>
  </section>

  <section class="maker">
    <img class="maker__bg" src="${asset('photo/plant-worker.jpg')}" alt="" loading="lazy" />
    <div class="maker__copy">
      <img src="${asset('brand/saviour.webp')}" alt="Saviour, Performing PPE" width="190" height="75" />
      <h2 class="h2 split">Our own brand, built to the Indian standard.</h2>
      <dl class="maker__facts">
        <div><dt>IS 2925:1984</dt><dd>Industrial helmets under ISI licence CM/L-7572484</dd></div>
        <div><dt>IS 2745:1983</dt><dd>Fire Pro firefighter’s helmet, tested for shock, flame and leakage current</dd></div>
        <div><dt>Bulk orders</dt><dd>Your logo printed and reflective strips fitted on Saviour helmets</dd></div>
      </dl>
    </div>
  </section>

  <section class="svc" aria-labelledby="svcTitle">
    <div class="sec-head"><h2 class="h2 split" id="svcTitle">We test the site, not just sell the kit.</h2><a class="link" href="#/services">All services ${icon('arrow-right')}</a></div>
    <div class="svc__body">
      <div class="svc__tabs" role="tablist" aria-label="Services">${SERVICES.map((s, i) => `<button role="tab" type="button" data-svc="${s.id}" aria-selected="${i === 0}"><b>${esc(s.title)}</b><small>${esc(s.line)}</small></button>`).join('')}</div>
      <div class="svc__panel" id="svcPanel"></div>
    </div>
  </section>

  <section class="trust" aria-label="Industries and clients">
    <div class="marquee"><ul>${[...INDUSTRIES, ...INDUSTRIES].map((x, i) => `<li${i >= INDUSTRIES.length ? ' aria-hidden="true"' : ''}>${esc(x)}</li>`).join('')}</ul></div>
    <p class="trust__clients"><span>Trusted at</span> ${COMPANY.clients.map((c) => `<b>${esc(c)}</b>`).join('')}</p>
  </section>

  <section class="cta">
    <div>
      <h2 class="h2 split">Send us your PPE list. We’ll quote it.</h2>
      <p>Add products as you browse, or describe what you need. The sales team prices every order by model, quantity and branding.</p>
    </div>
    <div class="cta__actions">
      <button class="btn btn--dark btn--lg" type="button" data-quote-open>${icon('clipboard-text')} Open quote list</button>
      <button class="btn btn--light btn--lg" type="button" data-whatsapp>${icon('whatsapp-logo')} Chat on WhatsApp</button>
    </div>
  </section>`
}

export const spotInfo = (p) => `
  <p class="spot__sku">${esc(p.sku)}</p>
  <h2 class="spot__name">${esc(p.name)}</h2>
  <div class="spot__std">${(p.standards ?? []).map((s) => `<span class="std std--dark">${esc(s)}</span>`).join('')}</div>
  <p class="spot__sum">${esc(p.summary)}</p>
  ${p.specs ? `<dl class="spot__specs">${['Material', 'Ventilation holes', 'Suspension', 'Size', 'Weight'].filter((k) => p.specs[k]).slice(0, 4).map((k) => `<div><dt>${k}</dt><dd>${esc(p.specs[k])}</dd></div>`).join('')}</dl>` : ''}
  <div class="spot__actions">
    <a class="btn btn--primary" href="#/product/${p.slug}">View ${esc(p.name)} ${icon('arrow-right')}</a>
    <button class="btn btn--ghost-dark" type="button" data-add="${p.slug}">${icon('plus')} Add to quote</button>
  </div>`

export const svcPanel = (s) => `
  <figure class="svc__photo"><img src="${asset(`photo/${s.photo}.jpg`)}" alt="" /></figure>
  <div class="svc__list"><h3>${esc(s.title)}</h3><ul>${s.items.map((i) => `<li>${icon('check')}${esc(i)}</li>`).join('')}</ul>
  <button class="btn btn--primary" type="button" data-assist="I'd like to book ${esc(s.title.toLowerCase())} for my site">Book a site visit ${icon('arrow-right')}</button></div>`

/* -------------------------------------------------------------- products */
export function products(cat) {
  const c = cat ? categoryBy[cat] : null
  const list = c ? inCategory(cat) : PRODUCTS.filter((p, i) => PRODUCTS.findIndex((x) => x.name === p.name) === i)
  return `
  <section class="catalog">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${icon('caret-right')}${c ? `<a href="#/products">Products</a>${icon('caret-right')}<span>${esc(c.label)}</span>` : '<span>Products</span>'}</nav>
    <div class="catalog__head">
      <div><h1 class="h1">${c ? `${esc(c.label)} protection` : 'All products'}</h1><p class="lede">${c ? esc(c.line) : `${list.length} products across ${CATEGORIES.length} categories.`}</p></div>
      <label class="filter">${icon('magnifying-glass')}<input type="search" id="filter" placeholder="Filter by name or model" aria-label="Filter products" autocomplete="off" /></label>
    </div>
    <div class="catalog__body">
      <aside class="catalog__side" aria-label="Categories">
        <a href="#/products" class="side-link${c ? '' : ' is-on'}">All products<b>${PRODUCTS.length}</b></a>
        ${CATEGORIES.map((x) => `<a href="#/products/${x.slug}" class="side-link${x.slug === cat ? ' is-on' : ''}">${esc(x.label)}<b>${inCategory(x.slug).length}</b></a>`).join('')}
      </aside>
      <div>
        <p class="catalog__count" id="filterCount" aria-live="polite">${list.length} products</p>
        <div class="grid" id="catalogGrid">${list.map((p, i) => productCard(p, { lazy: i > 7 })).join('')}</div>
        <div class="empty" id="filterEmpty" hidden>
          ${icon('magnifying-glass')}<p><b>Nothing matches that here.</b>Try a shorter word, or ask Sure Assist to search the full range.</p>
          <button class="btn btn--ghost" type="button" data-assist-filter>Ask Sure Assist</button>
        </div>
      </div>
    </div>
  </section>`
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
    <h1 class="h1">Consulting, testing and training.</h1>
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
