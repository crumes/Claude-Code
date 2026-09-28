-- Grant service role permissions on coaches table
grant select, insert, update, delete on public.coaches to service_role;
grant select, insert, update, delete on public.studios to service_role;
grant select, insert, update, delete on public.studio_members to service_role;
