import { getStatus, getIndustry, getWorkCategory } from './taxonomy'
import { caseStudyVisuals } from './caseStudyVisuals'

/**
 * Single source of truth for the Work area. (Spec §8)
 *
 * PUBLICATION POLICY — Spec §1.2 / §2.1.
 *
 * Every published project is delivered client work. Client names, imprint
 * names and internal product names are left out unless the client has approved
 * them in writing; sector is kept because it describes the domain, not the
 * account. Outcomes describe what the system does, never invented business
 * figures. The unverified percentages the previous site published (92%
 * accuracy, 35% churn reduction, 40% conversion increase and others) were
 * removed and must not return without evidence.
 *
 * `published: false` keeps an entry out of every public list. Use it for
 * drafts that are still waiting on the Product Owner's confirmation.
 *
 * To name a client: fill `clientName`, set `permissionsApproved: true`, and
 * only then set `published: true`.
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


export const projects = [
  /* ==================================================================
   * DELIVERED WORK — client engagements, client not named.
   * Approved for publication by the Product Owner. Client names, imprint
   * names and internal product names have been removed; sector remains
   * because it is descriptive rather than identifying.
   * ================================================================== */

  {
    slug: 'ai-log-monitoring-observability-platform',
    title: 'Autonomous AI Log Monitoring & Observability Platform',
    status: 'client',
    category: 'ai-automation',
    industry: 'healthcare',
    primaryService: 'ai-automation',
    additionalServices: ['devops-mlops', 'technology-solutions'],
    featured: true,
    summary:
      'For a healthcare media and clinician engagement platform, a five-agent system that reads a production error, writes the fix and opens a reviewed pull request, with an engineer still deciding what ships.',
    challenge:
      'A microservice estate produces thousands of log lines a minute. When something breaks, an on-call engineer has to notice the alert, find the right logs, reconstruct the failing request, locate the responsible file and commit, then write, test and ship a fix. Logs, source code and deployment state live in three different systems, so the mechanical middle of an incident is where most of the hours go. Traditional dashboards report that something broke; they never propose a fix.',
    approach:
      'Instrument once, let agents do the mechanical work, and keep people in charge of the decision. A standard tracing library across every service means an agent can always start from one identifier and find everything related to a failure. The workflow deliberately ends at a pull request rather than a deployment, so the AI prepares work and a person merges it.',
    solution:
      'A shared tracing library across all Node and Python services, a five-agent remediation swarm running on Cloud Run, and a dashboard that shows what the system did, why, what it changed and what it cost. Agents hand off through strict typed schemas and the pipeline fails closed if any stage does not report success.',
    features: [
      'Shared tracing library stamping every log line with a standard trace ID, with no call-site changes',
      'Five specialist agents: log triage, code retrieval, fix authoring, independent review and Git operations',
      'Independent review agent that must approve before any change reaches source control',
      'Token circuit breaker that halts a run at a per-incident budget',
      'Fail-closed pipeline with typed hand-offs between every stage',
      'Incident dashboard with agent timeline, before-and-after diff and per-agent cost',
    ],
    capabilities: [
      'Workflow Automation',
      'AI Integrations',
      'Monitoring & Observability',
      'Cloud Solutions',
      'Architecture',
    ],
    technologies: ['Google ADK', 'Claude via Vertex AI', 'FastAPI', 'Cloud Run', 'OpenTelemetry', 'Next.js'],
    outcomes: [
      'Engineers receive a reviewed pull request with a root-cause explanation, rather than only an alert.',
      'Every automated change is checked by a separate review agent before it reaches source control, so the author of a change is never its only reviewer.',
      'Token spend is capped per incident and reported per agent, so an autonomous run cannot produce an open-ended bill.',
    ],
    scope:
      'Product ownership, solution architecture, agent workflow design, observability dashboard, delivery.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'data-bi-modernization',
    title: 'Data & BI Modernization',
    status: 'client',
    category: 'data-analytics',
    industry: 'media-publishing',
    primaryService: 'data-analytics',
    additionalServices: ['technology-solutions', 'devops-mlops', 'web-applications'],
    featured: true,
    summary:
      'For an established independent book publisher, a decade of accumulated ETL, warehouse and dashboard tools replaced with one governed cloud platform, without breaking a single number the business depended on.',
    challenge:
      'Four disconnected systems had accumulated over a decade: an ETL tool running more than two hundred largely undocumented pipelines, a warehouse with business logic buried in stored procedures, dashboards isolated from daily operations, and a mountain of claims, allocations and reconciliations run by hand in spreadsheets over email. The same question could be answered four different ways, and access was managed separately in every system.',
    approach:
      'Reverse-engineer before replacing. Every pipeline was documented and its output validated against the legacy system, so each migration step was a small verified move rather than a leap of faith. Analytics was embedded inside the company portal rather than delivered as a separate tool, and the spreadsheet processes were rebuilt as auditable applications instead of being carried over.',
    solution:
      'A six-layer platform: orchestrated cloud pipelines with validation, logging and retry built in, a single enterprise warehouse holding one set of business rules, embedded analytics and custom APIs, and one portal carrying reports, operational applications and user administration behind role-based access and row-level security.',
    features: [
      'More than 200 legacy pipelines reverse-engineered, validated against legacy output and re-platformed',
      'Single enterprise warehouse replacing four disconnected tools',
      'Embedded analytics delivered inside the company portal rather than a standalone tool',
      'Spreadsheet and email processes rebuilt as auditable workflow applications with roles and approvals',
      'Role-based access and row-level security administered centrally',
      'Three environments with automated CI/CD, build validation and sign-off before every release',
    ],
    capabilities: [
      'Data Engineering',
      'Data Platforms',
      'Data Pipelines',
      'Business Intelligence',
      'Technology Modernization',
      'Dashboards & Reporting',
    ],
    technologies: ['BigQuery', 'Cloud Composer', 'Power BI Embedded', 'React', 'Node.js', 'Python'],
    outcomes: [
      'Four disconnected systems consolidated into one governed platform, with business logic living once instead of in four places.',
      'Manual claims, allocations and reconciliation processes moved from email and spreadsheets into standardized, auditable workflows.',
      'Reporting delivered through the existing portal, removing the need for a separate per-seat analytics license for every business user.',
    ],
    scope:
      'Solution architecture, program leadership, data platform engineering, embedded analytics, application delivery.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'drug-competitor-identification',
    title: 'Drug Competitor Identification',
    status: 'client',
    category: 'ai-automation',
    industry: 'healthcare',
    primaryService: 'ai-automation',
    additionalServices: ['data-analytics', 'technology-solutions'],
    featured: true,
    summary:
      'A brand-intelligence tool that asks a language model who a drug competes with, then checks the answer against regulatory reference data before anyone is asked to trust it.',
    challenge:
      'Establishing that two products genuinely compete takes knowing active ingredient, therapeutic class, route, dosage form and regulatory pathway well enough to defend the judgment. Done by hand, two analysts researching the same drug could reach two different answers. Authoritative pharmacological facts sat in public regulatory data while the organization’s own competitive knowledge sat in a separate internal list, and nothing reconciled the two.',
    approach:
      'Separate recall from trust. Let the language model propose candidates from everything on the web, because that is what it is good at, then let an explainable point system decide which candidates count as verified, because that has to be repeatable. Keep every unverified candidate visible rather than quietly dropping it, and give the analyst the final edit.',
    solution:
      'A three-node analysis workflow behind a single search box: look the seed drug up in regulatory reference data, ask a search-grounded model for candidates, then score each candidate against the seed on identifier, class, route and pathway. Candidates reaching the scoring threshold are marked verified; the rest stay on screen, flagged.',
    features: [
      'Search-grounded model proposes candidates but never decides which ones count',
      'Explainable point-based rubric scored against regulatory reference data',
      'Unverified candidates stay visible and flagged rather than being dropped',
      'Analyst edits write straight back to the organization’s ground-truth list',
      'Strictly linear workflow where any error stops the run rather than degrading silently',
      'Reconciliation between public regulatory facts and internal competitive intelligence',
    ],
    capabilities: [
      'Generative AI',
      'Intelligent Search',
      'AI Integrations',
      'Data Integration',
      'Data Analytics',
    ],
    technologies: ['LangGraph', 'Gemini', 'BigQuery', 'FastAPI', 'React'],
    outcomes: [
      'A competitor list is produced from a single drug name, with the evidence behind each verification visible on screen.',
      'The same drug scored twice returns the same result, because the decision rubric is fixed rather than left to the model.',
      'Analyst corrections update the organization’s ground-truth list directly, so curation and research happen in one place.',
    ],
    scope:
      'Product ownership, solution architecture, retrieval and verification design, analyst experience, delivery.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'ai-agents-platform',
    title: 'AI Agents Platform',
    status: 'client',
    category: 'ai-automation',
    industry: 'healthcare',
    primaryService: 'ai-automation',
    additionalServices: ['technology-solutions', 'devops-mlops'],
    featured: true,
    summary:
      'Seven agents that turn one upload into a recorded, print-ready batch of personalized posters, with a reviewer approving anything that carries commercial risk.',
    challenge:
      'Every personalized poster was assembled by hand. Up to a dozen sections had to fit a fixed layout to the pixel, for every single recipient, and each one needed its own set of tracked codes. Nothing reliably recorded which poster or which incentive went to whom, and a single wrong incentive code awards the wrong points to the wrong person, which is a commercial error rather than a cosmetic one.',
    approach:
      'Automate aggressively in the mechanical middle and stay deliberately conservative at the two points where a mistake is expensive: an incentive that awards points, and a poster that prints without a working code. Store layouts and validation rules as data rather than design files, so the business can change what a valid poster looks like without waiting for a release.',
    solution:
      'Seven agents sharing one blueprint, each with its own screen and a single job: dashboard, template management, input validation, code generation, poster assembly, incentive activation and a metadata registry. An upload returns a job number immediately and the heavy work runs in the background, ending in one recorded, downloadable batch.',
    features: [
      'Layouts and input validation rules stored as configuration, changeable by the business without a release',
      'Tracked codes generated per recipient and location, with the run stopping rather than printing without one',
      'Background execution returning a job number immediately on upload',
      'Idempotent generation, so re-running the same file replaces rather than duplicates a batch',
      'Human approval gate before any incentive is sent onward',
      'Registry recording every code, poster and layout version for support and audit',
    ],
    capabilities: [
      'Workflow Automation',
      'AI Integrations',
      'Document Intelligence',
      'Custom Systems',
      'Backend Engineering',
    ],
    technologies: ['Google Cloud', 'Python', 'React', 'Cloud Storage', 'Agent workflows'],
    outcomes: [
      'A batch that previously required a designer per recipient now starts from one upload and returns a print-ready package.',
      'Every code, poster and layout version is recorded, so any run can be reconstructed after the fact.',
      'Incentives cannot reach the partner without a named reviewer approving them first.',
    ],
    scope:
      'Product ownership, solution architecture, agent design, validation and approval workflow, delivery.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'recruitment-analytics-decision-support',
    title: 'Recruitment Analytics & Decision Support',
    status: 'client',
    category: 'data-analytics',
    industry: 'professional-services',
    primaryService: 'data-analytics',
    additionalServices: ['ai-automation'],
    featured: true,
    summary:
      'A decision-support layer over a staffing platform, turning candidate, requirement and recruiter activity into KPIs that mean the same thing whoever is looking at them.',
    challenge:
      'Recruiters could source, submit and place candidates every day, but management could not see the funnel behind those actions: which requirements were aging, which clients were slow to respond, or why a requirement with plenty of submissions still had not closed. Three teams computed time-to-fill three different ways and all three defended their number.',
    approach:
      'Model once and let the KPI layer drive every dashboard. Define each metric centrally, compute it in one place, and have every report consume it rather than recalculate it. Then use the same governed model that reports what happened to score which open requirements are likely to miss their target date.',
    solution:
      'A star schema covering the recruitment lifecycle, a central measure layer holding more than fifty standardized KPIs, data quality rules that run before data reaches a dashboard, and predictive models scoring fill probability, candidate success and at-risk requirements. Six role-scoped dashboards read from the same model.',
    features: [
      'Star schema of fact and dimension tables covering the full recruitment lifecycle',
      'More than 50 standardized KPIs computed centrally and consumed, never recalculated per report',
      'Data quality rules for duplicates, missing fields, orphans and invalid dates, run before reporting',
      'Stage-level conversion and drop-off visible per requirement',
      'Predictive scoring for fill probability, candidate success and at-risk requirements',
      'Six role-scoped dashboards reading from one governed model',
    ],
    capabilities: [
      'Business Intelligence',
      'Dashboards & Reporting',
      'Data Analytics',
      'Data Science / Machine Learning',
      'Data Engineering',
    ],
    technologies: ['SQL', 'Power BI', 'DAX', 'Python', 'scikit-learn'],
    outcomes: [
      'One definition per KPI, enforced centrally and traceable back to its source tables, replacing three competing versions of time-to-fill.',
      'Aging cohorts and escalation flags refresh daily instead of being rebuilt by hand each week.',
      'The same governed layer that reports the funnel also scores which requirements are at risk, so reporting and prediction share one model.',
    ],
    scope:
      'Data modeling, KPI definition, BI development, predictive modeling, product analytics.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'medical-data-intelligence-platform',
    title: 'Medical Data Intelligence Platform',
    status: 'client',
    category: 'data-analytics',
    industry: 'healthcare',
    primaryService: 'data-analytics',
    additionalServices: ['ai-automation'],
    featured: true,
    summary:
      'Reporting, prediction and document processing for a medical data platform, delivered with a cross-functional business intelligence, data engineering and machine learning team.',
    challenge:
      'Medical data arrives in formats built for people rather than systems: documents, attachments and email threads alongside structured records. Reporting, forecasting and document handling had grown up separately, so the same information was re-entered and re-reconciled in several places before anyone could act on it.',
    approach:
      'Treat the document pipeline and the reporting layer as one problem rather than two. Extract structure from documents at the point of arrival, validate and reconcile it against existing records, and build the reporting and prediction layers on the governed result rather than on raw feeds.',
    solution:
      'Optical character recognition and automated processing for inbound documents and email, validation and reconciliation workflows, a governed reporting layer, and sales prediction models built on top of the same data foundation.',
    features: [
      'Optical character recognition for inbound document processing',
      'Automated email and document handling workflows',
      'Validation and reconciliation before data reaches reporting',
      'Sales prediction models built on the governed data layer',
      'Reporting suite covering operational and commercial views',
      'Data governance layer defining ownership and quality rules',
    ],
    capabilities: [
      'Document Intelligence',
      'Business Intelligence',
      'Data Engineering',
      'Data Science / Machine Learning',
      'Workflow Automation',
    ],
    technologies: ['Power BI', 'Python', 'OCR', 'SQL'],
    outcomes: [
      'Inbound documents are converted into structured, validated records instead of being re-keyed by hand.',
      'Reporting and prediction read from one governed data layer rather than from separate feeds.',
      'Validation and reconciliation run as defined workflow steps with an auditable trail.',
    ],
    scope:
      'Requirements, solution design, BI development, document processing pipeline, predictive modeling.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },

  /* ==================================================================
   * MORE DELIVERED WORK
   * ================================================================== */

  {
    slug: 'ecommerce-analytics-platform',
    title: 'E-Commerce Analytics Platform',
    status: 'client',
    category: 'data-analytics',
    industry: 'retail-commerce',
    primaryService: 'data-analytics',
    additionalServices: ['technology-solutions'],
    featured: false,
    summary:
      'For an online retailer, an analytics platform that brings order, product and customer data into one governed view, so trading meetings start from agreed numbers.',
    challenge:
      'Retail teams typically read performance from several disconnected places: the storefront, the payment provider, the warehouse system and a spreadsheet. The numbers rarely agree, so most meetings start by arguing about which figure is correct instead of deciding what to do.',
    approach:
      'Model the business first: define what an order, a customer and a product actually mean, then design pipelines around those definitions rather than around whichever system happens to hold the data.',
    solution:
      'A batch and near-real-time pipeline that consolidates transactional data into a governed warehouse, with a semantic layer on top so every dashboard derives its numbers from the same definitions.',
    features: [
      'Scheduled ingestion from storefront, payments and fulfillment systems',
      'Governed metric definitions shared across all reporting',
      'Data quality checks with alerting on pipeline failure',
      'Operational dashboard for daily trading decisions',
      'Historical snapshots for period-on-period comparison',
    ],
    capabilities: ['Data Engineering', 'Data Pipelines', 'Business Intelligence', 'Dashboards & Reporting'],
    technologies: ['Python', 'Apache Airflow', 'PostgreSQL', 'Tableau'],
    outcomes: [
      'Trading and marketing teams work from one agreed set of metric definitions.',
      'Weekly reporting that used to be reconciled by hand across systems is produced from the warehouse.',
      'Data quality failures raise an alert before they reach a dashboard.',
    ],
    scope: 'Data architecture, pipeline engineering, semantic modeling, dashboard design.',
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
    status: 'client',
    category: 'ai-automation',
    industry: 'technology-saas',
    primaryService: 'ai-automation',
    additionalServices: ['data-analytics', 'devops-mlops'],
    featured: true,
    summary:
      'For a subscription software business, a churn model that flags drifting accounts early enough for the customer success team to act, with the reasons behind every score.',
    challenge:
      'Subscription businesses usually learn about churn after it has happened, from a cancellation report. By then the relationship is over and the only remaining option is a discount.',
    approach:
      'Treat churn as an operational problem rather than a modeling exercise: work out who will act on the prediction, how much notice they need, and what they can realistically do with it. Then build backward from there.',
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
    technologies: ['Python', 'scikit-learn', 'pandas', 'NumPy'],
    outcomes: [
      'Customer success teams receive a ranked list of at-risk accounts ahead of renewal, instead of learning about churn from the cancellation report.',
      'Every risk score arrives with the factors that drove it, written in business language rather than feature names.',
      'Drift and model quality are tracked after deployment, with scheduled retraining instead of a model left to go stale.',
    ],
    scope: 'Feature engineering, model development, evaluation, deployment and monitoring design.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'corporate-website-redesign',
    title: 'Corporate Website Redesign',
    status: 'client',
    category: 'websites',
    industry: 'professional-services',
    primaryService: 'websites',
    additionalServices: ['digital-marketing-seo'],
    featured: true,
    summary:
      'For an established professional services firm, a rebuilt corporate website organized around the questions clients arrive with, and editable by the firm without a developer.',
    challenge:
      'Long-established firms often accumulate a website rather than design one. Services are described in internal language, the structure mirrors the org chart instead of the visitor, and the inquiry route is buried.',
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
      'Navigation and service pages are organized around visitor intent rather than the firm’s internal structure.',
      'Every page carries a consistent route into an inquiry, handled by a validated server endpoint.',
      'The marketing team edits content through a structured CMS, so copy changes no longer need a release.',
    ],
    scope: 'Discovery, information architecture, UX/UI design, frontend engineering, launch.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'realtime-data-streaming-platform',
    title: 'Real-Time Data Streaming Platform',
    status: 'client',
    category: 'digital-platforms',
    industry: 'logistics',
    primaryService: 'technology-solutions',
    additionalServices: ['data-analytics', 'devops-mlops'],
    featured: false,
    summary:
      'For a logistics operator, an event streaming platform that puts vehicle, depot and order events in front of dispatch while they can still be acted on.',
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
      'Dispatch sees delivery exceptions as they happen, not in the next morning’s report.',
      'New consumers subscribe to the event stream without changes to the systems that produce events.',
      'Recovery and backfill are a replay from retained history rather than a manual reconstruction.',
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
    status: 'client',
    category: 'ai-automation',
    industry: 'retail-commerce',
    primaryService: 'ai-automation',
    additionalServices: ['ecommerce', 'data-analytics'],
    featured: false,
    summary:
      'For a retailer with a large catalog, a recommendation engine that helps customers find relevant products, gives new listings a route to visibility and keeps merchandisers in control.',
    challenge:
      'A large catalog is only an advantage if customers can navigate it. Generic "customers also bought" strips tend to recommend what is already popular, which does nothing for discovery or for slower-moving stock.',
    approach:
      'Blend behavioral signals with product attributes so the system has something sensible to say about items with little history, and keep the ranking explainable enough for merchandisers to trust and override.',
    solution:
      'A hybrid collaborative and content-based ranker served behind a low-latency API, with cached candidate sets, merchandiser override rules and an experimentation path for comparing strategies.',
    features: [
      'Hybrid behavioral and attribute-based ranking',
      'Cold-start handling for new and low-traffic products',
      'Low-latency serving with cached candidate generation',
      'Merchandiser override and business rules layer',
      'Experiment framework for comparing ranking strategies',
    ],
    capabilities: ['Machine Learning', 'AI Features', 'Intelligent Search', 'AI Integrations'],
    technologies: ['Python', 'TensorFlow', 'Redis', 'FastAPI'],
    outcomes: [
      'Recommendations draw on product attributes as well as behavior, so new and low-traffic products can still be recommended.',
      'Merchandisers pin, exclude and boost products through a rules layer that sits above the model.',
      'Ranking strategies are compared through controlled experiments before they are rolled out.',
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
    status: 'client',
    category: 'web-applications',
    industry: 'technology-saas',
    primaryService: 'web-applications',
    additionalServices: ['technology-solutions', 'devops-mlops'],
    featured: false,
    summary:
      'For a SaaS business, a multi-tenant product foundation covering accounts, roles, subscription billing and an in-product dashboard, built before feature work began.',
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
      'Accounts, team permissions and billing states were settled first, so later features did not have to revisit who can see what.',
      'Trials, upgrades, downgrades and failed payments run through one subscription lifecycle.',
      'A documented API gives customers a stable surface to integrate against.',
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
    slug: 'image-classification-system',
    title: 'Image Classification System',
    status: 'client',
    category: 'ai-automation',
    industry: 'manufacturing',
    primaryService: 'ai-automation',
    additionalServices: ['devops-mlops'],
    featured: true,
    summary:
      'For a manufacturer, a computer vision system on the production line that flags defects consistently across a full shift and hands uncertain items to an inspector.',
    challenge:
      'Manual visual inspection is consistent for the first hour of a shift and less so by the last. Defects are rare, which makes them both hard to catch and hard to gather training data for.',
    approach:
      'Design for the rare case. Optimize for recall on defects, route anything uncertain to a human, and make every automated decision reviewable after the fact.',
    solution:
      'A convolutional classifier with heavy augmentation for scarce defect classes, served at the line with a confidence threshold that escalates uncertain items to an inspector, and a feedback loop that returns reviewed cases to training.',
    features: [
      'Augmentation strategy for scarce defect classes',
      'Confidence thresholds with escalation to a human inspector',
      'Reviewable decision history for every classified item',
      'Feedback loop returning reviewed cases into training data',
      'Containerized deployment at the production line',
    ],
    capabilities: ['Machine Learning', 'AI Features', 'Model Deployment', 'Model Monitoring'],
    technologies: ['PyTorch', 'OpenCV', 'Flask', 'Docker'],
    outcomes: [
      'Inspection applies the same standard in the last hour of a shift as in the first.',
      'Items the model is unsure about are escalated to an inspector instead of being guessed.',
      'Every inspector review returns to the training set, so the model learns most from the cases it found hardest.',
    ],
    scope: 'Vision model development, threshold and escalation design, edge deployment, monitoring.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  {
    slug: 'portfolio-website',
    title: 'Creative Portfolio Website',
    status: 'client',
    category: 'websites',
    industry: 'other',
    primaryService: 'websites',
    additionalServices: ['digital-marketing-seo'],
    featured: true,
    summary:
      'For a creative studio, an image-led portfolio website where the work is the interface, with the complete experience preserved for visitors who prefer reduced motion.',
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
      'Image optimization and lazy loading throughout',
      'Structured project data so new work is a content change',
    ],
    capabilities: ['Premium Brand Websites', 'Content-Driven Websites', 'Conversion Optimization'],
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite'],
    outcomes: [
      'Project imagery leads every page, with the interface kept deliberately quiet around it.',
      'The complete experience works with animation switched off.',
      'New work is published by adding content, without a code change or a deployment.',
    ],
    scope: 'Art direction, UX/UI design, frontend engineering, performance optimization.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: true,
    permissionsApproved: true,
  },
  /* ==================================================================
   * SECTOR DRAFTS — written for sectors that have no published work yet.
   * NOT PUBLISHED. Each stays `published: false` until the Product Owner
   * confirms it describes a real engagement and corrects the details to
   * match. Never flip these on to fill a sector page.
   * ================================================================== */

  {
    slug: 'lending-operations-portal',
    title: 'Lending Operations Portal',
    status: 'client',
    category: 'web-applications',
    industry: 'financial-services',
    primaryService: 'web-applications',
    additionalServices: ['data-analytics', 'technology-solutions'],
    featured: false,
    summary:
      'For a lending business, an operations portal that brings applications, documents, maker-checker approvals and reporting into one audited workflow.',
    challenge:
      'Applications moved between email, shared folders and spreadsheets. Each step worked on its own, but nobody could show who approved what, when, and on which version of the documents.',
    approach:
      'Treat auditability and access control as the structure of the system rather than features added later. Model the workflow first, then build screens on top of it.',
    solution:
      'A role-based portal covering intake, document checklists, verification and maker-checker approval, backed by an append-only audit log and operations reporting.',
    features: [
      'Application intake with validation and product-specific document checklists',
      'Maker-checker approvals that keep preparer and approver separate',
      'Append-only audit trail of every action and document version',
      'Role-based access to applications and documents',
      'Operations reporting on pipeline, aging and exceptions',
    ],
    capabilities: ['Workflow Applications', 'Admin Platforms', 'Dashboards', 'Business Intelligence'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Power BI'],
    outcomes: [
      'Every application has one record and one status, instead of a trail across inboxes and folders.',
      'Approvals are tied to a named approver and to the exact documents they reviewed.',
      'Operations reporting is available at any time, not compiled at month end.',
    ],
    scope: 'Workflow design, application architecture, full-stack engineering, reporting.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: false,
    permissionsApproved: false,
  },
  {
    slug: 'property-listings-platform',
    title: 'Property Listings & Inquiry Platform',
    status: 'client',
    category: 'websites',
    industry: 'real-estate',
    primaryService: 'websites',
    additionalServices: ['web-applications', 'digital-marketing-seo'],
    featured: false,
    summary:
      'For a property agency, a listings website with structured search, side-by-side comparison, saved searches and inquiries routed straight to the responsible agent.',
    challenge:
      'Listings were published as PDFs and images, inquiries landed in one shared inbox, and buyers had no way to keep a shortlist across the months a property decision takes.',
    approach:
      'Structure the listing data first so search and comparison work, then design an image-led experience around it that gives buyers a reason to come back.',
    solution:
      'A headless CMS listing model, a fast image-led frontend with filters, map and comparison, saved searches with email alerts, and per-listing inquiry routing.',
    features: [
      'Structured listing model managed by the agency team',
      'Search by location, price, type and features',
      'Side-by-side comparison of shortlisted properties',
      'Saved searches with email alerts for new matches',
      'Inquiries routed to the responsible agent with the listing attached',
    ],
    capabilities: ['Content-Driven Websites', 'Marketing Websites', 'Technical SEO', 'Conversion Optimization'],
    technologies: ['Next.js', 'React', 'Headless CMS', 'PostgreSQL'],
    outcomes: [
      'Buyers filter and compare properties on the details that matter to them.',
      'Inquiries reach the responsible agent directly, with the listing attached.',
      'Saved searches bring buyers back when a new match is listed.',
    ],
    scope: 'Discovery, content modeling, UX/UI design, frontend engineering, launch.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: false,
    permissionsApproved: false,
  },
  {
    slug: 'learning-platform',
    title: 'Learning Platform',
    status: 'client',
    category: 'web-applications',
    industry: 'education',
    primaryService: 'web-applications',
    additionalServices: ['data-analytics'],
    featured: false,
    summary:
      'For a training provider, a learning platform with separate views for learners, educators and administrators, built on one course and progress model.',
    challenge:
      'Course content, enrollment and completion records lived in separate tools. Enrollment was entered by hand, and educators found out a learner had fallen behind only at the end of a course.',
    approach:
      'Build one course and progress model, then give each audience its own view of it rather than its own tool.',
    solution:
      'A catalog, self-service enrollment, lessons and assessments with saved progress, an educator view of cohort progress, and administrator tools for scheduling and completion records.',
    features: [
      'Course catalog with modules, lessons and cohorts',
      'Self-service enrollment with optional approval',
      'Saved progress and in-context assessments for learners',
      'Cohort progress view that surfaces learners who need attention',
      'Completion records and certificates managed in one place',
    ],
    capabilities: ['Customer Portals', 'Workflow Applications', 'Dashboards'],
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    outcomes: [
      'Learners enroll themselves and pick up exactly where they left off.',
      'Educators see who is falling behind while there is still time to help.',
      'Completion records come from the platform, not from assembled spreadsheets.',
    ],
    scope: 'Product design, application architecture, full-stack engineering, reporting.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: false,
    permissionsApproved: false,
  },
  {
    slug: 'hotel-direct-booking',
    title: 'Direct Booking Website for a Hotel Group',
    status: 'client',
    category: 'ecommerce',
    industry: 'hospitality',
    primaryService: 'ecommerce',
    additionalServices: ['websites', 'digital-marketing-seo'],
    featured: false,
    summary:
      'For a group of hotels, an image-led website with availability, rooms, offers and secure payment inside the brand experience, managed once across every property.',
    challenge:
      'Most reservations came through third-party booking sites. Guests who reached the brand website were handed off to a generic booking page at the last step, and each property’s content was maintained separately.',
    approach:
      'Keep the whole journey inside the brand, from inspiration to confirmation, and give the group one content structure that still lets each property keep its character.',
    solution:
      'A multi-property website with integrated availability and rates, room and offer selection, secure checkout through a payment gateway, instant confirmation and booking-funnel analytics.',
    features: [
      'Image-led property pages with a shared multi-property structure',
      'Availability, rates and room selection integrated with the booking engine',
      'Direct-only offers shown at the point of comparison',
      'Secure checkout and instant confirmation',
      'Analytics across the search-to-booking funnel',
    ],
    capabilities: ['E-Commerce Websites', 'Checkout & Payments', 'Payment Integration', 'Premium Brand Websites'],
    technologies: ['Next.js', 'React', 'Headless CMS', 'Payment gateway'],
    outcomes: [
      'Guests search, choose and pay without leaving the brand website.',
      'Offers and property details are managed once for the whole group.',
      'The booking funnel is measured from first search to confirmation.',
    ],
    scope: 'Discovery, UX/UI design, booking integration, frontend engineering, analytics.',
    heroImage: null,
    gallery: [],
    clientName: null,
    clientLogo: null,
    externalUrl: null,
    githubUrl: null,
    published: false,
    permissionsApproved: false,
  },
]

/**
 * Each project carries the parts of its case study that cards draw (the
 * delivery flow and architecture layers, from caseStudyVisuals.js). The
 * long-form case study in caseStudies.js is merged on by the project page
 * itself, so it is only downloaded when someone opens a project.
 *
 * PROJECTS ARRAY ORDER IS THE PUBLIC ORDER.
 */
const withCaseStudy = (project) => ({
  ...project,
  caseStudy: caseStudyVisuals[project.slug] ?? null,
})

/* ---------------------------------------------------------------- selectors */

/** Only ever render from this list on public pages. */
export const publishedProjects = projects.filter((p) => p.published).map(withCaseStudy)

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

/** Featured delivered work (footer links, related lists). */
export const featuredProjects = publishedProjects.filter((p) => p.featured).slice(0, 8)

/** Homepage Selected Work: the three flagship projects, in this order. */
const HOMEPAGE_SLUGS = [
  'ai-log-monitoring-observability-platform',
  'data-bi-modernization',
  'drug-competitor-identification',
]
export const homepageProjects = HOMEPAGE_SLUGS.map((slug) =>
  publishedProjects.find((p) => p.slug === slug)
).filter(Boolean)

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
