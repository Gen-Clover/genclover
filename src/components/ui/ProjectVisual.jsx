import { CloverMark } from '../brand/Logo'

/**
 * Project imagery.
 *
 * Client screenshots cannot be published, so each project is illustrated with
 * a diagram of its own delivery flow, drawn from the `flow` steps in its case
 * study. The diagram is real information about the project rather than a stock
 * photo or a fabricated interface mockup (Spec §4, §25).
 *
 * Order of preference: `project.heroImage` (a real image) → the flow diagram →
 * a plain brand panel for a project with no flow defined.
 */

const VB_W = 400
const VB_H = 250

/** Node centers for 1–8 steps: one row up to four, otherwise a two-row snake. */
const layoutNodes = (count) => {
  if (count <= 4) {
    const gap = VB_W / (count + 1)
    return Array.from({ length: count }, (_, i) => ({ x: gap * (i + 1), y: 118 }))
  }
  const top = Math.ceil(count / 2)
  const bottom = count - top
  const gapTop = VB_W / (top + 1)
  const nodes = Array.from({ length: top }, (_, i) => ({ x: gapTop * (i + 1), y: 78 }))
  // The second row runs right to left, so the flow reads as one continuous path.
  for (let i = 0; i < bottom; i += 1) {
    nodes.push({ x: gapTop * (top - i), y: 172 })
  }
  return nodes
}

/** Path between two consecutive nodes, stopping short of each circle. */
const connectorPath = (a, b, r) => {
  if (a.y === b.y) {
    const dir = Math.sign(b.x - a.x)
    return `M ${a.x + dir * (r + 4)} ${a.y} L ${b.x - dir * (r + 8)} ${b.y}`
  }
  // Row change: drop straight down on the right-hand side.
  return `M ${a.x} ${a.y + r + 22} L ${b.x} ${b.y - r - 8}`
}

const FlowDiagram = ({ flow, title, id }) => {
  const markerId = `pv-arrow-${id}`
  const steps = flow.slice(0, 8)
  const nodes = layoutNodes(steps.length)
  const r = steps.length > 4 ? 15 : 17
  const last = steps.length - 1

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label={`${title}: delivery flow, ${steps.map((s) => s.title).join(', ')}`}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" className="fill-accent-600" />
        </marker>
      </defs>

      {nodes.slice(0, -1).map((a, i) => (
        <path
          key={`c${i}`}
          d={connectorPath(a, nodes[i + 1], r)}
          className="stroke-ink-600"
          strokeWidth="1.5"
          strokeDasharray={a.y === nodes[i + 1].y ? undefined : '3 3'}
          fill="none"
          markerEnd={`url(#${markerId})`}
        />
      ))}

      {steps.map((step, i) => {
        const { x, y } = nodes[i]
        const emphasis = i === last
        return (
          <g key={step.number ?? i}>
            <circle
              cx={x}
              cy={y}
              r={r}
              className={emphasis ? 'fill-accent-950 stroke-accent-500' : 'fill-ink-850 stroke-ink-600'}
              strokeWidth="1.5"
            />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              className={`font-display ${emphasis ? 'fill-accent-400' : 'fill-silver-400'}`}
              fontSize="11"
              fontWeight="600"
            >
              {step.number ?? String(i + 1).padStart(2, '0')}
            </text>
            <text
              x={x}
              y={y + r + 16}
              textAnchor="middle"
              className="fill-silver-200"
              fontSize="11.5"
              fontWeight="500"
            >
              {step.title}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Stable pseudo-random seed from the slug, so a project always looks the same. */
const seedFrom = (slug = '') =>
  [...slug].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 997, 7)

const ProjectVisual = ({ project, className = '', aspect = 'aspect-[16/10]', priority = false }) => {
  const { heroImage, title, slug } = project
  const flow = project.caseStudy?.flow

  if (heroImage) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-ink-900 ${aspect} ${className}`}>
        <img
          src={heroImage}
          alt={`${title}: project visual`}
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
      role={flow?.length ? undefined : 'img'}
      aria-label={flow?.length ? undefined : `${title}: Gen Clover brand graphic`}
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
      {flow?.length ? (
        <>
          <div className="absolute bottom-3 right-3" aria-hidden="true">
            <CloverMark className="h-7 w-7 opacity-[0.22]" />
          </div>
          <FlowDiagram flow={flow} title={title} id={slug} />
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <CloverMark className="h-16 w-16 opacity-[0.16]" />
        </div>
      )}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-accent-line opacity-60"
        aria-hidden="true"
      />
    </div>
  )
}

export default ProjectVisual
