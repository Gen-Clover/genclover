import { useEffect, useId, useRef, useState } from 'react'
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
 * diagram → the other diagram → a plain brand panel. "Architecture" means the
 * flow chart from architectureDiagrams.js when the project has one, else the
 * layered map.
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
  const r = steps.length > 4 ? 17 : 19
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
              fontSize="12"
              fontWeight="600"
            >
              {step.number ?? String(i + 1).padStart(2, '0')}
            </text>
            <text
              x={x}
              y={y + r + 18}
              textAnchor="middle"
              className="fill-silver-200"
              fontSize="14"
              fontWeight="600"
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

/**
 * Wrap text onto at most `maxLines` lines of `maxChars`, breaking at spaces.
 * Only a word longer than a whole line is shortened, so labels stay readable.
 */
const wrap = (text, maxChars, maxLines = 2) => {
  // Break at spaces, and after hyphens so "Search-grounded" can wrap.
  const words = text.split(/\s+/).flatMap((w) => w.split(/(?<=-)/))
  const lines = []
  let line = ''
  for (const word of words) {
    const joiner = line.endsWith('-') ? '' : ' '
    const next = line ? `${line}${joiner}${word}` : word
    if (next.length <= maxChars) {
      line = next
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  const out = lines.slice(0, maxLines)
  if (lines.length > maxLines) {
    // Fold the remainder into the last line; the box shows as much as fits.
    out[maxLines - 1] = lines.slice(maxLines - 1).join(' ')
  }
  return out.map((l) => (l.length > maxChars ? `${l.slice(0, maxChars - 1)}…` : l))
}

/**
 * Architecture layers as panels, left to right (a two-row snake past four
 * layers), with pulses travelling along the connectors to show data moving
 * through the system. Labels wrap onto two lines rather than being cut.
 * Pulses are omitted for visitors who prefer reduced motion.
 */
const ArchitectureMap = ({ layers, title, id }) => {
  const reduced = useReducedMotion()
  const list = layers.slice(0, 6)
  const rows = list.length > 4 ? 2 : 1
  const perRow = Math.ceil(list.length / rows)
  const padX = 10
  const gapX = rows === 2 ? 18 : 14
  const gapY = 16
  const panelW = (VB_W - padX * 2 - gapX * (perRow - 1)) / perRow

  const fontSize = rows === 2 ? 8 : 8.5
  const lineH = fontSize + 2.5
  const maxNodes = rows === 2 ? 2 : 3
  const labelChars = Math.floor((panelW - 12) / ((fontSize - 0.5) * 0.55))
  const nodeChars = Math.floor((panelW - 18) / (fontSize * 0.56))

  // Lay out every panel's text first, so panel height fits the tallest one.
  const laidOut = list.map((layer) => {
    const label = wrap(stripIndex(layer.label), labelChars, 3)
    const nodes = layer.nodes.slice(0, maxNodes).map((n) => {
      const text = stripIndex(n.title)
      // A single word longer than the box gets a slightly smaller font.
      const longest = Math.max(...text.split(/[\s-]+/).map((w) => w.length))
      const scale = Math.min(1, nodeChars / longest)
      return { lines: wrap(text, Math.floor(nodeChars / scale), 3), size: fontSize * scale }
    })
    const extra = layer.nodes.length - nodes.length
    const headerH = 8 + label.length * lineH + 4
    const nodeHeights = nodes.map((n) => n.lines.length * lineH + 7)
    const bodyH = nodeHeights.reduce((sum, h) => sum + h, 0) + Math.max(0, nodes.length - 1) * 5
    return { layer, label, nodes, nodeHeights, extra, headerH, contentH: headerH + bodyH + 8 + (extra > 0 ? 10 : 0) }
  })
  const panelH = Math.max(...laidOut.map((p) => p.contentH))
  const totalH = rows * panelH + (rows - 1) * gapY
  const offsetY = Math.max(6, (VB_H - totalH) / 2)

  const panels = laidOut.map((p, i) => {
    const row = Math.floor(i / perRow)
    const col = i % perRow
    // Second row runs right to left so the chain reads as one path.
    const visualCol = row === 1 ? perRow - 1 - col : col
    return { ...p, x: padX + visualCol * (panelW + gapX), y: offsetY + row * (panelH + gapY), row }
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
            <circle r="2.6" opacity="0" className="fill-accent-500">
              <set attributeName="opacity" to="1" begin={`${i * 0.4}s`} />
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

      {panels.map(({ layer, label, nodes, nodeHeights, extra, headerH, x, y }, i) => {
        let cursor = y + headerH
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
              x={x + 7}
              y={y + 8 + fontSize - 1}
              className={`font-display ${layer.emphasis ? 'fill-accent-400' : 'fill-silver-500'}`}
              fontSize={fontSize - 0.5}
              fontWeight="700"
            >
              {label.map((l, li) => (
                <tspan key={li} x={x + 7} dy={li === 0 ? 0 : lineH}>
                  {l}
                </tspan>
              ))}
            </text>
            {nodes.map(({ lines, size }, n) => {
              const top = cursor
              const h = nodeHeights[n]
              cursor += h + 5
              return (
                <g key={n}>
                  <rect
                    x={x + 5}
                    y={top}
                    width={panelW - 10}
                    height={h}
                    rx="4"
                    className="fill-ink-850 stroke-ink-600"
                    strokeWidth="0.75"
                  />
                  <text x={x + 9} y={top + 3.5 + fontSize} className="fill-silver-200" fontSize={size}>
                    {lines.map((l, li) => (
                      <tspan key={li} x={x + 9} dy={li === 0 ? 0 : lineH}>
                        {l}
                      </tspan>
                    ))}
                  </text>
                </g>
              )
            })}
            {extra > 0 && (
              <text
                x={x + panelW - 6}
                y={y + panelH - 4}
                textAnchor="end"
                className="fill-silver-600"
                fontSize={fontSize - 1}
              >
                +{extra} more
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ---------------------------------------------------- architecture graph */

/** Rough text width for Inter at a given size — enough to size pills. */
const textWidth = (text, size) => text.length * size * 0.56

const NODE_TONES = {
  default: { box: 'fill-ink-900 stroke-ink-600', title: 'fill-silver-100', line: 'fill-silver-400' },
  accent: { box: 'fill-accent-950/40 stroke-accent-700', title: 'fill-silver-100', line: 'fill-silver-400' },
  highlight: { box: 'fill-ink-800 stroke-silver-500', title: 'fill-silver-100', line: 'fill-silver-300' },
  muted: { box: 'fill-ink-900/60 stroke-ink-700', title: 'fill-silver-300', line: 'fill-silver-500' },
}

const GROUP = { header: 66, pad: 16, gap: 10, inline: 38, stacked: 52 }
const groupHeight = (g) =>
  GROUP.header + g.items.length * (GROUP[g.layout] + GROUP.gap) - GROUP.gap + GROUP.pad

/** A multi-line label: string or array of strings, one tspan per line. */
const Label = ({ text, x, y, anchor = 'middle', className = 'fill-silver-500', size = 11 }) => {
  const lines = Array.isArray(text) ? text : [text]
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} className={className}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size + 3}>
          {l}
        </tspan>
      ))}
    </text>
  )
}

/** Dots travelling along connectors, the same motion as the layered map. */
const Pulse = ({ d, i, reduced }) =>
  reduced ? null : (
    <circle r="3.4" opacity="0" className="fill-accent-500">
      {/* Hidden until its staggered start; otherwise it waits at the canvas origin. */}
      <set attributeName="opacity" to="1" begin={`${(i * 0.3).toFixed(2)}s`} />
      <animateMotion dur="1.8s" begin={`${(i * 0.3).toFixed(2)}s`} repeatCount="indefinite" path={d} />
    </circle>
  )

/** Glow on the part of the system the project is about. */
const Glow = ({ reduced }) =>
  reduced ? null : (
    <animate attributeName="stroke-opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite" />
  )

const GraphDiagram = ({ diagram, uid, reduced }) => (
  <>
    {diagram.edges.map((e, i) => (
      <g key={`e${i}`}>
        <path
          d={e.d}
          fill="none"
          strokeWidth="1.6"
          className="stroke-ink-500"
          strokeDasharray={e.dashed ? '6 5' : undefined}
          markerEnd={e.arrow === 'none' ? undefined : `url(#${uid}-${e.dot ? 'dot' : 'arrow'})`}
          markerStart={e.arrow === 'both' ? `url(#${uid}-arrow)` : undefined}
        />
        <Pulse d={e.d} i={i} reduced={reduced} />
        {e.label && <Label text={e.label} x={e.lx} y={e.ly} anchor={e.anchor} />}
      </g>
    ))}

    {diagram.nodes.map((n, i) => {
      const tone = NODE_TONES[n.tone ?? 'default']
      return (
        <g key={`n${i}`}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" strokeWidth="1.2" className={tone.box} />
          <text x={n.x + 14} y={n.y + 26} fontSize="14.5" fontWeight="600" className={tone.title}>
            {n.title}
          </text>
          {n.lines?.map((l, li) => (
            <text key={li} x={n.x + 14} y={n.y + 46 + li * 16} fontSize="12" className={tone.line}>
              {l}
            </text>
          ))}
        </g>
      )
    })}

    {diagram.groups?.map((g, gi) => {
      const h = groupHeight(g)
      const itemH = GROUP[g.layout]
      return (
        <g key={`g${gi}`}>
          <rect
            x={g.x}
            y={g.y}
            width={g.w}
            height={h}
            rx="12"
            strokeWidth="1.3"
            className={g.emphasis ? 'fill-accent-950/30 stroke-accent-600' : 'fill-ink-900 stroke-ink-600'}
          >
            {g.emphasis && <Glow reduced={reduced} />}
          </rect>
          <text x={g.x + 16} y={g.y + 28} fontSize="15" fontWeight="700" className="fill-silver-100">
            {g.title}
          </text>
          <text x={g.x + 16} y={g.y + 48} fontSize="12" className="fill-silver-400">
            {g.subtitle}
          </text>
          {g.items.map((item, ii) => {
            const top = g.y + GROUP.header + ii * (itemH + GROUP.gap)
            return (
              <g key={ii}>
                <rect
                  x={g.x + 14}
                  y={top}
                  width={g.w - 28}
                  height={itemH}
                  rx="8"
                  strokeWidth="1.1"
                  className={item.dashed ? 'fill-transparent stroke-accent-500' : 'fill-ink-850 stroke-ink-600'}
                  strokeDasharray={item.dashed ? '5 4' : undefined}
                />
                {g.layout === 'inline' ? (
                  <>
                    <text x={g.x + 28} y={top + 24} fontSize="13" fontWeight="700" className="fill-silver-100">
                      {item.title}
                    </text>
                    <text x={g.x + 160} y={top + 24} fontSize="12" className="fill-silver-300">
                      {item.text}
                    </text>
                  </>
                ) : (
                  <>
                    <text x={g.x + 28} y={top + 21} fontSize="13" fontWeight="700" className="fill-silver-100">
                      {item.title}
                    </text>
                    <text x={g.x + 28} y={top + 39} fontSize="12" className="fill-silver-400">
                      {item.text}
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </g>
      )
    })}
  </>
)

const RowsDiagram = ({ diagram, reduced }) => {
  const { width: W, height: H, rows } = diagram
  const pad = 20
  const gap = 14
  const rowH = (H - pad * 2 - gap * (rows.length - 1)) / rows.length
  const pillH = rowH - 26
  const labelW = 190
  const itemsX = pad + 16 + labelW + 18
  const itemsMax = W - pad - 16 - itemsX

  return rows.map((row, ri) => {
    const y = pad + ri * (rowH + gap)
    const natural = row.items.map((t) => Math.max(textWidth(t, 12.5) + 30, 104))
    const gapX = 12
    const total = natural.reduce((a, b) => a + b, 0) + gapX * (row.items.length - 1)
    const scale = Math.min(1, itemsMax / total)
    let cursor = itemsX
    const itemTone = row.emphasis
      ? 'fill-accent-950/50 stroke-accent-500'
      : row.muted
        ? 'fill-ink-900/60 stroke-ink-700'
        : 'fill-ink-850 stroke-ink-500'
    const itemText = row.emphasis ? 'fill-silver-100' : row.muted ? 'fill-silver-400' : 'fill-silver-200'
    const connector = `M${pad + 16 + labelW / 2} ${y + rowH} V${y + rowH + gap}`

    return (
      <g key={row.label}>
        <rect
          x={pad}
          y={y}
          width={W - pad * 2}
          height={rowH}
          rx="12"
          strokeWidth="1.2"
          className={row.emphasis ? 'fill-accent-950/25 stroke-accent-600' : 'fill-ink-900/70 stroke-ink-700'}
        >
          {row.emphasis && <Glow reduced={reduced} />}
        </rect>
        <rect
          x={pad + 16}
          y={y + 13}
          width={labelW}
          height={pillH}
          rx="8"
          strokeWidth="1.2"
          className={row.emphasis ? 'fill-accent-950/60 stroke-accent-500' : 'fill-ink-850 stroke-ink-500'}
        />
        <text x={pad + 30} y={y + rowH / 2 + 5} fontSize="14" fontWeight="700" className="fill-silver-100">
          {row.label}
        </text>
        {row.items.map((item, ii) => {
          const w = natural[ii] * scale
          const x = cursor
          cursor += w + gapX
          return (
            <g key={item}>
              <rect x={x} y={y + 13} width={w} height={pillH} rx="8" strokeWidth="1.1" className={itemTone} />
              <text x={x + 14} y={y + rowH / 2 + 4.5} fontSize="12.5" className={itemText}>
                {item}
              </text>
            </g>
          )
        })}
        {ri < rows.length - 1 && (
          <g>
            <path d={connector} strokeWidth="1.6" className="stroke-ink-500" />
            <Pulse d={connector} i={ri} reduced={reduced} />
          </g>
        )}
      </g>
    )
  })
}

/**
 * A project's architecture as a flow chart (kind 'graph') or a stack of layers
 * (kind 'rows'), from data/architectureDiagrams.js. Animated like the layered
 * map: pulses travel the connectors and the key part of the system glows.
 */
export const ArchitectureGraph = ({ diagram, title, className = 'absolute inset-0 h-full w-full' }) => {
  const reduced = useReducedMotion()
  const uid = `ag-${useId().replace(/:/g, '')}`
  const summary =
    diagram.kind === 'rows'
      ? diagram.rows.map((r) => r.label.replace(/^\d+\s*·\s*/, '')).join(', ')
      : [...diagram.nodes.map((n) => n.title), ...(diagram.groups ?? []).map((g) => g.title)].join(', ')

  return (
    <svg
      viewBox={`0 0 ${diagram.width} ${diagram.height}`}
      className={className}
      role="img"
      aria-label={`${title}: architecture, ${summary}`}
    >
      <defs>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fill-ink-500" />
        </marker>
        <marker id={`${uid}-dot`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7">
          <circle cx="5" cy="5" r="4" className="fill-silver-300" />
        </marker>
      </defs>
      {diagram.kind === 'rows' ? (
        <RowsDiagram diagram={diagram} reduced={reduced} />
      ) : (
        <GraphDiagram diagram={diagram} uid={uid} reduced={reduced} />
      )}
    </svg>
  )
}

/**
 * The project's most detailed diagram at full size, for the enlarged preview:
 * the flow chart when there is one, else the layered map, else the delivery flow.
 */
export const ProjectDiagram = ({ project }) => {
  const cs = project.caseStudy
  if (cs?.diagram) return <ArchitectureGraph diagram={cs.diagram} title={project.title} />
  if (cs?.architecture?.layers?.length)
    return <ArchitectureMap layers={cs.architecture.layers} title={project.title} id={`${project.slug}-lg`} />
  if (cs?.flow?.length) return <FlowDiagram flow={cs.flow} title={project.title} id={`${project.slug}-lg`} />
  return null
}

/** Canvas aspect of ProjectDiagram, so its frame can be sized to fit. */
export const projectDiagramAspect = (project) => {
  const d = project.caseStudy?.diagram
  return d ? d.width / d.height : VB_W / VB_H
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
  const graph = project.caseStudy?.diagram
  const hasArchitecture = Boolean(graph || layers?.length)

  // The architecture map needs room to be legible. In a narrow frame (phones,
  // two-column tablets) the large-type delivery flow is shown instead.
  const frameRef = useRef(null)
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const el = frameRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 380))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const diagram =
    narrow && flow?.length
      ? 'flow'
      : prefer === 'flow'
      ? (flow?.length && 'flow') || (hasArchitecture && 'architecture')
      : (hasArchitecture && 'architecture') || (flow?.length && 'flow')

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
      ref={frameRef}
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
      {diagram === 'architecture' &&
        (graph ? (
          <ArchitectureGraph diagram={graph} title={title} />
        ) : (
          <ArchitectureMap layers={layers} title={title} id={slug} />
        ))}
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
