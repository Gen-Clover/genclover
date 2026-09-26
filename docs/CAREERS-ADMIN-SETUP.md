# Careers admin portal: setup

How to turn on job posting from `/admin` for a Vercel deployment. It takes about ten minutes.
Until these steps are done, the live careers page keeps working and shows the seed roles in
`src/data/jobs.js`. Only the admin portal is unavailable.

## 1. Create the database (Neon, free tier)

1. Open the project in Vercel, then **Storage → Create Database → Neon (Serverless Postgres)**.
2. Name it `gc-website-jobs`. Pick the region closest to the Vercel functions (for example
   Mumbai `ap-south-1`, or whatever region the project already uses).
3. Connect it to the project for **Production** and **Preview** (and **Development** if you use
   `vercel env pull`).

Vercel adds `DATABASE_URL` (and a few `POSTGRES_*` variables) to the project automatically.
You don't need to create any tables. The first request creates the `jobs` and
`admin_login_attempts` tables and seeds them with the two existing roles.

> Preview and Production may share one database. If you want test posts kept away from the
> live site, create a separate Neon branch for Preview in the Neon console and point Preview's
> `DATABASE_URL` at it.

## 2. Create the admin sign-in

On your machine, in the project folder:

```
npm run admin:hash-password
```

Type a strong password (12+ characters; a password manager's generated one is best) twice.
The command prints two lines:

```
ADMIN_PASSWORD_HASH=scrypt:...
ADMIN_SESSION_SECRET=...
```

In Vercel → **Settings → Environment Variables**, add these for Production and Preview:

| Name | Value |
| --- | --- |
| `ADMIN_EMAIL` | the email you'll sign in with, e.g. `admin@genclover.com` |
| `ADMIN_PASSWORD_HASH` | the `scrypt:...` value |
| `ADMIN_SESSION_SECRET` | the random value |

Only the hash is stored, never the password. Keep the password in your password manager.

## 3. Optional: rebuild after each change

A saved role appears on `/careers` within about a minute with no rebuild. The sitemap and the
link-preview text for `/careers/<id>` are generated at build time, though. To include new roles
there too:

1. Vercel → **Settings → Git → Deploy Hooks**, then create a hook named `gc-website-jobs-changed`
   on the production branch.
2. Add its URL as the environment variable `VERCEL_DEPLOY_HOOK_URL`.

## 4. Redeploy and sign in

Redeploy so the new variables take effect, then open `https://genclover.com/admin`. Nothing on
the site links there, so bookmark it.

## Using the portal

- **Post a job**: fill in the form, choose **Open** (live now), **Draft** (only visible in the
  admin portal) or **Closed**, and save. The preview on the right shows how the card will look.
- **Close / Reopen**: the lock icon in the list. Closed roles stay on the careers page as a
  record, marked closed, and are not indexed by search engines.
- **Delete**: removes the role permanently. Prefer **Close** unless the post was a mistake.
- **Experience**: the minimum and maximum years drive the careers page's experience filter.
  Leave the maximum blank for "3+ years".
- **Locations**: separate several with semicolons (`Chandigarh, India; Mohali, India`).

## Security notes

- Sessions last 12 hours, in an httpOnly, Secure, SameSite=Strict cookie scoped to
  `/api/admin`. Page scripts can't read it, and other sites can't send it.
- Five failed sign-ins from one address lock it out for 15 minutes (tracked in the database).
- `/admin` and `/api/admin/*` send `noindex` and `no-store`.
- **Change the password:** run `npm run admin:hash-password` again, replace
  `ADMIN_PASSWORD_HASH`, and redeploy.
- **Sign everyone out:** replace `ADMIN_SESSION_SECRET` and redeploy.

## Local development

`npm run dev` runs the `/api` functions inside the Vite dev server. Without `DATABASE_URL`, roles
are stored in `.data/jobs.json` (gitignored). Delete that file to reset to the seed roles. Put
`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` in `.env.local` (gitignored) to
sign in at `http://localhost:5173/admin`.
