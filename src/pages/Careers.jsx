import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, ArrowRight, Mail } from 'lucide-react'
import Button from '../components/ui/Button'
import { jobs } from '../data/jobs'
import { contact, routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants } from '../lib/motion'

/** What candidates can expect. Specific to working here, not the client pitch. */
const workingHere = [
  {
    title: 'Real client work from the start',
    description:
      'You work on systems clients depend on: AI workflows, data platforms, web applications and websites.',
  },
  {
    title: 'Direct contact with the people who need it',
    description:
      'You talk to the people who wrote the requirement, not to a chain of intermediaries.',
  },
  {
    title: 'Reviewed, traceable releases',
    description:
      'Every change goes through a pull request and a preview environment before production.',
  },
  {
    title: 'Writing things down',
    description:
      'Decisions, scope and trade-offs are written down, so nobody has to remember what was agreed.',
  },
  {
    title: 'Remote-friendly',
    description:
      'Most collaboration is written and asynchronous, with calls arranged across Indian and international time zones.',
  },
  {
    title: 'Ownership after launch',
    description:
      'You see how your work behaves in production, and you help keep it healthy.',
  },
]

/**
 * Careers. One screen on desktop: the invitation and what working here is like
 * on the left, the roles on the right. No separate closing banner, because the
 * general application is already the main action at the top.
 */
const Careers = () => {
  usePageMeta(pageMeta.careers)
  const v = useMotionVariants()
  const openRoles = jobs.filter((job) => job.status === 'open')
  const applyHref = `mailto:${contact.email}?subject=${encodeURIComponent('General application')}`

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 -top-20 h-[36rem] w-[36rem] rounded-full bg-accent-900/25 blur-[140px]"
        aria-hidden="true"
      />
      <div className="container relative grid gap-10 pb-14 pt-28 md:pt-32 lg:grid-cols-[1fr_1fr] lg:gap-x-14 lg:gap-y-10">
        {/* ------------------------------------------------ invitation */}
        <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)}>
          <motion.p variants={v.fadeUp} className="eyebrow">
            Careers
          </motion.p>
          <motion.h1 variants={v.fadeUp} className="mt-3 text-4xl leading-[1.05] tracking-tight xl:text-5xl">
            Build things that are meant to last.
          </motion.h1>
          <motion.p variants={v.fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-silver-400">
            We are a small team that cares about engineering quality, clear thinking and honest
            communication.{' '}
            {openRoles.length > 0
              ? 'Here is who we are hiring for right now.'
              : 'There are no open roles right now, but if this sounds like how you want to work, we would like to hear from you.'}
          </motion.p>
          <motion.div variants={v.fadeUp} className="mt-6 flex flex-wrap items-center gap-4">
            <Button href={applyHref} size="md">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Send a general application
            </Button>
            <span className="text-sm text-silver-500">A short note and a link to work you are proud of.</span>
          </motion.div>

        </motion.div>

        {/* ----------------------------------------------------- roles */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={v.stagger(0.08, 0.2)}
          className="lg:pt-6"
          aria-labelledby="roles-heading"
        >
          <motion.div variants={v.fadeUp} className="flex items-baseline justify-between gap-4">
            <h2 id="roles-heading" className="text-2xl font-semibold text-silver-100">
              {openRoles.length > 0 ? 'Open roles' : 'Recent roles'}
            </h2>
            {openRoles.length === 0 && (
              <span className="rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-brand text-silver-400">
                Applications closed
              </span>
            )}
          </motion.div>
          <motion.p variants={v.fadeUp} className="mt-2 text-sm leading-relaxed text-silver-500">
            {openRoles.length > 0
              ? 'Remote-friendly, and open to strong candidates wherever we can work together practically.'
              : 'These are the kinds of roles we hire for. We read every general application and keep good ones on file.'}
          </motion.p>

          <ul className="mt-6 space-y-4">
            {jobs.map((job) => {
              const Icon = job.icon
              const isClosed = job.status === 'closed'
              return (
                <motion.li key={job.id} variants={v.fadeUp}>
                  <Link
                    to={`${routes.careers}/${job.id}`}
                    className="surface group flex gap-5 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-ink-700 bg-ink-900">
                      <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-silver-100">{job.title}</h3>
                        <span
                          className={`shrink-0 rounded border px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-brand ${
                            isClosed
                              ? 'border-ink-600 text-silver-500'
                              : 'border-emerald-600/50 text-emerald-400'
                          }`}
                        >
                          {isClosed ? 'Closed' : 'Open'}
                        </span>
                      </div>
                      <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-silver-500">
                        <li className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                          {job.type}
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {job.location}
                        </li>
                      </ul>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-silver-400">
                        {job.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-400">
                        Read the role
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </motion.div>

        {/* ------------------------------------ what you would be joining */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={v.stagger(0.05, 0.3)}
          className="lg:col-span-2"
        >
          <motion.h2 variants={v.fadeUp} className="font-display text-xs font-semibold uppercase tracking-brand text-silver-400">
            What you would be joining
          </motion.h2>
          <motion.ul
            variants={v.stagger(0.04)}
            className="mt-4 grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-3"
          >
            {workingHere.map((item) => (
              <motion.li key={item.title} variants={v.fadeUp} className="bg-ink-950 p-5">
                <h3 className="text-sm font-semibold text-silver-100">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-silver-400">{item.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}

export default Careers
