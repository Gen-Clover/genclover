/**
 * Architecture diagrams drawn as a flow chart: boxes where they sit in the real
 * system, and the connections between them, labelled with what travels along
 * them. Rendered by ArchitectureGraph in components/ui/ProjectVisual.jsx on
 * project cards, in the card's enlarged preview and on the project page.
 *
 * Coordinates are in a 960 × 540 canvas (16:9, the card's shape). Keyed by
 * project slug; a project without an entry here falls back to the layered
 * architecture map built from caseStudyVisuals.js.
 *
 * Shapes
 *   kind 'graph'
 *     nodes:  { x, y, w, h, title, lines[], tone: 'default'|'accent'|'highlight'|'muted' }
 *     groups: { x, y, w, title, subtitle, emphasis, layout: 'inline'|'stacked',
 *               items: [{ title, text, dashed }] }  (height follows the items)
 *     edges:  { d (SVG path), arrow: 'end'|'both'|'none', dashed, dot,
 *               label: string | string[], lx, ly, anchor: 'start'|'middle'|'end' }
 *   kind 'rows'
 *     rows:   { label, items[], emphasis, muted }  (laid out top to bottom)
 *
 * Same truthfulness and confidentiality rules as caseStudies.js: this is the
 * system as built, with no client names.
 */

