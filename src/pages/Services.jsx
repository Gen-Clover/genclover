import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ArrowRight, ArrowUpRight, AlertCircle, X, Check } from 'lucide-react'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { services, PRICING_STATEMENT } from '../data/services'
import { getServiceDetail } from '../data/serviceDetails'
import { routes } from '../data/site'
import { processSteps } from '../data/process'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'
import { trackEvent, events } from '../lib/analytics'

/**
 * Services hub. (Spec §6)
 *
 * A grid of service tiles. Clicking a tile expands it in place into a large
 * panel (a shared-layout animation from the tile) with the essentials of that
 * service, and a link to its full page. The open service is kept in the URL
 * (?service=slug) so the view can be shared and survives the back button.
 */

const ServicePanel = ({ service, onClose }) => {
  const detail = getServiceDetail(service.slug)
  const Icon = service.icon
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        layoutId={`service-${service.slug}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`panel-${service.slug}`}
        className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-accent-800/60 bg-ink-900 shadow-2xl"
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="p-6 sm:p-9"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent-700 bg-accent-950/50">
                <Icon className="h-5 w-5 text-accent-400" aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow">{service.title}</p>
                <h2 id={`panel-${service.slug}`} className="mt-1.5 text-2xl font-semibold text-silver-100 md:text-3xl">
                  {service.heroHeadline}
                </h2>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-ink-700 text-silver-400 transition-colors hover:border-accent-600 hover:text-accent-400"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {detail?.intro && (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-silver-300">{detail.intro[0]}</p>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {detail?.signals && (
              <div className="rounded-xl border border-ink-800 bg-ink-950 p-6">
                <p className="eyebrow">Sound familiar?</p>
                <ul className="mt-4 space-y-3">
                  {detail.signals.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-silver-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detail?.outcomes && (
              <div className="rounded-xl border border-ink-800 bg-ink-950 p-6">
                <p className="eyebrow">What changes</p>
                <ul className="mt-4 space-y-3">
                  {detail.outcomes.map((o) => (
                    <li key={o.title} className="flex items-start gap-3 text-sm leading-relaxed text-silver-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                      <span>
                        <span className="font-medium text-silver-100">{o.title}.</span> {o.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {detail?.approach && (
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {detail.approach.map((step, i) => (
                <li key={step.title} className="border-t border-accent-800/70 pt-4">
                  <span className="font-display text-xs font-semibold tracking-brand text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-silver-100">{step.title}</p>
                </li>
              ))}
            </ol>
          )}

          <ul className="mt-8 flex flex-wrap gap-1.5">
            {service.capabilities.map((cap) => (
              <li
                key={cap.label}
                className="rounded border border-ink-700 bg-ink-950 px-2.5 py-1 text-xs text-silver-400"
              >
                {cap.label}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 border-t border-ink-800 pt-7 sm:flex-row">
            <Button
              to={`${routes.services}/${service.slug}`}
              size="lg"
              onClick={() =>
                trackEvent(events.SERVICE_CTA_CLICK, { service: service.slug, location: 'services_panel' })
              }
            >
              See full details
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to={routes.startProject} size="lg" variant="secondary">
              {service.ctaLabel}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

const Services = () => {
  usePageMeta(pageMeta.services)
  const v = useMotionVariants()
  const [params, setParams] = useSearchParams()
  const openSlug = params.get('service')
  const open = services.find((s) => s.slug === openSlug) ?? null
  const lastTile = useRef(null)

  const openService = (slug, el) => {
    lastTile.current = el
    const next = new URLSearchParams(params)
    next.set('service', slug)
    setParams(next, { replace: true })
  }
  const close = () => {
    const next = new URLSearchParams(params)
    next.delete('service')
    setParams(next, { replace: true })
    requestAnimationFrame(() => lastTile.current?.focus())
  }

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build."
        description="From websites to AI, data and the infrastructure that runs them. Pick a service to see what it covers, how we approach it and what changes for you."
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
        <h2 className="sr-only">All services</h2>
        <LayoutGroup>
          <motion.ul
            variants={v.stagger(0.05)}
            {...revealOnce}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((service, index) => {
              const Icon = service.icon
              const isOpen = open?.slug === service.slug
              return (
                <motion.li key={service.slug} variants={v.fadeUp} className="min-h-[17rem]">
                  {!isOpen && (
                    <motion.button
                      layoutId={`service-${service.slug}`}
                      type="button"
                      onClick={(e) => openService(service.slug, e.currentTarget)}
                      aria-haspopup="dialog"
                      className="surface group flex h-full w-full flex-col p-6 text-left"
                      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    >
                      <div className="flex w-full items-start justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-lg border border-ink-700 bg-ink-900 transition-colors group-hover:border-accent-700/60">
                          <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
                        </span>
                        <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-6 text-lg font-semibold text-silver-100">{service.title}</h3>
                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-silver-400">
                        {service.shortDescription}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-400">
                        Explore
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </motion.button>
                  )}
                </motion.li>
              )
            })}
          </motion.ul>

          <AnimatePresence>
            {open && <ServicePanel key={open.slug} service={open} onClose={close} />}
          </AnimatePresence>
        </LayoutGroup>
      </Section>

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

      <FinalCTA location="services_hub" />
    </>
  )
}

export default Services
