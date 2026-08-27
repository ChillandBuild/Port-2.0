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
- No database, no backend API routes, no auth — fully static/server-rendered marketing site

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

## File Map
- `app/` — layout (fonts, metadata) and the homepage route
- `components/<area>/` — one folder per page area (hero, world, range, posts, ledger,
  linkedin, history, education, estimator, contact, chrome, brand, about, etc.), each with
  a colocated `.module.css`
- `lib/content.ts` — every string the page renders, typed
- `lib/world*.ts` + `components/world/WorldStage.tsx` — the custom canvas/rAF "world" scene
  engine, separate from GSAP-driven sections
- `styles/` — tokens, shared type primitives, global reset
- `lab/` — throwaway Playwright-driven screenshot/debug scripts used for visual QA during
  development (not a maintained test suite — expect drift/dead scripts here)
- `scrollcraft/` — build registry (`FINGERPRINTS.md`) for the scrollcraft skill; this site
  is registered there as "sampath-worldfall" (Worldfall grammar)
- `SITE-CONTENT.md` — raw factual source copy about Sampath Kumar (facts only, no design intent)
