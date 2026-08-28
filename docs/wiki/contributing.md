# Contributing

## Branching

Commit directly to `main`. No feature branches unless there is a specific reason to
isolate the work.

## Commit messages

Conventional-commits style:

```
<type>: <short description>

<optional body>
```

Types in use: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

## Git hooks (lefthook)

`lefthook.yml` wires two hooks. lefthook is **not** an npm dependency here — install it
on your machine (e.g. `brew install lefthook`) and run `lefthook install` once in the
clone to write `.git/hooks/`.

| Hook | Runs | On |
| --- | --- | --- |
| `pre-commit` | `npx eslint {staged_files}` | staged `.ts .tsx .js .jsx` |
| `pre-push` | `npx tsc --noEmit && npm run build` | every push |

A failing pre-push means the production build or the type check is broken. Fix the
code, not the hook.

## Before you push — checklist

- [ ] `npm run lint` is clean
- [ ] `npm run build` succeeds
- [ ] No hardcoded palette / spacing values — new styling goes through `styles/tokens.css`
- [ ] New copy is in `lib/content.ts`, not inline in JSX
- [ ] New components are server components unless they genuinely need the browser
- [ ] Any new motion has a `prefers-reduced-motion` fallback path
- [ ] Visual/motion changes screenshotted at 320 / 375 / 768 / 1024 / 1440 / 1920
      (use a `lab/*.mjs` Playwright script — that is the existing pattern)
- [ ] axe-core still reports 0 violations on pages you touched

## Editing content vs editing design

`SITE-CONTENT.md` is **facts only**. A change there is not a licence to also change
layout, section structure, or headlines — those are separate design decisions made in
`lib/content.ts` and the component tree. Keep the two changes in separate commits when
both are needed.

## Touching a `data-*` animation attribute

`components/motion/ScrollFX.tsx` reads section animation intent from `data-*`
attributes (`data-reveal`, `data-count`, `data-pan`, `data-spine`, `data-drift`, …).
Nothing type-checks these. Rename or drop one in a component and the animation dies
with no build error and no console warning. Grep `ScrollFX.tsx` before changing any
`data-*` attribute in a section.
