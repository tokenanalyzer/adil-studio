"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function asString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function updateSetting(formData: FormData) {
  const supabase = await createClient();

  const id = asString(formData.get("id"));
  const key = asString(formData.get("key"));
  const value = asString(formData.get("value"));

  if (!id) {
    throw new Error("Setting id is required.");
  }

  if (!key) {
    throw new Error("Setting key is required.");
  }

  const { error } = await supabase
    .from("settings")
    .update({
      key,
      value,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
