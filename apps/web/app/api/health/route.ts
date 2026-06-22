import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    hasToken: Boolean(process.env.APIFY_TOKEN),
    tokenLen: (process.env.APIFY_TOKEN || "").length,
    build: "diag-1",
  });
}
