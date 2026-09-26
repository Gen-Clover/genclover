import { motion, useReducedMotion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useSoundSetting } from '../../lib/hoverSound'

/** Mute / unmute the hover "tak" sound. Sits beside the theme toggle. */
const SoundToggle = ({ className = '' }) => {
  const { on, toggle } = useSoundSetting()
  const reduced = useReducedMotion()
  const Icon = on ? Volume2 : VolumeX
  const label = on ? 'Mute hover sounds' : 'Turn on hover sounds'

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={label}
      title={label}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-850/60 text-silver-300 transition-colors hover:border-accent-600 hover:text-accent-400 ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </motion.button>
  )
}

export default SoundToggle
