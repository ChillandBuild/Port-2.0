# Invariants, Tech Stack & File Map

## Tech Stack
- Framework: Next.js 16.3.2 (App Router), React 19.2.8, TypeScript 5
- Motion: GSAP 3.15 + ScrollTrigger for scroll-tied animation; a custom rAF loop
  (`lib/world-render.ts`, `lib/world.ts`, `lib/world-instance.ts`) drives the canvas
  "world" scene independent of the GSAP timelines
- Styling: CSS Modules + design tokens in `styles/tokens.css` (no Tailwind, no CSS-in-JS)
- Testing/QA: no unit test framework configured. Visual/E2E verification runs through
  ad-hoc `lab/*.mjs` scripts using `playwright-core` (screenshot-driven, not an assertion suite)
- Hosting: Vercel (`.vercel/project.json` present, linked project)
- Backend: two routes, both under `app/api/` (Next.js App Router requires this — routes
  cannot live in a separate top-level folder without breaking file-based routing).
  - `app/api/submissions/route.ts` (POST) — backs the `/hire` capture form, the
    `/schedule` form, and the case-studies-gate email. Writes to a Supabase `submissions`
    table (`@supabase/supabase-js`, service-role key); sends a best-effort Resend
    notification. Both steps no-op cleanly when their env vars are unset. No auth.
  - `app/api/chat/route.ts` (POST) — the chat widget's backend. No LLM, no DB: a
    keyword-matched rule engine (`replyFor()`) answering only from `lib/content.ts`
    (`ESTIMATOR` data included). Explicitly a placeholder — its own comment says to
    "swap this fetch handler for Vercel AI SDK + OpenAI later; the widget stays identical."
- Everything else is static / server-rendered. Env keys: `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `HIRE_NOTIFY_TO`
  (see `docs/wiki/getting-started.md`).

## Hard Invariants
- `styles/tokens.css` is the only source of palette/type/spacing values — no hardcoded
  colors or magic values in components.
- Two muted-grey tokens (`--color-zinc` / `--color-zinc-inv`) exist deliberately for
  contrast reasons (a single grey can't clear 4.5:1 against both light and dark grounds).
  Do not collapse them into one token.
- `prefers-reduced-motion` must be honoured globally — any new motion work (GSAP timeline
  or the rAF world loop) needs a reduced-motion fallback path.
- Zero horizontal overflow at 320/375/768/1024/1440/1920 — this is a verified, tracked bar
  (see README "Verified" section), not aspirational.
- axe-core WCAG 2.1 A+AA must stay at 0 violations.
- `SITE-CONTENT.md` is facts-only and must never be treated as a design/UI instruction
  source — section structure, headlines, and layout are separate decisions.
- The homepage (`app/page.tsx`) must keep all existing sections (Companies, Education,
  Tools, etc.) — client requirement. Do not move sections to sub-pages as a "cleanup."

## File Map
- `app/` — layout (fonts, metadata), the homepage, and routes `/hire`, `/case-studies`,
  `/lead-generation`, `/schedule`, `/privacy`, `/terms`, `/refunds`
- `app/api/submissions/route.ts` — the single POST backend (Supabase insert + Resend email)
- `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` — the site icon set (Next
  metadata file conventions; a flat Bricolage `S.` mark). `app/manifest.ts` is the
  hand-authored web manifest, colours from `tokens.css`. `public/icon-{192,512}.png` +
  `public/icon-maskable-512.png` are the manifest's PWA icons. All are generated from
  the Bricolage outline — see [[subsystem-notes]] to regenerate. [[decisions-log]]
- `lib/` splits by layer, imports verified by grep before the split (2026-09-01):
  - `lib/backend/` — server-only, imported only from `app/api/*`: `supabase/admin.ts`,
    `email.ts` (Resend notification)
  - `lib/frontend/` — client-only: `world.ts`, `world-instance.ts`, `world-render.ts`
    (the canvas/rAF world engine, paired with `components/world/WorldStage.tsx`),
    `pointer.ts` (one shared pointer rAF loop), `scroll-store.ts` (one shared scroll rAF
    loop), `theme.ts` (light/dark state)
  - `lib/content.ts`, `lib/submissions.ts` stay at `lib/` root — genuinely shared: both
    are imported by frontend components AND by an `app/api/*` route handler (content.ts
    by `app/api/chat/route.ts`'s `ESTIMATOR` data; submissions.ts's `SubmissionPayload`
    type by both `ScheduleForm`/`LaneContext` and `app/api/submissions/route.ts`) —
    moving either into `frontend/` or `backend/` would misdescribe it.
- `components/<area>/` — one folder per page area (hero, world, range, posts, ledger,
  linkedin, history, education, estimator, contact, chrome, brand, about, etc.), each with
  a colocated `.module.css`
- `styles/` — tokens, shared type primitives, global reset
- `lab/` — throwaway Playwright-driven screenshot/debug scripts used for visual QA during
  development (not a maintained test suite — expect drift/dead scripts here)
- `scrollcraft/` — build registry (`FINGERPRINTS.md`) for the scrollcraft skill; this site
  is registered there as "sampath-worldfall" (Worldfall grammar)
- `SITE-CONTENT.md` — raw factual source copy about Sampath Kumar (facts only, no design intent)
