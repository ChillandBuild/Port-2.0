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

## Case study content is fabricated, and deliberately decoupled from `ROLES`
`CASE_STUDY_ENTRIES` (`lib/content.ts`, exported alongside a `CaseStudy` interface —
`company`, `whatHappened`, `whatWasDone`, `problem`, `resolution`) is what
`components/casestudies/CaseStudies.tsx` renders. As of 2026-09-02 these six entries are
**placeholder/illustrative content, not real client work** — the client asked for the
page reshaped into this 5-field format and explicitly asked for fabricated entries with
company names either invented or omitted, since no real case-study data was supplied yet.
This is the opposite of the `ROLES` drift trap two sections up: `ROLES` is real,
fact-checked employment history that must stay in sync across three places. Do **not**
apply that same "keep it accurate" instinct here — until real client case studies are
supplied, this content is expected to be invented, and should read as illustrative rather
than as a claim of fact (the page footnote says as much). `CaseStudies.tsx` no longer
imports `ROLES` at all — that coupling ("the same ROLES the homepage history draws on")
was removed this session; `ROLES` still powers `components/history/History.tsx` and
`components/track/TrackRecord.tsx` on the homepage, untouched. [[decisions-log]]

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

## Course reading progress (`lib/frontend/course-progress.ts`, `components/guide/GuideShell.tsx`)
Added `61a0d0e` ([[decisions-log]]). Browser-scoped only — localStorage, no account
system to key a server record off, so progress does not sync across devices; this is
a stated, accepted trade-off, not a gap to silently "fix" by adding a Supabase table.

**`getServerSnapshot` must return a stable reference, always** — `useSyncExternalStore`
compares it by identity. Returning a fresh `new Set()` per call (the original,
buggy version) makes React log "getServerSnapshot should be cached to avoid an
infinite loop" and can actually loop; fixed `5a0878b` by returning one module-level
`EMPTY` constant. The bug shipped in `61a0d0e` and sat unnoticed for a session because
it is a console warning, not a build/type error — `tsc --noEmit` and `next build`
both stay green through it. If you touch this file again: the client snapshot
(`getCourseProgress`) has the same requirement and already returns the cached
`cache` variable, not a fresh Set, for the same reason.

Read-tracking reuses the *existing* scroll-spy `IntersectionObserver` in
`GuideShell.tsx` (the one that already drove `activeId`) rather than adding a second
observer — `markSectionVisited(id)` is called in the same `isIntersecting` branch.

## `CourseUnlockForm`'s post-success wait has no completion signal (`components/course/CourseUnlockForm.tsx`)
Fixed `8bb8785` ([[decisions-log]]). On a valid code, the flow is: cookie set
server-side → `router.refresh()` → the whole `/course` RSC tree re-renders (Supabase
check + full `GuidePage` render) → this form's component unmounts once the gate is
replaced. `router.refresh()` returns `void`, not a promise — there is no way to
`await` "the refresh is done." The original bug: the code set a `"done"` phase right
when calling `refresh()`, but the JSX only branched on `"checking"`, so `"done"`
rendered identically to idle — the loading UI vanished at the exact moment the real
(often multi-second, cold-start-prone) wait began. The fix is an `"opening"` phase
that is never reset to idle on the success path; it only ever stops because the
component unmounts. If this pattern recurs elsewhere (anything that calls
`router.refresh()` after a mutation and needs to show "working" through the gap), the
fix is the same: hold the loading phase through to unmount, don't try to detect
refresh completion.

## The connected Razorpay MCP is NOT this project's account
Checked 2026-09-02: `mcp__claude_ai_Razorpay__fetch_all_payments` returns live data, but
the payment's `notes.purpose` is `astrologer_welcome` — a different business entirely,
not Sampath's lead-gen course. Don't assume this MCP connection can be used to inspect
or manage this project's Razorpay account (payments, settlements, payment pages) without
re-confirming which account is wired up first. It is also read-only regardless (no
payment-page or webhook-secret creation tools) — actually configuring
`RAZORPAY_WEBHOOK_SECRET` / `RAZORPAY_PAYMENT_PAGE_URL` still requires the user to do it
by hand in the Razorpay dashboard. [[decisions-log]]

## Verifying Next's `loading.tsx` — a network-layer delay is not a Suspense delay
Learned `5a0878b`, verifying the `/course` loading-state fix. Delaying the response
with Playwright's `page.route(...).continue()` (an artificial network-layer delay on
the intercepted request) did **not** trigger the `loading.tsx` fallback during a
client-side `<Link>` navigation in this app, even across a fresh dev-server restart to
rule out stale HMR. Adding a genuine `await new Promise(r => setTimeout(r, 3000))`
inside the page component itself **did** trigger it immediately and reliably. Do not
trust a `page.route` intercept to prove or disprove a Suspense/loading-boundary fix —
verify with a real `setTimeout` in the server component (temporarily, reverted after),
the same way this fix was confirmed.

## The `site_content` admin-editable-content pattern (`lib/backend/site-content.ts`, `lib/backend/site-content-loaders.ts`)
Added `1abbefc`..`aeb2e32` ([[decisions-log]]). One generic table
(`key text primary key, value jsonb`), one pair of functions
(`getSiteContent<T>(key, fallback)` / `setSiteContent(key, value)`), and one loader
function per logical content key — every admin-editable value on the site goes through
this, not a bespoke table per feature.

