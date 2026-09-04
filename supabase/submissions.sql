-- submissions: lead-capture rows from every form on the site that reaches
-- Sampath directly. Documents the actual production schema after the
-- 2026-09-03 migration that added 'schedule-call' to the source check and
-- the company_name column — both were missing from day one, so every
-- schedule-call submission had been silently failing (PGRST204 / check
-- constraint violation) until then. 'hire-form' and 'lane' are unused by any
-- current code path; kept for backward compatibility with old rows.
--
-- This file documents production; it was written after the fact, not applied
-- fresh. If recreating from scratch, run this once in the Supabase SQL editor.

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source = any (array['case-studies-gate', 'schedule-call', 'hire-form'])),
  name text,
  email text not null,
  company_domain text,
  company_name text,
  lane text check (lane = any (array['hiring', 'buying'])),
  phone text
);

-- RLS on, no policies: only the service-role key (used by the API routes)
-- can read or write this table.
alter table public.submissions enable row level security;
