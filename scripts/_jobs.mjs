/**
 * The public roles for build-time output (sitemap, prerendered meta).
 * Reads the jobs database when DATABASE_URL is set, so roles posted in /admin
 * are included; otherwise, or if the database cannot be reached, the seed
 * roles in src/data/jobs.js. Drafts are never included.
 */
import { jobs as seedJobs } from '../src/data/jobs.js'

export const loadPublicJobs = async () => {
  let jobs = seedJobs
  try {
    const { listJobs } = await import('../api/_lib/store.js')
    jobs = await listJobs()
  } catch (error) {
    console.warn(`jobs: using seed roles (${error.message})`)
  }
  return jobs.filter((j) => j.status === 'open' || j.status === 'closed')
}
