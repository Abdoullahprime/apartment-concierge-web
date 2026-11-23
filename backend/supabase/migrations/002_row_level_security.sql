-- ============================================================
-- Migration 002 — Row-Level Security
-- Enforces the permission rule from the brief:
--   "A resident or guest can only ever read and write their
--    own bookings and their own stay. Agents and admins act
--    on anyone's."
-- The NestJS service key bypasses RLS for server-side ops.
-- These policies protect direct API / client-side access.
-- ============================================================

alter table users          enable row level security;
alter table bookings       enable row level security;
alter table stay_records   enable row level security;
alter table units          enable row level security;
alter table services       enable row level security;
alter table emergency_contacts enable row level security;

-- ============================================================
-- Helper: get the calling user's role from their JWT claim
-- ============================================================

create or replace function auth_role()
returns text language sql stable as $$
  select coalesce(
    current_setting('request.jwt.claims', true)::json->>'role',
    'anon'
  );
$$;

create or replace function auth_uid()
returns uuid language sql stable as $$
  select (
    current_setting('request.jwt.claims', true)::json->>'sub'
  )::uuid;
$$;

-- ============================================================
-- USERS
-- ============================================================

-- Agents and admins can read all users
create policy "agents_admins_read_users" on users
  for select using (auth_role() in ('agent', 'admin'));

-- Residents and guests can read only their own record
create policy "users_read_own" on users
  for select using (id = auth_uid());

-- Only admins can insert / update / delete users
create policy "admin_write_users" on users
  for all using (auth_role() = 'admin');

-- ============================================================
-- SERVICES
-- ============================================================

-- Everyone (including unauthenticated) can read active services
create policy "anyone_read_active_services" on services
  for select using (active = true);

-- Agents and admins can read all services (including inactive)
create policy "agents_admins_read_all_services" on services
  for select using (auth_role() in ('agent', 'admin'));

-- Only admins can write services
create policy "admin_write_services" on services
  for all using (auth_role() = 'admin');

-- ============================================================
-- BOOKINGS
-- ============================================================

-- Residents / guests can read only their own bookings
create policy "users_read_own_bookings" on bookings
  for select using (
    auth_role() in ('resident', 'guest') and user_id = auth_uid()
  );

-- Residents / guests can create bookings for themselves
create policy "users_create_own_bookings" on bookings
  for insert with check (
    auth_role() in ('resident', 'guest') and user_id = auth_uid()
  );

-- Agents and admins can read all bookings
create policy "agents_admins_read_bookings" on bookings
  for select using (auth_role() in ('agent', 'admin'));

-- Agents and admins can update booking status
create policy "agents_admins_update_bookings" on bookings
  for update using (auth_role() in ('agent', 'admin'));

-- ============================================================
-- STAY RECORDS
-- ============================================================

-- Residents / guests can read only their own stay history
create policy "users_read_own_stays" on stay_records
  for select using (
    auth_role() in ('resident', 'guest') and user_id = auth_uid()
  );

-- Agents and admins can read all stay records
create policy "agents_admins_read_stays" on stay_records
  for select using (auth_role() in ('agent', 'admin'));

-- Only agents and admins can write stay records
create policy "agents_admins_write_stays" on stay_records
  for all using (auth_role() in ('agent', 'admin'));

-- ============================================================
-- UNITS
-- ============================================================

-- Everyone can read units (needed for free-unit lists)
create policy "anyone_read_units" on units
  for select using (true);

-- Only agents and admins can update units (assign occupant)
create policy "agents_admins_write_units" on units
  for update using (auth_role() in ('agent', 'admin'));

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================

-- Everyone can read emergency contacts
create policy "anyone_read_emergency" on emergency_contacts
  for select using (true);
