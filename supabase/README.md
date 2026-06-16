# Supabase backend — Horizon House workshops

Project: **Horizon House** (`vsxgesmejxkiqwqsaeyi`, region `us-east-2`).

The app talks to Supabase only for realtime multi-team workshops. Without the
env vars set (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) it runs in
local-only mode.

## Tables

- `workshops` — one row per facilitator session (`code`, `phase`, `current_round`)
- `teams` — registered teams (`name`, `mode`, `score`) tied to a workshop
- `submissions` — one row per team per round (`choice`, `points`, `thought`)

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
enabled on all tables. Reads are open (anyone with a code reads the
scoreboard). Writes are constrained by meaningful predicates (referential
integrity + enum/range/format validation) rather than `WITH CHECK (true)` — see
`20260616013700_harden_anon_write_policies.sql`.

Because there is no identity, UPDATEs can't be scoped to "your own row". If you
need to prevent one team from editing another's score, enable **Supabase
Anonymous Auth**, add an owner column (`created_by uuid default auth.uid()`),
and change the `using (...)` clauses to `created_by = auth.uid()`.
