# Historical Decisions & Migrations

## Migration Index
<!-- date | migration file | what changed -->
No migrations directory. Two Supabase tables, both hand-run: `submissions` (authored
directly in the Supabase dashboard) and `course_access` (`supabase/course_access.sql`,
added `685ecd4` — a script to paste into the SQL editor once per project, not applied
automatically on deploy). [[stack-and-rules]]

## Decisions
- 2026 (commit `3b29fe9`) | Ship "Cold Open" as the visual direction | The subject
  (Sampath Kumar) runs outbound lead generation for a living, so the site's structural
  device — an envelope/message-field framing for section headers, a drafted cold-open
  message where a portfolio would put a headshot — encodes something true about the
  content instead of just decorating it | Rejected: a conventional headshot-led portfolio
  layout.
- 2026 | Build the "sampath-worldfall" scrollcraft variant with a custom rAF world engine
  instead of the scrollcraft skill's built-in motion engine, alongside GSAP+ScrollTrigger
  for the paper/section half | The canvas world needed scroll-position-as-time semantics
  (reversible scrubbing) that the skill's stock engine didn't fit | See
  `scrollcraft/FINGERPRINTS.md` row for the full grammar/nav/close-pattern breakdown.
  [[subsystem-notes]]
- 2026-08 (commit `ed01473`) | Removed a temporary preview-reply debug route | Was a
  scaffolding/dev-only route, not meant to ship | N/A.
- 2026-08-28 (commit `198f462`) | Shipped six of the seven outstanding routes —
  `/case-studies`, `/lead-generation`, `/schedule`, `/privacy`, `/terms`, `/refunds` |
  Closes most of the "remaining pages" backlog item; Story and a custom 404 are the
  only ones still missing | Privacy/Terms/Refunds share one `components/legal/LegalPage`
  shell rather than three near-identical page components. [[active-backlog]]
- 2026-08-28 (commit `198f462`) | Case studies sit behind a client-side, localStorage-only
  gate (`CaseStudiesGate`), not a real access control | At the time the site had no
  backend, so a server-enforced gate was not an option; the component states the honest
  behaviour in the UI instead of implying a login. The revealed content is passed in as
  `children` so it stays server-rendered | Rejected: adding an API route/database purely
  to gate two case studies. [[subsystem-notes]]
  UPDATE (`e3034a1`): a submissions backend now exists, but the gate design did NOT
  change — it is still localStorage-only and still not access control. The gate now
  additionally POSTs the entered email to `/api/submissions` (source `case-studies-gate`)
  to record the lead; unlocking remains purely client-side.
- 2026-08-28 (commit `e3034a1`) | Added one backend route, `app/api/submissions/route.ts`
  (POST), plus the `/hire` capture page | The `/hire` conversion form needed to actually
  reach Sampath, which a static site cannot do. One shared endpoint serves both the hire
  form and the case-studies gate (`source` field discriminates). Supabase insert is the
  source of truth and is awaited; the Resend email is fire-and-forget and never fails the
  response. Both steps no-op when their env vars are unset, so local dev and unconfigured
  deploys still return success | Rejected: a third-party form service; per-form endpoints.
  Support code in `lib/supabase/admin.ts`, `lib/email.ts`, `lib/submissions.ts`.
  [[stack-and-rules]] [[active-backlog]]
- 2026-08-28 (commit `198f462`) | Introduced `components/motion/ScrollFX.tsx` as the single
  client entry point for all ScrollTrigger behaviour below the landing | Keeps every section
  component a server component: sections declare intent via data attributes, ScrollFX wires
  them. GSAP is imported dynamically so it stays out of the bundle that paints the hero |
  Rejected: per-section `"use client"` wrappers each importing GSAP. [[subsystem-notes]]
- 2026-08-28 (commit `198f462`) | The hero "hello." rotates through markets
  (`components/world/Greeting.tsx`) as progressive enhancement only | Server and first paint
  render the literal "hello." so there is zero hydration mismatch; cycling starts only after
  mount and only when motion is allowed. The `<h1>` keeps one stable accessible name and the
  rotating slot is `aria-hidden` | Preserves the reduced-motion and a11y invariants.
