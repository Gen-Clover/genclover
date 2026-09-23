import { ShieldCheck, FileSearch, GitBranch, Accessibility } from 'lucide-react'

/**
 * Proof. (Spec §14, §18, §21)
 *
 * HARD RULE: the two arrays below must stay empty until the Product Owner
 * supplies verified, approved content. The previous site published "30+ US-based
 * clients", "98% satisfaction" and four named US testimonials, none of which are
 * substantiated — they have been removed and must not return without approval.
 *
 * The UI renders these conditionally: an empty array means the section simply
 * does not appear. Nothing here needs a code change to go live — add an entry,
 * and the section renders itself.
 */

/**
 * Verified testimonials only. Each entry requires: a real named person, their
 * real role and company, their permission to publish, and wording they approved.
 * @type {Array<{ quote: string, name: string, role: string, company: string, approvedOn: string }>}
 */
export const testimonials = []

/**
 * Verified metrics only. Each entry requires a source that can be produced on
 * request — an analytics export, a signed case study, a client confirmation.
 * @type {Array<{ value: string, label: string, source: string }>}
 */
export const verifiedStats = []

/**
 * Capability and process proof — what we can stand behind today without a
 * client reference. (Spec §14: "If proof is unavailable, use capability/process
 * proof rather than invented social proof.")
 */
export const capabilityProof = [
  {
    icon: FileSearch,
    title: 'Concepts are labelled as concepts',
    description:
      'Every item in our Work section carries its real status. Demonstration projects say so, plainly, on the card and on the page.',
  },
  {
    icon: GitBranch,
    title: 'Every release is traceable',
    description:
      'Production deployments map to a specific commit, reviewed through a pull request and released via a preview environment first.',
  },
  {
    icon: ShieldCheck,
    title: 'Security is part of the build',
    description:
      'No secrets in the codebase, validated and rate-limited form endpoints, least-privilege access, and dependencies kept current.',
  },
  {
    icon: Accessibility,
    title: 'Accessibility is checked, not assumed',
    description:
      'Semantic structure, keyboard operability, visible focus states, contrast and reduced-motion support are part of pre-launch validation.',
  },
]

export const PROOF_POLICY_NOTE =
  'We publish client names, logos, testimonials and results only with permission, and only where the figures can be substantiated.'
