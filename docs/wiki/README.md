# Port 2.0 — Wiki

Personal site for Sampath Kumar (Pre-Sales Head, lead generation, Coimbatore IN).
Next.js App Router, server components, GSAP + a custom canvas "world" engine.

This wiki is the **human front door**. It stays thin on purpose: it orients you, then
points at the real source. Deep technical detail lives in `.agents/` (the agent
knowledge base) and is not copied here — copying it means maintaining every fact twice.

## Start here

| Page | What it covers |
| --- | --- |
| [getting-started.md](getting-started.md) | Clone, install, env vars, run the dev server, common setup errors |
| [architecture.md](architecture.md) | One-screen map of how the app is put together, with links into `.agents/` |
| [contributing.md](contributing.md) | Branch and commit rules, the git hooks, what runs before push |
| [glossary.md](glossary.md) | Project vocabulary — "Cold Open", envelope rail, Client A–F, the world engine |
| [faq.md](faq.md) | Recurring questions and quick troubleshooting |

## The other sources this wiki points at

- **[README.md](../../README.md)** — design direction ("Cold Open"), design tokens, run commands, the verified quality bars
- **[SITE-CONTENT.md](../../SITE-CONTENT.md)** — raw factual copy about Sampath. Facts only, no design intent. Never read as a UI brief.
- **`.agents/context/stack-and-rules.md`** — full tech stack, hard invariants, complete file map
- **`.agents/context/subsystem-notes.md`** — load-bearing gotchas the code cannot tell you (world engine reversibility, the untyped ScrollFX contract, the case-studies gate is not security)
- **`.agents/decisions/log.md`** — why modules were built or dropped, in date order
- **`.agents/projects/active-backlog.md`** — current backlog and known tech debt

## Maintaining this wiki

- Keep pages short. If a page starts re-explaining the stack or the file map, delete that
  part and link to `.agents/` instead.
- A fact belongs in exactly one place. This wiki owns onboarding, contribution flow, and
  vocabulary. It does not own architecture truth, design decisions, or the roadmap.
- When you change something the wiki describes (env vars, scripts, hooks), update the
  relevant page in the same commit.
