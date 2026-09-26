import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Lock, ExternalLink } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
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
import {
  FlowStrip,
  StatRow,
  AtAGlance,
  PointsSection,
  BeforeAfter,
  ArchitectureFlow,
  Walkthrough,
  ComponentList,
  Roadmap,
  TechStack,
  ClosingStatement,
} from '../components/work/CaseStudySections'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * Reusable case-study page. (Spec §7.3, §21)
 *
 * One component renders every Work item. Sections appear only when the project
 * carries that content, so a lightly documented project degrades gracefully
 * instead of rendering empty headings.
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
  const additionalServices = (project.additionalServices ?? []).map(getService).filter(Boolean)
  const related = getRelatedProjects(project)
  const cs = project.caseStudy

  const metaRows = [
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
        <div className="container relative pb-12 pt-28 md:pt-32">
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

            {(cs?.role || cs?.builtOn) && (
              <motion.dl
                variants={v.fadeUp}
                className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink-800 pt-6"
              >
                {cs.role && (
                  <div>
                    <dt className="font-display text-[11px] uppercase tracking-eyebrow text-silver-500">
                      Role
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium text-silver-200">{cs.role}</dd>
                  </div>
                )}
                {cs.builtOn && (
                  <div>
                    <dt className="font-display text-[11px] uppercase tracking-eyebrow text-silver-500">
                      Built on
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium text-silver-200">{cs.builtOn}</dd>
                  </div>
                )}
              </motion.dl>
            )}
          </motion.div>
        </div>
      </header>

      {/* The delivery loop, animated — 01 through to hand-off */}
      <FlowStrip flow={cs?.flow} />

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

      {/* ---------------------------------------------- deep case study */}
      {cs?.stats?.length > 0 && (
        <Section className="!pt-0">
          <StatRow stats={cs.stats} />
        </Section>
      )}

      <AtAGlance data={cs?.atAGlance} />

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

      {/* Deep-dive sections. Each renders only if the project carries it. */}
      <PointsSection
        eyebrow="The challenge"
        title={cs?.challengeDetail?.headline}
        description={cs?.challengeDetail?.intro}
        points={cs?.challengeDetail?.points}
        footnote={cs?.challengeDetail?.footnote}
      />

      <BeforeAfter data={cs?.beforeAfter} />

      <PointsSection
        eyebrow="The approach"
        title={cs?.approachDetail?.headline}
        description={cs?.approachDetail?.intro}
        points={cs?.approachDetail?.points}
        icon="check"
        muted
      />

      <ArchitectureFlow data={cs?.architecture} />

      <Walkthrough data={cs?.walkthrough} />

      <ComponentList data={cs?.components} />

      <PointsSection
        eyebrow={cs?.safeguards?.eyebrow ?? 'Safeguards'}
        title={cs?.safeguards?.headline}
        description={cs?.safeguards?.intro}
        points={cs?.safeguards?.points}
        icon="shield"
        columns={2}
        muted
      />

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
                      className="tile flex items-start gap-3.5 rounded-lg border border-ink-800 bg-ink-900 px-5 py-4"
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
              </div>
            )}
          </div>
        </div>
      </Section>

      <TechStack data={cs?.techStack} />

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
