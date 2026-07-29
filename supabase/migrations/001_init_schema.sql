-- 1. USERS (extends Supabase auth.users with subscription info)
create table public.users (
  id uuid references auth.users(id) primary key,
  email text not null,
  subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

-- 2. CLIENTS (the freelancer's customers)
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- 3. INVOICES
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  amount numeric(10, 2) not null,
  due_date date not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'overdue')),
  follow_up_tone text not null default 'friendly'
    check (follow_up_tone in ('friendly', 'firm', 'formal')),
  created_at timestamptz not null default now()
);

create index idx_clients_user_id on public.clients(user_id);
create index idx_invoices_user_id on public.invoices(user_id);
create index idx_invoices_client_id on public.invoices(client_id);

-- ROW LEVEL SECURITY
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;

create policy "Users can view own record"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own record"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can view own clients"
  on public.clients for select
  using (auth.uid() = user_id);

create policy "Users can insert own clients"
  on public.clients for insert
  with check (auth.uid() = user_id);

create policy "Users can update own clients"
  on public.clients for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can view own invoices"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "Users can insert own invoices"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can update own invoices"
  on public.invoices for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
