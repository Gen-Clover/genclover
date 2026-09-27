import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './lib/theme.jsx'
import { initAnalytics } from './lib/analytics'
// Fonts are self-hosted (no request to Google, nothing render-blocking), Latin only.
import '@fontsource-variable/inter/wght.css'
import '@fontsource/chakra-petch/latin-400.css'
import '@fontsource/chakra-petch/latin-500.css'
import '@fontsource/chakra-petch/latin-600.css'
import '@fontsource/chakra-petch/latin-700.css'
import './index.css'

initAnalytics()

const app = (
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)

const root = document.getElementById('root')

// Pages are pre-rendered at build time (scripts/prerender.mjs), so crawlers get
// the full content. When that HTML is present React takes it over in place;
// otherwise (local dev, or a route built after deploy) it renders from scratch.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
