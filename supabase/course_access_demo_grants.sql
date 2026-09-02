-- Demo access grants: short, admin-issued windows onto the same course.
--
-- Context: Sampath hands a hiring company a link that opens the course for a
-- few hours. That is a credential lent to a stranger, not a purchase, so the
-- clock model changes for every row:
--
--   access_seconds  the duration to apply, chosen per grant
--   started_at      when the recipient actually opened it (NULL = never)
--   expires_at      the deadline, materialised at first open (NULL until then)
--
-- Paid enrollments start at payment, so all three are set at insert and their
-- behaviour is unchanged. Demo grants stay dormant until someone opens them.
--
-- Run once in the Supabase SQL editor. See course_access.sql for the original
-- table. The three statement groups below MUST run in order: the backfill sits
-- between the ADD COLUMNs and the ADD CONSTRAINTs because every existing paid
-- row violates course_access_clock_check until started_at is populated.

-- 1. Columns ----------------------------------------------------------------

alter table public.course_access
  add column if not exists access_seconds integer,
  add column if not exists started_at     timestamptz,
  add column if not exists redeem_by      timestamptz,
  add column if not exists revoked_at     timestamptz,
  add column if not exists granted_by     text,
  add column if not exists label          text,
  add column if not exists source         text not null default 'payment',
  add column if not exists sections_seen  jsonb  not null default '{}'::jsonb,
  add column if not exists last_seen_at   timestamptz;

comment on column public.course_access.access_seconds is
  'Window length. Read at exactly one moment — the first-open stamp. Audit-only after that; expires_at is authoritative once started.';
comment on column public.course_access.started_at is
  'When the recipient opened the course. NULL means the grant is dormant and its clock has not begun.';
comment on column public.course_access.redeem_by is
  'Claim deadline for a dormant grant, so an unopened link does not stay live forever. NULL means it never lapses.';
comment on column public.course_access.revoked_at is
  'Soft revoke. Rows are never deleted — deleting one breaks grantCourseAccess idempotency and a webhook retry would silently re-grant.';
comment on column public.course_access.label is
  'Company name. The primary handle in the admin list — a demo grant often has no email at all.';
comment on column public.course_access.sections_seen is
  'Per-section reading record, keyed by GuideSection.id: { "six-step-process": { "first": "<iso>", "seconds": 240 } }.';

-- A demo link is usually pasted into a chat, so there is no email to record.
alter table public.course_access alter column email drop not null;

-- 2. Backfill ---------------------------------------------------------------
-- Existing rows are all paid enrollments whose clock started at payment.

update public.course_access
   set started_at     = paid_at,
       access_seconds = greatest(900, extract(epoch from (expires_at - paid_at))::int)
 where started_at is null;

alter table public.course_access
  alter column access_seconds set not null,
  alter column expires_at     drop not null;

-- 3. Constraints ------------------------------------------------------------
-- `add constraint` has no IF NOT EXISTS; the block makes the script re-runnable.

do $$ begin
  alter table public.course_access
    add constraint course_access_source_check
      check (source in ('payment', 'demo'));

  -- 15 minutes to a year. Guards against a bad custom duration reaching the DB.
  alter table public.course_access
    add constraint course_access_seconds_check
      check (access_seconds between 900 and 31536000);

  -- The clock invariant: a grant is either dormant (both null) or started
  -- (both set). No other combination is representable.
  alter table public.course_access
    add constraint course_access_clock_check
      check ((started_at is null) = (expires_at is null));

  -- Only demo rows may omit the email; a paid row without one is a bug.
  alter table public.course_access
    add constraint course_access_payment_email_check
      check (source <> 'payment' or email is not null);
exception when duplicate_object then null; end $$;

-- Admin list sorts by recency and filters by source.
create index if not exists course_access_source_created_idx
  on public.course_access (source, created_at desc);

-- 4. Privileges -------------------------------------------------------------
-- RLS is already enabled with zero policies, which is what blocks the Data API.
-- Supabase also grants table privileges to anon/authenticated by default, so a
-- future accidental policy would be live the moment it was created. Revoking
-- the privileges means a policy alone is no longer enough to expose these rows.
-- If a policy is ever added deliberately, the matching grant must be added here.

revoke all on public.course_access from anon, authenticated;
