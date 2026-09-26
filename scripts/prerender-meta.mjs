/**
 * Writes one HTML file per public route after `vite build`, each carrying that
 * route's <title>, meta description, canonical URL and Open Graph tags in the
 * static HTML. Crawlers and link previews (LinkedIn, WhatsApp, Slack) that do
 * not run JavaScript then see the right text instead of the site defaults.
 *
 * Files are written as dist/<route>.html; vercel.json sets cleanUrls so
 * /services is served from services.html. The app itself still boots from the
 * same bundle, so nothing else changes.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

try {
  const load = (p) => server.ssrLoadModule(p)
  const { site, routes } = await load('/src/data/site.js')
  const { pageMeta } = await load('/src/lib/seo.js')
  const { services } = await load('/src/data/services.js')
  const { publishedProjects } = await load('/src/data/projects.js')
  const { industryPages } = await load('/src/data/industries.js')
  const { jobs } = await load('/src/data/jobs.js')

  const pages = [
    ...Object.values(pageMeta).map((m) => ({ path: m.path, title: m.title, description: m.description })),
    ...services.map((s) => ({
      path: `${routes.services}/${s.slug}`,
      title: s.seo.title,
      description: s.seo.description,
    })),
    ...publishedProjects.map((p) => ({
      path: `${routes.work}/${p.slug}`,
      title: `${p.title} | Gen Clover`,
      description: p.summary,
    })),
    ...industryPages.map((i) => ({
      path: `${routes.industries}/${i.id}`,
      title: `${i.label} | Gen Clover`,
      description: i.seoDescription ?? i.description,
    })),
    ...jobs.map((j) => ({
      path: `${routes.careers}/${j.id}`,
      title: `${j.title}, Careers | Gen Clover`,
      description: j.metaDescription,
      noIndex: j.status === 'closed',
    })),
  ]

  const template = readFileSync(resolve('dist/index.html'), 'utf8')
  const DEFAULT_IMAGE = `${site.url}/brand/gen-clover-banner.png`

  for (const page of pages) {
    const url = `${site.url}${page.path === '/' ? '/' : page.path}`
    const head = [
      `<title>${esc(page.title)}</title>`,
      `<meta name="description" content="${esc(page.description)}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:title" content="${esc(page.title)}" />`,
      `<meta property="og:description" content="${esc(page.description)}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:image" content="${DEFAULT_IMAGE}" />`,
      page.noIndex ? '<meta name="robots" content="noindex, nofollow" />' : '',
    ]
      .filter(Boolean)
      .join('\n    ')

    const html = template
      .replace(/<title>[\s\S]*?<\/title>/, '')
      .replace(/<meta\s+name="description"[\s\S]*?\/>/, '')
      .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, '')
      .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, '')
      .replace(/<meta\s+property="og:image"[\s\S]*?\/>/, '')
      .replace('</head>', `    ${head}\n  </head>`)

    const file = page.path === '/' ? 'dist/index.html' : `dist${page.path}.html`
    mkdirSync(dirname(resolve(file)), { recursive: true })
    writeFileSync(resolve(file), html)
  }
  console.log(`prerendered meta: ${pages.length} routes`)
} finally {
  await server.close()
}
