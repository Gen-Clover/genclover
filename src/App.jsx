import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollRestoration from './components/ScrollRestoration'
import Home from './pages/Home'
import { routes } from './data/site'
import { captureAttribution } from './lib/analytics'

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
const Insights = lazy(() => import('./pages/Insights'))
const Careers = lazy(() => import('./pages/Careers'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const StartProject = lazy(() => import('./pages/StartProject'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

/**
 * Routes from the previous site, kept alive as redirects.
 * Individual /services/<old-slug> paths are handled inside ServiceDetail via
 * each service's `legacySlugs`, so they are not repeated here.
 */
const LEGACY_REDIRECTS = [
  { from: '/portfolio', to: routes.work },
  { from: '/contact', to: routes.startProject },
  { from: '/career', to: routes.careers },
]

/** Keeps a single-element-tall placeholder so lazy routes do not flash the footer up. */
const RouteFallback = () => <div className="min-h-[70vh]" aria-busy="true" />

const AttributionCapture = () => {
  const location = useLocation()
  // Spec §16 — capture source/campaign once per session, on first view.
  useEffect(() => {
    captureAttribution()
  }, [location.pathname])
  return null
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollRestoration />
      <AttributionCapture />

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
              <Route path={routes.insights} element={<Insights />} />

              <Route path={routes.careers} element={<Careers />} />
              <Route path={`${routes.careers}/:id`} element={<JobDetail />} />

              <Route path={routes.startProject} element={<StartProject />} />
              <Route path={routes.privacy} element={<Privacy />} />

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
      </div>
    </Router>
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
