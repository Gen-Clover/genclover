import { motion, useReducedMotion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useSoundSetting } from '../../lib/hoverSound'

/** Mute / unmute the hover "tak" sound. Sits beside the theme toggle. */
const SoundToggle = ({ className = '' }) => {
  const { on, toggle, locked } = useSoundSetting()
  const reduced = useReducedMotion()
  const Icon = on ? Volume2 : VolumeX
  // Browsers block audio until the first click; say so rather than seem broken.
  const waiting = on && locked
  const label = waiting
    ? 'Sound turns on after your first click on the page'
    : on
      ? 'Mute hover sounds'
      : 'Turn on hover sounds'

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={label}
      title={label}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-850/60 text-silver-300 transition-colors hover:border-accent-600 hover:text-accent-400 ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {waiting && (
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5" aria-hidden="true">
          {!reduced && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
          )}
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
        </span>
      )}
    </motion.button>
  )
}

export default SoundToggle
