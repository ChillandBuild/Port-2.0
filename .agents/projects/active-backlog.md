# Active Roadmap & Technical Debt

## Backlog
- Remaining unbuilt pages: **Story** and a custom **404** (`app/not-found.tsx`).
  Case Studies, Schedule, Terms, Privacy, Refunds and Lead Generation all shipped in
  commit `198f462` (2026-08-28). | unprioritized | not started [[decisions-log]]
- Lead-generation and schedule pages have no submission backend — the contact/schedule
  surfaces are presentational. A shared endpoint now exists (`/api/submissions`, added
  `e3034a1`) and could be reused; decide whether these pages adopt it or stay static.
  | undecided | not started [[decisions-log]]

## Known Tech Debt
- No unit/integration test suite — verification currently relies on manual Playwright
  screenshot scripts under `lab/` plus one-off axe-core runs, not an automated,
  repeatable CI check. Consider promoting a `lab/a11y.mjs`-style script into a real
  regression test if this project grows. The six new routes have not been through the
  320/375/768/1024/1440/1920 overflow + axe sweep that the homepage has.
- `lab/` (gitignored, throwaway Playwright QA scratch) was wiped 2026-09-01 — had grown
  to 414MB/895 screenshots across ~50 dated iteration folders with no cleanup pass. Will
  accumulate again since it's the standing QA pattern — prune periodically, no fixed cadence.
- The `ScrollFX` data-attribute contract is untyped and unverified — a renamed attribute
  fails silently. See [[subsystem-notes]].
- `app/layout.tsx` `metadataBase` is still the placeholder `https://sampathkumar.example`.
  OG image URLs and any absolute-URL metadata resolve against it — set the real domain
  before launch. `app/manifest.ts` `theme_color` (`#f1ebfb`, the chrome tint) is a taste
  call and could move to the accent. Added with the favicon work (2026-08-28).
  [[decisions-log]]
- **Found in passing, not verified, unrelated to a specific task:** ~14 component CSS
  modules reference `var(--color-ox)` / `--color-ox-soft` / `--color-bone` /
  `--color-paper` / `--color-ink` (e.g. `components/ui/Button.module.css`,
  `components/ui/SectionHeader.module.css`, `pipeline/`, `ledger/`, `track/`), but the
  post-rebrand `styles/tokens.css` defines none of them — only `--accent*` / `--surface-*`
  / `--on-*`. The production build is green regardless (CSS does not error on undefined
  custom properties). Either those components are unused on the current homepage, or they
  render with broken colour. Needs a real check — grep the component tree against
  `page.tsx` and decide: define compat aliases, port to the new tokens, or delete dead
  folders.
