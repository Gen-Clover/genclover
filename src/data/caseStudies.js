/**
 * Deep case-study content, keyed by project slug. (Spec §7.3)
 *
 * Kept separate from projects.js so the project records stay readable: this
 * file is long-form narrative, that one is the taxonomy and the card copy.
 * Merged onto the project at read time by `withCaseStudy` in projects.js.
 *
 * TRUTHFULNESS. Everything here describes a system as built: its architecture,
 * its components, the guardrails it enforces. Figures that do appear are counts
 * of things in the system (agents, pipelines, reference records, KPI
 * definitions), never business results such as conversion or revenue lift.
 * If a measured outcome is ever added it needs evidence behind it. (Spec §1.2)
 *
 * CONFIDENTIALITY. No client names, product names, imprint names or other
 * identifying detail. Sector descriptions are kept because they describe the
 * domain rather than the account. (Spec §7.2)
 *
 * Every section is optional. A project with only `flow` and `techStack` renders
 * exactly those two and nothing else.
 */

export const caseStudies = {
  /* ================================================================
   * AI LOG MONITORING & OBSERVABILITY PLATFORM
   * ================================================================ */
  'ai-log-monitoring-observability-platform': {
    role: 'AI Product Manager & Solution Architect',
    builtOn: 'Google Cloud, Agent Development Kit, Claude via Vertex AI',

    flow: [
      { number: '01', title: 'Detect', detail: 'Error, trace ID, alert' },
      { number: '02', title: 'Diagnose', detail: 'Logs, file, criticality' },
      { number: '03', title: 'Fix', detail: 'Source, patch, explanation' },
      { number: '04', title: 'Review', detail: 'Security, syntax, correctness' },
      { number: '05', title: 'Hand off', detail: 'Branch, commit, pull request' },
    ],

    stats: [
      { value: '5', label: 'specialized agents in one workflow, each with a single job' },
      { value: '±5', unit: 'min', label: 'of logs read around every error during triage' },
      { value: '30k', label: 'token cap per incident, enforced live by a circuit breaker' },
      { value: '1', label: 'trace ID follows an incident from alert to pull request' },
    ],

    atAGlance: {
      headline: "An engineer's first draft, written by the platform.",
      intro:
        'When a production service throws an error, the platform does more than raise an alert. It reads the logs, finds the responsible code, writes a fix, has a second agent check it, and opens a pull request for an engineer to review.',
      points: [
        {
          title: 'Shared tracing',
          text: 'One library stamps every log line in every service with a trace ID, so any incident can be followed end to end.',
        },
        {
          title: 'Remediation swarm',
          text: 'Five specialized agents move from alert to pull request, with safety checks between each step.',
        },
        {
          title: 'Observability dashboard',
          text: 'A single screen shows what the system did, why, what it changed and what it cost.',
        },
      ],
    },

    challengeDetail: {
      headline: 'The slow part of an outage is the middle.',
      intro:
        'A modern microservice estate produces thousands of log lines a minute. When something breaks, an on-call engineer has to notice the alert, find the right logs, reconstruct the failing request, locate the responsible file and commit, write and test a fix, get it reviewed and ship it. The middle steps are mechanical, and they are where most of the hours go.',
      points: [
        {
          title: 'Context is scattered',
          text: 'Logs, source code and deployment state live in three different systems. Someone has to stitch a trace ID to a file to a commit by hand.',
        },
        {
          title: 'Tools only report',
          text: 'Traditional dashboards show that something broke, not why, and they never propose a fix.',
        },
        {
          title: 'The same bugs come back',
          text: 'Null checks, type mismatches and timeouts get re-diagnosed from scratch by whoever is on call that week.',
        },
      ],
    },

    approachDetail: {
      headline: 'Instrument once. Let agents do the mechanical work. Keep people in charge of the decision.',
      points: [
        {
          title: 'Make every incident traceable',
          text: 'A standard tracing library across all services means an agent can always start from one ID and find everything related to a failure.',
        },
        {
          title: 'Split the work across specialists',
          text: 'Triage, code retrieval, fix writing, review and Git operations are separate agents with strict, typed hand-offs, each easy to test and improve independently.',
        },
        {
          title: 'End at a pull request',
          text: 'The output is a reviewed proposal in the tool engineers already use. The system prepares work; a person merges it.',
        },
      ],
    },

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

    walkthrough: {
      eyebrow: 'One incident, start to finish',
      headline: 'From a stack trace to a pull request.',
      intro: 'A typical incident, step by step.',
      caption: 'Illustrative walkthrough of a typical incident.',
      steps: [
        {
          title: 'A service fails',
          text: 'A service throws a division-by-zero error. The shared logger stamps the error line with a trace ID.',
        },
        {
          title: 'The alert fires',
          text: 'The log-based alert publishes to Pub/Sub, which pushes to the webhook. The webhook answers immediately and starts the swarm in the background.',
        },
        {
          title: 'The Log Analyst triages',
          text: 'It reads five minutes of logs either side of the error, rates the incident against a fixed criticality rubric, and identifies the file at the commit that was running.',
        },
        {
          title: 'The Environment agent fetches the code',
          text: 'It pulls that exact file from source control at that commit, not at head, so the fix is written against what was actually running.',
        },
        {
          title: 'The Coder writes the fix',
          text: 'It adds a defensive check around the failure and explains the change in one sentence, keeping the file architecture intact.',
        },
        {
          title: 'The Reviewer checks it',
          text: 'A separate agent persona looks for regressions and security issues and confirms the original bug is actually resolved. Only approved work moves on.',
        },
        {
          title: 'GitOps opens the pull request',
          text: 'It creates a branch, commits the patch and opens a pull request describing the root cause.',
        },
        {
          title: 'A person takes over',
          text: 'The dashboard shows all five steps, the before-and-after diff, the pull request link and the token spend. An engineer reviews and merges.',
        },
      ],
    },

    components: {
      eyebrow: 'The five agents',
      headline: 'Specialists with one job each.',
      intro:
        'Each agent reads defined inputs and must return a strict, typed result. The next agent only runs if the previous one succeeded.',
      items: [
        {
          index: '1',
          name: 'Log Analyst',
          what: 'Reads five minutes of logs either side of the error, names the service, file and commit, and rates business criticality as low, medium or high.',
          guardrail:
            'A fixed rubric maps error types to criticality. Authentication failures, payment services and database disconnects rank high.',
        },
        {
          index: '2',
          name: 'Environment Agent',
          what: 'Retrieves the exact source file from version control at the commit that was actually running in production.',
          guardrail: 'If the logs do not state a commit, it falls back to the currently deployed one rather than guessing.',
        },
        {
          index: '3',
          name: 'Coder Agent',
          what: 'Writes the corrected file and a short explanation of what changed and why.',
          guardrail: 'It must keep the file architecture intact and add a comment above the fix.',
        },
        {
          index: '4',
          name: 'Review Agent',
          what: 'Gives an independent second opinion: no new security issues, valid syntax, and the original bug actually resolved.',
          guardrail: 'A separate persona from the Coder, so the author of a change is never its only reviewer.',
        },
        {
          index: '5',
          name: 'GitOps Agent',
          what: 'Creates a branch, commits the fix and opens a pull request that explains the root cause.',
          guardrail: 'It may only use the repository and file the orchestrator supplies. It never invents names.',
        },
        {
          index: '↻',
          name: 'Orchestrator',
          what: 'Wires the five agents into one workflow, passes state from each to the next, and stops the run the moment a stage fails to report success.',
          guardrailLabel: 'Why it matters',
          guardrail: 'A weak diagnosis can never slide through into code being written.',
        },
      ],
    },

    safeguards: {
      headline: 'Autonomy is only useful if it is bounded.',
      intro: 'These controls were in the first version, not retrofitted after an incident.',
      points: [
        {
          title: 'Typed hand-offs',
          text: 'Every agent returns a strict schema. A bad generation fails loudly instead of quietly corrupting the next step.',
        },
        {
          title: 'Fail-closed pipeline',
          text: 'If any stage does not report success or approval, the workflow stops rather than continuing on partial information.',
        },
        {
          title: 'Independent review',
          text: 'A different agent checks the fix before anything reaches version control.',
        },
        {
          title: 'Token circuit breaker',
          text: 'A watchdog counts tokens live for each agent and halts the run at a per-incident limit. A looping agent cannot run up an open-ended bill.',
        },
        {
          title: 'Noise filter',
          text: 'Events without a trace ID are ignored, so the swarm does not react to noise or to its own logs.',
        },
        {
          title: 'Stateless resume',
          text: 'A halted incident can be re-run with a larger budget. The original alert is rebuilt from logs by trace ID, so no fragile session state is kept.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'AI orchestration', items: ['Agent Development Kit', 'Typed output schemas per agent'] },
        { title: 'Model', items: ['Claude', 'Vertex AI'] },
        { title: 'Backend', items: ['Python', 'FastAPI', 'Pydantic'] },
        { title: 'Tracing and logging', items: ['OpenTelemetry', 'W3C Trace Context', 'TypeScript SDK', 'Python SDK'] },
        { title: 'Dashboard', items: ['Next.js', 'React', 'Redux Toolkit', 'Recharts'] },
        { title: 'Eventing', items: ['Cloud Logging alerts', 'Pub/Sub push subscription'] },
        { title: 'Security', items: ['Identity-Aware Proxy', 'Secret Manager'] },
        { title: 'Delivery', items: ['Cloud Build', 'Artifact Registry', 'Cloud Run', 'Images tagged by commit'] },
      ],
    },

    roadmap: {
      headline: 'What the platform is designed to grow into.',
      intro: 'Prioritized the way a product owner would: control first, then reach, then polish.',
      groups: [
        {
          title: 'Human in the loop',
          items: [
            'Alerts to chat, email or the issue tracker when the system is stuck or a fix is rejected',
            'A confidence signal, so uncertain diagnoses go to a person before any code is written',
            'A one-click approval screen for pending pull requests',
          ],
        },
        {
          title: 'Safety rails',
          items: [
            'A maintained service-to-repository map that stops and asks when unsure',
            'Duplicate-alert protection, with branches named after the trace ID',
            'A risk policy where high-criticality services always require human review',
          ],
        },
        {
          title: 'Traceability and experience',
          items: [
            'Trace IDs created at the click in the dashboard, so a manual resume is auditable end to end',
            'A cleanup view for stale branches and pull requests',
            'Confidence flags surfaced directly in the incident detail view',
          ],
        },
      ],
    },

    closing: 'A production error in. A reviewed pull request out. People in control of what ships.',
  },

  /* ================================================================
   * DATA & BI MODERNIZATION
   * ================================================================ */
  'data-bi-modernization': {
    role: 'Solution Architect & Senior Project Lead',
    builtOn: 'Google Cloud, Power BI',

    flow: [
      { number: '01', title: 'Ingest', detail: 'ERP, publisher and vendor files, APIs' },
      { number: '02', title: 'Orchestrate', detail: 'Cloud DAGs, validate, log, retry' },
      { number: '03', title: 'Warehouse', detail: 'One source of truth' },
      { number: '04', title: 'Deliver', detail: 'Embedded analytics, portal, APIs' },
    ],

    stats: [
      { value: '200', unit: '+', label: 'ETL pipelines reverse-engineered and migrated off the legacy tool' },
      { value: '1', label: 'enterprise warehouse in place of four disconnected tools' },
      { value: '6', label: 'operational applications unified behind one portal' },
      { value: '3', label: 'environments with CI/CD: development, UAT and production' },
    ],

    atAGlance: {
      headline: 'One set of business rules, in one place.',
      intro:
        'Scale had, over time, buried the reporting platform under four disconnected systems and a large manual process run over email and spreadsheets. The program replaced all of it, and the hardest constraint was that every number had to keep matching what the business already knew to be true.',
      points: [
        {
          title: 'One governed pipeline',
          text: 'Six layers from source system to end user, each with validation, logging and retry built in rather than bolted on afterward.',
        },
        {
          title: 'Embedded, not standalone',
          text: 'Analytics delivered inside the company portal, so reports sit beside the operational apps instead of in a separate tool nobody opens.',
        },
        {
          title: 'Spreadsheets became software',
          text: 'Claims, allocations and reconciliations moved out of email into auditable workflows with roles, approvals and a trail.',
        },
      ],
    },

    beforeAfter: {
      eyebrow: 'Where it started',
      headline: 'A decade of accumulated tools, and a business that outgrew them.',
      intro:
        'Nothing here was a bad decision at the time. Each tool solved the problem in front of it. Together they produced a platform where the same question could be answered four different ways.',
      beforeLabel: 'Legacy stack',
      afterLabel: 'Modern platform',
      before: [
        'An ETL tool running more than 200 interconnected, largely undocumented pipelines',
        'A warehouse with business logic buried in stored procedures',
        'Dashboards isolated from day-to-day operations',
        'Claims, allocations and reconciliations run by hand in spreadsheets, over email',
        'User access and permissions managed independently, system by system',
      ],
      after: [
        'Cloud-native orchestrated pipelines with validation, logging and retry built in',
        'A single enterprise warehouse holding one set of business rules',
        'Analytics delivered embedded inside one portal, not as a standalone tool',
        'Allocations and approvals run as digital workflows in purpose-built applications',
        'One portal for user administration, role-based access and row-level security',
      ],
      footnote:
        'Every pipeline was reverse-engineered, validated against legacy output, and only then re-platformed.',
    },

    approachDetail: {
      headline: 'Reverse-engineer before replacing.',
      points: [
        {
          title: 'Document what exists first',
          text: 'Undocumented logic is still load-bearing logic. Each pipeline was mapped and its output captured before anything was rewritten.',
        },
        {
          title: 'Reconcile at every step',
          text: 'New output was validated against the legacy system domain by domain, so each cutover was a small verified move rather than one large irreversible one.',
        },
        {
          title: 'Put analytics where the work happens',
          text: 'Reports embedded in the portal the business already used, rather than a separate tool requiring a separate login and a separate license.',
        },
      ],
    },

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

    components: {
      eyebrow: 'Delivery discipline',
      headline: 'What kept a migration of this size honest.',
      intro:
        'The engineering was the straightforward part. Not breaking a number the business depended on was the hard part.',
      items: [
        {
          index: 'QA',
          name: 'Quality assurance',
          what: 'Pipeline, warehouse and report testing, with business-rule and financial reconciliation against legacy output.',
          guardrail: 'Regression testing and user acceptance testing before every release, not only at the end.',
        },
        {
          index: 'SEC',
          name: 'Security and access',
          what: 'Cloud identity integrated with the corporate directory, role-based access across the portal, row-level security applied environment by environment.',
          guardrail: 'Permissions administered centrally, replacing per-system ad-hoc access.',
        },
        {
          index: 'CD',
          name: 'Deployment',
          what: 'Automated CI/CD across all environments with build validation and smoke tests.',
          guardrail: 'Development to UAT to production, every time. No direct changes to production.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Cloud platform', items: ['BigQuery', 'Cloud Composer', 'Cloud Storage', 'Cloud Build', 'Cloud Logging', 'IAM'] },
        { title: 'Analytics', items: ['Power BI', 'Power BI Embedded', 'DAX', 'Row-Level Security'] },
        { title: 'Applications', items: ['React', 'Node.js', 'Python', 'SQL'] },
        { title: 'Integration and operations', items: ['ERP connectors', 'SFTP', 'Active Directory', 'CI/CD'] },
      ],
    },

    roadmap: {
      headline: 'What the platform is designed to grow into.',
      intro: 'The architecture was built to take on new sources and capabilities with minimal structural change.',
      groups: [
        {
          title: 'Data quality and governance',
          items: [
            'Enterprise data quality dashboard and scorecards',
            'Metadata management and a searchable data catalog',
            'End-to-end data lineage tracking',
            'Anomaly and data quality monitoring',
          ],
        },
        {
          title: 'Advanced analytics',
          items: [
            'Predictive analytics and forecasting for sales, inventory and revenue',
            'Self-service analytics with certified datasets',
            'Near real-time processing for operational dashboards',
          ],
        },
        {
          title: 'Operations and automation',
          items: [
            'Proactive monitoring and automated diagnostics',
            'Expanded workflow automation across remaining manual processes',
            'Automated approvals, notifications and document generation',
          ],
        },
      ],
    },

    closing: 'Four disconnected systems, replaced by one governed enterprise platform.',
  },

  /* ================================================================
   * DRUG COMPETITOR IDENTIFICATION
   * ================================================================ */
  'drug-competitor-identification': {
    role: 'Product Owner & Solution Architect',
    builtOn: 'LangGraph, Gemini with search grounding, BigQuery',

    flow: [
      { number: '01', title: 'Search', detail: 'Drug name, regulatory lookup' },
      { number: '02', title: 'Research', detail: 'Model proposes candidates' },
      { number: '03', title: 'Verify', detail: 'Identifier, class, route, pathway' },
      { number: '04', title: 'Reconcile', detail: 'Cross-check, analyst curates' },
    ],

    stats: [
      { value: '133k', label: 'regulatory reference records every candidate is scored against' },
      { value: '912', label: 'curated competitor relationships in the internal ground-truth list' },
      { value: '3', label: 'workflow nodes, strictly linear: any error stops the run' },
      { value: '≥2', label: 'points required before a candidate counts as verified' },
    ],

    atAGlance: {
      headline: 'Type a drug name, get a competitor list you can defend.',
      intro:
        'Sourced from live web search, checked against regulatory data, and reconciled with the organization’s own competitive-intelligence database, with every unverified candidate still visible rather than quietly dropped.',
      points: [
        {
          title: 'Recall from the model',
          text: 'A search-grounded model proposes plausible competitors from everything on the web. It names candidates; it never decides.',
        },
        {
          title: 'Trust from a rubric',
          text: 'An explainable point system scores each candidate against the seed drug’s regulatory facts. Same rules, same answer, every time.',
        },
        {
          title: 'Final say from a person',
          text: 'The analyst adds or removes competitors with one click, and that edit updates the ground-truth list live.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Knowing who really competes is a judgment call, not a lookup.',
      intro:
        'Telling two products genuinely compete, rather than that their names sound alike, takes knowing active ingredient, therapeutic class, route, dosage form and regulatory pathway well enough to say so with confidence. Doing that by hand, per product, across a portfolio, does not scale.',
      points: [
        {
          title: 'Manual, inconsistent research',
          text: 'Without a standard process, two analysts researching the same drug can land on two different competitor lists, based on general web research and personal judgment.',
        },
        {
          title: 'Disconnected sources of truth',
          text: 'Authoritative pharmacological facts live in regulatory data. Hard-won competitive knowledge lives in a separate internal list. Nothing reconciled the two automatically.',
        },
        {
          title: 'No fast, repeatable entry point',
          text: 'There was no single place to type a drug name and immediately see what the web thinks the competitors are, and whether that matches what is already on file.',
        },
      ],
    },

    approachDetail: {
      headline: 'Separate recall from trust.',
      points: [
        {
          title: 'Let the model do what it is good at',
          text: 'Search-grounded generation is excellent at proposing candidates from the open web. That is where it is used, and only there.',
        },
        {
          title: 'Let a rubric decide',
          text: 'Verification is a scoring function against regulatory facts, so the same drug returns the same result whoever runs it and whenever they run it.',
        },
        {
          title: 'Never drop the uncertain ones',
          text: 'Candidates that fail verification stay on screen, flagged. Hiding them would quietly destroy information the analyst may need.',
        },
      ],
    },

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

    walkthrough: {
      eyebrow: 'One search, end to end',
      headline: 'From a drug name to a defensible list.',
      caption: 'Illustrative recreation of the results view.',
      steps: [
        {
          title: 'Type a drug name',
          text: 'The form calls the analyze endpoint and shows a multi-stage loader while the model call and warehouse lookups run.',
        },
        {
          title: 'Seed facts are shown up front',
          text: 'A summary card shows the seed drug’s own regulatory facts: generic name, identifiers, class, route and dosage form. These are the facts every candidate is verified against.',
        },
        {
          title: 'Candidates are proposed and scored',
          text: 'Each candidate is scored on identifier, class, route and pathway. Two points or more counts as verified.',
        },
        {
          title: 'Results split into two panels',
          text: 'Drug facts on the left, verification status and a checkbox on the right, with unverified candidates still listed and flagged.',
        },
        {
          title: 'The analyst curates',
          text: 'Checking or unchecking a row adds or removes that competitor from the organization’s own list, live.',
        },
        {
          title: 'The result is cached locally',
          text: 'The response is cached in the browser, so refreshing redisplays the last analysis without another paid model call.',
        },
      ],
    },

    safeguards: {
      eyebrow: 'Design decisions',
      headline: 'Where the model is allowed to act, and where it is not.',
      points: [
        {
          title: 'The model proposes, never decides',
          text: 'Generation is confined to candidate recall. Nothing it says becomes verified without passing the rubric.',
        },
        {
          title: 'Explainable scoring',
          text: 'A point system against named attributes, not a similarity score. An analyst can see exactly why a candidate passed.',
        },
        {
          title: 'Strictly linear workflow',
          text: 'Any error stops the run rather than degrading silently into a partial answer presented as a complete one.',
        },
        {
          title: 'Human edit is authoritative',
          text: 'The analyst’s decision overrides the system and updates the ground truth, so curation improves future runs.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Frontend', items: ['React', 'Vite', 'React Router', 'MUI', 'Tailwind CSS', 'react-hook-form'] },
        { title: 'Proxy and backend', items: ['Node.js', 'Express', 'Python', 'FastAPI', 'Pydantic', 'Uvicorn'] },
        { title: 'AI and data', items: ['LangGraph', 'Gemini', 'Search grounding', 'BigQuery', 'Secret Manager'] },
        { title: 'Operations', items: ['Docker', 'Identity-Aware Proxy', 'pandas'] },
      ],
    },

    roadmap: {
      headline: 'Grouped the way a product owner would prioritize it.',
      intro: 'Trust and data quality first, then efficiency, then experience, then operations.',
      groups: [
        {
          title: 'Trust and data quality',
          items: [
            'Audit log for analyst actions',
            'On-demand refresh alongside the scheduled refresh of the reference table',
            'Revisit the scoring rubric with real analyst feedback',
          ],
        },
        {
          title: 'Efficiency and cost',
          items: [
            'Cache analyze results per drug name for a sensible time to live',
            'Rate alerting, given each call triggers a paid model request',
          ],
        },
        {
          title: 'Product and operations',
          items: [
            'Show why each candidate counts, highlighting the matching attributes beside the result',
            'Clearer empty and error states',
            'Tighten network policy if the backend is ever exposed outside the proxy path',
          ],
        },
      ],
    },

    closing: 'The model gets to suggest. The rubric gets to verify. The analyst gets to decide.',
  },

  /* ================================================================
   * AI AGENTS PLATFORM
   * ================================================================ */
  'ai-agents-platform': {
    role: 'AI Product Owner & Solution Architect',
    builtOn: 'Google Cloud, Python, React',

    flow: [
      { number: '01', title: 'Choose', detail: 'Pick a saved layout, preview it' },
      { number: '02', title: 'Upload', detail: 'Recipient list, content sections' },
      { number: '03', title: 'Validate', detail: 'Business-owned input rules' },
      { number: '04', title: 'Assemble', detail: 'Tracked codes, print-ready PDFs' },
      { number: '05', title: 'Approve', detail: 'A reviewer signs off incentives' },
    ],

    stats: [
      { value: '7', label: 'agents, each with one clear job and its own screen' },
      { value: '6', label: 'tracked codes generated on every poster' },
      { value: '1', label: 'upload starts an entire batch, in the background' },
      { value: '1', label: 'person approves every incentive before it goes out' },
    ],

    atAGlance: {
      headline: 'Seven agents, one personalized output per recipient.',
      intro:
        'A poster is a puzzle of up to a dozen sections, and each recipient needs their own set of tracked codes. Instead of designers assembling each one by hand, creators pick a layout, upload the content, and the platform does the rest.',
      points: [
        {
          title: 'Set it up',
          text: 'Layouts and input rules are stored as data, not design files, so the business can change what a valid output looks like without waiting for a release.',
        },
        {
          title: 'Build it',
          text: 'Tracked codes and print-ready PDFs are generated in bulk, in the background, while the creator does something else.',
        },
        {
          title: 'Check it',
          text: 'Incentives need a person’s approval, and every code, poster and layout version is recorded, so nothing goes out untraced.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Assembly by hand does not scale.',
      intro:
        'Nothing about the manual process was careless. It simply could not keep up once every recipient needed their own version of the same output.',
      points: [
        {
          title: 'Slow to assemble',
          text: 'Up to a dozen sections had to fit a fixed layout, to the pixel, for every single recipient.',
        },
        {
          title: 'Personal at scale',
          text: 'A unique tracked code per recipient and location simply cannot be placed by hand across a print run.',
        },
        {
          title: 'Hard to trace',
          text: 'Nothing reliably recorded which output, or which incentive, went to whom.',
        },
        {
          title: 'Risky incentives',
          text: 'One wrong incentive code awards the wrong points to the wrong person. That is a commercial error, not a cosmetic one.',
        },
      ],
    },

    approachDetail: {
      headline: 'Fast where it is safe. Careful where it counts.',
      points: [
        {
          title: 'Automate the mechanical middle',
          text: 'Layout, code generation, assembly and packaging are repetitive and rule-bound, which makes them the right work to hand to a system.',
        },
        {
          title: 'Put the person at the risk point',
          text: 'The two places a mistake is expensive are an incentive that awards points and an output that prints without a working code. Both are gated.',
        },
        {
          title: 'Configuration as data',
          text: 'Layouts and validation rules live in storage, not in a build, so a rule change reaches users in minutes rather than at the next release.',
        },
      ],
    },

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

    walkthrough: {
      eyebrow: 'One batch, start to finish',
      headline: 'One upload in. A finished batch out.',
      caption: 'Illustrative walkthrough of a typical run. Sample identifiers are representative, not client data.',
      steps: [
        {
          title: 'Upload the ingredients',
          text: 'A recipient list and the content sections go straight to cloud storage. No designer opens a layout file.',
        },
        {
          title: 'Check before starting',
          text: 'Wrong columns or wrongly sized assets are caught up front, against rules the business owns, rather than an hour into the run.',
        },
        {
          title: 'Get a job number',
          text: 'The screen answers straight away. The creator can walk away and check progress whenever they like.',
        },
        {
          title: 'Codes are found or made',
          text: 'A tracked code is resolved for every recipient and location. If the codes cannot be produced, the run stops rather than printing without one.',
        },
        {
          title: 'Outputs get built',
          text: 'Missing sections fall back to placeholders, and outputs are assembled in small batches so a single bad row never takes down the run.',
        },
        {
          title: 'Incentives wait for a person',
          text: 'Codes are validated automatically, then held. A reviewer approves or rejects the batch before anything reaches the partner.',
        },
        {
          title: 'Download one package',
          text: 'Every output is saved and recorded. One archive, named for the batch, is ready to go.',
        },
      ],
    },

    components: {
      eyebrow: 'The agents',
      headline: 'Seven agents, one job each.',
      intro:
        'Each agent has its own screen and does one thing well. They share one blueprint, which is what makes an eighth agent a week of work rather than a project.',
      items: [
        {
          index: '1',
          name: 'Dashboard',
          what: 'The front door. Every agent is a tile, one click away.',
          guardrailLabel: 'Why it matters',
          guardrail: 'A new capability is a new tile, not a new product.',
        },
        {
          index: '2',
          name: 'Template Management',
          what: 'Stores each layout and previews it before anything is built.',
          guardrailLabel: 'Why it matters',
          guardrail: 'Layouts are data, not design files, so they are easy to reuse.',
        },
        {
          index: '3',
          name: 'Validation',
          what: 'Lets the business define what a valid input file actually looks like.',
          guardrailLabel: 'Why it matters',
          guardrail: 'Rule changes go live in minutes, without a release.',
        },
        {
          index: '4',
          name: 'QR Generator',
          what: 'Makes tracked codes one at a time, or thousands from a spreadsheet.',
          guardrailLabel: 'Why it matters',
          guardrail: 'Running the same file twice never creates duplicates.',
        },
        {
          index: '5',
          name: 'Assembler',
          what: 'Builds the output PDFs: one to check a design, or a whole batch in the background.',
          guardrailLabel: 'Why it matters',
          guardrail: 'Print-sharp output, and every item is recorded.',
        },
        {
          index: '6',
          name: 'Incentive Activation',
          what: 'Validates incentive codes and sends only approved ones to the partner.',
          guardrailLabel: 'Why it matters',
          guardrail: 'A person approves before any points are awarded.',
        },
        {
          index: '7',
          name: 'Metadata Collector',
          what: 'The registry: what was made, when, and how to retrieve it again.',
          guardrailLabel: 'Why it matters',
          guardrail: 'Support and audit can find anything fast.',
        },
      ],
    },

    safeguards: {
      headline: 'Where the automation stops and a person starts.',
      points: [
        {
          title: 'Configuration as data',
          text: 'Layouts and validation rules live in storage, not in a build. Business users change them on a screen and the change is live in minutes.',
        },
        {
          title: 'Background execution',
          text: 'The upload endpoint answers immediately with a job number. The heavy work happens asynchronously, so a browser tab is never load-bearing.',
        },
        {
          title: 'Idempotent generation',
          text: 'Running the same file again replaces the previous result rather than doubling it, so a retry is always safe.',
        },
        {
          title: 'A registry, not guesswork',
          text: 'Every code, output and layout version is recorded, so support and audit can reconstruct any run after the fact.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Cloud', items: ['Cloud Run', 'Cloud Storage', 'Pub/Sub', 'Firestore', 'Cloud Logging'] },
        { title: 'Services', items: ['Python', 'FastAPI', 'Background jobs', 'PDF generation', 'Code tracking service'] },
        { title: 'Interface', items: ['React', 'Node.js', 'REST APIs'] },
        { title: 'Security and delivery', items: ['Identity-Aware Proxy', 'IAM', 'CI/CD'] },
      ],
    },

    roadmap: {
      headline: 'Where the platform goes next.',
      groups: [
        {
          title: 'The learning loop',
          items: [
            'Understand each recipient from what they read, open and scan, plus specialty and location',
            'Suggest the best content per output, with creators reviewing and rating every suggestion',
            'Feed scans and clicks back in, so each round is better targeted than the last',
          ],
        },
        {
          title: 'Platform hardening',
          items: [
            'Sturdier large runs that recover on their own and retry only what failed',
            'Validation rules enforced behind the scenes as well as on the screen',
            'Explicit hand-offs between agents, so they ask each other rather than reading each other’s data',
          ],
        },
        {
          title: 'Creator experience',
          items: [
            'A layout designer, so creators build a new layout rather than only previewing one',
            'Variant testing, using code tracking to compare versions',
            'A reach view tying scans and clicks back to the campaign that produced them',
          ],
        },
      ],
    },

    closing: 'Pieces in. A personalized, trackable output out. People in control of what ships.',
  },

  /* ================================================================
   * RECRUITMENT ANALYTICS & DECISION SUPPORT
   * ================================================================ */
  'recruitment-analytics-decision-support': {
    role: 'Data Analyst, BI Developer & Product Analytics',
    builtOn: 'SQL, Python, Power BI, DAX, scikit-learn',

    flow: [
      { number: '01', title: 'Source', detail: 'Candidate matched, recruiter assigned' },
      { number: '02', title: 'Submit', detail: 'Skill match, rate, availability logged' },
      { number: '03', title: 'Interview', detail: 'Client feedback, rounds, outcome' },
      { number: '04', title: 'Analyze', detail: 'The KPI engine scores the funnel' },
      { number: '05', title: 'Decide', detail: 'Manager escalates, reassigns or waits' },
    ],

    stats: [
      { value: '7', label: 'fact and dimension tables modeling the recruitment lifecycle' },
      { value: '50', unit: '+', label: 'standardized KPIs tracked across the funnel' },
      { value: '3', label: 'predictive models in production' },
      { value: '1', label: 'single source of truth for recruitment reporting' },
    ],

    atAGlance: {
      headline: 'Every dashboard reads from the same set of numbers.',
      intro:
        'The operational platform ran the recruitment lifecycle. This layer sat on top of it, turning candidate, requirement, recruiter and client activity into KPIs that meant the same thing whoever was looking at them.',
      points: [
        {
          title: 'Standardized definitions',
          text: 'Time-to-fill, fill rate and every conversion ratio are computed once, centrally, and reused everywhere rather than redefined per report.',
        },
        {
          title: 'A reusable data model',
          text: 'One star schema of facts and dimensions feeds the executive, recruiter, client, funnel and aging dashboards alike.',
        },
        {
          title: 'Descriptive to predictive',
          text: 'The same layer that reports what happened also scores which open requirements are likely to miss their target date.',
        },
      ],
    },

    beforeAfter: {
      eyebrow: 'The challenge',
      headline: 'Between recruiter activity and a decision is a gap.',
      intro:
        'Recruiters could source, submit and place candidates every day. Management could not see the funnel behind those actions: which jobs were aging, which clients were slow to respond, or why a requirement with plenty of submissions still had not closed.',
      before: [
        'Candidates, requirements, submissions, interviews and placements sat in separate operational screens',
        'Spreadsheet exports told leadership a job was open, never whether sourcing, submission quality or client feedback was the bottleneck',
        'Aging requirements and low-converting clients were re-diagnosed from scratch each week',
        'Three teams computed time-to-fill three different ways, and all three defended their number',
      ],
      after: [
        'One star schema of facts and dimensions covering the whole lifecycle',
        'Stage-level conversion and drop-off visible for every requirement, live',
        'Aging cohorts and escalation flags refreshed daily, not rebuilt weekly',
        'One definition per KPI, enforced centrally and traceable to its source tables',
      ],
      footnote: 'Model once. Let KPIs drive every dashboard. Keep recruiters in charge of the outreach.',
    },

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

    components: {
      eyebrow: 'The metric dimensions',
      headline: 'What gets measured, and at what grain.',
      intro:
        'More than fifty KPIs, grouped by the thing they describe. Each is defined once and traceable back to its source tables.',
      items: [
        {
          index: 'R',
          name: 'Recruiter dimension',
          what: 'Productivity index, response time to a new requirement, fill rate, workload balance, submission quality, specialization index, activity-to-outcome ratio, and performance against tenure cohort.',
          guardrailLabel: 'Grain',
          guardrail: 'Per recruiter, per period, so individual and team views reconcile.',
        },
        {
          index: 'Q',
          name: 'Requirement dimension',
          what: 'Aging buckets, difficulty index, reopen rate, cancellation rate, skill scarcity, SLA adherence by priority, source mix and location-based fill rate.',
          guardrailLabel: 'Grain',
          guardrail: 'Per requirement, segmented by client, recruiter and skill.',
        },
        {
          index: 'C',
          name: 'Client dimension',
          what: 'Feedback turnaround time, delivery efficiency and relationship health measures per client.',
          guardrailLabel: 'Grain',
          guardrail: 'Per client, so slow feedback loops are visible as a cause rather than a symptom.',
        },
      ],
    },

    safeguards: {
      eyebrow: 'Governance',
      headline: 'What keeps the numbers trustworthy.',
      points: [
        {
          title: 'Quality rules run before reporting',
          text: 'Duplicates, missing fields, orphaned records and invalid dates are caught before data reaches a dashboard, not after someone queries a wrong number.',
        },
        {
          title: 'One definition, centrally enforced',
          text: 'Every KPI is computed in the measure layer and consumed by reports. No report recalculates its own version.',
        },
        {
          title: 'Traceable to source',
          text: 'Each measure can be traced back to the fact and dimension tables it derives from, so a disputed figure has an answer.',
        },
        {
          title: 'Role-scoped access',
          text: 'Recruiters, managers and leadership see the same model through different scopes rather than through different numbers.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Data', items: ['SQL', 'Star schema modeling', 'Scheduled extract and load'] },
        { title: 'Semantic layer', items: ['Power BI', 'DAX', 'Row-Level Security'] },
        { title: 'Machine learning', items: ['Python', 'scikit-learn', 'pandas'] },
        { title: 'Delivery', items: ['Role-scoped dashboards', 'Daily refresh'] },
      ],
    },

    closing: 'Raw activity in. A decision a manager can actually act on out.',
  },

  /* ================================================================
   * MEDICAL DATA INTELLIGENCE PLATFORM
   * ================================================================ */
  'medical-data-intelligence-platform': {
    role: 'Project Lead, AI & Analytics Products',
    builtOn: 'Power BI, Python, OCR',

    flow: [
      { number: '01', title: 'Receive', detail: 'Documents, attachments, email' },
      { number: '02', title: 'Extract', detail: 'OCR, structure, classify' },
      { number: '03', title: 'Reconcile', detail: 'Validate against existing records' },
      { number: '04', title: 'Report', detail: 'Governed reporting and forecasts' },
    ],

    atAGlance: {
      headline: 'Treat the document pipeline and the reporting layer as one problem.',
      intro:
        'Medical data arrives in formats built for people rather than systems. Reporting, forecasting and document handling had grown up separately, so the same information was re-entered and re-reconciled several times before anyone could act on it.',
      points: [
        {
          title: 'Structure at the point of arrival',
          text: 'Documents are converted into structured records when they land, rather than being re-keyed later by whoever needs them.',
        },
        {
          title: 'Reconcile before reporting',
          text: 'Validation and reconciliation run as defined workflow steps, so the reporting layer reads governed data rather than raw feeds.',
        },
        {
          title: 'One foundation for both',
          text: 'Reporting and prediction are built on the same governed layer, so a forecast and a report cannot disagree about the underlying facts.',
        },
      ],
    },

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

    techStack: {
      groups: [
        { title: 'Analytics', items: ['Power BI', 'DAX', 'SQL'] },
        { title: 'Document processing', items: ['OCR', 'Python', 'Automated email handling'] },
        { title: 'Machine learning', items: ['Python', 'Predictive models'] },
      ],
    },

    closing: 'Documents in. Governed, reportable data out.',
  },

  /* ================================================================
   * CORPORATE WEBSITE REDESIGN
   * ================================================================ */
  'corporate-website-redesign': {
    role: 'Product Owner, UX Lead & Frontend Architect',
    builtOn: 'React, Next.js, headless CMS',

    flow: [
      { number: '01', title: 'Audit', detail: 'Content inventory, analytics, search' },
      { number: '02', title: 'Restructure', detail: 'IA built around visitor intent' },
      { number: '03', title: 'Design', detail: 'Design system, not page mockups' },
      { number: '04', title: 'Build', detail: 'Componentized, CMS-driven' },
      { number: '05', title: 'Migrate', detail: 'Redirect map, launch, monitor' },
    ],

    stats: [
      { value: '1', label: 'design system replacing per-page bespoke layouts' },
      { value: '100', unit: '%', label: 'of pages editable by the marketing team without a release' },
      { value: '0', label: 'known broken inbound links at launch, via a full redirect map' },
      { value: 'AA', label: 'WCAG 2.1 conformance target, verified before launch' },
    ],

    atAGlance: {
      headline: 'A website the firm can run, not one they have to commission.',
      intro:
        'The brief was a redesign. The actual problem was that every change needed a developer, the structure mirrored the org chart rather than the visitor, and nobody could say which pages were earning their place.',
      points: [
        {
          title: 'Structure before surface',
          text: 'The information architecture was rebuilt around the questions a prospective client arrives with, before a single visual decision was made.',
        },
        {
          title: 'A system, not a set of pages',
          text: 'A componentized design system means new pages are assembled from reviewed parts rather than designed from scratch and drifting apart.',
        },
        {
          title: 'Editable by the people who own the content',
          text: 'Every block on every page is CMS-driven, so the marketing team ships copy changes without a deployment.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Long-established firms accumulate a website rather than design one.',
      intro:
        'Years of additions had produced a site where services were described in internal language, similar pages had drifted into different layouts, and the inquiry route was buried several clicks deep.',
      points: [
        {
          title: 'Structure mirrored the org chart',
          text: 'Navigation reflected how the firm was organized internally, which is rarely how a prospective client thinks about their problem.',
        },
        {
          title: 'Every change needed a developer',
          text: 'Copy lived in markup. A wording change meant a ticket, a release and a wait, so the site aged between redesigns instead of improving continuously.',
        },
        {
          title: 'Layouts had drifted apart',
          text: 'Pages built at different times by different people looked and behaved differently, which undermined exactly the impression of rigor the firm sells.',
        },
        {
          title: 'No measurement to argue from',
          text: 'Without defined events there was no evidence for which pages mattered, so redesign decisions were a matter of opinion.',
        },
      ],
    },

    approachDetail: {
      headline: 'Rebuild the architecture, then let design carry the seniority.',
      points: [
        {
          title: 'Start from the visitor question',
          text: 'Content was inventoried and mapped against search and analytics data, then restructured around intent rather than internal reporting lines.',
        },
        {
          title: 'Design a system, not screens',
          text: 'Typography, spacing, color and a component library were defined first, so every page is assembled from parts that have already been reviewed.',
        },
        {
          title: 'No stock photography',
          text: 'Seniority is carried by typography, restraint and real material. Generic imagery says the opposite of what a professional services firm needs to say.',
        },
        {
          title: 'Instrument before launch',
          text: 'Analytics events and the inquiry funnel were defined during the build, so the first month produced evidence rather than opinions.',
        },
      ],
    },

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

    components: {
      eyebrow: 'What was delivered',
      headline: 'The parts that make it maintainable.',
      items: [
        {
          index: 'IA',
          name: 'Information architecture',
          what: 'A content inventory, a rationalized sitemap and a navigation model built around visitor intent, agreed before design started.',
          guardrail: 'Signed off as a document, so later disagreements were about the map rather than about a page.',
        },
        {
          index: 'DS',
          name: 'Design system',
          what: 'Tokens, type scale, spacing rhythm and a component library covering every block the site needs.',
          guardrail: 'New pages must be composed from existing components, which is what stops layouts drifting apart again.',
        },
        {
          index: 'CMS',
          name: 'Content model',
          what: 'Structured content types with defined fields, so an editor cannot accidentally produce an invalid or unstyled page.',
          guardrail: 'Constrained fields rather than a rich-text blob, which is what keeps a CMS-driven site coherent over years.',
        },
        {
          index: 'SEO',
          name: 'Migration and SEO',
          what: 'A full redirect map from the legacy URL structure, metadata, canonical URLs and structured data.',
          guardrail: 'Crawled before and after launch, so no inbound link silently broke.',
        },
      ],
    },

    safeguards: {
      eyebrow: 'Quality gates',
      headline: 'What had to pass before launch.',
      points: [
        {
          title: 'Accessibility verified, not assumed',
          text: 'Semantic structure, keyboard operability, visible focus states, contrast and reduced-motion support checked against WCAG 2.1 AA.',
        },
        {
          title: 'Responsive from small phone to large desktop',
          text: 'Tested at real breakpoints rather than the three the design tool happened to use.',
        },
        {
          title: 'Performance budget',
          text: 'Image optimization, lazy loading and a limit on blocking scripts, enforced during the build rather than profiled afterward.',
        },
        {
          title: 'No mail-client dependency',
          text: 'Inquiries post to a validated, rate-limited endpoint, so a visitor without a configured mail client can still reach the firm.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
        { title: 'Content', items: ['Headless CMS', 'Structured content types', 'Media pipeline'] },
        { title: 'Delivery', items: ['Static rendering', 'Edge caching', 'CI/CD', 'Preview deployments'] },
        { title: 'Measurement', items: ['Analytics events', 'Funnel tracking', 'Search Console'] },
      ],
    },

    roadmap: {
      headline: 'What the platform is built to take on next.',
      groups: [
        {
          title: 'Content operations',
          items: [
            'Editorial workflow with review and scheduled publishing',
            'Reusable content blocks shared across campaign pages',
            'Content performance reporting back to the editors',
          ],
        },
        {
          title: 'Reach',
          items: [
            'Additional language variants using the same content model',
            'Campaign landing pages composed from the existing system',
          ],
        },
        {
          title: 'Conversion',
          items: [
            'Progressive inquiry forms that adapt to the service selected',
            'Experimentation framework for headline and CTA variants',
          ],
        },
      ],
    },

    closing: 'A structure the firm can extend, without commissioning a redesign each time.',
  },

  /* ================================================================
   * CREATIVE PORTFOLIO WEBSITE
   * ================================================================ */
  'portfolio-website': {
    role: 'Product Owner, Art Direction & Frontend Architect',
    builtOn: 'React, Vite, Framer Motion, headless content',

    flow: [
      { number: '01', title: 'Curate', detail: 'Which work earns a place' },
      { number: '02', title: 'Art direct', detail: 'Crops and sequence per project' },
      { number: '03', title: 'Compose', detail: 'Index and detail as one system' },
      { number: '04', title: 'Optimize', detail: 'Asset pipeline, lazy loading' },
      { number: '05', title: 'Publish', detail: 'New work is a content change' },
    ],

    stats: [
      { value: '1', label: 'content model: publishing new work needs no deployment' },
      { value: '2', label: 'full experiences, with and without motion' },
      { value: '4', label: 'responsive image derivatives generated per asset' },
      { value: 'AA', label: 'WCAG 2.1 conformance target, verified before launch' },
    ],

    atAGlance: {
      headline: 'The work is the interface. Everything else gets out of the way.',
      intro:
        'Portfolio sites tend to fail in one of two directions: so plain the work looks unconsidered, or so animated the work cannot be seen at all. The whole design problem is staying between those.',
      points: [
        {
          title: 'Art direction per project',
          text: 'Each project defines its own crops and sequence rather than being forced through one fixed template, so strong work is not flattened by the grid.',
        },
        {
          title: 'Motion with a job',
          text: 'Transitions establish the relationship between index and detail. Anything that does not clarify a state change was cut.',
        },
        {
          title: 'Fast is part of the design',
          text: 'An image-led site that loads slowly is a slow site, whatever the design says. The asset pipeline is a design decision, not an afterthought.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Showing work well is harder than it looks.',
      points: [
        {
          title: 'Templates flatten strong work',
          text: 'One fixed layout applied to every project serves the weakest piece and undersells the best one.',
        },
        {
          title: 'Motion competes with the work',
          text: 'Animation that exists to be noticed takes attention away from the thing it is supposed to present.',
        },
        {
          title: 'Image weight kills the experience',
          text: 'Large-format visuals are the point of the site and the fastest way to make it unusable on a normal connection.',
        },
        {
          title: 'Publishing became a project',
          text: 'When adding a piece of work requires a developer, the portfolio goes stale between redesigns.',
        },
      ],
    },

    approachDetail: {
      headline: 'Let the work set the palette. Keep the chrome quiet.',
      points: [
        {
          title: 'Design the index and detail together',
          text: 'They are two states of one system, not two pages, which is what makes the transition between them meaningful.',
        },
        {
          title: 'Structure the content first',
          text: 'A defined content model means publishing new work is a content change, and the site cannot drift into inconsistency.',
        },
        {
          title: 'Build the no-motion path properly',
          text: 'Reduced motion is a full, designed experience rather than the same page with the animation switched off and the hierarchy lost.',
        },
      ],
    },

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

    safeguards: {
      eyebrow: 'Quality gates',
      headline: 'What had to hold before launch.',
      points: [
        {
          title: 'Full experience under reduced motion',
          text: 'Every state reachable, every relationship legible, with no movement at all.',
        },
        {
          title: 'Performance budget on an image-led site',
          text: 'Derivative sizes, formats and loading strategy fixed as a budget rather than tuned after complaints.',
        },
        {
          title: 'Keyboard operable throughout',
          text: 'Including the index-to-detail transition, which is where animated portfolios usually trap keyboard users.',
        },
        {
          title: 'Publishing cannot break layout',
          text: 'Constrained content fields mean a new project cannot produce an unstyled or broken page.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Frontend', items: ['React', 'Vite', 'Framer Motion', 'Tailwind CSS'] },
        { title: 'Content', items: ['Structured project model', 'Headless content', 'Art direction rules'] },
        { title: 'Assets', items: ['Responsive derivatives', 'Modern image formats', 'Lazy loading'] },
        { title: 'Delivery', items: ['Static rendering', 'Edge caching', 'CI/CD'] },
      ],
    },

    closing: 'Attention on the work, not on the interface around it.',
  },

  /* ================================================================
   * CUSTOMER CHURN PREDICTION
   * ================================================================ */
  'customer-churn-prediction': {
    role: 'Product Owner & ML Solution Architect',
    builtOn: 'Python, scikit-learn, pandas, CRM integration',

    flow: [
      { number: '01', title: 'Define', detail: 'What churn means, and for whom' },
      { number: '02', title: 'Engineer', detail: 'Usage, support and billing features' },
      { number: '03', title: 'Train', detail: 'Versioned, reproducible runs' },
      { number: '04', title: 'Serve', detail: 'Scores into existing tooling' },
      { number: '05', title: 'Monitor', detail: 'Drift, quality and retraining' },
    ],

    stats: [
      { value: '3', label: 'signal families: product usage, support history and billing' },
      { value: '1', label: 'churn definition, agreed before any model was trained' },
      { value: '100', unit: '%', label: 'of scores delivered with their contributing factors' },
      { value: '0', label: 'new tools for the customer success team to learn' },
    ],

    atAGlance: {
      headline: 'A prediction nobody acts on is a report, not a product.',
      intro:
        'The modeling was the straightforward part. The work that made it useful was deciding who would act on a score, how much notice they needed, and what they could realistically do with it.',
      points: [
        {
          title: 'Define churn first',
          text: 'Cancellation, downgrade and silent lapse are different events with different interventions. Agreeing one definition came before any feature engineering.',
        },
        {
          title: 'Build backwards from the action',
          text: 'The notice period the team needs determines the prediction horizon, which determines which features are even allowed to be used.',
        },
        {
          title: 'Explain every score',
          text: 'A risk number with no reasoning attached gets ignored by the third week. Contributing factors ship with the score.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Subscription businesses learn about churn from the cancellation report.',
      intro:
        'By the time an account cancels, the relationship is over and the only remaining lever is a discount. Everything useful happens earlier, in signals nobody was consolidating.',
      points: [
        {
          title: 'Signals sat in separate systems',
          text: 'Product usage, support history and billing state each told part of the story and none of them talked to each other.',
        },
        {
          title: 'No agreed definition',
          text: 'Different teams counted churn differently, so a model trained on one definition would have been immediately disputed by another.',
        },
        {
          title: 'Leakage is easy and invisible',
          text: 'Features that are only populated once an account is already leaving make a model look excellent in evaluation and useless in production.',
        },
        {
          title: 'Adoption is the real risk',
          text: 'A score delivered in a new tool nobody opens changes nothing, however accurate it is.',
        },
      ],
    },

    approachDetail: {
      headline: 'Treat it as an operational problem, not a modeling exercise.',
      points: [
        {
          title: 'Agree the target before the model',
          text: 'One churn definition and one prediction horizon, signed off by the teams who would be measured against them.',
        },
        {
          title: 'Guard against leakage deliberately',
          text: 'Features are computed as of the prediction point, so nothing that only exists after the decision can leak into training.',
        },
        {
          title: 'Deliver into existing tooling',
          text: 'Scores land in the systems the customer success team already lives in, which is the difference between a model used and a model admired.',
        },
        {
          title: 'Plan for the model getting stale',
          text: 'Retraining, versioning and performance tracking were designed in, because a model that is not monitored is a model that is quietly wrong.',
        },
      ],
    },

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

    components: {
      eyebrow: 'The pieces',
      headline: 'What makes the score usable.',
      items: [
        {
          index: '1',
          name: 'Feature pipeline',
          what: 'Rolling aggregations over usage, support and billing data, joined point-in-time so every training row reflects only what was known at that moment.',
          guardrail: 'Leakage checks on every feature. Anything only populated post-decision is excluded by construction, not by review.',
        },
        {
          index: '2',
          name: 'Training and evaluation',
          what: 'Versioned training runs with temporal validation, so performance is measured the way the model will actually be used.',
          guardrail: 'A random split would flatter the model. Evaluation is always forward in time.',
        },
        {
          index: '3',
          name: 'Explanation layer',
          what: 'Each score ships with the factors that drove it, expressed in business language rather than feature names.',
          guardrail: 'A score without reasoning is not shown. Unexplainable output is treated as a defect.',
        },
        {
          index: '4',
          name: 'Delivery integration',
          what: 'Scores and factors pushed into the tools the customer success team already uses, segmented by plan, tenure and owner.',
          guardrail: 'No new interface to adopt, which is what determines whether any of this gets used.',
        },
        {
          index: '5',
          name: 'Monitoring and retraining',
          what: 'Scheduled retraining with performance tracking and drift detection on both features and predictions.',
          guardrail: 'Degradation surfaces as an alert rather than as a gradually ignored dashboard.',
        },
      ],
    },

    safeguards: {
      headline: 'Where a prediction is allowed to influence a decision.',
      points: [
        {
          title: 'The model advises, the team decides',
          text: 'No automated commercial action is triggered by a score. It prioritizes attention; a person chooses the intervention.',
        },
        {
          title: 'Point-in-time correctness',
          text: 'Enforced in the pipeline rather than checked in review, because leakage is invisible in every metric that would otherwise catch it.',
        },
        {
          title: 'Segment-level fairness checks',
          text: 'Performance is reviewed per plan and tenure cohort, so the model is not accurate overall and useless for a segment that matters.',
        },
        {
          title: 'Observable after deployment',
          text: 'Feature drift, score distribution and outcome tracking are part of the delivery, not a later phase.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Modeling', items: ['Python', 'scikit-learn', 'pandas', 'NumPy'] },
        { title: 'Pipeline', items: ['Scheduled feature jobs', 'Point-in-time joins', 'Validation checks'] },
        { title: 'Delivery', items: ['CRM and success tooling integration', 'Segmented scored lists'] },
        { title: 'Operations', items: ['Versioned training runs', 'Drift monitoring', 'Scheduled retraining'] },
      ],
    },

    roadmap: {
      headline: 'Where the capability goes next.',
      groups: [
        {
          title: 'Model',
          items: [
            'Uplift modeling, to predict who responds to an intervention rather than who is at risk',
            'Survival modeling for time-to-churn rather than a fixed horizon',
          ],
        },
        {
          title: 'Operations',
          items: [
            'Automated champion and challenger comparison before promotion',
            'Feature store so definitions are shared with other models',
          ],
        },
        {
          title: 'Product',
          items: [
            'Recommended next action alongside each risk score',
            'Outcome tracking to close the loop between intervention and result',
          ],
        },
      ],
    },

    closing: 'Advance warning, with the reasoning attached, in the tools the team already uses.',
  },

  /* ================================================================
   * IMAGE CLASSIFICATION SYSTEM
   * ================================================================ */
  'image-classification-system': {
    role: 'Product Owner & ML Solution Architect',
    builtOn: 'PyTorch, OpenCV, containerized edge deployment',

    flow: [
      { number: '01', title: 'Capture', detail: 'Line imaging, consistent conditions' },
      { number: '02', title: 'Classify', detail: 'Model scores each item' },
      { number: '03', title: 'Threshold', detail: 'Confident pass, uncertain escalates' },
      { number: '04', title: 'Review', detail: 'Inspector decides the hard cases' },
      { number: '05', title: 'Learn', detail: 'Reviewed cases return to training' },
    ],

    stats: [
      { value: '100', unit: '%', label: 'of automated decisions recorded and reviewable' },
      { value: '2', label: 'outcomes only: confident classification, or escalate to a person' },
      { value: '1', label: 'feedback loop returning every human review to training data' },
      { value: '0', label: 'items pass without either model confidence or human sign-off' },
    ],

    atAGlance: {
      headline: 'Built to assist inspectors, not to quietly replace their judgment.',
      intro:
        'Defects are rare, which makes them both hard to catch and hard to gather training data for. A system designed around the average case would be accurate on paper and useless on the line.',
      points: [
        {
          title: 'Design for the rare case',
          text: 'Optimized for recall on defects, because the cost of a missed defect and the cost of a false alarm are nothing like equal.',
        },
        {
          title: 'Uncertainty escalates',
          text: 'Anything the model is not confident about goes to an inspector rather than being forced into a decision.',
        },
        {
          title: 'Every decision is reviewable',
          text: 'The image, the score and the outcome are recorded, so a disputed call can be examined rather than argued about.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Manual inspection is consistent for the first hour of a shift.',
      intro:
        'Visual inspection is demanding, repetitive work, and consistency degrades across a shift in ways nobody intends and nobody records.',
      points: [
        {
          title: 'Defects are rare',
          text: 'Class imbalance means a model can score extremely well by predicting "fine" every time, which is exactly the wrong behavior.',
        },
        {
          title: 'Training data barely exists',
          text: 'The interesting cases are by definition uncommon, so the dataset starts thin precisely where it matters most.',
        },
        {
          title: 'Conditions vary',
          text: 'Lighting, positioning and product variation change what the same defect looks like from one run to the next.',
        },
        {
          title: 'Trust has to be earned',
          text: 'Inspectors will not defer to a system they cannot interrogate, and they are right not to.',
        },
      ],
    },

    approachDetail: {
      headline: 'Optimize for recall, escalate uncertainty, and record everything.',
      points: [
        {
          title: 'Augment aggressively for scarce classes',
          text: 'Targeted augmentation for defect classes, reflecting the real variation in lighting and positioning rather than generic transforms.',
        },
        {
          title: 'Make the threshold a business decision',
          text: 'Where confidence stops and escalation starts is a cost trade-off the business owns, not a hyperparameter an engineer picks.',
        },
        {
          title: 'Close the loop from day one',
          text: 'Every inspector review becomes labeled training data, so the system improves from normal operation rather than from a separate labeling project.',
        },
        {
          title: 'Deploy at the line',
          text: 'Containerized at the edge, so a network problem slows nothing down and inspection does not depend on a round trip.',
        },
      ],
    },

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

    components: {
      eyebrow: 'The pieces',
      headline: 'What makes it safe to run unattended.',
      items: [
        {
          index: '1',
          name: 'Augmentation strategy',
          what: 'Targeted augmentation for scarce defect classes, modeled on the real variation seen on the line rather than generic transforms.',
          guardrail: 'Augmentation is validated against held-out real defects, so it does not teach the model an artefact.',
        },
        {
          index: '2',
          name: 'Confidence thresholds',
          what: 'A configurable boundary between confident classification and escalation, owned by the business.',
          guardrail: 'Changing the threshold is a recorded decision, because it directly trades false alarms against missed defects.',
        },
        {
          index: '3',
          name: 'Escalation path',
          what: 'Uncertain items are routed to an inspector with the image and the score, rather than being forced into a class.',
          guardrail: 'There is no silent third option. An item is either confidently classified or seen by a person.',
        },
        {
          index: '4',
          name: 'Decision record',
          what: 'Every classified item keeps its image, score, outcome and, where applicable, the reviewer.',
          guardrail: 'A disputed decision can be reconstructed months later.',
        },
        {
          index: '5',
          name: 'Feedback loop',
          what: 'Reviewed cases flow back into the training set, with retraining evaluated before any promotion.',
          guardrail: 'A new model has to beat the incumbent on defect recall before it replaces it.',
        },
      ],
    },

    safeguards: {
      headline: 'Where the system is allowed to decide alone.',
      points: [
        {
          title: 'Recall weighted over accuracy',
          text: 'A missed defect costs more than a false alarm, and the objective function says so explicitly.',
        },
        {
          title: 'Uncertainty is never resolved automatically',
          text: 'Low-confidence items escalate. The system has no mechanism for guessing.',
        },
        {
          title: 'Promotion is gated on defect recall',
          text: 'Overall accuracy improving is not sufficient reason to deploy a new model.',
        },
        {
          title: 'Runs without the network',
          text: 'Edge deployment means connectivity problems slow production down rather than stopping inspection.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Modeling', items: ['PyTorch', 'OpenCV', 'Python'] },
        { title: 'Serving', items: ['Flask REST inference API', 'Docker', 'Edge deployment'] },
        { title: 'Data', items: ['Reviewed case store', 'Versioned training sets'] },
        { title: 'Operations', items: ['Retraining pipeline', 'Model monitoring', 'Decision audit trail'] },
      ],
    },

    roadmap: {
      headline: 'Where the capability goes next.',
      groups: [
        {
          title: 'Model',
          items: [
            'Defect localization, so the inspector sees where as well as whether',
            'Per-defect-class thresholds rather than one global boundary',
          ],
        },
        {
          title: 'Operations',
          items: [
            'Active learning, prioritizing the most informative cases for review',
            'Automated evaluation and promotion gates in the retraining pipeline',
          ],
        },
        {
          title: 'Insight',
          items: [
            'Defect trend reporting back to production, to address causes not just symptoms',
            'Shift and line comparison to surface systematic differences',
          ],
        },
      ],
    },

    closing: 'Consistent inspection across a full shift, with a person on every uncertain call.',
  },

  /* ================================================================
   * E-COMMERCE ANALYTICS PLATFORM
   * ================================================================ */
  'ecommerce-analytics-platform': {
    builtOn: 'Python, Apache Airflow, PostgreSQL, Tableau',

    flow: [
      { number: '01', title: 'Define', detail: 'Order, customer and product' },
      { number: '02', title: 'Ingest', detail: 'Storefront, payments, fulfillment' },
      { number: '03', title: 'Model', detail: 'Governed warehouse' },
      { number: '04', title: 'Check', detail: 'Quality rules and alerts' },
      { number: '05', title: 'Report', detail: 'One set of trading numbers' },
    ],

    atAGlance: {
      headline: 'One set of numbers, agreed before anyone builds a dashboard.',
      intro:
        'The retailer did not lack reports. It had too many, each reading a different system and each giving a slightly different answer to the same question.',
      points: [
        {
          title: 'Definitions first',
          text: 'What counts as an order, a returning customer or a sold unit was written down and agreed before a single pipeline was built.',
        },
        {
          title: 'One semantic layer',
          text: 'Every dashboard reads its metrics from the same governed definitions, so two reports cannot disagree about revenue.',
        },
        {
          title: 'Failures are loud',
          text: 'A pipeline that fails or loads suspicious data raises an alert before the morning trading meeting, not during it.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Every meeting started with an argument about the numbers.',
      intro:
        'Storefront, payment provider, warehouse system and a shared spreadsheet each held part of the picture, and each was treated as the source of truth by someone.',
      points: [
        {
          title: 'Four sources, four answers',
          text: 'Refunds, partial shipments and canceled orders were handled differently in each system, so revenue and units never matched.',
        },
        {
          title: 'Manual reconciliation every week',
          text: 'An analyst spent part of every week lining the systems up by hand before any reporting could start.',
        },
        {
          title: 'Silent data problems',
          text: 'When a feed broke, nobody knew until a number looked wrong in a meeting.',
        },
      ],
    },

    approachDetail: {
      headline: 'Model the business, then build the pipelines around it.',
      points: [
        {
          title: 'Agree the vocabulary',
          text: 'Trading, marketing and finance signed off one definition per metric, recorded alongside the model that computes it.',
        },
        {
          title: 'Design around definitions, not systems',
          text: 'Pipelines were shaped by what the business needed to measure, rather than by whichever system happened to hold the data.',
        },
        {
          title: 'Keep history',
          text: 'Daily snapshots make period-on-period comparison reliable even when source systems overwrite records.',
        },
      ],
    },

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

    safeguards: {
      eyebrow: 'Data quality',
      headline: 'What stops a bad number reaching a meeting.',
      points: [
        {
          title: 'Freshness checks',
          text: 'Each source has an expected arrival window. A late feed is flagged rather than quietly reported as a slow day.',
        },
        {
          title: 'Cross-system reconciliation',
          text: 'Order totals are reconciled against payment captures on every load, so a mismatch surfaces at its source.',
        },
        {
          title: 'Alerting on failure',
          text: 'A failed or partial load notifies the data owner and marks affected dashboards as stale.',
        },
        {
          title: 'Definitions under change control',
          text: 'A metric definition changes through review, not through someone editing a dashboard formula.',
        },
      ],
    },

    techStack: {
      groups: [
        { title: 'Pipelines', items: ['Python', 'Apache Airflow'] },
        { title: 'Warehouse', items: ['PostgreSQL', 'Daily snapshots', 'Semantic layer'] },
        { title: 'Reporting', items: ['Tableau'] },
        { title: 'Operations', items: ['Data quality checks', 'Failure alerting'] },
      ],
    },

    closing: 'Trading meetings now start from the same numbers.',
  },

  /* ================================================================
   * REAL-TIME DATA STREAMING PLATFORM
   * ================================================================ */
  'realtime-data-streaming-platform': {
    builtOn: 'Kafka, Python, AWS, Docker',

    flow: [
      { number: '01', title: 'Publish', detail: 'Vehicles, depots, orders' },
      { number: '02', title: 'Validate', detail: 'Schemas at the boundary' },
      { number: '03', title: 'Process', detail: 'Rolling aggregates' },
      { number: '04', title: 'Serve', detail: 'Live dispatch view' },
      { number: '05', title: 'Store', detail: 'Warehouse and replay' },
    ],

    atAGlance: {
      headline: 'Publish once, let every team read at its own pace.',
      intro:
        'Dispatch needed to know about a slipping delivery while it could still be rescued. Overnight batch reporting told them the next morning.',
      points: [
        {
          title: 'An event backbone',
          text: 'Vehicles, depots and the order system publish events once; dispatch, reporting and alerting each consume them independently.',
        },
        {
          title: 'Contracts at the boundary',
          text: 'Every event is validated against a versioned schema on arrival, so a malformed message cannot break the consumers downstream.',
        },
        {
          title: 'Replay as a feature',
          text: 'Retained history means recovery and backfill are a replay, not a reconstruction from logs.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Batch reporting is fine for accounts and useless for dispatch.',
      points: [
        {
          title: 'News arrived a day late',
          text: 'Exceptions surfaced in the next morning’s report, long after the customer had noticed.',
        },
        {
          title: 'Point-to-point integrations',
          text: 'Every new consumer meant another direct connection into the systems producing the data.',
        },
        {
          title: 'Recovery was manual',
          text: 'When a job failed, rebuilding the missing period meant stitching data together by hand.',
        },
      ],
    },

    approachDetail: {
      headline: 'Separate the backbone from the consumers.',
      points: [
        {
          title: 'Events, not extracts',
          text: 'Source systems publish what happened as it happens, rather than being queried on a schedule.',
        },
        {
          title: 'Schema governance',
          text: 'Schemas are versioned and checked at ingestion, so producers and consumers can change independently.',
        },
        {
          title: 'Infrastructure as code',
          text: 'Every environment is defined in code, so staging behaves like production.',
        },
      ],
    },

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

    techStack: {
      groups: [
        { title: 'Streaming', items: ['Kafka', 'Schema validation', 'Stream processing'] },
        { title: 'Services', items: ['Python', 'Docker'] },
        { title: 'Cloud', items: ['AWS', 'Infrastructure as code'] },
        { title: 'Operations', items: ['Monitoring and alerting', 'Replay and backfill'] },
      ],
    },

    closing: 'Dispatch hears about a problem while it can still be fixed.',
  },

  /* ================================================================
   * RECOMMENDATION ENGINE
   * ================================================================ */
  'recommendation-engine': {
    builtOn: 'Python, TensorFlow, Redis, FastAPI',

    flow: [
      { number: '01', title: 'Signals', detail: 'Behavior and attributes' },
      { number: '02', title: 'Candidates', detail: 'Cached generation' },
      { number: '03', title: 'Rank', detail: 'Hybrid model' },
      { number: '04', title: 'Rules', detail: 'Merchandiser overrides' },
      { number: '05', title: 'Test', detail: 'Controlled experiments' },
    ],

    atAGlance: {
      headline: 'Recommendations that help discovery, not just repeat the bestsellers.',
      intro:
        'Generic “customers also bought” strips kept recommending what was already popular. New products and slower lines never got seen.',
      points: [
        {
          title: 'Behavior plus attributes',
          text: 'Blending what customers do with what products are gives the model something sensible to say about items with little history.',
        },
        {
          title: 'Merchandisers stay in charge',
          text: 'A rules layer above the model lets the team pin, exclude and boost products without retraining anything.',
        },
        {
          title: 'Evidence before rollout',
          text: 'Ranking strategies are compared in controlled experiments rather than swapped on instinct.',
        },
      ],
    },

    challengeDetail: {
      headline: 'A large catalog is only an asset if people can find their way through it.',
      points: [
        {
          title: 'Popularity bias',
          text: 'Recommendations based on co-purchase alone kept promoting the same small set of products.',
        },
        {
          title: 'Cold start',
          text: 'New listings had no history, so the existing approach never recommended them.',
        },
        {
          title: 'No commercial control',
          text: 'The merchandising team could not steer what appeared, even for stock that needed to move.',
        },
      ],
    },

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

    techStack: {
      groups: [
        { title: 'Modeling', items: ['Python', 'TensorFlow'] },
        { title: 'Serving', items: ['FastAPI', 'Redis'] },
        { title: 'Control', items: ['Merchandiser rules layer', 'Experiment framework'] },
      ],
    },

    closing: 'Customers find more of the catalog, and the team still decides what matters.',
  },

  /* ================================================================
   * SAAS DASHBOARD APPLICATION
   * ================================================================ */
  'saas-dashboard-application': {
    builtOn: 'React, Node.js, MongoDB, Stripe',

    flow: [
      { number: '01', title: 'Tenancy', detail: 'Accounts and data isolation' },
      { number: '02', title: 'Roles', detail: 'Teams and permissions' },
      { number: '03', title: 'Billing', detail: 'Subscription lifecycle' },
      { number: '04', title: 'Dashboard', detail: 'In-product analytics' },
      { number: '05', title: 'API', detail: 'Documented integrations' },
    ],

    atAGlance: {
      headline: 'Foundations first, so features stay fast later.',
      intro:
        'The interesting part of a SaaS product is rarely the part that takes the time. Accounts, permissions and billing edge cases do, and they are painful to retrofit.',
      points: [
        {
          title: 'Multi-tenant from day one',
          text: 'Every record belongs to an account, and isolation is enforced in the data layer rather than remembered in each feature.',
        },
        {
          title: 'One subscription lifecycle',
          text: 'Trials, upgrades, downgrades, failed payments and cancellations all move through the same states.',
        },
        {
          title: 'A dashboard worth returning to',
          text: 'In-product analytics answer the questions customers were exporting spreadsheets to answer.',
        },
      ],
    },

    approachDetail: {
      headline: 'Settle who can see what before building what they see.',
      points: [
        {
          title: 'Permission model as a contract',
          text: 'Roles and their permissions were defined and tested before feature work, so new screens inherit them automatically.',
        },
        {
          title: 'Billing as state, not as webhooks',
          text: 'Payment events update a single subscription state that the product reads, instead of features reacting to payment events directly.',
        },
        {
          title: 'API designed alongside the UI',
          text: 'The interface uses the same documented API customers integrate against, which keeps it honest.',
        },
      ],
    },

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

    techStack: {
      groups: [
        { title: 'Frontend', items: ['React'] },
        { title: 'Backend', items: ['Node.js', 'REST API'] },
        { title: 'Data', items: ['MongoDB'] },
        { title: 'Billing', items: ['Stripe', 'Subscription webhooks'] },
      ],
    },

    closing: 'The foundations were settled once, so the product can keep growing on top of them.',
  },

  /* ================================================================
   * SECTOR CASE STUDIES — drafts, published: false in projects.js
   * ================================================================ */
  'lending-operations-portal': {
    builtOn: 'React, Node.js, PostgreSQL, Power BI',

    flow: [
      { number: '01', title: 'Intake', detail: 'Applications and documents' },
      { number: '02', title: 'Verify', detail: 'Checklists and validation' },
      { number: '03', title: 'Approve', detail: 'Maker-checker workflow' },
      { number: '04', title: 'Audit', detail: 'Every action recorded' },
      { number: '05', title: 'Report', detail: 'Pipeline and exceptions' },
    ],

    atAGlance: {
      headline: 'Auditability designed in, not added after the first review.',
      intro:
        'Loan applications moved between email, shared folders and spreadsheets. Each step worked, but nobody could show who approved what, when, and on which version of the documents.',
      points: [
        {
          title: 'One place for every application',
          text: 'Intake, document collection, verification and approval run through a single portal with a clear status at every step.',
        },
        {
          title: 'Maker-checker by default',
          text: 'The person who prepares a decision can never be the person who approves it. The workflow enforces it rather than relying on policy.',
        },
        {
          title: 'An audit trail that answers questions',
          text: 'Every change, approval and document version is recorded with who, when and why.',
        },
      ],
    },

    challengeDetail: {
      headline: 'In financial services the constraints are the design.',
      points: [
        {
          title: 'Work spread across tools',
          text: 'Email threads, shared folders and trackers each held part of an application’s history.',
        },
        {
          title: 'Access was hard to govern',
          text: 'Folder permissions did not match roles, so sensitive documents were visible to more people than necessary.',
        },
        {
          title: 'Reporting was retrospective',
          text: 'Pipeline and turnaround reports were compiled by hand at month end.',
        },
      ],
    },

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

    safeguards: {
      eyebrow: 'Controls',
      headline: 'What the system enforces.',
      points: [
        { title: 'Role-based access', text: 'Users see only the applications and documents their role requires.' },
        { title: 'Segregation of duties', text: 'Preparer and approver are always different people.' },
        { title: 'Immutable history', text: 'Audit entries are appended, never edited.' },
        { title: 'Document versioning', text: 'An approval is tied to the exact document versions it was based on.' },
      ],
    },

    techStack: {
      groups: [
        { title: 'Application', items: ['React', 'Node.js', 'REST API'] },
        { title: 'Data', items: ['PostgreSQL', 'Append-only audit log', 'Document storage'] },
        { title: 'Reporting', items: ['Power BI'] },
        { title: 'Security', items: ['Role-based access', 'Single sign-on'] },
      ],
    },

    closing: 'Every decision can be traced to a person, a time and a document.',
  },

  'property-listings-platform': {
    builtOn: 'Next.js, headless CMS, PostgreSQL',

    flow: [
      { number: '01', title: 'List', detail: 'Structured property data' },
      { number: '02', title: 'Search', detail: 'Filters and map' },
      { number: '03', title: 'Compare', detail: 'Shortlist side by side' },
      { number: '04', title: 'Inquire', detail: 'Routed to the right agent' },
      { number: '05', title: 'Follow up', detail: 'Saved searches and alerts' },
    ],

    atAGlance: {
      headline: 'Property decisions are slow, visual and comparative. The site had to be too.',
      intro:
        'Listings were uploaded as PDFs and images, inquiries arrived in one shared inbox, and buyers had no way to keep a shortlist between visits.',
      points: [
        {
          title: 'Structured listings',
          text: 'Every property has the same structured fields, so search, filters and comparison work reliably.',
        },
        {
          title: 'A shortlist that lasts',
          text: 'Buyers save properties and searches, and come back to them over the months a decision takes.',
        },
        {
          title: 'Inquiries reach the right agent',
          text: 'Each inquiry is routed to the agent responsible for that property, with the listing attached.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Great photography, buried in PDFs.',
      points: [
        { title: 'Unsearchable listings', text: 'Key details lived inside documents, so buyers could not filter by what mattered to them.' },
        { title: 'One inbox for everything', text: 'Inquiries waited in a shared mailbox until someone forwarded them.' },
        { title: 'No reason to return', text: 'Nothing remembered what a buyer had already looked at.' },
      ],
    },

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

    techStack: {
      groups: [
        { title: 'Frontend', items: ['Next.js', 'React', 'Tailwind CSS'] },
        { title: 'Content', items: ['Headless CMS', 'Image optimization'] },
        { title: 'Data', items: ['PostgreSQL', 'Search index'] },
        { title: 'Engagement', items: ['Email alerts', 'Inquiry routing'] },
      ],
    },

    closing: 'Buyers find, compare and return. Agents hear about it straight away.',
  },

  'learning-platform': {
    builtOn: 'React, Node.js, PostgreSQL',

    flow: [
      { number: '01', title: 'Catalog', detail: 'Courses and cohorts' },
      { number: '02', title: 'Enroll', detail: 'Self-service sign-up' },
      { number: '03', title: 'Learn', detail: 'Lessons and assessments' },
      { number: '04', title: 'Track', detail: 'Progress for educators' },
      { number: '05', title: 'Certify', detail: 'Completion records' },
    ],

    atAGlance: {
      headline: 'Three audiences, one system, three different views.',
      intro:
        'Learners, educators and administrators each needed something different from the same course data, and were getting it from three separate tools.',
      points: [
        {
          title: 'Learner view',
          text: 'A clear path through each course, with progress saved and assessments in context.',
        },
        {
          title: 'Educator view',
          text: 'Cohort progress at a glance, with the learners who need attention surfaced rather than searched for.',
        },
        {
          title: 'Administrator view',
          text: 'Enrollment, scheduling and completion records managed in one place.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Course content, enrollment and records lived apart.',
      points: [
        { title: 'Manual enrollment', text: 'Sign-ups arrived by form and were entered by hand.' },
        { title: 'Invisible progress', text: 'Educators found out a learner had fallen behind at the end of the course.' },
        { title: 'Scattered records', text: 'Completion evidence had to be assembled from several places.' },
      ],
    },

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

    techStack: {
      groups: [
        { title: 'Frontend', items: ['React', 'Accessible components'] },
        { title: 'Backend', items: ['Node.js', 'REST API'] },
        { title: 'Data', items: ['PostgreSQL', 'Progress tracking'] },
        { title: 'Operations', items: ['Email notifications', 'Role-based access'] },
      ],
    },

    closing: 'Everyone sees the same course, from the angle they need.',
  },

  'hotel-direct-booking': {
    builtOn: 'Next.js, booking engine integration, payment gateway',

    flow: [
      { number: '01', title: 'Inspire', detail: 'Image-led property pages' },
      { number: '02', title: 'Search', detail: 'Dates, guests, rooms' },
      { number: '03', title: 'Choose', detail: 'Rooms and offers' },
      { number: '04', title: 'Pay', detail: 'Secure checkout' },
      { number: '05', title: 'Confirm', detail: 'Instant confirmation' },
    ],

    atAGlance: {
      headline: 'The experience starts before arrival, and so does the booking.',
      intro:
        'A group of properties relied on third-party booking sites for most reservations. The brand website looked dated and handed guests off to a generic booking engine at the last step.',
      points: [
        {
          title: 'One journey, start to finish',
          text: 'Availability, rooms, offers and payment sit inside the brand experience rather than behind a hand-off.',
        },
        {
          title: 'Built for several properties',
          text: 'A shared structure lets each property keep its own character while the group manages content once.',
        },
        {
          title: 'Reasons to book direct',
          text: 'Direct-only offers and clear inclusions are shown at the moment a guest compares prices.',
        },
      ],
    },

    challengeDetail: {
      headline: 'Guests loved the photos, then left to book elsewhere.',
      points: [
        { title: 'A jarring hand-off', text: 'Clicking “Book” sent guests to a page that looked nothing like the brand.' },
        { title: 'Content managed per property', text: 'Each property’s pages were updated separately, so offers and details drifted.' },
        { title: 'Slow on mobile', text: 'Large images and heavy scripts made the site slow exactly where most guests browse.' },
      ],
    },

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

    techStack: {
      groups: [
        { title: 'Frontend', items: ['Next.js', 'React', 'Image optimization'] },
        { title: 'Booking', items: ['Booking engine API', 'Payment gateway'] },
        { title: 'Content', items: ['Headless CMS', 'Multi-property structure'] },
        { title: 'Measurement', items: ['Booking funnel analytics'] },
      ],
    },

    closing: 'Guests who fall for the property can book it without leaving.',
  },
}
