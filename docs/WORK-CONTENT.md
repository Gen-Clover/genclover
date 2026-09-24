# Gen Clover - Work Content Worksheet

**Purpose.** This is the single worksheet for everything the website shows about a project.
Review what is already in the system below, correct anything that is wrong, and add new
projects using the blank template at the end. Send the edited file back and it gets loaded
straight into `src/data/projects.js`.

You do not need to write any code. Fill in prose and pick values from the lists provided.

- **Generated from:** `src/data/projects.js` on branch `feat/website-v1-rebuild`
- **Projects currently in the system:** 15 - 6 delivered client engagements (confidential) and 9 concepts
- **Where this shows up:** the Work hub at `/work`, a dedicated page per project at
  `/work/<slug>`, the Selected Work block on the homepage, and the Related Work block on
  each service and industry page

---

## 1. Rules that govern what we can publish

These come from the specification (sections 1.2, 2.1, 7.2) and are not negotiable without
your sign-off. They exist because the previous site published figures nobody could evidence.

| Rule | What it means for you |
| --- | --- |
| Concepts must be labelled as concepts | A demonstration project can never be described as delivered client work. The badge is driven by `status`, so this is automatic. |
| No invented client names | Leave `clientName` empty unless a real client has given written permission. |
| No unverified numbers | Do not write "increased conversions 40%" unless you can produce the analytics export that proves it. |
| Real client work needs approval | Set `permissionsApproved: true` only when the client has approved publication in writing. |
| No client repositories or credentials | `githubUrl` stays empty for client work. The page shows "Repository not shown as per company policy" instead. |

**Conceptual outcomes** are how a concept project describes its intent without claiming a
result. The system prefixes them automatically, so you write only the second half:

- You write: `give trading teams one agreed set of numbers to work from.`
- The site shows: **Conceptual outcome - give trading teams one agreed set of numbers to work from.**

---

## 2. Every field, and what it does

Fields marked **Required** must be filled for a project to publish.

### Identity and classification

| Field | Required | What it is | Notes |
| --- | --- | --- | --- |
| `title` | **Yes** | Project name as shown everywhere | e.g. "E-Commerce Analytics Platform" |
| `slug` | **Yes** | URL segment | lowercase, hyphens only. Becomes `/work/<slug>`. Changing it breaks existing links. |
| `status` | **Yes** | What kind of project this is | See status table below. Drives the badge and the disclosure banner. |
| `category` | **Yes** | What the project **is** | One value. Drives the Work hub filters. |
| `industry` | **Yes** | **Who** it is for | One value. Drives the industry pages. |
| `primaryService` | **Yes** | What we **provided**, primarily | One value. Puts the project on that service page. |
| `additionalServices` | No | Other services involved | Any number. Also puts the project on those service pages. |
| `featured` | No | Show on the homepage | `true` or `false`. Aim for 6-8 featured projects total. |

> **Keep these three separate.** `category` is what the thing is, `industry` is who it
> serves, `primaryService` is what we sold. A financial-services AI platform is
> category = Digital Platforms, industry = Financial Services, primaryService = AI & Automation.

### The narrative (this is the part that sells the work)

| Field | Required | Length | What to write |
| --- | --- | --- | --- |
| `summary` | **Yes** | 1-2 sentences | The elevator version. Appears on the card and under the page title. Make it stand alone. |
| `challenge` | **Yes** | 2-4 sentences | The situation before we arrived. Write about the *problem*, not the client. Concrete beats abstract. |
| `approach` | **Yes** | 2-3 sentences | The thinking. What did we decide to do differently, and why? This is where judgement shows. |
| `solution` | **Yes** | 2-3 sentences | What actually got built. Specific enough that a technical reader believes it. |
| `scope` | **Yes** | One line | What we were engaged to do. e.g. "Discovery, information architecture, UX/UI design, frontend engineering, launch." |

### Detail lists

| Field | Required | Count | What to write |
| --- | --- | --- | --- |
| `features` | **Yes** | 4-6 | What the thing does. One capability per line, written as a phrase not a sentence. |
| `capabilities` | **Yes** | 3-6 | Must match capability names from the service taxonomy (full list in section 4). These connect the project to our service pages. |
| `technologies` | **Yes** | 3-6 | Stack and tools. The first 4 show on the card. |
| `outcomes` | **Yes** | 3 | Concepts: what the design is meant to achieve. Client work: verified results only. |

### Assets and links

| Field | Required | What it is | Notes |
| --- | --- | --- | --- |
| `heroImage` | No (but wanted) | Main visual | Path like `/work/project-name.jpg`. Until set, a branded geometric graphic is shown - deliberately not a fake screenshot. |
| `gallery` | No | Extra screens | Not yet rendered. Tell me if you want a gallery section and I will build it. |
| `clientName` | Client work only | Real client name | Requires written permission. |
| `clientLogo` | Client work only | Logo path | Requires written permission. |
| `externalUrl` | No | Live site link | Only if the client is happy for us to link it. |
| `githubUrl` | No | Repository | Leave empty for client work. |

### Publication switches

| Field | What it does |
| --- | --- |
| `published` | `false` hides the project completely. Use while drafting. |
| `permissionsApproved` | Your record that the client approved publication. Must be `true` before any client-identifying content goes live. |

---

## 3. Values you can choose from

### `status`

| Value | Badge shown on the site | When to use it |
| --- | --- | --- |
| `client` | Client Project | Verified delivered work. Publish client-identifying content only with approval. |
| `concept` | Gen Clover Concept | Demonstration project. Never presented as client work. |
| `internal` | Gen Clover Product | Product built for Gen Clover. |
| `confidential` | Confidential Client Project | Real project where identity or results cannot be disclosed. |

### `category` - what the project is

`websites` - Websites
`web-applications` - Web Applications
`ecommerce` - E-Commerce
`ai-automation` - AI & Automation
`data-analytics` - Data & Analytics
`digital-platforms` - Digital Platforms

### `industry` - who it is for

