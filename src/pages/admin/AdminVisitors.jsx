import { useCallback, useEffect, useState } from 'react'
import { Loader2, AlertTriangle, MapPin, Monitor, Smartphone, Tablet, X, Clock, MousePointerClick, FileText, Info } from 'lucide-react'
import { adminApi } from '../../lib/adminApi'
import { useAdmin } from './AdminApp'

/**
 * Visitors: the anonymous visitor log (api/track.js). Totals and a daily
 * chart for the chosen period, where people come from and on what, the pages
 * they read and for how long, what they clicked, and every session; a
 * visitor id opens everything that visitor did, session by session.
 */

const PERIODS = [
  { days: 1, label: '24 hours' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]

const duration = (s) => {
  if (s == null) return '–'
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return m < 60 ? `${m}m ${s % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`
}
const when = (iso) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(iso))
const shortId = (id) => id.slice(0, 8)
const DeviceIcon = ({ device }) => {
  const Icon = device === 'Mobile' ? Smartphone : device === 'Tablet' ? Tablet : Monitor
  return <Icon className="h-3.5 w-3.5" aria-label={device} />
}

const Tile = ({ label, value, hint }) => (
  <div className="rounded-xl border border-ink-800 bg-ink-900 p-4">
    <p className="font-display text-[11px] uppercase tracking-brand text-silver-500">{label}</p>
    <p className="mt-1.5 font-display text-2xl font-semibold text-silver-100">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-silver-600">{hint}</p>}
  </div>
)

const Ranked = ({ title, rows, render }) => {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900 p-4">
      <p className="font-display text-[11px] uppercase tracking-brand text-silver-500">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-silver-600">Nothing yet.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <li key={r.label} className="relative overflow-hidden rounded-md px-2 py-1 text-sm">
              <span className="absolute inset-y-0 left-0 rounded-md bg-accent-900/40" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden="true" />
              <span className="relative flex items-center justify-between gap-3">
                <span className="truncate text-silver-200">{render ? render(r) : r.label}</span>
                <span className="shrink-0 tabular-nums text-silver-400">{r.value}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const Daily = ({ daily }) => {
  const max = Math.max(1, ...daily.map((d) => d.views))
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900 p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-[11px] uppercase tracking-brand text-silver-500">Per day</p>
        <p className="flex items-center gap-3 text-[11px] text-silver-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-accent-600" />Page views</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-silver-400" />Visitors</span>
        </p>
      </div>
      <div className="mt-4 flex h-36 items-end gap-1">
        {daily.map((d) => (
          <div key={d.date} className="group relative flex h-full flex-1 items-end justify-center gap-px" title={`${d.date}: ${d.visitors} visitors, ${d.views} views`}>
            <span className="w-1/2 rounded-t bg-accent-600" style={{ height: `${(d.views / max) * 100}%` }} />
            <span className="w-1/2 rounded-t bg-silver-400/70" style={{ height: `${(d.visitors / max) * 100}%` }} />
          </div>
        ))}
      </div>
      {daily.length > 1 && (
        <div className="mt-1.5 flex justify-between text-[10px] text-silver-600">
          <span>{daily[0].date}</span>
          <span>{daily[daily.length - 1].date}</span>
        </div>
      )}
    </div>
  )
}

