import { Code, BarChart3 } from 'lucide-react'

/**
 * Careers listings. A role with `status: 'closed'` stays visible as a record of
 * the work we hire for, is marked closed everywhere, and is not indexed.
 * `metaDescription` is the search snippet (about 150–160 characters).
 */
export const jobs = [
  {
    id: 1,
    title: 'Full Stack Engineer',
    type: 'Freelance / contract',
    location: 'Remote / Chandigarh',
    status: 'closed',
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
    icon: Code,
  },
  {
    id: 2,
    title: 'Data Analyst',
    type: 'Full-time',
    location: 'Remote / Chandigarh',
    status: 'closed',
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
    icon: BarChart3,
  },
]
