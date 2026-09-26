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
}
