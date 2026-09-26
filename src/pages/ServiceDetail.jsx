import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import Faq from '../components/ui/Faq'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { getService, PRICING_STATEMENT } from '../data/services'
import { getServiceDetail } from '../data/serviceDetails'
import { getProjectsByService } from '../data/projects'
import { getIndustryPage } from '../data/industries'
import { routes } from '../data/site'
import { usePageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'
import { trackEvent, events } from '../lib/analytics'

/**
 * One component serves every service page. (Spec §6, §21)
 *
 * Short records (title, capabilities, deliverables, SEO) come from
 * services.js; the long-form content (intro, signals, approach, outcomes,
 * stack, FAQs) from serviceDetails.js. Related work is derived from
 * projects.js, so a project naming this service shows up automatically.
 */
const ServiceDetail = () => {
  const { slug } = useParams()
  const service = getService(slug)
  const detail = service ? getServiceDetail(service.slug) : null

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

  const Icon = service.icon
  const relatedWork = getProjectsByService(service.slug).slice(0, 3)
  const relatedIndustries = (service.relatedIndustries ?? []).map(getIndustryPage).filter(Boolean)
  // Bento grid: the first capability is 2x2 on large screens. Stretch the last
  // one so the final row never ends with an empty cell.
  const LAST_SPAN = { 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4' }
  const leftover = (4 + service.capabilities.length - 1) % 4
  const lastSpan = leftover ? LAST_SPAN[4 - leftover + 1] ?? '' : ''
  const cta = (location) => () =>
    trackEvent(events.SERVICE_CTA_CLICK, { service: service.slug, location })

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-20 h-[36rem] w-[36rem] rounded-full bg-accent-900/20 blur-[140px]"
          aria-hidden="true"
        />
        <div className="container relative grid gap-12 pb-12 pt-28 md:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:pb-16">
          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.08)}>
            <motion.div variants={v.fadeUp} className="flex items-center gap-3">
              <Link
                to={routes.services}
                className="text-sm text-silver-500 transition-colors hover:text-accent-400"
              >
                Services
              </Link>
              <span className="text-silver-700" aria-hidden="true">/</span>
              <span className="inline-flex items-center gap-2 text-sm text-silver-300">
                <Icon className="h-4 w-4 text-accent-500" aria-hidden="true" />
                {service.title}
              </span>
            </motion.div>
            <motion.h1
              variants={v.fadeUp}
              className="mt-7 text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
            >
              {service.heroHeadline}
            </motion.h1>
            <motion.p
              variants={v.fadeUp}
              className="mt-6 max-w-prose text-lg leading-relaxed text-silver-400"
            >
              {service.heroDescription}
            </motion.p>
            <motion.div variants={v.fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to={routes.startProject} size="lg" onClick={cta('service_hero')}>
                {service.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              {service.secondaryCta && (
                <Button to={service.secondaryCta.to} size="lg" variant="secondary">
                  {service.secondaryCta.label}
                </Button>
              )}
            </motion.div>
          </motion.div>

          {detail?.signals && (
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl border border-ink-700 bg-ink-900/80 p-7 backdrop-blur-sm md:p-8"
              aria-label="Sound familiar?"
            >
              <p className="eyebrow">Sound familiar?</p>
              <ul className="mt-6 space-y-4">
                {detail.signals.map((signal, i) => (
                  <motion.li
                    key={signal}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.12, duration: 0.4 }}
                    className="flex items-start gap-3.5 text-[15px] leading-relaxed text-silver-200"
                  >
                    <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                    {signal}
                  </motion.li>
                ))}
              </ul>
              <p className="mt-7 border-t border-ink-800 pt-5 text-sm text-silver-400">
                That is exactly where we come in.
              </p>
            </motion.aside>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------- overview */}
      {detail?.intro && (
        <Section>
          <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
            <motion.div variants={v.fadeUp} {...revealOnce}>
              <p className="eyebrow">Overview</p>
              <h2 className="mt-4 text-3xl leading-tight md:text-4xl">The short version.</h2>
            </motion.div>
            <motion.div
              variants={v.fadeUp}
              {...revealOnce}
              className="grid gap-6 text-lg leading-relaxed text-silver-300 md:grid-cols-2 md:gap-10"
            >
              {detail.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </motion.div>
          </div>
        </Section>
      )}

      {/* ------------------------------------------------ capabilities bento */}
      <Section muted>
        <SectionHeader
          eyebrow="Capabilities"
          title="What this covers."
          description={`The pieces that make up ${service.title}. Most projects draw on several of them.`}
        />
        <motion.ul
          variants={v.stagger(0.04)}
          {...revealOnce}
          className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {service.capabilities.map((cap, i) => (
            <motion.li
              key={cap.label}
              variants={v.fadeUp}
              className={`surface flex flex-col justify-between p-6 ${
                i === 0 ? 'sm:col-span-2 lg:row-span-2 lg:p-8' : ''
              } ${i > 0 && i === service.capabilities.length - 1 ? lastSpan : ''}`}
            >
              <span className="font-display text-xs font-semibold tracking-brand text-accent-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="mt-6">
                <h3 className={`font-semibold text-silver-100 ${i === 0 ? 'text-2xl' : 'text-base'}`}>
                  {cap.label}
                </h3>
                <p className={`mt-2 leading-relaxed text-silver-400 ${i === 0 ? 'text-base' : 'text-sm'}`}>
                  {cap.description}
                </p>
              </div>
              {i === 0 && (
                <Icon className="mt-8 h-10 w-10 text-accent-600/70" aria-hidden="true" />
              )}
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* ---------------------------------------------------------- approach */}
      {detail?.approach && (
        <Section>
          <SectionHeader
            eyebrow="How we approach it"
            title="From first conversation to working system."
          />
          <motion.ol
            variants={v.stagger(0.12)}
            {...revealOnce}
            className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {/* Connecting line behind the step markers on large screens */}
            <motion.span
              className="absolute left-0 right-0 top-5 hidden h-px origin-left bg-gradient-to-r from-accent-600 via-accent-800 to-transparent lg:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            />
            {detail.approach.map((step, i) => (
              <motion.li key={step.title} variants={v.fadeUp} className="relative">
                <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-accent-600 bg-ink-950 font-display text-xs font-semibold text-accent-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-silver-100">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{step.text}</p>
              </motion.li>
            ))}
          </motion.ol>
        </Section>
      )}

      {/* ------------------------------------ outcomes + deliverables/pricing */}
      <Section muted>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            {detail?.outcomes && (
              <>
                <SectionHeader eyebrow="Outcomes" title="What is different afterward." className="mb-8" />
                <motion.ul
                  variants={v.stagger(0.06)}
                  {...revealOnce}
                  className="grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2"
                >
                  {detail.outcomes.map((o) => (
                    <motion.li key={o.title} variants={v.fadeUp} className="bg-ink-950 p-7">
                      <Check className="h-5 w-5 text-accent-500" aria-hidden="true" />
                      <h3 className="mt-4 text-lg font-semibold text-silver-100">{o.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-silver-400">{o.text}</p>
                    </motion.li>
                  ))}
                </motion.ul>
              </>
            )}

            <div className="mt-12">
              <p className="eyebrow">Deliverables</p>
              <motion.ul
                variants={v.stagger(0.03)}
                {...revealOnce}
                className="mt-5 grid gap-2.5 sm:grid-cols-2"
              >
                {service.deliverables.map((item) => (
                  <motion.li
                    key={item}
                    variants={v.fadeUp}
                    className="tile flex items-start gap-3 rounded-lg border border-ink-800 bg-ink-950 px-4 py-3 text-sm text-silver-300"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>

          <motion.aside
            variants={v.fadeUp}
            {...revealOnce}
            className="surface surface-static h-fit p-7 lg:sticky lg:top-28"
          >
            <p className="eyebrow">Pricing</p>
            <p className="mt-4 text-sm leading-relaxed text-silver-300">{PRICING_STATEMENT}</p>
            <Button
              to={routes.startProject}
              size="md"
              className="mt-6 w-full"
              onClick={cta('service_pricing')}
            >
              {service.ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>

            {detail?.stack && (
              <div className="mt-8 border-t border-ink-800 pt-6">
                <p className="eyebrow">Tools we use</p>
                <dl className="mt-4 space-y-4">
                  {detail.stack.map((group) => (
                    <div key={group.title}>
                      <dt className="text-xs font-medium text-silver-500">{group.title}</dt>
                      <dd className="mt-1.5 flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[11px] text-silver-300"
                          >
                            {item}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

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
            {relatedWork.map((project) => (
              <WorkCard key={project.slug} project={project} />
            ))}
          </motion.div>
        </Section>
      )}

      {/* --------------------------------------------------------------- FAQ */}
      {detail?.faqs && (
        <Section muted={relatedWork.length > 0}>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader
              eyebrow="Questions"
              title={`About ${service.title}.`}
              description="The questions we hear most often before a project starts."
              className="!mb-0"
            />
            <motion.div variants={v.fadeUp} {...revealOnce}>
              <Faq items={detail.faqs} />
            </motion.div>
          </div>
        </Section>
      )}

      <FinalCTA
        title={service.closingTitle}
        primaryLabel={service.ctaLabel}
        location={`service_${service.slug}`}
      />
    </>
  )
}

export default ServiceDetail
