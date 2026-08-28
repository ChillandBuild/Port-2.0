# Architecture

One-screen orientation. The authoritative version — full file map, hard invariants,
subsystem gotchas — lives in `.agents/` (linked at the bottom).

## Shape

- **Next.js 16 App Router**, React 19, TypeScript 5.
- **Server components by default.** The page ships no client JS except the motion
  pieces that must run in the browser.
- **Every rendered string is typed in `lib/content.ts`.** Copy is never inlined in JSX.
- **Design tokens are the only source of palette / type / spacing** — `styles/tokens.css`.
  Nothing hardcodes a colour.
- **Styling is CSS Modules.** No Tailwind, no CSS-in-JS.

```
app/                  layout (fonts, metadata), the homepage, and the other routes
app/api/submissions/  one shared POST endpoint for every form that reaches Sampath
components/<area>/     one folder per page area, each with a colocated .module.css
lib/content.ts        every string the page renders, typed
lib/world*.ts         the custom rAF canvas "world" scene engine
components/motion/     ScrollFX.tsx — the single client entry point for scroll animation
styles/               tokens, shared type primitives, global reset
```

## Routes

`/` · `/hire` · `/case-studies` · `/lead-generation` · `/schedule` · `/privacy` ·
`/terms` · `/refunds`. Still unbuilt: a Story page and a custom 404.

`/privacy`, `/terms`, `/refunds` are three thin routes over one shell
(`components/legal/LegalPage.tsx`) — editing the shell changes all three.

## Two motion systems, on purpose

1. **GSAP + ScrollTrigger** drives the paper/section half of the page, wired entirely
   from `components/motion/ScrollFX.tsx` off `data-*` attributes so section components
   stay server-side and presentational.
2. **A custom rAF loop** (`lib/world-render.ts`, `lib/world.ts`, `lib/world-instance.ts`)
   drives the canvas "world" scene, independent of GSAP. Scroll position is its single
   source of truth — scrolling back must visually undo state.

Why two: see `.agents/decisions/log.md` (the "sampath-worldfall" entry).

## Form backend

`app/api/submissions/route.ts` is the only backend. The `/hire` form and the
case-studies gate both POST there. The Supabase write is the source of truth and is
awaited; the Resend email is best-effort and never blocks the response. Both no-op
cleanly when env vars are unset. See [getting-started.md](getting-started.md).

> Note: `.agents/context/stack-and-rules.md` still describes the site as having
> "no database, no backend API routes" — that predates this endpoint. Trust the code.

## Non-negotiables (verified, not aspirational)

- Zero horizontal overflow at 320 / 375 / 768 / 1024 / 1440 / 1920
- axe-core WCAG 2.1 A + AA: 0 violations
- Visible keyboard focus, skip link, `prefers-reduced-motion` honoured globally
- The two muted-grey tokens (`--color-zinc` / `--color-zinc-inv`) must not be collapsed
  into one — a single grey cannot clear 4.5:1 against both grounds

## Go deeper

- Full file map, all invariants → `.agents/context/stack-and-rules.md`
- Load-bearing traps (world reversibility, the untyped ScrollFX `data-*` contract,
  the case-studies gate is not security, the shared legal shell)
  → `.agents/context/subsystem-notes.md`
- Why modules were built or dropped → `.agents/decisions/log.md`
- Backlog and tech debt → `.agents/projects/active-backlog.md`
- Design direction and tokens → [README.md](../../README.md)
