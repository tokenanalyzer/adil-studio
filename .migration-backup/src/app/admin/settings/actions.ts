"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function asString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));

  if (!id) {
    throw new Error("Settings id is required.");
  }

  const site_name = asString(formData.get("site_name"));
  const site_tagline = asString(formData.get("site_tagline"));
  const contact_email = asString(formData.get("contact_email"));
  const contact_whatsapp = asString(formData.get("contact_whatsapp"));
  const default_theme_slug = asString(formData.get("default_theme_slug"));

  if (!site_name) {
    throw new Error("Site name is required.");
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name,
      site_tagline: site_tagline || null,
      contact_email: contact_email || null,
      contact_whatsapp: contact_whatsapp || null,
      default_theme_slug: default_theme_slug || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
