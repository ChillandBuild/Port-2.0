# Palette rework — electric indigo primary, value rhythm, gold proof accent

**Date:** 2026-09-05
**Status:** Design approved, pending spec review
**Scope:** Site-wide (all pages)

---

## 1. Problem

The site reads as dull. Measured cause, not opinion.

Every section ground on the homepage, top to bottom (light theme, measured from the live DOM):

| # | Section | Hex | L% | Chroma | Hue |
|---|---------|-----|-----|--------|-----|
| 1 | WorldStage | `#fdfcff` | 99.3 | 0.004 | 301° |
| 2 | Proof | `#fdfbff` | 99.1 | 0.006 | 308° |
| 3 | Positioning | `#e1d8f4` | 89.8 | 0.039 | 300° |
| 4 | VideoTeaser | `#f5f3ff` | 96.9 | 0.016 | 294° |
| 5 | History | `#ede9fe` | 94.3 | 0.028 | 295° |
| 6 | Features | `#fdfcff` | 99.3 | 0.004 | 301° |
| 7 | PlatformArchitecture | `#f5f3ff` | 96.9 | 0.016 | 294° |
| 8 | FeaturedPosts | `#f5f3ff` | 96.9 | 0.016 | 294° |
| 9 | Reply | `#ddd0ef` | 87.8 | 0.044 | 304° |
| 10 | Footer | `#ffffff` | 100.0 | 0.000 | — |

Four root causes:

1. **No value anchor.** The entire 15,207px page lives between L 88% and L 100% — a 12.2-point spread. Nothing dark exists. The eye goes to the highest-contrast thing in view; nothing here is high contrast, so nothing pulls.
2. **Chroma near zero.** Maximum chroma on the page is 0.044. Vivid violet reaches 0.21+. The grounds are not violet — they are white with a rumour of violet.
3. **Invisible seams.** PlatformArchitecture → FeaturedPosts is a **0.0-point** step (identical ground, two sections abutting). WorldStage → Proof is **0.2 points**. Four of nine seams are invisible or barely there.
4. **Three unrelated hue families.** Grounds are violet (294–304°). Body ink `--on-page` is navy (`#0b1b2a`, hue 248°). Heading ink is pure neutral black (`#0d0d0d`, chroma 0.000). Three systems pretending to be one — this is the "colours have no connection" complaint, precisely located.

Secondary defects found:

- `Footer.module.css` sits entirely outside the token system — 11 hardcoded declarations across 5 colours (detailed in §7.4), violating the "nothing hardcodes a palette value" rule stated at the top of `tokens.css`. Its `#ffffff` ground is also the brightest surface on the site and it is *last*, so the page ends on its emptiest note.
- `--surface-footer` and `--on-footer` are defined but have **zero consumers**. Dead tokens.
- `tokens.css:45–47` documents `--surface-card` as "the sector tiles specifically". Grep finds exactly one consumer: `Proof.module.css:3`. Stale comment.

---

## 2. Goals

- Give the page a deliberate value rhythm with real dark anchors.
- Raise ground chroma so the palette reads as a colour decision.
- Introduce one secondary hue with a semantic job, not decoration.
- Unify every ink and ground into a single hue family.
- Preserve WCAG AA (4.5:1 body, 3:1 large) on every pair, in both themes.

## 3. Non-goals

- Restructuring the hero. WorldStage is 6,660px (44% of the page) and stays at L99 with no dark anchor. Noted as a known gap; out of scope for this pass.
- Changing typography, spacing, layout or motion.
- A considered dark-theme redesign. Dark theme is re-hued for coherence, not redesigned.

---

## 4. Decisions taken

| Decision | Choice |
|---|---|
| Scope | A + C + D: dark bands, gold results accent, unified ink family |
| Secondary hue | Warm gold / amber for results and numbers |
| Dark band placement | Proof + PlatformArchitecture + Reply (+ Footer) |
| Primary colour | `#7033ff` |
| Small accent text | Darker sibling via existing `--accent-meta` token |
| Ground hue | Re-hue all grounds to ~288° to match the primary |
| Gradient partner | `--accent-strong` → `#3a12a8` |
| Bottom weight | Keep all three dark bands |
| Page scope | Site-wide, verify every affected page |

### Primary colour rationale

`#7033ff` = **L53.9% C0.271 H287°**, against the current `#5b21b6` = L43.2% C0.211 H293°.
Delta: **+10.7 lightness, +0.060 chroma (+28% saturation), −6° hue toward blue.**

