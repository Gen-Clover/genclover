/**
 * Public careers feed. (Careers)
 *
 *   GET /api/jobs          → { jobs }  open and closed roles, never drafts
 *   GET /api/jobs?id=<id>  → { job }   one role, 404 for drafts and unknown ids
 *
 * Cached briefly at the edge, so a role saved in /admin appears within a minute.
 */
import { listJobs, getJob } from './_lib/store.js'
import { send, query } from './_lib/http.js'

const CACHE = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }

const isPublic = (job) => job && (job.status === 'open' || job.status === 'closed')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return send(res, 405, { message: 'Method not allowed.' }, { Allow: 'GET' })
  }

  try {
    const id = query(req).get('id')
    if (id) {
      const job = await getJob(id)
      return isPublic(job) ? send(res, 200, { job }, CACHE) : send(res, 404, { message: 'Role not found.' })
    }
    const jobs = (await listJobs()).filter(isPublic)
    return send(res, 200, { jobs }, CACHE)
  } catch (error) {
    console.error('[jobs] Read failed:', error.message)
    return send(res, 503, { message: 'Roles are not available right now.' })
  }
}
