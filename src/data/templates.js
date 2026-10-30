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
 *   home        optional service slug for working demos (bots, tools) rather
 *               than websites: they live in that service's gallery and are
 *               left out of the all-templates one on /services/websites
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
  {
    slug: 'aurum',
    name: 'Arden',
    style: 'Premium product portfolio',
    summary:
      'A single-page showcase with real product photography, rooms coloured to match each finish, and a blueprint that draws the product.',
    bestFor: ['Medical and dental equipment', 'Luxury furniture', 'Product design studios', 'Premium manufacturers'],
    thumbnail: '/templates/aurum.jpg',
    chrome: 'light',
  },
  {
    slug: 'enamel',
    name: 'Enamel',
    style: 'Premium dental clinic',
    summary:
      'A dark, polished clinic site built around a live tooth chart: tap any tooth to see its treatment, then book a slot in seconds.',
    bestFor: ['Dental clinics and smile studios', 'Orthodontists and implant centres', 'Cosmetic and skin clinics', 'Specialist practices'],
    thumbnail: '/templates/enamel.jpg',
    chrome: 'dark',
  },
  {
    slug: 'ivory',
    name: 'Ivory',
    style: 'Cinematic implant studio',
    summary:
      'A film you scroll: a 3D implant assembles root, connector and crown, then a before and after slider and a doctor-led story.',
    bestFor: ['Implant and cosmetic dental clinics', 'Smile design studios', 'Specialist surgeons', 'Premium medical practices'],
    thumbnail: '/templates/ivory.jpg',
    chrome: 'dark',
  },
  {
    slug: 'taanka',
    name: 'Taanka',
    style: 'Streetwear fashion store',
    summary:
      'A full shop: tap-to-shuffle hero, quick-add sizes, shop-the-look hotspots, a live embroidery customiser, bag and wishlist.',
    bestFor: ['Streetwear and apparel brands', 'Print-on-demand stores', 'Custom embroidery studios', 'D2C fashion labels'],
    thumbnail: '/templates/taanka.jpg',
    chrome: 'light',
  },
  {
    slug: 'concierge',
    name: 'Concierge',
    style: 'Website chat assistant',
    summary:
      'A chat assistant trained on a business’s FAQs: answers with its source, turns unknown questions into leads, learns new answers.',
    bestFor: ['Clinics and studios', 'Coworking and hospitality', 'Local service businesses', 'Any site with repeat questions'],
    thumbnail: '/templates/concierge.jpg',
    chrome: 'dark',
    home: 'ai-automation',
  },
  {
    slug: 'tadka',
    name: 'Tadka',
    style: 'Chat ordering bot',
    summary:
      'Customers order and pay in a chat, typed or tapped, and every order lands on a live kitchen screen with status updates.',
    bestFor: ['Restaurants and cloud kitchens', 'Cafés and bakeries', 'Grocery and local stores', 'Takeaway and delivery'],
    thumbnail: '/templates/tadka.jpg',
    chrome: 'dark',
    home: 'ai-automation',
  },
  {
    slug: 'kagaz',
    name: 'Kagaz',
    style: 'Receipt and invoice reader',
    summary:
      'Drop in a bill and the fields fill themselves, with confidence scores and a totals check, then export it all to a spreadsheet.',
    bestFor: ['Accounts and finance teams', 'Expense claims', 'Purchase and supplier bills', 'Small business bookkeeping'],
    thumbnail: '/templates/kagaz.jpg',
    chrome: 'paper',
    home: 'ai-automation',
  },
  {
    slug: 'pigeonhole',
    name: 'Pigeonhole',
    style: 'Lead triage inbox',
    summary:
      'Enquiries are sorted by urgency and type as they arrive, with the reasons shown and a suggested reply ready to send.',
    bestFor: ['Agencies and studios', 'Home services', 'Sales and support inboxes', 'Any business with a contact form'],
    thumbnail: '/templates/pigeonhole.jpg',
    chrome: 'light',
    home: 'ai-automation',
  },
  {
    slug: 'sehat',
    name: 'Sehat',
    style: 'Clinic booking portal',
    summary:
      'Patients book a slot, the front desk runs the day on a calendar, and doctors call patients in from a live queue.',
    bestFor: ['Clinics and polyclinics', 'Dental and physio practices', 'Diagnostic centres', 'Any appointment-led practice'],
    thumbnail: '/templates/sehat.jpg',
    chrome: 'light',
    home: 'web-applications',
  },
  {
    slug: 'kaarigar',
    name: 'Kaarigar',
    style: 'Field-service job tracker',
    summary:
      'A jobs board and live map for the office, a phone app for technicians with photo proof and signatures, and invoice status.',
    bestFor: ['Home services and repairs', 'AC and appliance servicing', 'Facility maintenance', 'Installation teams'],
    thumbnail: '/templates/kaarigar.jpg',
    chrome: 'light',
    home: 'web-applications',
  },
  {
    slug: 'sanjha',
    name: 'Sanjha',
    style: 'Client portal',
    summary:
      'One place for a client project: a live timeline, approvals that move it forward, shared files and messages.',
    bestFor: ['Design and marketing agencies', 'Architects and interior studios', 'Consultancies', 'Construction projects'],
    thumbnail: '/templates/sanjha.jpg',
    chrome: 'paper',
    home: 'web-applications',
  },
  {
    slug: 'godown',
    name: 'Godown',
    style: 'Inventory and orders manager',
    summary:
      'Live stock for a small factory: orders reserve and ship, shortfalls become production runs, low stock raises a PO.',
    bestFor: ['Small manufacturers', 'Wholesalers and distributors', 'Traders with a warehouse', 'D2C brands holding stock'],
    thumbnail: '/templates/godown.jpg',
    chrome: 'light',
    home: 'web-applications',
  },
]

export const getTemplate = (slug) => websiteTemplates.find((t) => t.slug === slug) ?? null

/** The website templates proper, for the all-templates gallery and style choices. */
export const siteTemplates = websiteTemplates.filter((t) => !t.home)

/** The service page whose gallery a template belongs to. */
export const templateHome = (slug) => getTemplate(slug)?.home ?? 'websites'

/** Where a template's preview page lives on the site. */
export const templatePath = (slug) => `/services/${templateHome(slug)}/templates/${slug}`
export const templateRoute = '/services/:service/templates/:slug'

/** Where the template itself is served (its own standalone page). */
export const templateSource = (slug) => `/templates/${slug}/`
