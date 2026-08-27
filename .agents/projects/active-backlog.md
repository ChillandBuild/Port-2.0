# Active Roadmap & Technical Debt

## Backlog
- Remaining unbuilt pages: **Story** and a custom **404** (`app/not-found.tsx`).
  Case Studies, Schedule, Terms, Privacy, Refunds and Lead Generation all shipped in
  commit `198f462` (2026-08-28). | unprioritized | not started [[decisions-log]]
- `README.md` lines 61–62 still claim Story, Case Studies, Schedule, 404, Terms, Privacy
  and Refunds are "not built yet" — stale as of `198f462`; only Story and 404 remain.
  | small | not started
- Lead-generation and schedule pages have no submission backend — the contact/schedule
  surfaces are presentational. Decide whether they stay that way or get a real endpoint.
  | undecided | not started

## Known Tech Debt
- No unit/integration test suite — verification currently relies on manual Playwright
  screenshot scripts under `lab/` plus one-off axe-core runs, not an automated,
  repeatable CI check. Consider promoting a `lab/a11y.mjs`-style script into a real
  regression test if this project grows. The six new routes have not been through the
  320/375/768/1024/1440/1920 overflow + axe sweep that the homepage has.
- `lab/` has accumulated many one-off debug scripts and screenshots (dbg-*, final*, v2-*,
  reduced*, etc.) with no cleanup pass — see [[subsystem-notes]]. Not urgent, but will
  keep growing unless pruned periodically.
- `true/` at repo root is an empty **directory** (not a file, as an earlier note said) —
  almost certainly a stray from a shell redirect. Safe to delete; confirm first.
- The `ScrollFX` data-attribute contract is untyped and unverified — a renamed attribute
  fails silently. See [[subsystem-notes]].
