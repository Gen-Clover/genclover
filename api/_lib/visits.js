/**
 * The visitor log: anonymous visit events, read in /admin → Visitors.
 *
 *   DATABASE_URL set      → Postgres, the same Neon database as the jobs. The
 *                           table is created on first use.
 *   not set, local dev    → .data/visits.json (gitignored), so it can be tried
 *                           without a database.
 *   not set, on Vercel    → nothing is stored.
 *
 * What a row holds, and what it never holds: a random visitor id and session
 * id made in the visitor's browser, the page, what happened there, and the
 * country, region and city Vercel derives from the connection. Never the IP
 * address, never a name, email or anything typed into a form. Rows older than
 * RETENTION_DAYS are deleted.
 */
import { neon } from '@neondatabase/serverless'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
export const visitsMode = DATABASE_URL ? 'postgres' : process.env.VERCEL ? 'off' : 'file'

export const RETENTION_DAYS = 180
/** The most rows a single dashboard request reads. */
const READ_LIMIT = 50000

/* ------------------------------------------------------------- postgres */

const sql = DATABASE_URL ? neon(DATABASE_URL) : null
let ready = null

const ensureSchema = () => {
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS visit_events (
        id        bigserial PRIMARY KEY,
        at        timestamptz NOT NULL,
        visitor   text NOT NULL,
        session   text NOT NULL,
        type      text NOT NULL,
        path      text NOT NULL,
        data      jsonb,
        country   text,
        region    text,
        city      text,
        device    text,
        browser   text,
        os        text,
        referrer  text
      )`
    await sql`CREATE INDEX IF NOT EXISTS visit_events_at ON visit_events (at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS visit_events_visitor ON visit_events (visitor, at)`
  })().catch((error) => {
    ready = null
    throw error
  })
  return ready
}

/** Old rows go now and then, not on every write. */
let lastPrune = 0
const prunePg = async () => {
  if (Date.now() - lastPrune < 6 * 3600 * 1000) return
  lastPrune = Date.now()
  await sql`DELETE FROM visit_events WHERE at < now() - make_interval(days => ${RETENTION_DAYS})`
}

/* ----------------------------------------------------------- local file */

const FILE = resolve(process.cwd(), '.data', 'visits.json')
const readFileStore = async () => {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch {
    return []
  }
}

/* ------------------------------------------------------------------ API */

export const addVisitEvents = async (rows) => {
  if (!rows.length || visitsMode === 'off') return
  if (visitsMode === 'postgres') {
    await ensureSchema()
    for (const r of rows) {
      await sql`
        INSERT INTO visit_events (at, visitor, session, type, path, data, country, region, city, device, browser, os, referrer)
        VALUES (${r.at}, ${r.visitor}, ${r.session}, ${r.type}, ${r.path}, ${r.data ? JSON.stringify(r.data) : null}::jsonb,
                ${r.country}, ${r.region}, ${r.city}, ${r.device}, ${r.browser}, ${r.os}, ${r.referrer})`
    }
    await prunePg().catch(() => {})
    return
  }
  const cutoff = Date.now() - RETENTION_DAYS * 864e5
  const all = (await readFileStore()).filter((r) => new Date(r.at).getTime() > cutoff)
  all.push(...rows)
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(all))
}

/** Events since `since` (a Date), oldest first; optionally for one visitor. */
export const listVisitEvents = async ({ since, visitor } = {}) => {
  if (visitsMode === 'postgres') {
    await ensureSchema()
    const rows = visitor
      ? await sql`SELECT * FROM visit_events WHERE visitor = ${visitor} ORDER BY at LIMIT ${READ_LIMIT}`
      : await sql`SELECT * FROM visit_events WHERE at >= ${since.toISOString()} ORDER BY at DESC LIMIT ${READ_LIMIT}`
    return rows.map((r) => ({ ...r, at: new Date(r.at).toISOString() })).sort((a, b) => a.at.localeCompare(b.at))
  }
  if (visitsMode === 'file') {
    const all = await readFileStore()
    return all.filter((r) => (visitor ? r.visitor === visitor : r.at >= since.toISOString())).sort((a, b) => a.at.localeCompare(b.at))
  }
  return []
}
