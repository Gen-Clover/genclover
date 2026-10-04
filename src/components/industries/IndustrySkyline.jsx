/**
 * The industries as a city: one hand-drawn building per sector, standing on a
 * shared street. Drawn in the theme's own colours and animated by the .city
 * rules in index.css. The active building lights up; the rest dim.
 */

const G = 470 // ground line

/** Window grid. A few windows are "lit" and flicker, picked deterministically. */
const Windows = ({ x, y, w, h, cols, rows, pad = 10, seed = 1 }) => {
  const cw = (w - pad * 2) / cols
  const rh = (h - pad * 2) / rows
  const out = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (r * 7 + c * 13 + seed * 5) % 9 === 0
      out.push(
        <rect
          key={`${r}-${c}`}
          x={x + pad + c * cw + cw * 0.18}
          y={y + pad + r * rh + rh * 0.2}
          width={cw * 0.64}
          height={rh * 0.55}
          rx="1.5"
          className={lit ? 'city-win city-win-lit' : 'city-win'}
          style={lit ? { animationDelay: `${(r + c) * 0.7}s` } : undefined}
        />
      )
    }
  }
  return out
}

const Body = ({ x, w, h, className = '' }) => <rect x={x} y={G - h} width={w} height={h} className={`city-body ${className}`} />

/* ------------------------------------------------------------ buildings */

const Tower = ({ x, w, h }) => (
  <>
    <rect x={x + w * 0.3} y={G - h - 18} width={w * 0.4} height="18" className="city-body" />
    <path d={`M${x + w / 2} ${G - h - 18}v-34`} className="city-line" />
    <path d={`M${x + w / 2} ${G - h - 52}h22l-4 7 4 7h-22`} className="city-flag city-accent-fill" />
    <Body x={x} w={w} h={h} />
    <Windows x={x} y={G - h} w={w} h={h - 30} cols={4} rows={11} seed={1} />
    <rect x={x + w / 2 - 12} y={G - 26} width="24" height="26" className="city-door" />
  </>
)

const Bank = ({ x, w, h }) => {
  const top = G - h
  const cols = 5
  return (
    <>
      <path d={`M${x - 6} ${top + 40}L${x + w / 2} ${top}L${x + w + 6} ${top + 40}Z`} className="city-body" />
      <circle cx={x + w / 2} cy={top + 26} r="7" className="city-line city-accent-stroke" />
      <rect x={x - 6} y={top + 40} width={w + 12} height="14" className="city-body" />
      <rect x={x} y={top + 54} width={w} height={h - 78} className="city-body city-shade" />
      {Array.from({ length: cols }, (_, i) => (
        <rect key={i} x={x + 8 + i * ((w - 16) / cols) + 4} y={top + 58} width={(w - 16) / cols - 8} height={h - 86} rx="2" className="city-column" />
      ))}
      <rect x={x - 8} y={G - 24} width={w + 16} height="8" className="city-body" />
      <rect x={x - 14} y={G - 16} width={w + 28} height="16" className="city-body" />
    </>
  )
}

