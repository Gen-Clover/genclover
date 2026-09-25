import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, FolderOpen } from 'lucide-react'
import { PageHero, Section } from '../components/ui/Section'
import Button from '../components/ui/Button'
import WorkFilters from '../components/work/WorkFilters'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { getProjectsByCategory } from '../data/projects'
import { workFilters, getWorkCategory } from '../data/taxonomy'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants } from '../lib/motion'

/**
 * Work hub. (Spec §7, §21)
 *
 * The active filter lives in the URL (?category=) rather than component state,
 * so a filtered view is linkable, shareable and survives a back button — and
 * the header's Work dropdown can link straight into a category.
 */
const Work = () => {
  usePageMeta(pageMeta.work)
  const v = useMotionVariants()
  const [searchParams, setSearchParams] = useSearchParams()

  const requested = searchParams.get('category') ?? 'all'
  const active = workFilters.some((f) => f.id === requested) ? requested : 'all'
  const projects = getProjectsByCategory(active)
  const activeCategory = getWorkCategory(active)

  const resultsRef = useRef(null)

  const setActive = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setSearchParams(next, { replace: true })

    /**
     * Narrowing the filter makes the page shorter, and the browser clamps the
     * scroll position to the new maximum. That can leave the filter bar itself
     * scrolled off the top, so the visitor cannot see the control they just
     * used or the results it produced.
     *
     * Correct only that case, and only after the new list has been laid out.
     * Scrolling before the re-render would race the clamp, and a smooth scroll
     * would be interrupted by it mid-flight, which is how a filter click ends
     * up dumping someone at the very top of the page.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = resultsRef.current
        if (!el) return
        const HEADER = 96
        const { top } = el.getBoundingClientRect()
        if (top >= HEADER) return
        window.scrollTo({
          top: Math.max(0, top + window.scrollY - HEADER),
          left: 0,
          behavior: 'instant',
        })
      })
    })
  }

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Work we have delivered."
        description="Websites, applications, AI, data and platform projects, each with a full write-up of the problem, the approach and how the system was built."
      >
        <Button to={routes.startProject} size="lg">
          Start a Project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PageHero>

      <Section>
        {/* An h2 for the results region: without it the page jumps h1 -> h3
            (the card headings), which breaks the document outline. */}
        <h2 className="sr-only">
          {activeCategory ? `${activeCategory.label} projects` : 'All work'}
        </h2>

        <div ref={resultsRef} className="mb-10">
          <WorkFilters active={active} onChange={setActive} />
          <p className="mt-5 text-sm text-silver-500" aria-live="polite">
            Showing {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            {activeCategory ? ` in ${activeCategory.label}` : ''}.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={v.stagger(0.05)}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project, i) => (
              <WorkCard key={project.slug} project={project} priority={i < 3} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* An empty category is stated honestly rather than padded out. */}
        {projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink-700 bg-ink-900/50 px-6 py-16 text-center">
            <FolderOpen className="mx-auto h-8 w-8 text-silver-600" aria-hidden="true" />
            <h2 className="mt-5 text-lg font-semibold text-silver-200">
              Nothing published here yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-silver-500">
              We have not published work in this category yet. We would rather show you an empty
              shelf than fill it with something we cannot stand behind.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => setActive('all')}>
                View all work
              </Button>
              <Button to={routes.startProject} size="sm">
                Discuss a project
              </Button>
            </div>
          </div>
        )}
      </Section>

      <FinalCTA
        title="Want to see how this would work for you?"
        description="Tell us about the project and we will show you the closest thing we have built, and what we would do differently for your situation."
        location="work_hub"
      />
    </>
  )
}

export default Work