- 2026-08-28 | Favicon is the wordmark cropped to one letter — a flat `S.` (ink `#0b1b2a`
  S, accent `#5b21b6` full stop), no container | The nav wordmark already dropped its
  monogram ([[subsystem-notes]] — `components/brand/Brandmark.tsx`); a favicon has no
  room for the full name, so one letter carrying the signature stop is the smallest
  honest mark. The `S` is traced from the live Bricolage Grotesque outline at wght 800,
  not redrawn. `app/icon.svg` flips ink→bone under `prefers-color-scheme: dark` so it
  survives dark browser chrome | Rejected: a violet knockout tile (more robust on any
  tab colour, but not true to the flat wordmark); the bare accent period alone (reads
  as a status light). Wired via Next file conventions — `app/favicon.ico`,
  `app/icon.svg`, `app/apple-icon.png` — plus a hand-authored `app/manifest.ts`; the
  PWA/maskable PNGs live in `public/`. [[stack-and-rules]] [[subsystem-notes]]
- 2026-08-29 (commits `5b4f5a7`, `98bfb8f`) | Made the estimator's math explainer
  collapsible | Reduces default vertical weight of `components/estimator/Estimator.tsx`
  without dropping the explainer content.
- 2026-08-31 (commit `fd0803e`, reverted `f44dd86`, re-landed `01fad9f`) | Schedule page
  layout changes | A `PipelineCards` addition landed on the schedule page by accident and
  was reverted same-day; the intended schedule-page changes were re-applied separately.
- 2026-09-01 (commit `1d4fd31`) | Schedule form: company domain field swapped for optional
  company name, phone made mandatory (client + server), "Work email" simplified to
  "Email" | Reduces friction reported on the schedule form. Also: results counters and
  the impressions chart (`components/ledger/`, driven via ScrollFX's `[data-count]`
  contract, see [[subsystem-notes]]) now replay every scroll pass at a slower pace
  instead of firing once on page load; About section degree/institution now render on
  separate lines instead of wrapping as one sentence.
- 2026-09-01 (commit `53df3e1`) | Estimator explainer collapse reworked further |
  Follow-up pass on the 08-29 collapsible change (`components/estimator/Estimator.tsx`,
  `.module.css`).
- 2026-09-01 | Removed 7 tracked files that were never part of the app: 3 Claude
  Design canvas exports (`Main.dc.html`, `ThePeriod.dc.html`, `TileConcept.dc.html`),
  `canvas.json`, a 2.4MB `sampath-kumar-favicon.html`, and two AI-tool state dirs
  accidentally committed (`.freebuff/`, `.zcode/plans/`). Also wiped `lab/` (414MB,
  gitignored QA scratch, see [[active-backlog]]) and `.next/` (163MB build cache) from
  disk — both regenerate, neither was tracked | `git grep` confirmed nothing in
  `app/`/build referenced any of the 7 files before removing them. `.gitignore` gained
  `/.freebuff/` and `/.zcode/` so the tool-state files don't return. `.git` itself is
  ~232MB (real history weight, likely from these same large files being committed then
  later removed in past sessions) — left alone, fixing it needs a history rewrite
  (`git gc`/filter-repo) which wasn't asked for. [[active-backlog]]
- 2026-09-01 | Split `lib/` into `lib/frontend/` and `lib/backend/`, content.ts/
  submissions.ts stayed at root as shared | User asked to organize files as
  frontend/backend. A full service split (separate deploy, like a project with its own
  `backend/` + `frontend/` + `android/`) was considered and rejected — this site has one
  API consumer (its own frontend) and two lightweight route handlers, not independent
  clients or heavy compute; splitting would add deploy/CORS overhead with no upside.
  `app/` and `app/api/` stayed put — Next.js App Router requires routes to live there.
  Verified with `git grep` for every import before moving, then `tsc --noEmit` + `next
  build` after. [[stack-and-rules]]
- 2026-09-01 | Routed 4 of 6 docs/wiki/ pages into CLAUDE.md's agent routing table
  (contributing.md, getting-started.md, glossary.md, faq.md); extended
  scripts/second_brain_close.py's dead-link and stale-claim checks to cover
  docs/wiki/ too | User initially asked to make the wiki agent-queried like
  `.agents/`; was talked down to "only lift the specific missing fact" — then, when
  told the wiki was human-only and they'd never read it themselves, explicitly chose
  routing it over deleting it. `architecture.md` and the wiki's own `README.md`
  stayed unrouted — both explicitly defer to `.agents/` for architecture truth, so
  routing them would be pure duplication with no new fact. [[stack-and-rules]]
