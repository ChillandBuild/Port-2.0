# Historical Decisions & Migrations

## Migration Index
<!-- date | migration file | what changed -->
No migration files in-repo. The one database table (`submissions`, Supabase) is managed
in the Supabase dashboard, not via a migrations directory here.

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