export const architectureDiagrams = {
  /* ------------------------------------------------ AI log monitoring */
  'ai-log-monitoring-observability-platform': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 30, w: 200, h: 76, tone: 'accent', title: 'Business microservices', lines: ['Node and Python services', 'using one tracing library'] },
      { x: 260, y: 30, w: 200, h: 76, title: 'Cloud Logging', lines: ['Structured JSON, every line', 'stamped with a trace ID'] },
      { x: 500, y: 30, w: 200, h: 76, title: 'ERROR alert + Pub/Sub', lines: ['Log-based alert pushes', 'the event onward'] },
      { x: 740, y: 30, w: 200, h: 76, title: 'Webhook receiver', lines: ['Skips events with', 'no trace ID'] },
      { x: 20, y: 170, w: 200, h: 76, title: 'Observability dashboard', lines: ['Next.js, behind Google IAP', 'Timeline, diff and cost'] },
      { x: 20, y: 300, w: 200, h: 76, title: 'Engineers and on-call', lines: ['Review, approve', 'and merge'] },
      { x: 260, y: 300, w: 200, h: 76, tone: 'accent', title: 'Bitbucket Cloud', lines: ['Source code and', 'pull requests'] },
    ],
    groups: [
      {
        x: 500,
        y: 150,
        w: 440,
        emphasis: true,
        layout: 'inline',
        title: 'Autonomous remediation swarm',
        subtitle: 'Google ADK on Cloud Run, Claude via Vertex AI',
        items: [
          { title: '1 Log Analyst', text: 'Finds service, file and severity' },
          { title: '2 Environment', text: 'Fetches code at the running commit' },
          { title: '3 Coder', text: 'Writes the corrected file' },
          { title: '4 Reviewer', text: 'Independent security and syntax check' },
          { title: '5 GitOps', text: 'Branch, commit and pull request' },
          { title: 'Token watchdog', text: 'Circuit breaker at 30,000 tokens', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M220 68 H260' },
      { d: 'M460 68 H500' },
      { d: 'M700 68 H740' },
      { d: 'M840 106 V150', label: 'runs in background', lx: 830, ly: 132, anchor: 'end' },
      { d: 'M360 106 V132 H120 V170', label: 'reads the audit trail', lx: 240, ly: 148 },
      { d: 'M500 250 H400 V106', dashed: true, label: ['Every step', 'is logged'], lx: 410, ly: 176, anchor: 'start' },
      { d: 'M220 338 H260' },
      { d: 'M460 338 H500', arrow: 'both', label: 'reads code, opens PRs', lx: 360, ly: 290 },
    ],
  },

  /* ------------------------------------------------ Data & BI */
  'data-bi-modernization': {
    kind: 'rows',
    width: 960,
    height: 540,
    rows: [
      { label: '1 · Data ingestion', items: ['NetSuite ERP', 'Cloud Storage', 'Publisher files', 'Vendor files', 'APIs'] },
      { label: '2 · Data engineering', items: ['Cloud Composer DAGs', 'Validation', 'Logging', 'Retry & monitoring'] },
      { label: '3 · Data warehouse', items: ['BigQuery enterprise warehouse — single source of truth'], emphasis: true },
      { label: '4 · Analytics & apps', items: ['Power BI semantic models', 'Node / Python APIs', 'React applications'], muted: true },
      { label: '5 · Company portal', items: ['Embedded reports', 'Operational apps', 'User admin', 'RBAC + RLS'], muted: true },
      { label: '6 · End users', items: ['Business users — access · analyze · operate · collaborate'], muted: true },
    ],
  },

  /* ------------------------------------------------ AI agents platform */
  'ai-agents-platform': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 30, w: 220, h: 76, title: 'Creator', lines: ['Picks a layout, uploads', 'content, approves perks'] },
      { x: 270, y: 30, w: 220, h: 76, tone: 'highlight', title: 'Agent dashboard', lines: ['Every agent is a tile,', 'one click away'] },
      { x: 520, y: 30, w: 220, h: 76, tone: 'muted', title: 'Job service', lines: ['Answers instantly with a', 'job number, runs in background'] },
      { x: 270, y: 150, w: 220, h: 76, tone: 'highlight', title: 'Cloud Storage', lines: ['Physician list, poster', 'sections, finished PDFs'] },
      { x: 270, y: 262, w: 220, h: 76, tone: 'highlight', title: 'Templates & rules', lines: ['Layouts and input rules', 'edited on a screen, not in code'] },
      { x: 20, y: 380, w: 220, h: 76, title: 'Reviewer', lines: ['Approves or rejects', 'the perks batch'] },
      { x: 270, y: 380, w: 220, h: 76, tone: 'muted', title: 'Perks partner', lines: ['Receives only codes a', 'person has approved'] },
    ],
    groups: [
      {
        x: 520,
        y: 150,
        w: 420,
        emphasis: true,
        layout: 'stacked',
        title: 'Agent pipeline',
        subtitle: 'One shared blueprint — adding an eighth agent is quick',
        items: [
          { title: '1 QR Generator', text: 'A tracked code per physician and location' },
          { title: '2 Wallboard Assembler', text: 'Print-sharp PDFs, built in small batches' },
          { title: '3 Metadata Collector', text: 'What was made, when, and how to find it' },
          { title: 'Perk approval gate', text: 'A reviewer signs off before anything is sent', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M240 68 H270', arrow: 'none' },
      { d: 'M490 68 H520', arrow: 'none' },
      { d: 'M630 106 V150', label: 'batch starts', lx: 642, ly: 132, anchor: 'start' },
      { d: 'M490 188 H505 V240 H520' },
      { d: 'M490 300 H520', dashed: true, dot: true },
      { d: 'M130 106 V380', arrow: 'none', label: 'starts a run', lx: 142, ly: 246, anchor: 'start' },
      { d: 'M730 470 V500 H130 V456', dashed: true, label: 'one ZIP, ready for print', lx: 430, ly: 494 },
    ],
  },

  /* ------------------------------------------------ Drug competitor identification */
  'drug-competitor-identification': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 30, w: 220, h: 76, title: 'React SPA', lines: ['Search box, results table,', 'verification stats'] },
      { x: 270, y: 30, w: 220, h: 76, title: 'Node / Express proxy', lines: ['Mints an IAP identity', 'token, forwards the call'] },
      { x: 520, y: 30, w: 220, h: 76, title: 'FastAPI backend', lines: ['Behind Google IAP,', 'orchestrates the workflow'] },
      { x: 270, y: 150, w: 220, h: 76, tone: 'accent', title: 'BigQuery · OpenFDA', lines: ['133,699 reference records,', 'the ground truth'] },
      { x: 270, y: 262, w: 220, h: 76, title: 'Gemini API', lines: ['Google Search grounding,', 'proposes, never decides'] },
      { x: 20, y: 380, w: 220, h: 76, tone: 'highlight', title: 'Analyst / reviewer', lines: ['Reads the dashboard, adds', 'or removes with one click'] },
      { x: 270, y: 380, w: 220, h: 76, tone: 'accent', title: 'BigQuery · internal list', lines: ['912 curated products,', 'editable live from the UI'] },
    ],
    groups: [
      {
        x: 520,
        y: 150,
        w: 420,
        emphasis: true,
        layout: 'stacked',
        title: 'LangGraph analysis workflow',
        subtitle: 'Three nodes, strictly linear — any error stops the run',
        items: [
          { title: '1 Seed lookup', text: 'Find the drug in OpenFDA, or stop' },
          { title: '2 Web search', text: 'Gemini proposes candidate names' },
          { title: '3 Verify & aggregate', text: 'Score every candidate against the seed' },
          { title: 'Verification rubric', text: 'Pass at a score of 2 or more', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M240 68 H270', arrow: 'none' },
      { d: 'M490 68 H520', arrow: 'none' },
      { d: 'M630 106 V150', label: 'workflow starts', lx: 642, ly: 132, anchor: 'start' },
      { d: 'M490 188 H505 V240 H520' },
      { d: 'M490 300 H520', arrow: 'none' },
      { d: 'M490 418 H520', arrow: 'none' },
      { d: 'M130 106 V380', arrow: 'none', label: 'types a drug name', lx: 142, ly: 246, anchor: 'start' },
      { d: 'M730 470 V500 H130 V456', dashed: true, label: 'verified results return', lx: 430, ly: 494 },
    ],
  },
  /* ------------------------------------------------ Recruitment analytics */
  'recruitment-analytics-decision-support': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 30, w: 225, h: 76, title: 'Operational platform', lines: ['Candidates, requirements,', 'submissions, interviews'] },
      { x: 270, y: 30, w: 225, h: 76, title: 'SQL extract & transform', lines: ['Scheduled, validated load', 'into the analytical layer'] },
      { x: 520, y: 30, w: 225, h: 76, tone: 'accent', title: 'Star schema warehouse', lines: ['Five fact tables, seven', 'conformed dimensions'] },
      { x: 20, y: 150, w: 225, h: 76, title: 'Recruiter dimension', lines: ['Productivity, fill rate,', 'workload balance'] },
      { x: 20, y: 262, w: 225, h: 76, title: 'Requirement dimension', lines: ['Aging, difficulty, reopen', 'rate, SLA adherence'] },
      { x: 20, y: 374, w: 225, h: 76, title: 'Client dimension', lines: ['Feedback turnaround,', 'relationship health'] },
      { x: 270, y: 262, w: 225, h: 76, tone: 'highlight', title: 'Dashboard suite', lines: ['Six dashboards, one model,', 'scoped by role'] },
      { x: 270, y: 410, w: 225, h: 76, title: 'Recruiters and managers', lines: ['Escalate, reassign or wait'] },
    ],
    groups: [
      {
        x: 520,
        y: 150,
        w: 420,
        emphasis: true,
        layout: 'stacked',
        title: 'Semantic and scoring layer',
        subtitle: 'Where a number becomes a KPI, and a KPI becomes a signal',
        items: [
          { title: '1 Data quality rules', text: 'Duplicates, missing fields, orphans, invalid dates' },
          { title: '2 Measure layer', text: 'Time-to-fill, fill rate, every conversion ratio' },
          { title: '3 Predictive scoring', text: 'Fill probability, candidate success, at-risk flags' },
          { title: 'One definition per KPI', text: 'Computed centrally, consumed, never recalculated', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M245 68 H270' },
      { d: 'M495 68 H520' },
      { d: 'M632 106 V150', label: 'modeled facts', lx: 644, ly: 132, anchor: 'start' },
      { d: 'M520 300 H495' },
      { d: 'M245 188 H257 V300', arrow: 'none', label: 'KPI dimensions', lx: 20, ly: 140, anchor: 'start' },
      { d: 'M245 412 H257 V300', arrow: 'none' },
      { d: 'M245 300 H270' },
      { d: 'M382 338 V410', label: 'at-risk flags', lx: 394, ly: 378, anchor: 'start' },
    ],
  },

  /* ------------------------------------------------ Medical data intelligence */
  'medical-data-intelligence-platform': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 120, w: 225, h: 76, title: 'Inbound documents', lines: ['Scans, attachments, email'] },
      { x: 20, y: 330, w: 225, h: 76, title: 'Structured feeds', lines: ['Existing system records'] },
      { x: 700, y: 90, w: 240, h: 76, tone: 'accent', title: 'Curated store', lines: ['Governed data layer,', 'ownership and quality rules'] },
      { x: 700, y: 232, w: 240, h: 76, title: 'Reporting suite', lines: ['Operational and', 'commercial views'] },
      { x: 700, y: 374, w: 240, h: 76, title: 'Prediction models', lines: ['Built on the governed layer'] },
    ],
    groups: [
      {
        x: 280,
        y: 90,
        w: 380,
        emphasis: true,
        layout: 'stacked',
        title: 'Extraction and validation',
        subtitle: 'Documents in, checked records out',
        items: [
          { title: '1 OCR and parsing', text: 'Structure out of unstructured input' },
          { title: '2 Validation rules', text: 'Completeness and format checks' },
          { title: '3 Reconciliation', text: 'Against existing records, auditable trail', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M245 158 H280' },
      { d: 'M245 368 H262 V306 H280', label: 'to reconcile against', lx: 268, ly: 384, anchor: 'start' },
      { d: 'M660 128 H700' },
      { d: 'M820 166 V232' },
      { d: 'M940 128 H952 V412 H940' },
    ],
  },

  /* ------------------------------------------------ E-commerce analytics */
  'ecommerce-analytics-platform': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 60, w: 225, h: 76, title: 'Storefront', lines: ['Orders, carts, customers'] },
      { x: 20, y: 172, w: 225, h: 76, title: 'Payments', lines: ['Captures, refunds'] },
      { x: 20, y: 284, w: 225, h: 76, title: 'Fulfillment', lines: ['Shipments, returns, stock'] },
      { x: 650, y: 40, w: 290, h: 76, title: 'Governed model', lines: ['PostgreSQL, daily snapshots'] },
      { x: 650, y: 150, w: 290, h: 76, tone: 'accent', title: 'Semantic layer', lines: ['One definition per metric'] },
      { x: 650, y: 260, w: 290, h: 76, tone: 'highlight', title: 'Trading dashboard', lines: ['Daily decisions'] },
      { x: 650, y: 370, w: 290, h: 76, title: 'Period comparison', lines: ['Week, month, season'] },
    ],
    groups: [
      {
        x: 280,
        y: 112,
        w: 320,
        emphasis: true,
        layout: 'stacked',
        title: 'Pipelines',
        subtitle: 'Orchestrated with Apache Airflow',
        items: [
          { title: 'Scheduled ingestion', text: 'Every source, on a schedule' },
          { title: 'Quality checks', text: 'Completeness, freshness, reconciliation', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M245 98 H262 V210', arrow: 'none' },
      { d: 'M245 322 H262 V210', arrow: 'none' },
      { d: 'M245 210 H280' },
      { d: 'M600 160 H625 V78 H650' },
      { d: 'M795 116 V150' },
      { d: 'M795 226 V260' },
      { d: 'M940 188 H952 V408 H940' },
    ],
  },

  /* ------------------------------------------------ Customer churn */
  'customer-churn-prediction': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 40, w: 225, h: 76, title: 'Product usage', lines: ['Feature adoption, frequency,', 'depth of use'] },
      { x: 20, y: 140, w: 225, h: 76, title: 'Support history', lines: ['Volume, severity, sentiment,', 'resolution time'] },
      { x: 20, y: 240, w: 225, h: 76, title: 'Billing and plan', lines: ['Plan changes, payment', 'events, tenure'] },
      { x: 20, y: 370, w: 225, h: 76, tone: 'highlight', title: 'Customer success team', lines: ['Acts on scored accounts', 'in the tools it already uses'] },
      { x: 280, y: 370, w: 225, h: 76, tone: 'accent', title: 'Scored account list', lines: ['Score and the factors', 'behind it'] },
      { x: 530, y: 370, w: 200, h: 76, title: 'Segmented views', lines: ['By plan, tenure,', 'account owner'] },
      { x: 750, y: 370, w: 190, h: 76, title: 'Monitoring', lines: ['Drift and quality', 'after deployment'] },
    ],
    groups: [
      {
        x: 280,
        y: 40,
        w: 380,
        emphasis: true,
        layout: 'stacked',
        title: 'Feature pipeline',
        subtitle: 'Point-in-time correct, to prevent leakage',
        items: [
          { title: '1 Aggregation windows', text: 'Rolling usage, support and billing features' },
          { title: '2 Point-in-time joins', text: 'Computed as of the prediction date' },
          { title: 'Feature validation', text: 'Nulls, ranges and drift checked', dashed: true },
        ],
      },
      {
        x: 690,
        y: 40,
        w: 250,
        layout: 'stacked',
        title: 'Model',
        subtitle: 'Versioned, reproducible runs',
        items: [
          { title: 'Training', text: 'Temporal validation' },
          { title: 'Evaluation', text: 'Held-out and temporal splits' },
          { title: 'Explainability', text: 'Per-account factors' },
        ],
      },
    ],
    edges: [
      { d: 'M245 78 H280' },
      { d: 'M245 178 H280' },
      { d: 'M245 278 H280' },
      { d: 'M660 169 H690' },
      { d: 'M815 298 V340 H392 V370', label: 'scores and factors', lx: 470, ly: 332 },
      { d: 'M630 340 V370' },
      { d: 'M815 340 H845 V370' },
      { d: 'M280 408 H245' },
      { d: 'M940 408 H952 V132 H940', dashed: true, label: 'retraining', lx: 944, ly: 356, anchor: 'end' },
    ],
  },

  /* ------------------------------------------------ Corporate website */
  'corporate-website-redesign': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 30, w: 225, h: 76, tone: 'accent', title: 'Headless CMS', lines: ['Structured content types,', 'not free-form pages'] },
      { x: 20, y: 150, w: 225, h: 76, title: 'Design tokens', lines: ['Typography, spacing, color', 'defined once'] },
      { x: 20, y: 270, w: 225, h: 76, title: 'Media pipeline', lines: ['Responsive derivatives', 'generated on upload'] },
      { x: 700, y: 30, w: 240, h: 76, title: 'Static rendering', lines: ['Revalidated on publish'] },
      { x: 700, y: 150, w: 240, h: 76, title: 'Edge caching', lines: ['Fast first paint worldwide'] },
      { x: 700, y: 270, w: 240, h: 76, title: 'Redirect map', lines: ['Every legacy URL resolved'] },
      { x: 280, y: 420, w: 225, h: 76, title: 'Inquiry endpoint', lines: ['Server-side validation,', 'spam protection, rate limits'] },
      { x: 530, y: 420, w: 225, h: 76, title: 'Analytics events', lines: ['CTA, funnel and abandonment,', 'defined before launch'] },
    ],
    groups: [
      {
        x: 280,
        y: 30,
        w: 380,
        emphasis: true,
        layout: 'stacked',
        title: 'Composition',
        subtitle: 'Editors assemble pages from reviewed blocks',
        items: [
          { title: 'Component library', text: 'Reviewed, reusable blocks' },
          { title: 'Page composition', text: 'Blocks, not bespoke layouts' },
          { title: 'Accessibility baked in', text: 'Semantics and focus states at component level' },
        ],
      },
    ],
    edges: [
      { d: 'M245 68 H280' },
      { d: 'M245 188 H280' },
      { d: 'M245 308 H262 V260 H280' },
      { d: 'M660 68 H700' },
      { d: 'M820 106 V150' },
      { d: 'M820 226 V270' },
      { d: 'M392 288 V420', label: 'inquiries, never mailto', lx: 404, ly: 360, anchor: 'start' },
      { d: 'M642 288 V420', label: 'events', lx: 654, ly: 360, anchor: 'start' },
      { d: 'M20 68 H8 V520 H952 V68 H940', dashed: true, label: 'publishing revalidates the static pages', lx: 476, ly: 514 },
    ],
  },

  /* ------------------------------------------------ Realtime streaming */
  'realtime-data-streaming-platform': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 90, w: 225, h: 76, title: 'Vehicle telemetry', lines: ['Location, status'] },
      { x: 20, y: 190, w: 225, h: 76, title: 'Depot systems', lines: ['Scans, loads'] },
      { x: 20, y: 290, w: 225, h: 76, title: 'Order system', lines: ['Bookings, changes'] },
      { x: 700, y: 60, w: 240, h: 76, tone: 'accent', title: 'Stream processing', lines: ['Rolling operational', 'aggregates'] },
      { x: 700, y: 200, w: 240, h: 76, tone: 'highlight', title: 'Live dispatch view', lines: ['Exceptions as they happen'] },
      { x: 700, y: 340, w: 240, h: 76, title: 'Alerting', lines: ['Late and at-risk deliveries'] },
      { x: 280, y: 410, w: 380, h: 76, title: 'Warehouse sink', lines: ['Reporting and history, with replay', 'from retained topics'] },
    ],
    groups: [
      {
        x: 280,
        y: 100,
        w: 380,
        emphasis: true,
        layout: 'stacked',
        title: 'Event backbone',
        subtitle: 'One stream, several consumers',
        items: [
          { title: 'Kafka topics', text: 'Retained history' },
          { title: 'Schema validation', text: 'Versioned contracts, checked at the boundary', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M245 128 H280' },
      { d: 'M245 228 H280' },
      { d: 'M245 328 H262 V270 H280' },
      { d: 'M660 138 H680 V98 H700' },
      { d: 'M820 136 V200' },
      { d: 'M940 98 H952 V378 H940' },
      { d: 'M470 296 V410', label: 'retained history', lx: 482, ly: 358, anchor: 'start' },
    ],
  },

  /* ------------------------------------------------ Recommendation engine */
  'recommendation-engine': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 90, w: 225, h: 76, title: 'Behavior', lines: ['Views, carts, purchases'] },
      { x: 20, y: 250, w: 225, h: 76, title: 'Catalog', lines: ['Attributes, categories'] },
      { x: 270, y: 170, w: 225, h: 76, title: 'Candidate generation', lines: ['Cached candidate sets,', 'refreshed on a schedule'] },
      { x: 270, y: 330, w: 225, h: 76, tone: 'highlight', title: 'Merchandisers', lines: ['Pin, exclude and boost', 'without a release'] },
      { x: 700, y: 300, w: 240, h: 76, tone: 'accent', title: 'Low-latency API', lines: ['FastAPI with Redis cache'] },
      { x: 700, y: 420, w: 240, h: 76, title: 'Experiments', lines: ['Strategy comparison'] },
    ],
    groups: [
      {
        x: 520,
        y: 60,
        w: 420,
        emphasis: true,
        layout: 'stacked',
        title: 'Ranking',
        subtitle: 'Candidates, ranking and rules as separate stages',
        items: [
          { title: 'Hybrid ranker', text: 'Collaborative and content-based' },
          { title: 'Business rules', text: 'Pin, exclude, boost: merchandiser overrides', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M245 128 H257 V208 H270' },
      { d: 'M245 288 H257 V208', arrow: 'none' },
      { d: 'M495 208 H520' },
      { d: 'M495 368 H600 V256', dashed: true, label: 'overrides', lx: 610, ly: 320, anchor: 'start' },
      { d: 'M820 256 V300' },
      { d: 'M820 376 V420', label: 'split traffic', lx: 832, ly: 402, anchor: 'start' },
    ],
  },

  /* ------------------------------------------------ SaaS dashboard */
  'saas-dashboard-application': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 60, w: 225, h: 76, title: 'Accounts', lines: ['Isolation in the', 'data layer'] },
      { x: 20, y: 200, w: 225, h: 76, title: 'Teams and roles', lines: ['Invitations, permissions'] },
      { x: 700, y: 60, w: 240, h: 76, title: 'Application data', lines: ['MongoDB'] },
      { x: 700, y: 200, w: 240, h: 76, tone: 'highlight', title: 'Usage analytics', lines: ['In-product dashboard'] },
      { x: 700, y: 340, w: 240, h: 76, title: 'Integrations', lines: ['Documented API access'] },
      { x: 280, y: 340, w: 380, h: 76, tone: 'accent', title: 'Subscription lifecycle', lines: ['Stripe: dunning and plan changes'] },
    ],
    groups: [
      {
        x: 280,
        y: 60,
        w: 380,
        emphasis: true,
        layout: 'stacked',
        title: 'Product',
        subtitle: 'One application, every tenant isolated',
        items: [
          { title: 'Web application', text: 'React' },
          { title: 'API', text: 'Node.js, documented' },
        ],
      },
    ],
    edges: [
      { d: 'M245 98 H280' },
      { d: 'M245 238 H280' },
      { d: 'M660 98 H700' },
      { d: 'M820 136 V200' },
      { d: 'M660 214 H680 V378 H700' },
      { d: 'M470 256 V340', label: 'plan changes', lx: 482, ly: 302, anchor: 'start' },
      { d: 'M280 378 H132 V276', dashed: true, label: 'dunning', lx: 206, ly: 370 },
    ],
  },

  /* ------------------------------------------------ Image classification */
  'image-classification-system': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 40, w: 225, h: 76, title: 'Line imaging', lines: ['Controlled lighting', 'and positioning'] },
      { x: 20, y: 160, w: 225, h: 76, title: 'Pre-processing', lines: ['Normalization and framing'] },
      { x: 700, y: 40, w: 240, h: 76, title: 'Decision record', lines: ['Outcome, reviewer,', 'timestamp'] },
      { x: 700, y: 190, w: 240, h: 76, tone: 'highlight', title: 'Inspector queue', lines: ['Escalated items with the', 'image and the score'] },
      { x: 20, y: 420, w: 225, h: 76, title: 'Reviewed case store', lines: ['Labeled data from', 'normal operation'] },
      { x: 280, y: 420, w: 225, h: 76, tone: 'accent', title: 'Retraining pipeline', lines: ['Versioned, evaluated', 'before promotion'] },
      { x: 530, y: 420, w: 225, h: 76, title: 'Model monitoring', lines: ['Drift and class balance', 'over time'] },
    ],
    groups: [
      {
        x: 280,
        y: 40,
        w: 380,
        emphasis: true,
        layout: 'stacked',
        title: 'Inference at the edge',
        subtitle: 'Containerized, runs without a network round trip',
        items: [
          { title: '1 Classifier', text: 'Convolutional model, recall-weighted' },
          { title: '2 Confidence threshold', text: 'Business-owned, not hard-coded', dashed: true },
          { title: '3 Escalation router', text: 'Uncertain items go to a person' },
        ],
      },
    ],
    edges: [
      { d: 'M132 116 V160' },
      { d: 'M245 198 H280' },
      { d: 'M660 78 H700' },
      { d: 'M660 256 H680 V228 H700', label: 'uncertain', lx: 690, ly: 290 },
      { d: 'M820 190 V116' },
      { d: 'M820 266 V360 H132 V420', dashed: true, label: 'reviewed cases', lx: 476, ly: 354 },
      { d: 'M245 458 H280' },
      { d: 'M392 420 V298', label: 'promote', lx: 404, ly: 398, anchor: 'start' },
      { d: 'M600 298 V420', label: 'drift', lx: 612, ly: 398, anchor: 'start' },
    ],
  },

  /* ------------------------------------------------ Portfolio website */
  'portfolio-website': {
    kind: 'graph',
    width: 960,
    height: 540,
    nodes: [
      { x: 20, y: 60, w: 225, h: 76, tone: 'accent', title: 'Structured project model', lines: ['Fields, not free-form pages'] },
      { x: 20, y: 180, w: 225, h: 76, title: 'Asset pipeline', lines: ['Responsive derivatives,', 'modern formats, on upload'] },
      { x: 20, y: 300, w: 225, h: 76, title: 'Art direction rules', lines: ['Per-project crops and order'] },
      { x: 700, y: 60, w: 240, h: 76, title: 'Static rendering', lines: ['Rebuilt on publish'] },
      { x: 700, y: 180, w: 240, h: 76, title: 'Lazy loading', lines: ['Below-fold assets deferred'] },
      { x: 700, y: 300, w: 240, h: 76, tone: 'highlight', title: 'Edge caching', lines: ['Consistent worldwide'] },
    ],
    groups: [
      {
        x: 280,
        y: 60,
        w: 380,
        emphasis: true,
        layout: 'stacked',
        title: 'Experience',
        subtitle: 'Index and detail as one system',
        items: [
          { title: 'Index view', text: 'Large-format, curated sequence' },
          { title: 'Detail view', text: 'Full case presentation' },
          { title: 'Shared transition', text: 'One system, not two pages' },
          { title: 'Reduced-motion path', text: 'A designed alternative, not a degraded one', dashed: true },
        ],
      },
    ],
    edges: [
      { d: 'M245 98 H280' },
      { d: 'M245 218 H280' },
      { d: 'M245 338 H280' },
      { d: 'M660 98 H700' },
      { d: 'M820 136 V180' },
      { d: 'M820 256 V300' },
      { d: 'M20 98 H8 V470 H952 V98 H940', dashed: true, label: 'new work is a content change, and the site rebuilds', lx: 476, ly: 464 },
    ],
  },
}
