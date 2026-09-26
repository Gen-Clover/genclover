import { motion, useReducedMotion } from 'framer-motion'

/**
 * Animated icons for the seven delivery stages.
 *
 * Each icon is drawn on the same 24×24 stroke grid as lucide, but split into
 * parts so the part that describes the stage can move:
 *
 *   Discover  compass needle searching for a heading
 *   Define    a pen writing the line beneath it
 *   Design    layers lifting apart and settling
 *   Build     a hammer striking
 *   Validate  a check mark drawn inside the shield
 *   Launch    a rocket lifting off, exhaust flickering
 *   Grow      the trend line drawing upward, then its arrow
 *
 * Only the active stage animates; the others sit still in their final pose.
 * With reduced motion every icon is static.
 */

const LOOP = { repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }

/** Props shared by every <svg>: lucide's stroke style, sized by className. */
const svgProps = {
  viewBox: '0 0 24 24',
  className: 'block h-full w-full overflow-visible',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

/** Draws a stroke from nothing to full, looping, when `play` is true. */
const draw = (play, duration = 1.1, delay = 0) =>
  play
    ? {
        initial: { pathLength: 0 },
        animate: { pathLength: [0, 1, 1] },
        transition: { duration: duration + 0.8, times: [0, duration / (duration + 0.8), 1], delay, ...LOOP },
      }
    : { initial: false, animate: { pathLength: 1 } }

const Discover = ({ play }) => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <motion.polygon
      points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
      style={{ originX: '50%', originY: '50%', transformBox: 'fill-box' }}
      animate={play ? { rotate: [0, 70, -40, 20, 0] } : { rotate: 0 }}
      transition={play ? { duration: 2.2, ...LOOP } : { duration: 0.3 }}
    />
  </svg>
)

const Define = ({ play }) => (
  <svg {...svgProps}>
    <motion.path d="M12 20h9" {...draw(play, 1)} />
    <motion.path
      d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
      animate={play ? { x: [0, 1.5, 3, 0], y: [0, -0.6, 0, 0] } : { x: 0, y: 0 }}
      transition={play ? { duration: 1.8, times: [0, 0.3, 0.55, 1], ...LOOP } : { duration: 0.3 }}
    />
  </svg>
)

const Design = ({ play }) => (
  <svg {...svgProps}>
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <motion.path
      d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
      animate={play ? { y: [0, -1, 0] } : { y: 0 }}
      transition={play ? { duration: 1.6, ...LOOP } : { duration: 0.3 }}
    />
    <motion.path
      d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
      animate={play ? { y: [0, -2.2, 0] } : { y: 0 }}
      transition={play ? { duration: 1.6, ...LOOP } : { duration: 0.3 }}
    />
  </svg>
)

const Build = ({ play }) => (
  <svg {...svgProps}>
    {/* Pivot at the end of the handle (bottom-left), so the head swings down. */}
    <motion.g
      style={{ originX: '0%', originY: '100%', transformBox: 'fill-box' }}
      animate={play ? { rotate: [0, -28, 4, 0] } : { rotate: 0 }}
      transition={play ? { duration: 1.1, times: [0, 0.45, 0.62, 1], ...LOOP } : { duration: 0.3 }}
    >
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
    </motion.g>
  </svg>
)

const Validate = ({ play }) => (
  <svg {...svgProps}>
    <motion.path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
      style={{ originX: '50%', originY: '50%', transformBox: 'fill-box' }}
      animate={play ? { scale: [1, 1, 1.08, 1] } : { scale: 1 }}
      transition={play ? { duration: 1.9, times: [0, 0.55, 0.7, 1], ...LOOP } : { duration: 0.3 }}
    />
    <motion.path d="m9 12 2 2 4-4" {...draw(play, 0.8, 0.2)} />
  </svg>
)

const Launch = ({ play }) => (
  <svg {...svgProps}>
    <motion.g
      animate={play ? { x: [0, 1.2, 0], y: [0, -1.2, 0] } : { x: 0, y: 0 }}
      transition={play ? { duration: 1.4, ...LOOP } : { duration: 0.3 }}
    >
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </motion.g>
    {/* Exhaust */}
    <motion.path
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
      style={{ originX: '100%', originY: '0%', transformBox: 'fill-box' }}
      animate={play ? { opacity: [1, 0.35, 1], scale: [1, 0.8, 1] } : { opacity: 1, scale: 1 }}
      transition={play ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
    />
  </svg>
)

const Grow = ({ play }) => (
  <svg {...svgProps}>
    <motion.polyline points="2 17 8.5 10.5 13.5 15.5 22 7" {...draw(play, 1.1)} />
    <motion.polyline
      points="16 7 22 7 22 13"
      animate={play ? { opacity: [0, 0, 1, 1] } : { opacity: 1 }}
      transition={play ? { duration: 1.9, times: [0, 0.5, 0.62, 1], ...LOOP } : { duration: 0.3 }}
    />
  </svg>
)

const ICONS = {
  discover: Discover,
  define: Define,
  design: Design,
  build: Build,
  validate: Validate,
  launch: Launch,
  grow: Grow,
}

/**
 * `stage` is the stage title (e.g. "Discover"). `active` plays the animation.
 * Falls back to the stage's static lucide icon for an unknown title.
 */
const StageIcon = ({ stage, active = false, fallback: Fallback, className = 'h-5 w-5' }) => {
  const reduced = useReducedMotion()
  const Icon = ICONS[stage?.toLowerCase()]
  if (!Icon) return Fallback ? <Fallback className={className} aria-hidden="true" /> : null
  return (
    <span className={`inline-block ${className}`}>
      <Icon play={active && !reduced} />
    </span>
  )
}

export default StageIcon
