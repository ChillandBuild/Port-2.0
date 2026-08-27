# Top nav, photo-led hero, and a brand identity

Date: 2026-08-26
Status: approved in chat, ready for implementation

## Why

Three requests, taken together because they touch the same surfaces:

1. Remove the cadence rail.
2. Rebuild the hero on the layout of a reference site (photo-led, top nav, right
   anchored headline with an accent word, stat row, one solid call to action).
3. Give Sampath a logo mark and wordmark.

## Decisions taken

| Question | Decision |
|---|---|
| Rail | Remove the **bar**, keep the **clock**. Navigation moves to a top bar |
| Hero ground | Photo first, dissolving into the canvas world underneath |
| Photo | He shoots one to spec; unmistakable placeholder until it lands |
| Mark | SK monogram cut by the lane |
| Hero stats | Three, as in the reference: 7+ years, 24 markets, 200M+ records |

## 1. Chrome and navigation

`components/chrome/TopNav.tsx`, fixed, 64px. Transparent over the hero; past the
hero it takes a ground (`--surface-chrome` at 88% plus blur) and a hairline.

- Left: the SK mark and the wordmark.
- Right: Method, Results, Résumé, **Get in touch** (emphasised).
- The theme toggle moves here from the rail.
- Below 900px: mark, wordmark, toggle and *Get in touch* only. The section links
  move to the footer. A linear page of this length does not earn a hamburger.

`CadenceRail` is deleted along with its waypoint trace and the `WAYPOINTS` list.

`components/world/RunReadout.tsx` keeps the campaign clock alive where it means
something. It lives in the world's copy layer, anchored top-right — diagonally
opposite the stage labels — carries day, clock and the five counters, fades in as
the run begins and leaves with the landing wipe. It reads the same scroll store,
so scrolling back still un-sends the sends.

The close's disclaimer changes to "Totals from the run above."

## 2. Hero

A photo layer above the canvas, inside the world stage. Opacity 1 to 0 and scale
1.06 to 1.0 across the first ~9% of the world's travel, so it settles into the
record field rather than cutting to it. Under reduced motion the photo sits at
the top and the world follows in normal flow.

Composition mirrors the reference: subject left, copy anchored right and
vertically centred.

- Eyebrow, headline ("hello." keeps the accent serif italic), lede.
- Stat row: 7+ years, 24 markets, 200M+ records, divided.
- "Hire me" solid in the accent; "Work with me" as a plain underlined link.

The world grows from 6.6 to 7.4 viewport-heights.

### Photo specification

| | |
|---|---|
| Orientation | Landscape, minimum 2400x1600, preferably 3000x2000 |
| Subject | Left third, facing into frame, mid-gesture rather than a posed headshot |
| Right side | ~55% of the frame plain enough to carry text |
| Light | Even and soft, no hard backlight |
| Colour | Neutral or cool background; strong warm saturation fights the accent |
| Delivery | `public/assets/sampath-hero.jpg` |

## 3. Identity

**The mark.** An SK monogram built *on* the lane rather than crossed by it. In a
28x24 box: a blocky S occupying x 4-12 and a K at x 18-24, and a lane at y=10
running the full width. The S's middle bar sits on the lane and the K's vertex
lands on it, so the monogram is constructed from the same geometry the run
travels along. The letterforms take `currentColor`; the lane takes the accent, so
the accent is the pipeline.

**The wordmark.** "Sampath Kumar." in the display face, tight tracking, with the
full stop in the accent. The period is already his voice: *Every deal begins with
hello.*

Both ship from one component so the mark, the wordmark and the favicon cannot
drift apart.

## 4. What else changes

- `--rail-h` becomes `--nav-h`; everything anchored to an edge re-derives from it.
- `styles/global.css` scroll padding flips from bottom to top.
- The footer takes the section links that the mobile nav drops.
- `lib/campaign.ts` loses `WAYPOINTS`.

## 5. Verification

Both themes, at 1440x900 and 390x844, plus reduced motion:

- No dead scroll; the photo-to-world dissolve holds no frozen frame.
- Contrast measured on the composited page, including the hero copy over the
  photo placeholder and over the world.
- Tab order: skip link, mark, nav links, call to action, hero actions.
- The theme toggle still flips the canvas mid-run from its new home.
- Pointer effects stay off under touch and reduced motion.

## 6. Known risk

The hero stat row is the "hero-metric template" that this build's design floor
refuses, and it takes the hero to six text elements against a cap of four. Taken
deliberately, at the client's direction, because the reference proves the pattern
carries.

---

## 7. Changed during implementation

**The photograph arrived.** `public/assets/hero-image.png`, 1536x1024: subject in the
left third, mid-gesture, presenting to a room. Served through `next/image` with
`priority` and a blur placeholder, so the browser gets AVIF or WebP at the size it
needs — **45KB over the wire against a 1.9MB source**.

Its right side is a projected slide carrying its own type, which is exactly where the
hero copy sits. The hero's side scrim was already there for a photograph that would
never be a reliable ground; its plateau was widened to 44% so the stat row clears the
darker audience band underneath it. The slide reads faintly behind the headline, which
is depth rather than clutter.

**The monogram was cut.** The name is short, the bar has room for it in full, and a
mark that needs explaining is not working. The wordmark carries the identity alone,
with the full stop in the accent. `app/icon.svg` removed; the favicon falls back to the
one already in `app/`.

Two things the mark's removal took with it, worth noting rather than rediscovering: the
lane-as-pipeline idea no longer appears in the chrome, and there is no square-format
asset for a social card or an app icon if either is ever wanted.

**The nav needed its own scrim.** Over a photograph the bar has no ground, and the
wordmark sat on the subject's hair at the top left and disappeared. It now carries a
band of density along the top edge while it is ungrounded, fading out as the bar takes
its own ground past the hero.

## 8. Defects found and fixed while building

- **Centring by transform never worked.** `.heroAnchor`, `.trail` and `.centre` used
  `translate(-50%, -50%)` for layout, and the cue loop overwrites `transform` on every
  block on every frame to drive the entrance rise. Those three anchors had been sitting
  half a block low since the world was written, and it is invisible in any single
  screenshot. All three now centre with box geometry.
- **The hero overflowed the viewport** at every size tested once it carried six
  elements. The headline now runs at a hero-specific scale; measured to fit at
  1440x900, 1440x780, 1280x720 and 390x844.
- **Reduced motion had a hole in it.** The photo and hero-scrim layers stayed
  absolutely positioned over a document that no longer was, covering a whole screen.
  Both are now display:none there, and the readout becomes a block in flow.
- **The stylesheet was corrupted by a blind string replace** that injected the hero
  rules inside two media queries. The tail was rewritten and brace balance checked.
- **The mobile hero collided with itself** — the stat row wrapped into the call to
  action. Stats stack as compact single lines below 700px.