const VisitorPanel = ({ id, onClose }) => {
  const { onExpired } = useAdmin()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setData(null)
    adminApi.visitor(id).then(setData).catch((err) => (err.status === 401 ? onExpired() : setError(err.message)))
  }, [id, onExpired])

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-ink-700 bg-ink-950 p-6" onClick={(e) => e.stopPropagation()} aria-label="Visitor timeline">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-[11px] uppercase tracking-brand text-accent-400">Visitor</p>
            <p className="mt-1 font-mono text-sm text-silver-200">{id}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-silver-400 hover:bg-ink-800 hover:text-silver-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {error && <p className="mt-6 text-sm text-accent-400">{error}</p>}
        {!data && !error && <Loader2 className="mt-8 h-5 w-5 animate-spin text-silver-500" aria-label="Loading" />}
        {data && (
          <>
            <p className="mt-3 text-sm text-silver-400">
              {data.sessions.length} session{data.sessions.length === 1 ? '' : 's'} · {data.sessions.reduce((s, x) => s + x.pages, 0)} pages ·{' '}
              {duration(data.sessions.reduce((s, x) => s + x.seconds, 0))} in total
            </p>
            <ol className="mt-6 space-y-6">
              {data.sessions.map((s) => (
                <li key={s.id} className="rounded-xl border border-ink-800 bg-ink-900 p-4">
                  <p className="text-sm font-medium text-silver-100">{when(s.startedAt)}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-silver-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{s.location ?? 'Unknown'}</span>
                    <span className="inline-flex items-center gap-1"><DeviceIcon device={s.device} />{s.browser} · {s.os}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duration(s.seconds)}</span>
                    {s.referrer && <span>from {s.referrer}</span>}
                  </p>
                  <ol className="mt-3 space-y-1.5 border-l border-ink-700 pl-4">
                    {s.events.map((e, i) => (
                      <li key={i} className="relative text-[13px]">
                        <span className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ${e.type === 'pageview' ? 'bg-accent-500' : e.type === 'event' ? 'bg-silver-400' : 'bg-ink-600'}`} />
                        <span className="mr-2 text-[11px] tabular-nums text-silver-600">{new Date(e.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' })}</span>
                        {e.type === 'pageview' && <span className="text-silver-100">Opened {e.path}</span>}
                        {e.type === 'leave' && (
                          <span className="text-silver-500">
                            Left {e.path} after {duration(e.data?.seconds)}{e.data?.depth != null ? `, scrolled ${e.data.depth}%` : ''}
                          </span>
                        )}
                        {e.type === 'event' && (
                          <span className="text-silver-300">
                            {e.data?.name === 'click' ? `Clicked “${e.data.label}”` : e.data?.name}
                            {e.data?.to ? <span className="text-silver-600"> → {e.data.to}</span> : null}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </>
        )}
      </aside>
    </div>
  )
}

const AdminVisitors = () => {
  const { onExpired } = useAdmin()
  const [days, setDays] = useState(7)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [visitor, setVisitor] = useState(null)

  const load = useCallback(() => {
    setError(null)
    adminApi.visits(days).then(setData).catch((err) => (err.status === 401 ? onExpired() : setError(err.message)))
  }, [days, onExpired])

  useEffect(load, [load])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-silver-100">Visitors</h1>
          <p className="mt-1 text-sm text-silver-500">Anonymous: a random id per browser, location from the connection, no IP addresses stored.</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-ink-700 p-1" role="group" aria-label="Period">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => setDays(p.days)}
              aria-pressed={days === p.days}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${days === p.days ? 'bg-accent-600 text-white' : 'text-silver-400 hover:text-silver-100'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {data?.mode === 'off' && (
        <p className="mt-6 flex items-start gap-2 rounded-lg border border-ink-700 bg-ink-900 p-4 text-sm text-silver-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
          The visitor log needs the database: add DATABASE_URL in Vercel, then visits start appearing here.
        </p>
      )}
      {error && (
        <p className="mt-6 flex items-center gap-2 text-sm text-accent-400"><AlertTriangle className="h-4 w-4" />{error}</p>
      )}
      {!data && !error && <Loader2 className="mt-10 h-6 w-6 animate-spin text-silver-500" aria-label="Loading" />}

      {data && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Tile label="Visitors" value={data.totals.visitors} hint={`${data.totals.returning} came back`} />
            <Tile label="Sessions" value={data.totals.sessions} />
            <Tile label="Page views" value={data.totals.pageviews} />
            <Tile label="Pages / session" value={data.totals.pagesPerSession} />
            <Tile label="Avg time" value={duration(data.totals.avgSessionSeconds)} hint="per session, in view" />
            <Tile label="Kept for" value={`${data.retentionDays} days`} />
          </div>

          <Daily daily={data.daily} />

          <div className="grid gap-4 lg:grid-cols-3">
            <Ranked
              title="Pages, with average time"
              rows={data.pages}
              render={(r) => (
                <>
                  {r.label} <span className="text-silver-600">· {duration(r.avgSeconds)}</span>
                </>
              )}
            />
            <Ranked title="What they clicked" rows={data.actions} />
            <Ranked title="Where they came from" rows={data.referrers} />
            <Ranked title="Countries" rows={data.countries} />
            <Ranked title="Cities" rows={data.cities} />
            <div className="grid gap-4">
              <Ranked title="Devices" rows={data.devices} />
              <Ranked title="Browsers" rows={data.browsers} />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-ink-800 bg-ink-900">
            <p className="border-b border-ink-800 p-4 font-display text-[11px] uppercase tracking-brand text-silver-500">
              Sessions, newest first {data.sessions.length >= 150 && '(latest 150)'}
            </p>
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="text-xs text-silver-500">
                <tr className="border-b border-ink-800">
                  <th className="px-4 py-2 font-medium">When</th>
                  <th className="px-4 py-2 font-medium">Visitor</th>
                  <th className="px-4 py-2 font-medium">Where</th>
                  <th className="px-4 py-2 font-medium">Device</th>
                  <th className="px-4 py-2 font-medium">Path</th>
                  <th className="px-4 py-2 font-medium">Time</th>
                  <th className="px-4 py-2 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-silver-600">No visits in this period yet.</td>
                  </tr>
                )}
                {data.sessions.map((s) => (
                  <tr key={s.id} className="border-b border-ink-800/60 align-top hover:bg-ink-850">
                    <td className="whitespace-nowrap px-4 py-2.5 text-silver-300">{when(s.startedAt)}</td>
                    <td className="px-4 py-2.5">
                      <button type="button" onClick={() => setVisitor(s.visitor)} className="font-mono text-xs text-accent-400 hover:text-accent-300 hover:underline">
                        {shortId(s.visitor)}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-silver-300">{s.location ?? '–'}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-silver-400">
                      <span className="inline-flex items-center gap-1.5"><DeviceIcon device={s.device} />{s.browser}</span>
                    </td>
                    <td className="max-w-[22rem] px-4 py-2.5 text-xs text-silver-400">
                      <span className="inline-flex items-start gap-1"><FileText className="mt-0.5 h-3 w-3 shrink-0" />{s.path.join(' → ') || s.entry}</span>
                      {s.referrer && <span className="mt-0.5 block text-silver-600">from {s.referrer}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-silver-300">{duration(s.seconds)}</td>
                    <td className="px-4 py-2.5 tabular-nums text-silver-400">
                      <span className="inline-flex items-center gap-1"><MousePointerClick className="h-3 w-3" />{s.actions.length}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {visitor && <VisitorPanel id={visitor} onClose={() => setVisitor(null)} />}
    </div>
  )
}

export default AdminVisitors
