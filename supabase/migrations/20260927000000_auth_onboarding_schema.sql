-- Week 1: Auth & Onboarding Schema
-- Tables: coaches, studios, studio_members
-- RLS policies to enforce data isolation by coach

-- Enable UUID extension
create extension if not exists "uuid-ossp" with schema extensions;

-- Coaches table (profile data linked to auth.users)
create table public.coaches (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Studios table (workspace for one or more coaches)
create table public.studios (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null,
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Studio members (join coaches to studios with roles)
create table public.studio_members (
  id uuid primary key default extensions.uuid_generate_v4(),
  studio_id uuid not null references public.studios on delete cascade,
  coach_id uuid not null references auth.users on delete cascade,
  role text default 'coach' not null check (role in ('coach', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(studio_id, coach_id)
);

-- Enable RLS on all tables
alter table public.coaches enable row level security;
alter table public.studios enable row level security;
alter table public.studio_members enable row level security;

-- RLS Policies: Coaches
-- Each coach can only read/update their own profile
create policy "Coaches can view their own profile"
  on public.coaches for select
  using (auth.uid() = id);

create policy "Coaches can update their own profile"
  on public.coaches for update
  using (auth.uid() = id);

create policy "New coaches can insert their profile during signup"
  on public.coaches for insert
  with check (auth.uid() = id);

-- RLS Policies: Studios
-- Coaches can view studios they are a member of
create policy "Studio members can view their studio"
  on public.studios for select
  using (
    exists (
      select 1 from public.studio_members
      where studio_members.studio_id = studios.id
      and studio_members.coach_id = auth.uid()
    )
  );

-- Creator can insert new studio
create policy "Coaches can create studios"
  on public.studios for insert
  with check (auth.uid() = created_by);

-- Studio admin can update
create policy "Studio admins can update studio"
  on public.studios for update
  using (
    exists (
      select 1 from public.studio_members
      where studio_members.studio_id = studios.id
      and studio_members.coach_id = auth.uid()
      and studio_members.role = 'admin'
    )
  );

-- RLS Policies: Studio Members
-- Coaches can view other members of their studios
create policy "Coaches can view studio members"
  on public.studio_members for select
  using (
    exists (
      select 1 from public.studio_members as sm
      where sm.studio_id = studio_members.studio_id
      and sm.coach_id = auth.uid()
    )
  );

-- Studio admin can insert new members (invite coaches)
create policy "Studio admins can invite coaches"
  on public.studio_members for insert
  with check (
    exists (
      select 1 from public.studio_members as sm
      where sm.studio_id = studio_members.studio_id
      and sm.coach_id = auth.uid()
      and sm.role = 'admin'
    )
  );

-- Indexes for performance
create index idx_coaches_email on public.coaches(email);
create index idx_studios_created_by on public.studios(created_by);
create index idx_studio_members_coach_id on public.studio_members(coach_id);
create index idx_studio_members_studio_id on public.studio_members(studio_id);
