import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { CloverMark } from '../components/brand/Logo'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'

const NotFound = () => {
  usePageMeta({
    title: 'Page not found | Gen Clover',
    description: 'The page you were looking for does not exist.',
    noIndex: true,
  })

  const suggestions = [
    { label: 'Services', to: routes.services },
    { label: 'Work', to: routes.work },
    { label: 'Industries', to: routes.industries },
    { label: 'How We Work', to: routes.howWeWork },
    { label: 'About', to: routes.about },
  ]

  return (
    <main className="relative grid min-h-[75vh] place-items-center overflow-hidden bg-ink-950 px-4 py-32">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-900/20 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative text-center">
        <CloverMark className="mx-auto h-12 w-12 opacity-50" />
        <p className="mt-8 font-display text-6xl font-bold tracking-brand text-silver-100 md:text-7xl">
          404
        </p>
        <h1 className="mt-5 text-2xl font-semibold text-silver-100">This page does not exist.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-silver-400">
          The link may be out of date, or the page may have moved during our recent redesign.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to={routes.home} size="md">
            Back to home
          </Button>
          <Button to={routes.startProject} size="md" variant="secondary">
            Start a Project
          </Button>
        </div>

        <nav aria-label="Suggested pages" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {suggestions.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-silver-500 transition-colors hover:text-accent-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}

export default NotFound
