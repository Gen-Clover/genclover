import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageHero, Section, SectionHeader } from '../components/ui/Section'
import Button from '../components/ui/Button'
import FinalCTA from '../components/home/FinalCTA'
import { jobs } from '../data/jobs'
import { differentiators } from '../data/process'
import { contact, routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/** Careers. (Spec §2 — retained and visually aligned to the new system.) */
const Careers = () => {
  usePageMeta(pageMeta.careers)
  const v = useMotionVariants()

  const openRoles = jobs.filter((job) => job.status === 'open')

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build things that are meant to last."
        description="We are a small team that cares about engineering quality, clear thinking and honest communication. If that sounds like how you want to work, we would like to hear from you."
      >
        <Button href={`mailto:${contact.email}?subject=General application`} size="lg" variant="secondary">
          Send a general application
        </Button>
      </PageHero>

      <Section>
        <SectionHeader
          eyebrow="Open positions"
          title={openRoles.length > 0 ? 'Roles we are hiring for.' : 'Current openings.'}
          description={
            openRoles.length > 0
              ? 'Every role is remote-friendly and open to strong candidates from anywhere we can work together practically.'
              : 'We do not have an open position right now, but we read every application that arrives and keep good ones on file.'
          }
        />

        <motion.ul variants={v.stagger(0.07)} {...revealOnce} className="grid gap-5 lg:grid-cols-2">
          {jobs.map((job) => {
            const Icon = job.icon
            const isClosed = job.status === 'closed'

            return (
              <motion.li key={job.id} variants={v.fadeUp}>
                <Link
                  to={`${routes.careers}/${job.id}`}
                  className={`surface group flex h-full flex-col p-7 md:p-8 ${
                    isClosed ? 'opacity-70 hover:opacity-100' : 'surface-hover'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-900">
                      <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
                    </span>
                    <span
                      className={`rounded-md border px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-brand ${
                        isClosed
                          ? 'border-ink-600 bg-ink-800 text-silver-400'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {isClosed ? 'Closed' : 'Open'}
                    </span>
                  </div>

                  <h2 className="mt-6 flex items-start justify-between gap-3 text-xl font-semibold text-silver-100">
                    <span>{job.title}</span>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-silver-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400"
                      aria-hidden="true"
                    />
                  </h2>

                  <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-silver-500">
                    <li className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                      {job.type}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {job.location}
                    </li>
                  </ul>

                  <p className="mt-5 line-clamp-3 flex-1 text-sm leading-relaxed text-silver-400">
                    {job.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-400">
                    View role
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </Section>

      <Section muted>
        <SectionHeader
          eyebrow="How we work"
          title="What you would be joining."
          description="The same commitments we make to clients apply internally."
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

      <FinalCTA
        title="Not seeing the right role?"
        description="Send us a note about what you do and what you are looking for. We keep strong applications on file and come back to them."
        primaryLabel="Start a Project"
        location="careers"
      />
    </>
  )
}

export default Careers
