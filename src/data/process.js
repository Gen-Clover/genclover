import { Compass, PenLine, Layers, Hammer, ShieldCheck, Rocket, TrendingUp } from 'lucide-react'

/** How We Work — seven stages. (Spec §11) */
export const processSteps = [
  {
    number: '01',
    title: 'Discover',
    summary: 'Understand the business, users, goals and constraints.',
    detail:
      'Before anything is designed we work out what the business is actually trying to change, who it affects, and what is genuinely fixed versus merely assumed. Most bad software is the result of skipping this.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Define',
    summary: 'Turn requirements into a clear scope, priorities and delivery plan.',
    detail:
      'We write down what is in scope, what is explicitly out, and the order things will be built in. Disagreements are much cheaper to resolve at this stage than after a sprint.',
    icon: PenLine,
  },
  {
    number: '03',
    title: 'Design',
    summary: 'Create information architecture, user experience and visual direction.',
    detail:
      'Structure first, then interaction, then surface. Design work is reviewed against the goals from Discover rather than against personal taste.',
    icon: Layers,
  },
  {
    number: '04',
    title: 'Build',
    summary: 'Engineer the product with maintainability, performance and security in mind.',
    detail:
      'Code is written to be read by whoever maintains it next. Security and performance are build-time concerns, not a pass someone makes at the end.',
    icon: Hammer,
  },
  {
    number: '05',
    title: 'Validate',
    summary: 'Test, review, refine and prepare for launch.',
    detail:
      'Functional testing, accessibility and responsive checks, performance review and a content and claims review before anything reaches production.',
    icon: ShieldCheck,
  },
  {
    number: '06',
    title: 'Launch',
    summary: 'Deploy, monitor and support the release.',
    detail:
      'Production deployments are traceable to a specific commit, released through preview environments first, and watched after release rather than assumed to be fine.',
    icon: Rocket,
  },
  {
    number: '07',
    title: 'Grow',
    summary: 'Continue improving the product through maintenance and new capabilities.',
    detail:
      'Launch is a milestone, not an ending. Most of the value in a digital product accumulates in what happens after it goes live.',
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
    title: 'Business alignment first',
    description:
      'Every engagement starts with the outcome the business is trying to reach, not the technology someone read about.',
  },
  {
    title: 'Engineering quality as a default',
    description:
      'Maintainable code, documented decisions and a build that the next engineer can pick up without an archaeology phase.',
  },
  {
    title: 'Security and performance built in',
    description:
      'Handled during the build, verified before launch, and monitored afterward, rather than added once something goes wrong.',
  },
  {
    title: 'Clear, honest communication',
    description:
      'Plain language about scope, trade-offs and timelines. If something is not going to work, you hear it early.',
  },
  {
    title: 'Built to be extended',
    description:
      'Services, content and data are structured so your team can add to the product without a rebuild.',
  },
  {
    title: 'A long-term partnership',
    description:
      'Continuous care and ongoing development, so the product keeps improving after launch.',
  },
]
