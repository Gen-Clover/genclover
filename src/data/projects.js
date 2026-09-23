import { getStatus, getIndustry, getWorkCategory } from './taxonomy'

/**
 * Single source of truth for the Work area. (Spec §8)
 *
 * TRUTHFULNESS POLICY — Spec §1.2 / §2.1 / §7.2.
 * Every entry below is a Gen Clover Concept: a demonstration of the type of work
 * Gen Clover can deliver. None of them may be presented as delivered client
 * work, and none may carry an invented client name, revenue, conversion,
 * accuracy, cost-saving or performance figure. The unverified percentages that
 * previously shipped in Portfolio.jsx (92% accuracy, 35% churn reduction, 40%
 * conversion increase, 60% engagement, 25% sales, 45% cost reduction, 96%
 * classification accuracy) have been removed and replaced with conceptual
 * outcome wording.
 *
 * To publish a real project: set `status: 'client'`, fill `clientName` and
 * `outcomes` with verified figures, set `permissionsApproved: true`, and only
 * then set `published: true`.
 *
 * Shape — Project {
 *   slug, title, status, category, industry, primaryService, additionalServices[],
 *   summary, challenge, approach, solution, features[], capabilities[],
 *   technologies[], outcomes[], scope, heroImage, gallery[],
 *   clientName, clientLogo, externalUrl, githubUrl, published, permissionsApproved,
 *   featured, seo
 * }
 */

/** Shown wherever a repository link would otherwise appear. (Spec §17) */
export const REPO_POLICY_NOTE = 'Repository not shown as per company policy'

/** Standard outcome wording for a concept project. (Spec §7.4) */
const conceptual = (text) => `Conceptual outcome - ${text}`

