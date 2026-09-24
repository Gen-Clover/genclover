import { industries as industryTaxonomy } from './taxonomy'

/**
 * Industry landing content. (Spec §13)
 *
 * These pages are intentionally lightweight: relevant capabilities plus any
 * related concept work. They must NOT contain invented client claims, logos or
 * sector statistics. Where we have nothing verified to say, we say less.
 *
 * Keyed by the industry ids in taxonomy.js — the taxonomy stays the source of
 * truth for ids and labels, this file only adds page copy.
 */
const industryContent = {
  'professional-services': {
    headline: 'Credibility, made legible.',
    description:
      'Consultancies, advisory firms and agencies are usually sold on judgement and relationships. The job of the digital presence is to make that judgement visible before the first conversation, and to make starting that conversation easy.',
    focusAreas: [
      'Service architecture that matches how clients actually buy',
      'Credential and case-study structures that scale',
      'Enquiry routes that qualify without adding friction',
      'Publishing workflows the team can run themselves',
    ],
    services: ['websites', 'digital-marketing-seo', 'web-applications'],
  },
  'technology-saas': {
    headline: 'Products that survive their own growth.',
    description:
      'Software companies hit the same walls in the same order: multi-tenancy, permissions, billing states, then the reporting customers start asking for. Getting those foundations right early is what keeps later feature work fast.',
    focusAreas: [
      'Multi-tenant architecture and role-based access',
      'Subscription lifecycle and billing integration',
      'In-product analytics and customer-facing dashboards',
      'API surfaces stable enough to build against',
    ],
    services: ['web-applications', 'technology-solutions', 'devops-mlops', 'data-analytics'],
  },
  'financial-services': {
    headline: 'Precision, auditability and trust.',
    description:
      'In financial services the constraints are the design. Traceability, access control and accuracy are not features to be added later, they determine how the system is structured from the first decision onward.',
    focusAreas: [
      'Auditable data pipelines and reconciliation',
      'Access control and least-privilege design',
      'Reporting that regulators and boards can both read',
      'Careful, phased modernisation of legacy systems',
    ],
    services: ['data-analytics', 'technology-solutions', 'websites', 'ai-automation'],
  },
  'real-estate': {
    headline: 'Property, presented properly.',
    description:
      'Property decisions are visual, comparative and slow. The digital experience has to carry high-quality imagery, let people compare sensibly, and stay useful across the months a decision actually takes.',
    focusAreas: [
      'Image-led listing and portfolio experiences',
      'Search, filtering and comparison interfaces',
      'Enquiry and viewing-request flows',
      'Portals for owners, buyers or tenants',
    ],
    services: ['websites', 'web-applications', 'digital-marketing-seo'],
  },
  healthcare: {
    headline: 'Clarity where it matters most.',
    description:
      'Healthcare interfaces are used by people who are stressed, rushed, or both. Clarity, accessibility and careful handling of sensitive information matter more here than anywhere else.',
    focusAreas: [
      'Accessible interfaces tested against real constraints',
      'Careful handling of sensitive information',
      'Patient and practitioner portals',
      'Document understanding and workflow automation',
    ],
    services: ['web-applications', 'ai-automation', 'websites', 'devops-mlops'],
  },
  education: {
    headline: 'Learning experiences that hold attention.',
    description:
      'Education platforms serve several audiences at once - learners, educators and administrators - and each needs a different view of the same underlying system.',
    focusAreas: [
      'Learner, educator and administrator experiences',
      'Content structures that scale across courses',
      'Progress tracking and reporting',
      'Enrolment and enquiry journeys',
    ],
    services: ['web-applications', 'websites', 'data-analytics'],
  },
  'media-publishing': {
    headline: 'A catalogue is only an asset if you can see it.',
    description:
      'Publishers and media businesses run on title, rights, inventory and royalty data that accumulates across decades and several systems. The work is usually less about new features than about making what already exists agree with itself.',
    focusAreas: [
      'Title, inventory and distribution data brought into one view',
      'Royalty, allocation and reconciliation workflows moved off spreadsheets',
      'Reporting that finance and operations can both trust',
      'Modernising long-lived platforms without a reporting freeze',
    ],
    services: ['data-analytics', 'technology-solutions', 'web-applications', 'websites'],
  },
  'retail-commerce': {
    headline: 'From discovery to checkout, without friction.',
    description:
      'Retail is measured continuously, which makes it unusually honest. Catalogue structure, search quality and checkout flow each show up directly in the numbers.',
    focusAreas: [
      'Catalogue structure, search and filtering',
      'Checkout and payment optimisation',
      'Inventory and order management integration',
      'Recommendation and merchandising systems',
    ],
    services: ['ecommerce', 'ai-automation', 'data-analytics', 'digital-marketing-seo'],
  },
  manufacturing: {
    headline: 'Connecting the floor to the office.',
    description:
      'Manufacturing usually has no shortage of data - it has a shortage of connection between the systems that hold it. The value is in making production, quality and planning visible in one place.',
    focusAreas: [
      'Production and quality data integration',
      'Computer vision for inspection support',
      'Operational dashboards for planning',
      'Modernising systems without stopping the line',
    ],
    services: ['data-analytics', 'ai-automation', 'technology-solutions'],
  },
  logistics: {
    headline: 'Decisions at the speed of the network.',
    description:
      'Logistics runs on information that is only valuable while it is fresh. Overnight reporting is fine for the accounts and useless for dispatch.',
    focusAreas: [
      'Real-time event processing and streaming',
      'Dispatch and operational visibility',
      'Customer tracking and notification experiences',
      'Integration across carriers and partner systems',
    ],
    services: ['technology-solutions', 'data-analytics', 'web-applications', 'ai-automation'],
  },
  hospitality: {
    headline: 'The experience starts before arrival.',
    description:
      'For hotels, venues and hospitality groups the digital experience is the first impression, and the booking journey is where that impression is either confirmed or lost.',
    focusAreas: [
      'Booking and reservation journeys',
      'Premium, image-led brand experiences',
      'Multi-property and multi-language structures',
      'Direct-booking conversion optimisation',
    ],
    services: ['websites', 'ecommerce', 'digital-marketing-seo', 'web-applications'],
  },
}