`professional-services` - Professional Services
`technology-saas` - Technology & SaaS
`financial-services` - Financial Services
`real-estate` - Real Estate
`healthcare` - Healthcare
`education` - Education
`retail-commerce` - Retail & Commerce
`manufacturing` - Manufacturing
`logistics` - Logistics
`hospitality` - Hospitality
`other` - Other / Custom

### `primaryService` and `additionalServices`

`websites` - Websites & Web Experiences
`web-applications` - Web Applications
`ecommerce` - E-Commerce
`ai-automation` - AI & Automation
`data-analytics` - Data & Analytics
`technology-solutions` - Technology Solutions
`devops-mlops` - DevOps & MLOps
`digital-marketing-seo` - Digital Marketing & SEO

---

## 4. Valid `capabilities` values

Pick from the service they belong to. These are what link a project to the right service page,
so spelling matters.

**Websites & Web Experiences** (`websites`)
- Corporate Websites
- Professional Websites
- Startup Websites
- Premium Brand Websites
- Marketing Websites
- Content-Driven Websites

**Web Applications** (`web-applications`)
- Customer Portals
- Dashboards
- Admin Platforms
- Internal Tools
- SaaS Applications
- Workflow Applications
- Business Platforms

**E-Commerce** (`ecommerce`)
- E-Commerce Websites
- Product Catalogues
- Checkout & Payments
- Payment Integration
- Inventory Systems
- Order Management
- Commerce Platforms

**AI & Automation** (`ai-automation`)
- AI Assistants
- Generative AI
- AI Features
- Intelligent Search
- Workflow Automation
- Document Intelligence
- Machine Learning
- AI Integrations

**Data & Analytics** (`data-analytics`)
- Data Engineering
- Data Platforms
- Data Pipelines
- Data Integration
- Business Intelligence
- Dashboards & Reporting
- Data Analytics
- Data Science / Machine Learning

**Technology Solutions** (`technology-solutions`)
- APIs
- System Integrations
- Cloud Solutions
- Technology Modernization
- Architecture
- Custom Systems
- Backend Engineering
- Third-Party Integrations

**DevOps & MLOps** (`devops-mlops`)
- Cloud Infrastructure
- CI/CD
- Infrastructure Automation
- Deployment & Release Engineering
- Monitoring & Observability
- Containerization
- DevSecOps
- MLOps
- Model Deployment
- ML Infrastructure
- Model Monitoring

**Digital Marketing & SEO** (`digital-marketing-seo`)
- Search Engine Optimization
- Technical SEO
- On-Page SEO
- Content Strategy
- Search Performance
- Conversion Optimization
- Digital Campaigns
- Analytics & Measurement

---

## 5. What is in the system today

**The first six are real delivered engagements**, onboarded from the portfolio repository and
published as Confidential Client Projects. Client names, imprint names and internal product
names have been removed; the sector is kept because it describes rather than identifies.

**The remaining nine are concepts** carried over from the previous site, with narrative text
written to replace the unverifiable percentage claims that were there before.

**Please review each one for accuracy** - for the delivered work, check that nothing
identifying has slipped through; for the concepts, check whether they still earn their place
now that there is real work to show.

### 1. Autonomous AI Log Monitoring & Observability Platform

| Field | Current value |
| --- | --- |
| `slug` | `ai-log-monitoring-observability-platform` |
| `status` | `confidential` -> **Confidential Client Project** |
| `category` | `ai-automation` -> AI & Automation |
| `industry` | `healthcare` -> Healthcare |
| `primaryService` | `ai-automation` -> AI & Automation |
| `additionalServices` | `devops-mlops`, `technology-solutions` |
| `featured` | `true` (shows on homepage) |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `true` |

**`summary`** _(card + page intro, 1-2 sentences)_
> For a healthcare media and clinician engagement platform, a five-agent system that reads a production error, writes the fix and opens a reviewed pull request, with an engineer still deciding what ships.

**`challenge`** _(the problem, no client named)_
> A microservice estate produces thousands of log lines a minute. When something breaks, an on-call engineer has to notice the alert, find the right logs, reconstruct the failing request, locate the responsible file and commit, then write, test and ship a fix. Logs, source code and deployment state live in three different systems, so the mechanical middle of an incident is where most of the hours go. Traditional dashboards report that something broke; they never propose a fix.

**`approach`** _(how we decided to tackle it)_
> Instrument once, let agents do the mechanical work, and keep people in charge of the decision. A standard tracing library across every service means an agent can always start from one identifier and find everything related to a failure. The workflow deliberately ends at a pull request rather than a deployment, so the AI prepares work and a person merges it.

**`solution`** _(what was actually built)_
> A shared tracing library across all Node and Python services, a five-agent remediation swarm running on Cloud Run, and a dashboard that shows what the system did, why, what it changed and what it cost. Agents hand off through strict typed schemas and the pipeline fails closed if any stage does not report success.

**`features`** _(bullet list on the case-study page)_
- Shared tracing library stamping every log line with a standard trace ID, with no call-site changes
- Five specialist agents: log triage, code retrieval, fix authoring, independent review and Git operations
- Independent review agent that must approve before any change reaches source control
- Token circuit breaker that halts a run at a per-incident budget
- Fail-closed pipeline with typed hand-offs between every stage
- Incident dashboard with agent timeline, before-and-after diff and per-agent cost

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Workflow Automation
- AI Integrations
- Monitoring & Observability
- Cloud Solutions
- Architecture

**`technologies`** _(shown as tags on the card and page)_
- Google ADK
- Claude via Vertex AI
- FastAPI
- Cloud Run
- OpenTelemetry
- Next.js

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Engineers receive a reviewed pull request with a root-cause explanation, rather than only an alert.
- Every automated change is checked by a separate review agent before it reaches source control, so the author of a change is never its only reviewer.
- Token spend is capped per incident and reported per agent, so an autonomous run cannot produce an open-ended bill.

