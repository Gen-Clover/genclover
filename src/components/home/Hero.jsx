import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { CloverMark } from '../brand/Logo'
import { routes, site } from '../../data/site'
import { useMotionVariants } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/**
 * Homepage hero. (Spec §5.1 — copy below is specified content, do not reword.)
 *
 * Visual language follows the brand cover: deep charcoal, a controlled red glow
 * ring behind the mark, subtle diagonal structure, and the service strip that
 * runs along the bottom of the brand banner.
 */

const SERVICE_STRIP = [
  'WEB',
  'APPLICATIONS',
  'E-COMMERCE',
  'AI & AUTOMATION',
  'DATA',
  'TECHNOLOGY',
  'DEVOPS',
  'SEO',
]

const Hero = () => {
  const v = useMotionVariants()
  const reduced = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden bg-ink-950" aria-labelledby="hero-heading">
      {/* --------------------------------------------------- ambient layers */}
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="diagonal-sheen pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Controlled glow ring, echoing the brand cover */}
      <div
        className="pointer-events-none absolute right-[-18%] top-[-10%] hidden h-[46rem] w-[46rem] lg:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-accent-700/40" />
        <div className="animate-ring-pulse absolute inset-0 rounded-full shadow-glow-ring" />
        <div className="absolute inset-[14%] rounded-full bg-gradient-to-b from-accent-950/40 to-transparent blur-3xl" />
        <div className="absolute inset-0 grid place-items-center">
          <CloverMark className="h-40 w-40 opacity-[0.07]" />
        </div>
      </div>

      {/* Diagonal accent bars, bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-20 hidden h-96 w-80 -rotate-[24deg] md:block"
        aria-hidden="true"
      >
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-transparent via-accent-600/70 to-transparent" />
        <div className="absolute left-7 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent-700/40 to-transparent" />
      </div>

      <div className="container relative pb-20 pt-36 md:pb-28 md:pt-44 lg:pb-32 lg:pt-48">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={v.stagger(0.1, 0.05)}
          className="max-w-3xl"
        >
          <motion.div variants={v.fadeUp} className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent-600" aria-hidden="true" />
            <p className="eyebrow">{site.domains}</p>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={v.fadeUp}
            className="mt-7 text-4xl leading-[1.06] tracking-tight sm:text-5xl lg:text-[4rem]"
          >
            We design and build digital products that move businesses
            <span className="text-accent-500"> forward.</span>
          </motion.h1>

          <motion.p
            variants={v.fadeUp}
            className="mt-7 max-w-prose text-lg leading-relaxed text-silver-400 md:text-xl"
          >
            Websites, web applications, AI-powered solutions and digital experiences designed
            around your business, your users and your goals.
          </motion.p>

          <motion.div variants={v.fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              to={routes.startProject}
              size="lg"
              onClick={() => trackEvent(events.START_PROJECT_CTA, { location: 'hero' })}
            >
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to={routes.work} size="lg" variant="secondary">
              View Our Work
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* ------------------------------------------------ service strip */}
      <div className="relative border-y border-ink-800 bg-ink-900/60">
        <div className="overflow-hidden py-3.5" aria-hidden="true">
          {/* Two identical halves; translating the wrapper by -50% loops seamlessly.
              With reduced motion the wrapper simply does not animate. */}
          <div className={`flex w-max ${reduced ? '' : 'animate-marquee'}`}>
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 items-center">
                {SERVICE_STRIP.map((label) => (
                  <span key={`${half}-${label}`} className="flex shrink-0 items-center">
                    <span className="px-5 font-display text-[11px] font-medium tracking-brand text-silver-500">
                      {label}
                    </span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent-600" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="sr-only">
          Gen Clover works across web, applications, e-commerce, AI and automation, data,
          technology, DevOps and SEO.
        </p>
      </div>
    </section>
  )
}

export default Hero
