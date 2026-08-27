# BRIEF — Sampath Kumar, "Worldfall"

Interviewed: yes (2026-08-25). Answers below are the human's choices, recorded as given.
Existing site: Next.js 16 / React 19 app in `/Users/prem/Documents/Port-2.0`, twelve
print-editorial sections on a "Cold Open" token system. Content source of truth is
`SITE-CONTENT.md`; typed copy lives in `lib/content.ts`.

---

## 1. The eight interview answers

**1. Vibe.** Stated as a directive rather than adjectives: "full of animations and
everything", "should not look blank", "should make the person gobsmacked". Read as:
maximum motion density, no dead screens, one moment that gets talked about.

**2. Journey.** Not dictated section by section. Instead the human fixed the four
structural answers below and confirmed all four content blocks are non-negotiable
(numbers and work history, the eight-stage process, tools and sectors, the consulting
and performance-linked offer). The journey in section 4 is derived from those.

**3. Energy curve.** Quiet open, build through the middle, one loud blast, resolve to
near-silence for the call to action.

**4. Feeling, stage by stage, and the one moment.** The one moment: the pipeline runs
live — a single contact enters the world as a point, is filtered, enriched, sent to,
replies, and books a meeting, all under the visitor's hand. Full curve in section 5.

**5. One thing no other site does.** Scroll is the cadence clock. Scrolling does not
only move the page, it advances time inside an outbound campaign. Scroll back and the
campaign rewinds: replies un-arrive, sends un-send, the counters go down.

**6. Distance from premium-minimal.** Stay on the existing Cold Open palette and type,
and earn the drama through depth, layering and a ground that travels. Not a flip to
dark SaaS, not a terminal costume, not maximalism.

**7. One unbroken world, or distinct scenes.** One unbroken world. On being shown the
conflict between that and a recruiter's need for scannable facts, the human chose the
resolution in section 3: the world runs first and then lands.

**8. Assets.** None owned, no image-generation key set. Everything is drawn in the
browser: canvas, SVG, CSS transforms, kinetic type. No video scrubbing anywhere, because
there is no footage and generating some was declined.

---

## 2. What the site is for

In priority order, from `SITE-CONTENT.md`:

1. Getting him hired full time.
2. Selling the USD 350 consulting session.
3. Selling the performance-linked engagement model.

The page must therefore be spectacular *and* skimmable. Where those two compete, the
lower-numbered goal wins, which is why the world ends and paper begins.

## 3. Grammar

**Worldfall.** A named grammar, not one of the eight in `uniqueness.md`, and it is
declared rather than blended by accident.

The first roughly six viewport-heights are a true continuous world: one fixed canvas,
no section boundaries, no acts, copy arriving inside the frame at waypoints, the camera
never cutting. Then the world **lands** — a single wipe hands the page over to paper —
and the rest is a printed dossier: dense, quiet, scannable, in document flow.

Why not the pure continuous world of `uniqueness.md` §2.4: that grammar forbids document
sections entirely, and a résumé cannot be waypoints. A recruiter skimming on a phone has
to be able to find the numbers, the history, the tools and the phone number, and goal 1
outranks the purity of the structure.

Why not the other seven: filmic one-shot needs footage this build does not have and is
the drift this skill exists to resist; chaptered editorial hard-cuts between grounds,
which is the opposite of "one unbroken world"; live surface bans display type and would
bury the hire pitch in app chrome; typographic poster throws away the pipeline, which is
the peak; gallery is for a range, and a career is a sequence, not a collection; split
stage needs a two-sided argument, and this is one person's case; rhythmic cutlist is
made of seams and the human asked for none.

**What the grammar forbids here**, and these hold for the whole build: no cut inside the
world; nothing scrolls over the canvas, copy arrives inside it; no second canvas after
the landing; no return to the world once it has landed; no scroll cue, no section
counters, no eyebrow above every heading.

**Chrome.** Not a wordmark-and-CTA bar. The chrome is the instrument rail described in
section 6, present from the first pixel to the last, and it is also the navigation.

## 4. The journey

