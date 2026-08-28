# FAQ

### Where do I change the words on the page?

`lib/content.ts` — every rendered string is typed there. Not in JSX, not in
`SITE-CONTENT.md` (that file is raw facts about Sampath, not the site's wording).

### Where do I change a colour, font size, or spacing value?

`styles/tokens.css`. It is the only place palette / type / spacing values are allowed
to live. If you find yourself typing a hex code or a pixel value in a component or
module, stop and add a token instead.

### Why are there two nearly identical grey tokens?

`--color-zinc` and `--color-zinc-inv`. A single grey cannot hit the 4.5:1 contrast
minimum against both the light ground and the dark ground at small sizes. Do not
collapse them.

### Is there a test suite?

No automated one. Verification is:

- ad-hoc Playwright scripts under `lab/` for screenshots at the six breakpoints
- one-off axe-core runs for accessibility

Treat `lab/` scripts as historical — see [glossary.md](glossary.md). Promoting an
`a11y`-style script into a real CI check is on the backlog
(`.agents/projects/active-backlog.md`).

### My form submission "succeeded" but nothing happened. Bug?

Not a bug. The submissions endpoint no-ops the database write and the email when the
`SUPABASE_*` / `RESEND_*` env vars are unset, and still returns success to the client.
Set the keys (see [getting-started.md](getting-started.md)) and restart the dev server.

### Email still doesn't arrive with the keys set.

Resend runs in sandbox mode until a sending domain is verified. In sandbox it only
delivers to the Resend account owner's own address. Verify a domain, or test with that
address.

### An animation stopped working but the build passes.

Most likely a renamed or dropped `data-*` attribute. `components/motion/ScrollFX.tsx`
reads section animations off attributes like `data-reveal`, `data-count`, `data-pan`,
`data-spine`, `data-drift`. Nothing type-checks them — a rename fails silently. Grep
`ScrollFX.tsx` and compare.

### The canvas scene looks wrong after my change.

The world is a pure function of scroll position. Test by scrolling **up** as well as
down — state must reverse cleanly (sends un-send, replies un-arrive). Any change to how
scroll offset is read can break reversibility without an error.

### Everything is frozen / no motion at all.

The site honours `prefers-reduced-motion` globally. Check your OS "reduce motion"
setting — when it is on, scroll animation and the world loop are intentionally disabled.

### Why is there an empty `true/` directory at the repo root?

A stray from a shell redirect (`... > true`). Safe to delete — confirm first. Tracked
in `.agents/projects/active-backlog.md`.

### What pages still need building?

A Story page and a custom 404 (`app/not-found.tsx`). Everything else has shipped.
`README.md` lines 61–62 still list more as unbuilt — that text is stale.

### Where's the "why" behind an architectural choice?

`.agents/decisions/log.md`, in date order. For traps that the code cannot tell you,
`.agents/context/subsystem-notes.md`.
