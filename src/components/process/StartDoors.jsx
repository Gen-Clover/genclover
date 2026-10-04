import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { startingPoints } from '../../data/process'
import { routes } from '../../data/site'
import { useMotionVariants, revealOnce } from '../../lib/motion'
import { canHover } from '../../lib/pointer'

/**
 * Ways to start, as four doors. Each door carries its name on a plate; it
 * swings open on hover or focus (a tap on touch) to show what is behind it and
 * who it suits.
 */
const Door = ({ point, index }) => {
  const v = useMotionVariants()
  const [open, setOpen] = useState(false)

  return (
    <motion.li variants={v.fadeUp} className="[perspective:1600px]">
      <div
        className="group relative h-[22rem] rounded-t-[999px] rounded-b-xl border-[6px] border-ink-700 bg-ink-950 shadow-lift"
        onClick={() => !canHover() && setOpen((o) => !o)}
      >
        {/* what is behind the door */}
        <div className="absolute inset-0 flex flex-col justify-end overflow-hidden rounded-t-[999px] rounded-b-lg bg-gradient-to-b from-accent-950/40 via-ink-900 to-ink-900 p-5">
          <span className="pointer-events-none absolute left-1/2 top-10 h-32 w-32 -translate-x-1/2 rounded-full bg-accent-600/25 blur-2xl" aria-hidden="true" />
          <h3 className="relative text-lg font-semibold text-silver-100">{point.title}</h3>
          <p className="relative mt-2 text-[13px] leading-relaxed text-silver-300">{point.description}</p>
          <p className="relative mt-3 border-t border-ink-700 pt-3 text-xs text-silver-400">
            <span className="font-display text-[10px] font-semibold uppercase tracking-brand text-accent-400">Good for </span>
            {point.fit}
          </p>
          <Link
            to={routes.startProject}
            className="relative mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-400 hover:text-accent-300"
            tabIndex={open ? 0 : -1}
            onFocus={() => setOpen(true)}
          >
            Start here
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* the door itself */}
        <button
          type="button"
          onFocus={() => setOpen(true)}
          onBlur={(e) => !e.currentTarget.parentElement.contains(e.relatedTarget) && setOpen(false)}
          aria-expanded={open}
          aria-label={`${point.title}: open the door`}
          className={`absolute inset-0 origin-left rounded-t-[999px] rounded-b-lg border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-850 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [backface-visibility:hidden] [transform-style:preserve-3d] focus-visible:outline-none ${
            open ? '[transform:rotateY(-105deg)]' : 'group-hover:[transform:rotateY(-105deg)]'
          }`}
        >
          {/* panels */}
          <span className="absolute inset-x-6 top-16 h-24 rounded-t-full border border-ink-600" aria-hidden="true" />
          <span className="absolute inset-x-6 bottom-6 top-48 rounded-md border border-ink-600" aria-hidden="true" />
          {/* nameplate */}
          <span className="absolute inset-x-8 top-[8.6rem] rounded-md border border-accent-700/60 bg-ink-950 px-3 py-2 text-center">
            <span className="block font-display text-[10px] font-semibold tracking-brand text-accent-400">{String(index + 1).padStart(2, '0')}</span>
            <span className="mt-0.5 block text-sm font-semibold leading-tight text-silver-100">{point.title}</span>
          </span>
          {/* knob */}
          <span className="absolute right-4 top-1/2 h-4 w-4 rounded-full bg-accent-500 shadow-[0_0_14px_rgb(var(--glow-accent)/0.7)]" aria-hidden="true" />
        </button>
      </div>
    </motion.li>
  )
}

const StartDoors = () => {
  const v = useMotionVariants()
  return (
    <motion.ul variants={v.stagger(0.08)} {...revealOnce} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {startingPoints.map((point, i) => (
        <Door key={point.title} point={point} index={i} />
      ))}
    </motion.ul>
  )
}

export default StartDoors
