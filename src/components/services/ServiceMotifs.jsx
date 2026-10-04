/**
 * One small animated illustration per service, for the tiles on /services.
 *
 * Plain SVG drawn in the theme's own colours (currentColor plus the accent
 * token), animated by the .motif rules in index.css. They idle slowly and
 * quicken when their tile is hovered; prefers-reduced-motion stills them.
 */

const Frame = ({ children, className = '' }) => (
  <svg viewBox="0 0 240 150" className={`motif h-full w-full ${className}`} fill="none" aria-hidden="true">
    {children}
  </svg>
)

const Websites = () => (
  <Frame>
    <rect x="20" y="16" width="200" height="118" rx="8" className="motif-line" />
    <path d="M20 34h200" className="motif-line" />
    <circle cx="32" cy="25" r="2.5" className="motif-fill" />
    <circle cx="41" cy="25" r="2.5" className="motif-fill" />
    <circle cx="50" cy="25" r="2.5" className="motif-accent-fill" />
    <rect x="34" y="46" width="96" height="10" rx="3" className="motif-fill motif-grow" />
    <rect x="34" y="62" width="70" height="6" rx="3" className="motif-soft" />
    <rect x="34" y="73" width="82" height="6" rx="3" className="motif-soft" />
    <rect x="34" y="90" width="44" height="14" rx="4" className="motif-accent-fill" />
    <rect x="142" y="46" width="64" height="74" rx="5" className="motif-line motif-soft-fill" />
    <path d="M150 100l14-16 12 10 10-14 12 20" className="motif-accent" />
    <path d="M118 104l0 16 5-5 6 9 4-2-6-9h8z" className="motif-cursor motif-fill" />
  </Frame>
)

const WebApplications = () => (
  <Frame>
    <rect x="18" y="16" width="204" height="118" rx="8" className="motif-line" />
    <rect x="18" y="16" width="38" height="118" rx="8" className="motif-soft-fill" />
    {[34, 50, 66, 82].map((y, i) => (
      <rect key={y} x="27" y={y} width="20" height="5" rx="2.5" className={i === 1 ? 'motif-accent-fill' : 'motif-soft'} />
    ))}
    <rect x="66" y="28" width="44" height="26" rx="4" className="motif-line" />
    <rect x="118" y="28" width="44" height="26" rx="4" className="motif-line" />
    <rect x="170" y="28" width="42" height="26" rx="4" className="motif-line" />
    <rect x="74" y="38" width="20" height="6" rx="3" className="motif-fill" />
    <rect x="126" y="38" width="26" height="6" rx="3" className="motif-fill" />
    <rect x="178" y="38" width="16" height="6" rx="3" className="motif-accent-fill" />
    <rect x="66" y="64" width="146" height="60" rx="4" className="motif-line" />
    <path d="M76 112l22-16 18 8 22-26 20 12 22-22 24 8" className="motif-accent motif-draw" pathLength="1" />
  </Frame>
)

