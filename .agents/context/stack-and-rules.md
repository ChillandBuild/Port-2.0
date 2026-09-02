# Invariants, Tech Stack & File Map

## Tech Stack
- Framework: Next.js 16.3.2 (App Router), React 19.2.8, TypeScript 5
- Motion: GSAP 3.15 + ScrollTrigger for scroll-tied animation; a custom rAF loop
  (`lib/frontend/world-render.ts`, `lib/frontend/world.ts`, `lib/frontend/world-instance.ts`)
  drives the canvas "world" scene independent of the GSAP timelines
- Styling: CSS Modules + design tokens in `styles/tokens.css` (no Tailwind, no CSS-in-JS)
- Testing/QA: no unit test framework configured. Visual/E2E verification runs through
  ad-hoc `lab/*.mjs` scripts using `playwright-core` (screenshot-driven, not an assertion suite)
- Hosting: Vercel (`.vercel/project.json` present, linked project)
- Backend: four routes, all under `app/api/` (Next.js App Router requires this — routes
  cannot live in a separate top-level folder without breaking file-based routing).
  - `app/api/submissions/route.ts` (POST) — backs the `/hire` capture form, the
    `/schedule` form, and the case-studies-gate email. Writes to a Supabase `submissions`
    table (`@supabase/supabase-js`, service-role key); sends a best-effort Resend
    notification. Both steps no-op cleanly when their env vars are unset. No auth.
  - `app/api/chat/route.ts` (POST) — the chat widget's backend. No LLM, no DB: a
    keyword-matched rule engine (`replyFor()`) answering only from `lib/content.ts`
    (`ESTIMATOR` data included). Explicitly a placeholder — its own comment says to
    "swap this fetch handler for Vercel AI SDK + OpenAI later; the widget stays identical."
  - `app/api/webhooks/razorpay/route.ts` (POST, added `685ecd4`) — Razorpay's
    `payment.captured` webhook for the paid lead-gen course. Verifies the HMAC signature
    against the raw body before trusting anything, grants 30 days of access in the
    Supabase `course_access` table (idempotent per `payment_id`), emails the access code.
  - `app/api/course/unlock/route.ts` (POST, added `685ecd4`) — redeems an access code
    from `/lead-generation`'s gate; sets an httpOnly cookie whose value is the code
    itself (every request re-validates it against Supabase, so no signing needed).
- Everything else is static / server-rendered. Env keys, read only by the API routes
  above and their `lib/backend/` support — routes no-op cleanly (submissions still
  returns success to the client) when their own vars are unset, but the course routes
  hard-fail without theirs:
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase dashboard → Project Settings
    → API. The service-role key bypasses RLS; never log it or fetch it into an agent.
    Shared by `submissions` and `course_access`.
  - `RESEND_API_KEY` — Resend dashboard. `RESEND_FROM` — a verified Resend sending
    domain (sandbox mode only delivers to the Resend account owner's own address).
  - `HIRE_NOTIFY_TO` — the inbox that receives hire-form and case-studies-gate
    submissions; set to Sampath's real inbox before deploying.
  - `RAZORPAY_WEBHOOK_SECRET` — Razorpay dashboard → webhook config. Without it,
    `verifyRazorpaySignature` always returns false and every webhook is rejected — no
    course access is ever granted.
  - `RAZORPAY_PAYMENT_PAGE_URL` — the hosted Razorpay Payment Page for the course.
    `COURSE_ENROLL_HREF` falls back to `/schedule` ("enroll on a call") if unset, so a
    missing var degrades gracefully rather than dead-ending on a button.
  - `VERCEL_OIDC_TOKEN` is written by the Vercel CLI — leave it alone.
- Git hooks (`lefthook.yml`, lefthook installed separately, not an npm dependency —
  `lefthook install` once per clone writes `.git/hooks/`): pre-commit runs
  `npx eslint {staged_files}` on staged TS/TSX/JS/JSX files; pre-push runs
  `npx tsc --noEmit && npm run build`. A failing pre-push means the build or type
  check is actually broken — fix the code, not the hook.

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
  `/lead-generation` (free trailer + paid course, same URL — [[decisions-log]]),
  `/course` (redirects to `/lead-generation`), `/schedule`, `/privacy`, `/terms`,
  `/refunds`
- `app/api/submissions/route.ts` — Supabase insert + Resend email; `app/api/chat/route.ts`
  — the chat widget's rule-engine backend, no LLM/DB; `app/api/webhooks/razorpay/` and
  `app/api/course/unlock/` — the paid course's payment + access-code flow
  ([[decisions-log]] `685ecd4`)
- `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` — the site icon set (Next
  metadata file conventions; a flat Bricolage `S.` mark). `app/manifest.ts` is the
  hand-authored web manifest, colours from `tokens.css`. `public/icon-{192,512}.png` +
  `public/icon-maskable-512.png` are the manifest's PWA icons. All are generated from
  the Bricolage outline — see [[subsystem-notes]] to regenerate. [[decisions-log]]
- `lib/` splits by layer, imports verified by grep before the split (2026-09-01):
  - `lib/backend/` — server-only, imported only from `app/api/*`: `supabase/admin.ts`,
    `email.ts` (Resend notification), `course-access.ts` (grant/resolve course access,
    the httpOnly cookie contract), `razorpay.ts` (webhook signature verify, access-code
    generation)
  - `lib/guide/` — the paid course content, hand-transcribed from `content/lead-generation.md`
    into typed chapters (`assessment.ts`, `methodology.ts`, `process.ts`) assembled by
    `index.ts` into `GUIDE_DOCUMENT`. Same drift risk as the `ROLES`/`SITE-CONTENT.md`
    problem above: nothing checks the transcription still matches the source markdown.
    [[active-backlog]]
  - `lib/content/course.ts` — copy for the course gate/enroll sections (NOT the lesson
    content itself, that's `lib/guide/`)
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
- `components/leadgen/LeadGenPage.tsx` — the free `/lead-generation` trailer (8-stage
  pipeline, work-plan, tool stack, CTA); `components/course/` — `CourseGate` (paywall)
  and `CourseUnlockForm` (access-code redemption); `components/guide/` — `GuidePage`/
  `GuideShell`/`blocks.tsx`, the unlocked course's documentation-style layout
- `styles/` — tokens, shared type primitives, global reset
- `lab/` — throwaway Playwright-driven screenshot/debug scripts used for visual QA during
  development (not a maintained test suite — expect drift/dead scripts here)
- `scrollcraft/` — build registry (`FINGERPRINTS.md`) for the scrollcraft skill; this site
  is registered there as "sampath-worldfall" (Worldfall grammar)
- `SITE-CONTENT.md` — raw factual source copy about Sampath Kumar (facts only, no design intent)
- `content/lead-generation.md` — source-of-record transcript for the paid course; see
  `lib/guide/` above
- `supabase/course_access.sql` — hand-run schema for the `course_access` table (see
  Migration Index in `decisions/log.md`)
