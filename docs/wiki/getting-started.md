# Getting Started

## Requirements

- Node `>=20.9.0` (Next.js 16 `engines` requirement; Node 22 is what's in use)
- npm (the repo commits `package-lock.json`)
- [lefthook](https://github.com/evilmartians/lefthook) for git hooks — installed
  separately (e.g. `brew install lefthook`), then `lefthook install` once per clone

## First run

```bash
git clone https://github.com/ChillandBuild/Port-2.0.git
cd Port-2.0
npm install
npm run dev        # http://localhost:3000
```

The homepage renders with no environment variables set. The form-handling backend
(see below) is the only part that needs configuration, and it degrades gracefully
when unset.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Next dev server on :3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |

There is no unit test runner. Visual and accessibility checks are ad-hoc
Playwright scripts under `lab/` — see [faq.md](faq.md).

## Environment variables

Copy the keys below into `.env.local`. Everything here is for the shared submissions
endpoint (`app/api/submissions/route.ts`) that backs the `/hire` form and the
case-studies gate. **Until these are set, the route still returns success to the
client but silently skips the database write and the email.**

| Key | Purpose | Where to get it |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key for inserting into the `submissions` table. Bypasses RLS. Never logged, never fetched by an agent. | Supabase dashboard → Project Settings → API → `service_role` secret |
| `RESEND_API_KEY` | Resend API key for the notification email | Resend dashboard |
| `RESEND_FROM` | From-address for the notification email | Your verified Resend sending domain (sandbox mode only delivers to the Resend account owner) |
| `HIRE_NOTIFY_TO` | Inbox that receives hire-form and gate submissions | Set to Sampath's real inbox before deploying |
| `KIE_AI_API_KEY` | Used by asset-generation tooling, not the running site | kie.ai |

`VERCEL_OIDC_TOKEN` is written by the Vercel CLI — leave it alone.

## Common setup errors

| Symptom | Cause / fix |
| --- | --- |
| Form submits "successfully" but nothing arrives in Supabase or email | `SUPABASE_*` not set. The route no-ops the write by design. Set the keys and restart the dev server. |
| Email never arrives even with keys set | Resend is in sandbox mode until a sending domain is verified — it only delivers to the Resend account owner's own address. |
| `npm run build` fails on a type error | The pre-push hook runs `tsc --noEmit && npm run build`. Fix the type error; the hook is not the problem. |
| Motion looks frozen | Check your OS "reduce motion" setting — the site honours `prefers-reduced-motion` globally and will disable scroll animation and the world loop. |