- 2026-09-01 | **Reversed the entry above, same session.** Deleted `docs/wiki/`
  entirely (all 6 files), removed its 4 routing entries from `CLAUDE.md`, migrated the
  2 facts that weren't already duplicated elsewhere (the lefthook hook table, the env
  var Purpose/Where-to-get-it detail) directly into `stack-and-rules.md` | The routing
  decision assumed the wiki's hand-written prose (faq, glossary, contributing
  checklist) would keep getting maintained by someone. User then said plainly they'll
  never write in it — and had already said they'd never read it. With zero human
  readership or authorship, a hand-written layer has no maintainer at all; relying on
  me to opportunistically keep it current (as I did earlier this session) isn't the
  same as it actually being maintained. Reverted `second_brain_close.py`'s dead-link
  and stale-claim checks back to `.agents/`-only, matching the deletion. [[stack-and-rules]]
- 2026-09-02 (commit `e887a45`) | Replaced `TOOL_GROUPS` wholesale — 4 curated groups /
  25 tools became the source doc's 8 groups / 154 chips (149 unique URLs, 5 tools
  cross-listed on purpose) — and `POSTS` went from 4 hand-written entries to 42 real
  LinkedIn permalinks | Source was `Tools to be added.docx` in the repo root, which
  supplied names and URLs only: no tool websites, no post titles/summaries/images. So
  the work was resolution and authoring, not data entry. Every one of the 149 tool URLs
  was resolved then verified by live HTTP; titles and ~140-char summaries were written
  per post from the fetched post bodies | Rejected: extending the existing 4 groups
  rather than replacing them (user asked for replacement explicitly).
  [[subsystem-notes]] [[active-backlog]]
- 2026-09-02 (commit `e887a45`) | Post images are **hotlinked** from `media.licdn.com`,
  not downloaded into `public/`, and render through a plain `<img>` rather than
  `next/image` | User's call on hotlinking. It is technically sound: the signed URLs
  carry `e=2147483647` (year 2038, effectively non-expiring) and serve `200` with
  `Cache-Control: public, max-age=86400` from any referer, verified from a foreign
  domain, `localhost:3000` and a `.vercel.app` host. `next/image` was rejected because
  the project has no `images.remotePatterns` config and ships no other raster images —
  it would mean new config plus a Vercel optimisation hop for URLs the CDN already
  caches for a day | Cost accepted: ~4.0MB of image if every card is seen, spread by
  `loading="lazy"`. Self-hosting into `public/` remains the fix if it reads slow.
  [[subsystem-notes]] [[active-backlog]]
- 2026-09-02 (commit `e887a45`) | The 11 carousel/document posts get a **designed
  typographic cover** (accent gradient + title + "Carousel" tag), not a screenshot |
  Their real covers are unobtainable: LinkedIn serves `feedshare-document-cover-images`
  only to a signed-in session (`403 deny-InvalidToken` even with a token freshly issued
  seconds earlier, cookies carried, browser UA and `Referer: linkedin.com`). A headless
  Chromium **does** render them logged-out, so a Playwright capture script was offered
  and priced out — user chose the designed cover instead | Rejected: auto-capture with
  the repo's existing `playwright-core`; asking the user to screenshot 12 slides;
  dropping the carousel posts. [[subsystem-notes]]
- 2026-09-02 (commit `e887a45`) | Kept the featured-posts marquee rather than moving to
  a filterable grid, and widened the stack section from 4 columns to 2 at ≥1200px |
  User picked the marquee for all 42. Two columns because 8 groups in a 4-col grid put
  a 41-chip group beside a 13-chip one; half-width cards let a long chip list wrap into
  a few rows instead of a column fourteen rows deep. Each group now states its own tool
  count so the unevenness reads as deliberate | Doc order (the GTM funnel: prospecting →
  enrichment → outbound → deliverability → CRM → execution → automation → intelligence)
  was preserved rather than re-sorted by size, which would have packed the grid tighter
  but destroyed the sequence's meaning. [[subsystem-notes]]
- 2026-09-02 (commit `e887a45`) | The Instantly client engagement lands in
  `CASE_STUDIES.featured` as its own card above `ROLES`, inside the existing gate — not
  as a seventh role and not in the posts marquee | The source doc files it separately
  ("links to be added in cASE STUDIES section"), and it is a delivered client outcome
  rather than a job | Also corrected a pre-existing copy bug found in passing: the
  unlocked heading claimed "Six engagements" while `ROLES` holds seven.