**`scope`** _(one line, what we were engaged to do)_
> Product ownership, solution architecture, agent workflow design, observability dashboard, delivery.

---

### 2. Data & BI Modernization

| Field | Current value |
| --- | --- |
| `slug` | `data-bi-modernization` |
| `status` | `confidential` -> **Confidential Client Project** |
| `category` | `data-analytics` -> Data & Analytics |
| `industry` | `other` -> Other / Custom |
| `primaryService` | `data-analytics` -> Data & Analytics |
| `additionalServices` | `technology-solutions`, `devops-mlops`, `web-applications` |
| `featured` | `true` (shows on homepage) |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `true` |

**`summary`** _(card + page intro, 1-2 sentences)_
> For an established independent book publisher, a decade of accumulated ETL, warehouse and dashboard tools replaced with one governed cloud platform, without breaking a single number the business depended on.

**`challenge`** _(the problem, no client named)_
> Four disconnected systems had accumulated over a decade: an ETL tool running more than two hundred largely undocumented pipelines, a warehouse with business logic buried in stored procedures, dashboards isolated from daily operations, and a mountain of claims, allocations and reconciliations run by hand in spreadsheets over email. The same question could be answered four different ways, and access was managed separately in every system.

**`approach`** _(how we decided to tackle it)_
> Reverse-engineer before replacing. Every pipeline was documented and its output validated against the legacy system, so each migration step was a small verified move rather than a leap of faith. Analytics was embedded inside the company portal rather than delivered as a separate tool, and the spreadsheet processes were rebuilt as auditable applications instead of being carried over.

**`solution`** _(what was actually built)_
> A six-layer platform: orchestrated cloud pipelines with validation, logging and retry built in, a single enterprise warehouse holding one set of business rules, embedded analytics and custom APIs, and one portal carrying reports, operational applications and user administration behind role-based access and row-level security.

**`features`** _(bullet list on the case-study page)_
- More than 200 legacy pipelines reverse-engineered, validated against legacy output and re-platformed
- Single enterprise warehouse replacing four disconnected tools
- Embedded analytics delivered inside the company portal rather than a standalone tool
- Spreadsheet and email processes rebuilt as auditable workflow applications with roles and approvals
- Role-based access and row-level security administered centrally
- Three environments with automated CI/CD, build validation and sign-off before every release

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Data Engineering
- Data Platforms
- Data Pipelines
- Business Intelligence
- Technology Modernization
- Dashboards & Reporting

**`technologies`** _(shown as tags on the card and page)_
- BigQuery
- Cloud Composer
- Power BI Embedded
- React
- Node.js
- Python

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Four disconnected systems consolidated into one governed platform, with business logic living once instead of in four places.
- Manual claims, allocations and reconciliation processes moved from email and spreadsheets into standardized, auditable workflows.
- Reporting delivered through the existing portal, removing the need for a separate per-seat analytics licence for every business user.

**`scope`** _(one line, what we were engaged to do)_
> Solution architecture, programme leadership, data platform engineering, embedded analytics, application delivery.

---

### 3. Drug Competitor Identification

| Field | Current value |
| --- | --- |
| `slug` | `drug-competitor-identification` |
| `status` | `confidential` -> **Confidential Client Project** |
| `category` | `ai-automation` -> AI & Automation |
| `industry` | `healthcare` -> Healthcare |
| `primaryService` | `ai-automation` -> AI & Automation |
| `additionalServices` | `data-analytics`, `technology-solutions` |
| `featured` | `true` (shows on homepage) |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `true` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A brand-intelligence tool that asks a language model who a drug competes with, then checks the answer against regulatory reference data before anyone is asked to trust it.

**`challenge`** _(the problem, no client named)_
> Establishing that two products genuinely compete takes knowing active ingredient, therapeutic class, route, dosage form and regulatory pathway well enough to defend the judgement. Done by hand, two analysts researching the same drug could reach two different answers. Authoritative pharmacological facts sat in public regulatory data while the organisation’s own competitive knowledge sat in a separate internal list, and nothing reconciled the two.

**`approach`** _(how we decided to tackle it)_
> Separate recall from trust. Let the language model propose candidates from everything on the web, because that is what it is good at, then let an explainable point system decide which candidates count as verified, because that has to be repeatable. Keep every unverified candidate visible rather than quietly dropping it, and give the analyst the final edit.

**`solution`** _(what was actually built)_
> A three-node analysis workflow behind a single search box: look the seed drug up in regulatory reference data, ask a search-grounded model for candidates, then score each candidate against the seed on identifier, class, route and pathway. Candidates reaching the scoring threshold are marked verified; the rest stay on screen, flagged.

**`features`** _(bullet list on the case-study page)_
- Search-grounded model proposes candidates but never decides which ones count
- Explainable point-based rubric scored against regulatory reference data
- Unverified candidates stay visible and flagged rather than being dropped
- Analyst edits write straight back to the organisation’s ground-truth list
- Strictly linear workflow where any error stops the run rather than degrading silently
- Reconciliation between public regulatory facts and internal competitive intelligence

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Generative AI
- Intelligent Search
- AI Integrations
- Data Integration
- Data Analytics

**`technologies`** _(shown as tags on the card and page)_
- LangGraph
- Gemini
- BigQuery
- FastAPI
- React

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- A competitor list is produced from a single drug name, with the evidence behind each verification visible on screen.
- The same drug scored twice returns the same result, because the decision rubric is fixed rather than left to the model.
- Analyst corrections update the organisation’s ground-truth list directly, so curation and research happen in one place.

**`scope`** _(one line, what we were engaged to do)_
> Product ownership, solution architecture, retrieval and verification design, analyst experience, delivery.

---

### 4. AI Agents Platform

| Field | Current value |
| --- | --- |
| `slug` | `ai-agents-platform` |
| `status` | `confidential` -> **Confidential Client Project** |
| `category` | `ai-automation` -> AI & Automation |
| `industry` | `healthcare` -> Healthcare |
| `primaryService` | `ai-automation` -> AI & Automation |
| `additionalServices` | `technology-solutions`, `devops-mlops` |
| `featured` | `true` (shows on homepage) |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `true` |

