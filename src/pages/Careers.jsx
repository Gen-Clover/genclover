import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Mail, SearchX, Info } from 'lucide-react'
import Button from '../components/ui/Button'
import JobCard from '../components/careers/JobCard'
import JobDetailContent, { ApplyButton } from '../components/careers/JobDetailContent'
import { CopyAddress } from '../components/careers/EmailOptions'
import FilterMenu from '../components/careers/FilterMenu'
import { usePublicJobs } from '../lib/jobsApi'
import {
  emptyFilters,
  filterJobs,
  countFor,
  activeFilterCount,
  workplaceOptions,
  employmentTypeOptions,
  departmentOptions,
  datePostedOptions,
  experienceFilterOptions,
  sortOptions,
} from '../lib/jobs'
import { contact, routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'
import { useMotionVariants } from '../lib/motion'

/** What candidates can expect. Specific to working here, not the client pitch. */
const workingHere = [
  {
    title: 'Real client work from the start',
    description:
      'You work on systems clients depend on: AI workflows, data platforms, web applications and websites.',
  },
  {
    title: 'Direct contact with the people who need it',
    description:
      'You talk to the people who wrote the requirement, not to a chain of intermediaries.',
  },
  {
    title: 'Reviewed, traceable releases',
    description:
      'Every change goes through a pull request and a preview environment before production.',
  },
  {
    title: 'Writing things down',
    description:
      'Decisions, scope and trade-offs are written down, so nobody has to remember what was agreed.',
  },
  {
    title: 'Remote-friendly',
    description:
      'Most collaboration is written and asynchronous, with calls arranged across Indian and international time zones.',
  },
  {
    title: 'Ownership after launch',
    description:
      'You see how your work behaves in production, and you help keep it healthy.',
  },
]

/* ------------------------------------------------ filters ⇄ URL params */

const LIST_PARAMS = { workplace: 'wp', type: 'type', dept: 'dept' }

const readFilters = (params) => ({
  ...emptyFilters,
  q: params.get('q') ?? '',
  loc: params.get('loc') ?? '',
  workplace: params.get(LIST_PARAMS.workplace)?.split(',').filter(Boolean) ?? [],
  type: params.get(LIST_PARAMS.type)?.split(',').filter(Boolean) ?? [],
  dept: params.get(LIST_PARAMS.dept)?.split(',').filter(Boolean) ?? [],
  exp: params.get('exp') ?? '',
  posted: params.get('posted') ?? '',
  hideClosed: params.get('open') === '1',
  sort: params.get('sort') ?? 'recent',
})

const writeFilters = (f, job) => {
  const params = new URLSearchParams()
  if (f.q) params.set('q', f.q)
  if (f.loc) params.set('loc', f.loc)
  for (const [key, param] of Object.entries(LIST_PARAMS)) if (f[key].length) params.set(param, f[key].join(','))
  if (f.exp !== '') params.set('exp', f.exp)
  if (f.posted) params.set('posted', f.posted)
  if (f.hideClosed) params.set('open', '1')
  if (f.sort !== 'recent') params.set('sort', f.sort)
  if (job) params.set('job', job)
  return params
}

/** Matches Tailwind's lg breakpoint, where the list and detail sit side by side. */
const useIsLarge = () => {
  const query = '(min-width: 1024px)'
  // Starts false, like the pre-rendered HTML, and switches after mount, so the
  // first browser render matches the page it takes over.
  const [large, setLarge] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setLarge(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return large
}

/**
 * Careers: a job board. Search and filter pills along the top, results on the
 * left and the selected role on the right (on small screens a result opens
 * its own page). Filters live in the URL, so a filtered view can be shared.
 */
const Careers = () => {
  usePageMeta(pageMeta.careers)
  const v = useMotionVariants()
  const isLarge = useIsLarge()
  const { jobs, loading } = usePublicJobs()
  const [params, setParams] = useSearchParams()

  const filters = useMemo(() => readFilters(params), [params])
  const [draft, setDraft] = useState({ q: filters.q, loc: filters.loc })
  useEffect(() => setDraft({ q: filters.q, loc: filters.loc }), [filters.q, filters.loc])

  const results = useMemo(() => filterJobs(jobs, filters), [jobs, filters])
  const openCount = jobs.filter((j) => j.status === 'open').length
  const selectedId = params.get('job')
  const selected = results.find((j) => j.id === selectedId) ?? results[0] ?? null

  const update = (patch, job = selectedId) =>
    setParams(writeFilters({ ...filters, ...patch }, job), { replace: true, preventScrollReset: true })

  const onSearch = (e) => {
    e.preventDefault()
    update({ q: draft.q.trim(), loc: draft.loc.trim(), sort: draft.q.trim() ? 'relevance' : filters.sort }, null)
  }

  const clearAll = () => {
    setDraft({ q: '', loc: '' })
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })
  }

  const counts = (facet, key, options) =>
    Object.fromEntries(options.map((o) => [o.value, countFor(jobs, filters, facet, (j) => j[key] === o.value)]))

  // Only offer departments that have (or had) roles, so no option leads nowhere.
  const departments = departmentOptions.filter((d) => jobs.some((j) => j.department === d.value))
  const anyActive = activeFilterCount(filters) > 0 || filters.q || filters.loc

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[28rem] opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 -top-24 h-[30rem] w-[30rem] rounded-full bg-accent-900/25 blur-[140px]"
        aria-hidden="true"
      />

      <div className="container relative pb-14 pt-24 md:pt-28">
        {/* --------------------------------------------------- intro */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={v.stagger(0.06)}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <motion.p variants={v.fadeUp} className="eyebrow">
              Careers
            </motion.p>
            <motion.h1 variants={v.riseIn} className="mt-3 text-3xl leading-[1.08] tracking-tight md:text-4xl">
              Build things that are meant to last.
            </motion.h1>
            <motion.p variants={v.fadeUp} className="mt-2 max-w-2xl text-sm leading-relaxed text-silver-400 md:text-base">
              We care about engineering quality, clear thinking and honest communication, and we
              look for people who do too.
            </motion.p>
          </div>
          <motion.div variants={v.fadeUp} className="flex shrink-0 flex-col items-start gap-1.5 lg:items-end">
            <ApplyButton variant="secondary" size="md">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Send a general application
            </ApplyButton>
            <span className="text-xs text-silver-500">A short note and a link to work you are proud of.</span>
            <CopyAddress address={contact.email} />
          </motion.div>
        </motion.div>

        {/* ---------------------------------------------------- search */}
        <form
          role="search"
          onSubmit={onSearch}
          className="mt-7 grid gap-2 rounded-xl border border-ink-700 bg-ink-850/90 p-2 backdrop-blur-sm md:grid-cols-[1.4fr_1fr_auto]"
        >
          <label className="relative block">
            <span className="sr-only">Job title, skill or keyword</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500" aria-hidden="true" />
            <input
              type="search"
              value={draft.q}
              onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
              placeholder="Job title, skill or keyword"
              className="h-11 w-full rounded-lg border border-transparent bg-ink-900 pl-10 pr-3 text-base text-silver-100 outline-none placeholder:text-silver-600 focus:border-accent-600 sm:text-sm"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Location or remote</span>
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500" aria-hidden="true" />
            <input
              type="search"
              value={draft.loc}
              onChange={(e) => setDraft((d) => ({ ...d, loc: e.target.value }))}
              placeholder="City, or “remote”"
              className="h-11 w-full rounded-lg border border-transparent bg-ink-900 pl-10 pr-3 text-base text-silver-100 outline-none placeholder:text-silver-600 focus:border-accent-600 sm:text-sm"
            />
          </label>
          <Button type="submit" size="md">
            Search jobs
          </Button>
        </form>

        {/* --------------------------------------------------- filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filters">
          <FilterMenu
            label="Date posted"
            options={datePostedOptions}
            value={filters.posted}
            onChange={(posted) => update({ posted })}
          />
          <FilterMenu
            label="Experience"
            options={experienceFilterOptions}
            value={filters.exp}
            onChange={(exp) => update({ exp })}
          />
          <FilterMenu
            label="Workplace"
            multiple
            options={workplaceOptions}
            value={filters.workplace}
            counts={counts('workplace', 'workplace', workplaceOptions)}
            onChange={(workplace) => update({ workplace })}
          />
          <FilterMenu
            label="Job type"
            multiple
            options={employmentTypeOptions}
            value={filters.type}
            counts={counts('type', 'employmentType', employmentTypeOptions)}
            onChange={(type) => update({ type })}
          />
          {departments.length > 1 && (
            <FilterMenu
              label="Department"
              multiple
              options={departments}
              value={filters.dept}
              counts={counts('dept', 'department', departments)}
              onChange={(dept) => update({ dept })}
            />
          )}
          <button
            type="button"
            aria-pressed={filters.hideClosed}
            onClick={() => update({ hideClosed: !filters.hideClosed })}
            className={`inline-flex h-9 items-center rounded-full border px-3.5 text-sm transition-colors ${
              filters.hideClosed
                ? 'border-accent-600 bg-accent-950/50 text-silver-100'
                : 'border-ink-600 bg-ink-900 text-silver-300 hover:border-ink-500 hover:text-silver-100'
            }`}
          >
            Open roles only
          </button>
          {anyActive && (
            <button
              type="button"
              onClick={clearAll}
              className="h-9 px-2 text-sm text-accent-400 transition-colors hover:text-accent-300"
            >
              Clear all
            </button>
          )}

          <label className="ml-auto flex items-center gap-2 text-sm text-silver-500">
            Sort
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="h-9 rounded-lg border border-ink-600 bg-ink-900 px-2.5 text-sm text-silver-200 outline-none focus:border-accent-600"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* --------------------------------------------------- results */}
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div aria-labelledby="results-heading" aria-busy={loading}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 id="results-heading" className="text-sm font-medium text-silver-300" aria-live="polite">
                {loading ? 'Loading roles…' : `${results.length} role${results.length === 1 ? '' : 's'}`}
                {!loading && openCount === 0 && jobs.length > 0 && (
                  <span className="text-silver-500"> · no open roles right now</span>
                )}
              </h2>
            </div>

            {!loading && openCount === 0 && jobs.length > 0 && (
              <p className="mb-3 flex items-start gap-2.5 rounded-lg border border-ink-700 bg-ink-900 px-3.5 py-3 text-xs leading-relaxed text-silver-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                These roles are closed, and listed as a record of who we hire. Send a general
                application and we will keep it on file for the next opening.
              </p>
            )}

            {loading ? (
              <ul className="space-y-3" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="h-32 animate-pulse rounded-xl border border-ink-800 bg-ink-900" />
                ))}
              </ul>
            ) : results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink-700 px-6 py-12 text-center">
                <SearchX className="mx-auto h-6 w-6 text-silver-500" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-silver-200">No roles match these filters.</p>
                <p className="mt-1 text-sm text-silver-500">Try fewer filters, or a different keyword.</p>
                <Button type="button" variant="secondary" size="sm" className="mt-5" onClick={clearAll}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {results.map((job) => (
                  <li key={job.id}>
                    <JobCard
                      job={job}
                      to={`${routes.careers}/${job.id}`}
                      selected={isLarge && selected?.id === job.id}
                      onSelect={(e) => {
                        // Side-by-side on large screens; modified clicks still open the page.
                        if (!isLarge || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                        e.preventDefault()
                        update({}, job.id)
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail pane, large screens only */}
          {isLarge && selected && (
            <div
              key={selected.id}
              className="surface surface-static sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-6"
              aria-label={`${selected.title} details`}
            >
              <JobDetailContent job={selected} inPane />
            </div>
          )}
        </div>

        {/* ------------------------------------ what you would be joining */}
        <div className="mt-14">
          <h2 className="font-display text-xs font-semibold uppercase tracking-brand text-silver-400">
            What you would be joining
          </h2>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-3">
            {workingHere.map((item) => (
              <li key={item.title} className="bg-ink-950 p-5">
                <h3 className="text-sm font-semibold text-silver-100">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-silver-400">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Careers
