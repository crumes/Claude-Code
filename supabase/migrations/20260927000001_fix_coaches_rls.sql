-- Drop the overly restrictive insert policy
drop policy if exists "New coaches can insert their profile during signup" on public.coaches;

-- Allow service role to insert (bypasses RLS for service role)
-- Regular users can only see their own profile (via select policy)
create policy "Allow insert for signup"
  on public.coaches for insert
  to authenticated, service_role
  with check (true);

-- Coaches can view their own profile
drop policy if exists "Coaches can view their own profile" on public.coaches;
create policy "Coaches can view their own profile"
  on public.coaches for select
  to authenticated
  using (auth.uid() = id);

-- Coaches can update their own profile
drop policy if exists "Coaches can update their own profile" on public.coaches;
create policy "Coaches can update their own profile"
  on public.coaches for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
