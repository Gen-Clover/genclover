import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * The single button in the system. Every CTA on the site renders through this,
 * so focus states, sizing and hover motion stay consistent. (Spec §4)
 */

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap ' +
  'transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

const variants = {
  primary: 'bg-accent-600 text-white hover:bg-accent-500 shadow-glow-sm hover:shadow-glow',
  secondary:
    'border border-ink-600 bg-ink-850/60 text-silver-100 hover:border-accent-600 hover:bg-ink-800',
  ghost: 'text-silver-300 hover:text-silver-100 hover:bg-ink-800',
  link: 'text-accent-400 hover:text-accent-300 underline-offset-4 hover:underline px-0',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'px-8 py-4 text-base',
}

/** Hoisted: creating this inside render would remount the link on every pass. */
const MotionLink = motion(Link)

const Button = forwardRef(
  ({ as, to, href, variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const reduced = useReducedMotion()
    const classes = `${base} ${variants[variant]} ${variant === 'link' ? '' : sizes[size]} ${className}`
    const hover = reduced ? undefined : { y: -2 }
    const tap = reduced ? undefined : { scale: 0.98 }

    if (to) {
      return (
        <MotionLink ref={ref} to={to} className={classes} whileHover={hover} whileTap={tap} {...props}>
          {children}
        </MotionLink>
      )
    }

    if (href) {
      return (
        <motion.a ref={ref} href={href} className={classes} whileHover={hover} whileTap={tap} {...props}>
          {children}
        </motion.a>
      )
    }

    const Tag = as ?? motion.button
    return (
      <Tag ref={ref} className={classes} whileHover={hover} whileTap={tap} {...props}>
        {children}
      </Tag>
    )
  }
)

Button.displayName = 'Button'

export default Button
