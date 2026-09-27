/**
 * Writes one complete HTML file per public route after `vite build`.
 *
 * Each file carries the page's real content (rendered by src/entry-server.jsx,
 * so crawlers, AI search engines and link previews that do not run JavaScript
 * see the text and links) plus its title, description, canonical URL, Open
 * Graph image and structured data. In the browser, React takes over the same
 * HTML in place (hydrateRoot in src/main.jsx).
 *
 * Files are written as dist/<route>.html; vercel.json sets cleanUrls so
 * /services is served from services.html. dist/app-shell.html is the empty
 * page that routes without their own file fall back to (see vercel.json).
 *
 * Needs the server bundle: `vite build --ssr src/entry-server.jsx --outDir dist-server`.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import { loadPublicJobs } from './_jobs.mjs'

// React warns that useLayoutEffect does nothing on the server; those effects
// simply run in the browser, so the notice is noise in a build log.
const consoleError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('useLayoutEffect does nothing on the server')) return
  consoleError(...args)
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/** JSON inside <script> must not be able to close the tag. */
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

try {
  const load = (p) => server.ssrLoadModule(p)
  const { site, routes } = await load('/src/data/site.js')
  const { pageMeta, DEFAULT_IMAGE } = await load('/src/lib/seo.js')
  const { services } = await load('/src/data/services.js')
  const { publishedProjects } = await load('/src/data/projects.js')
  const { industryPages } = await load('/src/data/industries.js')
  const { projectDescription, projectShareImage } = await load('/src/data/projectSeo.js')
  const jobLib = await load('/src/lib/jobs.js')
  const jobs = await loadPublicJobs()

  const { render, setPrerenderJobs } = await import(pathToFileURL(resolve('dist-server/entry-server.js')).href)
  setPrerenderJobs(jobs)

  /* ------------------------------------------------ structured data */

  const ORG = { '@id': `${site.url}/#organization` }
  const abs = (path) => `${site.url}${path === '/' ? '/' : path}`
  const breadcrumbs = (trail) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
  })

  const EMPLOYMENT = { 'full-time': 'FULL_TIME', 'part-time': 'PART_TIME', contract: 'CONTRACTOR', freelance: 'CONTRACTOR', internship: 'INTERN' }
  const jobPosting = (job) => {
    const list = (items) => (items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '')
    const posting = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: [
        `<p>${esc(job.summary)}</p>`,
        `<p>${esc(job.description).replace(/\n\n/g, '</p><p>')}</p>`,
        job.responsibilities?.length ? `<p><strong>What you will do</strong></p>${list(job.responsibilities)}` : '',
        job.requirements?.length ? `<p><strong>What we are looking for</strong></p>${list(job.requirements)}` : '',
        job.niceToHave?.length ? `<p><strong>Nice to have</strong></p>${list(job.niceToHave)}` : '',
      ].join(''),
      identifier: { '@type': 'PropertyValue', name: 'Gen Clover', value: job.id },
      datePosted: job.postedAt.slice(0, 10),
      // Google treats a posting past this date as expired. Counted from the build,
      // and every change in /admin triggers a rebuild, so an open role stays current.
      validThrough: new Date(Date.now() + 60 * 864e5).toISOString(),
      employmentType: EMPLOYMENT[job.employmentType] ?? 'OTHER',
      hiringOrganization: { '@type': 'Organization', name: site.name, sameAs: site.url, logo: `${site.url}/icon-512.png` },
      directApply: true,
      industry: jobLib.departmentLabel(job.department),
      skills: job.skills?.join(', ') || undefined,
      experienceRequirements: job.experienceMin
        ? { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: job.experienceMin * 12 }
        : undefined,
    }
    if (job.workplace === 'remote') {
      posting.jobLocationType = 'TELECOMMUTE'
      posting.applicantLocationRequirements = (job.locations?.length ? job.locations : ['India']).map((name) => ({
        '@type': 'Country',
        name: name.split(',').pop().trim(),
      }))
    } else {
      posting.jobLocation = (job.locations ?? []).map((place) => {
        const [locality, country = 'India'] = place.split(',').map((s) => s.trim())
        return { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: locality, addressCountry: country === 'India' ? 'IN' : country } }
      })
    }
    if (job.salary?.visible && (job.salary.min || job.salary.max)) {
      posting.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: job.salary.currency,
        value: { '@type': 'QuantitativeValue', minValue: job.salary.min ?? undefined, maxValue: job.salary.max ?? undefined, unitText: { year: 'YEAR', month: 'MONTH', hour: 'HOUR' }[job.salary.period] },
      }
    }
    return posting
  }

  /* ---------------------------------------------------------- pages */

  const pages = [
    ...Object.values(pageMeta).map((m) => ({
      path: m.path,
      title: m.title,
      description: m.description,
      schema:
        m.path === '/'
          ? [{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: `${site.url}/`, publisher: ORG }]
          : [],
      jobs: m.path === routes.careers,
    })),
    ...services.map((s) => ({
      path: `${routes.services}/${s.slug}`,
      title: s.seo.title,
      description: s.seo.description,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.title,
          serviceType: s.title,
          description: s.seo.description,
          url: abs(`${routes.services}/${s.slug}`),
          provider: ORG,
          areaServed: [{ '@type': 'Country', name: 'India' }, 'Worldwide'],
        },
        breadcrumbs([['Home', '/'], ['Services', routes.services], [s.title, `${routes.services}/${s.slug}`]]),
      ],
    })),
    ...publishedProjects.map((p) => ({
      path: `${routes.work}/${p.slug}`,
      title: `${p.title} | Gen Clover`,
      description: projectDescription(p),
      image: projectShareImage(p),
      schema: [breadcrumbs([['Home', '/'], ['Work', routes.work], [p.title, `${routes.work}/${p.slug}`]])],
    })),
    ...industryPages.map((i) => ({
      path: `${routes.industries}/${i.id}`,
      title: `${i.label} | Gen Clover`,
      description: i.seoDescription ?? i.description,
      schema: [breadcrumbs([['Home', '/'], ['Industries', routes.industries], [i.label, `${routes.industries}/${i.id}`]])],
    })),
    ...jobs.map((j) => ({
      path: `${routes.careers}/${j.id}`,
      title: `${j.title}, Careers | Gen Clover`,
      description: j.metaDescription || j.summary,
      noIndex: j.status !== 'open',
      jobs: true,
      schema: [
        ...(j.status === 'open' ? [jobPosting(j)] : []),
        breadcrumbs([['Home', '/'], ['Careers', routes.careers], [j.title, `${routes.careers}/${j.id}`]]),
      ],
    })),
    // Admin is private and renders only in the browser: an empty shell, noindex.
    { path: '/admin', title: 'Admin | Gen Clover', description: 'Gen Clover admin portal.', noIndex: true, shell: true },
  ]

  /**
   * Inline the one stylesheet (about 10 KB compressed) so the first paint needs
   * no extra round trip, and preload the main text font so it is requested
   * straight away instead of after the CSS is parsed.
   */
  const inlineCritical = (html) => {
    const link = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
    if (!link) return html
    const css = readFileSync(resolve(`dist${link[1]}`), 'utf8')
    const font = css.match(/\/assets\/inter-latin-wght-normal-[^)"']+\.woff2/)?.[0]
    const preload = font ? `<link rel="preload" href="${font}" as="font" type="font/woff2" crossorigin />\n    ` : ''
    return html.replace(link[0], `${preload}<style>${css}</style>`)
  }

  const template = inlineCritical(readFileSync(resolve('dist/index.html'), 'utf8'))
  const stripHead = (html) =>
    html
      .replace(/<title>[\s\S]*?<\/title>/, '')
      .replace(/<meta\s+name="description"[\s\S]*?\/>/, '')
      .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, '')
      .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, '')
      .replace(/<meta\s+property="og:image"\s[\s\S]*?\/>/, '')

  // The fallback for routes built after this deploy (e.g. a role just posted):
  // no page content, so React renders the right route instead of hydrating the
  // wrong one.
  writeFileSync(
    resolve('dist/app-shell.html'),
    template.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>')
  )

  const long = []
  for (const page of pages) {
    const url = abs(page.path)
    const image = `${site.url}${page.image ?? DEFAULT_IMAGE}`
    if (!page.shell && page.description && page.description.length > 160) long.push(`${page.path} (${page.description.length})`)

    const head = [
      `<title>${esc(page.title)}</title>`,
      `<meta name="description" content="${esc(page.description)}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${esc(page.title)}" />`,
      `<meta property="og:description" content="${esc(page.description)}" />`,
      `<meta property="og:image" content="${image}" />`,
      `<meta name="twitter:image" content="${image}" />`,
      page.noIndex ? '<meta name="robots" content="noindex, nofollow" />' : '',
      ...(page.schema ?? []).map((s) => `<script type="application/ld+json">${json(s)}</script>`),
    ]
      .filter(Boolean)
      .join('\n    ')

    const body = page.shell ? '' : await render(page.path)
    let html = stripHead(template)
      .replace('</head>', `    ${head}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    // Careers pages start from the same roles they were rendered with.
    if (page.jobs) html = html.replace('<script type="module"', `<script>window.__GC_JOBS__=${json(jobs)}</script>\n    <script type="module"`)

    const file = page.path === '/' ? 'dist/index.html' : `dist${page.path}.html`
    mkdirSync(dirname(resolve(file)), { recursive: true })
    writeFileSync(resolve(file), html)
  }

  console.log(`prerendered: ${pages.length} routes (${pages.filter((p) => !p.shell).length} with full content)`)
  if (long.length) console.warn(`  descriptions over 160 characters: ${long.join(', ')}`)
} finally {
  await server.close()
  rmSync(resolve('dist-server'), { recursive: true, force: true })
}
