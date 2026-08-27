# Historical Decisions & Migrations

## Migration Index
<!-- date | migration file | what changed -->
No schema/data migrations — this project has no database.

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
