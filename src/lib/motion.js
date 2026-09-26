/**
 * Shared motion vocabulary. (Spec §4.1)
 *
 * Animation is used for hierarchy and polish, not on every element. Everything
 * here is routed through Framer Motion's `useReducedMotion`, so a visitor with
 * prefers-reduced-motion set gets the same content with no movement.
 */
import { useReducedMotion } from 'framer-motion'

/** Gen Clover's standard easing — a firm settle, not a bounce. */
export const EASE = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
})

/** Standard `whileInView` props for a section that reveals once on scroll. */
export const revealOnce = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-80px' },
}

/**
 * Returns variants that collapse to a plain opacity change — or to nothing at
 * all — when the visitor prefers reduced motion.
 */
export const useMotionVariants = () => {
  const reduced = useReducedMotion()

  if (reduced) {
    const still = { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    return {
      reduced: true,
      fadeUp: still,
      fadeIn: still,
      stagger: () => ({ hidden: {}, visible: {} }),
      hoverLift: {},
      tapPress: {},
    }
  }

  return {
    reduced: false,
    fadeUp,
    fadeIn,
    stagger,
    hoverLift: { y: -4, transition: { duration: 0.25, ease: EASE } },
    tapPress: { scale: 0.985 },
  }
}
