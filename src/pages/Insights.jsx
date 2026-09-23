import { PenLine, ArrowRight } from 'lucide-react'
import { PageHero, Section } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { insights } from '../data/insights'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'

/**
 * Insights. (Spec §3)
 *
 * The route exists in the target information architecture, but no article
 * content has been supplied. Spec §25 is explicit: do not invent content to
 * fill a missing section — use a placeholder and ask the Product Owner. So this
 * renders an honest empty state, and starts rendering articles the moment
 * data/insights.js has entries. No layout change needed.
 */
const Insights = () => {
  usePageMeta(pageMeta.insights)

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes from the work."
        description="Perspectives on building digital products, applying AI where it earns its place, and the engineering decisions behind both."
      />

      <Section>
        {insights.length > 0 ? (
          <ul className="grid gap-5 lg:grid-cols-2">
            {insights.map((article) => (
              <li key={article.slug} className="surface p-7">
                <p className="eyebrow">{article.category}</p>
                <h2 className="mt-3 text-lg font-semibold text-silver-100">{article.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-silver-400">{article.summary}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto max-w-xl rounded-xl border border-dashed border-ink-700 bg-ink-900/50 px-6 py-16 text-center">
            <PenLine className="mx-auto h-8 w-8 text-silver-600" aria-hidden="true" />
            <h2 className="mt-5 text-lg font-semibold text-silver-200">
              We are writing the first pieces
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-silver-500">
              Rather than publish filler to make this page look busy, we have left it empty until
              we have something genuinely worth your time.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button to={routes.work} variant="secondary" size="sm">
                See our work instead
              </Button>
              <Button to={routes.startProject} size="sm">
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </Section>

      <FinalCTA location="insights" />
    </>
  )
}

export default Insights
