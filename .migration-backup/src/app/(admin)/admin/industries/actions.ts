"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function asString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function createIndustry(formData: FormData) {
  const supabase = await createClient();

  const slug = asString(formData.get("slug"));
  const name = asString(formData.get("name"));

  if (!name || !slug) {
    throw new Error("Name and slug are required.");
  }

  const { error } = await supabase.from("industries").insert({
    slug,
    name,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/industries");
}

export async function updateIndustry(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));
  const slug = asString(formData.get("slug"));
  const name = asString(formData.get("name"));

  if (!id) {
    throw new Error("Industry id is required.");
  }

  if (!name || !slug) {
    throw new Error("Name and slug are required.");
  }

  const { error } = await supabase
    .from("industries")
    .update({
      slug,
      name,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/industries");
}
