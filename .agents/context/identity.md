# Identity, Dev Persona & Code Style

## Who is working on this
Solo dev (Prem, kanthaiyee@gmail.com) building a personal portfolio/marketing site for
Sampath Kumar (Pre-Sales Head, lead generation). Leans on the agent for the full stack:
scrollytelling motion (GSAP + custom rAF world engine), Next.js server components,
copy-to-UI translation from `SITE-CONTENT.md`, accessibility/perf verification, and
visual QA via Playwright/lab scripts.

## Response Conventions
- Visual/motion work must be verified by screenshot at 320/375/768/1024/1440/1920 before
  reporting done — `lab/*.mjs` scripts (Playwright-driven) are the existing pattern for this.
- Design decisions (palette, section structure, copy) are separate from raw content facts.
  `SITE-CONTENT.md` is facts-only, "carries no design intent" — never read it as a UI brief.
- Accessibility is a hard bar, not a nice-to-have: axe-core 0 violations, visible keyboard
  focus, skip link, `prefers-reduced-motion` honoured globally — these are already achieved
  and must not regress.

## Code Style Rules
- Components are server components by default; the page ships no client-side interactivity
  unless a component explicitly needs it (world/motion pieces are the exception).
- One folder per page area under `components/<area>/`, each with a colocated CSS module.
- Design tokens live only in `styles/tokens.css` — never hardcode a palette value in a
  component or module.
- All page copy is typed and centralized in `lib/content.ts`, not inlined in JSX.
