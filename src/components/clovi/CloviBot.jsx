import { useId } from 'react'
import { PETAL_PATH } from '../brand/Logo'

/**
 * Clovi's face: a friendly silver bot with glowing red eyes and a smile,
 * wearing the Gen Clover clover as a badge on its head. Used for the launcher
 * and as Clovi's avatar in the chat. Gradient ids are per instance (useId), as
 * in CloverMark, because the icon appears several times on a page.
 */
const CloviBot = ({ className = 'h-8 w-8' }) => {
  const uid = useId().replace(/:/g, '')
  const id = (name) => `clovi-${name}-${uid}`

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id('silver')} x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#D2D5DC" />
          <stop offset="100%" stopColor="#7E838C" />
        </linearGradient>
        <linearGradient id={id('accent')} x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#FF5F64" />
          <stop offset="50%" stopColor="#E01F26" />
          <stop offset="100%" stopColor="#8E0F14" />
        </linearGradient>
        <linearGradient id={id('steel')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F6F8" />
          <stop offset="100%" stopColor="#8A8F98" />
        </linearGradient>
        <radialGradient id={id('led')}>
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FF5F64" />
          <stop offset="100%" stopColor="#E01F26" />
        </radialGradient>
        <filter id={id('glow')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Clover badge on the head */}
      <g transform="translate(50 18) scale(0.2) rotate(45)">
        <path d={PETAL_PATH} fill={`url(#${id('accent')})`} />
        <path d={PETAL_PATH} fill={`url(#${id('silver')})`} transform="rotate(90)" />
        <path d={PETAL_PATH} fill={`url(#${id('silver')})`} transform="rotate(180)" />
        <path d={PETAL_PATH} fill={`url(#${id('silver')})`} transform="rotate(270)" />
      </g>

      {/* Ears, head and face screen */}
      <rect x="11" y="47" width="7" height="16" rx="3" fill={`url(#${id('steel')})`} />
      <rect x="82" y="47" width="7" height="16" rx="3" fill={`url(#${id('steel')})`} />
      <rect x="17" y="32" width="66" height="54" rx="20" fill={`url(#${id('steel')})`} />
      <rect x="24" y="40" width="52" height="38" rx="14" fill="#08080b" />

      {/* Glowing eyes and a smile */}
      <rect x="33" y="50" width="10" height="12" rx="5" fill={`url(#${id('led')})`} filter={`url(#${id('glow')})`} />
      <rect x="57" y="50" width="10" height="12" rx="5" fill={`url(#${id('led')})`} filter={`url(#${id('glow')})`} />
      <path d="M41 68 Q50 74 59 68" fill="none" stroke="#FF5F64" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default CloviBot
