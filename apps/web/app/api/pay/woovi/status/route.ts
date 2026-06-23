import { NextResponse } from "next/server";
import { getWooviStatus } from "@/lib/payments/woovi";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id ausente" }, { status: 400 });
  try {
    const s = await getWooviStatus(id);
    return NextResponse.json(s);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha" }, { status: 502 });
  }
}