export const projects = [
  {
    slug: 'ecommerce-analytics-platform',
    title: 'E-Commerce Analytics Platform',
    status: 'concept',
    category: 'data-analytics',
    industry: 'retail-commerce',
    primaryService: 'data-analytics',
    additionalServices: ['technology-solutions'],
    featured: true,
    summary:
      'An analytics platform concept for an online retailer, designed to bring order, product and customer data into a single reliable view.',
    challenge:
      'Retail teams typically read performance from several disconnected places - the storefront, the payment provider, the warehouse system and a spreadsheet. The numbers rarely agree, so most meetings start by arguing about which figure is correct instead of deciding what to do.',
    approach:
      'Model the business first: define what an order, a customer and a product actually mean, then design pipelines around those definitions rather than around whichever system happens to hold the data.',
    solution:
      'A batch and near-real-time pipeline that consolidates transactional data into a governed warehouse, with a semantic layer on top so every dashboard derives its numbers from the same definitions.',
    features: [
      'Scheduled ingestion from storefront, payments and fulfilment systems',
      'Governed metric definitions shared across all reporting',
      'Data quality checks with alerting on pipeline failure',
      'Operational dashboard for daily trading decisions',
      'Historical snapshots for period-on-period comparison',
    ],
    capabilities: ['Data Engineering', 'Data Pipelines', 'Business Intelligence', 'Dashboards & Reporting'],
    technologies: ['Python', 'Apache Airflow', 'PostgreSQL', 'Tableau'],
    outcomes: [
      conceptual('give trading and marketing teams one agreed set of numbers to work from.'),
      conceptual('reduce the manual reporting effort spent reconciling systems each week.'),
      conceptual('make data quality problems visible before they reach a dashboard.'),
    ],
    scope: 'Data architecture, pipeline engineering, semantic modelling, dashboard design.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'customer-churn-prediction',
    title: 'Customer Churn Prediction Model',
    status: 'concept',
    category: 'ai-automation',
    industry: 'technology-saas',
    primaryService: 'ai-automation',
    additionalServices: ['data-analytics', 'devops-mlops'],
    featured: true,
    summary:
      'A machine-learning concept that identifies which subscription customers are drifting away, early enough for a team to do something about it.',
    challenge:
      'Subscription businesses usually learn about churn after it has happened, from a cancellation report. By then the relationship is over and the only remaining option is a discount.',
    approach:
      'Treat churn as an operational problem rather than a modelling exercise: work out who will act on the prediction, how much notice they need, and what they can realistically do with it - then build backwards from there.',
    solution:
      'A supervised model trained on product usage, support history and billing signals, served as a scored list into the tools the customer success team already uses, with the contributing factors shown alongside each score.',
    features: [
      'Feature pipeline over usage, support and billing data',
      'Risk score with the factors that drove it',
      'Segmented views by plan, tenure and account owner',
      'Scheduled retraining with performance tracking',
      'Delivery into existing customer success tooling',
    ],
    capabilities: ['Machine Learning', 'Data Science / Machine Learning', 'MLOps', 'Model Monitoring'],
    technologies: ['Python', 'Scikit-learn', 'TensorFlow', 'Pandas'],
    outcomes: [
      conceptual('give customer success teams advance warning instead of a cancellation report.'),
      conceptual('make the reasoning behind each risk score visible, so the team can act on it.'),
      conceptual('keep model performance observable after deployment rather than assumed.'),
    ],
    scope: 'Feature engineering, model development, evaluation, deployment and monitoring design.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'corporate-website-redesign',
    title: 'Corporate Website Redesign',
    status: 'concept',
    category: 'websites',
    industry: 'professional-services',
    primaryService: 'websites',
    additionalServices: ['digital-marketing-seo'],
    featured: true,
    summary:
      'A corporate website concept for an established professional services firm, built around clarity, credibility and a single obvious next step.',
    challenge:
      'Long-established firms often accumulate a website rather than design one. Services are described in internal language, the structure mirrors the org chart instead of the visitor, and the enquiry route is buried.',
    approach:
      "Rebuild the information architecture around the questions a prospective client actually arrives with, then let the visual design carry the firm's seniority without relying on stock photography.",
    solution:
      'A responsive, accessible site with a restructured service architecture, strong typographic hierarchy, considered motion and a lead-capture route that is present on every page without shouting.',
    features: [
      'Information architecture rebuilt around visitor intent',
      'Responsive layouts tested from small phone to large desktop',
      'Accessible contrast, focus states and semantic structure',
      'Editable content structure for non-technical updates',
      'SEO foundation and analytics events defined before launch',
    ],
    capabilities: ['Corporate Websites', 'Professional Websites', 'Technical SEO', 'Conversion Optimization'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    outcomes: [
      conceptual('let a first-time visitor understand what the firm does within seconds of arriving.'),
      conceptual('give every page a clear, consistent route into an enquiry.'),
      conceptual('provide a structure the firm can extend without a redesign each time.'),
    ],
    scope: 'Discovery, information architecture, UX/UI design, frontend engineering, launch.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'realtime-data-streaming-platform',
    title: 'Real-Time Data Streaming Platform',
    status: 'concept',
    category: 'digital-platforms',
    industry: 'logistics',
    primaryService: 'technology-solutions',
    additionalServices: ['data-analytics', 'devops-mlops'],
    featured: true,
    summary:
      'A streaming platform concept for a logistics operator, designed so events from vehicles, depots and orders are usable the moment they happen.',
    challenge:
      'Overnight batch reporting is fine for accounting and useless for dispatch. When a delivery slips, the people who could respond find out the following morning.',
    approach:
      'Separate the event backbone from the consumers. Publish once, let dispatch, reporting and alerting each read at their own pace, and make replay a first-class capability rather than a recovery scramble.',
    solution:
      'A Kafka-based event backbone with schema enforcement at the boundary, stream processing for aggregations, and both a live operational view and a warehouse sink fed from the same stream.',
    features: [
      'Event schemas versioned and validated at ingestion',
      'Stream processing for rolling operational aggregates',
      'Replay from retained history for recovery and backfill',
      'Live dispatch view alongside a warehouse sink',
      'Infrastructure defined as code across environments',
    ],
    capabilities: ['Data Pipelines', 'Cloud Solutions', 'Architecture', 'Containerization', 'Monitoring & Observability'],
    technologies: ['Kafka', 'Python', 'AWS', 'Docker'],
    outcomes: [
      conceptual('put operational events in front of dispatch while they are still actionable.'),
      conceptual('let new consumers be added without changing the systems that produce events.'),
      conceptual('make recovery a replay rather than a manual reconstruction.'),
    ],
    scope: 'Platform architecture, streaming infrastructure, schema governance, observability.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'recommendation-engine',
    title: 'Recommendation Engine',
    status: 'concept',
    category: 'ai-automation',
    industry: 'retail-commerce',
    primaryService: 'ai-automation',
    additionalServices: ['ecommerce', 'data-analytics'],
    featured: true,
    summary:
      'A recommendation concept for a retail catalogue, built to help customers find relevant products without burying the ones the business needs to move.',
    challenge:
      'A large catalogue is only an advantage if customers can navigate it. Generic "customers also bought" strips tend to recommend what is already popular, which does nothing for discovery or for slower-moving stock.',
    approach:
      'Blend behavioural signals with product attributes so the system has something sensible to say about items with little history, and keep the ranking explainable enough for merchandisers to trust and override.',
    solution:
      'A hybrid collaborative and content-based ranker served behind a low-latency API, with cached candidate sets, merchandiser override rules and an experimentation path for comparing strategies.',
    features: [
      'Hybrid behavioural and attribute-based ranking',
      'Cold-start handling for new and low-traffic products',
      'Low-latency serving with cached candidate generation',
      'Merchandiser override and business rules layer',
      'Experiment framework for comparing ranking strategies',
    ],
    capabilities: ['Machine Learning', 'AI Features', 'Intelligent Search', 'AI Integrations'],
    technologies: ['Python', 'TensorFlow', 'Redis', 'FastAPI'],
    outcomes: [
      conceptual('help customers reach relevant products with fewer steps.'),
      conceptual('give newly listed products a route to visibility.'),
      conceptual('keep merchandising judgement in the loop alongside the model.'),
    ],
    scope: 'Model design, serving architecture, business rules layer, experimentation design.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'saas-dashboard-application',
    title: 'SaaS Dashboard Application',
    status: 'concept',
    category: 'web-applications',
    industry: 'technology-saas',
    primaryService: 'web-applications',
    additionalServices: ['technology-solutions', 'devops-mlops'],
    featured: true,
    summary:
      'A full-stack SaaS product concept covering the parts every subscription application needs: accounts, roles, billing and a dashboard people return to.',
    challenge:
      'The interesting part of a SaaS product is rarely the part that takes the time. Authentication, team permissions, subscription states and billing edge cases consume the schedule and are painful to retrofit.',
    approach:
      'Build the account, permission and billing model first, as the foundation the product sits on, so feature work later does not have to renegotiate who can see what.',
    solution:
      'A multi-tenant application with role-based access, subscription lifecycle handling, an in-product analytics dashboard and a settled, documented API surface.',
    features: [
      'Multi-tenant data model with role-based access control',
      'Subscription lifecycle including trials, upgrades and dunning',
      'In-product analytics dashboard',
      'Team invitations and permission management',
      'Documented API surface for integrations',
    ],
    capabilities: ['SaaS Applications', 'Dashboards', 'Admin Platforms', 'APIs', 'Backend Engineering'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    outcomes: [
      conceptual('get the account, permission and billing foundations right before feature work begins.'),
      conceptual('give product teams a dashboard their customers return to rather than export from.'),
      conceptual('keep the API stable enough for customers to build against.'),
    ],
    scope: 'Product architecture, full-stack engineering, billing integration, deployment.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'data-warehouse-migration',
    title: 'Data Warehouse Migration',
    status: 'concept',
    category: 'data-analytics',
    industry: 'financial-services',
    primaryService: 'data-analytics',
    additionalServices: ['technology-solutions', 'devops-mlops'],
    featured: false,
    summary:
      'A migration concept moving a legacy on-premise warehouse to a cloud platform without asking the business to stop reporting while it happens.',
    challenge:
      'Legacy warehouses are load-bearing. Years of undocumented logic sit inside them, and a migration that breaks a regulatory report is far worse than one that takes longer.',
    approach:
      'Run both platforms in parallel and migrate by domain, reconciling output at every step, so each cutover is a small verified move rather than one large irreversible one.',
    solution:
      'Transformation logic rebuilt as version-controlled, tested models on a cloud warehouse, with automated reconciliation against the legacy system and a domain-by-domain cutover plan.',
    features: [
      'Domain-by-domain phased migration plan',
      'Transformation logic rebuilt as tested, version-controlled models',
      'Automated reconciliation against the legacy warehouse',
      'Lineage and documentation generated from the models',
      'Parallel running until each domain is signed off',
    ],
    capabilities: ['Data Platforms', 'Data Engineering', 'Technology Modernization', 'Architecture'],
    technologies: ['Snowflake', 'dbt', 'Python', 'AWS'],
    outcomes: [
      conceptual('move off legacy infrastructure without a reporting freeze.'),
      conceptual('replace undocumented logic with tested, version-controlled models.'),
      conceptual('give each domain a verifiable sign-off before cutover.'),
    ],
    scope: 'Migration strategy, transformation modelling, reconciliation tooling, cutover planning.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'image-classification-system',
    title: 'Image Classification System',
    status: 'concept',
    category: 'ai-automation',
    industry: 'manufacturing',
    primaryService: 'ai-automation',
    additionalServices: ['devops-mlops'],
    featured: false,
    summary:
      'A computer vision concept for production-line quality control, designed to assist inspectors rather than quietly replace their judgement.',
    challenge:
      'Manual visual inspection is consistent for the first hour of a shift and less so by the last. Defects are rare, which makes them both hard to catch and hard to gather training data for.',
    approach:
      'Design for the rare case. Optimise for recall on defects, route anything uncertain to a human, and make every automated decision reviewable after the fact.',
    solution:
      'A convolutional classifier with heavy augmentation for scarce defect classes, served at the line with a confidence threshold that escalates uncertain items to an inspector, and a feedback loop that returns reviewed cases to training.',
    features: [
      'Augmentation strategy for scarce defect classes',
      'Confidence thresholds with escalation to a human inspector',
      'Reviewable decision history for every classified item',
      'Feedback loop returning reviewed cases into training data',
      'Containerised deployment at the production line',
    ],
    capabilities: ['Machine Learning', 'AI Features', 'Model Deployment', 'Model Monitoring'],
    technologies: ['PyTorch', 'OpenCV', 'Flask', 'Docker'],
    outcomes: [
      conceptual('keep inspection consistent across a full shift.'),
      conceptual('escalate uncertain cases to people instead of guessing.'),
      conceptual('turn every human review into future training data.'),
    ],
    scope: 'Vision model development, threshold and escalation design, edge deployment, monitoring.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
  {
    slug: 'portfolio-website',
    title: 'Creative Portfolio Website',
    status: 'concept',
    category: 'websites',
    industry: 'other',
    primaryService: 'websites',
    additionalServices: ['digital-marketing-seo'],
    featured: false,
    summary:
      'A premium portfolio concept where the work is the interface, and the site around it gets out of the way.',
    challenge:
      'Portfolio sites tend to fail in one of two directions: so plain that the work looks unconsidered, or so animated that the work cannot be seen at all.',
    approach:
      'Let the work set the palette. Keep the chrome quiet, use motion only to establish hierarchy between states, and make sure the whole thing still works with animation switched off.',
    solution:
      'A fast, image-led site with large project visuals, deliberate transitions between index and detail views, and a full no-motion path for visitors who prefer reduced motion.',
    features: [
      'Large-format project visuals with responsive art direction',
      'Animated transitions between index and detail views',
      'Full experience preserved under prefers-reduced-motion',
      'Image optimisation and lazy loading throughout',
      'Structured project data so new work is a content change',
    ],
    capabilities: ['Premium Brand Websites', 'Content-Driven Websites', 'Conversion Optimization'],
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite'],
    outcomes: [
      conceptual('keep attention on the work rather than the interface around it.'),
      conceptual('stay fully usable for visitors who prefer reduced motion.'),
      conceptual('make publishing new work a content change, not a build.'),
    ],
    scope: 'Art direction, UX/UI design, frontend engineering, performance optimisation.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: false,
  },
]

/* ---------------------------------------------------------------- selectors */

/** Only ever render from this list on public pages. */
export const publishedProjects = projects.filter((p) => p.published)

export const getProject = (slug) => publishedProjects.find((p) => p.slug === slug)

export const getProjectsByCategory = (categoryId) =>
  categoryId === 'all'
    ? publishedProjects
    : publishedProjects.filter((p) => p.category === categoryId)

/** A project is related to a service if it is the primary OR an additional service. */
export const getProjectsByService = (serviceSlug) =>
  publishedProjects.filter(
    (p) => p.primaryService === serviceSlug || p.additionalServices?.includes(serviceSlug)
  )

export const getProjectsByIndustry = (industryId) =>
  publishedProjects.filter((p) => p.industry === industryId)

/** Homepage Selected Work — 6–8 items. (Spec §20) */
export const featuredProjects = publishedProjects.filter((p) => p.featured).slice(0, 8)

/** Resolve the display labels a card or detail page needs. */
export const projectMeta = (project) => ({
  status: getStatus(project.status),
  industry: getIndustry(project.industry),
  category: getWorkCategory(project.category),
})

/** Case-study suggestions: same category first, then same industry. */
export const getRelatedProjects = (project, limit = 3) => {
  const others = publishedProjects.filter((p) => p.slug !== project.slug)
  const ranked = [
    ...others.filter((p) => p.category === project.category),
    ...others.filter((p) => p.category !== project.category && p.industry === project.industry),
    ...others,
  ]
  return [...new Set(ranked)].slice(0, limit)
}
