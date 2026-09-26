/**
 * Long-form content for each service page, keyed by service slug.
 *
 * Kept separate from services.js (titles, capabilities, SEO, navigation) so the
 * short records stay readable. ServiceDetail and the Services hub merge the two
 * at render time.
 *
 * Shape — ServiceDetail {
 *   intro[]        two short paragraphs: what it is and how we think about it
 *   signals[]      "Sound familiar?" problems that bring clients to us
 *   approach[]     how we run this kind of project, in order: { title, text }
 *   outcomes[]     what is different afterward: { title, text }
 *   stack[]        tools we commonly use: { title, items[] }
 *   faqs[]         { question, answer }
 * }
 *
 * No invented figures: outcomes describe what changes, never a percentage.
 */
export const serviceDetails = {
  websites: {
    intro: [
      'Your website is usually the first thing a prospective client, candidate or investor sees, and often the only thing they see before deciding whether to get in touch. It has to explain what you do in seconds, look like the business you are, and make the next step obvious.',
      'We build websites as products rather than brochures: structured around the questions visitors arrive with, fast on every device, editable by your team without a developer, and measured from day one so you know which pages are earning their place.',
    ],
    signals: [
      'The site describes the business the way it was five years ago',
      'Every copy change needs a developer and a wait',
      'Visitors land, look around and leave without getting in touch',
      'It is slow on phones, and search rankings are slipping',
    ],
    approach: [
      {
        title: 'Audit and intent mapping',
        text: 'We inventory the current content, analytics and search data, then map the questions each type of visitor arrives with.',
      },
      {
        title: 'Structure before surface',
        text: 'A sitemap, navigation model and page templates are agreed before any visual design, so the design serves the structure.',
      },
      {
        title: 'Design system, then pages',
        text: 'Type, color, spacing and components are defined once. Every page is assembled from reviewed parts, so it stays consistent as it grows.',
      },
      {
        title: 'Build, migrate, measure',
        text: 'Responsive, accessible build on a CMS your team can use, a full redirect map from old URLs, and analytics events defined before launch.',
      },
    ],
    outcomes: [
      {
        title: 'Clear in seconds',
        text: 'A first-time visitor understands what you do and who it is for without scrolling.',
      },
      {
        title: 'Owned by your team',
        text: 'Pages, copy and images are updated in the CMS, without a ticket or a release.',
      },
      {
        title: 'Built to be found',
        text: 'Technical SEO, metadata and structured data are part of the build, not an afterthought.',
      },
      {
        title: 'Every page leads somewhere',
        text: 'A consistent, measured route into an inquiry from every page on the site.',
      },
    ],
    stack: [
      { title: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
      { title: 'Content', items: ['Headless CMS', 'Structured content types', 'Image pipeline'] },
      { title: 'Delivery', items: ['Static rendering', 'Edge caching', 'Preview deployments'] },
      { title: 'Measurement', items: ['Analytics events', 'Search Console', 'Conversion tracking'] },
    ],
    faqs: [
      {
        question: 'Can we update the website ourselves after launch?',
        answer:
          'Yes. Content lives in a CMS with structured fields, so your team edits pages without touching code and without breaking the design.',
      },
      {
        question: 'Will we lose our search rankings when the site changes?',
        answer:
          'Not if the move is planned. We map every old URL to its new home, keep metadata, and check the site is crawlable before and after launch.',
      },
      {
        question: 'Do you write the content?',
        answer:
          'We structure it, edit it and write where needed, working from your expertise. The best website copy comes from the people who know the business.',
      },
      {
        question: 'Which CMS do you use?',
        answer:
          'Whichever fits your team. We usually recommend a headless CMS for flexibility and speed, but we choose based on who will edit the site and how often.',
      },
    ],
  },

  'web-applications': {
    intro: [
      'A web application is where your business actually happens: a customer portal, an internal tool that replaces a spreadsheet, a dashboard your managers open every morning, or a SaaS product your customers pay for.',
      'We design applications around the workflow first, then the screens. That means understanding who does what, in what order, with what data and what permissions, before building anything, so the result fits how your business actually works and can keep changing with it.',
    ],
    signals: [
      'Critical processes run on spreadsheets, email and memory',
      'Customers call or email for things they should be able to do themselves',
      'Your current system is hard to change and nobody wants to touch it',
      'Different teams keep their own copy of the same data',
    ],
    approach: [
      {
        title: 'Map the workflow',
        text: 'Who does what, in what order, with which data and which permissions. Written down and agreed before design starts.',
      },
      {
        title: 'Model the data and roles',
        text: 'Entities, relationships, states and access rules are designed first, because they are the hardest things to change later.',
      },
      {
        title: 'Prototype the critical path',
        text: 'The screens that matter most are prototyped and tested with real users before the rest of the application is built.',
      },
      {
        title: 'Ship in increments',
        text: 'Working software in small, reviewed releases through preview environments, with automated tests on every change.',
      },
    ],
    outcomes: [
      {
        title: 'One source of truth',
        text: 'Data lives in one system with clear ownership, instead of copies in spreadsheets and inboxes.',
      },
      {
        title: 'Self-service for customers',
        text: 'Routine requests are handled in the portal, so your team spends time on the exceptions.',
      },
      {
        title: 'Access that matches roles',
        text: 'People see and change exactly what their role allows, with an audit trail of who did what.',
      },
      {
        title: 'Easy to extend',
        text: 'A documented codebase and API, so new features do not mean a rewrite.',
      },
    ],
    stack: [
      { title: 'Frontend', items: ['React', 'TypeScript', 'Next.js'] },
      { title: 'Backend', items: ['Node.js', 'Python', 'FastAPI', 'REST and GraphQL APIs'] },
      { title: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
      { title: 'Platform', items: ['Authentication and SSO', 'Role-based access', 'CI/CD', 'Cloud hosting'] },
    ],
    faqs: [
      {
        question: 'Should we buy off-the-shelf software instead?',
        answer:
          'Often, yes. If a product fits your process closely, buy it. We build when the workflow is a competitive advantage, or when adapting a product costs more than building the right thing.',
      },
      {
        question: 'Can you integrate with the systems we already use?',
        answer:
          'Yes. Most applications we build connect to existing CRMs, ERPs, payment providers, identity providers or data warehouses through their APIs.',
      },
      {
        question: 'Who owns the code?',
        answer:
          'Ownership is set out in the engagement agreement. Our standard approach is that the application and its code are delivered to you, with documentation.',
      },
      {
        question: 'Can we start small?',
        answer:
          'Yes, and we recommend it. A first release that covers the most valuable workflow gets real feedback sooner than a complete system delivered at once.',
      },
    ],
  },

  ecommerce: {
    intro: [
      'Commerce is measured continuously, which makes it unusually honest. Catalog structure, search quality, product pages and checkout each show up directly in revenue, and each can be improved deliberately.',
      'We build storefronts and the systems behind them: catalog and inventory, payments, order management and the integrations that connect them to fulfillment and finance. Whether that means a platform like Shopify or a custom build depends on your range, your markets and how different your process really is.',
    ],
    signals: [
      'Customers struggle to find the right product in a large catalog',
      'Checkout abandonment is high and nobody knows exactly why',
      'Stock levels in the store do not match the warehouse',
      'Orders are copied by hand between systems',
    ],
    approach: [
      {
        title: 'Understand how customers buy',
        text: 'Search terms, navigation paths and abandonment points tell us where the current experience loses people.',
      },
      {
        title: 'Structure the catalog',
        text: 'Categories, attributes and filters designed around how customers compare products, not how the warehouse stores them.',
      },
      {
        title: 'Remove friction from checkout',
        text: 'Guest checkout, clear costs, local payment methods and as few steps as possible.',
      },
      {
        title: 'Connect the back office',
        text: 'Inventory, orders, payments and fulfillment integrated, so the store and operations always agree.',
      },
    ],
    outcomes: [
      {
        title: 'Products that are easy to find',
        text: 'Search, filters and navigation that match how customers actually look for things.',
      },
      {
        title: 'A shorter path to purchase',
        text: 'Fewer steps and fewer surprises between adding to cart and paying.',
      },
      {
        title: 'Operations in sync',
        text: 'Stock, orders and payments flow between systems without re-keying.',
      },
      {
        title: 'Decisions from data',
        text: 'Trading dashboards built on reliable order, product and customer data.',
      },
    ],
    stack: [
      { title: 'Platforms', items: ['Shopify', 'Headless commerce', 'Custom storefronts'] },
      { title: 'Frontend', items: ['Next.js', 'React', 'Search and filtering'] },
      { title: 'Payments', items: ['Stripe', 'Razorpay', 'Regional payment methods'] },
      { title: 'Integrations', items: ['Inventory and ERP', 'Shipping and fulfillment', 'Analytics'] },
    ],
    faqs: [
      {
        question: 'Shopify or a custom build?',
        answer:
          'For most retailers, a well-configured platform is the right start. Custom builds make sense for unusual products, complex pricing, marketplaces or deep integration needs.',
      },
      {
        question: 'Can you move our store to a new platform?',
        answer:
          'Yes. We migrate products, customers and order history, keep URLs and search rankings intact, and run both systems side by side until the switch.',
      },
      {
        question: 'Which payment providers do you support?',
        answer:
          'Most major international and Indian providers. We choose based on your markets, currencies and the payment methods your customers expect.',
      },
    ],
  },

  'ai-automation': {
    intro: [
      'AI is useful when it takes over a specific, well-understood piece of work: reading documents, answering questions from your own knowledge, triaging incidents, drafting first versions or checking data against rules. It is much less useful as a general ambition.',
      'We start from the task, not the model. We look for work that is repetitive, rule-shaped or buried in unstructured text, build the system around it with clear boundaries, and keep a person in charge wherever a mistake is expensive. Every system we build shows its evidence and logs what it did.',
    ],
    signals: [
      'Skilled people spend hours reading, copying and checking documents',
      'Answers exist somewhere in your files, but nobody can find them quickly',
      'The same investigation is repeated every time something breaks',
      'You have tried an AI pilot that was impressive in a demo and unreliable in practice',
    ],
    approach: [
      {
        title: 'Pick the right task',
        text: 'We identify work where AI can be checked: clear inputs, a definition of a good result, and a person who can review it.',
      },
      {
        title: 'Ground it in your data',
        text: 'Retrieval over your documents and systems, or verification against reference data, so answers can be traced to a source.',
      },
      {
        title: 'Design the guardrails',
        text: 'Typed outputs, validation, cost limits, human approval where it matters, and a full log of every run.',
      },
      {
        title: 'Evaluate, then scale',
        text: 'Test sets and review of real outputs before rollout, and monitoring of quality and cost afterward.',
      },
    ],
    outcomes: [
      {
        title: 'Hours returned to experts',
        text: 'Repetitive reading, sorting and drafting handled by the system, reviewed by people.',
      },
      {
        title: 'Answers with sources',
        text: 'Every result shows the evidence behind it, so people can trust it or correct it.',
      },
      {
        title: 'People stay in charge',
        text: 'Approval gates where decisions carry risk, so AI prepares and people decide.',
      },
      {
        title: 'Predictable cost',
        text: 'Usage and spend are capped and reported, so an automated run cannot become an open-ended bill.',
      },
    ],
    stack: [
      { title: 'Models', items: ['Claude', 'Gemini', 'OpenAI models', 'Open-source models'] },
      { title: 'Orchestration', items: ['LangGraph', 'Google ADK', 'Agent workflows', 'Typed schemas'] },
      { title: 'Knowledge', items: ['Retrieval and vector search', 'Document parsing and OCR', 'BigQuery'] },
      { title: 'Operations', items: ['Evaluation sets', 'Observability', 'Cost controls', 'Cloud Run'] },
    ],
    faqs: [
      {
        question: 'Is our data used to train the AI model?',
        answer:
          'No. We use enterprise model access where your data is not used for training, and keep documents in your own cloud where possible.',
      },
      {
        question: 'What if the AI gets something wrong?',
        answer:
          'We design for it. Outputs are validated, uncertain cases are flagged or routed to a person, and anything with commercial or clinical risk needs human approval.',
      },
      {
        question: 'Do we need a lot of data to start?',
        answer:
          'Usually not. Most practical AI systems use existing models with your documents and rules, rather than training a model from scratch.',
      },
      {
        question: 'How do we know it is working?',
        answer:
          'Every system ships with an evaluation set and monitoring, so quality is measured against real examples rather than judged by impression.',
      },
    ],
  },

  'data-analytics': {
    intro: [
      'Most organizations do not lack data. They lack data they trust. When the same question gets different answers depending on who runs the report, meetings turn into arguments about the numbers instead of decisions.',
      'We build the foundations that fix that: pipelines that move data reliably, a warehouse that holds one set of business rules, metrics defined once and used everywhere, and dashboards designed around the decisions people actually make. Where it helps, we add forecasting and prediction on the same governed data.',
    ],
    signals: [
      'Two reports give two different answers to the same question',
      'Month-end reporting is assembled by hand in spreadsheets',
      'Dashboards exist, but people still export to Excel',
      'Legacy ETL jobs nobody fully understands keep breaking',
    ],
    approach: [
      {
        title: 'Agree the definitions',
        text: 'Every key metric is defined once, with the people who own it, before any pipeline is built.',
      },
      {
        title: 'Build reliable pipelines',
        text: 'Orchestrated, tested and monitored data movement, with validation before anything reaches a report.',
      },
      {
        title: 'Model for questions',
        text: 'A warehouse and semantic layer designed around the questions the business asks, not the shape of the source systems.',
      },
      {
        title: 'Report for decisions',
        text: 'Dashboards built for a specific audience and decision, with row-level security and a clear owner.',
      },
    ],
    outcomes: [
      {
        title: 'One version of the truth',
        text: 'Every report reads from the same governed definitions.',
      },
      {
        title: 'Reporting without the scramble',
        text: 'Scheduled, validated data replaces manual reconciliation.',
      },
      {
        title: 'Problems caught early',
        text: 'Failed or suspicious loads raise an alert before anyone sees a wrong number.',
      },
      {
        title: 'Ready for prediction',
        text: 'Forecasting and machine learning built on the same trusted foundation.',
      },
    ],
    stack: [
      { title: 'Warehouse', items: ['BigQuery', 'Snowflake', 'PostgreSQL', 'SQL Server'] },
      { title: 'Pipelines', items: ['Airflow and Cloud Composer', 'dbt', 'Python'] },
      { title: 'BI', items: ['Power BI', 'Tableau', 'Looker', 'DAX'] },
      { title: 'Data science', items: ['pandas', 'scikit-learn', 'Forecasting models'] },
    ],
    faqs: [
      {
        question: 'Can you work with our existing BI tool?',
        answer:
          'Yes. We work with Power BI, Tableau, Looker and others. The tool matters less than the data model and definitions underneath it.',
      },
      {
        question: 'Do we have to replace our legacy systems first?',
        answer:
          'No. We usually migrate in steps, validating each pipeline against the legacy output, so reporting never goes dark during the move.',
      },
      {
        question: 'How do you handle data security?',
        answer:
          'Access is role-based and, where needed, row-level. Sensitive data is masked or excluded, and every environment is set up with least-privilege permissions.',
      },
    ],
  },

  'technology-solutions': {
    intro: [
      'Some requirements do not fit any product: an integration between systems that were never meant to talk, a platform that has to carry an unusual business model, or a legacy system that the business still depends on but cannot change.',
      'This is the backend work that lets everything else move. We design architecture and APIs, connect systems, move workloads to the cloud and modernize legacy platforms in steps, so the business keeps running while the technology underneath it changes.',
    ],
    signals: [
      'Systems that should share data are connected by manual exports',
      'A legacy platform is too risky to change and too important to replace',
      'Cloud costs keep growing without a clear reason',
      'Partners want an API and you do not have one',
    ],
    approach: [
      {
        title: 'Understand the landscape',
        text: 'Systems, data flows, dependencies and failure points are mapped before we change anything.',
      },
      {
        title: 'Decide and document',
        text: 'Architecture options with their trade-offs written down, so decisions are explicit and reviewable.',
      },
      {
        title: 'Change in safe steps',
        text: 'Incremental migration, feature flags and parallel running, so each step can be verified and reversed.',
      },
      {
        title: 'Make it operable',
        text: 'Monitoring, logging, runbooks and infrastructure as code, so the system can be run by the people who inherit it.',
      },
    ],
    outcomes: [
      {
        title: 'Systems that talk',
        text: 'Integrations replace exports, re-keying and overnight file drops.',
      },
      {
        title: 'Modern without a big bang',
        text: 'Legacy systems modernized step by step, with the business running throughout.',
      },
      {
        title: 'APIs partners can use',
        text: 'Documented, versioned interfaces for internal teams and external partners.',
      },
      {
        title: 'Cloud costs that make sense',
        text: 'Architecture sized for the workload, with visibility of what each part costs.',
      },
    ],
    stack: [
      { title: 'Cloud', items: ['Google Cloud', 'AWS', 'Azure'] },
      { title: 'Services', items: ['Node.js', 'Python', 'Java', 'REST and GraphQL'] },
      { title: 'Integration', items: ['Message queues and Pub/Sub', 'Webhooks', 'ETL and CDC'] },
      { title: 'Infrastructure', items: ['Terraform', 'Docker', 'Kubernetes', 'Cloud Run'] },
    ],
    faqs: [
      {
        question: 'Can you work on a system someone else built?',
        answer:
          'Yes. We start with an audit of the code, infrastructure and documentation, stabilize what is fragile, and only then add features.',
      },
      {
        question: 'Which cloud do you recommend?',
        answer:
          'The one that fits your team, existing contracts and workloads. We work across Google Cloud, AWS and Azure, and avoid lock-in where it matters.',
      },
      {
        question: 'How do you avoid downtime during migration?',
        answer:
          'By migrating in small steps, running old and new side by side, and switching over only when the new path has been verified with real traffic.',
      },
    ],
  },

  'devops-mlops': {
    intro: [
      'The speed of a software team is limited by how safely it can release. If deploying is manual, rare and stressful, every change waits and every release is a risk. The same is true for machine learning models, which also drift and need retraining.',
      'We set up the infrastructure, pipelines and monitoring that make releases routine: environments defined in code, every change tested and deployed the same way, problems detected before customers notice, and models versioned, deployed and watched like any other production service.',
    ],
    signals: [
      'Releases are manual, infrequent and stressful',
      'Staging does not behave like production',
      'Customers report problems before your monitoring does',
      'Models work in a notebook but nobody knows how to run them in production',
    ],
    approach: [
      {
        title: 'Assess the delivery path',
        text: 'From commit to production: every manual step, wait and failure point is mapped.',
      },
      {
        title: 'Infrastructure as code',
        text: 'Environments defined in code and reviewed like code, so staging and production match.',
      },
      {
        title: 'Automate the pipeline',
        text: 'Build, test, security checks and deployment run the same way for every change, with easy rollback.',
      },
      {
        title: 'Observe and improve',
        text: 'Logs, metrics, traces and alerts, plus model monitoring for drift, quality and cost.',
      },
    ],
    outcomes: [
      {
        title: 'Releases become routine',
        text: 'Small, frequent, reversible deployments instead of big, risky ones.',
      },
      {
        title: 'Environments you can trust',
        text: 'What works in staging works in production, because both come from the same code.',
      },
      {
        title: 'Problems found first',
        text: 'Alerts and dashboards that tell you something is wrong before a customer does.',
      },
      {
        title: 'Models in production',
        text: 'Reproducible training, versioned models and monitored serving.',
      },
    ],
    stack: [
      { title: 'CI/CD', items: ['GitHub Actions', 'Cloud Build', 'GitLab CI'] },
      { title: 'Infrastructure', items: ['Terraform', 'Docker', 'Kubernetes', 'Cloud Run'] },
      { title: 'Observability', items: ['OpenTelemetry', 'Cloud Logging', 'Grafana', 'Alerting'] },
      { title: 'MLOps', items: ['Vertex AI', 'MLflow', 'Model registry', 'Drift monitoring'] },
    ],
    faqs: [
      {
        question: 'Do we need Kubernetes?',
        answer:
          'Often not. Managed services like Cloud Run or container services cover most workloads with far less to operate. We recommend Kubernetes only when the scale or requirements justify it.',
      },
      {
        question: 'Can you work with our existing developers?',
        answer:
          'Yes. We set up the pipelines and practices with your team, document them, and hand over so your developers own the process.',
      },
      {
        question: 'How do you handle security in the pipeline?',
        answer:
          'Dependency and container scanning, secret management, least-privilege access and review gates are part of the pipeline, not a separate audit.',
      },
    ],
  },

  'digital-marketing-seo': {
    intro: [
      'Being found is an engineering problem as much as a marketing one. Search engines reward sites that are fast, well-structured and clearly about something, and visitors reward pages that answer their question and make the next step easy.',
      'We work on both sides: the technical foundations that let search engines crawl and understand your site, the content structure that matches what people search for, and the measurement that shows which pages and campaigns actually bring inquiries.',
    ],
    signals: [
      'Competitors appear in search results and you do not',
      'Traffic is steady but inquiries are not',
      'Nobody is sure which campaigns actually produce leads',
      'The site is slow and pages are not being indexed',
    ],
    approach: [
      {
        title: 'Technical audit',
        text: 'Crawlability, indexing, speed, structured data and site architecture checked and prioritized.',
      },
      {
        title: 'Search intent and content',
        text: 'Research into what your audience searches for, mapped to pages that answer it.',
      },
      {
        title: 'Conversion paths',
        text: 'Landing pages, calls to action and forms designed and tested to turn visits into inquiries.',
      },
      {
        title: 'Measure and iterate',
        text: 'Events, attribution and reporting that connect search and campaigns to real leads.',
      },
    ],
    outcomes: [
      {
        title: 'Visible for what matters',
        text: 'Pages built to rank for the searches your customers actually make.',
      },
      {
        title: 'A site search engines understand',
        text: 'Fast, crawlable and structured, with clean metadata and structured data.',
      },
      {
        title: 'More visits become inquiries',
        text: 'Clear journeys from landing page to contact.',
      },
      {
        title: 'Spend you can justify',
        text: 'Attribution that shows which channels and campaigns produce leads.',
      },
    ],
    stack: [
      { title: 'Search', items: ['Google Search Console', 'Ahrefs or Semrush', 'Structured data'] },
      { title: 'Analytics', items: ['Google Analytics 4', 'Tag Manager', 'Conversion events'] },
      { title: 'Performance', items: ['Core Web Vitals', 'Lighthouse', 'Image optimization'] },
      { title: 'Campaigns', items: ['Landing pages', 'A/B testing', 'UTM attribution'] },
    ],
    faqs: [
      {
        question: 'How long does SEO take to show results?',
        answer:
          'Technical fixes can show within weeks; content and authority build over months. We report progress against the searches that matter from the start.',
      },
      {
        question: 'Do you run paid advertising?',
        answer:
          'We build and measure the landing pages and tracking that make paid campaigns work, and can work alongside your ad agency or in-house team.',
      },
      {
        question: 'Can you guarantee a first-page ranking?',
        answer:
          'No one honestly can. We can guarantee the technical foundations, a clear content plan and transparent reporting on what is improving.',
      },
    ],
  },
}

export const getServiceDetail = (slug) => serviceDetails[slug] ?? null
