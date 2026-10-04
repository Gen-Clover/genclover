import { motion, useReducedMotion } from 'framer-motion'
import { Hash, Pin } from 'lucide-react'
import { CloverMark } from '../brand/Logo'
import { rhythm, groundRules } from '../../data/process'

/**
 * "Staying informed", shown as the project channel a client would actually
 * see: the ways we keep them informed arrive as messages, one after another
 * with a typing pause between, and the ground rules are pinned at the side.
 * The wording comes straight from process.js.
 */

const STAMPS = ['Fri 10:00', 'Tue 16:30', 'Pinned', 'Today']

const Typing = ({ delay }) => (
  <motion.div
    // Sits over the slot the next message will fill, so it takes no space of its own.
    className="absolute left-11 top-5 flex w-14 gap-1 rounded-2xl rounded-bl-sm bg-ink-800 px-3 py-2.5"
    variants={{ hidden: { opacity: 0 }, visible: { opacity: [0, 1, 1, 0], transition: { delay, duration: 1.1, times: [0, 0.15, 0.85, 1] } } }}
    aria-hidden="true"
  >
    {[0, 1, 2].map((i) => (
      <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-silver-500" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </motion.div>
)

const ProjectChannel = () => {
  const reduced = useReducedMotion()
  const gap = reduced ? 0 : 1.3

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-120px' }}
      className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-950 shadow-lift"
    >
      {/* channel header */}
      <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900/80 px-5 py-3">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-silver-100">
          <Hash className="h-4 w-4 text-accent-500" aria-hidden="true" />
          your-project
        </p>
        <div className="flex -space-x-2" aria-label="You and the Gen Clover team">
          <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-ink-900 bg-ink-800">
            <CloverMark className="h-4 w-4" />
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-ink-900 bg-accent-700 text-[10px] font-semibold text-white">You</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.4fr_1fr]">
        {/* the conversation */}
        <ol className="space-y-3 p-5" aria-label="How we keep you informed">
          {rhythm.map((item, i) => (
            <li key={item.title} className="relative">
              {i > 0 && !reduced && <Typing delay={i * gap * 1.4 - 1.1} />}
              <motion.div
                className="flex items-start gap-3"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * gap * 1.4, duration: 0.4 } },
                }}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-800">
                  <CloverMark className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] text-silver-500">
                    <span className="font-semibold text-silver-300">Gen Clover</span> · {STAMPS[i % STAMPS.length]}
                  </p>
                  <div className="mt-1 rounded-2xl rounded-tl-sm border border-ink-700 bg-ink-900 px-4 py-2.5">
                    <p className="text-sm font-semibold text-silver-100">{item.title}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-silver-400">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            </li>
          ))}
          <motion.li
            className="flex justify-end"
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: rhythm.length * gap * 1.4, duration: 0.4 } } }}
          >
            <span className="rounded-2xl rounded-br-sm bg-accent-600 px-4 py-2 text-sm text-white">Perfect, thank you 👍</span>
          </motion.li>
        </ol>

        {/* pinned ground rules */}
        <aside className="border-t border-ink-800 bg-ink-900/50 p-5 md:border-l md:border-t-0" aria-label="Ground rules">
          <p className="flex items-center gap-1.5 font-display text-[11px] font-semibold uppercase tracking-brand text-accent-400">
            <Pin className="h-3.5 w-3.5" aria-hidden="true" />
            Pinned: ground rules
          </p>
          <ul className="mt-3 space-y-2.5">
            {groundRules.map((rule, i) => (
              <motion.li
                key={rule.title}
                className="group rounded-xl border border-ink-700 bg-ink-950/70 p-3 transition-colors hover:border-accent-700/60"
                variants={{ hidden: { opacity: 0, x: 12 }, visible: { opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.12 } } }}
              >
                <p className="text-sm font-semibold text-silver-100">{rule.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-silver-500 transition-colors group-hover:text-silver-300">{rule.description}</p>
              </motion.li>
            ))}
          </ul>
        </aside>
      </div>
    </motion.div>
  )
}

export default ProjectChannel
