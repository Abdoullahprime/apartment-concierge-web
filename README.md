# Apartment Concierge — Web App

Monorepo for the Apartment Concierge web platform.

## Structure

```
webapp/
├── frontend/   # Next.js 15 · TypeScript · Tailwind · App Router
└── backend/    # NestJS · TypeScript · Supabase
```

## Roles

| Role  | Platform       |
|-------|----------------|
| Agent | Web + Mobile   |
| Admin | Web only       |

## Modules

### Backend (NestJS)
- `auth` — JWT authentication, role guards
- `users` — CRUD, role management
- `services` — catalogue CRUD, active/inactive toggle
- `bookings` — create, status transitions, filters
- `units` — occupancy, check-in / check-out
- `stays` — stay records, history
- `reports` — occupancy over time, bookings by category

### Frontend (Next.js)
- `auth` — login, role-based redirect
- `agent` — today's bookings, confirm/reject/complete, check-in list, directory
- `admin/overview` — dashboard: occupancy, counts, recent bookings
- `admin/providers` — service catalogue management
- `admin/people` — residents, guests, agents
- `admin/bookings` — all bookings, status filters
- `admin/reports` — occupancy chart, bookings by service, date range

## Getting started

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env` in each subfolder and fill in your Supabase credentials.
