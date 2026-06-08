import { createClient } from "@/lib/supabase/server";

export async function getPublishedVariant(goal: string, industry: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("studio_variants")
    .select(`
      id,
      slug,
      hero_kicker,
      hero_heading,
      hero_subheading,
      primary_cta_label,
      primary_cta_href,
      secondary_cta_label,
      secondary_cta_href,
      goals!inner(slug),
      industries!inner(slug),
      themes(slug, tokens)
    `)
    .eq("is_published", true)
    .eq("goals.slug", goal)
    .eq("industries.slug", industry)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllPublishedVariants() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("studio_variants")
    .select(`
      id,
      slug,
      hero_kicker,
      hero_heading,
      hero_subheading,
      primary_cta_label,
      primary_cta_href,
      secondary_cta_label,
      secondary_cta_href,
      goals(slug),
      industries(slug)
    `)
    .eq("is_published", true);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getVariantBlocks(variantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("content_blocks")
    .select("*")
    .eq("variant_id", variantId)
    .eq("is_enabled", true)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActiveGoals() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActiveIndustries() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("industries")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPublishedServices() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, title, slug, summary, icon")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getFeaturedPortfolio() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_items")
    .select("id, title, slug, summary, cover_image_url")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("position", { ascending: true })
    .limit(6);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSiteSettings() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("site_name, site_tagline, contact_email, contact_whatsapp")
    .maybeSingle();

  return data ?? null;
}
