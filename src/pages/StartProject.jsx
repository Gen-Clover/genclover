import { motion } from 'framer-motion'
import { Mail, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { Section } from '../components/ui/Section'
import ProjectBriefForm from '../components/form/ProjectBriefForm'
import { contact } from '../data/site'
import { processSteps } from '../data/process'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants } from '../lib/motion'

/**
 * Start a Project. (Spec §9)
 * Replaces the old generic contact page and its mailto submission.
 *
 * Kept compact on purpose: the intro, the whole first question (Continue
 * included) and the sidebar should fit in one screen on a laptop at 80-100%
 * zoom, so nobody has to scroll to reach the form.
 */
const StartProject = () => {
  usePageMeta(pageMeta.startProject)
  const v = useMotionVariants()

  return (
    <>
      <header className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-900/20 blur-[110px]"
          aria-hidden="true"
        />
        <div className="container relative pb-5 pt-24 md:pb-6 short:pb-4 short:pt-[5.75rem]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={v.stagger(0.08)}
          >
            <motion.p variants={v.fadeUp} className="eyebrow">
              Start a Project
            </motion.p>
            <motion.h1
              variants={v.fadeUp}
              className="mt-3 text-3xl leading-[1.1] md:text-4xl xl:text-[2.75rem] short:mt-2 xl:short:text-[2.25rem]"
            >
              Tell us what you are trying to build.
            </motion.h1>
          </motion.div>
        </div>
      </header>

      <Section className="!pb-12 !pt-5 md:!pb-16 md:!pt-6 short:!pt-4">
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
          <ProjectBriefForm />

          <aside className="surface surface-static divide-y divide-ink-800">
            <div className="p-5 short:p-4">
              <p className="eyebrow">Prefer email?</p>
              <ul className="mt-3.5 space-y-2.5 text-sm">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="-my-1 inline-flex items-start gap-3 py-1 text-silver-300 transition-colors hover:text-accent-400"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-silver-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  {contact.location}
                </li>
                <li className="flex items-start gap-3 text-silver-400">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  {contact.hours}
                </li>
              </ul>
              <p className="mt-3.5 text-xs leading-relaxed text-silver-500 short:hidden">
                {contact.servingNote}
              </p>
            </div>

            <div className="p-5 short:p-4">
              <p className="eyebrow">What happens next</p>
              <ol className="mt-3.5 space-y-3 short:space-y-2">
                {processSteps.slice(0, 3).map((step) => (
                  <li key={step.number} className="flex gap-3.5">
                    <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                      {step.number}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-silver-200">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-silver-500 short:hidden">
                        {step.summary}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-start gap-3 p-5 short:p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-silver-500">
                Your brief is submitted over HTTPS to our own endpoint, validated on the server and
                stored only for as long as we need it to respond. We never sell or share your
                details.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}

export default StartProject