```
1  Recognition   one contact, at eye level, still. the person he would write to
2  Scale         the camera pulls back and there are two hundred million of them
3  Cost          most of them go dark. what writing to all of them actually costs
4  Method        the filter fires and one contact completes the whole run  ← peak
5  Arrival       the world lands on paper. the real, checkable numbers
6  Evidence      the ledger and the seven-year history as a printed dossier
7  Range         the sectors and the stack, as an index rather than a pitch
8  Terms         the offer and the performance-linked model, small and plain
9  Reply         one address, one action, the campaign totalled and stopped
```

## 5. The feeling curve

Written before the acts. Emotion first, cause second.

```
1  Recognition   a single contact card holding still in an empty field, breathing
2  Unease        the pull-back: the same card is one point among a dense dark mass
3  Doubt         the mass dims to almost nothing. an authored near-empty screen
4  Awe           the run: filter, verify, send, reply, meeting, under the hand
5  Relief        the wipe to paper. bone ground, real figures, nothing moving fast
6  Confidence    six roles down a spine, each with a checkable result
7  Competence    nine sectors and thirty-one tools travelling sideways as an index
8  Intimacy      one line in second person, the smallest type on the site
9  Resolve       the rail totals the run and stops. one phone number, one profile
```

No two adjacent lines carry the same feeling. Acts 2 and 3 are close, which is the pair
to watch on the feel check; if they read the same, act 3 is filler and gets cut.

## 6. The peak

> "It's the site where you scroll and it actually runs the campaign — and when you
> scroll back up, the replies un-arrive."

Act 4, "Method". It gets:

- **The asset budget.** The world's only fully-populated frame, all three depth layers,
  the lane geometry, the beacons.
- **The silence in front of it.** Act 3 ends on a deliberately near-empty dark frame with
  one line of type. That is **authored silence**, not dead scroll, and the verification
  pass should read it as intended.
- **The most scroll room.** ~3.0 viewport-heights against ~1.0 to 1.6 for everything else.

## 7. The signature move

**The cadence clock.** A rail fixed to the bottom edge on desktop and the top on mobile,
present for the entire page. It carries campaign day, send window, and running totals for
sourced, verified, sent, replied and booked. Every value is a pure function of scroll
position, so scrolling back genuinely rewinds the campaign rather than resetting it, and
passing a waypoint stamps a permanent marker on the rail. By the footer the rail is a
complete record of the run, and its markers are the page's navigation.

Honesty: the campaign is a **simulation of his method**, and the rail says so on its face.
The only figures presented as claims about his work are the verified ones in the ledger,
sourced in `SITE-CONTENT.md` §3.

## 8. Tell-someone sentence

> It's the site where scrolling backwards un-sends the emails.

## 9. Authored silence

One, and only one: the end of act 3, immediately before the peak. Roughly a third of a
viewport-height with a dimmed world and a single line of type. Any other empty screen the
verification pass finds is a defect.

## 10. Tech

GSAP with ScrollTrigger, chosen by the human, lazy-loaded below the hero. The skill's
`engine/scrollcraft.js` is deliberately not used: it is a vanilla-DOM runtime for a static
HTML page, and this is a React 19 app whose content already lives in typed modules. The
device *vocabulary* from `references/devices.md` and the whole taste floor still apply.

---

## 11. Feel check (run against the built page)

Felt, act by act, reading the contact sheet and scrolling the production build:

```
1  Recognition   as intended
2  Scale         intended UNEASE. Felt scale, not dread. Diff stands.
3  Doubt         as intended
4  Absorption    intended AWE. See below.
5  Relief        as intended, and the strongest single change on the sheet
6  Confidence    as intended
7  Competence    as intended
8  Plain         as intended (administrative, compressed)
9  Resolve       as intended
```

**Diff 1, act 2.** The pull-back to the record field reads as scale rather than as
unease. Not fixed: making it oppressive would cost the calm open, which the energy
answer asked for. Recorded rather than papered over.

**Diff 2, the peak.** On the first pass the landing wipe was the biggest visual change
on the page, not the run — the eight gates all behaved identically, which is the "one
device eight times" failure. Changed rather than re-labelled: the run now has a shape.
The camera frames in on the send, pulls back for the thinning, and closes hard on the
survivors, all on the same straight track so the pace never changes; gate four fires a
send burst across the whole cohort; the three booked contacts light up at gate seven and
bloom through to the end. The run and its landing now read as one movement with the
landing as its resolution. That is honest to what is on screen: the peak is the run,
resolved by the wipe, not the wipe alone.