The blue-shift moves the brand from *royal purple* (heritage, soft) to *electric indigo* — the register that reads technical and decisive. The chroma jump is the direct remedy for cause #2.

### The gold rule

Gold cannot be a single value. Measured:

- `#fbbf24` on the pale grounds: **1.41:1** — unreadable.
- `#b45309` (dark enough for pale grounds): **3.86:1** on the dark band — muddy.

Therefore: **gold appears only on dark bands.** This is a hard rule, not a preference. It also produces the desired semantics — dark band means "this is evidence", gold means "this is the number". On light sections, results stay in `--accent-meta`.

---

## 5. The palette

All values derived in OKLCH at hue 288° and verified for contrast. **Every pair below passes AA.**

### Light theme

Complete — all 49 existing tokens plus 8 new ones (57 rows). `NEW` marks tokens that do not exist today.

| Token | Value | Note |
|---|---|---|
| `--surface-world` | `#fbfbff` | |
| `--surface-world-wide` | `#f2f2ff` | |
| `--surface-world-lane` | `#f8f7ff` | |
| `--on-world` | `#1a172c` | |
| `--on-world-soft` | `#2d2b3f` | |
| `--surface-page` | `#edecff` | |
| `--on-page` | `#1a172c` | re-hued from navy `#0b1b2a` |
| `--on-page-soft` | `#5d5c6b` | |
| `--heading-ink` | `#0d0b19` | re-hued from neutral `#0d0d0d` |
| `--surface-page-alt` | `#dad8f9` | lowered from L92 to widen the History seam |
| `--surface-card` | `#f6f5ff` | |
| `--surface-panel` | `#cbc8f4` | |
| `--surface-panel-alt` | `#c1beee` | |
| `--on-panel` | `#1a172c` | |
| `--on-panel-soft` | `#4c4b5b` | value change; token already exists |
| `--on-panel-mute` | `#4c4b5b` | same as soft, per existing convention |
| `--surface-close` | `#cbc8f4` | |
| `--on-close` | `#1a172c` | |
| `--on-close-soft` | `#4c4b5b` | |
| `--surface-footer` | `#060315` | revived from dead |
| `--on-footer` | `#eeedf6` | flips light — footer ground is now dark |
| `--on-footer-soft` | `#aaa9b8` | flips light |
| `--on-footer-mute` | `#858492` | `NEW` — footer needs a third ink step (see §7.4) |
| `--surface-chrome` | `#f2f2ff` | |
| `--on-chrome` | `#1a172c` | |
| `--on-chrome-soft` | `#5d5c6b` | |
| `--surface-deep` | `#0f0a24` | `NEW` — the dark band |
| `--surface-deep-raised` | `#1c1835` | `NEW` — cards on a dark band |
| `--on-deep` | `#eeedf6` | `NEW` |
| `--on-deep-soft` | `#aaa9b8` | `NEW` |
| `--wordmark-ink` | `#301172` | |
| `--wordmark-sweep` | `#c084fc` | unchanged |
| `--nav-veil` | `rgba(251, 251, 255, 0.82)` | |
| `--nav-link-hover` | `rgba(26, 23, 44, 0.08)` | |
| `--accent` | `#7033ff` | fills, borders, gradients |
| `--accent-meta` | `#5418d6` | accent as *text* |
| `--accent-strong` | `#3a12a8` | gradient partner |
| `--accent-hover` | `#601dda` | **darkens** on hover |
| `--accent-soft` | `#8470e5` | |
| `--accent-tint` | `#f2f1ff` | |
| `--accent-muted` | `#e6e4ff` | |
| `--accent-ink` | `#f6f7f4` | unchanged |
| `--accent-gradient` | `linear-gradient(135deg, var(--accent-strong), var(--accent))` | unchanged |
| `--accent-deep-meta` | `#b39aff` | `NEW` — accent text on dark bands |
| `--result` | `#fbbf24` | `NEW` — gold, dark bands only |
| `--result-soft` | `#fcd34d` | `NEW` |
| `--rule` | `rgba(26, 23, 44, 0.14)` | re-hued |
| `--rule-strong` | `rgba(26, 23, 44, 0.26)` | re-hued |
| `--rule-panel` | `rgba(26, 23, 44, 0.16)` | re-hued |
| `--rule-chrome` | `rgba(26, 23, 44, 0.18)` | re-hued |
| `--spot-tint` | `rgba(112, 51, 255, 0.10)` | re-hued to the new primary |
| `--danger` | `#9c2015` | **darkened** from `#b3261e` — see §7.5 |
| `--hero-scrim` | `rgba(230, 228, 255, 0.5)` | |
| `--world-scrim-lead` | `rgba(58, 18, 168, 0.5)` | |
| `--world-scrim-trail` | `rgba(58, 18, 168, 0.38)` | |
| `--world-grain` | `0.05` | unchanged |
| `--panel-grain` | `0.035` | unchanged |

