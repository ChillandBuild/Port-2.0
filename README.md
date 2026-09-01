# Sampath Kumar — Port 2.0

Personal site for Sampath Kumar, Pre Sales Head and Lead Generation lead (Coimbatore, IN).

## Design direction: Cold Open

The site is the outbound message. Sampath opens conversations for a living, so the page
opens one — an envelope rail carries real facts across the top, the headline lands on
*hello*, and a drafted cold open sits where a portfolio would normally put a headshot.

Every section header is framed as a message field (`Re: how the pipeline runs`), so the
structural device encodes something true about the content rather than decorating it.

| Token | Value | Role |
| --- | --- | --- |
| `--color-ink` | `#0b1b2a` | Primary text, dark grounds |
| `--color-bone` | `#e9ebe6` | Page ground |
| `--color-paper` | `#f6f7f4` | Raised surfaces (message, cards, chart) |
| `--color-ox` | `#7c2434` | The single accent — one voice, used sparingly |
| `--color-zinc` | `#59656f` | Muted text on light grounds |
| `--color-zinc-inv` | `#8c99a2` | Muted text on dark grounds |

Two muted tokens exist because a single grey cannot clear 4.5:1 against both `--color-bone`
and `--color-ink` at 11px. Do not collapse them.

**Type.** Bricolage Grotesque (display, 700/800) · Inter Tight (body, 400) ·
DM Mono (metadata rails and labels, 400) · Newsreader italic 300, which carries exactly
one word: *hello.*

All tokens live in [styles/tokens.css](styles/tokens.css). Nothing hardcodes a palette value.

## Structure

```
app/                 layout (fonts, metadata), the homepage route, and the site icons
components/<area>/   one folder per page area, each with a colocated CSS module
lib/content.ts       every string the page renders, typed
styles/              tokens, shared type primitives, global reset
```

The favicon is the wordmark cropped to one letter — a flat `S.` traced from the real
Bricolage outline, recolouring itself for dark browser chrome. Files follow Next's
metadata conventions (`app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`,
`app/manifest.ts`); regeneration is documented in
[.agents/context/subsystem-notes.md](.agents/context/subsystem-notes.md).

Components are server components by default. Client code is limited to the motion
layer (`components/motion/ScrollFX.tsx`, the canvas world, the rotating greeting) and
the form handlers on `/hire` and the case-studies gate.

## Running it

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## The paid course (`/course`)

The lead-generation course is sold off `/lead-generation`, delivered behind a
server-side paywall at `/course`, and valid for 30 days from payment.

- **Payments** — Razorpay Payment Page (`RAZORPAY_PAYMENT_PAGE_URL`, international
  enabled in the Razorpay dashboard). Its `payment.captured` webhook hits
  `/api/webhooks/razorpay`; the HMAC signature is verified against
  `RAZORPAY_WEBHOOK_SECRET` before anything is trusted.
- **Access** — the webhook writes an `email` + `access_code` + `expires_at`
  (`paid_at` + 30 days) row to the Supabase `course_access` table
  ([supabase/course_access.sql](supabase/course_access.sql) — run once in the
  dashboard), and Resend emails the buyer their code.
- **Gating** — `app/lead-generation/page.tsx` re-validates the httpOnly access
  cookie against Supabase on every request, so expiry needs no scheduled job.
  Fail-closed: if Supabase is unreachable, the gate stays shut. The page never
  gates in a layout — App Router renders page children even when a layout
  doesn't mount them, which would leak content into the RSC payload.
- **Content** — the full document lives in
  [content/lead-generation.md](content/lead-generation.md) (source of record)
  and is transcribed into typed structured data in `lib/guide/`; the
  documentation experience (sticky nav, search, timeline, tables, metric
  cards) is rendered by `components/guide/`. `/course` redirects there.

Required env vars for the course (in addition to the Supabase + Resend ones):
`RAZORPAY_PAYMENT_PAGE_URL`, `RAZORPAY_WEBHOOK_SECRET`, and optionally
`NEXT_PUBLIC_SITE_URL` (used in the access-code email).

## Verified

- Zero horizontal overflow at 320 / 375 / 768 / 1024 / 1440 / 1920
- axe-core (WCAG 2.1 A + AA): 0 violations
- Visible keyboard focus, skip link, `prefers-reduced-motion` honoured globally
- Transfer weight: ~133 kB JS, ~97 kB fonts, ~6 kB CSS (gzipped)

## Content

Source copy is in [SITE-CONTENT.md](SITE-CONTENT.md). Employers are anonymised as
Client A–F, matching the source. Case Studies, Schedule, Lead Generation, Terms,
Privacy and Refunds have shipped; a Story page and a custom 404 remain unbuilt.

Contributor and onboarding docs live in [docs/wiki/](docs/wiki/).
