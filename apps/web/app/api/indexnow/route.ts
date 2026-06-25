import { NextResponse } from "next/server";
import { submitToIndexNow, mainSiteUrls } from "@/lib/seo/indexnow";

export const runtime = "nodejs";

/**
 * IndexNow — notifica Bing/Yandex na hora (indexação rápida).
 * Rota pública de conveniência: GET dispara as URLs principais (home, guia,
 * sorteio, recursos, pillars e páginas programáticas, em todos os idiomas).
 * POST { urls: string[] } envia URLs específicas.
 *
 * Chave ÚNICA do projeto vive em /public/<key>.txt (ver lib/seo/indexnow.ts).
 */
export async function GET() {
  const urls = mainSiteUrls();
  const r = await submitToIndexNow(urls);
  return NextResponse.json({ submitted: urls.length, ...r });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls) && body.urls.length ? body.urls : mainSiteUrls();
  const r = await submitToIndexNow(urls);
  return NextResponse.json({ submitted: urls.length, ...r });
}
