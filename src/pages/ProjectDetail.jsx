import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Lock, ExternalLink, Info } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import ProjectVisual from '../components/ui/ProjectVisual'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import {
  getProject,
  getRelatedProjects,
  projectMeta,
  REPO_POLICY_NOTE,
} from '../data/projects'
import { getService } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * Reusable case-study / concept page. (Spec §7.3, §21)
 *
 * One component renders every Work item. Sections appear only when the project
 * carries that content, so a lightly documented project degrades gracefully
 * instead of rendering empty headings.
 */
const ProjectDetail = () => {
  const { slug } = useParams()
  const project = getProject(slug)

  usePageMeta({
    title: project ? `${project.title} | Gen Clover Work` : undefined,
    description: project?.summary,
    path: project ? `${routes.work}/${project.slug}` : undefined,
    image: project?.heroImage ?? undefined,
  })

  const v = useMotionVariants()

  if (!project) return <Navigate to={routes.work} replace />

  const { status, industry, category } = projectMeta(project)
  const primaryService = getService(project.primaryService)
  const additionalServices = (project.additionalServices ?? []).map(getService).filter(Boolean)
  const related = getRelatedProjects(project)
  const isConcept = project.status === 'concept'
  const isConfidential = project.status === 'confidential'

  const metaRows = [
    { label: 'Status', value: status.publicLabel },
    { label: 'Industry', value: industry?.label },
    { label: 'Project type', value: category?.label },
    { label: 'Primary service', value: primaryService?.title, to: primaryService && `${routes.services}/${primaryService.slug}` },
    { label: 'Client', value: project.clientName ?? undefined },
  ].filter((row) => row.value)

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <header className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container relative pb-14 pt-32 md:pt-40">
          <Link
            to={routes.work}
            className="-my-1.5 inline-flex items-center gap-2 py-1.5 text-sm text-silver-500 transition-colors hover:text-accent-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All work
          </Link>

          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.08)}>
            <motion.div variants={v.fadeUp} className="mt-7">
              <StatusBadge status={project.status} />
            </motion.div>

            <motion.h1
              variants={v.fadeUp}
              className="mt-5 max-w-3xl text-4xl leading-[1.08] md:text-5xl"
            >
              {project.title}
            </motion.h1>

            <motion.p
              variants={v.fadeUp}
              className="mt-6 max-w-prose text-lg leading-relaxed text-silver-400"
            >
              {project.summary}
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Concept disclosure — stated plainly, not buried. (Spec §1.2, §7.2) */}
      {isConcept && (
        <div className="border-b border-accent-900/50 bg-accent-950/30">
          <div className="container flex items-start gap-3 py-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-silver-300">
              <span className="font-medium text-silver-100">This is a Gen Clover Concept.</span>{' '}
              It is a demonstration project created to show the type of work we deliver. It is not
              a completed client engagement, and the organisation described is not a Gen Clover
              client.
            </p>
          </div>
        </div>
      )}

      {/* Confidential disclosure — says why no client is named. (Spec §7.2) */}
      {isConfidential && (
        <div className="border-b border-ink-800 bg-ink-900">
          <div className="container flex items-start gap-3 py-4">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-silver-400" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-silver-300">
              <span className="font-medium text-silver-100">
                This is delivered client work.
              </span>{' '}
              The client is not named and identifying details have been removed at their
              request. Everything described here is a property of the system as built, not an
              estimate.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------- visual + metadata */}
      <Section className="!pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <motion.div variants={v.fadeUp} {...revealOnce}>
            <ProjectVisual project={project} priority aspect="aspect-[16/9]" />
          </motion.div>

          <motion.dl
            variants={v.fadeUp}
            {...revealOnce}
            className="h-fit divide-y divide-ink-800 rounded-xl border border-ink-800 bg-ink-900"
          >
            {metaRows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 px-5 py-4">
                <dt className="font-display text-[11px] uppercase tracking-brand text-silver-500">
                  {row.label}
                </dt>
                <dd className="text-right text-sm font-medium text-silver-200">
                  {row.to ? (
                    <Link
                      to={row.to}
                      className="-my-1 inline-block py-1 transition-colors hover:text-accent-400"
                    >
                      {row.value}
                    </Link>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}

            {project.scope && (
              <div className="px-5 py-4">
                <dt className="font-display text-[11px] uppercase tracking-brand text-silver-500">
                  Scope
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-silver-300">{project.scope}</dd>
              </div>
            )}

            <div className="px-5 py-4">
              <dt className="font-display text-[11px] uppercase tracking-brand text-silver-500">
                Links
              </dt>
              <dd className="mt-2.5 space-y-2 text-sm">
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
              </dd>
            </div>
          </motion.dl>
        </div>
      </Section>

      {/* ------------------------------------------- challenge / approach */}
      <Section muted>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-14">
          {[
            { title: 'The challenge', body: project.challenge },
            { title: 'Our approach', body: project.approach },
            { title: 'The solution', body: project.solution },
          ]
            .filter((block) => block.body)
            .map((block, i) => (
              <motion.div key={block.title} variants={v.fadeUp} {...revealOnce}>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px w-6 bg-accent-600" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-silver-100">{block.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-silver-400">{block.body}</p>
              </motion.div>
            ))}
        </div>
      </Section>

      {/* --------------------------------- capabilities / tech / outcomes */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            {project.features?.length > 0 && (
              <>
                <SectionHeader eyebrow="Key capabilities" title="What it does." className="mb-8" />
                <motion.ul variants={v.stagger(0.04)} {...revealOnce} className="space-y-3">
                  {project.features.map((feature) => (
                    <motion.li
                      key={feature}
                      variants={v.fadeUp}
                      className="flex items-start gap-3.5 rounded-lg border border-ink-800 bg-ink-900 px-5 py-4"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed text-silver-300">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </>
            )}
          </div>

          <div className="space-y-10">
            {project.technologies?.length > 0 && (
              <div>
                <p className="eyebrow">Technology</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs text-silver-300"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.capabilities?.length > 0 && (
              <div>
                <p className="eyebrow">Services applied</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {[primaryService, ...additionalServices].filter(Boolean).map((service) => (
                    <li key={service.slug}>
                      <Link
                        to={`${routes.services}/${service.slug}`}
                        className="inline-block rounded-md border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs text-silver-300 transition-colors hover:border-accent-700/60 hover:text-silver-100"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {project.capabilities.map((cap) => (
                    <li key={cap} className="px-1 text-[11px] text-silver-500">
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.outcomes?.length > 0 && (
              <div className="rounded-xl border border-ink-800 bg-ink-900 p-6">
                <p className="eyebrow">Outcome</p>
                <ul className="mt-4 space-y-3">
                  {project.outcomes.map((outcome) => (
                    <li key={outcome} className="text-sm leading-relaxed text-silver-300">
                      {outcome}
                    </li>
                  ))}
                </ul>
                {isConcept && (
                  <p className="mt-5 border-t border-ink-800 pt-4 text-xs leading-relaxed text-silver-500">
                    Conceptual outcomes describe what the design is intended to achieve. They are
                    not measured results from a delivered engagement.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- related */}
      {related.length > 0 && (
        <Section muted>
          <SectionHeader
            eyebrow="More work"
            title="Related projects."
            action={
              <Button to={routes.work} variant="secondary" size="md">
                All work
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