### Dark theme

Existing lightness structure preserved exactly; only hue (248° navy → 288° violet) and chroma change.

| Token | Was | Now | L% (unchanged) |
|---|---|---|---|
| `--surface-world` | `#04090f` | `#080711` | 13.6 |
| `--surface-page` | `#141d26` | `#1b1a2a` | 22.6 |
| `--surface-page-alt` | `#0f1720` | `#161422` | 20.1 |
| `--surface-panel` | `#16202a` | `#1e1c2f` | 23.9 |
| `--surface-panel-alt` | `#1b2632` | `#242237` | 26.4 |
| `--surface-card` | `#16202a` | `#1e1c2f` | 23.9 |
| `--surface-close` | `#0a1119` | `#100f1b` | 17.5 |
| `--surface-chrome` | `#070d13` | `#0c0b16` | 15.6 |
| `--surface-footer` | `#131c25` | `#1a1928` | 22.2 |
| `--on-page` | `#eef0ea` | `#eeeef7` | 95.2 |
| `--on-page-soft` | `#9dabb5` | `#a8a7b5` | 73.3 |
| `--on-panel-soft` | `#a4b1bb` | `#aeadbb` | 75.3 |
| `--surface-deep` | — | `#1e1b35` | 24.0 |
| `--surface-deep-raised` | — | `#2d2947` | 30.0 |
| `--accent` | `#6d28d9` | `#7033ff` | 53.9 |
| `--accent-meta` | `var(--accent-soft)` | `#b39aff` | 74.8 |

**The dark band inverts direction in dark theme.** The page is already dark, so `--surface-deep` *lifts* (L24 against a L22.6 page) rather than deepening. Mirrors the convention the footer already uses (`tokens.css:196–198`).

**`--accent` is `#7033ff` in both themes.** One brand hex sitewide. Light ink `#f6f7f4` on it measures 5.42:1 (PASS); a lighter dark-mode variant was tested and rejected at 4.48:1.

---

## 6. Mechanism: `data-ground="dark"`

Sections consume *role* tokens (`--surface-page`, `--on-page`, `--rule`), never hex. So a section flips to dark by redefining that token set on its own wrapper — exactly mirroring what `:root[data-theme="dark"]` already does globally, scoped down to one section.

```css
[data-ground="dark"] {
  --surface-page: var(--surface-deep);
  --surface-page-alt: var(--surface-deep-raised);
  --surface-card: var(--surface-deep-raised);
  --surface-close: var(--surface-deep);
  --on-page: var(--on-deep);
  --on-page-soft: var(--on-deep-soft);
  --on-close: var(--on-deep);
  --on-close-soft: var(--on-deep-soft);
  --heading-ink: var(--on-deep);
  --accent-meta: var(--accent-deep-meta);
  --rule: rgba(238, 237, 246, 0.16);
  --rule-strong: rgba(238, 237, 246, 0.30);
  --rule-panel: rgba(238, 237, 246, 0.18);
  --spot-tint: rgba(179, 154, 255, 0.14);
  --danger: #ffb4ab;
}
```

`--danger` must invert too: `#9c2015` measures **2.95:1** on `--surface-deep` (fail). `#ffb4ab` measures 11.36:1 — and is already the dark theme's danger value, so this reuses an existing decision rather than inventing one.

**Proof, PlatformArchitecture and Reply need no changes to their own CSS.** Verified: all three consume tokens exclusively (with two hardcoded exceptions in PlatformArchitecture, addressed in §7).

This scoping is **load-bearing, not cosmetic** — see §8.

---

## 7. Traps found, and their fixes

### 7.1 `.grained` blend-mode inversion

`global.css:133` sets `mix-blend-mode: multiply`, flipped to `screen` only under `:root[data-theme="dark"]`. PlatformArchitecture and Reply both carry `.grained`. A locally-dark band inside *light* theme keeps `multiply`, turning the grain to mud.

**Fix:** add a rule keyed on the ground attribute, not on the theme.

```css
[data-ground="dark"].grained::after,
[data-ground="dark"] .grained::after { mix-blend-mode: screen; }
```

### 7.2 PlatformArchitecture's hardcoded dark card

