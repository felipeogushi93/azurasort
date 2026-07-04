import { NextResponse } from "next/server";
import { fetchComments } from "@/lib/providers/apify";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!rateLimit(`ig-comments:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde um instante." }, { status: 429 });
  }
  // 🔒 endpoint interno (coleta paga do Apify). Antes era público → furava o paywall
  // e queimava crédito. Agora exige a chave admin. O fluxo do cliente NÃO usa este
  // endpoint (a coleta real roda server-side dentro do /api/draw).
  const key = new URL(req.url).searchParams.get("key");
  const secret = process.env.AZURA_ADMIN_BYPASS_KEY?.trim();
  if (!secret || key !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Link ausente" }, { status: 400 });
  try {
    const comments = await fetchComments(url);
    return NextResponse.json({ count: comments.length, comments });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha na coleta" }, { status: 502 });
  }
}
