# Subsystem Notes & Load-Bearing Gotchas

<!-- One section per subsystem. Capture the WHY and the traps that are not obvious
     from reading the code — this is what the wiki/codebase cannot tell you.
     Use [[backlinks]] to cross-reference decisions/log.md or active-backlog.md entries. -->

## World engine (`lib/world*.ts`, `components/world/WorldStage.tsx`)
Custom rAF-driven canvas scene, deliberately NOT built on the scrollcraft skill's own
motion engine (see [[decisions-log]] — "sampath-worldfall" build notes in
`scrollcraft/FINGERPRINTS.md`). Scroll position is the single source of truth: the world
is described as "a pure function of scroll position," meaning scrolling back should
visually undo state (sends un-send, replies un-arrive). Any change to how scroll offset
is read/consumed here can silently break that reversibility — verify by scrolling both
directions, not just forward, after edits.

## Copy vs. design separation
`SITE-CONTENT.md` explicitly declares itself facts-only ("carries no design intent").
Section names, headlines, and structure are a separate layer (`lib/content.ts` + the
component tree). Do not let a content update to `SITE-CONTENT.md` get treated as a
license to also change layout/structure — those are independent decisions.

## Visual QA via `lab/`
The large number of one-off scripts and screenshot PNGs in `lab/` (dbg-*, final*, v2-*,
etc.) are historical debugging artifacts from tuning the hero/world visuals, not a
regression suite. Don't assume passing/matching an old `lab/` screenshot means current
correctness — the tokens/layout may have moved on since a given script was written.