**`summary`** _(card + page intro, 1-2 sentences)_
> Seven agents that turn one upload into a recorded, print-ready batch of personalized posters, with a reviewer approving anything that carries commercial risk.

**`challenge`** _(the problem, no client named)_
> Every personalized poster was assembled by hand. Up to a dozen sections had to fit a fixed layout to the pixel, for every single recipient, and each one needed its own set of tracked codes. Nothing reliably recorded which poster or which incentive went to whom, and a single wrong incentive code awards the wrong points to the wrong person, which is a commercial error rather than a cosmetic one.

**`approach`** _(how we decided to tackle it)_
> Automate aggressively in the mechanical middle and stay deliberately conservative at the two points where a mistake is expensive: an incentive that awards points, and a poster that prints without a working code. Store layouts and validation rules as data rather than design files, so the business can change what a valid poster looks like without waiting for a release.

**`solution`** _(what was actually built)_
> Seven agents sharing one blueprint, each with its own screen and a single job: dashboard, template management, input validation, code generation, poster assembly, incentive activation and a metadata registry. An upload returns a job number immediately and the heavy work runs in the background, ending in one recorded, downloadable batch.

**`features`** _(bullet list on the case-study page)_
- Layouts and input validation rules stored as configuration, changeable by the business without a release
- Tracked codes generated per recipient and location, with the run stopping rather than printing without one
- Background execution returning a job number immediately on upload
- Idempotent generation, so re-running the same file replaces rather than duplicates a batch
- Human approval gate before any incentive is sent onward
- Registry recording every code, poster and layout version for support and audit

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Workflow Automation
- AI Integrations
- Document Intelligence
- Custom Systems
- Backend Engineering

**`technologies`** _(shown as tags on the card and page)_
- Google Cloud
- Python
- React
- Cloud Storage
- Agent workflows

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- A batch that previously required a designer per recipient now starts from one upload and returns a print-ready package.
- Every code, poster and layout version is recorded, so any run can be reconstructed after the fact.
- Incentives cannot reach the partner without a named reviewer approving them first.

**`scope`** _(one line, what we were engaged to do)_
> Product ownership, solution architecture, agent design, validation and approval workflow, delivery.

---

### 5. Recruitment Analytics & Decision Support

| Field | Current value |
| --- | --- |
| `slug` | `recruitment-analytics-decision-support` |
| `status` | `confidential` -> **Confidential Client Project** |
| `category` | `data-analytics` -> Data & Analytics |
| `industry` | `professional-services` -> Professional Services |
| `primaryService` | `data-analytics` -> Data & Analytics |
| `additionalServices` | `ai-automation` |
| `featured` | `true` (shows on homepage) |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `true` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A decision-support layer over a staffing platform, turning candidate, requirement and recruiter activity into KPIs that mean the same thing whoever is looking at them.

**`challenge`** _(the problem, no client named)_
> Recruiters could source, submit and place candidates every day, but management could not see the funnel behind those actions: which requirements were aging, which clients were slow to respond, or why a requirement with plenty of submissions still had not closed. Three teams computed time-to-fill three different ways and all three defended their number.

**`approach`** _(how we decided to tackle it)_
> Model once and let the KPI layer drive every dashboard. Define each metric centrally, compute it in one place, and have every report consume it rather than recalculate it. Then use the same governed model that reports what happened to score which open requirements are likely to miss their target date.

**`solution`** _(what was actually built)_
> A star schema covering the recruitment lifecycle, a central measure layer holding more than fifty standardized KPIs, data quality rules that run before data reaches a dashboard, and predictive models scoring fill probability, candidate success and at-risk requirements. Six role-scoped dashboards read from the same model.

**`features`** _(bullet list on the case-study page)_
- Star schema of fact and dimension tables covering the full recruitment lifecycle
- More than 50 standardized KPIs computed centrally and consumed, never recalculated per report
- Data quality rules for duplicates, missing fields, orphans and invalid dates, run before reporting
- Stage-level conversion and drop-off visible per requirement
- Predictive scoring for fill probability, candidate success and at-risk requirements
- Six role-scoped dashboards reading from one governed model

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Business Intelligence
- Dashboards & Reporting
- Data Analytics
- Data Science / Machine Learning
- Data Engineering

**`technologies`** _(shown as tags on the card and page)_
- SQL
- Power BI
- DAX
- Python
- scikit-learn

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- One definition per KPI, enforced centrally and traceable back to its source tables, replacing three competing versions of time-to-fill.
- Aging cohorts and escalation flags refresh daily instead of being rebuilt by hand each week.
- The same governed layer that reports the funnel also scores which requirements are at risk, so reporting and prediction share one model.

**`scope`** _(one line, what we were engaged to do)_
> Data modelling, KPI definition, BI development, predictive modelling, product analytics.

---

### 6. Medical Data Intelligence Platform

| Field | Current value |
| --- | --- |
| `slug` | `medical-data-intelligence-platform` |
| `status` | `confidential` -> **Confidential Client Project** |
| `category` | `data-analytics` -> Data & Analytics |
| `industry` | `healthcare` -> Healthcare |
| `primaryService` | `data-analytics` -> Data & Analytics |
| `additionalServices` | `ai-automation` |
| `featured` | `true` (shows on homepage) |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `true` |

**`summary`** _(card + page intro, 1-2 sentences)_
> Reporting, prediction and document processing for a medical data platform, delivered with a cross-functional business intelligence, data engineering and machine learning team.

**`challenge`** _(the problem, no client named)_
> Medical data arrives in formats built for people rather than systems: documents, attachments and email threads alongside structured records. Reporting, forecasting and document handling had grown up separately, so the same information was re-entered and re-reconciled in several places before anyone could act on it.

