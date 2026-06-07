"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function asString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const raw = String(value ?? "").trim();
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}

function asBoolean(value: FormDataEntryValue | null) {
  return String(value ?? "") === "on";
}

export async function createGoal(formData: FormData) {
  const supabase = await createClient();

  const name = asString(formData.get("name"));
  const slug = asString(formData.get("slug"));
  const short_description = asString(formData.get("short_description"));
  const position = asNumber(formData.get("position"), 0);
  const is_active = asBoolean(formData.get("is_active"));

  if (!name || !slug) {
    throw new Error("Name and slug are required.");
  }

  const { error } = await supabase.from("goals").insert({
    name,
    slug,
    short_description: short_description || null,
    position,
    is_active,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/goals");
}

export async function updateGoal(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));
  const name = asString(formData.get("name"));
  const slug = asString(formData.get("slug"));
  const short_description = asString(formData.get("short_description"));
  const position = asNumber(formData.get("position"), 0);
  const is_active = asBoolean(formData.get("is_active"));

  if (!id) {
    throw new Error("Goal id is required.");
  }

  if (!name || !slug) {
    throw new Error("Name and slug are required.");
  }

  const { error } = await supabase
    .from("goals")
    .update({
      name,
      slug,
      short_description: short_description || null,
      position,
      is_active,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/goals");
}

export async function toggleGoalActive(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));
  const current = String(formData.get("current") ?? "") === "true";

  if (!id) {
    throw new Error("Goal id is required.");
  }

  const { error } = await supabase
    .from("goals")
    .update({
      is_active: !current,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/goals");
}
