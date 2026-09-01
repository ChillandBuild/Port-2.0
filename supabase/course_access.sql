-- course_access: one row per paid course enrollment.
-- Created by the Razorpay webhook when a payment.captured event arrives.
-- Access is valid from paid_at until expires_at (paid_at + 30 days); the
-- course layout re-checks expires_at on every request, so no cron job is
-- needed to expire access.
--
-- Run once in the Supabase dashboard (SQL editor) for the production project.

create table if not exists public.course_access (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  access_code text not null unique,
  payment_id text,
  paid_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists course_access_email_idx on public.course_access (email);
create index if not exists course_access_expires_idx on public.course_access (expires_at);

-- Razorpay retries webhooks; this makes the grant idempotent per payment.
create unique index if not exists course_access_payment_id_key
  on public.course_access (payment_id)
  where payment_id is not null;

-- RLS on, no policies: only the service-role key (used by the API routes)
-- can read or write this table. Same posture as public.submissions.
alter table public.course_access enable row level security;
