import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import WorkCard from '../components/work/WorkCard'
import FinalCTA from '../components/home/FinalCTA'
import { publishedProjects, homepageProjects } from '../data/projects'
import { routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants, EASE } from '../lib/motion'
import { canHover } from '../lib/pointer'

/**
 * Work hub. (Spec §7, §21)
 *
 * An exhibition wall: every project on one wall, assembling from
 * scattered pieces on arrival. The flagship projects carry a badge, and every card leans
 * toward the pointer. Each card still opens its full case study.
 */

const FLAGSHIP = new Set(homepageProjects.map((p) => p.slug))
const SCATTER = [
  [-80, 60, -6], [90, -50, 5], [-40, 110, 4], [120, 80, -5], [-120, -40, 7], [60, 130, -4], [150, -20, 6], [-60, -90, -7],
]


/** Leans the card a few degrees toward the pointer. */
const Tilt = ({ children }) => {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const onMove = (e) => {
    if (reduced || !canHover()) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(1100px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`
  }
  const onLeave = () => ref.current && (ref.current.style.transform = '')
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative h-full transition-transform duration-300 ease-out will-change-transform">
      {children}
    </div>
  )
}

const Work = () => {
  usePageMeta(pageMeta.work)
  const v = useMotionVariants()
  const reduced = useReducedMotion()


  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-950" aria-label="Work">
        <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-96" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-accent-900/25 blur-[130px]" aria-hidden="true" />

        <div className="container relative pb-14 pt-24 md:pt-28">
          <motion.div initial="hidden" animate="visible" variants={v.stagger(0.06)} className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <motion.p variants={v.fadeUp} className="eyebrow">
                Work
              </motion.p>
              <motion.h1 variants={v.riseIn} className="mt-3 text-4xl leading-[1.05] tracking-tight xl:text-5xl">
                The wall of things we built.
              </motion.h1>
            </div>
          </motion.div>

          <h2 className="sr-only">Projects</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publishedProjects.map((project, i) => {
                const flagship = FLAGSHIP.has(project.slug)
                const s = SCATTER[i % SCATTER.length]
                return (
                  <motion.div
                    key={project.slug}
                    className="relative"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: s[0], y: s[1], rotate: s[2], scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { duration: 0.7, delay: Math.min(i, 8) * 0.05, ease: EASE } }}
                  >
                    <Tilt>
                      <WorkCard project={project} priority={i < 6} />
                      {flagship && (
                        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-accent-600 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-brand text-white shadow-glow-sm">
                          Flagship
                        </span>
                      )}
                    </Tilt>
                  </motion.div>
                )
              })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button to={routes.startProject} size="md">
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <FinalCTA
        title="Seen something close to what you need?"
        description="Point us to the project nearest to yours and tell us what is different. We will come back with how we would build it for you."
        location="work_hub"
      />
    </>
  )
}

export default Work
