/**
 * Insights articles. (Spec §3)
 *
 * Intentionally empty. The Insights route exists in the target information
 * architecture, but no article content has been supplied and Spec §25 forbids
 * inventing content to fill a section. The page renders an honest empty state
 * while this array is empty and switches to the article grid as soon as it is
 * not — no component change required.
 *
 * Shape — Insight {
 *   slug, title, category, summary, publishedOn, body
 * }
 *
 * @type {Array<{ slug: string, title: string, category: string, summary: string, publishedOn: string }>}
 */
export const insights = []

export const getInsight = (slug) => insights.find((a) => a.slug === slug)
