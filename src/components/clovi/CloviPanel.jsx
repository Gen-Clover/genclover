import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Paperclip, RotateCcw, Send, ArrowUpRight } from 'lucide-react'
import CloviBot from './CloviBot'
import { initialState, reply } from '../../lib/clovi/engine'
import { cloviApi } from '../../lib/clovi/api'
import { BOT_NAME } from '../../lib/clovi/schema'
import { CV_ACCEPT } from '../../lib/application'
import { getDialCodeOptions } from '../../lib/intlOptions'
import { trackEvent, events } from '../../lib/analytics'
import { routes } from '../../data/site'

/**
 * The Clovi chat panel: frosted glass over the page, in the brand colours.
 * The conversation itself lives in src/lib/clovi/engine.js.
 */

const STATE_KEY = 'gc_clovi_state'
const load = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STATE_KEY))
    return saved?.v === 2 ? saved : null
  } catch {
    return null
  }
}
const save = (s) => {
  try {
    // A File cannot be stored; the CV is re-attached if the page reloads mid-application.
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ ...s, job: { ...s.job, cv: null } }))
  } catch {
    // Storage full or blocked: the chat still works for this page.
  }
}

/** The transcript goes to the team once there is something new worth reading. */
const hasNewActivity = (s) =>
  s.contact.email &&
  s.messages.slice(s.sent.transcriptAt).some((m) => m.from === 'user') &&
  s.messages.length - s.sent.transcriptAt >= 3

const Avatar = () => (
  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 bg-ink-900/80 shadow-[0_0_14px_rgba(224,31,38,.35)]">
    <CloviBot className="h-5 w-5" />
  </span>
)

