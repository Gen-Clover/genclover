/**
 * The company, its categories, services and the hazard finder. Facts come from
 * suresafety.com; nothing here is invented beyond the grouping of products by hazard.
 */
import { PRODUCT_ROWS } from './catalog.js'
import { DETAILS } from './details.js'

export const COMPANY = {
  name: 'Sure Safety',
  legal: 'Sure Safety (India) Limited',
  tagline: 'Complete Safety Solutions',
  brand: 'Saviour',
  brandLine: 'Performing PPE',
  address: ['Plot 42, beside Zenith Tin, NH 8', 'Yoginagar Township, Chhani', 'Vadodara, Gujarat 391740'],
  phones: ['+91 96625 22138', '+91 72290 79494'],
  whatsapp: '+91 96625 22138',
  email: 'marketing@suresafety.com',
  distributes: ['3M', 'Honeywell', 'Ansell', 'BATA', 'Respirex', 'Pelican', 'Demron'],
  clients: ['Vedanta Aluminium & Power', 'ESL Steel', 'Lodha Group', 'Deccan Fine Chemicals', 'CFCL'],
}

/** [slug, label, one line, cut-out or catalogue image used as its face] */
export const CATEGORIES = [
  ['head-protection', 'Head', 'ISI-marked helmets, fire helmets and bump caps', 'cut/freedom'],
  ['eye-protection', 'Eye', 'Safety eyewear, goggles and prescription frames', 'cut/series-2-safety-eyewear'],
  ['face-protection', 'Face', 'Face shields, visors and auto-darkening welding helmets', 'cut/fg-10-face-shield'],
  ['ear-protection', 'Ear', 'Earplugs, ear muffs and dispensers', 'cut/foldable-earmuffs'],
  ['respiratory-protection', 'Respiratory', 'Masks, SCBA, escape sets and supplied-air systems', 'cut/air-full-face-mask'],
  ['hand-protection', 'Hand', 'Cut, chemical, electrical and heat-resistant gloves', 'cut/chem-pro-gloves'],
  ['body-protection', 'Body', 'Chemical, arc-flash, aluminized and FR suits', 'cut/aluminized-suit-als-4'],
  ['feet-protection', 'Feet', 'Safety shoes, dielectric boots and gumboots', 'cut/lion'],
  ['fall-protection', 'Fall', 'Harnesses, fall arrestors, tripods and lifelines', 'cut/t-560-safety-rescue-harness-with-trauma-strap'],
  ['electrical-safety', 'Electrical', 'Arc kits, insulating gloves, mats and earthing', 'cut/class-0-electrical-hand-gloves-5000-v0-g'],
  ['fire-protection', 'Fire', 'Water mist systems, EV fire suppression, FR coatings', 'p/water-mist-system-50l'],
  ['gas-protection', 'Gas', 'Portable gas detectors', 'p/gas-advanced-compact-inbuilt-pump'],
  ['ventilation', 'Ventilation', 'Fume exhausters and air blowers', 'p/fume-exhauster-cum-air-blower'],
  ['chemical-splash', 'Chemical splash', 'Eyewash and safety shower stations', 'p/portable-combination-eyewash-shower'],
  ['chlorine-safety', 'Chlorine', 'Chlorine emergency kits', 'p/chlorine-kit-100-kg'],
  ['performance-fabric', 'Performance fabric', 'Welding, fire and EV fire blankets', 'p/fire-blanket'],
  ['rescue', 'Rescue', 'Rescue boats, shelters and line throwers', 'p/inflatable-rescue-boat'],
  ['flash-light', 'Lighting', 'Safety-approved torches, headlamps and area lights', 'p/2755-led-headlight'],
  ['road-safety', 'Road safety', 'Reflective jackets and traffic cones', 'p/reflective-safety-jacket-rj2'],
  ['wind-indicator', 'Wind indicator', 'Wind socks and illuminated indicators', 'p/wind-indicator-with-stand-cage-and-light'],
].map(([slug, label, line, face]) => ({ slug, label, line, face }))

export const categoryBy = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]))

export const PRODUCTS = PRODUCT_ROWS.map(([slug, name, cat, brand]) => ({ slug, name, cat, brand, ...(DETAILS[slug] ?? {}) }))
export const productBy = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]))
export const inCategory = (cat) => PRODUCTS.filter((p) => p.cat === cat)

