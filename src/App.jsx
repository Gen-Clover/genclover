import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Clovi from './components/clovi/Clovi'
import ScrollRestoration from './components/ScrollRestoration'
import CursorLight from './components/ui/CursorLight'
import Home from './pages/Home'
import { routes } from './data/site'
import { templatePath } from './data/templates'
import { captureAttribution } from './lib/analytics'
import { startVisitorLog, logPageview } from './lib/visitorLog'
import { useHoverSound } from './lib/hoverSound'

/**
 * Routing and information architecture. (Spec §3, §18, §25)
 *
 * Home is bundled eagerly; everything else is code-split so the first paint
 * stays light. Renamed routes keep working through the LEGACY_REDIRECTS table
 * rather than being dropped — spec §25 requires URLs stay stable where possible.
 */

const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Work = lazy(() => import('./pages/Work'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Industries = lazy(() => import('./pages/Industries'))
const IndustryDetail = lazy(() => import('./pages/IndustryDetail'))
const HowWeWork = lazy(() => import('./pages/HowWeWork'))
const About = lazy(() => import('./pages/About'))
const Careers = lazy(() => import('./pages/Careers'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const StartProject = lazy(() => import('./pages/StartProject'))
const BookDemo = lazy(() => import('./pages/BookDemo'))
const TemplatePreview = lazy(() => import('./pages/TemplatePreview'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))
// The admin portal has no link anywhere on the site; it is reached at /admin.
const AdminApp = lazy(() => import('./pages/admin/AdminApp'))

/**
 * Routes from the previous site, kept alive as redirects.
 * Individual /services/<old-slug> paths are handled inside ServiceDetail via
 * each service's `legacySlugs`, so they are not repeated here.
 */
const LEGACY_REDIRECTS = [
  { from: '/portfolio', to: routes.work },
  { from: '/contact', to: routes.startProject },
  { from: '/career', to: routes.careers },
  // Insights was removed until there is content to publish.
  { from: '/insights', to: routes.home },
]

/** Keeps a single-element-tall placeholder so lazy routes do not flash the footer up. */
const RouteFallback = () => <div className="min-h-[70vh]" aria-busy="true" />

const AttributionCapture = () => {
  const location = useLocation()
  // Spec §16 — capture source/campaign once per session, on first view.
  useEffect(() => {
    captureAttribution()
    // The admin's own visits are never logged.
    if (!location.pathname.startsWith('/admin')) startVisitorLog()
    logPageview(location.pathname)
  }, [location.pathname])
  return null
}

/**
 * The whole site. The router is supplied from outside: BrowserRouter in the
 * browser (main.jsx) and StaticRouter when pages are pre-rendered at build
 * time (entry-server.jsx), so both render exactly the same tree.
 */
function App() {
  useHoverSound()

  return (
    <>
      <ScrollRestoration />
      <CursorLight />
      <AttributionCapture />

      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AdminApp />
            </Suspense>
          }
        />
        {/* Template previews fill the window, with their own slim bar. */}
        <Route
          path={templatePath(':slug')}
          element={
            <Suspense fallback={<RouteFallback />}>
              <TemplatePreview />
            </Suspense>
          }
        />
        <Route path="*" element={<SiteLayout />} />
      </Routes>
    </>
  )
}

/** The public site: header, the page, footer. */
function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={routes.home} element={<Home />} />

            <Route path={routes.services} element={<Services />} />
            <Route path={`${routes.services}/:slug`} element={<ServiceDetail />} />

            <Route path={routes.work} element={<Work />} />
            <Route path={`${routes.work}/:slug`} element={<ProjectDetail />} />

            <Route path={routes.industries} element={<Industries />} />
            <Route path={`${routes.industries}/:slug`} element={<IndustryDetail />} />

            <Route path={routes.howWeWork} element={<HowWeWork />} />
            <Route path={routes.about} element={<About />} />

            <Route path={routes.careers} element={<Careers />} />
            <Route path={`${routes.careers}/:id`} element={<JobDetail />} />

            <Route path={routes.startProject} element={<StartProject />} />
            <Route path={routes.bookDemo} element={<BookDemo />} />
            <Route path={routes.privacy} element={<Privacy />} />
            <Route path={routes.terms} element={<Terms />} />

            {/* Compatibility redirects for the previous information architecture */}
            {LEGACY_REDIRECTS.map(({ from, to }) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            {/* /portfolio/:slug and /work/:slug share a slug space */}
            <Route path="/portfolio/:slug" element={<LegacyProjectRedirect />} />
            {/* The old career route nested job ids one level deeper */}
            <Route path="/career/job/:id" element={<LegacyJobRedirect />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      {/* Chat assistant: public pages only, never in /admin. */}
      <Clovi />
    </div>
  )
}

/** /portfolio/<slug> → /work/<slug>, preserving the slug. */
function LegacyProjectRedirect() {
  const { pathname } = useLocation()
  return <Navigate to={pathname.replace('/portfolio', routes.work)} replace />
}

/** /career/job/<id> → /careers/<id>, preserving the job id. */
function LegacyJobRedirect() {
  const { pathname } = useLocation()
  return <Navigate to={pathname.replace('/career/job', routes.careers)} replace />
}

export default App