**`approach`** _(how we decided to tackle it)_
> Treat the document pipeline and the reporting layer as one problem rather than two. Extract structure from documents at the point of arrival, validate and reconcile it against existing records, and build the reporting and prediction layers on the governed result rather than on raw feeds.

**`solution`** _(what was actually built)_
> Optical character recognition and automated processing for inbound documents and email, validation and reconciliation workflows, a governed reporting layer, and sales prediction models built on top of the same data foundation.

**`features`** _(bullet list on the case-study page)_
- Optical character recognition for inbound document processing
- Automated email and document handling workflows
- Validation and reconciliation before data reaches reporting
- Sales prediction models built on the governed data layer
- Reporting suite covering operational and commercial views
- Data governance layer defining ownership and quality rules

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Document Intelligence
- Business Intelligence
- Data Engineering
- Data Science / Machine Learning
- Workflow Automation

**`technologies`** _(shown as tags on the card and page)_
- Power BI
- Python
- OCR
- SQL

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Inbound documents are converted into structured, validated records instead of being re-keyed by hand.
- Reporting and prediction read from one governed data layer rather than from separate feeds.
- Validation and reconciliation run as defined workflow steps with an auditable trail.

**`scope`** _(one line, what we were engaged to do)_
> Requirements, solution design, BI development, document processing pipeline, predictive modelling.

---

### 7. E-Commerce Analytics Platform

| Field | Current value |
| --- | --- |
| `slug` | `ecommerce-analytics-platform` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `data-analytics` -> Data & Analytics |
| `industry` | `retail-commerce` -> Retail & Commerce |
| `primaryService` | `data-analytics` -> Data & Analytics |
| `additionalServices` | `technology-solutions` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> An analytics platform concept for an online retailer, designed to bring order, product and customer data into a single reliable view.

**`challenge`** _(the problem, no client named)_
> Retail teams typically read performance from several disconnected places - the storefront, the payment provider, the warehouse system and a spreadsheet. The numbers rarely agree, so most meetings start by arguing about which figure is correct instead of deciding what to do.

**`approach`** _(how we decided to tackle it)_
> Model the business first: define what an order, a customer and a product actually mean, then design pipelines around those definitions rather than around whichever system happens to hold the data.

**`solution`** _(what was actually built)_
> A batch and near-real-time pipeline that consolidates transactional data into a governed warehouse, with a semantic layer on top so every dashboard derives its numbers from the same definitions.

**`features`** _(bullet list on the case-study page)_
- Scheduled ingestion from storefront, payments and fulfilment systems
- Governed metric definitions shared across all reporting
- Data quality checks with alerting on pipeline failure
- Operational dashboard for daily trading decisions
- Historical snapshots for period-on-period comparison

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Data Engineering
- Data Pipelines
- Business Intelligence
- Dashboards & Reporting

**`technologies`** _(shown as tags on the card and page)_
- Python
- Apache Airflow
- PostgreSQL
- Tableau

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - give trading and marketing teams one agreed set of numbers to work from.
- Conceptual outcome - reduce the manual reporting effort spent reconciling systems each week.
- Conceptual outcome - make data quality problems visible before they reach a dashboard.

**`scope`** _(one line, what we were engaged to do)_
> Data architecture, pipeline engineering, semantic modelling, dashboard design.

---

### 8. Customer Churn Prediction Model

| Field | Current value |
| --- | --- |
| `slug` | `customer-churn-prediction` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `ai-automation` -> AI & Automation |
| `industry` | `technology-saas` -> Technology & SaaS |
| `primaryService` | `ai-automation` -> AI & Automation |
| `additionalServices` | `data-analytics`, `devops-mlops` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A machine-learning concept that identifies which subscription customers are drifting away, early enough for a team to do something about it.

**`challenge`** _(the problem, no client named)_
> Subscription businesses usually learn about churn after it has happened, from a cancellation report. By then the relationship is over and the only remaining option is a discount.

**`approach`** _(how we decided to tackle it)_
> Treat churn as an operational problem rather than a modelling exercise: work out who will act on the prediction, how much notice they need, and what they can realistically do with it - then build backwards from there.

**`solution`** _(what was actually built)_
> A supervised model trained on product usage, support history and billing signals, served as a scored list into the tools the customer success team already uses, with the contributing factors shown alongside each score.

**`features`** _(bullet list on the case-study page)_
- Feature pipeline over usage, support and billing data
- Risk score with the factors that drove it
- Segmented views by plan, tenure and account owner
- Scheduled retraining with performance tracking
- Delivery into existing customer success tooling

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Machine Learning
- Data Science / Machine Learning
- MLOps
- Model Monitoring

**`technologies`** _(shown as tags on the card and page)_
- Python
- Scikit-learn
- TensorFlow
- Pandas

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - give customer success teams advance warning instead of a cancellation report.
- Conceptual outcome - make the reasoning behind each risk score visible, so the team can act on it.
- Conceptual outcome - keep model performance observable after deployment rather than assumed.

**`scope`** _(one line, what we were engaged to do)_
> Feature engineering, model development, evaluation, deployment and monitoring design.

---

### 9. Corporate Website Redesign

| Field | Current value |
| --- | --- |
| `slug` | `corporate-website-redesign` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `websites` -> Websites |
| `industry` | `professional-services` -> Professional Services |
| `primaryService` | `websites` -> Websites & Web Experiences |
| `additionalServices` | `digital-marketing-seo` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A corporate website concept for an established professional services firm, built around clarity, credibility and a single obvious next step.

**`challenge`** _(the problem, no client named)_
> Long-established firms often accumulate a website rather than design one. Services are described in internal language, the structure mirrors the org chart instead of the visitor, and the enquiry route is buried.

**`approach`** _(how we decided to tackle it)_
> Rebuild the information architecture around the questions a prospective client actually arrives with, then let the visual design carry the firm's seniority without relying on stock photography.

**`solution`** _(what was actually built)_
> A responsive, accessible site with a restructured service architecture, strong typographic hierarchy, considered motion and a lead-capture route that is present on every page without shouting.

