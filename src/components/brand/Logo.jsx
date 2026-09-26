import { useId } from 'react'

/**
 * Gen Clover brand marks, drawn as SVG so they stay crisp at any size.
 * (Spec §2 visual system)
 *
 * - CloverMark: the four-petal emblem. Three silver petals, one accent red —
 *   the four petals standing for Intelligence, Innovation, Automation, Growth.
 * - Wordmark: GEN CLOVER with the distinctive three-red-bar E.
 */

/**
 * One petal: a broad rounded lobe tapering to a point at the origin.
 * Drawn pointing up; four rotated copies make the clover. The lobe is
 * deliberately wide — a narrow leaf reads as an X rather than a flower.
 */
export const PETAL_PATH =
  'M0 0 C -20 -10, -34 -26, -28 -41 C -22 -56, 22 -56, 28 -41 C 34 -26, 20 -10, 0 0 Z'

export const CloverMark = ({ className = 'h-8 w-8', title }) => {
  /**
   * The mark renders several times per page (header, footer, CTA, project
   * visuals). Hard-coded gradient ids would therefore be duplicated across the
   * document, which is invalid HTML and lets one instance resolve another
   * instance's gradient. useId gives each instance its own.
   */
  const uid = useId().replace(/:/g, '')
  const silver = `gc-petal-silver-${uid}`
  const accent = `gc-petal-accent-${uid}`

  return (
    <svg
      viewBox="-72 -72 144 144"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      <defs>
        {/* Neutral petals follow the theme — white petals would vanish on a light
            page. The red petal is fixed brand red in both themes. */}
        <linearGradient id={silver} x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="var(--clover-1)" />
          <stop offset="50%" stopColor="var(--clover-2)" />
          <stop offset="100%" stopColor="var(--clover-3)" />
        </linearGradient>
        <linearGradient id={accent} x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#FF5F64" />
          <stop offset="50%" stopColor="#E01F26" />
          <stop offset="100%" stopColor="#8E0F14" />
        </linearGradient>
      </defs>

      {/* Rotated 45° so the petals read as a pinwheel, accent petal upper-right */}
      <g transform="rotate(45)">
        <path d={PETAL_PATH} fill={`url(#${accent})`} />
        <path d={PETAL_PATH} fill={`url(#${silver})`} transform="rotate(90)" />
        <path d={PETAL_PATH} fill={`url(#${silver})`} transform="rotate(180)" />
        <path d={PETAL_PATH} fill={`url(#${silver})`} transform="rotate(270)" />
      </g>
    </svg>
  )
}

/**
 * The three-red-bar E from the wordmark.
 *
 * Drawn as SVG rather than stacked divs: at header sizes (~16px) sub-pixel div
 * heights blur the three bars into one smudge, whereas the SVG keeps the gaps
 * legible. Sized in em so it tracks whatever font-size the wordmark is set at.
 */
const BarE = () => (
  <svg
    viewBox="0 0 10 15"
    aria-hidden="true"
    focusable="false"
    className="h-[0.72em] w-[0.5em] shrink-0 text-brand-red"
    style={{ marginInline: '0.07em', verticalAlign: 'baseline' }}
    preserveAspectRatio="none"
  >
    <rect y="0" width="10" height="3.4" rx="0.4" fill="currentColor" />
    <rect y="5.8" width="10" height="3.4" rx="0.4" fill="currentColor" />
    <rect y="11.6" width="10" height="3.4" rx="0.4" fill="currentColor" />
  </svg>
)

export const Wordmark = ({ className = 'text-xl' }) => (
  <span
    className={`inline-flex items-baseline font-display font-bold uppercase leading-none tracking-brand text-silver-100 ${className}`}
  >
    {/* The visible glyphs omit the E, which BarE draws — so give AT the real word. */}
    <span className="sr-only">Gen Clover</span>
    <span aria-hidden="true" className="inline-flex items-baseline">
      GEN
      <span className="w-[0.34em]" />
      CLOV
      <BarE />R
    </span>
  </span>
)

/**
 * The lockup used in the header and footer.
 * `variant`: 'full' (mark + wordmark) | 'mark' | 'wordmark'
 */
const Logo = ({
  variant = 'full',
  className = '',
  markClassName = 'h-7 w-7',
  wordClassName = 'text-lg',
}) => {
  if (variant === 'mark')
    return <CloverMark className={`${markClassName} ${className}`} title="Gen Clover" />
  if (variant === 'wordmark') return <Wordmark className={`${wordClassName} ${className}`} />

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CloverMark className={markClassName} />
      <Wordmark className={wordClassName} />
    </span>
  )
}

export default Logo
