import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, AlertCircle, Check } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { services, PRICING_STATEMENT } from '../data/services'
import { getServiceDetail } from '../data/serviceDetails'
import { routes } from '../data/site'
import { processSteps } from '../data/process'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'
import { trackEvent, events } from '../lib/analytics'
import { previewFirstTap, canHover, isKeyboardFocus } from '../lib/pointer'

/**
 * Services hub. (Spec §6)
 *
 * First screen, sized to fit a laptop viewport at 80–100% zoom:
 *   left  — the heading and a compact grid of service tiles;
 *   right — a translucent preview panel that shows whichever tile is hovered
 *           or focused (overview, the problems it solves, what changes, the
 *           approach), in the same glass style as the header menus.
 * Clicking a tile opens the full service page. On small screens the panel is
 * hidden and the tiles are simple links.
 */

const ServicePreview = ({ service }) => {
  const detail = getServiceDetail(service.slug)
  const Icon = service.icon

  return (
    <motion.div
      key={service.slug}
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent-700/70 bg-accent-950/50">
          <Icon className="h-5 w-5 text-accent-400" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">{service.title}</p>
          <h2 className="mt-1 text-xl font-semibold leading-snug text-silver-100">
            {service.heroHeadline}
          </h2>
        </div>
      </div>

      {detail?.intro && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-silver-300">{detail.intro[0]}</p>
      )}

      <div className="mt-4 grid gap-5 xl:grid-cols-2">
        {detail?.signals && (
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-brand text-silver-500">
              Sound familiar?
            </p>
            <ul className="mt-2 space-y-1.5">
              {detail.signals.map((sig) => (
                <li key={sig} className="flex items-start gap-2.5 text-[13px] leading-snug text-silver-300">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                  {sig}
                </li>
              ))}
            </ul>
          </div>
        )}
        {detail?.outcomes && (
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-brand text-silver-500">
              What changes
            </p>
            <ul className="mt-2 space-y-1.5">
              {detail.outcomes.map((o) => (
                <li key={o.title} className="flex items-start gap-2.5 text-[13px] leading-snug text-silver-300">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-silver-100">{o.title}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {detail?.approach && (
        <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 xl:grid-cols-4">
          {detail.approach.map((step, i) => (
            <li key={step.title} className="border-t border-accent-800/70 pt-2.5">
              <span className="font-display text-[10px] font-semibold tracking-brand text-accent-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-1 text-xs font-medium leading-snug text-silver-200">{step.title}</p>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-auto flex items-center gap-3 pt-4">
        <Button to={`${routes.services}/${service.slug}`} size="sm">
          See full details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button to={routes.startProject} size="sm" variant="ghost">
          {service.ctaLabel}
        </Button>
      </div>
    </motion.div>
  )
}

const Services = () => {
  usePageMeta(pageMeta.services)
  const v = useMotionVariants()
  const [active, setActive] = useState(services[0].slug)
  const activeService = services.find((s) => s.slug === active) ?? services[0]

  return (
    <>
      {/* ------------------------------------------ screen 1: tiles + preview */}
      <section className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-accent-900/25 blur-[150px]"
          aria-hidden="true"
        />

        <div className="container relative grid gap-10 pb-12 pt-28 lg:h-[100svh] lg:max-h-[62rem] lg:min-h-[36rem] lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:pb-6 lg:pt-[5.5rem]">
          {/* part a */}
          <div className="flex flex-col justify-center">
            <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)}>
              <motion.p variants={v.fadeUp} className="eyebrow">
                Services
              </motion.p>
              <motion.h1
                variants={v.fadeUp}
                className="mt-3 text-4xl leading-[1.05] tracking-tight xl:text-5xl"
              >
                What we build.
              </motion.h1>
              <motion.p
                variants={v.fadeUp}
                className="mt-3 max-w-xl text-base leading-relaxed text-silver-400"
              >
                From websites to AI, data and the infrastructure that runs them. Hover or tap a
                service to preview it, and open it for the full picture.
              </motion.p>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={v.stagger(0.04, 0.2)}
              className="mt-6 grid gap-2 sm:grid-cols-2"
            >
              {services.map((service) => {
                const Icon = service.icon
                const selected = service.slug === active
                return (
                  <motion.li key={service.slug} variants={v.fadeUp}>
                    <Link
                      to={`${routes.services}/${service.slug}`}
                      onMouseEnter={() => canHover() && setActive(service.slug)}
                      onFocus={(e) => isKeyboardFocus(e) && setActive(service.slug)}
                      onClick={(e) => {
                        previewFirstTap(selected, () => setActive(service.slug))(e)
                        if (!e.defaultPrevented)
                          trackEvent(events.SERVICE_CTA_CLICK, {
                            service: service.slug,
                            location: 'services_hub',
                          })
                      }}
                      className={`group relative flex items-center gap-3.5 rounded-xl border px-4 py-2.5 transition-colors ${
                        selected
                          ? 'border-accent-700/70 bg-accent-950/35'
                          : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors ${
                          selected ? 'border-accent-700 bg-accent-950/60' : 'border-ink-700 bg-ink-900'
                        }`}
                      >
                        <Icon className="h-4 w-4 text-accent-500" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-silver-100">
                        {service.title}
                      </span>
                      <ArrowUpRight
                        className={`h-4 w-4 shrink-0 transition-all ${
                          selected ? 'text-accent-400' : 'text-silver-600'
                        } group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button to={routes.startProject} size="md">
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to={routes.work} size="md" variant="secondary">
                View Our Work
              </Button>
            </div>
          </div>

          {/* part b — preview of the hovered service (large screens only) */}
          <div className="hidden min-h-0 lg:flex lg:items-center">
            <div
              className="relative max-h-full w-full overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900/60 p-6 shadow-lift backdrop-blur-xl"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <ServicePreview key={activeService.slug} service={activeService} />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery process, shared across every service */}
      <Section muted>
        <SectionHeader
          eyebrow="Delivery"
          title="The same process behind every service."
          description="Whichever service a project starts in, it runs through the same stages."
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

      <FinalCTA
        title="Not sure which service you need?"
        description="Most projects draw on more than one. Describe the problem in your own words and we will put the right combination together."
        location="services_hub"
      />
    </>
  )
}

export default Services
