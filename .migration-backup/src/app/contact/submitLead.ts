"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitLead(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const { error } = await supabase.from("leads").insert({
    full_name: name,
    email: email || null,
    whatsapp: phone || null,
    company_name: company || null,
    notes: message,
    source: "contact_form",
    status: "new",
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/contact?success=1");
}
