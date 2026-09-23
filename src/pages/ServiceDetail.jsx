import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { getService, PRICING_STATEMENT } from '../data/services'
import { getProjectsByService } from '../data/projects'
import { getIndustryPage } from '../data/industries'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'
import { trackEvent, events } from '../lib/analytics'

/**
 * One component serves all eight service pages. (Spec §6, §21)
 *
 * Related work is derived from projects.js rather than listed on the service,
 * so a project that names this service — as primary OR additional — shows up
 * here automatically.
 */
const ServiceDetail = () => {
  const { slug } = useParams()
  const service = getService(slug)

  // Renamed service routes keep working via legacySlugs. (Spec §25)
  const isLegacy = service && service.slug !== slug

  usePageMeta({
    title: service?.seo.title,
    description: service?.seo.description,
    path: service ? `${routes.services}/${service.slug}` : undefined,
  })

  const v = useMotionVariants()

  if (!service) return <Navigate to={routes.services} replace />
  if (isLegacy) return <Navigate to={`${routes.services}/${service.slug}`} replace />

  const relatedWork = getProjectsByService(service.slug).slice(0, 3)
  const relatedIndustries = (service.relatedIndustries ?? [])
    .map(getIndustryPage)
    .filter(Boolean)

  return (
    <>
      <PageHero
        eyebrow={service.title}
        title={service.heroHeadline}
        description={service.heroDescription}
      >
        <Button
          to={routes.startProject}
          size="lg"
          onClick={() =>
            trackEvent(events.SERVICE_CTA_CLICK, { service: service.slug, location: 'service_hero' })
          }
        >
          {service.ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        {service.secondaryCta && (
          <Button to={service.secondaryCta.to} size="lg" variant="secondary">
            {service.secondaryCta.label}
          </Button>
        )}
      </PageHero>

      {/* ---------------------------------------------------- capabilities */}
      <Section>
        <SectionHeader
          eyebrow="Capabilities"
          title="What this covers."
          description={`${service.capabilities.length} capabilities within ${service.title}. Most projects use several.`}
        />

        <motion.ul
          variants={v.stagger(0.04)}
          {...revealOnce}
          className="grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-3"
        >
          {service.capabilities.map((cap) => (
            <motion.li key={cap.label} variants={v.fadeUp} className="bg-ink-950 p-6">
              <h3 className="text-sm font-semibold text-silver-100">{cap.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{cap.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* ----------------------------------------- deliverables + pricing */}
      <Section muted>
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <SectionHeader
              eyebrow="Deliverables"
              title="What you receive."
              className="mb-8"
            />
            <motion.ul variants={v.stagger(0.03)} {...revealOnce} className="grid gap-2.5 sm:grid-cols-2">
              {service.deliverables.map((item) => (
                <motion.li
                  key={item}
                  variants={v.fadeUp}
                  className="flex items-start gap-3 rounded-lg border border-ink-800 bg-ink-950 px-4 py-3 text-sm text-silver-300"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.aside
            variants={v.fadeUp}
            {...revealOnce}
            className="surface h-fit p-7 lg:sticky lg:top-28"
          >
            <p className="eyebrow">Pricing</p>
            <p className="mt-4 text-sm leading-relaxed text-silver-300">{PRICING_STATEMENT}</p>

            <Button
              to={routes.startProject}
              size="md"
              className="mt-6 w-full"
              onClick={() =>
                trackEvent(events.SERVICE_CTA_CLICK, {
                  service: service.slug,
                  location: 'service_pricing',
                })
              }
            >
              {service.ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>

            {relatedIndustries.length > 0 && (
              <div className="mt-8 border-t border-ink-800 pt-6">
                <p className="eyebrow">Often used in</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {relatedIndustries.map((industry) => (
                    <li key={industry.id}>
                      <Link
                        to={`${routes.industries}/${industry.id}`}
                        className="inline-block rounded border border-ink-700 bg-ink-900 px-2.5 py-1 text-xs text-silver-400 transition-colors hover:border-accent-700/60 hover:text-silver-200"
                      >
                        {industry.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        </div>
      </Section>

      {/* ----------------------------------------------------- related work */}
      {relatedWork.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="Related Work"
            title="Work in this area."
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
            {relatedWork.map((project) => (
              <WorkCard key={project.slug} project={project} />
            ))}
          </motion.div>
        </Section>
      )}

      <FinalCTA
        title={`Have a ${service.title.toLowerCase()} project in mind?`}
        primaryLabel={service.ctaLabel}
        location={`service_${service.slug}`}
      />
    </>
  )
}

export default ServiceDetail
