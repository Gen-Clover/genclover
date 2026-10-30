// Sample bills from made-up businesses. `conf` is the confidence the reader
// reports per field; a missing field means the bill doesn't show it.

export const DOCS = [
  {
    id: 'cafe',
    label: 'Café receipt',
    look: 'thermal',
    tilt: -4,
    vendor: 'Bean & Brick Café',
    lines: ['12 Mill Road, Pune', 'Table 6 · Server 02'],
    date: '2026-10-02',
    number: 'R-48213',
    items: [
      ['Cappuccino × 2', 360],
      ['Masala toast', 140],
    ],
    subtotal: 500,
    taxLabel: 'GST 5%',
    tax: 25,
    total: 525,
    category: 'Meals',
    conf: { vendor: 98, date: 96, number: 91, subtotal: 97, tax: 95, total: 99, category: 88 },
  },
  {
    id: 'print',
    label: 'Supplier invoice',
    look: 'invoice',
    tilt: 3,
    vendor: 'Ravel Print Co.',
    lines: ['Unit 4, Okhla Phase II, New Delhi'],
    date: '2026-09-27',
    number: 'INV-2291',
    items: [
      ['Brochure print · 500 pcs', 6000],
      ['Design proofing', 1500],
    ],
    subtotal: 7500,
    taxLabel: 'GST 18%',
    tax: 1350,
    total: 8850,
    category: 'Marketing',
    conf: { vendor: 99, date: 98, number: 99, subtotal: 98, tax: 97, total: 99, category: 82 },
  },
  {
    id: 'fuel',
    label: 'Faded fuel slip',
    look: 'slip',
    tilt: -2,
    vendor: 'Highway Fuels',
    lines: ['NH48 · Pump 3'],
    date: '2026-10-11',
    number: 'TXN 0071',
    items: [['Diesel · 24.6 L', 2400]],
    total: 2400,
    category: 'Travel',
    faded: ['date'],
    conf: { vendor: 93, date: 61, number: 74, total: 96, category: 90 },
  },
]

export const CATEGORIES = ['Meals', 'Marketing', 'Travel', 'Office supplies', 'Software', 'Other']
