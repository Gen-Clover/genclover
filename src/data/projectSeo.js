/**
 * Search snippets for the case studies. (Spec §15)
 *
 * Google shows about 155 characters of a description, and the project
 * summaries run longer, so each case study gets a condensed version here.
 * Same facts as the summary, no client names, no figures that are not on the
 * page. Keep each under 156 characters; scripts/prerender.mjs warns otherwise.
 */
export const projectDescriptions = {
  'ai-log-monitoring-observability-platform':
    'A five-agent AI system for a healthcare platform that reads a production error, writes the fix and opens a reviewed pull request. Gen Clover case study.',
  'data-bi-modernization':
    'A publisher’s decade of ETL, warehouse and dashboard tools replaced with one governed cloud data platform, without breaking a number. Gen Clover case study',
  'drug-competitor-identification':
    'An AI brand-intelligence tool that finds a drug’s competitors and verifies them against regulatory reference data before anyone trusts the answer.',
  'ai-agents-platform':
    'Seven AI agents turn one upload into a recorded, print-ready batch of personalized posters, with a person approving anything commercially risky.',
  'recruitment-analytics-decision-support':
    'Recruitment analytics for a staffing platform: governed KPIs in Power BI, daily aging and escalation flags, and at-risk requirement scoring.',
  'medical-data-intelligence-platform':
    'Reporting, prediction and document processing for a medical data platform: OCR into validated records and one governed data layer.',
  'ecommerce-analytics-platform':
    'An e-commerce analytics platform bringing order, product and customer data into one governed view, so trading meetings start from agreed numbers.',
  'customer-churn-prediction':
    'A churn prediction model for a subscription software business that flags at-risk accounts before renewal and explains every score in plain language.',
  'corporate-website-redesign':
    'A corporate website for a professional services firm, organized around client questions, with a validated inquiry flow and a CMS the team edits itself.',
  'realtime-data-streaming-platform':
    'A real-time event streaming platform for a logistics operator that puts delivery exceptions in front of dispatch while they can still be acted on.',
  'recommendation-engine':
    'A product recommendation engine for a large retail catalog that surfaces new listings, keeps merchandisers in control and tests changes before rollout.',
  'saas-dashboard-application':
    'A multi-tenant SaaS foundation: accounts, roles, subscription billing, an in-product dashboard and a documented API, built before feature work began.',
  'image-classification-system':
    'A computer vision system for a manufacturer’s production line that flags defects consistently across a shift and sends uncertain items to an inspector.',
  'portfolio-website':
    'An image-led portfolio website for a creative studio where the work is the interface, with the full experience available with reduced motion.',
}

export const projectDescription = (project) => projectDescriptions[project.slug] ?? project.summary

/** Share image for a case study, generated into public/og/work/. */
export const projectShareImage = (project) => `/og/work/${project.slug}.jpg`
