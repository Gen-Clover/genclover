import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Section, SectionHeader } from '../ui/Section'
import Button from '../ui/Button'
import { services } from '../../data/services'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/** 04 — What We Do. Every service, as cards. (Spec §5.2, §6) */
const WhatWeDo = () => {
  const v = useMotionVariants()

  return (
    <Section id="services">
      <SectionHeader
        index="04"
        eyebrow="What We Do"
        title="Everything a digital product needs, under one roof."
        description="Websites, applications, commerce, AI, data, infrastructure and search, delivered by one team with one way of working."
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
        className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 lg:grid-cols-4"
      >
        {services.map((service) => {
          const Icon = service.icon
          return (
            <motion.li key={service.slug} variants={v.fadeUp} className="bg-ink-950">
              <Link
                to={`${routes.services}/${service.slug}`}
                className="group flex h-full flex-col p-4 transition-colors hover:bg-ink-900 sm:p-6 lg:p-7"
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

                <h3 className="mt-3 flex items-start justify-between gap-2 text-sm font-semibold text-silver-100 sm:mt-5 sm:text-base">
                  <span>{service.title}</span>
                  <ArrowUpRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-silver-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
                    aria-hidden="true"
                  />
                </h3>

                <p className="mt-2.5 hidden flex-1 text-sm leading-relaxed text-silver-400 sm:block">
                  {service.shortDescription}
                </p>

                {/* Capabilities are named, never counted - a count says nothing
                    useful and invites comparison between service lines. */}
                <p className="mt-5 hidden line-clamp-1 text-xs text-silver-500 sm:block">
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
