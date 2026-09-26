/**
 * Where job posts live.
 *
 *   DATABASE_URL set      → Postgres (Neon, added through the Vercel Marketplace).
 *                           The table is created, and seeded with src/data/jobs.js,
 *                           on first use, so there is no separate migration step.
 *   not set, local dev    → .data/jobs.json in the project folder (gitignored), so
 *                           the admin portal can be tried without a database.
 *   not set, on Vercel    → read-only: the seed roles are served and every write
 *                           fails with a clear "database not configured" message.
 */
import { neon } from '@neondatabase/serverless'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { jobs as seedJobs } from '../../src/data/jobs.js'

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

export const storeMode = DATABASE_URL ? 'postgres' : process.env.VERCEL ? 'readonly' : 'file'

export class StoreNotConfigured extends Error {
  constructor() {
    super('The jobs database is not configured. Add DATABASE_URL in Vercel to post and edit roles.')
  }
}

/* ------------------------------------------------------------- postgres */

const sql = DATABASE_URL ? neon(DATABASE_URL) : null
let ready = null

const ensureSchema = () => {
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id          text PRIMARY KEY,
        status      text NOT NULL,
        posted_at   timestamptz NOT NULL,
        data        jsonb NOT NULL,
        created_at  timestamptz NOT NULL DEFAULT now(),
        updated_at  timestamptz NOT NULL DEFAULT now()
      )`
    await sql`CREATE INDEX IF NOT EXISTS jobs_status_posted ON jobs (status, posted_at DESC)`
    await sql`
      CREATE TABLE IF NOT EXISTS admin_login_attempts (
        ip  text NOT NULL,
        at  timestamptz NOT NULL DEFAULT now()
      )`
    await sql`CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_at ON admin_login_attempts (ip, at)`

    const [{ count }] = await sql`SELECT count(*)::int AS count FROM jobs`
    if (count === 0) {
      for (const job of seedJobs) await upsertPg(job)
    }
  })().catch((error) => {
    ready = null // let the next request retry instead of caching the failure
    throw error
  })
  return ready
}

const fromRow = (row) => ({
  ...row.data,
  id: row.id,
  status: row.status,
  postedAt: new Date(row.posted_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
})

const upsertPg = async (job) => {
  const { id, status, postedAt, updatedAt, ...data } = job
  const [row] = await sql`
    INSERT INTO jobs (id, status, posted_at, data)
    VALUES (${id}, ${status}, ${postedAt}, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (id) DO UPDATE
      SET status = EXCLUDED.status, posted_at = EXCLUDED.posted_at,
          data = EXCLUDED.data, updated_at = now()
    RETURNING *`
  return fromRow(row)
}

/* ----------------------------------------------------------- local file */

const FILE = resolve(process.cwd(), '.data', 'jobs.json')

const readFileStore = async () => {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch {
    const seeded = seedJobs.map((job) => ({ ...job, updatedAt: job.postedAt }))
    await writeFileStore(seeded)
    return seeded
  }
}

const writeFileStore = async (jobs) => {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(jobs, null, 2))
}

/* ------------------------------------------------------------------ API */

const byPosted = (a, b) => new Date(b.postedAt) - new Date(a.postedAt)

/** Every role, drafts included. Callers decide what the public may see. */
export const listJobs = async () => {
  if (storeMode === 'postgres') {
    await ensureSchema()
    return (await sql`SELECT * FROM jobs ORDER BY posted_at DESC`).map(fromRow)
  }
  if (storeMode === 'file') return (await readFileStore()).sort(byPosted)
  return seedJobs.map((job) => ({ ...job, updatedAt: job.postedAt })).sort(byPosted)
}

export const getJob = async (id) => {
  if (storeMode === 'postgres') {
    await ensureSchema()
    const [row] = await sql`SELECT * FROM jobs WHERE id = ${id}`
    return row ? fromRow(row) : null
  }
  return (await listJobs()).find((job) => job.id === id) ?? null
}

export const saveJob = async (job) => {
  if (storeMode === 'postgres') {
    await ensureSchema()
    return upsertPg(job)
  }
  if (storeMode === 'file') {
    const jobs = await readFileStore()
    const saved = { ...job, updatedAt: new Date().toISOString() }
    const index = jobs.findIndex((j) => j.id === job.id)
    if (index >= 0) jobs[index] = saved
    else jobs.push(saved)
    await writeFileStore(jobs)
    return saved
  }
  throw new StoreNotConfigured()
}

export const deleteJob = async (id) => {
  if (storeMode === 'postgres') {
    await ensureSchema()
    const rows = await sql`DELETE FROM jobs WHERE id = ${id} RETURNING id`
    return rows.length > 0
  }
  if (storeMode === 'file') {
    const jobs = await readFileStore()
    const next = jobs.filter((j) => j.id !== id)
    await writeFileStore(next)
    return next.length !== jobs.length
  }
  throw new StoreNotConfigured()
}

/* ------------------------------------------------- login attempt ledger */

const memoryAttempts = new Map()

/** Failed logins from this IP within the window. Postgres-backed when available. */
export const recentFailedLogins = async (ip, windowMinutes) => {
  if (storeMode === 'postgres') {
    await ensureSchema()
    const [{ count }] = await sql`
      SELECT count(*)::int AS count FROM admin_login_attempts
      WHERE ip = ${ip} AND at > now() - make_interval(mins => ${windowMinutes})`
    return count
  }
  const since = Date.now() - windowMinutes * 60_000
  const list = (memoryAttempts.get(ip) ?? []).filter((t) => t > since)
  memoryAttempts.set(ip, list)
  return list.length
}

export const recordFailedLogin = async (ip) => {
  if (storeMode === 'postgres') {
    await ensureSchema()
    await sql`INSERT INTO admin_login_attempts (ip) VALUES (${ip})`
    // Keep the ledger small; a day of history is plenty for rate limiting.
    await sql`DELETE FROM admin_login_attempts WHERE at < now() - interval '1 day'`
    return
  }
  memoryAttempts.set(ip, [...(memoryAttempts.get(ip) ?? []), Date.now()])
}

export const clearFailedLogins = async (ip) => {
  if (storeMode === 'postgres') {
    await ensureSchema()
    await sql`DELETE FROM admin_login_attempts WHERE ip = ${ip}`
    return
  }
  memoryAttempts.delete(ip)
}
