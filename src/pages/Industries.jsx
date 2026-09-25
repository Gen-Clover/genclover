import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageHero, Section } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { industryPages } from '../data/industries'
import { getProjectsByIndustry } from '../data/projects'
import { getService } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/** Industries hub. (Spec §13) Lightweight landing pages, no invented client claims. */
const Industries = () => {
  usePageMeta(pageMeta.industries)
  const v = useMotionVariants()

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Who we build for."
        description="Every sector brings its own constraints, vocabulary and definition of done. Here is how we approach the ones we work in most."
      >
        <Button to={routes.startProject} size="lg">
          Start a Project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PageHero>

      <Section>
        <motion.ul variants={v.stagger(0.05)} {...revealOnce} className="grid gap-5 lg:grid-cols-2">
          {industryPages.map((industry) => {
            const count = getProjectsByIndustry(industry.id).length
            const services = industry.services.map(getService).filter(Boolean).slice(0, 3)

            return (
              <motion.li key={industry.id} variants={v.fadeUp}>
                <Link
                  to={`${routes.industries}/${industry.id}`}
                  className="surface surface-hover group flex h-full flex-col p-7 md:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-silver-100">{industry.label}</h2>
                    <ArrowUpRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-silver-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-3 font-display text-sm text-accent-400">{industry.headline}</p>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-silver-400">
                    {industry.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-1.5">
                    {services.map((service) => (
                      <span
                        key={service.slug}
                        className="rounded border border-ink-700 bg-ink-900 px-2 py-0.5 text-[11px] text-silver-400"
                      >
                        {service.title}
                      </span>
                    ))}
                    {count > 0 && (
                      <span className="px-1 text-[11px] text-silver-600">
                        · {count} {count === 1 ? 'project' : 'projects'}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>

        <p className="mt-10 max-w-prose text-sm leading-relaxed text-silver-500">
          Working in a sector that is not listed? The engineering discipline does not change, so get
          in touch and tell us about the constraints you work under.
        </p>
      </Section>

      <FinalCTA location="industries_hub" />
    </>
  )
}

export default Industries
