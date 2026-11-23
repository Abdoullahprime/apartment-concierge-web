-- ============================================================
-- Migration 003 — Seed data
-- Realistic mock data for development and demos.
-- Passwords are all:  Password123!
-- bcrypt hash below was generated at cost 10.
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================

insert into users (id, name, email, password_hash, phone, role, unit_number, check_in_date, employee_id) values

  -- Residents (long-term, units pre-assigned)
  ('a1000000-0000-0000-0000-000000000001',
   'Alice Mensah', 'alice@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '+1-555-0101', 'resident', 3, '2026-01-15', null),

  ('a1000000-0000-0000-0000-000000000002',
   'Bob Diallo', 'bob@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '+1-555-0102', 'resident', 7, '2026-02-01', null),

  -- Guests (short-stay, unit assigned on arrival)
  ('a1000000-0000-0000-0000-000000000003',
   'Clara Osei', 'clara@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '+1-555-0103', 'guest', 12, '2026-11-20', null),

  ('a1000000-0000-0000-0000-000000000004',
   'David Kamara', 'david@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '+1-555-0104', 'guest', null, null, null),

  -- Agents
  ('a1000000-0000-0000-0000-000000000005',
   'Esi Boateng', 'esi@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '+1-555-0105', 'agent', null, null, 'AGT-001'),

  ('a1000000-0000-0000-0000-000000000006',
   'Frank Nkrumah', 'frank@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '+1-555-0106', 'agent', null, null, 'AGT-002'),

  -- Admin
  ('a1000000-0000-0000-0000-000000000007',
   'Grace Asante', 'admin@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   '+1-555-0107', 'admin', null, null, 'ADM-001');

-- Mark occupied units
update units set occupant_id = 'a1000000-0000-0000-0000-000000000001' where number = 3;
update units set occupant_id = 'a1000000-0000-0000-0000-000000000002' where number = 7;
update units set occupant_id = 'a1000000-0000-0000-0000-000000000003' where number = 12;

-- ============================================================
-- SERVICES
-- ============================================================

insert into services (id, name, description, category, features, contact, active) values

  -- Restaurants
  ('b1000000-0000-0000-0000-000000000001',
   'Sunset Bistro',
   'Fine dining with panoramic views. Perfect for special occasions.',
   'restaurants',
   array['Indoor and terrace seating','Vegetarian & vegan options','Private dining rooms','Full bar service'],
   '+1-555-2001', true),

  ('b1000000-0000-0000-0000-000000000002',
   'African Kitchen',
   'Authentic West African cuisine. Family recipes, vibrant atmosphere.',
   'restaurants',
   array['Traditional dishes','Halal certified','Large group bookings','Weekend buffet'],
   '+1-555-2002', true),

  ('b1000000-0000-0000-0000-000000000003',
   'Ocean View Café',
   'Casual all-day dining. Great coffee, fresh pastries and light meals.',
   'restaurants',
   array['Breakfast from 7am','Takeaway available','Free WiFi','Dog friendly'],
   '+1-555-2003', true),

  -- Vehicle hire
  ('b1000000-0000-0000-0000-000000000004',
   'Luxury Sedan',
   'Chauffeured Mercedes E-Class for airport transfers and city trips.',
   'vehicle_hire',
   array['Airport meet & greet','Flight tracking','Child seats available','24/7 availability'],
   '+1-555-3001', true),

  ('b1000000-0000-0000-0000-000000000005',
   'Economy Car',
   'Self-drive compact car. Unlimited mileage, full insurance included.',
   'vehicle_hire',
   array['Automatic transmission','Unlimited mileage','Full insurance','Fuel policy: full-to-full'],
   '+1-555-3002', true),

  ('b1000000-0000-0000-0000-000000000006',
   'Minivan (8-seater)',
   'Group transport for up to 8 passengers with luggage.',
   'vehicle_hire',
   array['Up to 8 passengers','Large luggage capacity','Driver included','Flexible scheduling'],
   '+1-555-3003', true),

  -- Private chefs
  ('b1000000-0000-0000-0000-000000000007',
   'Private Chef Service',
   'A professional chef prepares a bespoke dinner in your unit.',
   'private_chefs',
   array['3-5 course menu','Dietary requirements accommodated','All equipment provided','Cleanup included'],
   '+1-555-4001', true),

  ('b1000000-0000-0000-0000-000000000008',
   'Weekly Meal Prep',
   'Healthy, chef-cooked meals delivered to your unit every Sunday.',
   'private_chefs',
   array['5 or 7 day plans','Calorie-counted options','Fridge-ready containers','Menu changes weekly'],
   '+1-555-4002', true),

  -- Co-working
  ('b1000000-0000-0000-0000-000000000009',
   'Business Hub — Hot Desk',
   'Open-plan co-working space with high-speed fibre and printing.',
   'co_working',
   array['1 Gbps fibre','Standing desk option','Free coffee','Locker storage'],
   '+1-555-5001', true),

  ('b1000000-0000-0000-0000-000000000010',
   'Meeting Room (6-person)',
   'Private meeting room with 4K screen, whiteboard and video conferencing.',
   'co_working',
   array['4K display','Video conferencing','Whiteboard','Half-day and full-day rates'],
   '+1-555-5002', true),

  -- Room service
  ('b1000000-0000-0000-0000-000000000011',
   'Breakfast',
   'Continental or full breakfast delivered to your unit.',
   'room_service',
   array['Served 7am–11am','Hot and cold options','Fresh juice','Dietary options available'],
   null, true),

  ('b1000000-0000-0000-0000-000000000012',
   'Dinner',
   'Three-course dinner prepared and delivered to your unit.',
   'room_service',
   array['Served 6pm–10pm','Seasonal menu','Wine pairing available','Dietary options available'],
   null, true),

  -- Hospitals
  ('b1000000-0000-0000-0000-000000000013',
   'Central Hospital',
   'Main public hospital. Emergency, outpatient and specialist services.',
   'hospitals',
   array['24/7 emergency','Walk-in accepted','Specialist referrals','Pharmacy on site'],
   '+1-555-6001', true),

  ('b1000000-0000-0000-0000-000000000014',
   'City Clinic',
   'Private clinic. Same-day appointments, GP and minor procedures.',
   'hospitals',
   array['Same-day GP appointments','Blood tests on site','English-speaking staff','Insurance accepted'],
   '+1-555-6002', true),

  -- Attractions
  ('b1000000-0000-0000-0000-000000000015',
   'Beach & Coast Tour',
   'Full-day guided tour of the coastline with snorkelling and lunch.',
   'attractions',
   array['Guided in English','Snorkelling equipment provided','Lunch included','Hotel pickup'],
   '+1-555-7001', true),

  ('b1000000-0000-0000-0000-000000000016',
   'City Heritage Walk',
   'Two-hour walking tour of the historic city centre with a local guide.',
   'attractions',
   array['2-hour walking tour','English-speaking guide','Small groups (max 10)','Photo stops'],
   '+1-555-7002', true),

  -- Events
  ('b1000000-0000-0000-0000-000000000017',
   'Live Music Night — Friday',
   'Live jazz and afrobeats in the residents'' lounge. Free entry.',
   'events',
   array['Every Friday 8pm–11pm','Free for residents','Bar open','Limited seats'],
   null, true),

  ('b1000000-0000-0000-0000-000000000018',
   'Networking Dinner — Monthly',
   'Hosted networking dinner for residents and invited guests.',
   'events',
   array['First Thursday of the month','3-course dinner','30 seats only','Business casual dress'],
   null, true),

  -- Government offices
  ('b1000000-0000-0000-0000-000000000019',
   'Immigration Office',
   'Visa extension, residency permits and document legalisation.',
   'government_offices',
   array['Appointment booking assistance','Document preparation','Translation available','Follow-up included'],
   '+1-555-8001', true),

  ('b1000000-0000-0000-0000-000000000020',
   'Permits & Licensing',
   'Business permits, driving licence conversion and notary services.',
   'government_offices',
   array['Business permits','Driving licence conversion','Notary referrals','Same-week appointments'],
   '+1-555-8002', true);

-- ============================================================
-- BOOKINGS  (mix of statuses for a realistic demo)
-- ============================================================

insert into bookings
  (id, user_id, user_name, service_id, service_name, category,
   date, time, notes, quantity, status, handled_by, created_at) values

  -- Pending — awaiting agent action
  ('c1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001', 'Alice Mensah',
   'b1000000-0000-0000-0000-000000000001', 'Sunset Bistro', 'restaurants',
   current_date + 1, '19:30', 'Window table please, anniversary dinner', 2,
   'pending', null, now() - interval '2 hours'),

  ('c1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000003', 'Clara Osei',
   'b1000000-0000-0000-0000-000000000004', 'Luxury Sedan', 'vehicle_hire',
   current_date, '06:00', 'Flight at 09:00. Terminal 2.', 1,
   'pending', null, now() - interval '30 minutes'),

  -- Confirmed
  ('c1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000002', 'Bob Diallo',
   'b1000000-0000-0000-0000-000000000009', 'Business Hub — Hot Desk', 'co_working',
   current_date, '09:00', null, 1,
   'confirmed', 'a1000000-0000-0000-0000-000000000005', now() - interval '1 day'),

  ('c1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000001', 'Alice Mensah',
   'b1000000-0000-0000-0000-000000000011', 'Breakfast', 'room_service',
   current_date, '08:00', 'No gluten please', 1,
   'confirmed', 'a1000000-0000-0000-0000-000000000006', now() - interval '12 hours'),

  -- Completed
  ('c1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000003', 'Clara Osei',
   'b1000000-0000-0000-0000-000000000015', 'Beach & Coast Tour', 'attractions',
   current_date - 2, '09:00', 'Group of 3', 3,
   'completed', 'a1000000-0000-0000-0000-000000000005', now() - interval '3 days'),

  ('c1000000-0000-0000-0000-000000000006',
   'a1000000-0000-0000-0000-000000000002', 'Bob Diallo',
   'b1000000-0000-0000-0000-000000000002', 'African Kitchen', 'restaurants',
   current_date - 5, '20:00', null, 4,
   'completed', 'a1000000-0000-0000-0000-000000000005', now() - interval '6 days'),

  -- Cancelled
  ('c1000000-0000-0000-0000-000000000007',
   'a1000000-0000-0000-0000-000000000001', 'Alice Mensah',
   'b1000000-0000-0000-0000-000000000007', 'Private Chef Service', 'private_chefs',
   current_date - 1, '19:00', 'Changed plans', 2,
   'cancelled', 'a1000000-0000-0000-0000-000000000006', now() - interval '2 days');

-- ============================================================
-- STAY RECORDS  (historical check-outs)
-- ============================================================

insert into stay_records (user_id, unit_number, check_in, check_out) values
  ('a1000000-0000-0000-0000-000000000003', 5,  '2026-10-01', '2026-10-07'),
  ('a1000000-0000-0000-0000-000000000004', 9,  '2026-10-15', '2026-10-22'),
  ('a1000000-0000-0000-0000-000000000003', 14, '2026-11-01', '2026-11-10');
