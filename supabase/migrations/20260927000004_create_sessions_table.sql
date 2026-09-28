-- Sessions table
create table public.sessions (
  id uuid primary key default extensions.uuid_generate_v4(),
  client_id uuid not null references public.clients on delete cascade,
  coach_id uuid not null references auth.users on delete cascade,
  session_date date not null,
  exercise_name text not null,
  sets integer,
  reps integer,
  weight text,
  notes text,
  status text default 'completed' check (status in ('completed', 'missed', 'rescheduled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Coaches can view sessions for their own clients
create policy "Coaches can view their client sessions"
  on public.sessions for select
  to authenticated
  using (coach_id = auth.uid());

-- Coaches can create sessions for their own clients
create policy "Coaches can create sessions"
  on public.sessions for insert
  to authenticated
  with check (coach_id = auth.uid());

-- Coaches can update their own sessions
create policy "Coaches can update their own sessions"
  on public.sessions for update
  to authenticated
  using (coach_id = auth.uid())
  with check (coach_id = auth.uid());

-- Coaches can delete their own sessions
create policy "Coaches can delete their own sessions"
  on public.sessions for delete
  to authenticated
  using (coach_id = auth.uid());

-- Service role can manage sessions
grant select, insert, update, delete on public.sessions to service_role;

-- Indexes for performance
create index idx_sessions_client_id on public.sessions(client_id);
create index idx_sessions_coach_id on public.sessions(coach_id);
create index idx_sessions_date on public.sessions(session_date);
create index idx_sessions_status on public.sessions(status);
