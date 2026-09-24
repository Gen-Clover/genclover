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
        <div className="container relative pb-14 pt-32 md:pt-40">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={v.stagger(0.08)}
            className="max-w-3xl"
          >
            <motion.p variants={v.fadeUp} className="eyebrow">
              Start a Project
            </motion.p>
            <motion.h1 variants={v.fadeUp} className="mt-5 text-4xl leading-[1.08] md:text-5xl">
              Tell us what you are trying to build.
            </motion.h1>
            <motion.p
              variants={v.fadeUp}
              className="mt-6 max-w-prose text-lg leading-relaxed text-silver-400"
            >
              Eight short questions. It takes a couple of minutes and means our first reply is
              about your project rather than a generic capability deck.
            </motion.p>
          </motion.div>
        </div>
      </header>

      <Section className="!pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <ProjectBriefForm />

          <aside className="space-y-6">
            <div className="surface p-6">
              <p className="eyebrow">Prefer email?</p>
              <ul className="mt-5 space-y-4 text-sm">
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
              <p className="mt-5 border-t border-ink-800 pt-5 text-xs leading-relaxed text-silver-500">
                {contact.servingNote}
              </p>
            </div>

            <div className="surface p-6">
              <p className="eyebrow">What happens next</p>
              <ol className="mt-5 space-y-4">
                {processSteps.slice(0, 3).map((step) => (
                  <li key={step.number} className="flex gap-3.5">
                    <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                      {step.number}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-silver-200">
                        {step.title}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-silver-500">
                        {step.summary}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-ink-800 bg-ink-900 p-5">
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
