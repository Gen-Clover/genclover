import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Runs the Vercel functions in /api inside the Vite dev server, so the careers
 * feed, the admin portal and the inquiry form work on localhost without the
 * Vercel CLI. Handlers are loaded through Vite, so edits apply on the next
 * request. Dev only: production is served by Vercel as usual.
 */
const devApi = (env) => ({
  name: 'gc-dev-api',
  apply: 'serve',
  configureServer(server) {
    // Server-side code reads process.env, as it does on Vercel.
    for (const [key, value] of Object.entries(env)) process.env[key] ??= value

    server.middlewares.use(async (req, res, next) => {
      const { pathname } = new URL(req.url, 'http://localhost')
      if (!pathname.startsWith('/api/')) return next()

      // Same rule as Vercel: files and folders starting with _ are not routes.
      const segments = pathname.slice(1).split('/')
      const file = resolve(`${segments.join('/')}.js`)
      if (segments.some((s) => !s || s.startsWith('_') || s.includes('..')) || !existsSync(file)) {
        res.statusCode = 404
        return res.end(JSON.stringify({ message: 'Not found.' }))
      }

      try {
        if (!['GET', 'HEAD'].includes(req.method)) {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const raw = Buffer.concat(chunks).toString('utf8')
          try {
            req.body = raw ? JSON.parse(raw) : {}
          } catch {
            req.body = raw
          }
        }
        // The Express-style helpers Vercel adds, used by api/lead.js.
        res.status = (code) => ((res.statusCode = code), res)
        res.json = (body) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(body))
          return res
        }
        const { default: handler } = await server.ssrLoadModule(file)
        await handler(req, res)
      } catch (error) {
        server.config.logger.error(`[api] ${pathname}: ${error.stack || error.message}`)
        if (!res.headersSent) {
          res.statusCode = 500
          res.end(JSON.stringify({ message: 'Local API error, see the terminal.' }))
        }
      }
    })
  },
})

const TEMPLATE_SLUGS = ['verdant', 'folio', 'clarity']

export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ''))],
  // The server bundle (pre-rendering only) needs no copy of public/.
  publicDir: isSsrBuild ? false : 'public',
  server: {
    // Pinned so the dev URL never drifts to 5174/5175 after a restart; a stray
    // server on this port now fails loudly instead of silently moving.
    port: 5173,
    strictPort: true,
    // The local job store and test emails (.data/) change while you use the
    // site; they are not source files, so they must not trigger a page reload.
    watch: { ignored: ['**/.data/**'] },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    // Website templates (templates/<slug>/index.html) are standalone pages
    // shown full screen at /services/websites/templates/<slug>. Each is built
    // as its own entry so its code and assets load only on that page.
    rollupOptions: isSsrBuild
      ? undefined
      : {
          input: {
            main: resolve('index.html'),
            ...Object.fromEntries(TEMPLATE_SLUGS.map((slug) => [`template-${slug}`, resolve(`templates/${slug}/index.html`)])),
          },
        },
  },
}))
