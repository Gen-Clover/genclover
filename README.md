# Gen Clover — Website

Public website for Gen Clover. React 18 + Vite + Tailwind CSS + Framer Motion, deployed on Vercel.

Built to the *Gen Clover Website Product & Development Specification v1.0.0*. Section
references below (`§`) point at that document.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

`/api/lead` is a Vercel serverless function. `vite dev` does **not** run it — use
`vercel dev` if you need to exercise the enquiry form end to end locally.

---

## The one rule that matters

**Content lives in `src/data/`. Components render it. Never the other way round.**

Services, Work and Industries are three *separate* dimensions (§3, §25). A project belongs
to one work category, one industry and one primary service, and may reference additional
services. Do not merge them, and do not re-declare any of these lists inside a component —
`src/data/taxonomy.js` is the single source of truth for all three.

Adding a service, project or industry should never require touching a layout file.

---

## How to add things

### Add a service

1. Append an entry to `services` in **`src/data/services.js`**, and its long-form page content (intro, signals, approach, outcomes, stack, FAQs) to **`src/data/serviceDetails.js`**. Copy the shape of an
   existing one — `slug`, `title`, `shortDescription`, `heroHeadline`, `heroDescription`,
   `capabilities[]`, `deliverables[]`, `relatedIndustries[]`, `seo`.
2. Add the slug to `SERVICE_SLUGS` in **`src/data/taxonomy.js`**.
3. Add the slug to the `ALLOWED.service` array in **`api/lead.js`** so the enquiry form
   will accept it.

That is it. The service now appears in the services hub, the footer,
the Start a Project form and its own page at `/services/<slug>` — all derived.

If you **rename** a service, keep the old slug alive by adding it to that service's
`legacySlugs` array. `/services/<old-slug>` then redirects to the new URL (§25).

### Add a project (real client work)

Append to `projects` in **`src/data/projects.js`**. For client work you must set:

```js
status: 'client',
clientName: 'Acme Ltd',      // only with written permission
outcomes: ['Reduced…'],      // verified figures only — see below
permissionsApproved: true,   // confirms the client approved publication
published: true,             // the last switch you flip
```

`category` must be a `workCategories` id, `industry` an `industries` id, and
`primaryService` a service slug — all from `taxonomy.js`.

Leave `published: false` while drafting; only `published: true` items are ever rendered.

### Draft projects

A project with `published: false` never renders anywhere. The four sector case studies
at the end of `projects.js` (financial services, real estate, education, hospitality)
are drafts: publish one only after the Product Owner confirms it describes a real
engagement and corrects the details to match.

### Add an industry

Add the id and label to `industries` in **`taxonomy.js`**, then add matching page copy to
`industryContent` in **`src/data/industries.js`**. An industry with no page copy stays
available as a tag but gets no landing page.

### Add project imagery

Drop the file in `public/work/` and set `heroImage: '/work/your-file.jpg'` on the project.
Until then `ProjectVisual` draws the project's delivery flow as a diagram, from the `flow`
steps in its case study (`caseStudies.js`). A project with no flow gets a plain brand panel.
Never use stock photography or a fabricated interface mockup (§4).

---

## Truthfulness rules (§1.2, §2.1)

These are not style preferences. They were the reason for this rebuild.

- **No invented client names.** Clients are named only with written permission.
- **No invented projects.** Every published project must be real delivered work.
- **No unverified numbers.** The previous site published *92% accuracy, 35% churn
  reduction, 40% conversion increase, 60% engagement, 25% sales, 45% cost reduction, 96%
  classification accuracy*, *30+ US-based clients* and *98% satisfaction*, none of which
  were substantiated. They have been removed and must not return without evidence.
- **`testimonials` and `verifiedStats` in `src/data/proof.js` are empty on purpose.**
  Add an entry only with a real named person, their permission, and wording they approved.
  The Proof section renders them automatically once they exist, and hides them while empty.
- **No public fixed pricing** (§6.3, §12). Use `PRICING_STATEMENT` from `services.js`.

---

## Theming

