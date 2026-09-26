import { Compass, PenLine, Layers, Hammer, ShieldCheck, Rocket, TrendingUp } from 'lucide-react'

/**
 * How We Work — seven stages. (Spec §11)
 * `summary`/`detail` feed the homepage rail; `question`, `weDo`, `youBring`,
 * `youGet` and `gate` feed the stage explorer on the How We Work page.
 */
export const processSteps = [
  {
    number: '01',
    title: 'Discover',
    summary: 'Understand the business, users, goals and constraints.',
    detail:
      'Before anything is designed we work out what the business is actually trying to change, who it affects, and what is genuinely fixed versus merely assumed. Most bad software is the result of skipping this.',
    question: 'What is actually worth building?',
    weDo: ['Talk to the people who will use, buy and support the product', 'Review what exists today: systems, data, analytics and earlier attempts', 'Separate the real constraints from the assumptions'],
    youBring: ['Access to the people who know the problem', 'Existing documents, data samples and system access'],
    youGet: ['Discovery summary', 'Goals and success measures', 'Risks and open questions'],
    gate: 'We agree on the problem before anyone proposes a solution.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Define',
    summary: 'Turn requirements into a clear scope, priorities and delivery plan.',
    detail:
      'We write down what is in scope, what is explicitly out, and the order things will be built in. Disagreements are much cheaper to resolve at this stage than after a sprint.',
    question: 'What exactly are we building, and in what order?',
    weDo: ['Write the scope: what is in, and what is explicitly out', 'Break the work into priorities and releases', 'Choose the architecture and explain the trade-offs'],
    youBring: ['Decisions on priorities', 'One named person who can sign off'],
    youGet: ['Scope document', 'Delivery plan and milestones', 'Architecture outline', 'Written proposal'],
    gate: 'You sign off the scope. Anything added later is agreed in writing first.',
    icon: PenLine,
  },
  {
    number: '03',
    title: 'Design',
    summary: 'Create information architecture, user experience and visual direction.',
    detail:
      'Structure first, then interaction, then surface. Design work is reviewed against the goals from Discover rather than against personal taste.',
    question: 'How will it work for the people using it?',
    weDo: ['Information architecture and user flows', 'Wireframes, then visual design built on a component system', 'Review every design against the goals from Discover'],
    youBring: ['Feedback from real users where possible', 'Brand assets and content'],
    youGet: ['Clickable prototype', 'Design system and components', 'Content structure'],
    gate: 'You approve the prototype before it becomes code.',
    icon: Layers,
  },
  {
    number: '04',
    title: 'Build',
    summary: 'Engineer the product with maintainability, performance and security in mind.',
    detail:
      'Code is written to be read by whoever maintains it next. Security and performance are build-time concerns, not a pass someone makes at the end.',
    question: 'Is it being built the way we agreed?',
    weDo: ['Build in small, reviewed increments', 'Run automated tests and checks on every change', 'Publish each meaningful change to a preview environment'],
    youBring: ['Feedback on each demo', 'Timely answers to questions that come up'],
    youGet: ['Working software you can click through during the build', 'Written progress updates'],
    gate: 'Each increment is demoed and accepted before the next one builds on it.',
    icon: Hammer,
  },
  {
    number: '05',
    title: 'Validate',
    summary: 'Test, review, refine and prepare for launch.',
    detail:
      'Functional testing, accessibility and responsive checks, performance review and a content and claims review before anything reaches production.',
    question: 'Is it ready for real people and real data?',
    weDo: ['Functional, accessibility and responsive testing', 'Performance and security review', 'Content and claims review'],
    youBring: ['Acceptance testing with your team', 'Final content'],
    youGet: ['Test results and resolved issues', 'Launch checklist'],
    gate: 'You sign off acceptance testing. Nothing launches on a guess.',
    icon: ShieldCheck,
  },
  {
    number: '06',
    title: 'Launch',
    summary: 'Deploy, monitor and support the release.',
    detail:
      'Production deployments are traceable to a specific commit, released through preview environments first, and watched after release rather than assumed to be fine.',
    question: 'Did it go live cleanly?',
    weDo: ['Release through a preview environment first', 'Monitor errors, performance and usage after release', 'Stay close for the first days after launch'],
    youBring: ['Launch timing that suits your business', 'Announcements and communications'],
    youGet: ['The live product', 'Handover documentation', 'Monitoring and alerting in place'],
    gate: 'Launch happens when the checklist is complete, not when the calendar says so.',
    icon: Rocket,
  },
  {
    number: '07',
    title: 'Grow',
    summary: 'Continue improving the product through maintenance and new capabilities.',
    detail:
      'Launch is a milestone, not an ending. Most of the value in a digital product accumulates in what happens after it goes live.',
    question: 'What should improve next?',
    weDo: ['Review how the product is actually used', 'Keep security, dependencies and performance up to date', 'Plan and ship the next improvements'],
    youBring: ['Priorities for what matters next', 'Feedback from users and your team'],
    youGet: ['Continuous care plan', 'Improvement roadmap'],
    gate: 'Next priorities are agreed together, release by release.',
    icon: TrendingUp,
  },
]