/** Industries that have a published landing page, in taxonomy order. */
export const industryPages = industryTaxonomy
  .filter((i) => industryContent[i.id])
  .map((i) => ({ ...i, ...industryContent[i.id] }))

export const getIndustryPage = (id) => industryPages.find((i) => i.id === id)

/** Options for the Start a Project business-type step. (Spec §9, step 2) */
export const businessTypeOptions = [
  { value: 'startup', label: 'Startup' },
  { value: 'small-business', label: 'Small Business' },
  { value: 'growing-business', label: 'Growing Business' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'other', label: 'Other' },
]

/** Spec §9, step 3. */
export const regionOptions = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'UK' },
  { value: 'europe', label: 'Europe' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'asia-pacific', label: 'Asia-Pacific' },
  { value: 'other', label: 'Other' },
]

/** Spec §9, step 4 — optional. */
export const budgetOptions = [
  { value: 'under-50k', label: 'Under ₹50k' },
  { value: '50k-1l', label: '₹50k – ₹1L' },
  { value: '1l-3l', label: '₹1L – ₹3L' },
  { value: '3l-10l', label: '₹3L – ₹10L' },
  { value: '10l-plus', label: '₹10L+' },
  { value: 'not-sure', label: 'Not sure yet' },
]

/** Spec §9, step 5 — optional. */
export const timelineOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-months', label: '1 – 2 months' },
  { value: '2-3-months', label: '2 – 3 months' },
  { value: '3-6-months', label: '3 – 6 months' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'not-sure', label: 'Not sure' },
]
