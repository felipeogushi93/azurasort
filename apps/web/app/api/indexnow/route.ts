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

/**
 * POST com lista própria de URLs exige a chave admin — sem isso qualquer um podia
 * queimar nossa cota do IndexNow (e fazer o Bing/Yandex limitar o domínio).
 */
export async function POST(req: Request) {
  const secret = process.env.AZURA_ADMIN_BYPASS_KEY?.trim();
  const key = new URL(req.url).searchParams.get("key") || req.headers.get("x-admin-key");
  const body = await req.json().catch(() => ({}));
  const custom = Array.isArray(body.urls) && body.urls.length ? (body.urls as string[]) : null;
  if (custom && (!secret || key !== secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const urls = custom ?? mainSiteUrls();
  const r = await submitToIndexNow(urls);
  return NextResponse.json({ submitted: urls.length, ...r });
}