/** Maintenance & Continuous Care. (Spec §12 — no published prices.) */
export const carePlans = [
  {
    name: 'Care',
    positioning: 'Keep it healthy',
    description:
      'Security updates, monitoring, maintenance, bug fixes and routine technical care.',
    includes: [
      'Security and dependency updates',
      'Uptime and error monitoring',
      'Bug fixes and routine technical care',
      'Backup verification',
    ],
  },
  {
    name: 'Growth',
    positioning: 'Keep improving',
    description:
      'Care plus content updates, performance improvements and agreed feature enhancements.',
    includes: [
      'Everything in Care',
      'Content and copy updates',
      'Performance improvements',
      'Agreed feature enhancements',
    ],
    highlighted: true,
  },
  {
    name: 'Dedicated Partner',
    positioning: 'Keep building',
    description:
      'Ongoing engineering capacity, priority support, roadmap execution and continuous development.',
    includes: [
      'Everything in Growth',
      'Ongoing engineering capacity',
      'Priority support',
      'Roadmap planning and execution',
    ],
  },
]

/** Spec §12 — pricing is handled through the internal Commercial Engine. */
export const CARE_PRICING_NOTE =
  'Continuous care is scoped to the product and the level of support your team needs. Talk to us about the right plan.'

/** Why Gen Clover — capability and process proof, not social proof. (Spec §14) */
export const differentiators = [
  {
    key: 'alignment',
    title: 'Business alignment first',
    description:
      'Every engagement starts with the outcome the business is trying to reach, not the technology someone read about.',
  },
  {
    key: 'quality',
    title: 'Engineering quality as a default',
    description:
      'Maintainable code, documented decisions and a build that the next engineer can pick up without an archaeology phase.',
  },
  {
    key: 'security',
    title: 'Security and performance built in',
    description:
      'Handled during the build, verified before launch, and monitored afterward, rather than added once something goes wrong.',
  },
  {
    key: 'communication',
    title: 'Clear, honest communication',
    description:
      'Plain language about scope, trade-offs and timelines. If something is not going to work, you hear it early.',
  },
  {
    key: 'extensible',
    title: 'Built to be extended',
    description:
      'Services, content and data are structured so your team can add to the product without a rebuild.',
  },
  {
    key: 'partnership',
    title: 'A long-term partnership',
    description:
      'Continuous care and ongoing development, so the product keeps improving after launch.',
  },
]

/** How We Work page: how clients stay informed. */
export const rhythm = [
  {
    title: 'A written update, on a fixed day',
    description: 'What was done, what is next, what is blocked, and any decision we need from you.',
  },
  {
    title: 'Demos, not slide decks',
    description: 'You see working software throughout the build, in a preview you can click through yourself.',
  },
  {
    title: 'One place for everything',
    description: 'Scope, decisions, questions and progress live in one shared place, not scattered across email threads.',
  },
  {
    title: 'A named point of contact',
    description: 'One person who knows your project end to end and answers for it.',
  },
]

/** How We Work page: commitments that hold on every engagement. */
export const groundRules = [
  {
    title: 'Scope changes are written down first',
    description: 'If something new comes up, we agree what it means for time and budget before building it.',
  },
  {
    title: 'Bad news travels fast',
    description: 'If something is at risk, you hear it from us early, with options, not at the deadline.',
  },
  {
    title: 'Nothing ships without review',
    description: 'Every change is reviewed and tested, and every release goes through a preview environment first.',
  },
  {
    title: 'Decisions are documented',
    description: 'Architecture and product decisions are written down with their reasons, so the next person understands why.',
  },
]

/** How We Work page: ways an engagement can begin. */
export const startingPoints = [
  {
    title: 'Start with discovery',
    description:
      'A short, fixed-scope engagement covering Discover and Define. You leave with a scope, a plan and an architecture you can take forward with us or anyone else.',
    fit: 'Ideas that need shaping, or a budget that needs a clear case.',
  },
  {
    title: 'Design and build',
    description: 'The full process, from the first conversation to launch and beyond.',
    fit: 'A defined website, application, AI or data product.',
  },
  {
    title: 'Take over an existing product',
    description:
      'We start with an audit of the code, infrastructure and documentation, and stabilize before adding features.',
    fit: 'Products whose original team has moved on.',
  },
  {
    title: 'Extend your team',
    description: 'Engineers working inside your process, with our review and delivery standards.',
    fit: 'Teams that need capacity or specific skills.',
  },
]

/** How We Work page: frequently asked questions. */
export const processFaqs = [
  {
    question: 'How do you estimate a project?',
    answer:
      'Properly, only after Discover and Define. Before that, any fixed number is a guess. We can give a range early on, then a written proposal once the scope is agreed.',
  },
  {
    question: 'What if our requirements change?',
    answer:
      'They usually do. Changes are written down, estimated and agreed before they are built, so the plan and the budget stay honest.',
  },
  {
    question: 'Can you work with our in-house team?',
    answer:
      'Yes. We can own the whole delivery, work alongside your developers, or take over from them. We agree at the start who reviews and approves what.',
  },
  {
    question: 'What do you need from us?',
    answer:
      'A person who can make decisions, timely feedback, and access to the systems, data and content the project depends on.',
  },
  {
    question: 'Where are you based, and how do time zones work?',
    answer:
      'Chandigarh, India. We work with clients in India and internationally, and schedule calls around your working day.',
  },
]