const Ecommerce = () => (
  <Frame>
    <g className="motif-slide">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${14 + i * 62} 30)`}>
          <rect width="52" height="70" rx="6" className="motif-line" />
          <rect x="8" y="8" width="36" height="30" rx="4" className={i % 3 === 1 ? 'motif-accent-fill' : 'motif-soft-fill'} />
          <rect x="8" y="46" width="28" height="5" rx="2.5" className="motif-fill" />
          <rect x="8" y="56" width="18" height="5" rx="2.5" className="motif-soft" />
        </g>
      ))}
    </g>
    <g transform="translate(176 104)">
      <path d="M2 4h8l7 22h24l6-16H14" className="motif-line" />
      <circle cx="20" cy="33" r="3" className="motif-fill" />
      <circle cx="36" cy="33" r="3" className="motif-fill" />
      <circle cx="44" cy="2" r="7" className="motif-accent-fill motif-pulse" />
    </g>
  </Frame>
)

const NODES = [
  [40, 40], [40, 110], [100, 25], [100, 75], [100, 125], [160, 50], [160, 100], [210, 75],
]
const LINKS = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7]]

const AiAutomation = () => (
  <Frame>
    {LINKS.map(([a, b]) => (
      <path key={`${a}-${b}`} d={`M${NODES[a][0]} ${NODES[a][1]}L${NODES[b][0]} ${NODES[b][1]}`} className="motif-line" />
    ))}
    {LINKS.filter((_, i) => i % 3 === 0).map(([a, b], i) => (
      <path
        key={`p${a}-${b}`}
        d={`M${NODES[a][0]} ${NODES[a][1]}L${NODES[b][0]} ${NODES[b][1]}`}
        className="motif-accent motif-signal"
        pathLength="1"
        style={{ animationDelay: `${i * 0.5}s` }}
      />
    ))}
    {NODES.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i === 7 ? 9 : 6} className={i === 7 ? 'motif-accent-fill motif-pulse' : 'motif-node'} />
    ))}
  </Frame>
)

const DataAnalytics = () => (
  <Frame>
    <path d="M24 130h196M24 20v110" className="motif-line" />
    {[28, 52, 40, 70, 58, 88, 76].map((h, i) => (
      <rect
        key={i}
        x={38 + i * 25}
        y={128 - h}
        width="14"
        height={h}
        rx="3"
        className={`motif-bar ${i === 5 ? 'motif-accent-fill' : 'motif-soft-fill'}`}
        style={{ animationDelay: `${i * 0.18}s` }}
      />
    ))}
    <path d="M45 96l25-20 25 10 25-28 25 12 25-30 25 8" className="motif-accent motif-draw" pathLength="1" />
  </Frame>
)

const cube = (x, y, cls = '') => (
  <g transform={`translate(${x} ${y})`} className={cls}>
    <path d="M0 10l22-10 22 10-22 10z" className="motif-soft-fill motif-line" />
    <path d="M0 10v24l22 10V20z" className="motif-line" />
    <path d="M44 10v24L22 44V20z" className="motif-line motif-soft-fill" />
  </g>
)

const TechnologySolutions = () => (
  <Frame>
    {cube(70, 86)}
    {cube(114, 86)}
    {cube(158, 86)}
    {cube(92, 62)}
    {cube(136, 62)}
    <g className="motif-bob">{cube(114, 26, 'motif-accent-cube')}</g>
  </Frame>
)

const LOOP = 'M120 75c-18-26-40-40-62-40-22 0-36 18-36 40s14 40 36 40c22 0 44-14 62-40s40-40 62-40c22 0 36 18 36 40s-14 40-36 40c-22 0-44-14-62-40z'

const DevopsMlops = () => (
  <Frame>
    <path d={LOOP} className="motif-line motif-thick" />
    <path d={LOOP} className="motif-accent motif-run" pathLength="1" />
    {['Plan', 'Build', 'Test', 'Ship'].map((label, i) => (
      <text key={label} x={[38, 58, 160, 180][i]} y={[66, 94, 66, 94][i]} className="motif-label">
        {label}
      </text>
    ))}
  </Frame>
)

const DigitalMarketingSeo = () => (
  <Frame>
    <rect x="22" y="14" width="196" height="24" rx="12" className="motif-line" />
    <circle cx="38" cy="26" r="5" className="motif-line" />
    <path d="M42 30l4 4" className="motif-line" />
    <rect x="54" y="23" width="70" height="6" rx="3" className="motif-fill motif-type" />
    <g className="motif-climb">
      <rect x="22" y="104" width="196" height="30" rx="6" className="motif-accent-soft" />
      <rect x="32" y="112" width="90" height="6" rx="3" className="motif-accent-fill" />
      <rect x="32" y="122" width="130" height="4" rx="2" className="motif-soft" />
    </g>
    {[50, 77].map((y) => (
      <g key={y} className="motif-sink">
        <rect x="22" y={y} width="196" height="22" rx="6" className="motif-line" />
        <rect x="32" y={y + 6} width="80" height="5" rx="2.5" className="motif-fill" />
        <rect x="32" y={y + 14} width="120" height="3" rx="1.5" className="motif-soft" />
      </g>
    ))}
  </Frame>
)

export const serviceMotifs = {
  websites: Websites,
  'web-applications': WebApplications,
  ecommerce: Ecommerce,
  'ai-automation': AiAutomation,
  'data-analytics': DataAnalytics,
  'technology-solutions': TechnologySolutions,
  'devops-mlops': DevopsMlops,
  'digital-marketing-seo': DigitalMarketingSeo,
}
