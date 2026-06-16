# Supabase backend — Horizon House workshops

Project: **Horizon House** (`vsxgesmejxkiqwqsaeyi`, region `us-east-2`).

The app talks to Supabase only for realtime multi-team workshops. Without the
env vars set (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) it runs in
local-only mode.

## Tables

- `workshops` — one row per facilitator session (`code`, `phase`, `current_round`)
- `teams` — registered teams (`name`, `mode`, `score`) tied to a workshop
- `submissions` — one row per team per round (`choice`, `points`, `thought`)
- `checklist_responses` — Financial Health Snapshot answers + score + top
  priorities (lead capture). Write-only for anon: no SELECT policy, so
  responses are private — read them via the dashboard / service role.

All three are in the `supabase_realtime` publication.

## Applying migrations

Migrations live in `supabase/migrations/`. Apply them with the Supabase CLI:

```bash
supabase link --project-ref vsxgesmejxkiqwqsaeyi
supabase db push
```

Or paste a migration's SQL into the Supabase dashboard → SQL Editor and run it.

## Security model

There is **no auth** — the client uses the public anon/publishable key. RLS is
enabled on all tables.

- **Writes** are constrained by meaningful predicates (referential integrity +
  enum/range/format validation) rather than `WITH CHECK (true)` — see
  `20260616013700_harden_anon_write_policies.sql`.
- **Reads are intentionally open** (`USING (true)`), and so are the `USING`
  clauses on UPDATE/DELETE. This is a deliberate, accepted trade-off, not an
  oversight (see below).

### Accepted posture: open reads

The Supabase security advisor flags the SELECT/UPDATE/DELETE policies as
"unrestricted access". For this app that is **by design** and accepted:

- Joining by code requires reading a workshop you don't own; the live
  scoreboard requires reading *other* teams in your workshop. With no identity,
  RLS has nothing to scope on, so any non-`true` read predicate would break
  joining or the scoreboard.
- The data is **ephemeral and non-sensitive** — team names and game choices for
  a training exercise. No PII, no credentials, nothing of lasting value.

The residual risk is that someone who extracts the public anon key could read or
tamper with workshop rows across sessions. For a throwaway workshop scoreboard
that impact is negligible, so these advisor entries are **acknowledged and left
as intended**. (In the dashboard, open each finding under Advisors → Security to
review/dismiss it.)

### If you ever need true isolation

To fully scope reads/writes and clear the advisor (e.g. if this project is
reused for something with real data), enable **Supabase Anonymous Auth**:

1. Turn on "Allow anonymous sign-ins" in Authentication settings.
2. `supabase.auth.signInAnonymously()` on app load.
3. Add `created_by uuid not null default auth.uid()` to `workshops` and `teams`.
4. Move join/submit to `SECURITY DEFINER` RPCs, and scope reads to
   "workshops you've joined" via a definer helper (to avoid policy recursion):
   `using (workshop_id in (select app_my_workshops()))`, with workshop SELECT as
   `created_by = auth.uid()`.

