"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function asString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function createVariant(formData: FormData) {
  const supabase = await createClient();

  const slug = asString(formData.get("slug"));
  const hero_heading = asString(formData.get("hero_heading"));
  const goal_id = asString(formData.get("goal_id"));
  const industry_id = asString(formData.get("industry_id"));

  if (!slug || !hero_heading) {
    throw new Error("Slug and heading are required.");
  }

  if (!goal_id || !industry_id) {
    throw new Error("Goal and industry are required.");
  }

  const { error } = await supabase.from("studio_variants").insert({
    slug,
    hero_heading,
    goal_id,
    industry_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/variants");
}

export async function updateVariant(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));
  const slug = asString(formData.get("slug"));
  const hero_heading = asString(formData.get("hero_heading"));

  if (!id) {
    throw new Error("Variant id is required.");
  }

  if (!slug || !hero_heading) {
    throw new Error("Slug and heading are required.");
  }

  const { error } = await supabase
    .from("studio_variants")
    .update({
      slug,
      hero_heading,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/variants");
}
