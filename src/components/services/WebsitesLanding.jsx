import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Check } from 'lucide-react'
import Button from '../ui/Button'
import FinalCTA from '../home/FinalCTA'
import { TemplateGrid, RedesignCallout, demoLink, useTemplatesAnchor } from '../templates/TemplateGallery'
import { PRICING_STATEMENT } from '../../data/services'
import { websiteTemplates, getTemplate } from '../../data/templates'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/**
 * A service page led by its templates: /services/websites (all of them) and
 * /services/ecommerce (the shop templates). (Templates)
 *
 * Screen one is the gallery, so the first thing a visitor sees is what we can
 * build. Screen two condenses the rest of the service (the problems we solve,
 * how we work, what is included, pricing, tools) into one view, from the same
 * services.js and serviceDetails.js records the other service pages use.
 */

const Panel = ({ title, children, className = '' }) => {
  const v = useMotionVariants()
  return (
    <motion.div variants={v.fadeUp} className={`surface surface-static flex flex-col p-5 ${className}`}>
      <h3 className="font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">{title}</h3>
      <div className="mt-3.5 flex-1">{children}</div>
    </motion.div>
  )
}

const WebsitesLanding = ({ service, detail, relatedIndustries }) => {
  const v = useMotionVariants()
  useTemplatesAnchor()
  const Icon = service.icon
  const templates = Array.isArray(service.templates) ? service.templates.map(getTemplate).filter(Boolean) : websiteTemplates

  return (
    <>
      {/* ------------------------------------------- screen one: templates */}
      <section id="templates" className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950 scroll-mt-16">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-accent-900/20 blur-[130px]"
          aria-hidden="true"
        />
        <div className="container relative pb-12 pt-24 md:pt-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={v.stagger(0.07)}
            className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <motion.div variants={v.fadeUp} className="flex items-center gap-3 text-sm">
                <Link to={routes.services} className="-my-3 inline-flex min-h-[44px] items-center text-silver-500 transition-colors hover:text-accent-400">
                  Services
                </Link>
                <span className="text-silver-600" aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-2 text-silver-300">
                  <Icon className="h-4 w-4 text-accent-500" aria-hidden="true" />
                  {service.title}
                </span>
              </motion.div>
              <motion.h1 variants={v.riseIn} className="mt-3 text-3xl leading-[1.1] tracking-tight md:text-4xl lg:text-[2.6rem]">
                {service.heroHeadline}
              </motion.h1>
              <motion.p variants={v.fadeUp} className="mt-3 max-w-2xl text-base leading-relaxed text-silver-400">
                Start from one of our templates and open it live, or let us redesign the site you already have. Either
                way, you see a demo with your own business in it before you commit.
              </motion.p>
            </div>
            <motion.div variants={v.fadeUp} className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button to={demoLink()} size="md" onClick={() => trackEvent(events.DEMO_CTA, { location: `${service.slug}_hero` })}>
                Book a demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                to={routes.startProject}
                size="md"
                variant="secondary"
                onClick={() => trackEvent(events.SERVICE_CTA_CLICK, { service: service.slug, location: 'service_hero' })}
              >
                Start a project
              </Button>
            </motion.div>
          </motion.div>

          <TemplateGrid templates={templates} />
          <RedesignCallout className="mt-6" />
        </div>
      </section>

      {/* ------------------------------------ screen two: the service at a glance */}
      <section className="bg-ink-900 py-14 lg:flex lg:min-h-[calc(100vh-4rem)] lg:items-center lg:py-8">
        <div className="container w-full">
          <motion.div variants={v.fadeUp} {...revealOnce} className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="shrink-0">
              <p className="eyebrow">At a glance</p>
              <h2 className="mt-2 text-2xl leading-tight md:text-3xl">{service.glanceTitle ?? `How we build ${service.title.toLowerCase()}.`}</h2>
            </div>
            {detail?.intro && <p className="max-w-2xl text-sm leading-relaxed text-silver-400">{detail.intro[1]}</p>}
          </motion.div>

          <motion.div variants={v.stagger(0.05)} {...revealOnce} className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
            {detail?.signals && (
              <Panel title="Sound familiar?">
                <ul className="space-y-2">
                  {detail.signals.map((signal) => (
                    <li key={signal} className="flex items-start gap-2 text-[13px] leading-snug text-silver-200">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                      {signal}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-ink-800 pt-3 text-[13px] font-medium text-silver-100">That is exactly where we come in.</p>
              </Panel>
            )}

            <Panel title="What it covers">
              <ul className="space-y-2">
                {service.capabilities.map((cap) => (
                  <li key={cap.label}>
                    <p className="text-[13px] font-medium leading-snug text-silver-100">{cap.label}</p>
                    <p className="line-clamp-1 text-xs leading-snug text-silver-500">{cap.description}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            {detail?.approach && (
              <Panel title="How we approach it">
                <ol className="space-y-2">
                  {detail.approach.map((step, i) => (
                    <li key={step.title} className="flex gap-2.5">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent-700 font-display text-[10px] font-semibold text-accent-300">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block text-[13px] font-medium leading-snug text-silver-100">{step.title}</span>
                        <span className="line-clamp-2 text-xs leading-snug text-silver-500">{step.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Panel>
            )}

            {detail?.outcomes && (
              <Panel title="What is different afterward">
                <ul className="space-y-2">
                  {detail.outcomes.map((o) => (
                    <li key={o.title} className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                      <span>
                        <span className="block text-[13px] font-medium leading-snug text-silver-100">{o.title}</span>
                        <span className="line-clamp-2 text-xs leading-snug text-silver-500">{o.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            <Panel title="Deliverables" className="md:col-span-2">
              <ul className="flex flex-wrap gap-1.5">
                {service.deliverables.map((item) => (
                  <li key={item} className="rounded border border-ink-700 bg-ink-950 px-2 py-1 text-xs text-silver-300">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Pricing">
              <p className="text-[13px] leading-relaxed text-silver-300">{PRICING_STATEMENT}</p>
              <Button
                to={routes.startProject}
                size="sm"
                className="mt-3"
                onClick={() => trackEvent(events.SERVICE_CTA_CLICK, { service: service.slug, location: 'service_pricing' })}
              >
                {service.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Panel>

            <Panel title="Under the hood">
              <p className="text-[13px] leading-relaxed text-silver-200">
                The best technology is the kind you never have to think about.
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-silver-500">
                Code, hosting, speed, security, search: we choose the best of everything and look after it, so all
                you ever notice is that it works.
              </p>
              {relatedIndustries.length > 0 && (
                <>
                  <p className="mt-3 text-[11px] font-medium text-silver-500">Often used in</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {relatedIndustries.map((industry) => (
                      <li key={industry.id}>
                        <Link
                          to={`${routes.industries}/${industry.id}`}
                          className="inline-flex min-h-[28px] items-center rounded border border-ink-700 bg-ink-950 px-2 text-[11px] text-silver-400 transition-colors hover:border-accent-700/60 hover:text-silver-200"
                        >
                          {industry.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Panel>
          </motion.div>
        </div>
      </section>

      <FinalCTA
        title={service.closingTitle}
        description="Describe where things stand today and what you want to change. We will reply with a considered first view, not a sales deck."
        primaryLabel={service.ctaLabel}
        location={`service_${service.slug}`}
      />
    </>
  )
}

export default WebsitesLanding
