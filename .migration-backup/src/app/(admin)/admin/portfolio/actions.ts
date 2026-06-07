"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function asString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function createPortfolioItem(formData: FormData) {
  const supabase = await createClient();

  const slug = asString(formData.get("slug"));
  const title = asString(formData.get("title"));

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const { error } = await supabase.from("portfolio_items").insert({
    slug,
    title,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/portfolio");
}

export async function updatePortfolioItem(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));
  const slug = asString(formData.get("slug"));
  const title = asString(formData.get("title"));

  if (!id) {
    throw new Error("Portfolio item id is required.");
  }

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const { error } = await supabase
    .from("portfolio_items")
    .update({
      slug,
      title,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/portfolio");
}