**Every loader's fallback IS the hardcoded value from `lib/content.ts` / `lib/content/*.ts`
/ `lib/guide/*`** — a missing row, a Supabase outage, or a malformed value all degrade to
that exact same fallback (`getSiteContent` catches and returns it on any error). This
means the old hardcoded constants are not dead code to clean up — they are the seed data
and the outage safety net simultaneously. Don't delete them when "migrating" a value to
the DB; the loader still reads them.

**`deepMutable()` (JSON round-trip) is required for any fallback built from an `as const`
export**, not optional. `HERO`, `ABOUT`, and `FOOTER` are `as const` objects, so their
nested arrays/objects are typed `readonly` — passing them straight into a loader typed to
return a mutable interface (e.g. `HeroContent`, `AboutContent`, `FooterContent`) is a type
error (`readonly [...]` not assignable to `string[]`), and you must give `deepMutable` an
explicit type argument (`deepMutable<AboutContent>({...})`) or TS infers the *readonly*
literal type from the argument instead of the target interface, silently defeating it.
Exports that are already typed as a plain mutable array (`PIPELINE: Stage[]`, `POSTS:
Post[]`, etc. — no `as const`) don't have this problem; spread (`[...POSTS]`) is enough.

**Every write via `/api/admin/settings` calls `revalidatePath("/", "layout")`** — not a
per-key path map. Root-layout revalidation invalidates every route on the site in one
call; the alternative (a table mapping each content key to the pages that read it) would
need updating every time a new consumer is added and would silently under-invalidate if
someone forgot. Traffic is low enough that the blast radius of "revalidate everything on
every save" doesn't matter.

**A client component cannot call a loader directly** — `getSiteContent` goes through
Supabase server-side. Every "use client" consumer (`EnrollDialog.tsx`, `ScheduleForm.tsx`,
`WorldStage.tsx`) takes the resolved value as a prop from its server-component parent
instead. When adding a new admin-editable value that a client component needs, thread it
through as a prop — don't try to import the loader into a `"use client"` file.

**Two homepage sections became live from `site_content` while their *marketing prose*
stays hardcoded** — the schedule-page ladder cards, the course sales hero, and SEO meta
descriptions still say the old price as literal English text (e.g. "USD 350 · one time")
even though `schedule_pricing`/`course_pricing` are the source of truth for the actual
charge. Only the real charge (both `/api/*/order` and `/api/*/verify` routes), the two
payment-dialog UIs (`EnrollDialog`, `ScheduleForm`'s currency toggle + submit label), and
the chatbot/emails were wired to read the live price. If Sampath changes a price and asks
why the ladder card still shows the old number, this is why — not a bug, a deliberately
scoped gap. [[active-backlog]]

## Course-content dynamism forced `lib/guide/sections.ts` from sync to async (Phase 5, `aeb2e32`)
`GUIDE_SECTIONS`/`GUIDE_SECTION_IDS`/`isKnownSectionId` used to be `const`s computed once
at module load from the static `GUIDE_DOCUMENT`. Once chapters live in `site_content`
(`course_chapter_1`..`course_chapter_9`, via `getGuideDocument()`), that allowlist can only
be built with an `await`. `isKnownSectionId` and friends are now `async function`s
(`getGuideSections`/`getGuideSectionIdSet`/`getGuideSectionCount`/`isKnownSectionId`) —
`/api/course/progress` (the route this allowlist actually protects — an arbitrary write
into `course_access.sections_seen` without it) now computes the id set once per request
before its loop instead of calling a sync predicate per entry. **Section ids are a stable
interface, not internal labels** — they're the DOM anchors in `GuidePage` *and* the keys
stored in `course_access.sections_seen`; renaming one in `/admin/course` orphans that
section's stored reading history for anyone who already read it under the old id. The
`ChapterEditor` UI surfaces this as a visible warning on the id field rather than hiding it.

## Supabase branching is unavailable on this project (Free plan)
Confirmed 2026-09-04: `mcp__claude_ai_Supabase__create_branch` on project
`mszponvodyeghwqxytuq` returns `PaymentRequiredException` — "Branching is supported only
on the Pro plan or above." Any future plan that assumes "build schema changes on a branch,
merge after approval" needs either an upgrade first or the same reasoning used for
Phase 1/2 of the admin panel: a brand-new, additive-only table (no ALTER on an existing
table, no risk to existing rows) is safe to apply directly to production, verified
immediately after with a real read/write round-trip. [[decisions-log]]

## This repo has more than one active session/device — `git log`/`git status` can move under you
Documented once already for commit `1592f86` (case-studies content folded into an
unrelated commit by something outside that session). Reconfirmed 2026-09-04: this
session did 5 commits (`1abbefc`..`aeb2e32`) and left them local-only per the user's
explicit instruction; by the time this session closed, `origin/main` already had all 5
**plus a 6th commit this session didn't write** (`50b3679`, a real admin sidebar
replacing the plain top nav this session shipped). **Before trusting "what's on disk" or
"what's committed" as this session's own state, diff it against what you actually wrote**
— another session may have already extended, refactored, or pushed on top of it.
[[decisions-log]]