/** Hazards a buyer starts from, each with the products that answer it. */
export const HAZARDS = [
  {
    id: 'heat',
    label: 'Heat & molten metal',
    icon: 'fire',
    line: 'Furnaces, foundries and radiant heat',
    products: ['aluminized-suit-als-4', 'aluminized-aramid-5-layer-suit-als-5', 'molten-metal-protection-suit-d3', 'heatstar-aluminized-aramide-gloves', 'gold-visor', 'heat-shield-gloves', 'fire-entry-suit-close-proximity', 'aluminized-gloves'],
  },
  {
    id: 'electrical',
    label: 'Electrical & arc flash',
    icon: 'lightning',
    line: 'Live lines, switchgear and substations',
    products: ['electrical-helmet', '40-cal-arc-kit', 'class-2-electrical-hand-gloves-20000-v-2-g', '40-cal-arc-face-shield', '12-cal-arc-coverall', 'insulating-rubber-mats', 'electrical-shoes', 'earthing-rod'],
  },
  {
    id: 'chemical',
    label: 'Chemicals',
    icon: 'flask',
    line: 'Splash, vapour and corrosive handling',
    products: ['chemguard-plus', 'seam-shield-chemguard-suit', 'chem-pro-gloves', 'neochem-x-96', 'chemi-splash-goggles', 'portable-combination-eyewash-shower', 'respirex-prps', 'kemblock-gloves'],
  },
  {
    id: 'height',
    label: 'Work at height',
    icon: 'ruler',
    line: 'Scaffolds, towers and confined space entry',
    products: ['t-560-safety-rescue-harness-with-trauma-strap', 't-110-safety-belt-with-double-lanyard-with-polyamide-scafforld-hook-shock-absorber', 'fall-arrestor-blocks', 'tripod-with-winch', 'davit-system', 'safety-net-double-layer', 'horizontal', 'vertical'],
  },
  {
    id: 'air',
    label: 'Dust, fumes & gas',
    icon: 'wind',
    line: 'Particulates, welding fumes and toxic gas',
    products: ['tiger-ffp-1-mask-with-valve', 'tiger-p2-mask', 'air-full-face-mask', 'scba-pro', 'emergency-escape-breathing-device-eebd', 'gas-advanced-compact-inbuilt-pump', 'advanced-gas-detector', 'fume-exhauster-cum-air-blower'],
  },
  {
    id: 'noise',
    label: 'Noise',
    icon: 'ear',
    line: 'Compressors, presses and plant rooms',
    products: ['helmet-mounted-ear-muffs-universal', 'foldable-earmuffs', 'corded-foam-earplugs', 'safe-fit-reusable-ear-plugs', 'ear-plug-dispensor'],
  },
  {
    id: 'fire',
    label: 'Fire emergency',
    icon: 'first-aid',
    line: 'Fire teams, EV batteries and escape',
    products: ['fire-man-helmet-fire-pro', 'water-mist-system-50l', 'rapid-fire-fighting-emergency-bike', 'spider-ev-fire-suppression-system', 'ev-fire-blanket', 'fire-blanket', 'scba-class-1', 'pab-fire-helmet'],
  },
  {
    id: 'impact',
    label: 'Cuts & impact',
    icon: 'hard-hat',
    line: 'Sheet metal, glass and falling objects',
    products: ['freedom', 'black-pu-coated-on-hppe-liner-gloves-cut-5', 'grey-pu-coated-cut-resistance-gloves-cut-5', 'cut-guard-gloves', 'impact-gloves', 'armour-sleeves-18', 'lion', 'series-2-safety-eyewear'],
  },
]

