import { lazy, Suspense, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import CloviBot from './CloviBot'
import { trackEvent } from '../../lib/analytics'

/**
 * Clovi, Gen Clover's chat assistant: the launcher in the bottom-right corner.
 *
 * Appears once the page has settled and only then loads anything, and the
 * chat panel itself is a separate chunk fetched on first open, so it costs
 * the page's first load nothing. Open/closed state survives navigation.
 */
const CloviPanel = lazy(() => import('./CloviPanel'))

const OPEN_KEY = 'gc_clovi_open'
const TEASER_KEY = 'gc_clovi_teased'
const session = {
  get: (k) => {
    try {
      return sessionStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k, v) => {
    try {
      sessionStorage.setItem(k, v)
    } catch {
      // Private mode: the chat still works, it just will not remember.
    }
  },
}

const Clovi = () => {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)

  // Mount after load + a beat, so it never competes with the page itself.
  useEffect(() => {
    const show = () => setTimeout(() => setReady(true), 1500)
    if (document.readyState === 'complete') show()
    else window.addEventListener('load', show, { once: true })
    setOpen(session.get(OPEN_KEY) === '1')
    return () => window.removeEventListener('load', show)
  }, [])

  // A single friendly nudge per session, if the visitor has not opened it.
  useEffect(() => {
    if (!ready || open || session.get(TEASER_KEY)) return undefined
    const t = setTimeout(() => {
      setTeaser(true)
      session.set(TEASER_KEY, '1')
    }, 15000)
    return () => clearTimeout(t)
  }, [ready, open])

  const toggle = (next) => {
    setOpen(next)
    setTeaser(false)
    session.set(OPEN_KEY, next ? '1' : '0')
    if (next) trackEvent('clovi_open')
  }

  if (!ready) return null

  return (
    <>
      {open && (
        <Suspense fallback={null}>
          <CloviPanel onClose={() => toggle(false)} />
        </Suspense>
      )}

      {teaser && !open && (
        <div className="clovi-glass fixed bottom-[5.75rem] right-5 z-[60] flex max-w-[16rem] items-start gap-2 rounded-2xl rounded-br-md px-4 py-3 text-sm text-silver-100 motion-safe:animate-[clovi-pop_.35s_ease-out]">
          <button type="button" onClick={() => toggle(true)} className="text-left leading-snug">
            Hi, I’m Clovi 👋 Looking for something? I can help.
          </button>
          <button type="button" aria-label="Dismiss" onClick={() => setTeaser(false)} className="-mr-1 -mt-0.5 shrink-0 text-silver-500 hover:text-silver-100">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => toggle(!open)}
        aria-label={open ? 'Close chat with Clovi' : 'Chat with Clovi, Gen Clover’s assistant'}
        aria-expanded={open}
        className={`clovi-launcher fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
          open ? 'max-sm:hidden' : ''
        }`}
      >
        {open ? <X className="h-6 w-6 text-white" aria-hidden="true" /> : <CloviBot className="h-10 w-10" />}
      </button>
    </>
  )
}

export default Clovi
