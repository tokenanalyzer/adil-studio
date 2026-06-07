import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Adi AI endpoint placeholder ready for Phase 3.",
  });
}
