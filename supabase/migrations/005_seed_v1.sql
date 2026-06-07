insert into public.site_settings (site_name, site_tagline, contact_email, contact_whatsapp, default_theme_slug)
values ('Adil Studio', 'Adaptive Digital Studio', 'adilhusain3176@gmail.com', '+91XXXXXXXXXX', 'obsidian-neon')
on conflict do nothing;

insert into public.goals (slug, name, short_description, position)
values
  ('get-clients', 'Get Clients', 'Turn visitors into qualified inbound leads.', 1),
  ('build-brand', 'Build Brand', 'Increase trust and perceived authority.', 2),
  ('launch-product', 'Launch Product', 'Ship a focused digital product presence.', 3),
  ('show-portfolio', 'Show Portfolio', 'Present proof of work and outcomes.', 4)
on conflict (slug) do nothing;

insert into public.industries (slug, name, short_description, position)
values
  ('creator', 'Creator', 'Personal brand, audience, and monetization.', 1),
  ('startup', 'Startup', 'Launch-ready product and growth positioning.', 2),
  ('agency', 'Agency', 'Service positioning and conversion flow.', 3),
  ('local-business', 'Local Business', 'High-conversion local presence.', 4)
on conflict (slug) do nothing;

insert into public.themes (slug, name, mode, tokens, is_default, is_active)
values (
  'obsidian-neon',
  'Obsidian Neon',
  'dark',
  '{
    "bg":"#05070b",
    "surface":"#0c111b",
    "surface2":"#111827",
    "text":"#f5f7fa",
    "muted":"#94a3b8",
    "primary":"#1e5eff",
    "accent":"#00d4ff",
    "border":"rgba(255,255,255,0.12)"
  }'::jsonb,
  true,
  true
)
on conflict (slug) do nothing;

insert into public.studio_variants (
  slug, goal_id, industry_id, theme_id,
  hero_kicker, hero_heading, hero_subheading,
  primary_cta_label, primary_cta_href,
  secondary_cta_label, secondary_cta_href,
  shapeshifter_config, is_published
)
select
  'get-clients-startup',
  g.id,
  i.id,
  t.id,
  'Growth-focused studio system',
  'A startup site built to convert attention into serious leads.',
  'Sharper positioning, faster trust, and cleaner conversion flow.',
  'Book Strategy Call',
  '/contact',
  'View Services',
  '/services',
  '{"tone":"confident","density":"balanced","heroStyle":"conversion"}'::jsonb,
  true
from public.goals g, public.industries i, public.themes t
where g.slug='get-clients' and i.slug='startup' and t.slug='obsidian-neon'
on conflict (slug) do nothing;

insert into public.studio_variants (
  slug, goal_id, industry_id, theme_id,
  hero_kicker, hero_heading, hero_subheading,
  primary_cta_label, primary_cta_href,
  secondary_cta_label, secondary_cta_href,
  shapeshifter_config, is_published
)
select
  'build-brand-creator',
  g.id,
  i.id,
  t.id,
  'Presence with personality',
  'A creator-first site designed to grow trust and memorability.',
  'Clear identity, content pathways, and a stronger digital presence.',
  'Start a Project',
  '/contact',
  'See Portfolio',
  '/portfolio',
  '{"tone":"bold","density":"airy","heroStyle":"editorial"}'::jsonb,
  true
from public.goals g, public.industries i, public.themes t
where g.slug='build-brand' and i.slug='creator' and t.slug='obsidian-neon'
on conflict (slug) do nothing;

insert into public.studio_variants (
  slug, goal_id, industry_id, theme_id,
  hero_kicker, hero_heading, hero_subheading,
  primary_cta_label, primary_cta_href,
  secondary_cta_label, secondary_cta_href,
  shapeshifter_config, is_published
)
select
  'launch-product-startup',
  g.id,
  i.id,
  t.id,
  'Focused launch architecture',
  'A product launch site tuned for clarity, speed, and momentum.',
  'Launch messaging, page structure, and action flow that reduce friction.',
  'Launch With Adil Studio',
  '/contact',
  'Explore Process',
  '/services',
  '{"tone":"precise","density":"tight","heroStyle":"product"}'::jsonb,
  true
from public.goals g, public.industries i, public.themes t
where g.slug='launch-product' and i.slug='startup' and t.slug='obsidian-neon'
on conflict (slug) do nothing;

insert into public.studio_variants (
  slug, goal_id, industry_id, theme_id,
  hero_kicker, hero_heading, hero_subheading,
  primary_cta_label, primary_cta_href,
  secondary_cta_label, secondary_cta_href,
  shapeshifter_config, is_published
)
select
  'show-portfolio-agency',
  g.id,
  i.id,
  t.id,
  'Proof-led service positioning',
  'An agency portfolio site that makes credibility obvious.',
  'Structured case studies, stronger authority signals, and better client trust.',
  'Get Proposal',
  '/contact',
  'Browse Work',
  '/portfolio',
  '{"tone":"professional","density":"balanced","heroStyle":"case-study"}'::jsonb,
  true
from public.goals g, public.industries i, public.themes t
where g.slug='show-portfolio' and i.slug='agency' and t.slug='obsidian-neon'
on conflict (slug) do nothing;
