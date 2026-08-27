# Active Roadmap & Technical Debt

## Backlog
- Build remaining pages: Story, Case Studies, Schedule, 404, Terms, Privacy, Refunds
  (listed as "not built yet" in README) | unprioritized | not started
- In-progress uncommitted edits (as of scaffold time) touch `app/page.tsx`,
  `components/posts/FeaturedPosts`, `components/range/Range.tsx`,
  `components/world/WorldStage`, `lib/content.ts`, `lib/world-render.ts` | active | in progress

## Known Tech Debt
- No unit/integration test suite — verification currently relies on manual Playwright
  screenshot scripts under `lab/` plus one-off axe-core runs, not an automated,
  repeatable CI check. Consider promoting a `lab/a11y.mjs`-style script into a real
  regression test if this project grows.
- `lab/` has accumulated many one-off debug scripts and screenshots (dbg-*, final*, v2-*,
  reduced*, etc.) with no cleanup pass — see [[subsystem-notes]]. Not urgent, but will
  keep growing unless pruned periodically.
- `true` file at repo root (top-level, no extension) — origin unclear, worth confirming
  whether it's intentional or stray before it causes confusion.
