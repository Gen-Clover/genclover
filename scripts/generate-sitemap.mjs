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

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const load = (path) => server.ssrLoadModule(path)
  const { site, routes } = await load('/src/data/site.js')
  const { services } = await load('/src/data/services.js')
  const { publishedProjects } = await load('/src/data/projects.js')
  const { industryPages } = await load('/src/data/industries.js')
  const { jobs } = await load('/src/data/jobs.js')

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
    routes.privacy,
    routes.terms,
  ]

  const today = new Date().toISOString().slice(0, 10)
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map(
      (path) => `  <url><loc>${site.url}${path === '/' ? '/' : path}</loc><lastmod>${today}</lastmod></url>`
    ),
    '</urlset>',
    '',
  ].join('\n')

  writeFileSync(resolve('dist/sitemap.xml'), xml)
  console.log(`sitemap.xml: ${paths.length} URLs`)
} finally {
  await server.close()
}
