# Active Roadmap & Technical Debt

## Backlog
- Remaining unbuilt pages: **Story** and a custom **404** (`app/not-found.tsx`).
  Case Studies, Schedule, Terms, Privacy, Refunds and Lead Generation all shipped in
  commit `198f462` (2026-08-28). | unprioritized | not started [[decisions-log]]
- Schedule page has no submission backend — the contact surface is presentational. A
  shared endpoint now exists (`/api/submissions`, added `e3034a1`) and could be reused;
  decide whether it adopts it or stays static. | undecided | not started [[decisions-log]]
  UPDATE (`685ecd4`): lead-generation is no longer static — it has its own backend now
  (Razorpay webhook + course-access API, see [[stack-and-rules]]), just not
  `/api/submissions`.
- Three loose ends from the 2026-09-02 tool-stack import, raised with the user and left
  as-is rather than guessed at | unprioritized | not started:
  - `Tools to be added.docx` section 3 (Outbound & Sales Engagement) is **truncated** —
    it ends mid-list at `"Twain, "` with a trailing comma. The 25 names present were
    shipped; entries may be missing.
  - **Induced** (`induced.ai`) returns `402 Payment required / DEPLOYMENT_DISABLED` — a
    disabled Vercel deployment, confirmed in both curl and a real browser. The company is
    real, so the canonical domain is linked; the chip works again when they redeploy.
  - **MadKudu redirects to HG Insights** (`madkudu.com` 301s to `hginsights.com` —
    acquisition). Both are chips in group 1, so two links land on the same page. One
    should probably be dropped. [[decisions-log]]

## Known Tech Debt
- Featured-posts section pulls ~4.0MB of hotlinked JPEGs from `media.licdn.com` if a
  reader sees all 42 cards (31 carry images, avg ~143KB, unoptimised). `loading="lazy"`
  plus the rail's `overflow: hidden` spreads the cost as cards drift in, and LinkedIn's
  CDN caches them 24h — an accepted trade-off, not an oversight ([[decisions-log]]). If
  it reads slow in the field, the fix is downloading into `public/` and switching to
  `next/image`. No Core Web Vitals measurement has been taken against the new section.
- The 42 `POSTS` entries hardcode LinkedIn CDN URLs. Nothing detects rot: if LinkedIn ever
  rotates or expires them (the tokens say year 2038, but that is their promise, not a
  guarantee), the cards render broken with no build error and no warning. There is no
  link-check in CI — the 149 tool URLs and 31 image URLs were verified once, by hand,
  on 2026-09-02. [[subsystem-notes]]
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
- `.git` is 235MB, and **the earlier diagnosis in this file was wrong** (it blamed real
  history weight and claimed a SHA-rewriting `git filter-repo` was needed). Measured
  2026-09-02: 219.1MB of it — 93%, 534 blobs — is held alive by exactly ONE ref,
  `refs/codex/turn-diffs/checkpoints/ce88cd87…/511267e4-…`, a Codex agent checkpoint
  snapshot dated 2026-08-26 11:35. Its contents are the `lab/` screenshot folders
  (`lab/run`, `lab/dbg`, `lab/postfx`, `lab/final2`–`final5`, `lab/shots6`–`shots8`).
  Codex snapshotted the working tree *including gitignored paths* into its own ref
  namespace. Evidence: `git rev-list --objects --branches` finds 0 `lab/` paths while
  `--all` finds 568; `lab/` is correctly ignored (`/lab/`, `.gitignore:44`) with 0 files
  tracked at HEAD. A bare clone of branches only, packed, is **8.8MB / 868 objects** —
  that is the real repo. So no history rewrite is needed and no commit SHA changes:
  `git update-ref -d <that ref>` then `git gc --prune=now` should give 235MB → ~9MB.
  Note also that every object is currently loose (`packs: 0`) — `git gc` has never run
  here. Unreachable garbage is only 1.5MB, so gc *without* deleting the ref buys nothing.
  Attempted 2026-09-02; `git update-ref -d` was blocked by the permission classifier, so
  it is still pending a manual run by the user. Only real cost is losing those August
  checkpoint snapshots of a `lab/` dir already wiped from disk 2026-09-01.
  [[decisions-log]]
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
- **`app/api/chat/route.ts` still has two dead anchors, found 2026-09-02 while fixing a
  third.** Line 45 offers "Work plan → /#work-plan" and line 57 "See proof rail →
  /#track-record". Both ids do exist — in `components/plan/WorkPlan.tsx` and
  `components/track/TrackRecord.tsx` — but **neither component is mounted on any page**,
  so both CTAs scroll nowhere. Two decisions tangled together: where those CTAs should
  point instead, and whether the two unmounted components are dead code to delete or
  sections that were meant to ship. Left alone because it is a bigger call than the
  in-scope fix (`/#work-plan` → `/schedule#estimator` on line 103, done). [[decisions-log]]
- **The chat route hardcodes facts that `lib/content.ts` already holds.** It imports
  `ESTIMATOR`/`estimateOutcome` and computes from them, but the work-history answer is a
  hand-written string listing every employer, title and date — which is why it had drifted
  to "6 roles" with wrong dates and no Emotii. Same for the tools/stack answer against
  `TOOL_GROUPS`. Deriving both from the content module would make this class of drift
  impossible; not done this session because it changes the answer prose, not just the
  data. [[subsystem-notes]]
- `COURSE.enroll.priceLabel` in `lib/content/course.ts` is a hardcoded placeholder,
  `"₹4,999"`, flagged in its own `// TODO(client)` comment — set the real price before
  launch. [[decisions-log]]
- `content/lead-generation.md` (1061 lines) was hand-transcribed into `lib/guide/*`
  (assessment/methodology/process, ~1650 lines combined) for commit `685ecd4`. Nothing
  checks the transcription still matches the source markdown — same class of drift risk
  as the `ROLES`/`SITE-CONTENT.md`/chat-route problem above, just not yet caught drifting.
  [[subsystem-notes]]
- The paid course (`685ecd4`) has not been through the 320–1920 overflow + axe sweep the
  homepage has, and has no E2E coverage of the pay → webhook → email → unlock flow — it
  has only been verified by reading the code and a local build (some Playwright spot
  checks landed 2026-09-02 for specific fixes: frame width, the `/course` loading
  state — not a full sweep). Needs a real Razorpay-test-mode run before launch.
- A dummy `course_access` row is sitting in production Supabase from testing the unlock
  flow 2026-09-02 (`access_code: 'LG-TEST-DEV1'`, `email: dev-test@example.com`).
  Delete when done testing: `delete from public.course_access where access_code =
  'LG-TEST-DEV1';`. [[decisions-log]]
- Vercel production had **zero** environment variables set until 2026-09-02 (discovered
  while debugging why course unlock failed in production). `SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY` are now set; still missing: `RESEND_API_KEY`,
  `RESEND_FROM`, `HIRE_NOTIFY_TO`, `RAZORPAY_WEBHOOK_SECRET`,
  `RAZORPAY_PAYMENT_PAGE_URL`. Worth auditing whether Preview/Development environments
  need any of these too — only Production was set. [[decisions-log]] [[stack-and-rules]]
