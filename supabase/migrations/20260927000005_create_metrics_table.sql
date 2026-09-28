-- Metrics table
create table public.metrics (
  id uuid primary key default extensions.uuid_generate_v4(),
  client_id uuid not null references public.clients on delete cascade,
  coach_id uuid not null references auth.users on delete cascade,
  metric_date date not null,
  metric_type text not null, -- 'weight', 'body_fat', 'measurements', 'benchmark'
  metric_name text not null, -- e.g., 'Weight', 'Chest', 'Bench Press Max'
  value decimal(10, 2) not null,
  unit text, -- e.g., 'lbs', 'cm', 'kg'
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.metrics enable row level security;

-- Coaches can view metrics for their own clients
create policy "Coaches can view their client metrics"
  on public.metrics for select
  to authenticated
  using (coach_id = auth.uid());

-- Coaches can create metrics for their own clients
create policy "Coaches can create metrics"
  on public.metrics for insert
  to authenticated
  with check (coach_id = auth.uid());

-- Coaches can update their own metrics
create policy "Coaches can update their own metrics"
  on public.metrics for update
  to authenticated
  using (coach_id = auth.uid())
  with check (coach_id = auth.uid());

-- Coaches can delete their own metrics
create policy "Coaches can delete their own metrics"
  on public.metrics for delete
  to authenticated
  using (coach_id = auth.uid());

-- Service role can manage metrics
grant select, insert, update, delete on public.metrics to service_role;

-- Indexes for performance
create index idx_metrics_client_id on public.metrics(client_id);
create index idx_metrics_coach_id on public.metrics(coach_id);
create index idx_metrics_date on public.metrics(metric_date);
create index idx_metrics_type on public.metrics(metric_type);
