import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { ProjectDiagram, projectDiagramAspect } from '../ui/ProjectVisual'

/**
 * Enlarged, animated architecture diagram for a Work card.
 *
 *   mode 'hover'  a floating glass panel over the card, opened by hovering the
 *                 card's diagram. It ignores the pointer, so moving off the
 *                 diagram (not off the panel) is what closes it.
 *   mode 'modal'  the same panel as a dialog, opened by the diagram's expand
 *                 button, for touch screens and keyboards: blurred backdrop,
 *                 close button, Escape, focus returned to the button.
 */

const MARGIN = 16
/** Height of the panel's title row plus padding, around the diagram itself. */
const CHROME = 76
/** Horizontal padding and borders around the diagram inside the panel. */
const INSET = 34
/**
 * Narrowest the dialog draws a diagram. Below this its labels are too small to
 * read, so on phones the diagram keeps this width and scrolls sideways.
 */
const MIN_DIAGRAM_W = 720
const SCROLLBAR = 14

/**
 * Panel size, and the width the diagram is drawn at. Hover panels always fit
 * the diagram to the panel; the dialog may draw it wider and let it scroll.
 */
const panelSize = (aspect, mode) => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxH = vh - MARGIN * 2
  let w = Math.min(mode === 'modal' ? 1040 : 780, vw - MARGIN * 2)
  let diagramW = w - INSET
  if (mode === 'modal') diagramW = Math.max(diagramW, MIN_DIAGRAM_W)
  const scrolls = diagramW > w - INSET
  // A scrolling diagram also gets a scrollbar and a one-line swipe hint.
  let h = diagramW / aspect + CHROME + (scrolls ? SCROLLBAR + 24 : 0)
  if (h > maxH) {
    h = maxH
    if (!scrolls) {
      diagramW = (h - CHROME) * aspect
      w = diagramW + INSET
    }
  }
  return { w, h, diagramW, scrolls }
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

const Panel = ({ project, size, onClose, closeRef }) => (
  <div
    className="flex h-full flex-col rounded-2xl border border-ink-700 bg-ink-900/70 p-4 shadow-lift backdrop-blur-xl"
    style={{ width: size.w, height: size.h }}
  >
    <div className="flex items-start justify-between gap-4 px-1 pb-3">
      <div className="min-w-0">
        <p className="eyebrow">Architecture</p>
        <p className="mt-1 truncate text-sm font-semibold text-silver-100">{project.title}</p>
      </div>
      {onClose && (
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close diagram"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-700 text-silver-300 transition-colors hover:border-accent-600 hover:text-accent-400"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
    <div
      className={`min-h-0 flex-1 rounded-xl border border-ink-800 bg-ink-950/60 ${
        size.scrolls ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'
      }`}
      tabIndex={size.scrolls ? 0 : undefined}
      aria-label={size.scrolls ? 'Diagram, scroll sideways to see all of it' : undefined}
    >
      <div className="relative h-full" style={{ width: size.scrolls ? size.diagramW : '100%' }}>
        <ProjectDiagram project={project} />
      </div>
    </div>
    {size.scrolls && (
      <p className="px-1 pt-2 text-center text-xs text-silver-500">Swipe sideways to see the whole diagram.</p>
    )}
  </div>
)

const DiagramPreview = ({ project, mode, anchorRef, onClose }) => {
  const reduced = useReducedMotion()
  const closeRef = useRef(null)
  const [layout, setLayout] = useState(null)
  const aspect = projectDiagramAspect(project)

  // Size (and for hover, place) the panel against the viewport.
  useLayoutEffect(() => {
    if (!mode) return undefined
    const place = () => {
      const size = panelSize(aspect, mode)
      if (mode === 'modal') {
        setLayout({ size })
        return
      }
      const r = anchorRef.current?.getBoundingClientRect()
      if (!r) return
      const left = clamp(r.left + r.width / 2 - size.w / 2, MARGIN, window.innerWidth - size.w - MARGIN)
      const top = clamp(r.top + r.height / 2 - size.h / 2, MARGIN, window.innerHeight - size.h - MARGIN)
      setLayout({ size, left, top })
    }
    place()
    let frame = 0
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; place() })
    }
    window.addEventListener('resize', place)
    if (mode === 'hover') window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [mode, aspect, anchorRef])

  // Dialog: Escape closes, the page behind does not scroll, focus goes to the
  // close button and comes back to whatever opened it.
  useEffect(() => {
    if (mode !== 'modal') return undefined
    const opener = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      // Only one focusable control in the dialog: keep Tab on it.
      if (e.key === 'Tab') {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      opener?.focus?.()
    }
  }, [mode, onClose])

  const pop = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.97, y: 4 },
      }

  return createPortal(
    <AnimatePresence>
      {mode && layout && (
        <motion.div
          key="diagram-preview"
          className={mode === 'modal' ? 'fixed inset-0 z-[70] grid place-items-center' : 'pointer-events-none fixed inset-0 z-[70]'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {mode === 'modal' && (
            <div
              className="absolute inset-0 bg-ink-950/60 backdrop-blur-md"
              onClick={onClose}
              aria-hidden="true"
            />
          )}
          <motion.div
            {...pop}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={mode === 'modal' ? 'relative' : 'absolute'}
            style={mode === 'hover' ? { left: layout.left, top: layout.top } : undefined}
            role={mode === 'modal' ? 'dialog' : undefined}
            aria-modal={mode === 'modal' ? 'true' : undefined}
            aria-label={mode === 'modal' ? `${project.title}: architecture diagram` : undefined}
            aria-hidden={mode === 'hover' ? 'true' : undefined}
          >
            <Panel
              project={project}
              size={layout.size}
              onClose={mode === 'modal' ? onClose : undefined}
              closeRef={closeRef}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default DiagramPreview
