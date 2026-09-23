import { services } from './services'
import { workFilters } from './taxonomy'

/**
 * Company-level constants and the primary navigation model. (Spec §3, §19)
 * Navigation is derived from the service and work taxonomies so a new service
 * appears in the header, the footer and the enquiry form at once.
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
  hours: 'Monday – Friday, 9:00 AM – 6:00 PM IST',
  servingNote: 'Working with clients across India and internationally.',
}

/**
 * Social accounts. (Spec §19 — only real accounts.)
 * Add an entry only once the account exists and the Product Owner confirms it.
 */
export const socialLinks = []

export const routes = {
  home: '/',
  services: '/services',
  work: '/work',
  industries: '/industries',
  howWeWork: '/how-we-work',
  about: '/about',
  insights: '/insights',
  careers: '/careers',
  startProject: '/start-a-project',
  privacy: '/privacy',
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
  {
    label: 'Company',
    to: routes.about,
    children: [
      { label: 'About', to: routes.about },
      { label: 'Insights', to: routes.insights },
      { label: 'Careers', to: routes.careers },
    ],
  },
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
      { label: 'Insights', to: routes.insights },
      { label: 'Careers', to: routes.careers },
      { label: 'Start a Project', to: routes.startProject },
    ],
  },
]

/**
 * Legal links. Privacy is required before production lead collection (§19);
 * Terms is recommended and is left out until the Product Owner supplies it.
 */
export const legalNav = [{ label: 'Privacy Notice', to: routes.privacy }]