`PlatformArchitecture.module.css:108–110` hardcodes `background: #1c2430; color: #eef0ea; border: 1px solid rgba(238,240,234,0.18)`. Its own comment (lines 104–107) explains it was chosen so it would *not* vanish against a dark page background. On a newly-dark Stack ground it vanishes exactly as that comment feared.

**Fix:** replace with `--surface-deep-raised` / `--on-deep` / token rule, so it lifts off whichever ground it sits on.

### 7.3 `--spot-tint` and rules invert

`--spot-tint` is `rgba(91,33,182,0.09)` — dark violet, invisible on a dark ground. Reply carries `.spot`. `--rule` / `--rule-strong` are derived from light ink and vanish likewise. All three are inverted inside the scoped block (§6).

Additionally `--accent` measures **2.16:1** on the dark band — hence `--accent-meta` remapping to `#b39aff` (8.25:1).

### 7.4 The footer is entirely off-token (severe)

`Footer.module.css:3` carries the comment *"footer carries its own ink colors instead of the theme tokens"*, and hardcodes **eleven** declarations across five colours — not one:

| Line(s) | Value | Becomes |
|---|---|---|
| 6 | `background: #ffffff` | `var(--surface-footer)` |
| 7, 74, 144 | `color: #101014` | `var(--on-footer)` |
| 39 | `color: #565664` | `var(--on-footer-soft)` |
| 57, 124 | `color: #9a99a6` | `var(--on-footer-mute)` `NEW` |
| 8, 59, 120 | `border: 1px solid #e6e4ef` | `var(--rule)` |
| 97, 150 | `color: var(--accent)` | `var(--accent-deep-meta)` |

Flipping only the background — as an earlier draft of this spec said — would leave **near-black text on a near-black ground** and three invisible borders. All eleven must move together.

The two `var(--accent)` usages also break: `#7033ff` on `#060315` measures **3.50:1** (large-only). `--accent-deep-meta` measures 8.71:1.

Verified: the footer contains no `<h1>`–`<h3>`, so the global `--heading-ink` rule (`global.css:44–48`) does not apply there and needs no footer-specific handling.

### 7.5 `--danger` fails on the darkened panel

Darkening `--surface-panel` from L89.8 to L85.0 drops `--danger` `#b3261e` to **4.08:1** — below AA for the form-error text it carries. Five consumers: `ScheduleForm`, `AccessHandoff`, `CaseStudiesGate`, `Admin` (×4).

**Fix:** darken to `#9c2015`. Measured across all four light grounds: 6.86 / 5.77 / 4.98 / **4.51** — worst case clears AA.

### 7.6 Off-token audit (completed)

Swept every `components/**/*.module.css` for hex literals. Seven files contain them:

| File | Verdict |
|---|---|
| `chrome/Footer.module.css` | **Must fix** — §7.4 |
| `stack/PlatformArchitecture.module.css` | **Must fix** — §7.2. The other two hits are benign: `#141d26` is inside a comment, `#000` is a `mask-image` alpha stop, not a visible colour |
| `range/Range.module.css` | **Dead code.** `Range.tsx` has zero importers — the homepage's `id="range"` comes from `components/ui/features-4.tsx`. Its 10 hardcoded colours are unreachable. Recommend deletion as separate cleanup; out of scope here |
| `chat/ChatWidget.module.css` | **Leave.** `#229ed9` is Telegram's brand blue — third-party marks are legitimately hardcoded |
| `posts/FeaturedPosts.module.css` | **Leave.** `#000` used only in shadow/mask alpha |
| `guide/guide.module.css` | **Flag.** Ad-hoc status colours `#2e8b57` green, `#c2504a` red, `#c28a2e` amber |
| `course/CourseSales*.module.css` | **Flag.** Same family — `#2e8b57`, `#1d6b40`, `#b3564d` |

The last two are worth naming: `#c28a2e` (amber) and `#2e8b57` (green) are decorative status colours sitting outside the token system. `#c28a2e` in particular is close enough to the new `--result` gold to read as a broken sibling rather than a deliberate second signal. Recommend folding them into tokens in a follow-up; not required for this rework to be correct.

---

## 8. Blast radius (verified by grep, not assumed)

| Token | Consumers | Files |
|---|---|---|
| `--accent-meta` | 60 | 12 files |
| `--on-panel` | 17 | 8 files |
| `--on-panel-soft` | 15 | 8 files |
| `--on-close-soft` | 14 | 6 files |
| `--on-close` | 8 | 6 files |
| `--surface-panel` | 8 | 8 files |
| `--surface-close` | 5 | Reply, ScheduleContact, ScheduleForm, CourseSales, LeadGenPage |
| `--on-panel-mute` | 3 | 2 files |
| `--surface-panel-alt` | 2 | Admin |
| `--surface-card` | 1 | Proof |
| `--heading-ink` | 1 | `global.css` |
| `--surface-footer`, `--on-footer` | **0** | dead |

