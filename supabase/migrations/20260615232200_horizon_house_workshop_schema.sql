-- Horizon House: realtime workshop schema
-- Ephemeral, no-auth workshop game. Data is non-sensitive (team names + game
-- choices). RLS is enabled; write policies are hardened in a later migration.

create table if not exists public.workshops (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  phase          text not null default 'lobby',      -- lobby | story | round | debrief | snapshot
  current_round  int  not null default 0,            -- 0-indexed round
  round_revealed boolean not null default false,
  created_at     timestamptz not null default now()
);

create table if not exists public.teams (
  id           uuid primary key default gen_random_uuid(),
  workshop_id  uuid not null references public.workshops(id) on delete cascade,
  name         text not null,
  mode         text not null check (mode in ('online', 'in_person')),
  score        int  not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  workshop_id  uuid not null references public.workshops(id) on delete cascade,
  team_id      uuid not null references public.teams(id) on delete cascade,
  round        int  not null,                         -- 0-indexed
  choice       int,                                   -- selected card index 0-3
  points       int,                                   -- 0 | 10 | 30
  thought      text,
  created_at   timestamptz not null default now(),
  unique (team_id, round)
);

create index if not exists teams_workshop_idx       on public.teams(workshop_id);
create index if not exists submissions_workshop_idx on public.submissions(workshop_id);
create index if not exists submissions_round_idx     on public.submissions(workshop_id, round);

-- Enable RLS. Read access is open (anyone with a code reads the scoreboard);
-- write policies are added permissively here and tightened in the next migration.
alter table public.workshops   enable row level security;
alter table public.teams       enable row level security;
alter table public.submissions enable row level security;

create policy "anon read workshops"   on public.workshops   for select to anon using (true);
create policy "anon write workshops"  on public.workshops   for insert to anon with check (true);
create policy "anon update workshops" on public.workshops   for update to anon using (true) with check (true);

create policy "anon read teams"   on public.teams   for select to anon using (true);
create policy "anon write teams"  on public.teams   for insert to anon with check (true);
create policy "anon update teams" on public.teams   for update to anon using (true) with check (true);
create policy "anon delete teams" on public.teams   for delete to anon using (true);

create policy "anon read submissions"   on public.submissions   for select to anon using (true);
create policy "anon write submissions"  on public.submissions   for insert to anon with check (true);
create policy "anon update submissions" on public.submissions   for update to anon using (true) with check (true);

-- Realtime: broadcast row changes for these tables.
alter table public.workshops   replica identity full;
alter table public.teams       replica identity full;
alter table public.submissions replica identity full;

alter publication supabase_realtime add table public.workshops;
alter publication supabase_realtime add table public.teams;
alter publication supabase_realtime add table public.submissions;
