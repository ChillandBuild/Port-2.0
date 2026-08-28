# Historical Decisions & Migrations

## Migration Index
<!-- date | migration file | what changed -->
No migration files in-repo. The one database table (`submissions`, Supabase) is managed
in the Supabase dashboard, not via a migrations directory here.

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
- 2026-08-28 (commit `198f462`) | Shipped six of the seven outstanding routes —
  `/case-studies`, `/lead-generation`, `/schedule`, `/privacy`, `/terms`, `/refunds` |
  Closes most of the "remaining pages" backlog item; Story and a custom 404 are the
  only ones still missing | Privacy/Terms/Refunds share one `components/legal/LegalPage`
  shell rather than three near-identical page components. [[active-backlog]]
- 2026-08-28 (commit `198f462`) | Case studies sit behind a client-side, localStorage-only
  gate (`CaseStudiesGate`), not a real access control | At the time the site had no
  backend, so a server-enforced gate was not an option; the component states the honest
  behaviour in the UI instead of implying a login. The revealed content is passed in as
  `children` so it stays server-rendered | Rejected: adding an API route/database purely
  to gate two case studies. [[subsystem-notes]]
  UPDATE (`e3034a1`): a submissions backend now exists, but the gate design did NOT
  change — it is still localStorage-only and still not access control. The gate now
  additionally POSTs the entered email to `/api/submissions` (source `case-studies-gate`)
  to record the lead; unlocking remains purely client-side.
- 2026-08-28 (commit `e3034a1`) | Added one backend route, `app/api/submissions/route.ts`
  (POST), plus the `/hire` capture page | The `/hire` conversion form needed to actually
  reach Sampath, which a static site cannot do. One shared endpoint serves both the hire
  form and the case-studies gate (`source` field discriminates). Supabase insert is the
  source of truth and is awaited; the Resend email is fire-and-forget and never fails the
  response. Both steps no-op when their env vars are unset, so local dev and unconfigured
  deploys still return success | Rejected: a third-party form service; per-form endpoints.
  Support code in `lib/supabase/admin.ts`, `lib/email.ts`, `lib/submissions.ts`.
  [[stack-and-rules]] [[active-backlog]]
- 2026-08-28 (commit `198f462`) | Introduced `components/motion/ScrollFX.tsx` as the single
  client entry point for all ScrollTrigger behaviour below the landing | Keeps every section
  component a server component: sections declare intent via data attributes, ScrollFX wires
  them. GSAP is imported dynamically so it stays out of the bundle that paints the hero |
  Rejected: per-section `"use client"` wrappers each importing GSAP. [[subsystem-notes]]
- 2026-08-28 (commit `198f462`) | The hero "hello." rotates through markets
  (`components/world/Greeting.tsx`) as progressive enhancement only | Server and first paint
  render the literal "hello." so there is zero hydration mismatch; cycling starts only after
  mount and only when motion is allowed. The `<h1>` keeps one stable accessible name and the
  rotating slot is `aria-hidden` | Preserves the reduced-motion and a11y invariants.
- 2026-08-28 | Favicon is the wordmark cropped to one letter — a flat `S.` (ink `#0b1b2a`
  S, accent `#5b21b6` full stop), no container | The nav wordmark already dropped its
  monogram ([[subsystem-notes]] — `components/brand/Brandmark.tsx`); a favicon has no
  room for the full name, so one letter carrying the signature stop is the smallest
  honest mark. The `S` is traced from the live Bricolage Grotesque outline at wght 800,
  not redrawn. `app/icon.svg` flips ink→bone under `prefers-color-scheme: dark` so it
  survives dark browser chrome | Rejected: a violet knockout tile (more robust on any
  tab colour, but not true to the flat wordmark); the bare accent period alone (reads
  as a status light). Wired via Next file conventions — `app/favicon.ico`,
  `app/icon.svg`, `app/apple-icon.png` — plus a hand-authored `app/manifest.ts`; the
  PWA/maskable PNGs live in `public/`. [[stack-and-rules]] [[subsystem-notes]]
