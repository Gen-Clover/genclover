import { Linkedin } from 'lucide-react'
import { services } from './services'
import { workFilters } from './taxonomy'

/**
 * Company-level constants and the primary navigation model. (Spec §3, §19)
 * Navigation is derived from the service and work taxonomies so a new service
 * appears in the header, the footer and the inquiry form at once.
 */

export const site = {
  name: 'Gen Clover',
  wordmark: { lead: 'GEN', trail: 'CLOVER' },
  tagline: 'Next-generation intelligence. Growing possibilities.',
  meaning: 'Generating technology that creates opportunities and enables growth.',
  philosophy: 'Intelligence → Innovation → Automation → Growth',
  positioning: 'We design and build digital products that move businesses forward.',
  domains: 'Digital Products • Technology • AI • Automation',
  url: 'https://genclover.com',
}

/**
 * Official contact details. (Spec §19)
 * `phone` is deliberately null: the spec records it as N/A pending the Product
 * Owner. Do not invent one — the UI omits the row when this is null.
 */
export const contact = {
  email: 'contact@genclover.com',
  phone: null,
  location: 'Chandigarh, India',
  /**
   * Deliberately not a fixed 9-to-6 window. Clients run across Indian and
   * international time zones, so publishing office hours in one zone tells
   * most of them the wrong thing. This states reach, not a schedule.
   */
  hours: 'Across Indian and international time zones',
  servingNote:
    'We work with clients in India and internationally, and arrange calls around your working day rather than ours.',
}

/**
 * Social accounts. (Spec §19 — only real accounts.)
 * Add an entry only once the account exists and the Product Owner confirms it.
 */
export const socialLinks = [
  {
    label: 'Gen Clover on LinkedIn',
    href: 'https://www.linkedin.com/company/gen-clover/',
    icon: Linkedin,
  },
]

export const routes = {
  home: '/',
  services: '/services',
  work: '/work',
  industries: '/industries',
  howWeWork: '/how-we-work',
  about: '/about',
  careers: '/careers',
  startProject: '/start-a-project',
  privacy: '/privacy',
  terms: '/terms',
}

/**
 * Primary header navigation. (Spec §18)
 * The wordmark also links home; Home is listed explicitly as well so the route
 * is reachable without the visitor having to know the logo is clickable.
 */
export const primaryNav = [
  { label: 'Home', to: routes.home },
  {
    label: 'Services',
    to: routes.services,
    children: services.map((s) => ({
      label: s.title,
      to: `${routes.services}/${s.slug}`,
      description: s.shortDescription,
      icon: s.icon,
    })),
  },
  {
    label: 'Work',
    to: routes.work,
    children: workFilters.map((f) => ({
      label: f.label,
      to: f.id === 'all' ? routes.work : `${routes.work}?category=${f.id}`,
    })),
  },
  { label: 'Industries', to: routes.industries },
  { label: 'How We Work', to: routes.howWeWork },
  { label: 'About', to: routes.about },
  { label: 'Careers', to: routes.careers },
]

export const footerNav = [
  {
    title: 'Services',
    links: services.map((s) => ({ label: s.title, to: `${routes.services}/${s.slug}` })),
  },
  {
    title: 'Work',
    links: workFilters.map((f) => ({
      label: f.label,
      to: f.id === 'all' ? routes.work : `${routes.work}?category=${f.id}`,
    })),
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: routes.about },
      { label: 'How We Work', to: routes.howWeWork },
      { label: 'Industries', to: routes.industries },
      { label: 'Careers', to: routes.careers },
      { label: 'Start a Project', to: routes.startProject },
    ],
  },
]

/** Legal links, shown in the footer. (Spec §19) */
export const legalNav = [
  { label: 'Privacy Notice', to: routes.privacy },
  { label: 'Terms of Use', to: routes.terms },
]
