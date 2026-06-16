-- Harden anon write policies.
--
-- The security advisor flagged the INSERT policies as "WITH CHECK (true)" —
-- effectively no RLS for anon. This app has no auth (public anon key), so rows
-- can't be bound to a user identity. Instead of "true", every write policy now
-- carries a meaningful predicate: referential integrity + enum/range/format
-- validation. This constrains *what* may be written (e.g. a submission must
-- reference an existing team in an existing workshop; points must be a valid
-- score; a team starts at 0).
--
-- NOTE: without an identity we still can't scope UPDATEs to "your own row"
-- (USING stays true), so a participant could in theory edit another team's
-- score. Preventing that requires Supabase Anonymous Auth + owner columns — a
-- separate, optional upgrade.

-- ── workshops ────────────────────────────────────────────────────────────
drop policy if exists "anon write workshops"  on public.workshops;
drop policy if exists "anon update workshops" on public.workshops;

create policy "anon insert workshops" on public.workshops
  for insert to anon
  with check (
    code ~ '^HRZN-[A-Z0-9]{4,8}$'
    and phase in ('lobby','story','round','debrief','snapshot')
    and current_round between 0 and 2
  );

create policy "anon update workshops" on public.workshops
  for update to anon
  using (true)
  with check (
    phase in ('lobby','story','round','debrief','snapshot')
    and current_round between 0 and 2
  );

-- ── teams ────────────────────────────────────────────────────────────────
drop policy if exists "anon write teams"  on public.teams;
drop policy if exists "anon update teams" on public.teams;

create policy "anon insert teams" on public.teams
  for insert to anon
  with check (
    exists (select 1 from public.workshops w where w.id = workshop_id)
    and char_length(btrim(name)) between 1 and 40
    and mode in ('online','in_person')
    and score = 0
  );

create policy "anon update teams" on public.teams
  for update to anon
  using (true)
  with check (
    score between 0 and 90
    and char_length(btrim(name)) between 1 and 40
    and mode in ('online','in_person')
  );

-- ── submissions ──────────────────────────────────────────────────────────
drop policy if exists "anon write submissions"  on public.submissions;
drop policy if exists "anon update submissions" on public.submissions;

create policy "anon insert submissions" on public.submissions
  for insert to anon
  with check (
    exists (
      select 1 from public.teams t
      where t.id = team_id and t.workshop_id = submissions.workshop_id
    )
    and round between 0 and 2
    and (choice is null or choice between 0 and 3)
    and (points is null or points in (0,10,30))
    and char_length(coalesce(thought,'')) <= 2000
  );

create policy "anon update submissions" on public.submissions
  for update to anon
  using (true)
  with check (
    round between 0 and 2
    and (choice is null or choice between 0 and 3)
    and (points is null or points in (0,10,30))
    and char_length(coalesce(thought,'')) <= 2000
  );