- 2026-09-02 (commit `e7173f6`) | The interactive estimator **moves off the homepage** onto
  `/schedule`, mounted between `ScheduleEngagement` (the ladder) and `ScheduleTracks` |
  The ladder is where the price is named, so the model of what that price returns belongs
  directly under it rather than mid-homepage. `Estimator` already carried optional
  `eyebrow`/`heading`/`body` props written for exactly this remount, so no component
  change was needed — only new copy ("Model the pipeline before you book.") | Two knock-on
  fixes this forced: the estimator's own links dead-ended on the new route, so
  `ESTIMATOR.toolsLink.href` became root-relative `/#range` and `freeCallNote.cta` became
  `#book` (the `ScheduleForm` id) relabelled "Book the call"; and the homepage hero's
  "Work with me" ghost CTA, which pointed at the now-absent `#estimator`, was repointed to
  `#range`. Rejected for that CTA: `#contact` (skips every piece of evidence) and `#stack`
  (opens on tooling before breadth is established). [[subsystem-notes]]
- 2026-09-02 (commit `e7173f6`) | The impressions chart's line now **redraws on an infinite
  loop** instead of drawing once per scroll pass | User asked for the graph to "move
  continuously, like a train" and chose looping draw-in over a scrolling ticker or a
  travelling pulse when the three were put side by side | Implemented as two tweens rather
  than one repeating timeline, with the loop's own ScrollTrigger pausing it off-screen and
  reduced-motion skipping it entirely — the reasons are load-bearing and written up in
  [[subsystem-notes]].
- 2026-09-02 (commit `e7173f6`) | Closing CTA (`components/reply/Reply.tsx`) gains a second
  button, "Schedule a call" → `/schedule`, as an outlined ghost beside the filled LinkedIn
  primary | The close previously offered one exit and it was not the booking page. Ghost
  rather than a second filled button so the pair keeps a hierarchy | Its hover/active
  states deliberately avoid `transform`: `data-magnet` writes `transform` every rAF frame
  and would win, silently killing the press feedback — same reason `.primary:active` uses
  `filter: brightness()`.
- 2026-09-02 (commit `e7173f6`) | Hero/world copy says "leads", not "names"
  (`WorldStage.tsx`), and two role titles corrected in `ROLES` — Zinnov & Draup →
  Lead Generation Executive, Emotii → Senior Lead Generation Specialist | User-supplied
  corrections from live-site screenshots | Alore's identical "Lead Generation Specialist"
  was explicitly left alone after asking. The same facts live in three unsynced places, so
  `SITE-CONTENT.md` and `app/api/chat/route.ts` were corrected in the same pass — see
  [[subsystem-notes]]. Two pre-existing bugs fixed in passing: the chat route's work-history
  answer said "6 roles" with no Emotii and wrong Zinnov dates, and its estimator CTA pointed
  at `/#work-plan`, an id that exists nowhere (now `/schedule#estimator`).
- 2026-09-01 (commit `685ecd4`) | `/lead-generation` became a paid course | Razorpay
  webhook grants 30 days of Supabase-backed access on `payment.captured`;
  `CourseGate`/`CourseUnlockForm` gate the content behind an access-code form,
  `GuidePage`/`GuideShell` render a 3-chapter, ~30-lesson document compiled into
  `lib/guide/*` from `content/lead-generation.md`. The access cookie's value **is** the
  access code itself — no separate signature — because every request re-validates it
  against Supabase and its expiry, so no server-side session store is needed. This
  replaced the old free `LeadGenPage` outright: the component and its CSS were deleted,
  not hidden or flagged | This commit bundled the course/Razorpay work with unrelated
  changes (README, chat route, estimator copy) in one large push, and the second brain
  was never updated for any of it at the time — caught and backfilled 2026-09-02, one
  session later. [[stack-and-rules]] [[active-backlog]]
- 2026-09-02 (commit `7d093d6`) | Restored the free `LeadGenPage` on `/lead-generation`
  as a trailer ABOVE the paid course gate, same URL — not a revert of `685ecd4` and not
  a separate route for the course | User wanted both: the free process overview first,
  the paywall/guide directly below it. `app/course/page.tsx` already redirected to
  `/lead-generation`, so one URL serving both fits that existing intent | Restored
  `components/leadgen/LeadGenPage.tsx` and `.module.css` verbatim from `685ecd4^` (they
  already imported `LEADGEN`/`PIPELINE`/`WORK_PLAN`/`TOOL_GROUPS` from `lib/content.ts`,
  which `685ecd4` never touched). Only `app/lead-generation/page.tsx` changed — mounted
  `<LeadGenPage />` above the existing access-gated block, switched page `description`
  metadata to `LEADGEN.lede`. The case-studies email/phone gate was checked in the same
  session and found already intact — the "missing" gate was
  `localStorage['sk-cs-unlock']` persisting from an earlier visit in the user's own
  browser (confirmed by testing in an incognito window), not a code regression; nothing
  there was changed. [[subsystem-notes]]
