import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Briefcase, Check, Mail, XCircle } from 'lucide-react'
import { Section } from '../components/ui/Section'
import Button from '../components/ui/Button'
import { jobs } from '../data/jobs'
import { contact, routes } from '../data/site'
import { usePageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/** Individual role. (Spec §2 — retained, visually aligned.) */
const JobDetail = () => {
  const { id } = useParams()
  const job = jobs.find((j) => String(j.id) === String(id))

  usePageMeta({
    title: job ? `${job.title}, Careers | Gen Clover` : undefined,
    description: job?.metaDescription,
    path: job ? `${routes.careers}/${job.id}` : undefined,
    // A closed role should not keep attracting search traffic.
    noIndex: job?.status === 'closed',
  })

  const v = useMotionVariants()

  if (!job) return <Navigate to={routes.careers} replace />

  const Icon = job.icon
  const isClosed = job.status === 'closed'
  const applyHref = `mailto:${contact.email}?subject=${encodeURIComponent(
    `Application: ${job.title}`
  )}`

  return (
    <>
      <header className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container relative pb-14 pt-32 md:pt-40">
          <Link
            to={routes.careers}
            className="-my-1.5 inline-flex items-center gap-2 py-1.5 text-sm text-silver-500 transition-colors hover:text-accent-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All roles
          </Link>

          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.08)}>
            <motion.div variants={v.fadeUp} className="mt-7 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 bg-ink-900">
                <Icon className="h-5 w-5 text-accent-500" aria-hidden="true" />
              </span>
              <span
                className={`rounded-md border px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-brand ${
                  isClosed
                    ? 'border-ink-600 bg-ink-800 text-silver-400'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/50 dark:bg-emerald-950/50 dark:text-emerald-300'
                }`}
              >
                {isClosed ? 'Applications closed' : 'Open'}
              </span>
            </motion.div>

            <motion.h1 variants={v.fadeUp} className="mt-6 text-4xl leading-[1.08] md:text-5xl">
              {job.title}
            </motion.h1>

            <motion.ul
              variants={v.fadeUp}
              className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-silver-500"
            >
              <li className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                {job.type}
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {job.location}
              </li>
            </motion.ul>
          </motion.div>
        </div>
      </header>

      <Section className="!pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div className="space-y-12">
            <motion.div variants={v.fadeUp} {...revealOnce}>
              <h2 className="text-xl font-semibold text-silver-100">About the role</h2>
              <p className="mt-4 text-base leading-relaxed text-silver-400">{job.description}</p>
            </motion.div>

            <motion.div variants={v.fadeUp} {...revealOnce}>
              <h2 className="text-xl font-semibold text-silver-100">What you will do</h2>
              <ul className="mt-5 space-y-3">
                {job.responsibilities.map((item) => (
                  <li
                    key={item}
                    className="tile flex items-start gap-3.5 rounded-lg border border-ink-800 bg-ink-900 px-5 py-4"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-silver-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={v.fadeUp} {...revealOnce}>
              <h2 className="text-xl font-semibold text-silver-100">What we are looking for</h2>
              <ul className="mt-5 space-y-3">
                {job.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-silver-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.aside
            variants={v.fadeUp}
            {...revealOnce}
            className="surface surface-static h-fit p-7 lg:sticky lg:top-28"
          >
            {isClosed ? (
              <>
                <XCircle className="h-5 w-5 text-silver-500" aria-hidden="true" />
                <h2 className="mt-4 text-base font-semibold text-silver-100">
                  This role is closed
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-silver-400">
                  We are no longer accepting applications for this position. You are still welcome
                  to send a general application; we keep strong ones on file.
                </p>
                <Button
                  href={`mailto:${contact.email}?subject=${encodeURIComponent('General application')}`}
                  variant="secondary"
                  size="md"
                  className="mt-6 w-full"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Send a general application
                </Button>
              </>
            ) : (
              <>
                <p className="eyebrow">Apply</p>
                <h2 className="mt-3 text-base font-semibold text-silver-100">
                  Interested in this role?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-silver-400">
                  Email us your CV and a short note about why this role interests you. A link to
                  something you have built is worth more than a cover letter.
                </p>
                <Button href={applyHref} size="md" className="mt-6 w-full">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Apply for this role
                </Button>
              </>
            )}

            <div className="mt-7 border-t border-ink-800 pt-6">
              <Link
                to={routes.careers}
                className="-my-1.5 inline-block py-1.5 text-sm text-silver-400 transition-colors hover:text-accent-400"
              >
                ← View all roles
              </Link>
            </div>
          </motion.aside>
        </div>
      </Section>
    </>
  )
}

export default JobDetail