**Consequence:** `--surface-close` and `--on-close*` are shared with `/schedule`, `/course` and `/lead-generation`. Flipping Reply to dark by redefining them *globally* would silently break those pages. The scoped mechanism in §6 is the only safe route.

**Pages affected by the re-hue:** `/` (homepage), `/schedule`, `/course`, `/lead-generation`, `/admin`, `/case-studies`.

---

## 9. Resulting page rhythm

| Section | Ground | L% | Seam step |
|---|---|---|---|
| World | `#fbfbff` | 98.9 | — |
| **Proof** | `#0f0a24` | 16.9 | **82.0** |
| Positioning | `#cbc8f4` | 85.0 | 68.0 |
| VideoTeaser | `#edecff` | 94.9 | 10.0 |
| History | `#dad8f9` | 89.4 | 5.5 |
| Features | `#fbfbff` | 98.9 | 9.5 |
| **Stack** | `#0f0a24` | 16.9 | **82.0** |
| FeaturedPosts | `#edecff` | 94.9 | 78.0 |
| **Reply** | `#0f0a24` | 16.9 | **78.0** |
| Footer | `#060315` | 12.1 | 4.9 |

Lightness spread: **12.2 → 86.8 points.** No seam below 3 points. Dark bands are 22% of page height.

---

## 10. Files touched

| File | Change |
|---|---|
| `styles/tokens.css` | Full palette replacement, both themes; new tokens; remove stale `--surface-card` comment |
| `styles/global.css` | `[data-ground="dark"]` scoped block; `.grained` blend-mode fix |
| `components/proof/Proof.tsx` | add `data-ground="dark"` |
| `components/stack/PlatformArchitecture.tsx` | add `data-ground="dark"` |
| `components/reply/Reply.tsx` | add `data-ground="dark"` |
| `components/stack/PlatformArchitecture.module.css` | replace hardcoded `#1c2430` card with tokens |
| `components/chrome/Footer.module.css` | tokenise **all eleven** declarations (5 colours) + 2 accent usages (§7.4) |
| `components/proof/Proof.module.css` | stat numbers → `var(--result)` |

---

## 11. Implementation order

1. Tokens — replace both theme blocks in `tokens.css`. Nothing visually correct yet; verify build only.
2. Scoped block + grain fix in `global.css`.
3. Footer tokenisation — all eleven declarations plus the two accent usages (§7.4). Verify in isolation before moving on; this is the step most likely to produce invisible text if done partially.
4. Flip Proof: `data-ground`, gold stats. Screenshot and verify.
5. Flip Stack: `data-ground`, de-hardcode the bento card. Screenshot and verify.
6. Flip Reply: `data-ground`. Verify `.spot` still reads.
7. Sweep the five secondary pages for regressions.

Each step is independently revertable.

## 12. Verification plan

- **Contrast:** re-run the OKLCH/WCAG script over the final token file. Gate: zero pairs below AA.
- **Visual:** screenshot `/`, `/schedule`, `/course`, `/lead-generation`, `/admin`, `/case-studies` at 375 / 900 / 1440, both themes. 24 screenshots, reviewed.
- **Seams:** re-measure adjacent-section lightness steps. Gate: none below 3 points.
- **Build:** `npx tsc --noEmit` and `npm run build` clean.
- **Regression watch:** the five non-homepage consumers of `--surface-close` / `--on-close*`.

## 13. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Pale grounds shift lavender → periwinkle | Low | Previewed and accepted; character change is mild |
| Five secondary pages regress | **High** | Scoped mechanism (§6); explicit screenshot sweep (§12) |
| Dark theme under-tested — it was never a considered pass | Medium | Lightness structure preserved exactly; only hue changes |
| Three dark bands read bottom-heavy | Low | Accepted deliberately; 885px light band between Stack and Reply |
| Gold misapplied to a light ground | Medium | Hard rule documented in `tokens.css`; gold fails at 1.41:1 so misuse is visually obvious |
| Footer tokenised partially → invisible text | **High** | All eleven declarations change in one commit (§7.4); step 3 verified in isolation |
| Other off-token hardcoded colours exist elsewhere | Resolved | Full audit completed — §7.6. Two files need fixing, one is dead code, four are benign or deferred |

## 14. Open questions

None blocking. The hero's 6,660px unanchored L99 run is a known, deliberate deferral (§3).
