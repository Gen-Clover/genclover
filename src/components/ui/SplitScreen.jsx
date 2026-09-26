/**
 * First-screen layout shared by Services, Work, Industries and How We Work:
 * an index on the left and a translucent preview panel on the right, sized to
 * fit one screen at 80–100% browser zoom. On small screens only the left side
 * renders; each page shows its own mobile fallback below.
 */
export const SplitScreen = ({ left, right, cols = 'lg:grid-cols-[1fr_1.05fr]', label }) => (
  <section
    className="relative isolate overflow-hidden border-b border-ink-800 bg-ink-950"
    aria-label={label}
  >
    <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
    <div
      className="pointer-events-none absolute -right-40 top-0 h-[40rem] w-[40rem] rounded-full bg-accent-900/25 blur-[150px]"
      aria-hidden="true"
    />
    <div
      className={`container relative grid gap-10 pb-12 pt-28 lg:h-[100svh] lg:max-h-[62rem] lg:min-h-[36rem] lg:gap-12 lg:pb-6 lg:pt-[5.5rem] ${cols}`}
    >
      <div className="flex min-h-0 flex-col justify-center">{left}</div>
      <div className="hidden min-h-0 lg:flex lg:items-center">{right}</div>
    </div>
  </section>
)

/** The frosted panel on the right of a SplitScreen. */
export const GlassPanel = ({ children, className = '' }) => (
  <div
    className={`relative max-h-full w-full overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900/60 p-6 shadow-lift backdrop-blur-xl ${className}`}
    aria-live="polite"
  >
    {children}
  </div>
)

/** Motion props for swapping panel content. */
export const panelSwap = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
}