**`features`** _(bullet list on the case-study page)_
- Information architecture rebuilt around visitor intent
- Responsive layouts tested from small phone to large desktop
- Accessible contrast, focus states and semantic structure
- Editable content structure for non-technical updates
- SEO foundation and analytics events defined before launch

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Corporate Websites
- Professional Websites
- Technical SEO
- Conversion Optimization

**`technologies`** _(shown as tags on the card and page)_
- React
- Next.js
- Tailwind CSS
- TypeScript

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - let a first-time visitor understand what the firm does within seconds of arriving.
- Conceptual outcome - give every page a clear, consistent route into an enquiry.
- Conceptual outcome - provide a structure the firm can extend without a redesign each time.

**`scope`** _(one line, what we were engaged to do)_
> Discovery, information architecture, UX/UI design, frontend engineering, launch.

---

### 10. Real-Time Data Streaming Platform

| Field | Current value |
| --- | --- |
| `slug` | `realtime-data-streaming-platform` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `digital-platforms` -> Digital Platforms |
| `industry` | `logistics` -> Logistics |
| `primaryService` | `technology-solutions` -> Technology Solutions |
| `additionalServices` | `data-analytics`, `devops-mlops` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A streaming platform concept for a logistics operator, designed so events from vehicles, depots and orders are usable the moment they happen.

**`challenge`** _(the problem, no client named)_
> Overnight batch reporting is fine for accounting and useless for dispatch. When a delivery slips, the people who could respond find out the following morning.

**`approach`** _(how we decided to tackle it)_
> Separate the event backbone from the consumers. Publish once, let dispatch, reporting and alerting each read at their own pace, and make replay a first-class capability rather than a recovery scramble.

**`solution`** _(what was actually built)_
> A Kafka-based event backbone with schema enforcement at the boundary, stream processing for aggregations, and both a live operational view and a warehouse sink fed from the same stream.

**`features`** _(bullet list on the case-study page)_
- Event schemas versioned and validated at ingestion
- Stream processing for rolling operational aggregates
- Replay from retained history for recovery and backfill
- Live dispatch view alongside a warehouse sink
- Infrastructure defined as code across environments

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Data Pipelines
- Cloud Solutions
- Architecture
- Containerization
- Monitoring & Observability

**`technologies`** _(shown as tags on the card and page)_
- Kafka
- Python
- AWS
- Docker

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - put operational events in front of dispatch while they are still actionable.
- Conceptual outcome - let new consumers be added without changing the systems that produce events.
- Conceptual outcome - make recovery a replay rather than a manual reconstruction.

**`scope`** _(one line, what we were engaged to do)_
> Platform architecture, streaming infrastructure, schema governance, observability.

---

### 11. Recommendation Engine

| Field | Current value |
| --- | --- |
| `slug` | `recommendation-engine` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `ai-automation` -> AI & Automation |
| `industry` | `retail-commerce` -> Retail & Commerce |
| `primaryService` | `ai-automation` -> AI & Automation |
| `additionalServices` | `ecommerce`, `data-analytics` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A recommendation concept for a retail catalogue, built to help customers find relevant products without burying the ones the business needs to move.

**`challenge`** _(the problem, no client named)_
> A large catalogue is only an advantage if customers can navigate it. Generic "customers also bought" strips tend to recommend what is already popular, which does nothing for discovery or for slower-moving stock.

**`approach`** _(how we decided to tackle it)_
> Blend behavioural signals with product attributes so the system has something sensible to say about items with little history, and keep the ranking explainable enough for merchandisers to trust and override.

**`solution`** _(what was actually built)_
> A hybrid collaborative and content-based ranker served behind a low-latency API, with cached candidate sets, merchandiser override rules and an experimentation path for comparing strategies.

**`features`** _(bullet list on the case-study page)_
- Hybrid behavioural and attribute-based ranking
- Cold-start handling for new and low-traffic products
- Low-latency serving with cached candidate generation
- Merchandiser override and business rules layer
- Experiment framework for comparing ranking strategies

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Machine Learning
- AI Features
- Intelligent Search
- AI Integrations

**`technologies`** _(shown as tags on the card and page)_
- Python
- TensorFlow
- Redis
- FastAPI

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - help customers reach relevant products with fewer steps.
- Conceptual outcome - give newly listed products a route to visibility.
- Conceptual outcome - keep merchandising judgement in the loop alongside the model.

**`scope`** _(one line, what we were engaged to do)_
> Model design, serving architecture, business rules layer, experimentation design.

---

### 12. SaaS Dashboard Application

| Field | Current value |
| --- | --- |
| `slug` | `saas-dashboard-application` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `web-applications` -> Web Applications |
| `industry` | `technology-saas` -> Technology & SaaS |
| `primaryService` | `web-applications` -> Web Applications |
| `additionalServices` | `technology-solutions`, `devops-mlops` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A full-stack SaaS product concept covering the parts every subscription application needs: accounts, roles, billing and a dashboard people return to.

**`challenge`** _(the problem, no client named)_
> The interesting part of a SaaS product is rarely the part that takes the time. Authentication, team permissions, subscription states and billing edge cases consume the schedule and are painful to retrofit.

**`approach`** _(how we decided to tackle it)_
> Build the account, permission and billing model first, as the foundation the product sits on, so feature work later does not have to renegotiate who can see what.

**`solution`** _(what was actually built)_
> A multi-tenant application with role-based access, subscription lifecycle handling, an in-product analytics dashboard and a settled, documented API surface.

**`features`** _(bullet list on the case-study page)_
- Multi-tenant data model with role-based access control
- Subscription lifecycle including trials, upgrades and dunning
- In-product analytics dashboard
- Team invitations and permission management
- Documented API surface for integrations

**`capabilities`** _(must match capability labels from the service taxonomy)_
- SaaS Applications
- Dashboards
- Admin Platforms
- APIs
- Backend Engineering

