import { getStatus, getIndustry, getWorkCategory } from './taxonomy'

/**
 * Single source of truth for the Work area. (Spec §8)
 *
 * TRUTHFULNESS POLICY — Spec §1.2 / §2.1 / §7.2.
 *
 * This file holds two kinds of entry, and they must never be confused:
 *
 * 1. `status: 'confidential'` — REAL delivered work, approved for publication by
 *    the Product Owner, where the client's identity cannot be disclosed. These
 *    carry no client name, no imprint or product names that would identify the
 *    account, and no invented figures. Everything stated is a property of the
 *    system as built.
 *
 * 2. `status: 'concept'` — demonstration projects. None may be presented as
 *    delivered client work. The unverified percentages that previously shipped
 *    in Portfolio.jsx (92% accuracy, 35% churn reduction, 40% conversion
 *    increase, 60% engagement, 25% sales, 45% cost reduction, 96% classification
 *    accuracy) were removed and replaced with conceptual outcome wording.
 *
 * To publish a NAMED client project: set `status: 'client'`, fill `clientName`
 * and `outcomes` with verified figures, set `permissionsApproved: true`, and
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

/** Standard outcome wording for a concept project. (Spec §7.4) */
const conceptual = (text) => `Conceptual outcome - ${text}`

export const projects = [
  /* ==================================================================
   * DELIVERED WORK — confidential client engagements.
   * Approved for publication by the Product Owner. Client names, imprint
   * names and internal product names have been removed; sector remains
   * because it is descriptive rather than identifying.
   * ================================================================== */

  {
    slug: 'ai-log-monitoring-observability-platform',
    title: 'Autonomous AI Log Monitoring & Observability Platform',
    status: 'confidential',
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
    status: 'confidential',
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
      'Reporting delivered through the existing portal, removing the need for a separate per-seat analytics licence for every business user.',
    ],
    scope:
      'Solution architecture, programme leadership, data platform engineering, embedded analytics, application delivery.',
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
    status: 'confidential',
    category: 'ai-automation',
    industry: 'healthcare',
    primaryService: 'ai-automation',
    additionalServices: ['data-analytics', 'technology-solutions'],
    featured: true,
    summary:
      'A brand-intelligence tool that asks a language model who a drug competes with, then checks the answer against regulatory reference data before anyone is asked to trust it.',
    challenge:
      'Establishing that two products genuinely compete takes knowing active ingredient, therapeutic class, route, dosage form and regulatory pathway well enough to defend the judgement. Done by hand, two analysts researching the same drug could reach two different answers. Authoritative pharmacological facts sat in public regulatory data while the organisation’s own competitive knowledge sat in a separate internal list, and nothing reconciled the two.',
    approach:
      'Separate recall from trust. Let the language model propose candidates from everything on the web, because that is what it is good at, then let an explainable point system decide which candidates count as verified, because that has to be repeatable. Keep every unverified candidate visible rather than quietly dropping it, and give the analyst the final edit.',
    solution:
      'A three-node analysis workflow behind a single search box: look the seed drug up in regulatory reference data, ask a search-grounded model for candidates, then score each candidate against the seed on identifier, class, route and pathway. Candidates reaching the scoring threshold are marked verified; the rest stay on screen, flagged.',
    features: [
      'Search-grounded model proposes candidates but never decides which ones count',
      'Explainable point-based rubric scored against regulatory reference data',
      'Unverified candidates stay visible and flagged rather than being dropped',
      'Analyst edits write straight back to the organisation’s ground-truth list',
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
      'Analyst corrections update the organisation’s ground-truth list directly, so curation and research happen in one place.',
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
    status: 'confidential',
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
    status: 'confidential',
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
      'Data modelling, KPI definition, BI development, predictive modelling, product analytics.',
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
    status: 'confidential',
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
      'Requirements, solution design, BI development, document processing pipeline, predictive modelling.',
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
   * CONCEPTS — demonstration projects. Never presented as client work.
   * ================================================================== */

  {
    slug: 'ecommerce-analytics-platform',
    title: 'E-Commerce Analytics Platform',
    status: 'concept',
    category: 'data-analytics',
    industry: 'retail-commerce',
    primaryService: 'data-analytics',
    additionalServices: ['technology-solutions'],
    featured: false,
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
    featured: false,
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
    featured: false,
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
    featured: false,
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
    featured: false,
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
    featured: false,
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
