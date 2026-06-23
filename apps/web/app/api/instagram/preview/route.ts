import { NextResponse } from "next/server";
import { fetchPostPreview } from "@/lib/providers/apify";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!rateLimit(`ig-preview:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde um instante." }, { status: 429 });
  }
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Link ausente" }, { status: 400 });
  try {
    const data = await fetchPostPreview(url);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha na coleta" }, { status: 502 });
  }
}
