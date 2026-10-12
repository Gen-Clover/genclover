/**
 * Full detail for the products whose datasheets were available: every value here is
 * taken from Sure Safety's own product pages and Saviour datasheets. Products not
 * listed show their name, category and image, and offer a datasheet on request.
 *
 * gallery[]: { img, label, swatch? }: images in assets/g/. An entry with a swatch is
 * a colourway the configurator can switch to.
 */
const HEAD_APPS = ['Industrial facilities', 'Manufacturing plants', 'Warehouses', 'Maintenance and repair', 'Utility and infrastructure work', 'Foundries, furnaces and kilns', 'Construction']
const HELMET_ACCESSORIES = ['universal-face-shield', 'series-2-safety-eyewear', 'helmet-mounted-ear-muffs-universal']
const BULK = { Logo: 'Logo printing and branding for bulk orders', 'Reflective strips': 'Available for bulk orders' }

export const DETAILS = {
  freedom: {
    sku: 'HPSAV-F-SS1',
    sub: 'Industrial safety',
    standards: ['IS 2925:1984', 'CM/L-7572484', 'EN 397:2012 + A1:2012'],
    summary:
      'A ventilated industrial helmet for manufacturing floors of any size. Ventilation holes placed along the crown carry heat away during long shifts, so it stays comfortable without giving up protection.',
    variants: [
      { name: 'Freedom with ratchet, HDPE', sku: 'HPSAV-FR-SS1' },
      { name: 'Freedom with ratchet, ABS', sku: 'HPSAV-FR-ABS' },
    ],
    gallery: [
      { img: 'freedom-1', label: 'Orange', swatch: '#e2522b' },
      { img: 'freedom-007', label: 'Yellow', swatch: '#e9c43b' },
      { img: 'freedom-hdpa-2', label: 'Blue', swatch: '#2f5fc4' },
      { img: 'freedom-05', label: 'Green', swatch: '#1f9a54' },
      { img: 'freedom-010', label: 'Grey', swatch: '#7d8a9a' },
      { img: 'freedom-06-1', label: 'Lavender', swatch: '#8f8fe0' },
      { img: 'freedom-08', label: 'Front' },
      { img: 'freedom-4-1', label: 'Ratchet' },
      { img: 'freedom-2-6', label: 'Suspension' },
    ],
    features: ['Ventilation holes along the crown', 'Ratchet or pin-lock headband', 'Universal slots for visors and ear muffs'],
    applications: HEAD_APPS,
    accessories: HELMET_ACCESSORIES,
  },

  wind: {
    sku: 'HPSAV-WVR',
    sub: 'Industrial safety',
    standards: ['IS 2925:1984', 'CM/L-7572484', 'EN 397:2012'],
    summary:
      'Complete head protection with a special brim structure and six-point ventilation. Accessories clip into the universal slot without drilling the shell.',
    specs: {
      Material: 'HDPE',
      Size: '520 to 600 mm',
      Ratchet: 'Yes',
      'Ventilation holes': '6',
      Suspension: '4-point polymer',
      'Chin strap': 'With chin cup',
      'Sweat band': 'Soft PU',
      Colours: 'White, blue, yellow, red, green, orange',
      ...BULK,
    },
    gallery: [
      { img: 'wind-1-1', label: 'Red', swatch: '#d83a2e' },
      { img: 'wind-5', label: 'Blue', swatch: '#2b78d8' },
      { img: 'wind-7', label: 'Orange', swatch: '#b8673e' },
      { img: 'wind-4', label: 'Ratchet' },
      { img: 'wind-6-1', label: 'Top' },
      { img: 'wind-9', label: 'Suspension' },
    ],
    features: [
      'Ergonomic brim for comfort',
      '6-point ventilation ports reduce heat build-up',
      'High-impact shell and foam',
      'Adjustable chin strap and headband',
      'Universal slot for accessories, no drilling',
      'Soft sweatband that absorbs sweat',
    ],
    applications: [...HEAD_APPS, 'High-heat areas: erection, commissioning, fabrication, pipeline laying'],
    accessories: ['universal-face-shield', 'series-2-safety-eyewear'],
  },

  vento: {
    sku: 'HPSAV-VEV-R',
    sub: 'Industrial safety',
    standards: ['IS 2925:1984', 'CM/L-7572484'],
    summary:
      'An aerodynamic helmet with ten ventilation holes, shock-absorbing foam and an optional visor. Made in ABS or HDPE, with ratchet or pin-lock fitting.',
    specs: {
      Material: 'ABS or HDPE',
      Size: '520 to 600 mm',
      Ratchet: 'Yes',
      'Ventilation holes': '10',
      Suspension: '4-point polymer',
      'Chin strap': 'With chin cup',
      'Sweat band': 'Soft PU',
      Colours: 'White, blue, yellow, red, green, orange',
      ...BULK,
    },
    variants: [
      { name: 'Vento ventilated, ABS, ratchet', sku: 'HPSAV-VEV-ABS-R' },
      { name: 'Vento ventilated, HDPE, ratchet', sku: 'HPSAV-VEV-R' },
      { name: 'Vento ventilated, ABS', sku: 'HPSAV-VEV-ABS' },
      { name: 'Vento ventilated, HDPE', sku: 'HPSAV-VEV' },
      { name: 'Vento non-ventilated', sku: 'HPSAV-VH' },
    ],
    gallery: [
      { img: 'vento-1-1', label: 'Yellow', swatch: '#e9c43b' },
      { img: 'vento-3-2', label: 'Red', swatch: '#b7322b' },
      { img: 'vento-7', label: 'Violet', swatch: '#5d4f9c' },
      { img: 'vento-8-1', label: 'White', swatch: '#eef0f3' },
      { img: 'vento-4-3', label: 'Ratchet' },
      { img: 'vento-9', label: 'Suspension' },
    ],
    features: [
      'Ten ventilation holes for heat dissipation',
      'High-impact shell with shock-absorbing foam',
      'Takes an optional visor',
      'Aerodynamic, lightweight build',
      'Soft sweatband and adjustable chin strap',
    ],
    applications: ['Construction sites', ...HEAD_APPS],
    care: ['Clean with mild soap and water', 'Inspect regularly for wear or damage', 'Store cool and dry, away from direct sunlight'],
    accessories: HELMET_ACCESSORIES,
  },

  'tough-hat': {
    sku: 'HPSAV-TH',
    sub: 'Industrial safety',
    standards: ['IS 2925:1984', 'CM/L-7572484'],
    summary:
      'A durable everyday helmet for inspection, design, fieldwork and workshop tasks, built for complete head protection with the wearer’s comfort in mind.',
    variants: [
      { name: 'Tough Hat', sku: 'HPSAV-TH' },
      { name: 'Tough Hat with ratchet', sku: 'HPSAV-THRW' },
    ],
    gallery: [
      { img: 'tough-hat-1', label: 'Yellow', swatch: '#e9c43b' },
      { img: 'tough-hat-4-1', label: 'Red', swatch: '#c8302b' },
      { img: 'tough-hat-8', label: 'Blue', swatch: '#2440b8' },
      { img: 'tough-hat-10', label: 'Green', swatch: '#1f9a54' },
      { img: 'tough-hat-11', label: 'Sky', swatch: '#8fc3ec' },
      { img: 'tough-hat-9', label: 'Ratchet' },
      { img: 'tough-hat-7-4', label: 'Suspension' },
    ],
    applications: ['Inspection', 'Design and fieldwork', 'Workshops', ...HEAD_APPS.slice(0, 3)],
    accessories: HELMET_ACCESSORIES,
  },

  'electrical-helmet': {
    sku: 'HPSAVVARC-EH',
    sub: 'Electrical',
    standards: ['IS 2925:1984', 'CM/L-7572484', 'EN 397:2012'],
    summary:
      'Engineered for a high level of protection from electrical shock near live lines and in stringent electrical work areas. A short peak keeps wide-angle vision clear.',
    specs: {
      Material: 'HDPE',
      Suspension: '6-point, nylon',
      Weight: '325 g (approx.)',
      Size: '520 to 600 mm',
      'Sweat band': 'Soft PU',
      'Chin strap': '19 mm, adjustable, chin cup optional',
      'Nape strap': 'Lower extension prevents dislodging',
      Colours: 'Fluorescent yellow-green, orange-red, red',
    },
    gallery: [
      { img: 'elect-1', label: 'Side' },
      { img: 'elect-3', label: 'Front' },
      { img: 'elect-4', label: 'Rear' },
      { img: 'elect-2', label: 'Suspension' },
    ],
    features: [
      'High-voltage withstand capability',
      '6-point suspension for an even fit',
      'Universal slots for ear muffs and face shields',
      'Chemical splash goggles clip on without drilling',
    ],
    applications: ['Electrical substations', 'Power generation plants', 'Engineering workshops', 'Maintenance and operations', 'Inspection and surveillance'],
    accessories: HELMET_ACCESSORIES,
  },

  'fire-man-helmet-fire-pro': {
    sku: 'HPSAV-FM',
    sub: 'Fire',
    standards: ['IS 2745:1983', 'CM/L-7100128695'],
    summary: 'Head protection for firefighting and rescue, built entirely from non-metallic materials, with a neck protector and an optional heat-resistant visor.',
    specs: {
      Shell: 'Non-metallic, fire-resistant, high impact resistance',
      Padding: 'Expanded polystyrene or equivalent',
      'Neck protector': 'PVC-coated fabric or leather',
      Visor: 'Transparent, heat-resistant (optional)',
      'Headband size': '570 mm (±3 mm)',
      'Mass without visor': '≤ 800 g',
      'Shock absorption': 'Peak transmitted force ≤ 20 kN',
      Penetration: '≤ 10 mm',
      'Retention system': 'No failure up to 0.5 kN',
      'Electrical resistance': 'Leakage current ≤ 3 mA',
      Flammability: 'No continuous flaming or inside penetration',
    },
    gallery: [
      { img: 'fire-1', label: 'Front' },
      { img: 'fire-2', label: 'Side' },
    ],
    applications: ['Municipal fire and rescue services', 'Industrial fire brigades', 'Civil defence and disaster response', 'Aviation and refinery firefighting'],
  },

  'pab-fire-helmet': {
    sku: 'HP-PAB',
    sub: 'Fire',
    standards: ['EN 443'],
    summary: 'A compact firefighter’s helmet that gives complete head protection while staying comfortable through long call-outs.',
    gallery: [{ img: 'pab-helmet-1', label: 'Side' }],
    applications: ['Firefighting'],
  },

  'bump-cap': {
    sku: 'HPSAV-CBC',
    sub: 'Bump cap',
    summary:
      'A light, compact cap in virgin-grade PP that guards against knocks and small falling objects such as nuts and bolts, with ventilation holes on both sides.',
    specs: { Material: 'Virgin-grade PP', Ventilation: 'Holes on both sides of the shell' },
    gallery: [
      { img: 'bump-cap', label: 'Black', swatch: '#24262a' },
      { img: 'bump-cap-2', label: 'White', swatch: '#eef0f3' },
    ],
  },
}

// listings that are the same helmet under a second name share its detail
DETAILS['tough-hat-helmet'] = DETAILS['tough-hat']
DETAILS['electrical-helmet-2'] = DETAILS['electrical-helmet']
DETAILS['industrial-bump-cap'] = DETAILS['bump-cap']
DETAILS['cap-bump-cap'] = { ...DETAILS['bump-cap'], gallery: [{ img: 'bump-cap-1', label: 'Black', swatch: '#24262a' }] }
DETAILS['vento-helmet-non-ventilated'] = {
  ...DETAILS.vento,
  sku: 'HPSAV-VH',
  summary: 'The Vento helmet in a closed shell, without ventilation holes.',
  variants: undefined,
  gallery: [{ img: 'non-vento-1', label: 'Side' }],
}
