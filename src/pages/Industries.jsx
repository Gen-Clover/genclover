import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { SplitScreen, GlassPanel, panelSwap } from '../components/ui/SplitScreen'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { industryPages } from '../data/industries'
import { getProjectsByIndustry } from '../data/projects'
import { getService } from '../data/services'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'
import { previewFirstTap, canHover, isKeyboardFocus } from '../lib/pointer'

/**
 * Industries hub. (Spec §13) No invented client claims.
 *
 * Screen 1: the sectors on the left; hovering one previews it on the right
 * (what matters there, the services we bring, and the delivered work in that
 * sector). On small screens the sectors are shown as cards instead.
 */

const IndustryPreview = ({ industry }) => {
  const services = industry.services.map(getService).filter(Boolean)
  const work = getProjectsByIndustry(industry.id)
  return (
    <motion.div {...panelSwap}>
      <p className="eyebrow">{industry.label}</p>
      <h2 className="mt-2 text-xl font-semibold leading-snug text-silver-100">{industry.headline}</h2>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-silver-300">
        {industry.description}
      </p>

      <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-brand text-silver-500">
        What usually matters here
      </p>
      <ul className="mt-2 grid gap-x-4 gap-y-1.5 xl:grid-cols-2">
        {industry.focusAreas.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug text-silver-300">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-brand text-silver-500">
        What we bring
      </p>
      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              to={`${routes.services}/${service.slug}`}
              className="inline-block rounded border border-ink-700 bg-ink-950/70 px-2.5 py-1 text-xs text-silver-300 transition-colors hover:border-accent-700/60 hover:text-silver-100"
            >
              {service.title}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-brand text-silver-500">
        Delivered in this sector
      </p>
      {work.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {work.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link
                to={`${routes.work}/${p.slug}`}
                className="group inline-flex items-center gap-2 text-sm text-silver-200 transition-colors hover:text-accent-400"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
                {p.title}
              </Link>
            </li>
          ))}
          {work.length > 3 && (
            <li className="text-xs text-silver-500">
              and {work.length - 3} more on the{' '}
              <Link to={`${routes.industries}/${industry.id}`} className="text-accent-400 hover:text-accent-300">
                sector page
              </Link>
            </li>
          )}
        </ul>
      ) : (
        <p className="mt-2.5 text-sm text-silver-500">
          No published project here yet. The capabilities above are the ones we would bring.
        </p>
      )}

      <div className="mt-5">
        <Button to={`${routes.industries}/${industry.id}`} size="sm">
          Open {industry.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </motion.div>
  )
}

const Industries = () => {
  usePageMeta(pageMeta.industries)
  const v = useMotionVariants()
  const [active, setActive] = useState(industryPages[0].id)
  const activeIndustry = industryPages.find((i) => i.id === active) ?? industryPages[0]

  return (
    <>
      <SplitScreen
        label="Industries"
        cols="lg:grid-cols-[0.8fr_1.2fr]"
        left={
          <>
            <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)}>
              <motion.p variants={v.fadeUp} className="eyebrow">
                Industries
              </motion.p>
              <motion.h1
                variants={v.fadeUp}
                className="mt-3 text-4xl leading-[1.05] tracking-tight xl:text-5xl"
              >
                Who we build for.
              </motion.h1>
              <motion.p variants={v.fadeUp} className="mt-3 max-w-xl text-base leading-relaxed text-silver-400">
                Every sector has its own constraints and definition of done.
                <span className="hidden lg:inline"> Hover or tap a sector to see how we approach it.</span>
              </motion.p>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={v.stagger(0.03, 0.2)}
              className="mt-5 hidden min-h-0 gap-1.5 overflow-y-auto sm:grid-cols-2 lg:grid"
            >
              {industryPages.map((industry) => {
                const selected = industry.id === activeIndustry.id
                return (
                  <motion.li key={industry.id} variants={v.fadeUp}>
                    <Link
                      to={`${routes.industries}/${industry.id}`}
                      onMouseEnter={() => canHover() && setActive(industry.id)}
                      onFocus={(e) => isKeyboardFocus(e) && setActive(industry.id)}
                      onClick={previewFirstTap(selected, () => setActive(industry.id))}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                        selected
                          ? 'border-accent-700/70 bg-accent-950/35 text-silver-100'
                          : 'border-ink-800 bg-ink-900/50 text-silver-300 hover:border-ink-600'
                      }`}
                    >
                      <span className="font-medium">{industry.label}</span>
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>

            <p className="mt-4 text-xs leading-relaxed text-silver-500">
              Not listed? The engineering discipline does not change.{' '}
              <Link to={routes.startProject} className="text-accent-400 hover:text-accent-300">
                Tell us about your sector
              </Link>
              .
            </p>
          </>
        }
        right={
          <GlassPanel>
            <AnimatePresence mode="wait">
              <IndustryPreview key={activeIndustry.id} industry={activeIndustry} />
            </AnimatePresence>
          </GlassPanel>
        }
      />

      {/* Small screens: the sectors as cards (the preview panel is desktop-only) */}
      <Section className="lg:hidden">
        <motion.ul variants={v.stagger(0.05)} {...revealOnce} className="grid gap-5 md:grid-cols-2">
          {industryPages.map((industry) => {
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
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>

      </Section>

      <FinalCTA
        title="Your sector has its own rules. We will learn them."
        description="Tell us the constraints you work under, from regulation to seasonality to legacy systems, and we will show you how we would design around them."
        location="industries_hub"
      />
    </>
  )
}

export default Industries