## 12. What the client corrected after first review

Reported on the built page: the contacts died out before the end, so stage 08 was an
empty frame and "three meetings out" arrived with nothing having visibly survived.
Four changes, each specified by them rather than inferred:

1. The three booked contacts stay on screen and lit to the very end.
2. The Booked figure still only moves at stage 08 (it now reads 1, 2, 3 as they cross).
3. Drop-outs fade far more slowly rather than vanishing, so the late stages keep the
   evidence of the funnel.
4. The three marks are printed on the paper beside the closing line.

## 13. Verified, and not

Verified on the production build at 1440x900, 390x844, and with reduced motion forced:

- No dead scroll at any sampled position, on any of the three passes.
- Contrast measured on the composited page at 30 scroll positions, reading the canvas
  pixels under each line at the 10th and 90th percentile rather than assuming a CSS
  colour. No failures.
- Tab order: skip link, rail wordmark, eight waypoints, hero actions, contact actions,
  footer. Every focusable has a visible ring. One h1, no heading-level skips, canvas
  hidden from assistive tech.
- Reduced motion renders the world as one held frame with every waypoint readable at
  once, and the sector rail relays out as a grid instead of a drag region.
- With scripting unavailable the world renders as an ordinary stacked document.

Not verified: a real phone. Headless Chrome cannot reproduce iOS scrolling, Low Power
Mode, or a real device's paint budget for a full-screen canvas.

## 14. Known deviations

- **Length: 16.05 viewport-heights against the skill's 8 to 14 budget.** The interview
  fixed all four content blocks as non-negotiable, and a résumé, nine sectors, thirty-one
  tools, six roles and two commercial offers do not compress below this without cutting
  content. Flagged, not silently absorbed.
- **Four type families** (display, text, mono, and a serif italic carrying two phrases),
  where the taste floor asks for two. Inherited from the existing Cold Open system, which
  the interview asked to keep. The mono is doing labels and data, which is sanctioned; the
  serif italic is the brand's own signature line.
- **Script weight 177KB over the wire against a 150KB budget**, of which roughly 120KB is
  the React and Next runtime and roughly 45KB is GSAP. GSAP was the client's choice.

---

## 15. The interaction layer on the paper half

Added after review: the world responds to the pointer, the dossier below it did not.
Every interaction extends the page's own vocabulary rather than adding generic card
lifts, and each one answers "which of these am I reading".

| Surface | What the pointer does | Why this and not something else |
|---|---|---|
| Dark grounds (sectors, stack, close) | One soft accent light follows the cursor | The same gesture as the world's pointer lean, so the two halves feel like one place |
| Ledger rows | The rule under the row draws itself in the accent, left to right; the figure and its source shift toward the reader | A drawn line is how the world marks a gate. Same vocabulary, quieter register |
| Work history | The marker beside the role blooms; the result line slides out | The bloom is the mark a booked contact gets in the run |
| Tool stack | Hovering a group brings its tools up left to right on a 22ms step; the other three groups stay quiet | A stack coming up in order, which is what a stack does. The tools were previously inert text |
| Sector cards | 4° tilt toward the pointer, accent rule on the one actually hovered | Cards you would pick up. Hover, not proximity, so exactly one is lit |
| Engagement phases | Hovering one quietens the other two; its rule fills in the accent | The model is sequential, so one phase should be current at a time |
| Close | The primary action is magnetic (0.22); hovering one receipt figure quietens the rest | One magnet on the page. A page of them is unusable |

Deliberately not done: custom cursor, ripples, magnetic everything, parallax on body
copy, hover motion on anything a reader is mid-sentence in.

**Gating, proved rather than asserted** (`lab/pointer-gate.mjs`):

```
desktop pointer  { near: 3, spotVarsSet: 2, inlineTransforms: 9 }
reduced motion   { near: 0, spotVarsSet: 0, inlineTransforms: 0 }
touch (coarse)   { near: 0, spotVarsSet: 0, inlineTransforms: 0 }
```

The engine registers nothing at all unless the device has a fine hovering pointer and
reduced motion is off, so a phone cannot get a stuck highlight and a reader who asked
for less motion gets none of this.

