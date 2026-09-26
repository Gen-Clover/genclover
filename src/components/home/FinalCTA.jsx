import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import Button from '../ui/Button'
import { CloverMark } from '../brand/Logo'
import { routes, contact, site } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { trackEvent, events } from '../../lib/analytics'

/** 09 — Final CTA. (Spec §5.2) Reused at the foot of most pages. */
const FinalCTA = ({
  title = 'Tell us what you are trying to build.',
  description = 'A short structured brief is enough to get started. We will come back with a considered response, not a template.',
  primaryLabel = 'Start a Project',
  /** Optional external/mailto target, used instead of the Start a Project route. */
  primaryHref,
  location = 'final_cta',
}) => {
  const v = useMotionVariants()

  return (
    <section className="relative isolate overflow-hidden border-t border-ink-800 bg-ink-950">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-full h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-900/25 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container relative py-14 md:py-20">
        <motion.div
          variants={v.stagger(0.08)}
          {...revealOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div variants={v.fadeUp} className="flex justify-center">
            <CloverMark className="h-10 w-10" />
          </motion.div>

          <motion.h2
            variants={v.fadeUp}
            className="mt-7 text-3xl leading-tight md:text-4xl lg:text-[2.75rem]"
          >
            {title}
          </motion.h2>

          <motion.p
            variants={v.fadeUp}
            className="mx-auto mt-5 max-w-prose text-base leading-relaxed text-silver-400 md:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            variants={v.fadeUp}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              {...(primaryHref ? { href: primaryHref } : { to: routes.startProject })}
              size="lg"
              onClick={() =>
                !primaryHref && trackEvent(events.START_PROJECT_CTA, { location })
              }
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href={`mailto:${contact.email}`} size="lg" variant="secondary">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {contact.email}
            </Button>
          </motion.div>

          <motion.p
            variants={v.fadeUp}
            className="mt-8 font-display text-xs uppercase tracking-brand text-silver-600"
          >
            {site.philosophy}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTA
