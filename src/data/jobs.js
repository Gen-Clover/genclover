/**
 * Seed roles. (Careers)
 *
 * Live roles are managed in the admin portal (/admin) and stored in the jobs
 * database. This file is only
 *   - the first rows written when the database table is created, and
 *   - the fallback the careers page shows when the database is not configured
 *     or cannot be reached, so the page is never empty.
 *
 * Shape: see src/lib/jobs.js. A role with `status: 'closed'` stays visible as a
 * record of the work we hire for, is marked closed everywhere, and is not
 * indexed. `postedAt` is when the role was first published on the site.
 * Plain data only (no imports): the serverless functions load this file in Node.
 */
export const jobs = [
  {
    id: 'data-analyst-remote-india',
    title: 'Data Analyst',
    department: 'data',
    employmentType: 'full-time',
    workplace: 'remote',
    locations: ['India'],
    openings: 1,
    experienceMin: 3,
    experienceMax: null,
    salary: { min: null, max: null, currency: 'INR', period: 'year', visible: false },
    summary: 'Turn client data into reporting people trust and act on: model data in SQL, agree KPI definitions with the people who own them, and build dashboards in Power BI.',
    description: 'Gen Clover builds websites, applications, AI workflows and data platforms for businesses in India and abroad. As a Data Analyst you will work on client engagements from the first question to the finished dashboard: understanding what decision the reporting has to support, modeling the source data, defining the numbers with the people who own them, and building reports that stay correct after launch.\n\nYou will work directly with client stakeholders and with our engineers, not through a chain of intermediaries. Most collaboration is written and asynchronous, with calls arranged across Indian and international time zones. This is a fully remote role open to candidates anywhere in India.',
    responsibilities: [
      'Meet client stakeholders to understand the decisions they need to make, and turn that into a written reporting requirement',
      'Profile source systems (ERPs, CRMs, spreadsheets, application databases, APIs) and document what the data really contains',
      'Model raw data in SQL into clean, documented tables and star schemas that reporting can rely on',
      'Agree KPI definitions with business owners, write them down, and implement each one once, centrally',
      'Build Power BI dashboards and reports designed around the decision they support, with sensible drill-downs and row-level security where needed',
      'Write data quality checks and reconciliations, and follow up when something does not match the source',
      'Automate recurring reports and refreshes, and monitor them after handover',
      'Explain findings in plain language to non-technical audiences, in writing and on calls',
      'Work with data engineers on how data is collected, stored and refreshed, and raise issues early',
      'Keep documentation current: data dictionaries, KPI definitions and dashboard guides'
    ],
    requirements: [
      '3+ years of professional experience in data analysis, business intelligence or a closely related role',
      'Strong SQL: joins, window functions, CTEs, and writing queries others can read and verify',
      'Hands-on experience building production dashboards in Power BI, including data modeling and DAX',
      'Understanding of data warehousing concepts: star schemas, slowly changing dimensions and incremental loads',
      'Python (pandas) or R for analysis, cleaning and automation',
      'Experience turning vague business questions into clear, measurable KPIs',
      'Careful with detail, and able to explain a number and exactly where it came from',
      'Clear written and spoken English, since most collaboration is written',
      'Comfortable managing several client projects at once and saying early when priorities clash',
      'A reliable internet connection and a quiet place to work remotely within India'
    ],
    niceToHave: [
      'Experience with Microsoft Fabric, Azure Synapse, Snowflake or BigQuery',
      'Familiarity with dbt or another SQL transformation tool',
      'Tableau or Looker experience alongside Power BI',
      'Microsoft PL-300 (Power BI Data Analyst) certification',
      'Client-facing or consulting experience',
      'Degree in statistics, mathematics, economics, computer science or similar'
    ],
    skills: ['SQL', 'Power BI', 'DAX', 'Python', 'Data modeling', 'Star schema', 'ETL', 'Excel', 'KPI design', 'Data quality'],
    applyEmail: '',
    metaDescription: 'Data Analyst (3+ years) at Gen Clover: SQL data modeling, Power BI dashboards and KPI definitions for client projects. Full-time, remote across India.',
    status: 'open',
    postedAt: '2026-09-27T03:30:00.000Z'
  },
  {
    id: '1',
    title: 'Full Stack Engineer',
    department: 'engineering',
    employmentType: 'freelance',
    workplace: 'remote',
    locations: ['Chandigarh, India'],
    openings: 1,
    experienceMin: 3,
    experienceMax: null,
    salary: { min: null, max: null, currency: 'INR', period: 'year', visible: false },
    status: 'closed',
    postedAt: '2026-01-11T00:00:00.000Z',
    summary:
      'Build and ship React and Node.js web applications for clients, taking features from a written requirement to a reviewed, tested release.',
    metaDescription:
      'Freelance Full Stack Engineer at Gen Clover: build and ship React and Node.js web applications for clients, from first commit to production. Applications closed.',
    description:
      'We are looking for an engineer who can take a feature from a written requirement to a reviewed, tested release on their own. You will build client web applications in React and Node.js, work directly with the people who defined the requirement, and own your code in production.',
    responsibilities: [
      'Build features across the frontend and backend of client web applications, from data model to interface',
      'Turn written requirements into a short technical plan and raise questions early',
      'Write code that the next engineer can read, with tests where they earn their place',
      'Open pull requests that are small, described and easy to review, and review others’ work',
      'Deploy through CI/CD to preview and production environments, and watch releases afterward',
      'Investigate and fix production issues, and write down what caused them',
    ],
    requirements: [
      '3+ years of professional full-stack web development',
      'Strong React, Node.js and modern JavaScript or TypeScript',
      'Experience with a relational database (PostgreSQL or similar) and at least one NoSQL store',
      'Comfortable designing and consuming REST APIs; GraphQL is a plus',
      'Day-to-day use of Git, pull requests and CI/CD',
      'Working knowledge of at least one cloud platform (AWS, Azure or Google Cloud)',
      'Clear written English, since most of our collaboration is written',
      'Able to commit reliable hours across an engagement and communicate availability honestly',
    ],
    niceToHave: [],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'CI/CD'],
    applyEmail: '',
  },
  {
    id: '2',
    title: 'Data Analyst',
    department: 'data',
    employmentType: 'full-time',
    workplace: 'remote',
    locations: ['Chandigarh, India'],
    openings: 1,
    experienceMin: 2,
    experienceMax: null,
    salary: { min: null, max: null, currency: 'INR', period: 'year', visible: false },
    status: 'closed',
    postedAt: '2026-01-11T00:00:00.000Z',
    summary:
      'Turn client data into reporting people trust: model data in SQL, agree KPI definitions and build Power BI dashboards.',
    metaDescription:
      'Data Analyst at Gen Clover: model data in SQL, build Power BI dashboards and define KPIs that mean the same thing everywhere. Full-time, remote. Applications closed.',
    description:
      'You will turn client data into reporting that people trust and use. That means modeling data in SQL, defining KPIs with the people who own them, building dashboards in Power BI or similar tools, and explaining what the numbers say in plain language.',
    responsibilities: [
      'Model source data into clean, documented tables that reporting can rely on',
      'Agree KPI definitions with business owners and implement each one once, centrally',
      'Build dashboards and reports designed around the decision they support',
      'Write data quality checks and follow up when something does not reconcile',
      'Present findings to technical and non-technical audiences, in writing and on calls',
      'Work with data engineers on how data is collected, stored and refreshed',
    ],
    requirements: [
      '2+ years in data analysis, business intelligence or a related role',
      'Strong SQL for extraction, modeling and validation',
      'Experience with Power BI, Tableau, Looker or a similar tool; DAX is a plus',
      'Python or R for analysis',
      'Understanding of data warehousing, star schemas and ETL processes',
      'Careful with detail, and able to explain a number and where it came from',
      'Comfortable managing several pieces of work at once and saying when priorities clash',
      'Degree in statistics, mathematics, economics, computer science or similar (preferred, not required)',
    ],
    niceToHave: [],
    skills: ['SQL', 'Power BI', 'DAX', 'Python', 'Data modeling', 'ETL'],
    applyEmail: '',
  },
]
