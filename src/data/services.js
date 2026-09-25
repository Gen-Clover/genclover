import {
  Globe,
  LayoutDashboard,
  ShoppingCart,
  Sparkles,
  BarChart3,
  Boxes,
  Infinity as InfinityIcon,
  Search,
} from 'lucide-react'

/**
 * The eight primary service domains. (Spec §6 / Appendix A.1)
 *
 * These are COMMERCIAL categories, not technology stacks. Capabilities and
 * technologies stay attached to their parent service and must never be promoted
 * into primary navigation. (Spec §25)
 *
 * Shape — Service {
 *   slug, title, shortDescription, heroHeadline, heroDescription,
 *   capabilities[], deliverables[], relatedIndustries[], ctaLabel, closingTitle
 * }
 * relatedProjects is derived at read time from projects.js rather than stored
 * twice, so a new project only has to be declared in one place.
 */

/** Engagement deliverables shared by every service line. */
const baseDeliverables = [
  'Discovery and requirements definition',
  'Solution architecture and delivery plan',
  'Implementation by a senior engineering team',
  'Testing, review and pre-launch validation',
  'Deployment and launch support',
  'Optional maintenance and continuous development',
]

export const services = [
  {
    slug: 'websites',
    legacySlugs: ['web-development'],
    icon: Globe,
    title: 'Websites & Web Experiences',
    shortDescription:
      'Professional websites and digital experiences built to communicate clearly, represent your brand and turn visitors into opportunities.',
    heroHeadline: 'Websites built around your business.',
    heroDescription:
      'From professional corporate websites to high-conversion digital experiences, Gen Clover designs and engineers websites that look exceptional, communicate clearly and perform reliably.',
    closingTitle: 'Planning a new website?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'View Our Work', to: '/work' },
    workCategory: 'websites',
    capabilities: [
      { label: 'Corporate Websites', description: 'A credible digital presence for established businesses.' },
      { label: 'Professional Websites', description: 'For consultants, advisors and professional service firms.' },
      { label: 'Startup Websites', description: 'Clear, credible launches for new businesses and products.' },
      { label: 'Premium Brand Websites', description: 'High-end digital experiences where design and perception matter.' },
      { label: 'Marketing Websites', description: 'Campaign and conversion-focused experiences.' },
      { label: 'Content-Driven Websites', description: 'Structured publishing and CMS-led experiences.' },
    ],
    deliverables: [
      'Discovery and requirements definition',
      'Information architecture',
      'UX/UI design',
      'Responsive frontend development',
      'CMS where required',
      'Contact and lead-capture forms',
      'Analytics integration',
      'SEO foundation',
      'Performance optimization',
      'Security configuration',
      'Deployment and launch support',
      'Optional maintenance and continuous development',
    ],
    relatedIndustries: ['professional-services', 'financial-services', 'real-estate', 'technology-saas'],
    seo: {
      title: 'Website Development | Gen Clover',
      description:
        'Corporate, professional, startup and premium brand websites designed and engineered by Gen Clover to communicate clearly and perform reliably.',
    },
  },
  {
    slug: 'web-applications',
    icon: LayoutDashboard,
    title: 'Web Applications',
    shortDescription:
      'Business-focused web applications designed around workflows, users, data and measurable outcomes.',
    heroHeadline: 'Applications designed around how your business actually works.',
    heroDescription:
      'Customer portals, dashboards, internal tools and SaaS products, engineered around real workflows, with the maintainability, performance and security to run for years.',
    closingTitle: 'Have an application in mind?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'View Our Work', to: '/work' },
    workCategory: 'web-applications',
    capabilities: [
      { label: 'Customer Portals', description: 'Self-service experiences for the people you serve.' },
      { label: 'Dashboards', description: 'Operational and executive views of live business data.' },
      { label: 'Admin Platforms', description: 'Back-office systems your team can actually work in.' },
      { label: 'Internal Tools', description: 'Purpose-built tooling that replaces spreadsheets and manual steps.' },
      { label: 'SaaS Applications', description: 'Multi-tenant products with accounts, billing and roles.' },
      { label: 'Workflow Applications', description: 'Structured processes, approvals and handoffs.' },
      { label: 'Business Platforms', description: 'Systems that connect several parts of an organization.' },
    ],
    deliverables: baseDeliverables,
    relatedIndustries: ['technology-saas', 'professional-services', 'logistics', 'healthcare'],
    seo: {
      title: 'Web Application Development | Gen Clover',
      description:
        'Customer portals, dashboards, admin platforms, internal tools and SaaS applications built around your workflows, users and data.',
    },
  },
  {
    slug: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-Commerce',
    shortDescription:
      'Commerce experiences that make it easier for customers to discover, evaluate and purchase products.',
    heroHeadline: 'Commerce experiences built to convert.',
    heroDescription:
      'Storefronts, catalogs, checkout and the systems behind them, designed so customers can find what they need and buy it without friction.',
    closingTitle: 'Building or rebuilding a store?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'View Our Work', to: '/work' },
    workCategory: 'ecommerce',
    capabilities: [
      { label: 'E-Commerce Websites', description: 'Storefronts designed around discovery and purchase.' },
      { label: 'Product Catalogs', description: 'Structured, searchable, filterable product data.' },
      { label: 'Checkout & Payments', description: 'Checkout flows built to reduce abandonment.' },
      { label: 'Payment Integration', description: 'Regional and international payment providers.' },
      { label: 'Inventory Systems', description: 'Stock visibility across channels and locations.' },
      { label: 'Order Management', description: 'Fulfillment, status and post-purchase operations.' },
      { label: 'Commerce Platforms', description: 'Custom commerce where off-the-shelf will not fit.' },
    ],
    deliverables: baseDeliverables,
    relatedIndustries: ['retail-commerce', 'manufacturing', 'hospitality'],
    seo: {
      title: 'E-Commerce Development | Gen Clover',
      description:
        'E-commerce websites, product catalogs, checkout and payments, inventory and order management built by Gen Clover.',
    },
  },
  {
    slug: 'ai-automation',
    legacySlugs: ['ai-bots', 'data-science'],
    icon: Sparkles,
    title: 'AI & Automation',
    shortDescription:
      'Practical AI and automation solutions that reduce repetitive work and unlock new capabilities.',
    heroHeadline: 'AI applied where it makes a measurable difference.',
    heroDescription:
      'Assistants, intelligent search, document understanding and workflow automation, built into your existing systems rather than bolted on beside them.',
    closingTitle: 'Looking at where AI could help?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'View Our Work', to: '/work' },
    workCategory: 'ai-automation',
    capabilities: [
      { label: 'AI Assistants', description: 'Assistants grounded in your own content and systems.' },
      { label: 'Generative AI', description: 'Drafting, summarization and content generation in context.' },
      { label: 'AI Features', description: 'Intelligence embedded inside an existing product.' },
      { label: 'Intelligent Search', description: 'Semantic retrieval across documents and records.' },
      { label: 'Workflow Automation', description: 'Removing repetitive steps from daily operations.' },
      { label: 'Document Intelligence', description: 'Extracting structure from unstructured documents.' },
      { label: 'Machine Learning', description: 'Models trained for a specific business question.' },
      { label: 'AI Integrations', description: 'Connecting AI capability to the tools you already run.' },
    ],
    deliverables: baseDeliverables,
    relatedIndustries: ['financial-services', 'healthcare', 'professional-services', 'logistics'],
    seo: {
      title: 'AI & Automation Solutions | Gen Clover',
      description:
        'AI assistants, generative AI, intelligent search, document intelligence and workflow automation built for practical business outcomes.',
    },
  },
  {
    slug: 'data-analytics',
    legacySlugs: ['data-engineering', 'bi-solutions'],
    icon: BarChart3,
    title: 'Data & Analytics',
    shortDescription:
      'Reliable data foundations and analytics solutions that help teams understand performance and make better decisions.',
    heroHeadline: 'Data your team can actually trust.',
    heroDescription:
      'Pipelines, platforms and reporting built so the numbers agree with each other, and so the people who need them can reach them without asking.',
    closingTitle: 'Need numbers your team can trust?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'View Our Work', to: '/work' },
    workCategory: 'data-analytics',
    capabilities: [
      { label: 'Data Engineering', description: 'The plumbing that makes everything downstream reliable.' },
      { label: 'Data Platforms', description: 'Warehouses and lakehouses sized to the organization.' },
      { label: 'Data Pipelines', description: 'Scheduled and streaming movement of data.' },
      { label: 'Data Integration', description: 'Bringing separate systems into one picture.' },
      { label: 'Business Intelligence', description: 'Governed metrics that mean the same thing everywhere.' },
      { label: 'Dashboards & Reporting', description: 'Reporting built for the decision, not the tool.' },
      { label: 'Data Analytics', description: 'Answering specific questions with the data you hold.' },
      { label: 'Data Science / Machine Learning', description: 'Forecasting, segmentation and prediction.' },
    ],
    deliverables: baseDeliverables,
    relatedIndustries: ['financial-services', 'media-publishing', 'retail-commerce', 'manufacturing'],
    seo: {
      title: 'Data & Analytics Solutions | Gen Clover',
      description:
        'Data engineering, data platforms, pipelines, business intelligence and analytics that give teams a reliable view of performance.',
    },
  },
  {
    slug: 'technology-solutions',
    icon: Boxes,
    title: 'Technology Solutions',
    shortDescription: 'Custom technology solutions designed around complex business requirements.',
    heroHeadline: 'Engineering for the requirements nothing off-the-shelf covers.',
    heroDescription:
      'APIs, integrations, cloud architecture and modernization: the backend work that lets the rest of the business move.',
    closingTitle: 'Facing a requirement nothing off the shelf covers?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'View Our Work', to: '/work' },
    workCategory: 'digital-platforms',
    capabilities: [
      { label: 'APIs', description: 'Documented, versioned interfaces for internal and partner use.' },
      { label: 'System Integrations', description: 'Making separate systems behave like one.' },
      { label: 'Cloud Solutions', description: 'Architecture designed for cost as well as scale.' },
      { label: 'Technology Modernization', description: 'Moving legacy systems forward without stopping the business.' },
      { label: 'Architecture', description: 'Decisions documented, trade-offs made explicit.' },
      { label: 'Custom Systems', description: 'Built when the requirement is genuinely specific.' },
      { label: 'Backend Engineering', description: 'Services, jobs and data access built to last.' },
      { label: 'Third-Party Integrations', description: 'Payment, CRM, ERP and vendor connections.' },
    ],
    deliverables: baseDeliverables,
    relatedIndustries: ['technology-saas', 'financial-services', 'manufacturing', 'logistics'],
    seo: {
      title: 'Technology Solutions | Gen Clover',
      description:
        'APIs, system integrations, cloud solutions, modernization and backend engineering for complex business requirements.',
    },
  },
  {
    slug: 'devops-mlops',
    icon: InfinityIcon,
    title: 'DevOps & MLOps',
    shortDescription:
      'Infrastructure, delivery and operational capabilities that help software and machine-learning systems ship reliably and run effectively.',
    heroHeadline: 'Ship reliably. Run confidently.',
    heroDescription:
      'Cloud infrastructure, delivery pipelines and the operational discipline that keeps software, and models, healthy after release.',
    closingTitle: 'Want releases that stop being stressful?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'How We Work', to: '/how-we-work' },
    workCategory: 'digital-platforms',
    capabilities: [
      { label: 'Cloud Infrastructure', description: 'Environments defined in code, not in a console.' },
      { label: 'CI/CD', description: 'Every change tested and released the same way.' },
      { label: 'Infrastructure Automation', description: 'Repeatable provisioning across environments.' },
      { label: 'Deployment & Release Engineering', description: 'Safe, reversible releases.' },
      { label: 'Monitoring & Observability', description: 'Knowing something is wrong before a customer tells you.' },
      { label: 'Containerization', description: 'Consistent runtime from laptop to production.' },
      { label: 'DevSecOps', description: 'Security checks inside the pipeline, not after it.' },
      { label: 'MLOps', description: 'Reproducible training, versioning and promotion.' },
      { label: 'Model Deployment', description: 'Serving models as dependable production services.' },
      { label: 'ML Infrastructure', description: 'Compute, storage and feature access for ML workloads.' },
      { label: 'Model Monitoring', description: 'Watching drift, quality and cost over time.' },
    ],
    deliverables: baseDeliverables,
    relatedIndustries: ['technology-saas', 'financial-services', 'healthcare'],
    seo: {
      title: 'DevOps & MLOps Services | Gen Clover',
      description:
        'Cloud infrastructure, CI/CD, containerization, DevSecOps, MLOps and model monitoring so your systems ship reliably and run well.',
    },
  },
  {
    slug: 'digital-marketing-seo',
    icon: Search,
    title: 'Digital Marketing & SEO',
    shortDescription:
      'Digital growth capabilities that improve discoverability, website performance, user journeys and measurable acquisition.',
    heroHeadline: 'Be found. Be understood. Be chosen.',
    heroDescription:
      'Technical and on-page SEO, content structure, conversion optimization and measurement, grounded in how your site is actually built.',
    closingTitle: 'Want to be found by the right people?',
    ctaLabel: 'Discuss Your Project',
    secondaryCta: { label: 'View Our Work', to: '/work' },
    workCategory: 'websites',
    capabilities: [
      { label: 'Search Engine Optimization', description: 'A structured program rather than isolated tactics.' },
      { label: 'Technical SEO', description: 'Crawlability, indexation, structured data and speed.' },
      { label: 'On-Page SEO', description: 'Titles, hierarchy, internal linking and intent matching.' },
      { label: 'Content Strategy', description: 'What to publish, for whom, and in what order.' },
      { label: 'Search Performance', description: 'Tracking visibility against the queries that matter.' },
      { label: 'Conversion Optimization', description: 'Improving the journey between arrival and inquiry.' },
      { label: 'Digital Campaigns', description: 'Campaign landing experiences built to be measured.' },
      { label: 'Analytics & Measurement', description: 'Events and attribution defined before launch.' },
    ],
    deliverables: baseDeliverables,
    relatedIndustries: ['professional-services', 'retail-commerce', 'media-publishing', 'real-estate'],
    seo: {
      title: 'Digital Marketing & SEO Services | Gen Clover',
      description:
        'Technical SEO, on-page SEO, content strategy, conversion optimization and analytics that improve discoverability and acquisition.',
    },
  },
]

export const getService = (slug) =>
  services.find((s) => s.slug === slug || s.legacySlugs?.includes(slug))

/** Public pricing wording. Spec §6.3 — never publish a fixed package price. */
export const PRICING_STATEMENT =
  'Project pricing is tailored to scope, functionality, design complexity and business requirements. Contact us to discuss your project.'

/** Options for the Start a Project service step. (Spec §9, step 1) */
export const serviceEnquiryOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: 'other', label: 'Other' },
]
