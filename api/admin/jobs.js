/**
 * Job management for the admin portal. Every method requires a signed-in admin.
 *
 *   GET    /api/admin/jobs            → { jobs }  everything, drafts included
 *   POST   /api/admin/jobs            { job } → create
 *   PUT    /api/admin/jobs?id=<id>    { job } → replace
 *   DELETE /api/admin/jobs?id=<id>    → remove
 *
 * Optional: VERCEL_DEPLOY_HOOK_URL (Vercel → Settings → Git → Deploy Hooks).
 * When set, every change triggers a rebuild so the sitemap and the link-preview
 * text for /careers/<id> pick up the new role too. The role itself is live on
 * the careers page immediately either way.
 */
import { validateJob, makeJobId, isValidJobId } from '../../src/lib/jobs.js'
import { listJobs, getJob, saveJob, deleteJob, StoreNotConfigured } from '../_lib/store.js'
import { currentAdmin, hasAdminHeader } from '../_lib/auth.js'
import { send, readJson, query } from '../_lib/http.js'

const NO_STORE = { 'Cache-Control': 'no-store' }

const triggerRebuild = async () => {
  if (!process.env.VERCEL_DEPLOY_HOOK_URL) return
  try {
    await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' })
  } catch (error) {
    console.error('[admin] Deploy hook failed:', error.message)
  }
}

export default async function handler(req, res) {
  const admin = currentAdmin(req)
  if (!admin) return send(res, 401, { message: 'Please sign in again.' }, NO_STORE)
  if (req.method !== 'GET' && !hasAdminHeader(req)) return send(res, 403, { message: 'Forbidden.' })

  const id = query(req).get('id')

  try {
    if (req.method === 'GET') {
      return send(res, 200, { jobs: await listJobs() }, NO_STORE)
    }

    if (req.method === 'DELETE') {
      if (!isValidJobId(id)) return send(res, 400, { message: 'Missing role id.' })
      const removed = await deleteJob(id)
      if (!removed) return send(res, 404, { message: 'Role not found.' })
      await triggerRebuild()
      return send(res, 200, { ok: true }, NO_STORE)
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await readJson(req)
      const { values, errors } = validateJob(body.job ?? {})
      if (Object.keys(errors).length > 0) {
        return send(res, 400, { message: 'Please check the highlighted fields.', errors })
      }

      let jobId
      if (req.method === 'PUT') {
        if (!isValidJobId(id) || !(await getJob(id))) return send(res, 404, { message: 'Role not found.' })
        jobId = id
      } else {
        do jobId = makeJobId(values.title)
        while (await getJob(jobId))
      }

      const job = await saveJob({ ...values, id: jobId })
      console.log(`[admin] ${admin} ${req.method === 'PUT' ? 'updated' : 'created'} ${jobId} (${job.status})`)
      await triggerRebuild()
      return send(res, req.method === 'PUT' ? 200 : 201, { job }, NO_STORE)
    }

    return send(res, 405, { message: 'Method not allowed.' }, { Allow: 'GET, POST, PUT, DELETE' })
  } catch (error) {
    if (error instanceof StoreNotConfigured) return send(res, 503, { message: error.message })
    if (error instanceof SyntaxError) return send(res, 400, { message: 'The request could not be read.' })
    console.error('[admin] Job request failed:', error.message)
    return send(res, 500, { message: 'That did not save. Please try again.' })
  }
}
