import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Lock, ExternalLink } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { getProject, getRelatedProjects, projectMeta, REPO_POLICY_NOTE } from '../data/projects'
import { getService } from '../data/services'
import { caseStudies } from '../data/caseStudies'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'
import {
  HeroStats,
  Story,
  HowItWorks,
  InsideTheSystem,
  BuiltWith,
  Roadmap,
  ClosingStatement,
} from '../components/work/CaseStudySections'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * Reusable case-study page. (Spec §7.3, §21)
 *
 * One component renders every Work item, and each piece of content appears
 * once:
 *   1. Hero       what it is, the key facts and the headline figures
 *   2. Story      challenge → approach → outcome
 *   3. How it works  the architecture diagram beside a step-by-step run
 *   4. Inside the system  components and safeguards
 *   5. Built with, roadmap, closing line, related work
 *
 * Sections appear only when the project carries that content, so a lightly
 * documented project degrades gracefully instead of rendering empty headings.
 */
const ProjectDetail = () => {
  const { slug } = useParams()
  const project = getProject(slug)

  usePageMeta({
    title: project ? `${project.title} | Gen Clover` : undefined,
    description: project?.summary,
    path: project ? `${routes.work}/${project.slug}` : undefined,
    image: project?.heroImage ?? undefined,
  })

  const v = useMotionVariants()

  if (!project) return <Navigate to={routes.work} replace />

  const { industry, category } = projectMeta(project)
  const primaryService = getService(project.primaryService)
  const services = [primaryService, ...(project.additionalServices ?? []).map(getService)].filter(Boolean)
  const related = getRelatedProjects(project)
  // Card visuals (flow, architecture, diagram) plus the long-form case study,
  // which is only bundled with this page.
  const cs =
    project.caseStudy || caseStudies[project.slug]
      ? { ...caseStudies[project.slug], ...project.caseStudy }
      : null

  const facts = [
    { label: 'Role', value: cs?.role },
    { label: 'Built on', value: cs?.builtOn },
    { label: 'Industry', value: industry?.label },
    { label: 'Project type', value: category?.label },
    {
      label: 'Primary service',
      value: primaryService?.title,
      to: primaryService && `${routes.services}/${primaryService.slug}`,
    },
    { label: 'Client', value: project.clientName ?? undefined },
    { label: 'Scope', value: project.scope, wide: true },
  ].filter((f) => f.value)

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <header className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 -top-32 h-[32rem] w-[32rem] rounded-full bg-accent-900/20 blur-[130px]"
          aria-hidden="true"
        />
        <div className="container relative pb-12 pt-28 md:pb-14 md:pt-32">
          <Link
            to={routes.work}
            className="-my-1.5 inline-flex items-center gap-2 py-1.5 text-sm text-silver-500 transition-colors hover:text-accent-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to work
          </Link>

          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.08)}>
            <motion.p variants={v.fadeUp} className="eyebrow mt-7">
              {[category?.label, industry?.label].filter(Boolean).join(' · ')}
            </motion.p>

            <motion.h1 variants={v.fadeUp} className="mt-5 max-w-4xl text-4xl leading-[1.08] md:text-5xl">
              {project.title}
            </motion.h1>

            <motion.p variants={v.fadeUp} className="mt-6 max-w-prose text-lg leading-relaxed text-silver-400">
              {project.summary}
            </motion.p>

            {/* Key facts, in one strip */}
            <motion.dl
              variants={v.fadeUp}
              className="mt-9 grid gap-x-10 gap-y-5 border-t border-ink-800 pt-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {facts.map((fact) => (
                <div key={fact.label} className={fact.wide ? 'sm:col-span-2 lg:col-span-3' : ''}>
                  <dt className="font-display text-[11px] uppercase tracking-eyebrow text-silver-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium leading-relaxed text-silver-200">
                    {fact.to ? (
                      <Link to={fact.to} className="transition-colors hover:text-accent-400">
                        {fact.value}
                      </Link>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.p variants={v.fadeUp} className="mt-6 text-sm">
              {project.externalUrl ? (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300"
                >
                  Visit live site
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-silver-500">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  {REPO_POLICY_NOTE}
                </span>
              )}
            </motion.p>
          </motion.div>

          <HeroStats stats={cs?.stats} />
        </div>
      </header>

      <Story project={project} cs={cs} />

      <HowItWorks project={project} cs={cs} />

      <InsideTheSystem project={project} cs={cs} />

      <BuiltWith project={project} cs={cs} services={services} />

      <Roadmap data={cs?.roadmap} />

      <ClosingStatement text={cs?.closing} />

      {/* -------------------------------------------------------- related */}
      {related.length > 0 && (
        <Section muted>
          <SectionHeader
            eyebrow="More work"
            title="Related projects."
            action={
              <Button to={routes.work} variant="secondary" size="md">
                View all work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />
          <motion.div
            variants={v.stagger(0.07)}
            {...revealOnce}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {related.map((item) => (
              <WorkCard key={item.slug} project={item} />
            ))}
          </motion.div>
        </Section>
      )}

      <FinalCTA
        title="Discuss a similar project."
        description="If something here is close to what you need, tell us about your situation and we will walk you through how we would approach it."
        primaryLabel="Discuss a Similar Project"
        location={`project_${project.slug}`}
      />
    </>
  )
}

export default ProjectDetail
