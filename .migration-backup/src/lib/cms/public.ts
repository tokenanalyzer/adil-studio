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