const Card = ({ card, onOpen }) => (
  <Link
    to={card.to}
    onClick={onOpen}
    className="clovi-card group block rounded-xl p-3 transition-colors"
  >
    <p className="flex items-start justify-between gap-2 text-sm font-semibold leading-snug text-silver-100">
      {card.title}
      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </p>
    {card.meta && <p className="mt-0.5 text-[11px] uppercase tracking-wide text-accent-400/90">{card.meta}</p>}
    {card.text && <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-silver-400">{card.text}</p>}
  </Link>
)

const Typing = () => (
  <div className="flex items-end gap-2" aria-label={`${BOT_NAME} is typing`}>
    <Avatar />
    <div className="clovi-bubble-bot flex gap-1 rounded-2xl rounded-bl-md px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-silver-400 motion-safe:animate-[clovi-dot_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
)

const CloviPanel = ({ onClose }) => {
  const [state, setState] = useState(() => load() ?? initialState())
  const [busy, setBusy] = useState(false)
  const [text, setText] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState(state.contact.phoneCountry || 'IN')
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const stateRef = useRef(state)
  const countries = useMemo(getDialCodeOptions, [])

  stateRef.current = state
  useEffect(() => save(state), [state])

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [state.messages.length, busy])

  useEffect(() => {
    inputRef.current?.focus()
  }, [state.step])

  const ctx = useMemo(
    () => ({
      contact: async (s, opts) => {
        await cloviApi.contact(s, opts)
        trackEvent('clovi_contact', { purpose: s.purpose })
      },
      lead: async (s) => {
        const result = await cloviApi.lead(s)
        trackEvent('clovi_lead_submit', { service: s.lead.service })
        return result
      },
      apply: async (s) => {
        const result = await cloviApi.apply(s)
        trackEvent(events.JOB_APPLY, { job: s.job.jobId, source: 'clovi' })
        return result
      },
      transcript: (s) => cloviApi.transcript(s),
      jobs: cloviApi.jobs,
    }),
    []
  )

  const send = useCallback(
    async (input) => {
      if (busy) return
      setBusy(true)
      const started = Date.now()
      try {
        const next = await reply(stateRef.current, input, ctx)
        // A short, human-feeling pause before the answer appears.
        const last = next.messages[next.messages.length - 1]
        const wait = Math.min(900, 350 + (last?.text?.length ?? 0) * 4) - (Date.now() - started)
        if (wait > 0) await new Promise((r) => setTimeout(r, wait))
        setState(next)
      } finally {
        setBusy(false)
      }
    },
    [busy, ctx]
  )

  // The conversation goes to the team when the visitor leaves.
  useEffect(() => {
    const onHide = () => {
      const s = stateRef.current
      if (hasNewActivity(s) && cloviApi.transcriptBeacon(s)) save({ ...s, sent: { ...s.sent, transcriptAt: s.messages.length } })
    }
    window.addEventListener('pagehide', onHide)
    return () => window.removeEventListener('pagehide', onHide)
  }, [])

  const close = () => {
    const s = stateRef.current
    if (hasNewActivity(s)) {
      cloviApi.transcript(s).catch(() => {})
      setState({ ...s, sent: { ...s.sent, transcriptAt: s.messages.length } })
    }
    onClose()
  }

  const restart = () => {
    const s = stateRef.current
    if (hasNewActivity(s)) cloviApi.transcript(s).catch(() => {})
    setState(initialState())
    setText('')
    setPhone('')
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (state.step === 'phone') {
      if (!phone.trim()) return
      send({ kind: 'phone', phone: phone.trim(), country })
      return
    }
    const t = text.trim()
    if (!t) return
    setText('')
    send({ kind: 'text', text: t })
  }

  // Clovi checks the file itself (type, size) and says what is wrong in the chat.
  const onFile = (file) => {
    if (file) send({ kind: 'file', file })
    if (fileRef.current) fileRef.current.value = ''
  }

  // Escape closes, like any dialog.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const lastBot = [...state.messages].reverse().find((m) => m.from === 'bot')
  const activeChips = !busy && lastBot === state.messages[state.messages.length - 1] ? lastBot?.chips : null
  const wantsFile = state.step === 'j_cv'

  return (
    <div
      role="dialog"
      aria-label={`Chat with ${BOT_NAME}`}
      className="clovi-glass fixed inset-0 z-[61] flex flex-col overflow-hidden sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(640px,calc(100vh-8rem))] sm:w-[390px] sm:rounded-[1.75rem] motion-safe:animate-[clovi-pop_.28s_cubic-bezier(.16,1,.3,1)]"
    >
      {/* Header */}
      <div className="relative flex items-center gap-3 px-4 pb-3 pt-4">
        <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-ink-900/70 shadow-[0_0_22px_rgba(224,31,38,.45)]">
          <CloviBot className="h-8 w-8" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink-900 bg-emerald-500" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold tracking-wide text-silver-100">{BOT_NAME}</p>
          <p className="truncate text-xs text-silver-400">Gen Clover assistant · Online</p>
        </div>
        <button type="button" onClick={restart} title="Start over" aria-label="Start over" className="grid h-9 w-9 place-items-center rounded-full text-silver-400 hover:bg-white/10 hover:text-silver-100">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={close} title="Minimise" aria-label="Minimise chat" className="grid h-9 w-9 place-items-center rounded-full text-silver-400 hover:bg-white/10 hover:text-silver-100">
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" aria-hidden="true" />
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-silver-500">— Today —</p>
        {state.messages.map((m, i) => {
          const prev = state.messages[i - 1]
          const grouped = prev?.from === m.from
          if (m.from === 'user') {
            return (
              <div key={m.id} className="flex justify-end">
                <p className="clovi-bubble-user max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed">{m.text}</p>
              </div>
            )
          }
          return (
            <div key={m.id} className="flex items-end gap-2">
              {grouped ? <span className="w-7 shrink-0" /> : <Avatar />}
              <div className="min-w-0 max-w-[85%] space-y-2">
                {m.text && (
                  <div className="clovi-bubble-bot rounded-2xl rounded-bl-md px-4 py-2.5">
                    {!grouped && <p className="mb-0.5 text-[11px] font-semibold tracking-wide text-accent-400">{BOT_NAME}</p>}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-silver-100">{m.text}</p>
                  </div>
                )}
                {m.cards?.length > 0 && (
                  <div className="space-y-2">
                    {m.cards.map((c) => (
                      <Card key={c.to} card={c} onOpen={() => trackEvent('clovi_card_click', { to: c.to })} />
                    ))}
                  </div>
                )}
                {m.links?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.links.map((l) => (
                      <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 text-xs font-medium text-accent-400 underline-offset-4 hover:underline">
                        {l.label} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
                {m.note && (
                  <p className="text-[11px] leading-snug text-silver-500">
                    {m.note.replace('Privacy notice', '')}
                    {m.note.includes('Privacy notice') && (
                      <Link to={routes.privacy} className="text-accent-400 hover:underline">
                        Privacy notice
                      </Link>
                    )}
                  </p>
                )}
              </div>
            </div>
          )
        })}
        {busy && <Typing />}
        {activeChips?.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2 pl-9 pt-1">
            {activeChips.map((c) => (
              <button key={c.value} type="button" onClick={() => send({ kind: 'chip', value: c.value, label: c.label })} className="clovi-chip rounded-full px-3.5 py-1.5 text-xs font-medium text-silver-100 transition-colors">
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      {/* noValidate: Clovi's own messages explain a bad email, not the browser's pop-up. */}
      <form onSubmit={onSubmit} noValidate className="px-3 pb-3 pt-2">
        <div className="clovi-composer flex items-center gap-1.5 rounded-full p-1.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={!wantsFile || busy}
            aria-label="Attach your CV"
            title={wantsFile ? 'Attach your CV' : 'Attachments are for CVs'}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${wantsFile ? 'text-accent-400 hover:bg-white/10' : 'text-silver-600'}`}
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
          </button>
          <input ref={fileRef} type="file" accept={CV_ACCEPT} className="sr-only" tabIndex={-1} onChange={(e) => onFile(e.target.files?.[0])} />

          {state.step === 'phone' ? (
            <>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                aria-label="Country code"
                className="h-9 w-[5.5rem] shrink-0 rounded-full border-0 bg-white/5 px-2 text-xs text-silver-100 outline-none focus:ring-1 focus:ring-accent-500"
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value} className="bg-ink-900">
                    {c.display}
                  </option>
                ))}
              </select>
              <input
                ref={inputRef}
                type="tel"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
                aria-label="Mobile number"
                className="h-9 min-w-0 flex-1 bg-transparent px-2 text-base text-silver-100 outline-none placeholder:text-silver-500 sm:text-sm"
              />
            </>
          ) : (
            <input
              ref={inputRef}
              type={state.step === 'email' ? 'email' : 'text'}
              autoComplete={state.step === 'name' ? 'name' : state.step === 'email' ? 'email' : 'off'}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={wantsFile ? 'Attach your CV with the clip' : state.step === 'name' ? 'Your name' : state.step === 'email' ? 'you@company.com' : 'Type a message…'}
              aria-label="Message"
              maxLength={1000}
              className="h-9 min-w-0 flex-1 bg-transparent px-2 text-base text-silver-100 outline-none placeholder:text-silver-500 sm:text-sm"
            />
          )}

          <button
            type="submit"
            disabled={busy}
            aria-label="Send"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-600 text-white shadow-[0_0_16px_rgba(224,31,38,.5)] transition-colors hover:bg-accent-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-silver-600">
          {BOT_NAME} is an automated assistant · <Link to={routes.privacy} className="hover:text-silver-400">Privacy</Link>
        </p>
      </form>
    </div>
  )
}

export default CloviPanel