**`technologies`** _(shown as tags on the card and page)_
- React
- Node.js
- MongoDB
- Stripe

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - get the account, permission and billing foundations right before feature work begins.
- Conceptual outcome - give product teams a dashboard their customers return to rather than export from.
- Conceptual outcome - keep the API stable enough for customers to build against.

**`scope`** _(one line, what we were engaged to do)_
> Product architecture, full-stack engineering, billing integration, deployment.

---

### 13. Data Warehouse Migration

| Field | Current value |
| --- | --- |
| `slug` | `data-warehouse-migration` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `data-analytics` -> Data & Analytics |
| `industry` | `financial-services` -> Financial Services |
| `primaryService` | `data-analytics` -> Data & Analytics |
| `additionalServices` | `technology-solutions`, `devops-mlops` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A migration concept moving a legacy on-premise warehouse to a cloud platform without asking the business to stop reporting while it happens.

**`challenge`** _(the problem, no client named)_
> Legacy warehouses are load-bearing. Years of undocumented logic sit inside them, and a migration that breaks a regulatory report is far worse than one that takes longer.

**`approach`** _(how we decided to tackle it)_
> Run both platforms in parallel and migrate by domain, reconciling output at every step, so each cutover is a small verified move rather than one large irreversible one.

**`solution`** _(what was actually built)_
> Transformation logic rebuilt as version-controlled, tested models on a cloud warehouse, with automated reconciliation against the legacy system and a domain-by-domain cutover plan.

**`features`** _(bullet list on the case-study page)_
- Domain-by-domain phased migration plan
- Transformation logic rebuilt as tested, version-controlled models
- Automated reconciliation against the legacy warehouse
- Lineage and documentation generated from the models
- Parallel running until each domain is signed off

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Data Platforms
- Data Engineering
- Technology Modernization
- Architecture

**`technologies`** _(shown as tags on the card and page)_
- Snowflake
- dbt
- Python
- AWS

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - move off legacy infrastructure without a reporting freeze.
- Conceptual outcome - replace undocumented logic with tested, version-controlled models.
- Conceptual outcome - give each domain a verifiable sign-off before cutover.

**`scope`** _(one line, what we were engaged to do)_
> Migration strategy, transformation modelling, reconciliation tooling, cutover planning.

---

### 14. Image Classification System

| Field | Current value |
| --- | --- |
| `slug` | `image-classification-system` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `ai-automation` -> AI & Automation |
| `industry` | `manufacturing` -> Manufacturing |
| `primaryService` | `ai-automation` -> AI & Automation |
| `additionalServices` | `devops-mlops` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A computer vision concept for production-line quality control, designed to assist inspectors rather than quietly replace their judgement.

**`challenge`** _(the problem, no client named)_
> Manual visual inspection is consistent for the first hour of a shift and less so by the last. Defects are rare, which makes them both hard to catch and hard to gather training data for.

**`approach`** _(how we decided to tackle it)_
> Design for the rare case. Optimise for recall on defects, route anything uncertain to a human, and make every automated decision reviewable after the fact.

**`solution`** _(what was actually built)_
> A convolutional classifier with heavy augmentation for scarce defect classes, served at the line with a confidence threshold that escalates uncertain items to an inspector, and a feedback loop that returns reviewed cases to training.

**`features`** _(bullet list on the case-study page)_
- Augmentation strategy for scarce defect classes
- Confidence thresholds with escalation to a human inspector
- Reviewable decision history for every classified item
- Feedback loop returning reviewed cases into training data
- Containerised deployment at the production line

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Machine Learning
- AI Features
- Model Deployment
- Model Monitoring

**`technologies`** _(shown as tags on the card and page)_
- PyTorch
- OpenCV
- Flask
- Docker

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - keep inspection consistent across a full shift.
- Conceptual outcome - escalate uncertain cases to people instead of guessing.
- Conceptual outcome - turn every human review into future training data.

**`scope`** _(one line, what we were engaged to do)_
> Vision model development, threshold and escalation design, edge deployment, monitoring.

---

### 15. Creative Portfolio Website

| Field | Current value |
| --- | --- |
| `slug` | `portfolio-website` |
| `status` | `concept` -> **Gen Clover Concept** |
| `category` | `websites` -> Websites |
| `industry` | `other` -> Other / Custom |
| `primaryService` | `websites` -> Websites & Web Experiences |
| `additionalServices` | `digital-marketing-seo` |
| `featured` | `false`  |
| `heroImage` | _(not set)_ |
| `gallery` | _(empty)_ |
| `clientName` | _(not set)_ |
| `clientLogo` | _(not set)_ |
| `externalUrl` | _(not set)_ |
| `githubUrl` | _(not set)_ |
| `published` | `true` |
| `permissionsApproved` | `false` |

**`summary`** _(card + page intro, 1-2 sentences)_
> A premium portfolio concept where the work is the interface, and the site around it gets out of the way.

**`challenge`** _(the problem, no client named)_
> Portfolio sites tend to fail in one of two directions: so plain that the work looks unconsidered, or so animated that the work cannot be seen at all.

**`approach`** _(how we decided to tackle it)_
> Let the work set the palette. Keep the chrome quiet, use motion only to establish hierarchy between states, and make sure the whole thing still works with animation switched off.

**`solution`** _(what was actually built)_
> A fast, image-led site with large project visuals, deliberate transitions between index and detail views, and a full no-motion path for visitors who prefer reduced motion.

**`features`** _(bullet list on the case-study page)_
- Large-format project visuals with responsive art direction
- Animated transitions between index and detail views
- Full experience preserved under prefers-reduced-motion
- Image optimisation and lazy loading throughout
- Structured project data so new work is a content change

**`capabilities`** _(must match capability labels from the service taxonomy)_
- Premium Brand Websites
- Content-Driven Websites
- Conversion Optimization

**`technologies`** _(shown as tags on the card and page)_
- React
- Framer Motion
- Tailwind CSS
- Vite

