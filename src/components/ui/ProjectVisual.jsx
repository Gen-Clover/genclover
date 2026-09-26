import { useReducedMotion } from 'framer-motion'
import { CloverMark } from '../brand/Logo'

/**
 * Project imagery.
 *
 * Client screenshots cannot be published, so each project is illustrated with
 * a diagram generated from its own case study: an animated architecture map
 * (the `architecture.layers` of the case study) on cards, and the delivery
 * `flow` on the project page. Both are real information about the project
 * rather than stock photos or fabricated interface mockups (Spec §4, §25).
 *
 * Order of preference: `project.heroImage` (a real image) → the requested
 * diagram → the other diagram → a plain brand panel.
 */

const VB_W = 400
const VB_H = 225

/** Node centers for 1–8 steps: one row up to four, otherwise a two-row snake. */
const layoutNodes = (count) => {
  if (count <= 4) {
    const gap = VB_W / (count + 1)
    return Array.from({ length: count }, (_, i) => ({ x: gap * (i + 1), y: 104 }))
  }
  const top = Math.ceil(count / 2)
  const bottom = count - top
  const gapTop = VB_W / (top + 1)
  const nodes = Array.from({ length: top }, (_, i) => ({ x: gapTop * (i + 1), y: 66 }))
  // The second row runs right to left, so the flow reads as one continuous path.
  for (let i = 0; i < bottom; i += 1) {
    nodes.push({ x: gapTop * (top - i), y: 152 })
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


/* ------------------------------------------------------ architecture map */

const stripIndex = (text = '') => text.replace(/^\d+\s*·\s*/, '')

/** Shorten to fit a box, at a word boundary where possible. */
const fit = (text, max) => {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.5 ? cut.slice(0, space) : cut).replace(/[,\s]+$/, '')}…`
}

const MAX_NODES = 3

/**
 * Architecture layers as panels, left to right (a two-row snake past four
 * layers), with pulses travelling along the connectors to show data moving
 * through the system. Pulses are omitted for visitors who prefer reduced motion.
 */
const ArchitectureMap = ({ layers, title, id }) => {
  const reduced = useReducedMotion()
  const list = layers.slice(0, 6)
  const rows = list.length > 4 ? 2 : 1
  const perRow = Math.ceil(list.length / rows)
  const padX = 12
  const padY = 12
  const gapX = 16
  const gapY = 18
  const panelW = (VB_W - padX * 2 - gapX * (perRow - 1)) / perRow
  const nodeH = rows === 2 ? 20 : 30
  const nodeGap = rows === 2 ? 4 : 8
  const headerH = rows === 2 ? 22 : 32
  // Panels are only as tall as their content, so there is no empty band
  // inside them; the whole map is then centered in the frame.
  const maxNodes = Math.min(MAX_NODES, Math.max(1, ...list.map((l) => l.nodes.length)))
  const contentH = headerH + maxNodes * nodeH + (maxNodes - 1) * nodeGap + 10
  const panelH = Math.min((VB_H - padY * 2 - gapY * (rows - 1)) / rows, contentH)
  const offsetY = (VB_H - (rows * panelH + gapY * (rows - 1))) / 2
  const fontSize = rows === 2 ? 8.5 : 9.5
  const maxChars = Math.max(8, Math.floor((panelW - 20) / (fontSize * 0.62)))

  const panels = list.map((layer, i) => {
    const row = Math.floor(i / perRow)
    const col = i % perRow
    // Second row runs right to left so the chain reads as one path.
    const visualCol = row === 1 ? perRow - 1 - col : col
    return {
      layer,
      x: padX + visualCol * (panelW + gapX),
      y: offsetY + row * (panelH + gapY),
      row,
    }
  })

  const connectors = panels.slice(0, -1).map((a, i) => {
    const b = panels[i + 1]
    if (a.row === b.row) {
      const y = a.y + panelH / 2
      const leftToRight = b.x > a.x
      const x1 = leftToRight ? a.x + panelW : a.x
      const x2 = leftToRight ? b.x : b.x + panelW
      return `M ${x1} ${y} L ${x2} ${y}`
    }
    const x = a.x + panelW / 2
    return `M ${x} ${a.y + panelH} L ${x} ${b.y}`
  })

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label={`${title}: architecture, ${list.map((l) => stripIndex(l.label)).join(', ')}`}
    >
      {connectors.map((d, i) => (
        <g key={`c${i}`}>
          <path d={d} className="stroke-ink-600" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          {!reduced && (
            <circle r="2.6" className="fill-accent-500">
              <animateMotion
                dur="1.6s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
                path={d}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          )}
        </g>
      ))}

      {panels.map(({ layer, x, y }, i) => {
        const nodes = layer.nodes.slice(0, MAX_NODES)
        const extra = layer.nodes.length - nodes.length
        const top = y + headerH
        return (
          <g key={`${id}-p${i}`}>
            <rect
              x={x}
              y={y}
              width={panelW}
              height={panelH}
              rx="7"
              className={layer.emphasis ? 'fill-accent-950/60 stroke-accent-600' : 'fill-ink-900/80 stroke-ink-700'}
              strokeWidth="1"
            >
              {layer.emphasis && !reduced && (
                <animate attributeName="stroke-opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite" />
              )}
            </rect>
            <text
              x={x + 8}
              y={y + (rows === 2 ? 14 : 20)}
              className={`font-display ${layer.emphasis ? 'fill-accent-400' : 'fill-silver-500'}`}
              fontSize={fontSize - 0.5}
              fontWeight="600"
              letterSpacing="0.06em"
            >
              {fit(stripIndex(layer.label).toUpperCase(), maxChars - (extra > 0 ? 5 : 2))}
            </text>
            {nodes.map((node, n) => (
              <g key={n}>
                <rect
                  x={x + 6}
                  y={top + n * (nodeH + nodeGap)}
                  width={panelW - 12}
                  height={nodeH}
                  rx="4"
                  className="fill-ink-850 stroke-ink-600"
                  strokeWidth="0.75"
                />
                <text
                  x={x + 11}
                  y={top + n * (nodeH + nodeGap) + nodeH / 2 + fontSize * 0.36}
                  className="fill-silver-200"
                  fontSize={fontSize}
                >
                  {fit(stripIndex(node.title), maxChars)}
                </text>
              </g>
            ))}
            {extra > 0 && (
              <text
                x={x + panelW - 8}
                y={y + (rows === 2 ? 14 : 20)}
                textAnchor="end"
                className="fill-silver-600"
                fontSize={fontSize - 0.5}
              >
                +{extra}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

const ProjectVisual = ({
  project,
  className = '',
  aspect = 'aspect-[16/10]',
  priority = false,
  prefer = 'architecture',
}) => {
  const { heroImage, title, slug } = project
  const flow = project.caseStudy?.flow
  const layers = project.caseStudy?.architecture?.layers
  const diagram =
    prefer === 'flow'
      ? (flow?.length && 'flow') || (layers?.length && 'architecture')
      : (layers?.length && 'architecture') || (flow?.length && 'flow')

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
      role={diagram ? undefined : 'img'}
      aria-label={diagram ? undefined : `${title}: Gen Clover brand graphic`}
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
      {diagram === 'architecture' && <ArchitectureMap layers={layers} title={title} id={slug} />}
      {diagram === 'flow' && (
        <>
          <div className="absolute bottom-3 right-3" aria-hidden="true">
            <CloverMark className="h-7 w-7 opacity-[0.22]" />
          </div>
          <FlowDiagram flow={flow} title={title} id={slug} />
        </>
      )}
      {!diagram && (
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