const Glass = ({ x, w, h }) => {
  const top = G - h
  return (
    <>
      <path d={`M${x + w * 0.62} ${top - 30}v-46`} className="city-line" />
      <circle cx={x + w * 0.62} cy={top - 78} r="4.5" className="city-blink city-accent-fill" />
      <path d={`M${x} ${top}L${x + w} ${top - 40}V${G}H${x}Z`} className="city-body city-glass" />
      {[1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${x + (w / 5) * i} ${top - (40 / 5) * i}V${G}`} className="city-line city-faint" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <path key={`h${i}`} d={`M${x} ${top + 24 + i * 24}H${x + w}`} className="city-line city-faint" />
      ))}
      <rect x={x + w * 0.2} y={top + 90} width={w * 0.2} height="70" className="city-sheen" />
    </>
  )
}

const Shop = ({ x, w, h }) => {
  const top = G - h
  const stripes = 7
  const sw = (w + 16) / stripes
  return (
    <>
      <Body x={x} w={w} h={h} />
      <rect x={x + 16} y={top + 10} width={w - 32} height="22" rx="3" className="city-sign" />
      <text x={x + w / 2} y={top + 25.5} className="city-sign-text">OPEN</text>
      {Array.from({ length: stripes }, (_, i) => (
        <path
          key={i}
          d={`M${x - 8 + i * sw} ${top + 40}h${sw}v18a${sw / 2} ${sw / 2.4} 0 0 1 -${sw} 0z`}
          className={i % 2 ? 'city-awning' : 'city-awning city-accent-fill'}
        />
      ))}
      <rect x={x + 12} y={top + 70} width={w * 0.5} height={h - 82} className="city-window-big" />
      <rect x={x + w * 0.66} y={top + 74} width={w * 0.24} height={h - 74} className="city-door" />
    </>
  )
}

const Hospital = ({ x, w, h }) => {
  const top = G - h
  return (
    <>
      <rect x={x + w / 2 - 22} y={top - 44} width="44" height="44" rx="6" className="city-body" />
      <path d={`M${x + w / 2 - 5} ${top - 36}h10v10h10v10h-10v10h-10v-10h-10v-10h10z`} className="city-cross city-accent-fill" />
      <Body x={x} w={w} h={h} />
      <Windows x={x} y={top} w={w} h={h - 46} cols={6} rows={7} seed={3} />
      <path d={`M${x + w / 2 - 34} ${G - 40}h68v6h-68z`} className="city-body" />
      <rect x={x + w / 2 - 18} y={G - 34} width="36" height="34" className="city-door" />
    </>
  )
}

const Broadcast = ({ x, w, h }) => {
  const top = G - h
  const cx = x + w / 2
  const legs = `M${x + 8} ${G - 60}L${cx} ${top}L${x + w - 8} ${G - 60}`
  const braces = Array.from({ length: 8 }, (_, i) => {
    const t1 = i / 8
    const t2 = (i + 1) / 8
    const y1 = G - 60 - (h - 60) * t1
    const y2 = G - 60 - (h - 60) * t2
    const half1 = ((w - 16) / 2) * (1 - t1)
    const half2 = ((w - 16) / 2) * (1 - t2)
    return `M${cx - half1} ${y1}L${cx + half2} ${y2}M${cx + half1} ${y1}L${cx - half2} ${y2}`
  }).join('')
  return (
    <>
      {[18, 32, 46].map((r, i) => (
        <path key={r} d={`M${cx - r} ${top - 6}a${r} ${r} 0 0 1 ${r * 2} 0`} className="city-signal city-accent-stroke" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      <circle cx={cx} cy={top - 6} r="4" className="city-accent-fill" />
      <path d={legs} className="city-line city-thick" />
      <path d={braces} className="city-line city-faint" />
      <rect x={x} y={G - 60} width={w} height="60" className="city-body" />
      <Windows x={x} y={G - 60} w={w} h={60} cols={3} rows={2} seed={4} />
    </>
  )
}

const School = ({ x, w, h }) => {
  const top = G - h
  const cx = x + w / 2
  return (
    <>
      <rect x={cx - 22} y={top - 60} width="44" height="70" className="city-body" />
      <path d={`M${cx - 28} ${top - 60}L${cx} ${top - 92}L${cx + 28} ${top - 60}Z`} className="city-body" />
      <circle cx={cx} cy={top - 34} r="13" className="city-clock" />
      <path d={`M${cx} ${top - 34}v-9`} className="city-hand city-hand-long" style={{ transformOrigin: `${cx}px ${top - 34}px` }} />
      <path d={`M${cx} ${top - 34}h6`} className="city-hand city-hand-short" style={{ transformOrigin: `${cx}px ${top - 34}px` }} />
      <path d={`M${x - 8} ${top + 24}L${cx} ${top - 6}L${x + w + 8} ${top + 24}Z`} className="city-body" />
      <rect x={x} y={top + 24} width={w} height={h - 24} className="city-body" />
      <Windows x={x} y={top + 24} w={w} h={h - 60} cols={5} rows={3} seed={6} />
      <rect x={cx - 16} y={G - 40} width="32" height="40" rx="16" className="city-door" />
    </>
  )
}

const Hotel = ({ x, w, h }) => {
  const top = G - h
  return (
    <>
      <rect x={x + 14} y={top - 22} width={w - 28} height="22" className="city-body" />
      <Body x={x} w={w} h={h} />
      <Windows x={x} y={top} w={w - 26} h={h - 36} cols={3} rows={10} seed={8} />
      <rect x={x + w - 24} y={top + 30} width="18" height="110" rx="3" className="city-sign" />
      {'HOTEL'.split('').map((l, i) => (
        <text key={i} x={x + w - 15} y={top + 50 + i * 20} className="city-sign-text city-neon">
          {l}
        </text>
      ))}
      <path d={`M${x + 20} ${G - 30}h${w - 40}`} className="city-line" />
      <rect x={x + w / 2 - 14} y={G - 30} width="28" height="30" className="city-door" />
    </>
  )
}

const Apartments = ({ x, w, h }) => {
  const top = G - h
  const floors = 7
  const fh = (h - 30) / floors
  return (
    <>
      <path d={`M${x + 8} ${top}v-16h20v16`} className="city-body" />
      <Body x={x} w={w} h={h} />
      {Array.from({ length: floors }, (_, i) => (
        <g key={i}>
          <rect x={x + 12} y={top + 10 + i * fh} width={w * 0.3} height={fh * 0.55} rx="1.5" className={i === 2 ? 'city-win city-win-lit' : 'city-win'} />
          <rect x={x + w * 0.55} y={top + 10 + i * fh} width={w * 0.3} height={fh * 0.55} rx="1.5" className={i === 5 ? 'city-win city-win-lit' : 'city-win'} />
          <path d={`M${x + w * 0.5} ${top + 10 + i * fh + fh * 0.62}h${w * 0.42}v-8M${x + w * 0.6} ${top + 10 + i * fh + fh * 0.62}v-8M${x + w * 0.7} ${top + 10 + i * fh + fh * 0.62}v-8M${x + w * 0.8} ${top + 10 + i * fh + fh * 0.62}v-8`} className="city-line" />
        </g>
      ))}
      <rect x={x + 14} y={G - 24} width="22" height="24" className="city-door" />
    </>
  )
}

const Factory = ({ x, w, h }) => {
  const top = G - h
  const teeth = 4
  const tw = w / teeth
  const saw = Array.from({ length: teeth }, (_, i) => `L${x + i * tw} ${top}L${x + (i + 1) * tw} ${top + 28}`).join('')
  return (
    <>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + w - 26} cy={top - 70} r={9 + i * 3} className="city-smoke" style={{ animationDelay: `${i * 1.1}s` }} />
      ))}
      <rect x={x + w - 36} y={top - 70} width="20" height="70" className="city-body" />
      <rect x={x + w - 36} y={top - 60} width="20" height="6" className="city-accent-fill city-stripe" />
      <path d={`M${x} ${top + 28}${saw}V${G}H${x}Z`} className="city-body" />
      {Array.from({ length: teeth }, (_, i) => (
        <path key={i} d={`M${x + i * tw + 4} ${top + 6}L${x + (i + 1) * tw - 6} ${top + 26}`} className="city-line city-accent-stroke city-faint" />
      ))}
      <Windows x={x} y={top + 34} w={w} h={50} cols={5} rows={1} seed={9} />
      <path d={`M${x + 18} ${G}v-40h40v40`} className="city-line" />
      <path d={`M${x + 18} ${G - 30}h40M${x + 18} ${G - 20}h40M${x + 18} ${G - 10}h40`} className="city-line city-faint" />
    </>
  )
}

const Warehouse = ({ x, w, h }) => {
  const top = G - h
  return (
    <>
      <path d={`M${x} ${top + 30}Q${x + w / 2} ${top - 10} ${x + w} ${top + 30}V${G}H${x}Z`} className="city-body" />
      <rect x={x + 18} y={top + 26} width={w - 36} height="16" rx="3" className="city-sign" />
      <text x={x + w / 2} y={top + 37.5} className="city-sign-text">DEPOT</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x + 12 + i * ((w - 24) / 3) + 4} y={G - 52} width={(w - 24) / 3 - 8} height="52" className="city-door" />
          {[12, 22, 32, 42].map((d) => (
            <path key={d} d={`M${x + 12 + i * ((w - 24) / 3) + 4} ${G - 52 + d}h${(w - 24) / 3 - 8}`} className="city-line city-faint" />
          ))}
        </g>
      ))}
    </>
  )
}

/* ------------------------------------------------------------ the city */

/** Left to right along the street. Heights vary so the skyline reads well. */
export const SKYLINE = [
  { id: 'professional-services', x: 50, w: 110, h: 300, Draw: Tower },
  { id: 'financial-services', x: 186, w: 140, h: 190, Draw: Bank },
  { id: 'technology-saas', x: 352, w: 100, h: 340, Draw: Glass },
  { id: 'retail-commerce', x: 468, w: 130, h: 130, Draw: Shop },
  { id: 'healthcare', x: 614, w: 160, h: 220, Draw: Hospital },
  { id: 'media-publishing', x: 790, w: 80, h: 330, Draw: Broadcast },
  { id: 'education', x: 892, w: 150, h: 170, Draw: School },
  { id: 'hospitality', x: 1062, w: 100, h: 280, Draw: Hotel },
  { id: 'real-estate', x: 1180, w: 120, h: 210, Draw: Apartments },
  { id: 'manufacturing', x: 1318, w: 140, h: 140, Draw: Factory },
  { id: 'logistics', x: 1476, w: 110, h: 120, Draw: Warehouse },
]

const Truck = () => (
  <g className="city-truck">
    <rect x="0" y={G + 4} width="54" height="26" rx="3" className="city-body city-truck-box" />
    <path d={`M54 ${G + 12}h16l10 10v8H54z`} className="city-body" />
    <rect x="58" y={G + 15} width="9" height="7" className="city-win" />
    <circle cx="14" cy={G + 32} r="5" className="city-wheel" />
    <circle cx="66" cy={G + 32} r="5" className="city-wheel" />
  </g>
)

export const Skyline = ({ active, labels, onEnter, onLeave, onActivate }) => (
  <svg viewBox="0 0 1640 520" className={`city h-auto w-full ${active ? 'has-active' : ''}`} role="list" aria-label="Industries">
    {/* sky */}
    <circle cx="1500" cy="70" r="26" className="city-moon" />
    <path d="M180 90a18 18 0 0 1 34-6a14 14 0 0 1 22 12h-62a10 10 0 0 1 6-6z" className="city-cloud city-cloud-a" />
    <path d="M900 60a20 20 0 0 1 38-6a15 15 0 0 1 24 13h-70a11 11 0 0 1 8-7z" className="city-cloud city-cloud-b" />

    {/* street */}
    <path d={`M0 ${G}H1640`} className="city-line city-ground" />
    <path d={`M0 ${G + 22}H1640`} className="city-road" />
    <Truck />

    {SKYLINE.map(({ id, x, w, h, Draw }, i) => {
      const isActive = active === id
      return (
        <a
          key={id}
          href={`/industries/${id}`}
          role="listitem"
          aria-label={labels[id]}
          className={`city-bldg ${isActive ? 'is-active' : ''}`}
          style={{ animationDelay: `${0.15 + i * 0.08}s` }}
          onMouseEnter={() => onEnter(id)}
          onMouseLeave={onLeave}
          onFocus={() => onEnter(id)}
          onBlur={onLeave}
          onClick={(e) => onActivate(e, id)}
        >
          {/* a generous invisible hit area, so slim towers are easy to catch */}
          <rect x={x - 8} y={G - h - 90} width={w + 16} height={h + 90} className="city-hit" />
          <Draw x={x} w={w} h={h} />
          <g className="city-tag" transform={`translate(${x + w / 2} ${Math.max(22, G - h - 104)})`}>
            <rect x={-labels[id].length * 4.4 - 12} y="-16" width={labels[id].length * 8.8 + 24} height="26" rx="13" className="city-tag-bg" />
            <text y="2" className="city-tag-text">{labels[id]}</text>
          </g>
        </a>
      )
    })}
  </svg>
)
