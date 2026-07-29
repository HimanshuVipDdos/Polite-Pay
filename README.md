# PolitePay

B2B SaaS for freelancers to automate polite invoice reminders.

## Stack
- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** Supabase (Postgres + Row Level Security)
- **Payments:** Stripe (subscription, $12/month)
- **Styling:** Tailwind CSS

## Getting started
```bash
npm install
cp .env.example .env.local   # fill in Supabase + Stripe keys
npm run dev
```

## Database
Run the migration in `supabase/migrations/001_init_schema.sql` against your
Supabase project (via the SQL editor or `supabase db push`). It creates
`users`, `clients`, `invoices`, and enables RLS so each freelancer can only
read/write their own rows.

## Structure
- `app/actions.ts` — Server Actions for invoices + dashboard metrics (currently mocked, marked with TODOs for wiring to Supabase)
- `app/lib/stripe-actions.ts` — Stripe Checkout session creation (subscription mode)
- `app/dashboard/` — Dashboard UI (metrics, invoice table, add-invoice modal with tone selector)
- `lib/supabase/` — Supabase browser/server client helpers
- `supabase/migrations/` — SQL schema + RLS policies

## Status
Data layer and payment scaffolding are in place; Supabase queries in
`app/actions.ts` are still mocked pending a connected Supabase project, and
the Stripe webhook handler (`checkout.session.completed` → update
subscription status) is not yet implemented.
