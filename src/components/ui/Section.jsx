import { motion } from 'framer-motion'
import { useMotionVariants, revealOnce } from '../../lib/motion'

/**
 * Section scaffolding — the typographic rhythm every page is built from.
 * Keeping heading levels here means page components can't accidentally skip
 * from h1 to h3. (Spec §4, §22 accessibility)
 */

export const Eyebrow = ({ children, className = '' }) => (
  <p className={`eyebrow ${className}`}>{children}</p>
)

export const Section = ({ id, className = '', children, muted = false, ...props }) => (
  <section
    id={id}
    className={`section ${muted ? 'bg-ink-900' : 'bg-ink-950'} ${className}`}
    {...props}
  >
    <div className="container">{children}</div>
  </section>
)

/**
 * A section's heading block.
 * `index` renders the two-digit section number from the homepage order (§5.2).
 */
export const SectionHeader = ({
  eyebrow,
  index,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
  action,
  className = '',
}) => {
  const v = useMotionVariants()
  const centered = align === 'center'

  return (
    <motion.div
      variants={v.fadeUp}
      {...revealOnce}
      className={`mb-8 flex flex-col gap-5 md:mb-10 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={`max-w-2xl ${centered ? 'mx-auto' : ''}`}>
        {(eyebrow || index) && (
          <div
            className={`mb-4 flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
          >
            {index && (
              <span className="font-display text-xs font-semibold tracking-brand text-silver-500">
                {index}
              </span>
            )}
            {index && <span className="h-px w-6 bg-accent-600" />}
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          </div>
        )}
        <Heading className="text-3xl leading-[1.12] md:text-4xl lg:text-[2.75rem]">{title}</Heading>
        {description && (
          <p className="mt-4 max-w-prose text-base leading-relaxed text-silver-400 md:text-lg">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}

/** A page's top band: eyebrow, h1, supporting copy, CTAs. */
export const PageHero = ({ eyebrow, title, description, children, className = '' }) => {
  const v = useMotionVariants()

  return (
    <header className={`relative overflow-hidden border-b border-ink-800 bg-ink-950 ${className}`}>
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent-900/25 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container relative pb-12 pt-28 md:pb-14 md:pt-32">
        <motion.div initial="hidden" animate="visible" variants={v.stagger(0.09)} className="max-w-3xl">
          {eyebrow && (
            <motion.div variants={v.fadeUp}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </motion.div>
          )}
          <motion.h1
            variants={v.fadeUp}
            className="mt-4 text-4xl leading-[1.08] md:text-5xl"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={v.fadeUp}
              className="mt-4 max-w-prose text-lg leading-relaxed text-silver-400"
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div variants={v.fadeUp} className="mt-7 flex flex-wrap gap-3">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  )
}
