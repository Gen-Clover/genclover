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
    title: 'Case studies describe real systems',
    description:
      'Every project in our Work section is documented from the system as built: the problem, the approach, the architecture and the safeguards, with client details withheld.',
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
  'Many of our clients prefer not to be named, so our case studies describe the systems we built rather than who we built them for. Client names, logos and testimonials appear only with the client’s permission.'
