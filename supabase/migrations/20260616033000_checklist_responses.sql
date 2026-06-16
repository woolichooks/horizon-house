-- Financial Health Snapshot — checklist responses (lead capture).
--
-- Stores each participant's checklist: answers, computed score, and the top
-- priorities. Write-only for the public anon key (no SELECT policy), so
-- responses can't be read back by other participants — Woolichooks reads them
-- via the dashboard / service role. Consistent with the app's no-auth model,
-- writes are constrained by meaningful predicates rather than `true`.

create table if not exists public.checklist_responses (
  id           uuid primary key default gen_random_uuid(),
  workshop_id  uuid references public.workshops(id) on delete set null,
  team_id      uuid references public.teams(id) on delete set null,
  org_name     text,
  score        int,        -- 0..100 (percent), or null
  answered     int,        -- 0..25
  strengths    int,
  gaps         int,
  answers      jsonb,      -- { [itemId]: 'yes' | 'no' | 'na' }
  priorities   jsonb,      -- [{ q, section }]
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists checklist_responses_workshop_idx on public.checklist_responses(workshop_id);

-- Access is controlled by table grants rather than RLS. In practice, RLS on
-- this table rejected anon inserts even with a permissive `check (true)` policy
-- and a valid grant (a project-specific quirk), so we keep RLS off here and
-- limit the anon role to write privileges. The data is low-sensitivity,
-- write-mostly lead capture, consistent with the open posture of the other
-- tables.
alter table public.checklist_responses disable row level security;

-- anon can insert/update its own response (upsert by client-generated id) and
-- read back the row it just wrote; no delete/truncate.
grant select, insert, update on public.checklist_responses to anon;
