import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { CloverMark } from '../components/brand/Logo'
import { demoLink } from '../components/templates/TemplateGallery'
import { getTemplate, templateSource } from '../data/templates'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'
import { trackEvent, events } from '../lib/analytics'

/**
 * Full-screen live preview of one website template. (Templates)
 *
 * The template fills the window, header and all, exactly as a client's site
 * would. Our own controls sit in a small floating dock at the bottom, styled
 * to suit the template underneath, and can be tucked away to a single button.
 * The template runs in a frame from its own standalone page
 * (templates/<slug>/), so its styles and scripts never touch the site's.
 *
 * Noindex: the previews are sample content, for visitors rather than search.
 */

const BACK = `${routes.services}/websites#templates`

/** Dock colours per template. Plain classes so Tailwind keeps them. */
const CHROME = {
  dark: {
    dock: 'bg-[#1f221c]/75 text-white border-white/10',
    muted: 'text-white/55',
    divider: 'bg-white/15',
    ghost: 'hover:bg-white/10',
    primary: 'bg-[#e9f3df] text-[#1f221c] hover:bg-white',
  },
  paper: {
    dock: 'bg-[#f6f0e3]/90 text-[#2d2924] border-[#2d2924]/10',
    muted: 'text-[#2d2924]/55',
    divider: 'bg-[#2d2924]/15',
    ghost: 'hover:bg-[#2d2924]/[0.07]',
    primary: 'bg-[#2d2924] text-[#f6f0e3] hover:bg-[#45403a]',
  },
  light: {
    dock: 'bg-white/90 text-[#151515] border-black/10',
    muted: 'text-[#151515]/55',
    divider: 'bg-black/10',
    ghost: 'hover:bg-black/[0.05]',
    primary: 'bg-[#151515] text-white hover:bg-[#333]',
  },
}

const TemplatePreview = () => {
  const { slug } = useParams()
  const template = getTemplate(slug)
  const [ready, setReady] = useState(false)
  const [tucked, setTucked] = useState(false)

  usePageMeta({
    title: template ? `${template.name} website template preview | Gen Clover` : undefined,
    description: template?.summary,
    noIndex: true,
  })

  // Counted here as well as on the tiles, so shared links show up too.
  useEffect(() => {
    if (template) trackEvent(events.TEMPLATE_OPEN, { template: template.slug, location: 'preview_page' })
  }, [template])

  if (!template) return <Navigate to={BACK} replace />
  const c = CHROME[template.chrome] ?? CHROME.light

  return (
    <div className="relative h-[100dvh] bg-ink-950">
      <iframe
        key={template.slug}
        src={templateSource(template.slug)}
        title={`${template.name} template, live preview`}
        onLoad={() => setReady(true)}
        className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-10 flex justify-center px-3 sm:bottom-5">
        {tucked ? (
          <button
            type="button"
            onClick={() => setTucked(false)}
            className={`pointer-events-auto flex h-12 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-2xl backdrop-blur-xl ${c.dock}`}
            aria-label="Show the template controls"
          >
            <CloverMark className="h-5 w-5" />
            Book a demo
          </button>
        ) : (
          <nav
            aria-label="Template preview"
            className={`pointer-events-auto flex max-w-full items-center gap-1 rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl ${c.dock}`}
          >
            <Link
              to={BACK}
              className={`flex h-10 items-center gap-2 rounded-xl px-3 text-sm transition-colors ${c.ghost}`}
              aria-label="All templates"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <CloverMark className="h-5 w-5" />
            </Link>

            <span className={`mx-1 hidden h-6 w-px sm:block ${c.divider}`} aria-hidden="true" />

            <div className="hidden min-w-0 px-2 sm:block">
              <h1 className="truncate text-sm font-semibold leading-tight text-current">{template.name}</h1>
              <p className={`truncate text-xs leading-tight ${c.muted}`}>{template.style}</p>
            </div>

            <span className={`mx-1 hidden h-6 w-px md:block ${c.divider}`} aria-hidden="true" />

            <Link
              to={routes.startProject}
              onClick={() => trackEvent(events.START_PROJECT_CTA, { location: 'template_preview', template: template.slug })}
              className={`hidden h-10 items-center whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors md:flex ${c.ghost}`}
            >
              Start a project
            </Link>
            <Link
              to={demoLink({ type: 'template', template: template.slug })}
              onClick={() => trackEvent(events.DEMO_CTA, { location: 'template_preview', template: template.slug })}
              className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-colors ${c.primary}`}
            >
              Book a demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setTucked(true)}
              className={`flex h-10 w-9 items-center justify-center rounded-xl transition-colors ${c.ghost} ${c.muted}`}
              aria-label="Hide the template controls"
            >
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}

export default TemplatePreview
