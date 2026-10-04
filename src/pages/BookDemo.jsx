import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LayoutTemplate, Lock, Mail } from 'lucide-react'
import { Section } from '../components/ui/Section'
import DemoRequestForm from '../components/form/DemoRequestForm'
import { contact, routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants } from '../lib/motion'

/**
 * Book a Demo. (Templates)
 * Laid out like Start a Project: a short intro, the form, and a sidebar that
 * explains what happens next and what we do with the visitor's material.
 */

const steps = [
  { title: 'Tell us about your site', text: 'Your current website, or the template you liked, and how to reach you.' },
  { title: 'We build a private demo', text: 'Using your own name, logo, photos and words, so you see your business, not placeholder text.' },
  { title: 'Walk through it together', text: 'On our first call we show you the demo and talk through what a full project would involve.' },
  { title: 'You decide', text: 'Go ahead with a project, ask for changes, or have the demo deleted.' },
]

const BookDemo = () => {
  usePageMeta(pageMeta.bookDemo)
  const v = useMotionVariants()

  return (
    <>
      <header className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-900/20 blur-[110px]"
          aria-hidden="true"
        />
        <div className="container relative pb-6 pt-24 md:pb-8">
          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.08)} className="max-w-3xl">
            <motion.p variants={v.fadeUp} className="eyebrow">
              Book a Demo
            </motion.p>
            <motion.h1 variants={v.riseIn} className="mt-3 text-3xl leading-[1.1] md:text-4xl xl:text-[2.75rem]">
              See your website before you commit.
            </motion.h1>
            <motion.p variants={v.fadeUp} className="mt-4 max-w-prose text-base leading-relaxed text-silver-400 md:text-lg">
              Ask for a demo redesign of your current site, built with your own brand, or a demo of one of our
              templates. We walk you through it on our first call.
            </motion.p>
          </motion.div>
        </div>
      </header>

      <Section className="!pb-12 !pt-6 md:!pb-16 md:!pt-8">
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
          <DemoRequestForm />

          <aside className="surface surface-static divide-y divide-ink-800 lg:sticky lg:top-24">
            <div className="p-5">
              <p className="eyebrow">How it works</p>
              <ol className="mt-4 space-y-3.5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span className="font-display text-xs font-semibold tracking-brand text-silver-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-silver-200">{step.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-silver-500">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-start gap-3 p-5">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-silver-500">
                <span className="font-medium text-silver-300">Your material stays yours.</span> We use your brand
                and content only for your demo, with your written permission. The demo is shared only with you,
                never published or used in our marketing, and deleted whenever you ask.
              </p>
            </div>

            <div className="space-y-3 p-5 text-sm">
              <Link
                to={`${routes.services}/websites#templates`}
                className="-my-1 flex items-start gap-3 py-1 text-silver-300 transition-colors hover:text-accent-400"
              >
                <LayoutTemplate className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                Browse the templates
              </Link>
              <a
                href={`mailto:${contact.email}`}
                className="-my-1 flex items-start gap-3 py-1 text-silver-300 transition-colors hover:text-accent-400"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                {contact.email}
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}

export default BookDemo