The site ships a dark and a light theme. **Dark is the default and a first-time visitor always
gets it** — `prefers-color-scheme` is deliberately never consulted, so the OS setting does not
override the brand's primary expression. The visitor's choice is then remembered in
`localStorage` under `gc-theme`.

Every colour token in `tailwind.config.js` resolves to a CSS custom property defined twice in
`src/index.css` — once under `:root` (dark) and once under `:root[data-theme="light"]`. That
means **components never need a light-mode branch**: `bg-ink-950` is "page background" in both
themes, `text-silver-400` is "secondary text" in both.

Read the neutral scales semantically, not literally:

| Token | Means | Dark | Light |
| --- | --- | --- | --- |
| `ink-950` | page background | near-black | white |
| `ink-900` | muted section | #0A0A0C | #F4F6F8 |
| `ink-850` | card surface | #0F0F12 | white |
| `ink-800`–`600` | dividers and borders | dark greys | light greys |
| `silver-100` | headings | near-white | near-black |
| `silver-400`–`600` | secondary → meta text | mid greys | dark greys |

Notes for anyone extending it:

- **All six silver steps clear WCAG AA in both themes.** Verified with axe across every route.
  Do not darken them in dark mode or lighten them in light mode without re-running the audit.
- **Accent reds differ per theme.** Bright red does not carry 4.5:1 on white, so `accent-300/400/500`
  are darker in light mode while `accent-800/900/950` stay as light tints (they are used as
  backgrounds, not text).
- **The brand marks do not follow the theme.** `brand.red` and the `--clover-*` variables keep the
  wordmark and clover looking like themselves; only the neutral petals adapt so they stay visible
  on white.
- **For a genuinely different hue per theme** — the status badges, for example — use Tailwind's
  `dark:` variant, which is wired to `[data-theme="dark"]` in the config.
- A pre-paint script in `index.html` applies the saved theme before React mounts, so a returning
  light-mode visitor never sees a dark flash. It mirrors `src/lib/theme.jsx`; change both together.

## Project structure

```
api/lead.js              Serverless enquiry endpoint (validation, spam, rate limit)
api/jobs.js              Public careers feed (open and closed roles, never drafts)
api/admin/               Admin sign-in and job management behind /admin
api/_lib/                Job store (Postgres or local file), session auth, HTTP helpers
src/
  data/                  ← all content lives here
    taxonomy.js          Services / Work categories / Industries / statuses  (source of truth)
    services.js          The eight service domains
    projects.js          Work items + selectors
    industries.js        Industry page copy + enquiry form options
    process.js           How We Work stages, care plans, differentiators
    proof.js             Testimonials + verified stats (both intentionally empty)
    site.js              Contact details, routes, navigation model
    jobs.js              Seed roles (seeds the database; also the offline fallback)
  lib/
    seo.js               usePageMeta hook + per-page titles (§15)
    analytics.js         trackEvent seam + attribution capture (§16)
    motion.js            Shared variants, all reduced-motion aware (§4.1)
    theme.jsx            Dark/light state — defaults to dark, ignores the OS setting
    leadSchema.js        The 8-step brief: steps + validation (§9)
    jobs.js              Job model: options, validation, search and filters (shared with the API)
    intlOptions.js       Currency list (Intl) and phone country codes (libphonenumber-js)
  components/
    brand/               CloverMark + three-bar-E Wordmark
    ui/                  Button, Badge/StatusBadge, Section, ProjectVisual, ThemeToggle
    layout/              Header, Footer
    home/                The homepage sections, in spec order (§5.2)
    process/             ProcessRail + ProcessTimeline — the animated Discover→Grow flow
    work/                WorkCard, CaseStudySections
    form/                ProjectBriefForm + field primitives
    careers/             JobCard, JobDetailContent, FilterMenu
  pages/                 One file per route (admin/ is the /admin portal)
```

---

## SEO, pre-rendering and analytics

