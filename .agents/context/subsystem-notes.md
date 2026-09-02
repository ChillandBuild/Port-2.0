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

The drift trap underneath that: the same employment facts are written out in **three**
places that nothing keeps in sync — `ROLES` in `lib/content.ts` (the only one the site
renders), the work-history prose in `SITE-CONTENT.md`, and a hardcoded answer string in
`app/api/chat/route.ts`. Editing a role title or a date means editing all three. They had
already drifted before anyone noticed: the chat route claimed "6 roles" against seven in
`ROLES`, omitted Emotii entirely, and gave Zinnov's dates as Jul 2020–Mar 2021 against
`content.ts`'s Jun 2019–Jul 2021. Also note the hero/world copy is **not** in
`lib/content.ts` at all — the statements in `components/world/WorldStage.tsx` are literal
JSX, so grep the component, not the content file, when hero wording changes.
[[active-backlog]]

## Visual QA via `lab/`
The large number of one-off scripts and screenshot PNGs in `lab/` (dbg-*, final*, v2-*,
etc.) are historical debugging artifacts from tuning the hero/world visuals, not a
regression suite. Don't assume passing/matching an old `lab/` screenshot means current
correctness — the tokens/layout may have moved on since a given script was written.

## Screenshotting a JS-driven animation mid-flight
Playwright's `elementHandle.screenshot()` takes long enough (hundreds of ms) that a GSAP
tween runs to completion during the capture: "read the value, then screenshot" reliably
produces a picture of the *finished* state, which silently looks like proof that nothing
is animating. Two things that do work. Numbers: poll the computed style on an interval
and print the series — a `strokeDashoffset` sweeping `575 → 339 → 104 → 0 → 661 → …`
settles the question without any image. Pictures: poll until the value is in the range
you want, then freeze it from inside the page with
`el.style.setProperty(prop, live + "px", "important")` so the tween's next write cannot
advance it, and screenshot after. `animations: "disabled"` on the screenshot call does
not help — it only pauses CSS animations, and none of this project's motion is CSS.
Same trick verifies an off-screen pause: sample, wait, sample again, assert equality.

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

`[data-chart-draw]` (the impressions chart) is the one animation here that never
finishes: the line redraws forever. Three rules hold it together and none of them are
obvious from the code. (a) It is **two tweens, not one timeline** — the area, dot and
marker reveal once per scroll pass, while only the line loops; folding them into one
looping timeline re-fades the ground on every repeat and reads as a flicker. (b) The loop
carries its own `ScrollTrigger` with `toggleActions: "play pause resume pause"` — an
infinite tween with no trigger keeps a rAF loop alive against an off-screen element
forever. (c) `prefers-reduced-motion` must **kill** the loop, not shorten it: the branch
sets `strokeDasharray: "none", strokeDashoffset: 0` and returns before the loop is ever
created. The existing `reduced ? 0 : n` duration idiom used elsewhere in this file is
wrong here — a zero-duration infinite repeat still spins. [[decisions-log]]

## Case studies gate is not security (`components/casestudies/CaseStudiesGate.tsx`)
The email/phone gate writes a single `sk-cs-unlock` flag to `localStorage` and flips local
state. There is no backend: nothing is validated, nothing is stored anywhere, and the
"leads" it appears to collect are discarded. The gated content is passed in as `children`
from a server component, so it is present in the delivered HTML regardless of the gate —
anyone reading source sees it. That is a deliberate, stated trade-off ([[decisions-log]]),
not an oversight. Never describe this to the user as lead capture or as access control,
and never move genuinely sensitive content behind it.

**No expiry on the unlock.** Once `sk-cs-unlock` is set, that browser never sees the gate
again — there is no TTL, no way to re-lock from the UI. A user (including the site owner,
testing their own site) who unlocked it once will see the case studies immediately on
every later visit and may report the gate as "removed" or "broken." It isn't — confirmed
2026-09-02 by testing in a fresh incognito window, where the form still appears exactly
as built. Before treating a "gate is missing" report as a code bug, first ask them to
check in a private/incognito window or clear site data for the domain.

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

## LinkedIn post data: what is fetchable and what is not (`POSTS` in `lib/content.ts`)
Everything in `POSTS` was derived from the live LinkedIn post pages. The rules, measured
2026-09-02 — re-deriving these costs an hour, so trust them before re-testing:
- **Post pages fetch anonymously.** Plain `curl` on a `/posts/…` permalink returns 200
  with full `og:title`, `og:description` (the entire post body, 341–2782 chars) and
  `og:image`. No login, no headless browser needed.
- **`og:description` spans newlines.** A line-based `grep` for `content="[^"]*"` silently
  returns empty for most posts. Parse the HTML with a real regex in `re.S`, not grep.
- **Two classes of `og:image`.** A `media.licdn.com/…/feedshare-*` URL is a real photo
  and downloads fine. A `static.licdn.com/aero-v1/…` URL is LinkedIn's grey logo
  placeholder, which means the post is a carousel/document — those render the designed
  cover instead ([[decisions-log]]).
- **Carousel covers are unobtainable anonymously.** The page HTML *does* embed signed
  `feedshare-document-cover-images_480` URLs, but they return `403 deny-InvalidToken`
  to everything unauthenticated — including a token extracted seconds earlier from a
  fresh page load, with cookies carried, a browser UA and `Referer: linkedin.com`. Do
  not spend time re-attempting this. A headless browser *renders* them (they are visible
  in a logged-out screenshot), so screenshot capture is the only route if covers are
  ever wanted.
