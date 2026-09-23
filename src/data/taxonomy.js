/**
 * Gen Clover Master Taxonomy v1.1 — single source of truth.
 *
 * Spec §3 / §25 / Appendix A: Services, Work categories and Industries are three
 * SEPARATE dimensions. A project belongs to one work category, one industry and
 * one primary service, and may reference additional services. Never merge them,
 * and never re-declare any of these lists inside a component.
 */

/** Services describe what Gen Clover provides. */
export const SERVICE_SLUGS = [
  'websites',
  'web-applications',
  'ecommerce',
  'ai-automation',
  'data-analytics',
  'technology-solutions',
  'devops-mlops',
  'digital-marketing-seo',
]

/** Work categories describe what a project IS. (Appendix A.2) */
export const workCategories = [
  { id: 'websites', label: 'Websites' },
  { id: 'web-applications', label: 'Web Applications' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'ai-automation', label: 'AI & Automation' },
  { id: 'data-analytics', label: 'Data & Analytics' },
  { id: 'digital-platforms', label: 'Digital Platforms' },
]

/** The "All Work" pseudo-filter plus every real category. (Spec §7.1) */
export const workFilters = [{ id: 'all', label: 'All Work' }, ...workCategories]

/**
 * Project statuses. (Spec §7.2 / Appendix A.3)
 * `publicLabel` is the only wording that may appear on the public site.
 */
export const projectStatuses = {
  client: {
    id: 'client',
    publicLabel: 'Client Project',
    tone: 'client',
    note: 'Verified delivered work. Publish client-identifying content only with approval.',
  },
  concept: {
    id: 'concept',
    publicLabel: 'Gen Clover Concept',
    tone: 'concept',
    note: 'Demonstration project. Never presented as client work.',
  },
  internal: {
    id: 'internal',
    publicLabel: 'Gen Clover Product',
    tone: 'internal',
    note: 'Product built for Gen Clover.',
  },
  confidential: {
    id: 'confidential',
    publicLabel: 'Confidential Client Project',
    tone: 'confidential',
    note: 'Real project where identity or results cannot be disclosed.',
  },
}

export const getStatus = (id) => projectStatuses[id] ?? projectStatuses.concept

/** Industries describe WHO the work is for. (Appendix A.4) */
export const industries = [
  { id: 'professional-services', label: 'Professional Services' },
  { id: 'technology-saas', label: 'Technology & SaaS' },
  { id: 'financial-services', label: 'Financial Services' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'retail-commerce', label: 'Retail & Commerce' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'other', label: 'Other / Custom' },
]

export const getIndustry = (id) => industries.find((i) => i.id === id)
export const getWorkCategory = (id) => workCategories.find((c) => c.id === id)

/** Brand pillars — Intelligence → Innovation → Automation → Growth. */
export const brandPillars = [
  { label: 'Intelligence', description: 'Understand the business, the users and the data before building anything.' },
  { label: 'Innovation', description: 'Apply current technology deliberately, where it creates real advantage.' },
  { label: 'Automation', description: 'Remove repetitive work so teams spend their time on what matters.' },
  { label: 'Growth', description: 'Build systems that keep improving long after launch.' },
]
