import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { getIndustryPage } from '../data/industries'
import { getProjectsByIndustry } from '../data/projects'
import { getService } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * Industry landing page. (Spec §13)
 * Relevant capabilities plus related concept work. No fabricated sector claims.
 */
const IndustryDetail = () => {
  const { slug } = useParams()
  const industry = getIndustryPage(slug)

  usePageMeta({
    title: industry ? `${industry.label} | Gen Clover` : undefined,
    description: industry?.description,
    path: industry ? `${routes.industries}/${industry.id}` : undefined,
  })

  const v = useMotionVariants()

  if (!industry) return <Navigate to={routes.industries} replace />

  const services = industry.services.map(getService).filter(Boolean)
  const projects = getProjectsByIndustry(industry.id)

  return (
    <>
      <header className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-900/20 blur-[110px]"
          aria-hidden="true"
        />
        <div className="container relative pb-16 pt-32 md:pb-20 md:pt-40">
          <Link
            to={routes.industries}
            className="-my-1.5 inline-flex items-center gap-2 py-1.5 text-sm text-silver-500 transition-colors hover:text-accent-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All industries
          </Link>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={v.stagger(0.08)}
            className="max-w-3xl"
          >
            <motion.p variants={v.fadeUp} className="eyebrow mt-7">
              {industry.label}
            </motion.p>
            <motion.h1 variants={v.fadeUp} className="mt-5 text-4xl leading-[1.08] md:text-5xl">
              {industry.headline}
            </motion.h1>
            <motion.p
              variants={v.fadeUp}
              className="mt-6 max-w-prose text-lg leading-relaxed text-silver-400"
            >
              {industry.description}
            </motion.p>
            <motion.div variants={v.fadeUp} className="mt-9">
              <Button to={routes.startProject} size="lg">
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader eyebrow="Where we focus" title="What usually matters here." className="mb-8" />
            <motion.ul variants={v.stagger(0.05)} {...revealOnce} className="space-y-3">
              {industry.focusAreas.map((area) => (
                <motion.li
                  key={area}
                  variants={v.fadeUp}
                  className="flex items-start gap-3.5 rounded-lg border border-ink-800 bg-ink-900 px-5 py-4"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-silver-300">{area}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div>
            <SectionHeader eyebrow="Services" title="What we usually bring." className="mb-8" />
            <motion.ul variants={v.stagger(0.05)} {...revealOnce} className="space-y-3">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <motion.li key={service.slug} variants={v.fadeUp}>
                    <Link
                      to={`${routes.services}/${service.slug}`}
                      className="surface surface-hover flex items-start gap-4 p-5"
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold text-silver-100">
                          {service.title}
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-silver-400">
                          {service.shortDescription}
                        </span>
                      </span>
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>
          </div>
        </div>
      </Section>

      {projects.length > 0 ? (
        <Section muted>
          <SectionHeader
            eyebrow="Related work"
            title={`Work in ${industry.label.toLowerCase()}.`}
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
            {projects.map((project) => (
              <WorkCard key={project.slug} project={project} />
            ))}
          </motion.div>
        </Section>
      ) : (
        <Section muted>
          <div className="rounded-xl border border-dashed border-ink-700 bg-ink-950 px-6 py-14 text-center">
            <h2 className="text-lg font-semibold text-silver-200">
              No published work in this sector yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-silver-500">
              We have not published a {industry.label.toLowerCase()} project yet. The capabilities
              above are the ones we would bring to one.
            </p>
            <Button to={routes.work} variant="secondary" size="sm" className="mt-7">
              Browse all work
            </Button>
          </div>
        </Section>
      )}

      <FinalCTA
        title={`Building something in ${industry.label.toLowerCase()}?`}
        location={`industry_${industry.id}`}
      />
    </>
  )
}

export default IndustryDetail
