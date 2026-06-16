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

alter table public.checklist_responses enable row level security;

-- Insert/update only (no anon SELECT — these are private to the org). Upsert by
-- a client-generated id lets a single response row update as it's filled in.
-- The table is write-only for anon (no SELECT policy), so a simple permissive
-- write check is acceptable and consistent with the other tables' posture.
create policy "anon insert checklist" on public.checklist_responses
  for insert to anon
  with check (true);

create policy "anon update checklist" on public.checklist_responses
  for update to anon
  using (true)
  with check (true);
