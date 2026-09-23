import { CloverMark } from '../brand/Logo'

/**
 * Project imagery.
 *
 * Real screenshots are required for every published project (Spec §19), but
 * until the Product Owner supplies them we must not fill the gap with stock
 * photography or a fabricated interface mockup (Spec §4, §25). So a project
 * without a `heroImage` gets a deterministic geometric panel drawn from the
 * brand system instead — clearly a graphic, never mistaken for a screenshot.
 *
 * Drop a real image path into `project.heroImage` and this renders that instead,
 * with no other change needed.
 */

/** Stable pseudo-random seed from the slug, so a project always looks the same. */
const seedFrom = (slug = '') =>
  [...slug].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 997, 7)

const ProjectVisual = ({ project, className = '', aspect = 'aspect-[16/10]', priority = false }) => {
  const { heroImage, title, slug } = project

  if (heroImage) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-ink-900 ${aspect} ${className}`}>
        <img
          src={heroImage}
          alt={`${title} - project visual`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const seed = seedFrom(slug)
  const angle = 100 + (seed % 40)
  const offset = 8 + (seed % 26)

  return (
    <div
      role="img"
      aria-label={`${title} - Gen Clover brand graphic used in place of a project screenshot`}
      className={`relative overflow-hidden rounded-lg border border-ink-700 bg-ink-900 ${aspect} ${className}`}
    >
      {/* Diagonal structure + controlled glow, per the brand visual system */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, var(--visual-a) 0%, var(--visual-b) ${offset}%, var(--visual-c) 62%, var(--visual-d) 82%, var(--visual-e) 100%)`,
        }}
        aria-hidden="true"
      />
      <div className="grid-lines absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-800/30 blur-[70px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent-700/70 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
        <CloverMark className="h-16 w-16 opacity-[0.16]" />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-accent-line opacity-60"
        aria-hidden="true"
      />
    </div>
  )
}

export default ProjectVisual
