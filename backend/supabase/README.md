# Database Migrations

Three migration files, run in order against your Supabase project.

## Files

| File | What it does |
|------|-------------|
| `001_initial_schema.sql` | Creates all tables, enums, indexes, triggers, seeds 17 units and 5 emergency contacts |
| `002_row_level_security.sql` | Enables RLS on every table, sets per-role read/write policies |
| `003_seed_data.sql` | Demo users, 20 services across all categories, 7 bookings, 3 stay records |

## How to run

### Option A — Supabase Dashboard (easiest)

1. Open your Supabase project → **SQL Editor**
2. Paste and run each file **in order**: 001 → 002 → 003
3. Check the **Table Editor** to confirm rows appear

### Option B — Supabase CLI

```bash
# Install the CLI if you haven't already
npm install -g supabase

# Login
supabase login

# Link to your project (find the ref in Project Settings → General)
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
supabase db push
```

### Option C — psql direct

```bash
psql "$DATABASE_URL" -f supabase/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/002_row_level_security.sql
psql "$DATABASE_URL" -f supabase/migrations/003_seed_data.sql
```

Your `DATABASE_URL` is in Supabase → Project Settings → Database → Connection string (URI).

## Seed login credentials

All seed users share the same password: **`Password123!`**

| Email | Role | Unit |
|-------|------|------|
| alice@example.com | Resident | 3 |
| bob@example.com | Resident | 7 |
| clara@example.com | Guest | 12 |
| david@example.com | Guest | — |
| esi@example.com | Agent | — |
| frank@example.com | Agent | — |
| admin@example.com | Admin | — |

## Notes

- **Migration 002** (RLS) uses a JWT `role` claim. Your NestJS service uses the **service key** (`SUPABASE_SERVICE_KEY`) which bypasses RLS — this is intentional and correct for server-side operations.
- The `occupant_id` on `units` and `unit_number` on `users` are kept in sync by the NestJS `StaysService`. The `units` table is the single source of truth for occupancy.
- Running `003_seed_data.sql` more than once will error on duplicate primary keys. Either truncate the tables first or skip it after the first run.
