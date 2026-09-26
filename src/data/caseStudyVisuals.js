/**
 * The parts of each case study that project cards draw: the delivery `flow`
 * and the `architecture` layers. (Spec §7.3)
 *
 * Split out of caseStudies.js so that every page (the header lists featured
 * work, the homepage shows cards) does not have to download the long-form
 * case studies. Those load only with the project page, which merges the two
 * back together. The same truthfulness and confidentiality rules as
 * caseStudies.js apply here.
 */

export const caseStudyVisuals = {
  'ai-log-monitoring-observability-platform': {
    flow: [
      { number: '01', title: 'Detect', detail: 'Error, trace ID, alert' },
      { number: '02', title: 'Diagnose', detail: 'Logs, file, criticality' },
      { number: '03', title: 'Fix', detail: 'Source, patch, explanation' },
      { number: '04', title: 'Review', detail: 'Security, syntax, correctness' },
      { number: '05', title: 'Hand off', detail: 'Branch, commit, pull request' },
    ],

    architecture: {
      headline: 'Watch an incident travel through the system.',
      intro:
        'Services log to centralized logging. An error alert reaches a webhook that starts the agent swarm, which reads code from and opens pull requests in source control. A dashboard reads the resulting audit trail.',
      layers: [
        {
          label: '1 · Instrumentation',
          nodes: [
            {
              title: 'Business microservices',
              lines: ['Node and Python services', 'sharing one tracing library'],
            },
            {
              title: 'Structured logging',
              lines: ['JSON, every line stamped', 'with a W3C trace ID'],
            },
          ],
        },
        {
          label: '2 · Ingestion',
          nodes: [
            { title: 'Log-based alert', lines: ['Fires on ERROR severity'] },
            { title: 'Pub/Sub', lines: ['Pushes the event onward'] },
            { title: 'Webhook receiver', lines: ['Skips events with no trace ID', 'Replies instantly'] },
          ],
        },
        {
          label: '3 · Autonomous remediation swarm',
          note: 'Runs in the background on Cloud Run',
          emphasis: true,
          nodes: [
            { title: '1 · Log Analyst', lines: ['Finds service, file and severity'] },
            { title: '2 · Environment', lines: ['Fetches code at the running commit'] },
            { title: '3 · Coder', lines: ['Writes the corrected file'] },
            { title: '4 · Reviewer', lines: ['Independent security and syntax check'] },
            { title: '5 · GitOps', lines: ['Branch, commit and pull request'] },
            { title: 'Token watchdog', lines: ['Circuit breaker at the per-incident cap'] },
          ],
        },
        {
          label: '4 · Insight and hand-off',
          nodes: [
            { title: 'Observability dashboard', lines: ['Timeline, diff and cost', 'behind identity-aware proxy'] },
            { title: 'Source control', lines: ['Reads code, opens pull requests'] },
            { title: 'Engineers and on-call', lines: ['Review, approve and merge'] },
          ],
        },
      ],
      footnote:
        'Every step writes to the audit trail, so the dashboard can reconstruct any incident after the fact without a live session.',
    },
  },

  'data-bi-modernization': {
    flow: [
      { number: '01', title: 'Ingest', detail: 'ERP, publisher and vendor files, APIs' },
      { number: '02', title: 'Orchestrate', detail: 'Cloud DAGs, validate, log, retry' },
      { number: '03', title: 'Warehouse', detail: 'One source of truth' },
      { number: '04', title: 'Deliver', detail: 'Embedded analytics, portal, APIs' },
    ],

    architecture: {
      headline: 'Six layers, one governed pipeline.',
      intro:
        'Data moves from source systems through orchestrated pipelines into the warehouse, then out through analytics and custom APIs into a single portal, the only place business users need to go.',
      layers: [
        {
          label: '1 · Data ingestion',
          nodes: [
            { title: 'ERP', lines: ['General ledger, AR/AP', 'customers, vendors, invoices'] },
            { title: 'Publisher data', lines: ['Titles, sales activity', 'inventory, royalties'] },
            { title: 'Vendor data', lines: ['Master data, purchases', 'performance, payments'] },
            { title: 'Cloud Storage', lines: ['Landing zone for files'] },
            { title: 'APIs', lines: ['Partner and service feeds'] },
          ],
        },
        {
          label: '2 · Data engineering',
          nodes: [
            { title: 'Orchestrated DAGs', lines: ['Scheduled and dependency-aware'] },
            { title: 'Validation', lines: ['Rules run before load, not after'] },
            { title: 'Logging, retry and monitoring', lines: ['Failures surface, not silently pass'] },
          ],
        },
        {
          label: '3 · Data warehouse',
          emphasis: true,
          nodes: [
            {
              title: 'Enterprise warehouse',
              lines: ['Single source of truth', 'One set of business rules'],
            },
          ],
        },
        {
          label: '4 · Analytics and applications',
          nodes: [
            { title: 'Semantic models', lines: ['Built once, reused everywhere'] },
            { title: 'Node and Python APIs', lines: ['Operational services'] },
            { title: 'React applications', lines: ['Workflow and admin apps'] },
          ],
        },
        {
          label: '5 · Company portal',
          nodes: [
            { title: 'Embedded reports', lines: ['Analytics inside the portal'] },
            { title: 'Operational apps', lines: ['Claims, titles, allocations'] },
            { title: 'User admin', lines: ['Role-based access and row-level security'] },
          ],
        },
        {
          label: '6 · End users',
          nodes: [
            { title: 'Business users', lines: ['Access, analyze, operate, collaborate', 'in one place'] },
          ],
        },
      ],
    },
  },

  'drug-competitor-identification': {
    flow: [
      { number: '01', title: 'Search', detail: 'Drug name, regulatory lookup' },
      { number: '02', title: 'Research', detail: 'Model proposes candidates' },
      { number: '03', title: 'Verify', detail: 'Identifier, class, route, pathway' },
      { number: '04', title: 'Reconcile', detail: 'Cross-check, analyst curates' },
    ],

    architecture: {
      headline: 'Five parts, one pipeline.',
      intro:
        'A single-page application, a proxy that handles authentication, a backend running the analysis workflow, a search-grounded model for research, and a warehouse holding both regulatory facts and the organization’s own ground truth.',
      layers: [
        {
          label: '1 · Interface',
          nodes: [
            { title: 'React application', lines: ['Search box, results table', 'verification stats'] },
            { title: 'Node proxy', lines: ['Mints an identity token', 'forwards the call'] },
          ],
        },
        {
          label: '2 · Analysis workflow',
          emphasis: true,
          note: 'Three nodes, strictly linear',
          nodes: [
            { title: '1 · Seed lookup', lines: ['Find the drug in regulatory data', 'or stop'] },
            { title: '2 · Web search', lines: ['Model proposes candidate names'] },
            { title: '3 · Verify and aggregate', lines: ['Score every candidate', 'against the seed'] },
            { title: 'Verification rubric', lines: ['Pass at a score of 2 or more'] },
          ],
        },
        {
          label: '3 · Data layer',
          nodes: [
            { title: 'Regulatory reference', lines: ['133,699 records', 'the ground truth'] },
            { title: 'Search-grounded model', lines: ['Proposes, never decides'] },
            { title: 'Internal competitor list', lines: ['912 curated products', 'editable live from the UI'] },
          ],
        },
        {
          label: '4 · The analyst',
          nodes: [
            { title: 'Reviewer', lines: ['Adds or removes competitors', 'Edits write back immediately'] },
          ],
        },
      ],
    },
  },

  'ai-agents-platform': {
    flow: [
      { number: '01', title: 'Choose', detail: 'Pick a saved layout, preview it' },
      { number: '02', title: 'Upload', detail: 'Recipient list, content sections' },
      { number: '03', title: 'Validate', detail: 'Business-owned input rules' },
      { number: '04', title: 'Assemble', detail: 'Tracked codes, print-ready PDFs' },
      { number: '05', title: 'Approve', detail: 'A reviewer signs off incentives' },
    ],

    architecture: {
      headline: 'Follow one batch through the system.',
      intro:
        'A creator works in the agent dashboard, uploads a recipient list and content sections, validation rules check the input, a job service queues the run, and the agent pipeline generates codes, assembles PDFs and records metadata, with a human approval gate before anything reaches the partner.',
      layers: [
        {
          label: '1 · Creator',
          nodes: [
            { title: 'Agent dashboard', lines: ['Every agent is a tile,', 'one click away'] },
            { title: 'Upload', lines: ['Recipient list and content', 'straight to cloud storage'] },
          ],
        },
        {
          label: '2 · Intake',
          nodes: [
            { title: 'Validation rules', lines: ['Business-owned, changeable', 'without a release'] },
            { title: 'Job service', lines: ['Answers instantly with a job number', 'runs in background'] },
          ],
        },
        {
          label: '3 · Agent pipeline',
          emphasis: true,
          note: 'One shared blueprint — adding an eighth agent is quick',
          nodes: [
            { title: 'QR Generator', lines: ['A tracked code per recipient', 'and location'] },
            { title: 'Assembler', lines: ['Print-sharp PDFs,', 'built in small batches'] },
            { title: 'Metadata Collector', lines: ['What was made, when,', 'and how to find it'] },
          ],
        },
        {
          label: '4 · Approval and delivery',
          nodes: [
            { title: 'Incentive approval gate', lines: ['A reviewer signs off', 'before anything is sent'] },
            { title: 'Packaged output', lines: ['One archive, named for the batch'] },
          ],
        },
      ],
    },
  },

  'recruitment-analytics-decision-support': {
    flow: [
      { number: '01', title: 'Source', detail: 'Candidate matched, recruiter assigned' },
      { number: '02', title: 'Submit', detail: 'Skill match, rate, availability logged' },
      { number: '03', title: 'Interview', detail: 'Client feedback, rounds, outcome' },
      { number: '04', title: 'Analyze', detail: 'The KPI engine scores the funnel' },
      { number: '05', title: 'Decide', detail: 'Manager escalates, reassigns or waits' },
    ],

    architecture: {
      headline: 'From a raw record to a placement decision.',
      intro:
        'Operational data is extracted into an analytical warehouse, modeled as a star schema, validated for quality, measured through a central KPI layer and scored by machine-learning models, then delivered as role-scoped dashboards.',
      layers: [
        {
          label: '1 · Source and extract',
          nodes: [
            { title: 'Operational platform', lines: ['Candidates, requirements,', 'submissions, interviews'] },
            { title: 'SQL extract and transform', lines: ['Scheduled, validated load', 'into the analytical layer'] },
          ],
        },
        {
          label: '2 · Analytical warehouse',
          nodes: [
            { title: 'Star schema', lines: ['Five fact tables,', 'seven conformed dimensions'] },
          ],
        },
        {
          label: '3 · Semantic and scoring layer',
          emphasis: true,
          note: 'Where a number becomes a KPI, and a KPI becomes a signal',
          nodes: [
            { title: '1 · Data quality rules', lines: ['Duplicates, missing fields,', 'orphans, invalid dates'] },
            { title: '2 · Measure layer', lines: ['Time-to-fill, fill rate,', 'every conversion ratio'] },
            { title: '3 · Predictive scoring', lines: ['Fill probability, candidate success,', 'at-risk flags'] },
            { title: 'One definition per KPI', lines: ['Computed centrally,', 'consumed, never recalculated'] },
          ],
        },
        {
          label: '4 · Delivery',
          nodes: [
            { title: 'Dashboard suite', lines: ['Six dashboards, one model,', 'scoped by role'] },
            { title: 'Recruiters and managers', lines: ['Escalate, reassign or wait'] },
          ],
        },
      ],
    },
  },

  'medical-data-intelligence-platform': {
    flow: [
      { number: '01', title: 'Receive', detail: 'Documents, attachments, email' },
      { number: '02', title: 'Extract', detail: 'OCR, structure, classify' },
      { number: '03', title: 'Reconcile', detail: 'Validate against existing records' },
      { number: '04', title: 'Report', detail: 'Governed reporting and forecasts' },
    ],

    architecture: {
      headline: 'From an inbound document to a governed number.',
      layers: [
        {
          label: '1 · Intake',
          nodes: [
            { title: 'Inbound documents', lines: ['Scans, attachments, email'] },
            { title: 'Structured feeds', lines: ['Existing system records'] },
          ],
        },
        {
          label: '2 · Extraction and validation',
          emphasis: true,
          nodes: [
            { title: 'OCR and parsing', lines: ['Structure out of unstructured input'] },
            { title: 'Validation rules', lines: ['Completeness and format checks'] },
            { title: 'Reconciliation', lines: ['Against existing records,', 'with an auditable trail'] },
          ],
        },
        {
          label: '3 · Governed data layer',
          nodes: [{ title: 'Curated store', lines: ['Ownership and quality rules defined'] }],
        },
        {
          label: '4 · Reporting and prediction',
          nodes: [
            { title: 'Reporting suite', lines: ['Operational and commercial views'] },
            { title: 'Prediction models', lines: ['Built on the governed layer'] },
          ],
        },
      ],
    },
  },

  'corporate-website-redesign': {
    flow: [
      { number: '01', title: 'Audit', detail: 'Content inventory, analytics, search' },
      { number: '02', title: 'Restructure', detail: 'IA built around visitor intent' },
      { number: '03', title: 'Design', detail: 'Design system, not page mockups' },
      { number: '04', title: 'Build', detail: 'Componentized, CMS-driven' },
      { number: '05', title: 'Migrate', detail: 'Redirect map, launch, monitor' },
    ],

    architecture: {
      headline: 'Content, composition and delivery, kept separate.',
      intro:
        'A headless content model feeds a componentized frontend, which is statically rendered where possible and revalidated on publish. Inquiries go to a validated server endpoint, never to a mail client.',
      layers: [
        {
          label: '1 · Content',
          nodes: [
            { title: 'Headless CMS', lines: ['Structured content types', 'not free-form pages'] },
            { title: 'Design tokens', lines: ['Typography, spacing, color', 'defined once'] },
            { title: 'Media pipeline', lines: ['Responsive derivatives', 'generated on upload'] },
          ],
        },
        {
          label: '2 · Composition',
          emphasis: true,
          nodes: [
            { title: 'Component library', lines: ['Reviewed, reusable blocks'] },
            { title: 'Page composition', lines: ['Editors assemble from blocks', 'no bespoke layouts'] },
            { title: 'Accessibility baked in', lines: ['Semantics and focus states', 'at component level'] },
          ],
        },
        {
          label: '3 · Delivery',
          nodes: [
            { title: 'Static rendering', lines: ['Revalidated on publish'] },
            { title: 'Edge caching', lines: ['Fast first paint worldwide'] },
            { title: 'Redirect map', lines: ['Every legacy URL resolved'] },
          ],
        },
        {
          label: '4 · Conversion and measurement',
          nodes: [
            { title: 'Inquiry endpoint', lines: ['Server-side validation,', 'spam protection, rate limiting'] },
            { title: 'Analytics events', lines: ['CTA, funnel and abandonment', 'defined before launch'] },
          ],
        },
      ],
    },
  },

  'portfolio-website': {
    flow: [
      { number: '01', title: 'Curate', detail: 'Which work earns a place' },
      { number: '02', title: 'Art direct', detail: 'Crops and sequence per project' },
      { number: '03', title: 'Compose', detail: 'Index and detail as one system' },
      { number: '04', title: 'Optimize', detail: 'Asset pipeline, lazy loading' },
      { number: '05', title: 'Publish', detail: 'New work is a content change' },
    ],

    architecture: {
      headline: 'Content in, art-directed experience out.',
      layers: [
        {
          label: '1 · Content and assets',
          nodes: [
            { title: 'Structured project model', lines: ['Fields, not free-form pages'] },
            { title: 'Asset pipeline', lines: ['Responsive derivatives,', 'modern formats, on upload'] },
            { title: 'Art direction rules', lines: ['Per-project crops and order'] },
          ],
        },
        {
          label: '2 · Experience',
          emphasis: true,
          nodes: [
            { title: 'Index view', lines: ['Large-format, curated sequence'] },
            { title: 'Detail view', lines: ['Full case presentation'] },
            { title: 'Shared transition', lines: ['Index and detail as one system'] },
            { title: 'Reduced-motion path', lines: ['A designed alternative,', 'not a degraded one'] },
          ],
        },
        {
          label: '3 · Delivery',
          nodes: [
            { title: 'Static rendering', lines: ['Rebuilt on publish'] },
            { title: 'Lazy loading', lines: ['Below-fold assets deferred'] },
            { title: 'Edge caching', lines: ['Consistent worldwide'] },
          ],
        },
      ],
    },
  },

  'customer-churn-prediction': {
    flow: [
      { number: '01', title: 'Define', detail: 'What churn means, and for whom' },
      { number: '02', title: 'Engineer', detail: 'Usage, support and billing features' },
      { number: '03', title: 'Train', detail: 'Versioned, reproducible runs' },
      { number: '04', title: 'Serve', detail: 'Scores into existing tooling' },
      { number: '05', title: 'Monitor', detail: 'Drift, quality and retraining' },
    ],

    architecture: {
      headline: 'From raw events to an action a person takes.',
      layers: [
        {
          label: '1 · Signals',
          nodes: [
            { title: 'Product usage', lines: ['Feature adoption, frequency,', 'depth of use'] },
            { title: 'Support history', lines: ['Volume, severity, sentiment,', 'resolution time'] },
            { title: 'Billing and plan', lines: ['Plan changes, payment events,', 'tenure'] },
          ],
        },
        {
          label: '2 · Feature pipeline',
          emphasis: true,
          note: 'Point-in-time correct, to prevent leakage',
          nodes: [
            { title: 'Aggregation windows', lines: ['Rolling usage and support features'] },
            { title: 'Point-in-time joins', lines: ['Computed as of the prediction date'] },
            { title: 'Feature validation', lines: ['Nulls, ranges and drift checked'] },
          ],
        },
        {
          label: '3 · Model',
          nodes: [
            { title: 'Training pipeline', lines: ['Versioned, reproducible runs'] },
            { title: 'Evaluation', lines: ['Held-out and temporal splits'] },
            { title: 'Explainability', lines: ['Per-account contributing factors'] },
          ],
        },
        {
          label: '4 · Delivery and monitoring',
          nodes: [
            { title: 'Scored account list', lines: ['Into existing success tooling'] },
            { title: 'Segmented views', lines: ['By plan, tenure, account owner'] },
            { title: 'Performance tracking', lines: ['Drift and quality after deployment'] },
          ],
        },
      ],
    },
  },

  'image-classification-system': {
    flow: [
      { number: '01', title: 'Capture', detail: 'Line imaging, consistent conditions' },
      { number: '02', title: 'Classify', detail: 'Model scores each item' },
      { number: '03', title: 'Threshold', detail: 'Confident pass, uncertain escalates' },
      { number: '04', title: 'Review', detail: 'Inspector decides the hard cases' },
      { number: '05', title: 'Learn', detail: 'Reviewed cases return to training' },
    ],

    architecture: {
      headline: 'From an image on the line to a recorded decision.',
      layers: [
        {
          label: '1 · Capture',
          nodes: [
            { title: 'Line imaging', lines: ['Controlled lighting', 'and positioning'] },
            { title: 'Pre-processing', lines: ['Normalization and framing'] },
          ],
        },
        {
          label: '2 · Inference at the edge',
          emphasis: true,
          note: 'Containerized, runs without a network round trip',
          nodes: [
            { title: 'Classifier', lines: ['Convolutional model,', 'recall-weighted'] },
            { title: 'Confidence threshold', lines: ['Business-owned, not hard-coded'] },
            { title: 'Escalation router', lines: ['Uncertain items go to a person'] },
          ],
        },
        {
          label: '3 · Human review',
          nodes: [
            { title: 'Inspector queue', lines: ['Escalated items with the image', 'and the score'] },
            { title: 'Decision record', lines: ['Outcome, reviewer, timestamp'] },
          ],
        },
        {
          label: '4 · Learning loop',
          nodes: [
            { title: 'Reviewed case store', lines: ['Labeled data from normal operation'] },
            { title: 'Retraining pipeline', lines: ['Versioned, evaluated before promotion'] },
            { title: 'Model monitoring', lines: ['Drift and class balance over time'] },
          ],
        },
      ],
    },
  },

  'ecommerce-analytics-platform': {
    flow: [
      { number: '01', title: 'Define', detail: 'Order, customer and product' },
      { number: '02', title: 'Ingest', detail: 'Storefront, payments, fulfillment' },
      { number: '03', title: 'Model', detail: 'Governed warehouse' },
      { number: '04', title: 'Check', detail: 'Quality rules and alerts' },
      { number: '05', title: 'Report', detail: 'One set of trading numbers' },
    ],

    architecture: {
      headline: 'From four source systems to one trading view.',
      layers: [
        {
          label: '1 · Sources',
          nodes: [
            { title: 'Storefront', lines: ['Orders, carts, customers'] },
            { title: 'Payments', lines: ['Captures, refunds'] },
            { title: 'Fulfillment', lines: ['Shipments, returns, stock'] },
          ],
        },
        {
          label: '2 · Pipelines',
          emphasis: true,
          nodes: [
            { title: 'Scheduled ingestion', lines: ['Orchestrated with Airflow'] },
            { title: 'Quality checks', lines: ['Completeness, freshness,', 'reconciliation'] },
          ],
        },
        {
          label: '3 · Warehouse',
          nodes: [
            { title: 'Governed model', lines: ['PostgreSQL, daily snapshots'] },
            { title: 'Semantic layer', lines: ['One definition per metric'] },
          ],
        },
        {
          label: '4 · Reporting',
          nodes: [
            { title: 'Trading dashboard', lines: ['Daily decisions'] },
            { title: 'Period comparison', lines: ['Week, month, season'] },
          ],
        },
      ],
    },
  },

  'realtime-data-streaming-platform': {
    flow: [
      { number: '01', title: 'Publish', detail: 'Vehicles, depots, orders' },
      { number: '02', title: 'Validate', detail: 'Schemas at the boundary' },
      { number: '03', title: 'Process', detail: 'Rolling aggregates' },
      { number: '04', title: 'Serve', detail: 'Live dispatch view' },
      { number: '05', title: 'Store', detail: 'Warehouse and replay' },
    ],

    architecture: {
      headline: 'One stream, several consumers.',
      layers: [
        {
          label: '1 · Producers',
          nodes: [
            { title: 'Vehicle telemetry', lines: ['Location, status'] },
            { title: 'Depot systems', lines: ['Scans, loads'] },
            { title: 'Order system', lines: ['Bookings, changes'] },
          ],
        },
        {
          label: '2 · Event backbone',
          emphasis: true,
          nodes: [
            { title: 'Kafka topics', lines: ['Retained history'] },
            { title: 'Schema validation', lines: ['Versioned contracts'] },
          ],
        },
        {
          label: '3 · Processing',
          nodes: [{ title: 'Stream processing', lines: ['Rolling operational aggregates'] }],
        },
        {
          label: '4 · Consumers',
          nodes: [
            { title: 'Live dispatch view', lines: ['Exceptions as they happen'] },
            { title: 'Warehouse sink', lines: ['Reporting and history'] },
            { title: 'Alerting', lines: ['Late and at-risk deliveries'] },
          ],
        },
      ],
    },
  },

  'recommendation-engine': {
    flow: [
      { number: '01', title: 'Signals', detail: 'Behavior and attributes' },
      { number: '02', title: 'Candidates', detail: 'Cached generation' },
      { number: '03', title: 'Rank', detail: 'Hybrid model' },
      { number: '04', title: 'Rules', detail: 'Merchandiser overrides' },
      { number: '05', title: 'Test', detail: 'Controlled experiments' },
    ],

    architecture: {
      headline: 'Candidates, ranking and rules as separate stages.',
      layers: [
        {
          label: '1 · Signals',
          nodes: [
            { title: 'Behavior', lines: ['Views, carts, purchases'] },
            { title: 'Catalog', lines: ['Attributes, categories'] },
          ],
        },
        {
          label: '2 · Candidate generation',
          nodes: [{ title: 'Cached candidate sets', lines: ['Refreshed on a schedule'] }],
        },
        {
          label: '3 · Ranking',
          emphasis: true,
          nodes: [
            { title: 'Hybrid ranker', lines: ['Collaborative and', 'content-based'] },
            { title: 'Business rules', lines: ['Pin, exclude, boost'] },
          ],
        },
        {
          label: '4 · Serving',
          nodes: [
            { title: 'Low-latency API', lines: ['FastAPI with Redis cache'] },
            { title: 'Experiments', lines: ['Strategy comparison'] },
          ],
        },
      ],
    },
  },

  'saas-dashboard-application': {
    flow: [
      { number: '01', title: 'Tenancy', detail: 'Accounts and data isolation' },
      { number: '02', title: 'Roles', detail: 'Teams and permissions' },
      { number: '03', title: 'Billing', detail: 'Subscription lifecycle' },
      { number: '04', title: 'Dashboard', detail: 'In-product analytics' },
      { number: '05', title: 'API', detail: 'Documented integrations' },
    ],

    architecture: {
      headline: 'Account, product and billing layers.',
      layers: [
        {
          label: '1 · Identity and tenancy',
          nodes: [
            { title: 'Accounts', lines: ['Isolation in the data layer'] },
            { title: 'Teams and roles', lines: ['Invitations, permissions'] },
          ],
        },
        {
          label: '2 · Product',
          emphasis: true,
          nodes: [
            { title: 'Web application', lines: ['React'] },
            { title: 'API', lines: ['Node.js, documented'] },
          ],
        },
        {
          label: '3 · Billing',
          nodes: [{ title: 'Subscription lifecycle', lines: ['Stripe, dunning, plan changes'] }],
        },
        {
          label: '4 · Data',
          nodes: [
            { title: 'Application data', lines: ['MongoDB'] },
            { title: 'Usage analytics', lines: ['In-product dashboard'] },
          ],
        },
      ],
    },
  },

  'lending-operations-portal': {
    flow: [
      { number: '01', title: 'Intake', detail: 'Applications and documents' },
      { number: '02', title: 'Verify', detail: 'Checklists and validation' },
      { number: '03', title: 'Approve', detail: 'Maker-checker workflow' },
      { number: '04', title: 'Audit', detail: 'Every action recorded' },
      { number: '05', title: 'Report', detail: 'Pipeline and exceptions' },
    ],

    architecture: {
      headline: 'Workflow, documents and reporting on one governed record.',
      layers: [
        {
          label: '1 · Intake',
          nodes: [
            { title: 'Application forms', lines: ['Validated on entry'] },
            { title: 'Document upload', lines: ['Checklist per product'] },
          ],
        },
        {
          label: '2 · Workflow',
          emphasis: true,
          nodes: [
            { title: 'Verification', lines: ['Checklist and exceptions'] },
            { title: 'Maker-checker', lines: ['Separate preparer', 'and approver'] },
          ],
        },
        {
          label: '3 · Record',
          nodes: [
            { title: 'Application record', lines: ['PostgreSQL'] },
            { title: 'Audit log', lines: ['Append-only history'] },
          ],
        },
        {
          label: '4 · Reporting',
          nodes: [{ title: 'Operations reporting', lines: ['Pipeline, aging, exceptions'] }],
        },
      ],
    },
  },

  'property-listings-platform': {
    flow: [
      { number: '01', title: 'List', detail: 'Structured property data' },
      { number: '02', title: 'Search', detail: 'Filters and map' },
      { number: '03', title: 'Compare', detail: 'Shortlist side by side' },
      { number: '04', title: 'Inquire', detail: 'Routed to the right agent' },
      { number: '05', title: 'Follow up', detail: 'Saved searches and alerts' },
    ],

    architecture: {
      headline: 'Content, search and inquiries.',
      layers: [
        {
          label: '1 · Content',
          nodes: [
            { title: 'Listing model', lines: ['Headless CMS'] },
            { title: 'Media pipeline', lines: ['Responsive image sizes'] },
          ],
        },
        {
          label: '2 · Discovery',
          emphasis: true,
          nodes: [
            { title: 'Search and filters', lines: ['Location, price, type'] },
            { title: 'Compare', lines: ['Side-by-side shortlist'] },
          ],
        },
        {
          label: '3 · Engagement',
          nodes: [
            { title: 'Saved searches', lines: ['Email alerts'] },
            { title: 'Inquiry routing', lines: ['Agent per listing'] },
          ],
        },
      ],
    },
  },

  'learning-platform': {
    flow: [
      { number: '01', title: 'Catalog', detail: 'Courses and cohorts' },
      { number: '02', title: 'Enroll', detail: 'Self-service sign-up' },
      { number: '03', title: 'Learn', detail: 'Lessons and assessments' },
      { number: '04', title: 'Track', detail: 'Progress for educators' },
      { number: '05', title: 'Certify', detail: 'Completion records' },
    ],

    architecture: {
      headline: 'One course model, role-based views.',
      layers: [
        {
          label: '1 · Content',
          nodes: [
            { title: 'Course catalog', lines: ['Modules, lessons, cohorts'] },
            { title: 'Assessments', lines: ['Quizzes and submissions'] },
          ],
        },
        {
          label: '2 · Platform',
          emphasis: true,
          nodes: [
            { title: 'Enrollment', lines: ['Self-service, approvals'] },
            { title: 'Progress engine', lines: ['Saved per learner'] },
          ],
        },
        {
          label: '3 · Views',
          nodes: [
            { title: 'Learner', lines: ['Course path'] },
            { title: 'Educator', lines: ['Cohort progress'] },
            { title: 'Administrator', lines: ['Records and scheduling'] },
          ],
        },
      ],
    },
  },

  'hotel-direct-booking': {
    flow: [
      { number: '01', title: 'Inspire', detail: 'Image-led property pages' },
      { number: '02', title: 'Search', detail: 'Dates, guests, rooms' },
      { number: '03', title: 'Choose', detail: 'Rooms and offers' },
      { number: '04', title: 'Pay', detail: 'Secure checkout' },
      { number: '05', title: 'Confirm', detail: 'Instant confirmation' },
    ],

    architecture: {
      headline: 'Brand content and booking in one flow.',
      layers: [
        {
          label: '1 · Content',
          nodes: [
            { title: 'Property pages', lines: ['Shared structure, own style'] },
            { title: 'Offers', lines: ['Managed once, per property'] },
          ],
        },
        {
          label: '2 · Booking',
          emphasis: true,
          nodes: [
            { title: 'Availability and rates', lines: ['Booking engine integration'] },
            { title: 'Checkout', lines: ['Payment gateway'] },
          ],
        },
        {
          label: '3 · After booking',
          nodes: [
            { title: 'Confirmation', lines: ['Email and reference'] },
            { title: 'Analytics', lines: ['Search-to-booking funnel'] },
          ],
        },
      ],
    },
  },
}
