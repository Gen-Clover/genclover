import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Writable } from 'node:stream'
import App from './App.jsx'
import { ThemeProvider } from './lib/theme.jsx'

export { setPrerenderJobs } from './lib/jobsApi'

/**
 * Build-time renderer, used by scripts/prerender.mjs. Renders one route to the
 * HTML that goes inside <div id="root">, waiting for every lazy page chunk so
 * the output contains the real page rather than the loading placeholder.
 */
export const render = (url) =>
  new Promise((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _encoding, done) {
        html += chunk.toString()
        done()
      },
    })
    sink.on('finish', () => resolve(html))

    const { pipe, abort } = renderToPipeableStream(
      <React.StrictMode>
        <ThemeProvider>
          <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </StaticRouter>
        </ThemeProvider>
      </React.StrictMode>,
      {
        onAllReady() {
          pipe(sink)
        },
        onShellError: reject,
        onError(error) {
          reject(error)
        },
      }
    )
    setTimeout(() => abort(new Error(`Render of ${url} timed out`)), 20000)
  })
