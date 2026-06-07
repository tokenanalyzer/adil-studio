create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.user_roles enable row level security;
alter table public.founder_profile enable row level security;
alter table public.site_settings enable row level security;
alter table public.goals enable row level security;
alter table public.industries enable row level security;
alter table public.themes enable row level security;
alter table public.studio_variants enable row level security;
alter table public.content_blocks enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.leads enable row level security;
alter table public.adi_sessions enable row level security;
alter table public.adi_messages enable row level security;

create policy "admins manage user_roles"
on public.user_roles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view founder profile"
on public.founder_profile
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage founder profile"
on public.founder_profile
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

create policy "admins manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view active goals"
on public.goals
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage goals"
on public.goals
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view active industries"
on public.industries
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage industries"
on public.industries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view active themes"
on public.themes
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage themes"
on public.themes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view published variants"
on public.studio_variants
for select
to anon, authenticated
using (is_published = true);

create policy "admins manage variants"
on public.studio_variants
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view enabled blocks of published variants"
on public.content_blocks
for select
to anon, authenticated
using (
  is_enabled = true
  and exists (
    select 1
    from public.studio_variants sv
    where sv.id = variant_id
      and sv.is_published = true
  )
);

create policy "admins manage content blocks"
on public.content_blocks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view active services"
on public.services
for select
to anon, authenticated
using (is_active = true);

create policy "admins manage services"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can view published portfolio"
on public.portfolio_items
for select
to anon, authenticated
using (is_published = true);

create policy "admins manage portfolio"
on public.portfolio_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage leads"
on public.leads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "admins manage adi sessions"
on public.adi_sessions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage adi messages"
on public.adi_messages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
