-- schedule_payments: one row per paid second call (infrastructure setup)
-- booked from /schedule. Written by the on-site checkout's verify route
-- (primary path, full details) and, as a backup, by the Razorpay webhook
-- (payment.captured only carries the email/amount/currency, so name/phone
-- are null there).
--
-- Run once in the Supabase SQL editor for the production project. (Applied
-- 2026-09-03 with amount/currency from the start — this file documents that
-- schema, it does not need to be re-run.)

create table if not exists public.schedule_payments (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  phone text,
  company_name text,
  purpose text,
  slot text,
  payment_id text not null,
  amount numeric not null,
  currency text not null default 'USD',
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists schedule_payments_email_idx on public.schedule_payments (email);

-- Razorpay retries webhooks; this makes the grant idempotent per payment,
-- same as course_access_payment_id_key.
create unique index if not exists schedule_payments_payment_id_key
  on public.schedule_payments (payment_id);

-- RLS on, no policies: only the service-role key (used by the API routes)
-- can read or write this table. Same posture as public.course_access.
alter table public.schedule_payments enable row level security;
