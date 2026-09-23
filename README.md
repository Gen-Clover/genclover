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

1. Append an entry to `services` in **`src/data/services.js`**. Copy the shape of an
   existing one — `slug`, `title`, `shortDescription`, `heroHeadline`, `heroDescription`,
   `capabilities[]`, `deliverables[]`, `relatedIndustries[]`, `seo`.
2. Add the slug to `SERVICE_SLUGS` in **`src/data/taxonomy.js`**.
3. Add the slug to the `ALLOWED.service` array in **`api/lead.js`** so the enquiry form
   will accept it.

That's it. The service now appears in the header dropdown, the services hub, the footer,
the Start a Project form and its own page at `/services/<slug>` — all derived.

If you **rename** a service, keep the old slug alive by adding it to that service's
`legacySlugs` array. `/services/<old-slug>` then redirects to the new URL (§25).

### Add a project (real client work)

Append to `projects` in **`src/data/projects.js`**. For client work you must set:

```js
status: 'client',            // → renders the "Client Project" badge
clientName: 'Acme Ltd',      // only with written permission
outcomes: ['Reduced…'],      // verified figures only — see below
permissionsApproved: true,   // confirms the client approved publication
published: true,             // the last switch you flip
```

`category` must be a `workCategories` id, `industry` an `industries` id, and
`primaryService` a service slug — all from `taxonomy.js`.

Leave `published: false` while drafting; only `published: true` items are ever rendered.

### Add a concept project

Identical, except:

```js
status: 'concept',           // → renders the "Gen Clover Concept" badge
clientName: null,
permissionsApproved: false,
outcomes: ['Conceptual outcome - designed to …'],
```

The status badge and the disclosure banner on the case-study page are driven by `status`,
so a concept can never accidentally present as delivered client work (§7.2).

Use the `conceptual()` helper at the top of the file to keep outcome wording consistent.

### Add an industry

Add the id and label to `industries` in **`taxonomy.js`**, then add matching page copy to
`industryContent` in **`src/data/industries.js`**. An industry with no page copy stays
available as a tag but gets no landing page.

### Add project imagery

Drop the file in `public/work/` and set `heroImage: '/work/your-file.jpg'` on the project.
Until then `ProjectVisual` renders a deterministic brand graphic — deliberately obviously a
graphic, never a fake screenshot (§4).

---

## Truthfulness rules (§1.2, §2.1)

These are not style preferences. They were the reason for this rebuild.

- **No invented client names.** Concepts are labelled as concepts, everywhere.
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
src/
  data/                  ← all content lives here
    taxonomy.js          Services / Work categories / Industries / statuses  (source of truth)
    services.js          The eight service domains
    projects.js          Work items + selectors
    industries.js        Industry page copy + enquiry form options
    process.js           How We Work stages, care plans, differentiators
    proof.js             Testimonials + verified stats (both intentionally empty)
    insights.js          Articles (intentionally empty)
    site.js              Contact details, routes, navigation model
    jobs.js              Careers listings
  lib/
    seo.js               usePageMeta hook + per-page titles (§15)
    analytics.js         trackEvent seam + attribution capture (§16)
    motion.js            Shared variants, all reduced-motion aware (§4.1)
    theme.jsx            Dark/light state — defaults to dark, ignores the OS setting
    leadSchema.js        The 8-step brief: steps + validation (§9)
  components/
    brand/               CloverMark + three-bar-E Wordmark
    ui/                  Button, Badge/StatusBadge, Section, ProjectVisual, ThemeToggle
    layout/              Header, Footer
    home/                The nine homepage sections, in spec order (§5.2)
    process/             ProcessRail + ProcessTimeline — the animated Discover→Grow flow
    work/                WorkCard, WorkFilters
    form/                ProjectBriefForm + field primitives
  pages/                 One file per route
```

---

## Enquiry form configuration

`/api/lead` needs **one** delivery method configured in Vercel → Settings → Environment
Variables. Until one is set it returns `503` and the form tells the visitor to email
instead — it never silently drops a lead.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Send the notification email via Resend |
| `LEAD_NOTIFY_TO` | Destination address (default `contact@genclover.com`) |
| `LEAD_NOTIFY_FROM` | Verified sender (default `website@genclover.com`) |
| `LEAD_WEBHOOK_URL` | *Alternative:* POST the lead record to a CRM/webhook |
| `LEAD_WEBHOOK_TOKEN` | Optional bearer token for that webhook |

Never commit these. `.env.example` documents them; `.env*` is gitignored.

The lead record is shaped for the future Commercial Engine (§24) — one primary service
now, with `additionalServices[]` already present for later.

---

## Outstanding — needs the Product Owner

- [ ] **Privacy notice** — `src/pages/Privacy.jsx` is a working draft describing what the
      site actually does. Legal wording, registered entity name and retention period must
      be approved **before production lead collection** (§19). The page shows a review
      banner until then.
- [ ] **Phone number** — `contact.phone` in `site.js` is `null` (spec records it as N/A).
      The footer omits the row until it is set.
- [ ] **Social accounts** — `socialLinks` in `site.js` is empty. Real accounts only (§19).
- [ ] **Project screenshots** and approved concept visuals (§19).
- [ ] **Concept project names** — the current nine are carried over from the previous site,
      relabelled as concepts. The spec's proposed set (Aurelia Capital, Northstar
      Properties, …) needs approval before use (§7.5).
- [ ] **Insights content** — page renders an honest empty state until `insights.js` has
      entries.
- [ ] **Verified testimonials / metrics** — see `proof.js`.
- [ ] **Analytics provider** — `lib/analytics.js` is wired and no-ops until a provider is
      installed. Events fire for CTA clicks, work cards, service CTAs, and form
      start/step/abandon/submit.

---

## Deployment

GitHub → feature branch → PR → review → merge → Vercel preview → QA → production (§17).

Security headers, SPA rewrites and asset caching are configured in `vercel.json`. The
rewrite deliberately excludes `/api/` so serverless functions are reachable.
