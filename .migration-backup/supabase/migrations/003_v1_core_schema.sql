create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Adil Studio',
  site_tagline text,
  contact_email citext,
  contact_whatsapp text,
  default_theme_slug text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  mode text not null default 'dark' check (mode in ('light','dark')),
  tokens jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_variants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  goal_id uuid not null references public.goals(id) on delete cascade,
  industry_id uuid not null references public.industries(id) on delete cascade,
  theme_id uuid references public.themes(id) on delete set null,
  hero_kicker text,
  hero_heading text not null,
  hero_subheading text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  shapeshifter_config jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(goal_id, industry_id)
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.studio_variants(id) on delete cascade,
  block_key text not null,
  block_type text not null,
  label text,
  content jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(variant_id, block_key)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body jsonb not null default '{}'::jsonb,
  icon text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  body jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext,
  whatsapp text,
  company_name text,
  goal_slug text,
  industry_slug text,
  project_brief text,
  budget_range text,
  source text not null default 'website',
  status text not null default 'new' check (status in ('new','qualified','contacted','closed','archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.adi_sessions (
  id uuid primary key default gen_random_uuid(),
  session_key text not null unique,
  lead_id uuid references public.leads(id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.adi_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.adi_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_goals_slug on public.goals(slug);
create index if not exists idx_industries_slug on public.industries(slug);
create index if not exists idx_variants_goal_industry on public.studio_variants(goal_id, industry_id);
create index if not exists idx_content_blocks_variant on public.content_blocks(variant_id, position);
create index if not exists idx_leads_status on public.leads(status, created_at desc);
create index if not exists idx_adi_messages_session on public.adi_messages(session_id, created_at);