`npm run build` does four things: the browser bundle, a server bundle of the same app
(`src/entry-server.jsx`), the sitemap, then `scripts/prerender.mjs`, which writes one complete
HTML file per public route. Each file contains the page's real content, so crawlers, AI search
engines and link previews that don't run JavaScript see the text and links. It also carries the
page's title, description, canonical URL, share image and structured data (Organization,
WebSite, Service, BreadcrumbList, and JobPosting for open roles). The stylesheet is inlined and
the main font preloaded. In the browser, `src/main.jsx` hydrates that HTML in place.

- **Canonical host:** `https://www.genclover.com` (`site.url` in `src/data/site.js`). Keep the
  Vercel domain `genclover.com` as a permanent redirect to it.
- **New routes** without a pre-rendered file (for example a role posted after the last deploy)
  fall back to `dist/app-shell.html`, an empty noindex page the app renders into.
- **Components must render without `window` or `document`.** Touch them in effects or event
  handlers, never during render. The build fails loudly if a page cannot be rendered.
- **Share images** (1200 × 630): `public/og/default.jpg` and one per case study in
  `public/og/work/`. They are generated from the LinkedIn post templates; a new case study
  needs its image added there, and its search snippet (under 156 characters) in
  `src/data/projectSeo.js`.
- **Fonts** are self-hosted from `@fontsource` packages; nothing loads from Google Fonts.

**Google Analytics 4** loads only when `VITE_GA_MEASUREMENT_ID` is set in Vercel. Page views
come from GA4's enhanced measurement. The site's own events are sent too: `lead_form_start`,
`lead_form_step_complete`, `lead_form_submit` (plus GA4's `generate_lead` for Google Ads
conversions), `lead_form_abandon`, `job_application_submit` and the CTA clicks. Names, emails,
phone numbers and form text are never sent.

---

## Careers and the admin portal

The careers page is a job board: keyword and location search, filters for date posted,
experience, workplace (remote / hybrid / on-site), job type and department, and a results list
with a detail pane. Filters live in the URL, so a filtered view can be shared.

Roles are managed at **`/admin`**. Nothing on the site links to it and it is noindex. Sign in,
then post, edit, close, reopen or delete roles; a saved role is live on the careers page within
a minute.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres, added by Vercel → Storage → Neon. The table is created and seeded on first use |
| `ADMIN_EMAIL` | The admin sign-in email |
| `ADMIN_PASSWORD_HASH` | From `npm run admin:hash-password` (salted scrypt; the password itself is never stored) |
| `ADMIN_SESSION_SECRET` | 32+ random characters, also printed by that command. Changing it signs everyone out |
| `VERCEL_DEPLOY_HOOK_URL` | *Optional:* rebuild after each change so the sitemap and link previews include new roles |

Without `DATABASE_URL` the careers page shows the seed roles in `src/data/jobs.js` and the
admin portal cannot save. Locally, `npm run dev` runs the `/api` functions inside Vite and keeps
roles in `.data/jobs.json` (gitignored), so the portal works without a database; put the admin
variables in `.env.local`. Step-by-step setup:
[`docs/CAREERS-ADMIN-SETUP.md`](docs/CAREERS-ADMIN-SETUP.md).

---

## Enquiry form configuration

`/api/lead` needs **one** delivery method configured in Vercel → Settings → Environment
Variables. Until one is set it returns `503` and the form tells the visitor to email
instead — it never silently drops a lead.

| Variable | Purpose |
| --- | --- |
| `MS_TENANT_ID` | Directory (tenant) ID of the genclover.com Microsoft 365 |
| `MS_MAIL_CLIENT_ID` | Application (client) ID of the gc-website-mail app registration |
| `MS_MAIL_CLIENT_SECRET` | Client secret of that app registration |
| `LEAD_NOTIFY_FROM` | Mailbox internal notifications are sent from (default `no-reply@genclover.com`) |
| `LEAD_NOTIFY_TO` | Destination address, or several separated by commas (default `contact@genclover.com`) |
| `LEAD_CONFIRM_FROM` | Sender of the thank-you to the inquirer (default `contact@genclover.com`; `off` disables it) |
| `LEAD_CONFIRM_CC` | Copy of that thank-you, comma-separated (default `contact@genclover.com`; `none` for no copy) |
| `LEAD_WEBHOOK_URL` | *Alternative:* POST the lead record to a CRM/webhook |
| `LEAD_WEBHOOK_TOKEN` | Optional bearer token for that webhook |

