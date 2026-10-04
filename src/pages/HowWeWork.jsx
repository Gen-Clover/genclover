import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Faq from '../components/ui/Faq'
import FinalCTA from '../components/home/FinalCTA'
import CareGarden from '../components/home/CareGarden'
import StageDial from '../components/process/StageDial'
import ProjectChannel from '../components/process/ProjectChannel'
import StartDoors from '../components/process/StartDoors'
import { processFaqs } from '../data/process'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, revealOnce } from '../lib/motion'

/**
 * How We Work. (Spec §11, §12)
 *
 * Shown rather than described: the seven stages as a dial you turn (the
 * process is a loop), staying informed as the project channel a client would
 * see, the ways to start as doors that open, the care plans as a garden, and
 * the questions people ask first.
 */

const Heading = ({ eyebrow, title, className = '' }) => {
  const v = useMotionVariants()
  return (
    <motion.div variants={v.fadeUp} {...revealOnce} className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl leading-tight md:text-4xl">{title}</h2>
    </motion.div>
  )
}

const HowWeWork = () => {
  usePageMeta(pageMeta.howWeWork)
  const v = useMotionVariants()

  return (
    <>
      {/* the dial */}
      <section className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950" aria-label="The process">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[36rem] w-[36rem] rounded-full bg-accent-900/20 blur-[150px]" aria-hidden="true" />
        <div className="container relative pb-14 pt-24 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:pt-[5.5rem]">
          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)} className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.p variants={v.fadeUp} className="eyebrow">
                How We Work
              </motion.p>
              <motion.h1 variants={v.riseIn} className="mt-3 text-3xl leading-[1.08] tracking-tight md:text-4xl xl:text-5xl">
                Seven stages. One loop.
              </motion.h1>
              <motion.p variants={v.fadeUp} className="mt-2 text-sm text-silver-500">
                Turn the dial: each stage answers one question and ends with a decision.
              </motion.p>
            </div>
            <motion.div variants={v.fadeUp}>
              <Button to={routes.startProject} size="md">
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
          <StageDial />
        </div>
      </section>

      {/* staying informed */}
      <section className="bg-ink-900 py-20 md:py-24" aria-label="Staying informed">
        <div className="container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16">
          <Heading eyebrow="Staying informed" title="You never have to ask how it is going." />
          <ProjectChannel />
        </div>
      </section>

      {/* ways to start */}
      <section className="bg-ink-950 py-20 md:py-24" aria-label="Ways to start">
        <div className="container">
          <Heading eyebrow="Ways to start" title="Four doors in. Pick yours." className="mb-10" />
          <StartDoors />
        </div>
      </section>

      <CareGarden />

      {/* questions */}
      <section className="border-t border-ink-800 bg-ink-900 py-20 md:py-24" aria-label="Questions">
        <div className="container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Heading eyebrow="Questions" title="Before you ask." />
          <motion.div variants={v.fadeUp} {...revealOnce}>
            <Faq items={processFaqs} />
          </motion.div>
        </div>
      </section>

      <FinalCTA
        title="Ready for stage one?"
        description="Every engagement starts with Discover: a conversation about what you are trying to change. Start there, and we will map out what the next stages would look like for you."
        primaryLabel="Start with Discover"
        location="how_we_work"
      />
    </>
  )
}

export default HowWeWork
