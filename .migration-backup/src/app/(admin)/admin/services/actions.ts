"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function asString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function createService(formData: FormData) {
  const supabase = await createClient();

  const slug = asString(formData.get("slug"));
  const title = asString(formData.get("title"));

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const { error } = await supabase.from("services").insert({
    slug,
    title,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/services");
}

export async function updateService(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));
  const slug = asString(formData.get("slug"));
  const title = asString(formData.get("title"));

  if (!id) {
    throw new Error("Service id is required.");
  }

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const { error } = await supabase
    .from("services")
    .update({
      slug,
      title,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/services");
}
