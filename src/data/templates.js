/**
 * Website templates shown on /services/websites. (Templates)
 *
 * Each one is a complete, working page a visitor can open full screen at
 * /services/websites/templates/<slug>, then ask for a demo built on it, or a
 * demo redesign of their own site, through /book-a-demo.
 *
 * The pages themselves live in templates/<slug>/ and are built by Vite as
 * standalone entries (see vite.config.js), served at /templates/<slug>/.
 * Kept free of imports so /api/demo.js can load the same list the form shows.
 *
 * Shape — WebsiteTemplate {
 *   slug        URL segment, folder name and the value the demo form submits
 *   name        display name
 *   style       one-line description of the look, shown on the tile
 *   summary     one sentence, under 130 characters, shown over the tile on hover
 *   bestFor[]   kinds of business it suits, as idea-starters
 *   thumbnail   still image for the tile, in public/templates/
 *   chrome      look of the preview dock, so it sits well on the template:
 *               'dark' | 'paper' | 'light'
 * }
 */
export const websiteTemplates = [
  {
    slug: 'verdant',
    name: 'Verdant',
    style: 'Immersive 3D landing page',
    summary:
      'A living 3D scene grows behind a calm editorial hero: roots, moss and flowers unfold, and a butterfly drifts in to land.',
    bestFor: ['Sustainability and eco brands', 'Landscape and architecture studios', 'Wellness and retreats', 'Premium products'],
    thumbnail: '/templates/verdant.jpg',
    chrome: 'dark',
  },
  {
    slug: 'folio',
    name: 'Folio',
    style: 'Interactive sketchbook portfolio',
    summary:
      'A portfolio you leaf through like a real sketchbook: turn the pages, slide a magnifier over the work, zoom into the detail.',
    bestFor: ['Artists and illustrators', 'Architects and designers', 'Photographers', 'Travel and hospitality'],
    thumbnail: '/templates/folio.jpg',
    chrome: 'paper',
  },
  {
    slug: 'clarity',
    name: 'Clarity',
    style: 'Clinic and practice website',
    summary:
      'A calm, plainly written site for a clinic or practice: services, team, reviews, first visit, fees, questions and booking.',
    bestFor: ['Dental and medical clinics', 'Physiotherapy and wellness', 'Law and accounting firms', 'Consultants'],
    thumbnail: '/templates/clarity.jpg',
    chrome: 'light',
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    style: 'Interactive 3D real estate',
    summary:
      'A tower you can explore in 3D: hover any floor for what is on it, open its plan, and relight the scene for day, dusk or night.',
    bestFor: ['Real estate developers', 'Property consultants', 'Hotels and serviced apartments', 'Architects'],
    thumbnail: '/templates/meridian.jpg',
    chrome: 'light',
  },
  {
    slug: 'orchard',
    name: 'Orchard',
    style: 'Fresh food and drink brand',
    summary:
      'A crisp brand site for a juice or food label: 3D bottles you can spin, a story that fills in as you scroll, and a flavour carousel.',
    bestFor: ['Juice and beverage brands', 'Organic and health food', 'Cafes and bakeries', 'D2C products'],
    thumbnail: '/templates/orchard.jpg',
    chrome: 'light',
  },
  {
    slug: 'poise',
    name: 'Poise',
    style: 'Animated product shop',
    summary:
      'A warm, minimal store for dental seating and accessories: an arch that opens into a 3D hero, a category explorer and a cart.',
    bestFor: ['Equipment manufacturers', 'Furniture and decor', 'Medical and dental supply', 'Premium D2C brands'],
    thumbnail: '/templates/poise.jpg',
    chrome: 'light',
  },
  {
    slug: 'foundry',
    name: 'Foundry',
    style: 'Manufacturer portfolio',
    summary:
      'A premium site for a maker: a cinematic photo hero, the product range, and an animated production line from raw steel to dispatch.',
    bestFor: ['Equipment manufacturers', 'Industrial and engineering firms', 'Medical device makers', 'Exporters and OEMs'],
    thumbnail: '/templates/foundry.jpg',
    chrome: 'dark',
  },
]

export const getTemplate = (slug) => websiteTemplates.find((t) => t.slug === slug) ?? null

/** Where a template's preview page lives on the site. */
export const templatePath = (slug) => `/services/websites/templates/${slug}`

/** Where the template itself is served (its own standalone page). */
export const templateSource = (slug) => `/templates/${slug}/`
