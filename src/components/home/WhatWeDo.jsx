import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import Button from '../ui/Button'
import { services } from '../../data/services'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/** 03 — What We Do. Introduces the eight service domains. (Spec §5.2, §6) */
const WhatWeDo = () => {
  const v = useMotionVariants()

  return (
    <Section id="services">
      <SectionHeader
        index="03"
        eyebrow="What We Do"
        title="Eight services, one way of working."
        description="From websites and web applications to AI, data platforms, cloud infrastructure and search, delivered by one team with one process."
        action={
          <Button to={routes.services} variant="secondary" size="md">
            All services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <motion.ul
        variants={v.stagger(0.05)}
        {...revealOnce}
        className="grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((service) => {
          const Icon = service.icon
          return (
            <motion.li key={service.slug} variants={v.fadeUp} className="bg-ink-950">
              <Link
                to={`${routes.services}/${service.slug}`}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-ink-900 lg:p-7"
                onClick={() =>
                  trackEvent(events.SERVICE_CTA_CLICK, {
                    service: service.slug,
                    location: 'home_what_we_do',
                  })
                }
              >
                <Icon
                  className="h-5 w-5 text-accent-500 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />

                <h3 className="mt-5 flex items-start justify-between gap-2 text-base font-semibold text-silver-100">
                  <span>{service.title}</span>
                  <ArrowUpRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-silver-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
                    aria-hidden="true"
                  />
                </h3>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-silver-400">
                  {service.shortDescription}
                </p>

                {/* Capabilities are named, never counted - a count says nothing
                    useful and invites comparison between service lines. */}
                <p className="mt-5 line-clamp-1 text-xs text-silver-600">
                  {service.capabilities
                    .slice(0, 3)
                    .map((c) => c.label)
                    .join(' · ')}
                </p>
              </Link>
            </motion.li>
          )
        })}
      </motion.ul>
    </Section>
  )
}

export default WhatWeDo
