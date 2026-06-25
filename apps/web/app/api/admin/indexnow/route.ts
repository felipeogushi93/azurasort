import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { submitToIndexNow, mainSiteUrls } from "@/lib/seo/indexnow";

export const runtime = "nodejs";

/**
 * Dispara o IndexNow para as URLs principais (home + guia + sorteio, todos os locales).
 * Protegido pelo admin. Útil após publicar conteúdo novo.
 * GET = envia as URLs padrão. POST { urls: string[] } = envia URLs específicas.
 */
export async function GET() {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const urls = mainSiteUrls();
  const r = await submitToIndexNow(urls);
  return NextResponse.json({ submitted: urls.length, ...r });
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls) && body.urls.length ? body.urls : mainSiteUrls();
  const r = await submitToIndexNow(urls);
  return NextResponse.json({ submitted: urls.length, ...r });
}
