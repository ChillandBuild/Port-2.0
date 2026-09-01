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

## ScrollFX data-attribute contract (`components/motion/ScrollFX.tsx`)
All below-the-landing scroll motion is wired from this one client component off data
attributes, so section components stay server components and stay presentational. The
contract it reads: `[data-reveal]` (plus optional `[data-reveal-children]`), `[data-count]`,
`[data-pan]` with a `[data-pan-track]` and `[data-pan-item]` children, `[data-spine]`,
`[data-drift]`. The trap: these attributes are the API, and nothing type-checks them —
renaming or dropping one in a component silently kills that animation with no build error
and no console warning. Grep ScrollFX before touching a data attribute in any section.
GSAP is dynamically imported inside the effect on purpose; do not hoist it to a static
import or it lands in the bundle that paints the hero. [[decisions-log]]

## Case studies gate is not security (`components/casestudies/CaseStudiesGate.tsx`)
The email/phone gate writes a single `sk-cs-unlock` flag to `localStorage` and flips local
state. There is no backend: nothing is validated, nothing is stored anywhere, and the
"leads" it appears to collect are discarded. The gated content is passed in as `children`
from a server component, so it is present in the delivered HTML regardless of the gate —
anyone reading source sees it. That is a deliberate, stated trade-off ([[decisions-log]]),
not an oversight. Never describe this to the user as lead capture or as access control,
and never move genuinely sensitive content behind it.

## Legal pages share one shell (`components/legal/LegalPage.tsx`)
`/privacy`, `/terms`, and `/refunds` are three thin routes over one presentational shell.
Editing the shell changes all three at once — check the other two before restyling one.

## Theme correction runs `setState` inside an effect, on purpose (`components/chrome/ThemeToggle.tsx`)
`useState<Theme>("light")` starts at the server-rendered default, then a `useEffect`
immediately corrects it to the real theme via `setLocal(currentTheme())` before
subscribing to further changes. This trips `react-hooks/set-state-in-effect` (a real
ESLint rule, not a false positive) because setState-in-effect is usually a smell — but
here it's the only way to avoid a hydration mismatch: `currentTheme()` can only be read
client-side, so it can't run in the lazy `useState` initializer without server and
client disagreeing on first paint. Suppressed with `eslint-disable-next-line
react-hooks/set-state-in-effect` plus a reason comment immediately above the call —
if you touch this pattern elsewhere (any state that must start at a server-safe default
and self-correct after mount), the same disable-with-reason is the right fix, not
restructuring the effect away.

## Site icons (`app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`, `app/manifest.ts`)
The favicon is a code-traced glyph, not a hand-drawn SVG: the `S` path is lifted from
the real Bricolage Grotesque variable font instanced at wght 800, with the accent full
stop as a second path. If the wordmark treatment changes, regenerate rather than nudging
the path by hand — the build script is NOT in the repo (it lived in a scratch dir).
Re-derive it: google/fonts `ofl/bricolagegrotesque` variable ttf → fontTools
`instantiateVariableFont({opsz:40, wght:800, wdth:100})` → `SVGPathPen` on glyphs `S`
and `.` → compose into a 512 viewBox (period tucked ~18 font-units after the S ink) →
`sharp` for the PNGs and a PNG-in-ICO container at 16/32/48.
Traps:
- `app/icon.svg` carries a `@media (prefers-color-scheme: dark)` block — ink `#0b1b2a` /
  dot `#5b21b6` on light, bone `#eef0ea` / `#8b5cf6` on dark. Keep both branches when
  editing. Next serves it at `/icon.svg`.
- `app/manifest.ts` references the PNGs by absolute `/…` path, so they MUST sit in
  `public/`, not `app/`. An `app/`-only PNG will 404 from the manifest.
- The maskable PNG deliberately carries the `#f5f3ff` ground (Android's adaptive mask
  crops into something); the other icons are transparent. `apple-icon.png` is also
  grounded — iOS should not get transparency.
- Colours are the client's tokens (`--on-page`, `--accent`, `--surface-page`,
  `--surface-chrome`). If the token values move, the icons and `manifest.ts` do not
  update themselves. [[decisions-log]]