Never commit these. `.env.example` documents them; `.env*` is gitignored.

The notification email is sent through Microsoft 365 with Microsoft Graph, from our own
`@genclover.com` mailbox, so it passes the domain's existing SPF, DKIM and DMARC with no
extra DNS records. The app registration needs the **application** permission `Mail.Send`
with admin consent, limited to the sending mailbox with an Exchange application access
policy so the website cannot send as anyone else.

Sender policy: internal notifications (such as a new inquiry) are sent from
`no-reply@genclover.com`, with reply-to set to the inquirer. Anything sent to people outside
the company comes from `contact@genclover.com`, so replies reach a monitored inbox. When an
external email is added, add `contact@genclover.com` to the same access policy group.

The full setup (every admin-portal change and PowerShell command, verification, secret
renewal and troubleshooting) is recorded in
[`docs/MICROSOFT-365-MAIL-SETUP.md`](docs/MICROSOFT-365-MAIL-SETUP.md).

### Microsoft 365 naming convention

Everything we create in Microsoft 365 and Vercel follows one pattern, so future apps and
mailboxes sort together and say what they do. Names describe the job, never a person or a
vendor. One app registration per capability, so each has only the permission it needs and
a leaked secret affects one thing.

| Thing | Pattern | In use |
| --- | --- | --- |
| Entra app registration | `gc-<system>-<capability>` | `gc-website-mail` |
| Client secret description | `<where-used>-<yyyy-mm created>` | `vercel-2026-09` |
| Sending-permission group | `gc-app-<app>-senders` | `gc-app-website-mail-senders@genclover.com` (hidden) |
| Shared mailbox | the role, not a person | `no-reply@` (internal automation), `contact@` (outsiders) |
| Mailbox display name | "Gen Clover" + team | `no-reply@` → "Gen Clover" |
| Exchange mail flow rule | `gc-mailflow-<action>-<target>` | `gc-mailflow-reject-no-reply` |
| Vercel variable | `MS_<CAPABILITY>_<VALUE>` | `MS_MAIL_CLIENT_ID`, `MS_MAIL_CLIENT_SECRET` (`MS_TENANT_ID` is shared) |

The brief collects an optional budget as any ISO currency plus an approximate amount, and a
required phone number with a searchable country calling code. Both are validated again in
`api/lead.js` (phone numbers with `libphonenumber-js`).

The lead record is shaped for the future Commercial Engine (§24) — one primary service
now, with `additionalServices[]` already present for later.

---

## Outstanding — needs the Product Owner

- [ ] **Legal review** of the Privacy Notice and Terms of Use (`src/pages/Privacy.jsx`,
      `src/pages/Terms.jsx`). Both are written in plain language from what the site does;
      neither has been reviewed by a lawyer.
- [ ] **Phone number** — `contact.phone` in `site.js` is `null`; the site is email-only for now.
- [ ] **Project screenshots** — optional; each project currently shows its flow diagram.
- [ ] **Sector drafts** — confirm or discard the four unpublished sector projects.
- [ ] **Verified testimonials / metrics** — see `proof.js`.
- [ ] **Analytics provider** — `lib/analytics.js` is wired and no-ops until a provider is
      installed. Events fire for CTA clicks, work cards, service CTAs, and form
      start/step/abandon/submit.

## SEO files

- `public/robots.txt` points at the sitemap.
- `npm run build` writes `dist/sitemap.xml` from the data files
  (`scripts/generate-sitemap.mjs`), so new services, projects and industry pages are
  included automatically.
- `vercel.json` sends `X-Robots-Tag: noindex` on `dev.genclover.com` so the dev site is
  never indexed.
- Organization structured data (JSON-LD) is in `index.html`.

---

## Deployment

GitHub → feature branch → PR → review → merge → Vercel preview → QA → production (§17).

Security headers, SPA rewrites and asset caching are configured in `vercel.json`. The
rewrite deliberately excludes `/api/` so serverless functions are reachable.
