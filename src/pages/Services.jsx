import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { services, PRICING_STATEMENT } from '../data/services'
import { routes } from '../data/site'
import { processSteps } from '../data/process'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'
import { trackEvent, events } from '../lib/analytics'

/**
 * Services hub — the eight primary service domains. (Spec §6)
 * Everything renders from data/services.js, so adding a ninth service is a data
 * change, not a layout change.
 */
const Services = () => {
  usePageMeta(pageMeta.services)
  const v = useMotionVariants()

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build."
        description="Eight services, from websites to AI, data and the infrastructure that runs them. Most projects draw on more than one."
      >
        <Button to={routes.startProject} size="lg">
          Start a Project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button to={routes.work} size="lg" variant="secondary">
          View Our Work
        </Button>
      </PageHero>

      <Section>
        <motion.ul variants={v.stagger(0.06)} {...revealOnce} className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.li key={service.slug} variants={v.fadeUp}>
                <Link
                  to={`${routes.services}/${service.slug}`}
                  className="surface surface-hover group flex h-full flex-col p-7 md:p-8"
                  onClick={() =>
                    trackEvent(events.SERVICE_CTA_CLICK, {
                      service: service.slug,
                      location: 'services_hub',
                    })
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-900 transition-colors group-hover:border-accent-700/60">
                        <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
                      </span>
                      <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-silver-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-silver-100">{service.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-silver-400">
                    {service.shortDescription}
                  </p>

                  {/* Every capability is named. No "+N more" counter - the point
                      is what we do, not how many boxes it fills. */}
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {service.capabilities.map((cap) => (
                      <li
                        key={cap.label}
                        className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[11px] text-silver-400"
                      >
                        {cap.label}
                      </li>
                    ))}
                  </ul>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </Section>

      {/* Delivery process, shared across every service */}
      <Section muted>
        <SectionHeader
          eyebrow="Delivery"
          title="The same process behind every service."
          description="Whichever service a project starts in, it runs through the same seven stages."
          action={
            <Button to={routes.howWeWork} variant="secondary" size="md">
              How we work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
        <motion.ol
          variants={v.stagger(0.04)}
          {...revealOnce}
          className="flex flex-wrap items-center gap-x-3 gap-y-3"
        >
          {processSteps.map((step, i) => (
            <motion.li key={step.number} variants={v.fadeUp} className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-850 px-3.5 py-2">
                <span className="font-display text-[11px] font-semibold tracking-brand text-silver-600">
                  {step.number}
                </span>
                <span className="text-sm font-medium text-silver-200">{step.title}</span>
              </span>
              {i < processSteps.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-silver-600" aria-hidden="true" />
              )}
            </motion.li>
          ))}
        </motion.ol>

        <motion.p
          variants={v.fadeUp}
          {...revealOnce}
          className="mt-10 max-w-prose rounded-xl border border-ink-800 bg-ink-950 p-6 text-sm leading-relaxed text-silver-400"
        >
          {PRICING_STATEMENT}
        </motion.p>
      </Section>

      <FinalCTA location="services_hub" />
    </>
  )
}

export default Services
