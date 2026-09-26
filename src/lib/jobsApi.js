import { useEffect, useState } from 'react'
import { jobs as seedJobs } from '../data/jobs'

/**
 * Careers data for the public pages. Roles come from /api/jobs; if that cannot
 * be reached (a network blip, or the API not running) the seed roles in
 * src/data/jobs.js are shown instead, so the page is never empty.
 */

const getJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw Object.assign(new Error(body.message || 'Request failed'), { status: response.status })
  return body
}

let listCache = null

export const usePublicJobs = () => {
  const [state, setState] = useState(() =>
    listCache ? { jobs: listCache, loading: false } : { jobs: [], loading: true }
  )

  useEffect(() => {
    let live = true
    getJson('/api/jobs')
      .then(({ jobs }) => {
        listCache = jobs
        if (live) setState({ jobs, loading: false })
      })
      .catch(() => {
        if (live) setState({ jobs: listCache ?? seedJobs, loading: false })
      })
    return () => {
      live = false
    }
  }, [])

  return state
}

/** One role. `notFound` is only true when the API says so, never on a network error. */
export const usePublicJob = (id) => {
  const cached = listCache?.find((j) => j.id === id)
  const [state, setState] = useState({ job: cached ?? null, loading: !cached, notFound: false })

  useEffect(() => {
    let live = true
    getJson(`/api/jobs?id=${encodeURIComponent(id)}`)
      .then(({ job }) => live && setState({ job, loading: false, notFound: false }))
      .catch((error) => {
        if (!live) return
        const seed = seedJobs.find((j) => j.id === id)
        if (error.status === 404) setState({ job: null, loading: false, notFound: true })
        else setState({ job: seed ?? null, loading: false, notFound: !seed })
      })
    return () => {
      live = false
    }
  }, [id])

  return state
}