**`outcomes`** _(concepts use "Conceptual outcome - ..."; client work needs verified figures)_
- Conceptual outcome - keep attention on the work rather than the interface around it.
- Conceptual outcome - stay fully usable for visitors who prefer reduced motion.
- Conceptual outcome - make publishing new work a content change, not a build.

**`scope`** _(one line, what we were engaged to do)_
> Art direction, UX/UI design, frontend engineering, performance optimisation.

---


---

## 6. Coverage gaps

This is where new projects would do the most good.

### By work category

| Category | Value | Projects | Gap |
| --- | --- | --- | --- |
| Websites | `websites` | 2 |  |
| Web Applications | `web-applications` | 1 |  |
| E-Commerce | `ecommerce` | 0 | **empty - filter shows an empty state** |
| AI & Automation | `ai-automation` | 6 |  |
| Data & Analytics | `data-analytics` | 5 |  |
| Digital Platforms | `digital-platforms` | 1 |  |

### By industry

| Industry | Value | Projects | Gap |
| --- | --- | --- | --- |
| Professional Services | `professional-services` | 2 |  |
| Technology & SaaS | `technology-saas` | 2 |  |
| Financial Services | `financial-services` | 1 |  |
| Real Estate | `real-estate` | 0 | **empty** |
| Healthcare | `healthcare` | 4 |  |
| Education | `education` | 0 | **empty** |
| Retail & Commerce | `retail-commerce` | 2 |  |
| Manufacturing | `manufacturing` | 1 |  |
| Logistics | `logistics` | 1 |  |
| Hospitality | `hospitality` | 0 | **empty** |
| Other / Custom | `other` | 2 |  |

### By service (primary or additional)

| Service | Value | Projects | Gap |
| --- | --- | --- | --- |
| Websites & Web Experiences | `websites` | 2 |  |
| Web Applications | `web-applications` | 2 |  |
| E-Commerce | `ecommerce` | 1 |  |
| AI & Automation | `ai-automation` | 8 |  |
| Data & Analytics | `data-analytics` | 9 |  |
| Technology Solutions | `technology-solutions` | 8 |  |
| DevOps & MLOps | `devops-mlops` | 8 |  |
| Digital Marketing & SEO | `digital-marketing-seo` | 2 |  |

**Priority order, based on the tables above:**

1. **E-Commerce still has zero projects.** That filter on the Work hub shows an honest empty
   state, and E-Commerce is a service we sell. This is the most visible remaining gap.
2. **Real Estate, Education and Hospitality have nothing.** Their landing pages say so rather
   than padding.
3. **Publishing has no home in the industry taxonomy.** The Data & BI Modernization engagement
   is filed under Other / Custom because the list has no Publishing or Media entry. Say the
   word and I will add one.

A duplication worth deciding on: the concept **Data Warehouse Migration** now overlaps heavily
with the real **Data & BI Modernization** engagement - same problem, same shape, one real and
one imagined. Specification section 23, phase 7 calls for replacing concepts with verified
proof. My recommendation is to retire that concept, and to review the other concepts on the
same basis now that there is real work to show.

---

## 7. Blank template - copy this for each new project

Copy the block below once per project. Anything you leave as `TODO` I will query before loading.

```
--------------------------------------------------------------------
TITLE:              TODO
SLUG:               TODO                 (lowercase-with-hyphens)
STATUS:             concept              (concept | client | internal | confidential)
CATEGORY:           TODO                 (see section 3)
INDUSTRY:           TODO                 (see section 3)
PRIMARY SERVICE:    TODO                 (see section 3)
ADDITIONAL SERVICES: TODO, TODO          (optional)
FEATURED:           no                   (yes = appears on homepage)

SUMMARY (1-2 sentences):
TODO

CHALLENGE (2-4 sentences, the problem before we arrived):
TODO

APPROACH (2-3 sentences, what we decided to do and why):
TODO

SOLUTION (2-3 sentences, what was built):
TODO

SCOPE (one line, what we were engaged to do):
TODO

FEATURES (4-6 lines):
- TODO
- TODO
- TODO
- TODO

CAPABILITIES (3-6, from section 4):
- TODO
- TODO
- TODO

TECHNOLOGIES (3-6):
- TODO
- TODO
- TODO

OUTCOMES (3 lines)
  For a concept, write only the second half of the sentence, e.g.
  "help customers reach relevant products with fewer steps."
  For client work, give verified figures and say where the evidence lives.
- TODO
- TODO
- TODO

--- client work only, leave blank for concepts ---
CLIENT NAME:
PERMISSION GRANTED: no                   (written approval on file?)
LIVE URL:
EVIDENCE FOR OUTCOMES:

--- assets ---
HERO IMAGE:         TODO                 (filename you will send, or "none yet")
ADDITIONAL SCREENS: TODO                 (filenames, or "none yet")
--------------------------------------------------------------------
```

---

## 8. Optional fields I can add

The system does not capture these today. Say the word on any of them and I will add the field,
the data model and the page section together.

| Field | What it would show | Worth it when |
| --- | --- | --- |
| `year` | "Delivered 2025" on the case-study page | You want recency to be visible |
| `duration` | "14 weeks from kickoff to launch" | Buyers ask how long things take |
| `teamSize` / `roles` | "2 engineers, 1 designer" | You want to signal how we staff work |
| `testimonial` | A client quote on that project's page | You have approved quotes (none yet) |
| `metrics` | Verified figures with a source note | You have evidence for results |
| Gallery with captions | A screens section below the hero | You have multiple screenshots per project |
| `videoUrl` | Embedded demo or walkthrough | You have recordings |

---

## 9. What to send back

1. This file, edited - corrections to the nine existing projects plus any new project blocks.
2. Any images, named to match what you wrote in HERO IMAGE. I will put them in `public/work/`.
3. For anything you mark as client work: confirmation that written permission is on file, and
   where the evidence for each outcome figure lives.

I will load it into `src/data/projects.js`, wire up the images, check the capability names
resolve against the service taxonomy, and run the accessibility and build checks before
pushing.
