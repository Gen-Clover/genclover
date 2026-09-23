import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../lib/theme'

/**
 * Dark / light switch.
 *
 * A single toggle button rather than a three-way control: the site never follows
 * the OS setting, so "system" would be a meaningless option here.
 *
 * `aria-pressed` communicates the state, and the label says what pressing it
 * will do rather than what the current state is — which is what a screen reader
 * user actually needs from a switch.
 */
const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme()
  const reduced = useReducedMotion()

  const Icon = isDark ? Moon : Sun

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-pressed={!isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink-700 bg-ink-850/60 text-silver-300 transition-colors hover:border-accent-600 hover:text-accent-400 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 grid place-items-center"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export default ThemeToggle
