import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import { CloverMark } from '../components/brand/Logo'
import FinalCTA from '../components/home/FinalCTA'
import { site, routes } from '../data/site'
import { brandPillars } from '../data/taxonomy'
import { differentiators } from '../data/process'
import { services } from '../data/services'
import { capabilityProof, PROOF_POLICY_NOTE } from '../data/proof'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * About. (Spec §14)
 * Capability-led. No company-size, headcount or years-of-experience claims,
 * because none of those are substantiated.
 */
const About = () => {
  usePageMeta(pageMeta.about)
  const v = useMotionVariants()

  return (
    <>
      <PageHero
        eyebrow="About"
        title="A technology and digital product company."
        description="Gen Clover builds practical, high-quality digital experiences and solutions for modern businesses. We would rather do a smaller number of things properly than claim a longer list."
      >
        <Button to={routes.startProject} size="lg">
          Start a Project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button to={routes.work} size="lg" variant="secondary">
          View Our Work
        </Button>
      </PageHero>

      {/* The name */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeader eyebrow="The name" title="Gen + Clover." className="mb-8" />
            <div className="flex justify-start">
              <div className="relative">
                <div
                  className="absolute -inset-8 rounded-full bg-accent-900/20 blur-3xl"
                  aria-hidden="true"
                />
                <CloverMark className="relative h-28 w-28" />
              </div>
            </div>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-silver-400">
            <p>
              <span className="font-medium text-silver-200">Gen</span> stands for generation,
              generative, and the generation of intelligence - which is a fair description of a
              company working in AI, software, automation and next-generation technology.
            </p>
            <p>
              <span className="font-medium text-silver-200">Clover</span> traditionally represents
              growth, opportunity and prosperity. We position it less around luck and more around
              four interconnected ideas, one per leaf.
            </p>

            <motion.ol
              variants={v.stagger(0.07)}
              {...revealOnce}
              className="grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2"
            >
              {brandPillars.map((pillar, i) => (
                <motion.li key={pillar.label} variants={v.fadeUp} className="bg-ink-950 p-6">
                  <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-display text-sm font-semibold uppercase tracking-brand text-silver-100">
                    {pillar.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver-400">
                    {pillar.description}
                  </p>
                </motion.li>
              ))}
            </motion.ol>

            <p className="rounded-xl border border-ink-700 bg-ink-850 p-6 font-display text-base text-silver-200">
              {site.meaning}
              <span className="mt-2 block text-sm text-silver-400">{site.tagline}</span>
            </p>
          </div>
        </div>
      </Section>

      {/* How we operate */}
      <Section muted>
        <SectionHeader
          eyebrow="How we operate"
          title="What you can expect from working with us."
          description="These are commitments about process and engineering practice - things we control and can be held to."
        />
        <motion.ul
          variants={v.stagger(0.06)}
          {...revealOnce}
          className="grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-3"
        >
          {differentiators.map((item) => (
            <motion.li key={item.title} variants={v.fadeUp} className="bg-ink-950 p-7">
              <h3 className="text-base font-semibold text-silver-100">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-silver-400">{item.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* Capability proof, in place of unverified social proof */}
      <Section>
        <SectionHeader
          eyebrow="Proof"
          title="Where our claims come from."
          description="We do not publish client counts, satisfaction scores or performance figures we cannot evidence. Here is what we can point to instead."
        />
        <motion.ul
          variants={v.stagger(0.06)}
          {...revealOnce}
          className="grid gap-5 sm:grid-cols-2"
        >
          {capabilityProof.map((item) => {
            const Icon = item.icon
            return (
              <motion.li key={item.title} variants={v.fadeUp} className="surface p-7">
                <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-silver-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{item.description}</p>
              </motion.li>
            )
          })}
        </motion.ul>
        <p className="mt-8 max-w-prose text-sm leading-relaxed text-silver-500">
          {PROOF_POLICY_NOTE}
        </p>
      </Section>

      {/* What we do */}
      <Section muted>
        <SectionHeader
          eyebrow="Capabilities"
          title="What we build."
          action={
            <Button to={routes.services} variant="secondary" size="md">
              All services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
        <motion.ul variants={v.stagger(0.04)} {...revealOnce} className="flex flex-wrap gap-2.5">
          {services.map((service) => (
            <motion.li key={service.slug} variants={v.fadeUp}>
              <Link
                to={`${routes.services}/${service.slug}`}
                className="inline-block rounded-lg border border-ink-700 bg-ink-850 px-4 py-2.5 text-sm text-silver-300 transition-colors hover:border-accent-700/60 hover:text-silver-100"
              >
                {service.title}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      <FinalCTA location="about" />
    </>
  )
}

export default About