**Contrast of the de-emphasised states.** The resting sweep cannot see them, so the
harness gained a `--hover` mode that parks the pointer before measuring. First pass
found dimmed phase copy at roughly 3:1 and dimmed receipt labels at roughly 3.9:1,
both under the 4.5:1 floor for body text. Dim floors raised to 0.62 and 0.64; all three
hover states now measure clean across the full scroll.

---

## 16. Light and dark themes

Added after review. The page already hard-cut between light and dark grounds, so
"theme" was ambiguous here; the client's call was **both extremes**: light mode turns
the entire page light including the canvas world, dark mode turns it all dark.

**Colour is named by role now, not by pigment.** The old tokens (`--color-ink`,
`--color-bone`, `--color-paper`) described appearance, which is precisely why the page
could not flip: the same token was a background in one section and text in another.
Surfaces and their inks are paired instead, and each pair is redefined per theme:

```
world → page → page-alt → panel → panel-alt → close      (+ chrome)
```

Within a theme these are tonal steps rather than polarity flips. **The world is
deliberately the most extreme step in both themes** — near-white against bone in light,
near-black against a lifted charcoal in dark — because a single-polarity page would
otherwise lose the landing wipe, and that wipe is the page's arrival.

**The canvas cannot read CSS**, so the palette is read out of the document once per
theme change and handed to the renderer, keeping tokens.css the single source. Two
things could not simply carry over:

- **Alpha response.** Dark marks on a light ground read far stronger than light marks
  on a dark one at the same alpha. Light mode scales the field's alphas to 0.62.
- **The landing fill** paints the dossier's ground rather than a fixed pigment, so the
  wipe lands on paper in light and on charcoal in dark.

**Control.** Resolved before first paint by a small inline script (OS preference, then
a stored override), with a toggle in the cadence rail. Verified: OS light opens light,
the toggle flips the whole page including the canvas mid-run, the choice survives a
reload, and an un-chosen theme still follows the OS while the page is open.

**Two real contrast failures found and fixed in the process:**

- `--accent` on the dark panel ground measured 4.36:1 against a 4.5 floor for the 11px
  sector tags. Lifted one step.
- `--on-panel-mute` failed in both themes (2.93 light, 4.38 dark). It is now identical
  to `--on-panel-soft` on purpose: the panel grounds are mid-tone, and **no third,
  lighter ink step fits on them** — every value light enough to read as a third step
  measured between 2.9 and 4.4. Hierarchy on the panels comes from scale and weight.

## 17. The harness was measuring the wrong layer

Worth recording, because every contrast claim made before this point about copy over
the world was measured against the canvas element alone — and the scrim and grain sit
between the canvas and the type. On the dark theme that hid nothing. On the light theme
it hid a real failure completely.

The harness now photographs the frame with the type hidden and reads the composite.
Three traps, each of which silently returns a sample of the glyphs rather than the
ground behind them:

1. `color-mix()` resolves to `color(srgb …)` with 0-1 floats; parsing those as 0-255
   turns a near-white chrome into a near-black one and invents failures.
2. The world's rAF loop rewrites `visibility` and `opacity` on every copy block every
   frame, so hiding a block is undone before the shutter.
3. A child that sets `visibility: visible` overrides a hidden ancestor. `display: none`
   on the children survives both.

## 18. Known deviation: light-theme world copy

**The stage labels in light mode measure 1.17 to 1.20:1 for body copy and 2.8 to 3.0:1
for the numerals, against a 4.5:1 floor.**

The cause is a direct collision: the world's atmosphere is a dark radial anchored to
the bottom-left corner, and every stage label is anchored to that same corner. Over a
light world it renders as mid-grey, and the mid-grey body copy sits at the same
luminance as its ground.

Three fixes were offered and two were built and rejected on look:

- A light plate under each block was built; it rendered as a hard card and was reverted
  at the client's request.
- Lightening the fog in light mode only was declined.

**The client's decision is to keep the atmosphere as it is.** It is recorded here rather
than quietly absorbed, because this page's first job is getting somebody hired and this
is copy a recruiter cannot read in light mode. Dark mode is unaffected and measures
clean across the whole scroll. The remaining ways out, if it is ever revisited: soften
the fog on the light theme only, move the stage labels out of the fogged corner in
light mode, or keep the light theme's world dark.
