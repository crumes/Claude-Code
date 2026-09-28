-- Clients table
create table public.clients (
  id uuid primary key default extensions.uuid_generate_v4(),
  coach_id uuid not null references auth.users on delete cascade,
  name text not null,
  email text,
  phone text,
  goals text,
  start_date date,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.clients enable row level security;

-- Coaches can view their own clients
create policy "Coaches can view their own clients"
  on public.clients for select
  to authenticated
  using (coach_id = auth.uid());

-- Coaches can create clients
create policy "Coaches can create clients"
  on public.clients for insert
  to authenticated
  with check (coach_id = auth.uid());

-- Coaches can update their own clients
create policy "Coaches can update their own clients"
  on public.clients for update
  to authenticated
  using (coach_id = auth.uid())
  with check (coach_id = auth.uid());

-- Coaches can delete their own clients
create policy "Coaches can delete their own clients"
  on public.clients for delete
  to authenticated
  using (coach_id = auth.uid());

-- Service role can manage clients
grant select, insert, update, delete on public.clients to service_role;

-- Indexes
create index idx_clients_coach_id on public.clients(coach_id);
create index idx_clients_is_active on public.clients(is_active);
