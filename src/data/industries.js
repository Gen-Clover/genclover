import { industries as industryTaxonomy } from './taxonomy'

/**
 * Industry landing content. (Spec §13)
 *
 * These pages are intentionally lightweight: relevant capabilities plus any
 * related delivered work. They must NOT contain invented client claims, logos or
 * sector statistics. Where we have nothing verified to say, we say less.
 *
 * Keyed by the industry ids in taxonomy.js — the taxonomy stays the source of
 * truth for ids and labels, this file only adds page copy.
 */
const industryContent = {
  'professional-services': {
    seoDescription:
      'Websites, analytics and applications for consultancies, advisory firms, agencies and staffing businesses, built by Gen Clover.',
    headline: 'Credibility, made legible.',
    description:
      'Consultancies, advisory firms and agencies are usually sold on judgment and relationships. The job of the digital presence is to make that judgment visible before the first conversation, and to make starting that conversation easy.',
    focusAreas: [
      'Service architecture that matches how clients actually buy',
      'Credential and case-study structures that scale',
      'Inquiry routes that qualify without adding friction',
      'Publishing workflows the team can run themselves',
    ],
    services: ['websites', 'digital-marketing-seo', 'web-applications'],
  },
  'technology-saas': {
    seoDescription:
      'Multi-tenant SaaS foundations, in-product analytics, churn prediction and delivery pipelines for software companies, built by Gen Clover.',
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
    seoDescription:
      'Auditable data platforms, reporting, access control and careful modernization for financial services, designed and built by Gen Clover.',
    headline: 'Precision, auditability and trust.',
    description:
      'In financial services the constraints are the design. Traceability, access control and accuracy are not features to be added later, they determine how the system is structured from the first decision onward.',
    focusAreas: [
      'Auditable data pipelines and reconciliation',
      'Access control and least-privilege design',
      'Reporting that regulators and boards can both read',
      'Careful, phased modernization of legacy systems',
    ],
    services: ['data-analytics', 'technology-solutions', 'websites', 'ai-automation'],
  },
  'real-estate': {
    seoDescription:
      'Image-led property websites, search and comparison, inquiry flows and portals for real estate businesses, built by Gen Clover.',
    headline: 'Property, presented properly.',
    description:
      'Property decisions are visual, comparative and slow. The digital experience has to carry high-quality imagery, let people compare sensibly, and stay useful across the months a decision actually takes.',
    focusAreas: [
      'Image-led listing and portfolio experiences',
      'Search, filtering and comparison interfaces',
      'Inquiry and viewing-request flows',
      'Portals for owners, buyers or tenants',
    ],
    services: ['websites', 'web-applications', 'digital-marketing-seo'],
  },
  healthcare: {
    seoDescription:
      'AI, document intelligence and governed data platforms for pharmaceutical, medical data and clinician engagement teams, built by Gen Clover.',
    headline: 'Evidence you can check, systems you can audit.',
    description:
      'Pharmaceutical, medical data and clinician engagement teams work with regulated information and decisions that have to be defended. AI and data systems here must show their evidence, keep a person in charge and record what they did.',
    focusAreas: [
      'AI grounded in regulatory and reference data, with verifiable results',
      'Document intelligence for medical records, forms and correspondence',
      'Governed reporting and prediction on one data foundation',
      'Human approval and full audit trails for automated workflows',
    ],
    services: ['ai-automation', 'data-analytics', 'devops-mlops', 'web-applications'],
  },
  education: {
    seoDescription:
      'Learning platforms with learner, educator and administrator views, enrollment journeys and progress reporting, built by Gen Clover.',
    headline: 'Learning experiences that hold attention.',
    description:
      'Education platforms serve several audiences at once (learners, educators and administrators), and each needs a different view of the same underlying system.',
    focusAreas: [
      'Learner, educator and administrator experiences',
      'Content structures that scale across courses',
      'Progress tracking and reporting',
      'Enrollment and inquiry journeys',
    ],
    services: ['web-applications', 'websites', 'data-analytics'],
  },
  'media-publishing': {
    seoDescription:
      'Data and BI modernization, royalty and reconciliation workflows and governed reporting for publishers and media businesses, by Gen Clover.',
    headline: 'A catalog is only an asset if you can see it.',
    description:
      'Publishers and media businesses run on title, rights, inventory and royalty data that accumulates across decades and several systems. The work is usually less about new features than about making what already exists agree with itself.',
    focusAreas: [
      'Title, inventory and distribution data brought into one view',
      'Royalty, allocation and reconciliation workflows moved off spreadsheets',
      'Reporting that finance and operations can both trust',
      'Modernizing long-lived platforms without a reporting freeze',
    ],
    services: ['data-analytics', 'technology-solutions', 'web-applications', 'websites'],
  },
  'retail-commerce': {
    seoDescription:
      'E-commerce, recommendation engines and retail analytics that make catalogs easier to navigate and trading numbers easier to trust, by Gen Clover.',
    headline: 'From discovery to checkout, without friction.',
    description:
      'Retail is measured continuously, which makes it unusually honest. Catalog structure, search quality and checkout flow each show up directly in the numbers.',
    focusAreas: [
      'Catalog structure, search and filtering',
      'Checkout and payment optimization',
      'Inventory and order management integration',
      'Recommendation and merchandising systems',
    ],
    services: ['ecommerce', 'ai-automation', 'data-analytics', 'digital-marketing-seo'],
  },
  manufacturing: {
    seoDescription:
      'Computer vision inspection, production and quality data integration and operational dashboards for manufacturers, built by Gen Clover.',
    headline: 'Connecting the floor to the office.',
    description:
      'Manufacturing usually has no shortage of data. It has a shortage of connection between the systems that hold it. The value is in making production, quality and planning visible in one place.',
    focusAreas: [
      'Production and quality data integration',
      'Computer vision for inspection support',
      'Operational dashboards for planning',
      'Modernizing systems without stopping the line',
    ],
    services: ['data-analytics', 'ai-automation', 'technology-solutions'],
  },
  logistics: {
    seoDescription:
      'Real-time event streaming, dispatch visibility and system integration for logistics operators, designed and built by Gen Clover.',
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
    seoDescription:
      'Direct-booking websites, image-led brand experiences and multi-property content structures for hotels and venues, built by Gen Clover.',
    headline: 'The experience starts before arrival.',
    description:
      'For hotels, venues and hospitality groups the digital experience is the first impression, and the booking journey is where that impression is either confirmed or lost.',
    focusAreas: [
      'Booking and reservation journeys',
      'Premium, image-led brand experiences',
      'Multi-property and multi-language structures',
      'Direct-booking conversion optimization',
    ],
    services: ['websites', 'ecommerce', 'digital-marketing-seo', 'web-applications'],
  },
}

/** Industries that have a published landing page, in taxonomy order. */
export const industryPages = industryTaxonomy
  .filter((i) => industryContent[i.id])
  .map((i) => ({ ...i, ...industryContent[i.id] }))

export const getIndustryPage = (id) => industryPages.find((i) => i.id === id)
