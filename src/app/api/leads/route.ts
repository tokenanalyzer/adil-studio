import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();

  const payload = {
    full_name: body.full_name ?? "",
    email: body.email ?? null,
    whatsapp: body.whatsapp ?? null,
    company_name: body.company_name ?? null,
    goal_slug: body.goal_slug ?? null,
    industry_slug: body.industry_slug ?? null,
    project_brief: body.project_brief ?? null,
    budget_range: body.budget_range ?? null,
    source: "website",
    status: "new",
  };

  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
