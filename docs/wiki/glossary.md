# Glossary

Project-specific vocabulary. General web / Next.js terms are not listed.

### Cold Open

The site's visual direction. Sampath runs outbound lead generation for a living, so the
page opens a conversation the way he does: section headers are framed as message fields
(`Re: how the pipeline runs`), and a drafted cold-open message sits where a portfolio
would normally put a headshot. The structural device encodes something true about the
content instead of decorating it. Chosen over a conventional headshot-led layout
(see `.agents/decisions/log.md`).

### Envelope rail

The horizontal strip across the top of the page that carries real facts about Sampath,
styled as an envelope / metadata line.

### "hello."

The single word the headline lands on, set in Newsreader italic 300 — the only place
that face is used. On the client it rotates through the 24 markets Sampath covers
(`components/world/Greeting.tsx`), but only as progressive enhancement: server and
first paint render the literal "hello." with no hydration mismatch, and cycling starts
only after mount and only when motion is allowed. Derived from his own tagline,
"Every deal begins with hello.", which predates the project.

### World / world engine

The animated `<canvas>` scene (`lib/world*.ts` + `components/world/WorldStage.tsx`).
A custom requestAnimationFrame loop, deliberately not built on the scrollcraft skill's
own motion engine. Its defining rule: the world is "a pure function of scroll position"
— scrolling back must visually undo state (un-send messages, un-arrive replies). Verify
edits by scrolling **both** directions.

### sampath-worldfall

This site's entry in `scrollcraft/FINGERPRINTS.md` — the build registry for the
scrollcraft skill. "Worldfall" is the page grammar it was built on. See that file for
the full grammar / nav / close-pattern breakdown.

### ScrollFX

`components/motion/ScrollFX.tsx` — the one client component that wires every
below-the-landing GSAP ScrollTrigger animation. Sections declare intent via `data-*`
attributes; ScrollFX reads them and drives the motion. Keeps section components
server-side. The `data-*` contract is untyped — see [contributing.md](contributing.md).

### Client A–F

Sampath's past employers, anonymised in `SITE-CONTENT.md` and on the site. The letters
map to real companies in the source copy only.

### Case-studies gate

`components/casestudies/CaseStudiesGate.tsx`. An email/phone prompt in front of the
case studies. **It is not access control and not lead capture.** It writes one
`sk-cs-unlock` flag to `localStorage` and flips local state. There is no backend
validation for this gate, and the gated content ships in the delivered HTML regardless
(passed as `children` from a server component). A deliberate, stated trade-off — never
describe it as security or as collecting leads.

### Submissions endpoint

`app/api/submissions/route.ts`. The single POST route that backs the `/hire` capture
form and (separately from the localStorage gate) records case-studies-gate emails.
Writes to a Supabase `submissions` table; sends a best-effort Resend notification.
No-ops cleanly when env vars are unset.

### Lane

A field on a submission: `hiring` or `buying`. Which of Sampath's two audiences the
person filling the form belongs to.

### `lab/`

Throwaway Playwright screenshot / debug scripts (`dbg-*`, `final*`, `v2-*`, …) from
tuning the hero and world visuals. Not a regression suite. Matching an old `lab/`
screenshot does not prove current correctness — tokens and layout may have moved on.