- **Hotlinking is safe and referer-independent.** Feedshare URLs carry `e=2147483647`
  (year 2038) and serve `200` + `Cache-Control: public, max-age=86400` from any origin.
- **Image dimensions are not in the metadata.** No `og:image:width`. They were read by
  parsing the JPEG SOF marker after download; sources range 800x565 to 1085x1536, which
  is why the card cover is a fixed `aspect-ratio: 16/10` with `object-fit: cover`.

## Featured-posts marquee scales by hand (`components/posts/FeaturedPosts.module.css`)
The rail doubles `POSTS` (`[...POSTS, ...POSTS]`) and translates `-50%`, so the loop
logic is length-independent and needs no edits. The **drift duration does not scale
itself**: `44s` was tuned for 4 cards (~31px/s) and is now `460s` for 42. Add or remove
posts and the perceived speed changes unless that number moves with the count — roughly
11s per card. The `.slot` padding-right must also stay on the last slot or the `-50%`
seam lands wrong.

Card shape is conditional on `post.image`: a photo card prints its title in the body, a
carousel card prints it in the cover. Printing both would show the title twice — that was
caught on screenshot, not by any test.

## Verifying an external URL is alive (`TOOL_GROUPS`, 149 links)
A non-200 from `curl` is weak evidence a site is dead. Measured across the 149 tool URLs:
- **`403` with a real response body** = Cloudflare/DataDome bot challenge on a live site
  (G2, Trustpilot, ZoomInfo, NeverBounce, HG Insights). Fine to link.
- **`000`** = usually TLS-fingerprint blocking or sandbox DNS flake, *not* a dead host.
  `clay.com`, `apollo.io` and `adobe.com` all returned `000` to curl while rendering 200
  in a headless browser. Retry with `--http1.1` first (that alone fixed `teamfluence.io`),
  then confirm in a browser before concluding anything.
- **A 114-byte body that JS-redirects to `/lander`** = a parked domain, not the product.
  This is how `extrovert.ai` and `howly.co` were caught masquerading as the real tools.
- **`402` / `DEPLOYMENT_DISABLED`** = a real company's disabled Vercel deployment.
- Escalation order that worked: `curl -sIL` → `curl -sL` with browser headers →
  `--http1.1` → headless browser → web search for the real domain.
Names whose obvious domain was wrong, resolved by research: Extrovert →
`goextrovert.com`, Howly → `howly.io`, MailTracker → `mailtracker.io`, Telescope AI →
`trytelescope.io` (`telescope.ai` now redirects to EPAM), AI Ark → `ai-ark.com`.
[[decisions-log]] [[active-backlog]]

## Paid course access (`lib/backend/course-access.ts`, `razorpay.ts`, `app/api/webhooks/razorpay/`, `app/api/course/unlock/`)
Added in `685ecd4` ([[decisions-log]]), documented here 2026-09-02 — the second brain
had no entry for this commit at all until this session.

- **The access cookie's value is the access code itself.** There is no separate
  signature or JWT. This is safe only because every request that matters
  (`getCurrentCourseAccess()`, called fresh in `app/lead-generation/page.tsx`) re-checks
  the code against the `course_access` row in Supabase, including `expires_at`, on every
  request — the cookie is a bearer token for something re-validated server-side, not a
  trusted claim. Do not start trusting the cookie's mere presence anywhere without also
  re-checking the DB row; that would turn an expired or fabricated code into
  indefinite access.
- **The webhook is idempotent by construction, not by explicit dedup logic.** Razorpay
  retries `payment.captured` webhooks; `grantCourseAccess()` does a lookup-before-insert
  against `payment_id`, and the table also carries a partial unique index on
  `payment_id where payment_id is not null` (`supabase/course_access.sql`). A retry
  either finds and returns the existing row or the insert fails safely — either way, a
  buyer never gets two access codes for one payment.
- **A repeat buyer intentionally gets a brand-new code and a fresh 30-day window** —
  renewal is modelled as a new enrollment, not an extension. `grantCourseAccess` is keyed
  on `payment_id`, so a second payment from the same email always grants fresh access
  rather than looking up or extending the old row.
- **The access check must run in the page, never in a layout.** The comment in
  `app/lead-generation/page.tsx` states why: App Router still renders page children even
  when a layout above them never mounts, which would leak the gated `GuidePage` content
  into the RSC payload sent to a locked visitor. If a shared layout for `/lead-generation`
  is ever added, the access check has to move with it, not stay behind in the old page.
- **Signature verification reads the body as text, not JSON**, in
  `app/api/webhooks/razorpay/route.ts` — the HMAC in `verifyRazorpaySignature` is
  computed over the exact raw bytes Razorpay signed. Parsing as JSON first (which
  re-serializes) would break the signature match. Verify before you parse.
- **The webhook always answers 200 once the signature checks out**, even for events it
  doesn't handle (`{ success: true, handled: false }`) — only a bad signature or a DB
  failure returns non-2xx. This is deliberate: a 2xx tells Razorpay to stop retrying;
  anything else invites a retry storm for events this endpoint was never going to act on.
- **A captured payment with no email is logged, not retried or failed** — Razorpay
  Payment Pages normally collect it, so a missing email is treated as rare enough to
  handle manually from the Supabase dashboard rather than build recovery flow for.