/** What the consulting arm does, in their words, grouped. */
export const SERVICES = [
  {
    id: 'hygiene',
    title: 'Industrial hygiene',
    line: 'Measured exposure, from an AIHA and NABL accredited team with 15+ years in the field.',
    items: ['Industrial hygiene studies', 'Noise mapping and assessment', 'Heat stress assessment', 'Indoor air quality monitoring', 'API and surrogate monitoring', 'Form 37 and 26-A monitoring'],
    photo: 'refinery',
  },
  {
    id: 'audits',
    title: 'Safety and fire audits',
    line: 'Independent audits against the standard, with a clear list of what to fix.',
    items: ['Fire audits', 'HAZOP studies', 'Safety audits to IS 14489', 'PPE audits', 'Ergonomics assessment'],
    photo: 'ducts',
  },
  {
    id: 'fit',
    title: 'Respiratory fit testing',
    line: 'Qualitative and quantitative fit testing to OSHA and MSHA methods, on your site.',
    items: ['Qualitative fit testing', 'Quantitative fit testing', 'Fit testing programmes'],
    photo: 'plant-worker',
  },
  {
    id: 'training',
    title: 'Training',
    line: 'HSE and NEBOSH training for supervisors and site teams.',
    items: ['NEBOSH courses', 'HSE training', 'Hazard management'],
    photo: 'engineer',
  },
  {
    id: 'systems',
    title: 'Fire and fall systems',
    line: 'Designed, supplied and installed: water mist and EV fire suppression, lifelines and davits.',
    items: ['Fire protection systems', 'Horizontal and vertical lifelines', 'Davit and tripod rescue'],
    photo: 'welders',
  },
]

export const INDUSTRIES = ['Pharmaceuticals', 'Steel', 'Aluminium & power', 'Chemicals', 'Petroleum', 'Cement', 'Automotive', 'Mining', 'Construction', 'Paint', 'Manufacturing', 'Hospitals']

/** The 35 client logos shown on suresafety.com, in assets/clients/c1..c35.webp. */
export const CLIENT_LOGOS = [
  'Reliance Industries', 'Unilever', 'INEOS Styrolution', 'ABB', 'Siemens', 'Asian Paints', 'Essar', 'Hindalco', 'Larsen & Toubro',
  'GACL', 'Tata', 'ArcelorMittal', 'GE', 'Alstom', 'Castrol', 'Kosa Chemicals', 'Vedanta', 'Godrej', 'GSFC', 'Alembic',
  'Sun Pharma', 'Chambal Fertilisers', 'SRF', 'Adani', 'Hindustan Zinc', 'Dorf Ketal', 'Nestlé', 'Cummins India', 'Aarti Industries',
  'Vedanta Resources', 'Coromandel', 'Hindustan Coca-Cola Beverages', 'GMSC', 'Deepak Nitrite', 'Gallantt',
].map((name, i) => ({ name, img: `clients/c${i + 1}.webp` }))

/** Short excerpts of the testimonials published on suresafety.com. */
export const TESTIMONIALS = [
  { quote: 'Their rescue team developed rescue plans and was available round the clock during the shutdown, building confidence across the workforce at height and in confined spaces.', who: 'Jeevan Mahadik', role: 'Head Safety' },
  { quote: 'Through the nine-day scaffolding inspection training, our employees benefited a great deal, and we are constantly improving scaffolding activities in our plant.', who: 'Head of Department, HSE', role: 'ESL Steel, Vedanta Bokaro' },
  { quote: 'Effectively provided and implemented fire fighting systems across multiple manufacturing facilities.', who: 'Vikash Patel', role: 'Director' },
  { quote: 'Supplied, installed, tested and commissioned a high velocity water spray transformer protection system at Deccan Fine Chemicals.', who: 'Supriyo Mukherjee', role: 'Manager Electrical' },
  { quote: 'The team provided training, guidance and advice to the workforce during shutdown to prevent incidents, and executed the job commendably.', who: 'Project Head', role: 'Lodha Group' },
]

/**
 * The site scan on the services chapter: where each service sits on the photo,
 * and an example reading of the kind it produces. Readings are illustrative.
 */
export const SCAN = [
  { id: 'hygiene', x: 18, y: 40, reading: 'Noise', value: 88, unit: 'dB(A)', range: [84, 93] },
  { id: 'audits', x: 44, y: 30, reading: 'Hydrant pressure', value: 7.1, unit: 'bar', range: [6.8, 7.4], dp: 1 },
  { id: 'fit', x: 54, y: 56, reading: 'Fit factor', value: 212, unit: 'pass', range: [180, 240] },
  { id: 'training', x: 30, y: 72, reading: 'Crew certified', value: 24, unit: 'of 26', range: [24, 24] },
  { id: 'systems', x: 78, y: 32, reading: 'Lifeline load', value: 12, unit: 'kN rated', range: [12, 12] },
]
