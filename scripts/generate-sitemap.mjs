/**
 * Writes dist/sitemap.xml after `vite build`. (Spec §15)
 *
 * Routes come from the same data files the site renders, loaded through Vite's
 * SSR module loader so the extensionless imports resolve. A new service,
 * published project or industry page appears in the sitemap automatically.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import { loadPublicJobs } from './_jobs.mjs'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
  // Only loads data modules: skip the dev-time dependency scan, which Vite 6
  // would otherwise abort noisily when the server closes.
  optimizeDeps: { noDiscovery: true },
})

try {
  const load = (path) => server.ssrLoadModule(path)
  const { site, routes } = await load('/src/data/site.js')
  const { services } = await load('/src/data/services.js')
  const { publishedProjects } = await load('/src/data/projects.js')
  const { industryPages } = await load('/src/data/industries.js')
  const jobs = await loadPublicJobs()

  const paths = [
    routes.home,
    routes.services,
    ...services.map((s) => `${routes.services}/${s.slug}`),
    routes.work,
    ...publishedProjects.map((p) => `${routes.work}/${p.slug}`),
    routes.industries,
    ...industryPages.map((i) => `${routes.industries}/${i.id}`),
    routes.howWeWork,
    routes.about,
    routes.careers,
    // Closed roles are noindex, so they stay out of the sitemap too.
    ...jobs.filter((j) => j.status === 'open').map((j) => `${routes.careers}/${j.id}`),
    routes.startProject,
    routes.bookDemo,
    routes.privacy,
    routes.terms,
  ]

  // No <lastmod>: a build date on every URL is not a real change date, and
  // Google ignores the field once it proves unreliable.
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map(
      (path) => `  <url><loc>${site.url}${path === '/' ? '/' : path}</loc></url>`
    ),
    '</urlset>',
    '',
  ].join('\n')

  writeFileSync(resolve('dist/sitemap.xml'), xml)
  console.log(`sitemap.xml: ${paths.length} URLs`)
} finally {
  await server.close()
}
