-- ============================================================
-- Migration 001 — Initial schema
-- Apartment Concierge
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('resident', 'guest', 'agent', 'admin');

create type booking_status as enum (
  'pending', 'confirmed', 'completed', 'cancelled', 'rejected'
);

create type service_category as enum (
  'restaurants', 'vehicle_hire', 'private_chefs', 'co_working',
  'room_service', 'hospitals', 'attractions', 'events',
  'government_offices', 'emergency'
);

-- ============================================================
-- UNITS  (fixed set of 17)
-- ============================================================

create table units (
  number       integer primary key check (number between 1 and 17),
  occupant_id  uuid,          -- FK added after users table
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Seed all 17 units
insert into units (number) values
  (1),(2),(3),(4),(5),(6),(7),(8),(9),
  (10),(11),(12),(13),(14),(15),(16),(17);

-- ============================================================
-- USERS
-- ============================================================

create table users (
  id                  uuid primary key default gen_random_uuid(),
  name                text        not null,
  email               text        not null unique,
  password_hash       text        not null,
  phone               text,
  role                user_role   not null,
  -- resident / guest fields
  unit_number         integer     references units(number) on delete set null,
  check_in_date       date,
  expected_check_out  date,
  -- agent / admin fields
  employee_id         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Now add the FK from units back to users
alter table units
  add constraint fk_units_occupant
  foreign key (occupant_id) references users(id) on delete set null;

create index idx_users_email  on users(email);
create index idx_users_role   on users(role);
create index idx_users_unit   on users(unit_number);

-- ============================================================
-- SERVICES
-- ============================================================

create table services (
  id          uuid primary key default gen_random_uuid(),
  name        text              not null,
  description text              not null default '',
  category    service_category  not null,
  features    text[]            not null default '{}',
  contact     text,
  active      boolean           not null default true,
  created_at  timestamptz       not null default now(),
  updated_at  timestamptz       not null default now()
);

create index idx_services_category on services(category);
create index idx_services_active   on services(active);

-- ============================================================
-- BOOKINGS
-- ============================================================

create table bookings (
  id            uuid primary key default gen_random_uuid(),
  -- Denormalised at creation time (intentional — survives renames/deletes)
  user_id       uuid              not null references users(id) on delete cascade,
  user_name     text              not null,
  service_id    uuid              references services(id) on delete set null,
  service_name  text              not null,
  category      service_category  not null,
  -- Booking details
  date          date              not null,
  time          text              not null,
  notes         text,
  quantity      integer           not null default 1 check (quantity >= 1),
  status        booking_status    not null default 'pending',
  -- Audit
  handled_by    uuid              references users(id) on delete set null,
  created_at    timestamptz       not null default now(),
  updated_at    timestamptz       not null default now()
);

create index idx_bookings_user_id   on bookings(user_id);
create index idx_bookings_status    on bookings(status);
create index idx_bookings_date      on bookings(date);
create index idx_bookings_category  on bookings(category);
create index idx_bookings_created   on bookings(created_at);

-- ============================================================
-- STAY RECORDS  (written on check-out; source of truth for history)
-- ============================================================

create table stay_records (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid    not null references users(id) on delete cascade,
  unit_number  integer not null references units(number),
  check_in     date    not null,
  check_out    date    not null,
  created_at   timestamptz not null default now(),
  constraint chk_checkout_after_checkin check (check_out > check_in)
);

create index idx_stay_records_user    on stay_records(user_id);
create index idx_stay_records_unit    on stay_records(unit_number);
create index idx_stay_records_checkin on stay_records(check_in);

-- ============================================================
-- EMERGENCY CONTACTS  (static list, not editable in-app)
-- ============================================================

create table emergency_contacts (
  id      uuid primary key default gen_random_uuid(),
  name    text not null,
  number  text not null,
  icon    text not null default '🚨'
);

insert into emergency_contacts (name, number, icon) values
  ('Ambulance',         '911',          '🚑'),
  ('Police',            '999',          '👮'),
  ('Fire Brigade',      '998',          '🚒'),
  ('Nearest Hospital',  '+1-800-HOSP',  '🏥'),
  ('Building Hotline',  '+1-800-BLDG',  '📞');

-- ============================================================
-- updated_at trigger  (auto-stamps every write)
-- ============================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_users_updated_at
  before update on users
  for each row execute function set_updated_at();

create trigger trg_services_updated_at
  before update on services
  for each row execute function set_updated_at();

create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

create trigger trg_units_updated_at
  before update on units
  for each row execute function set_updated_at();
