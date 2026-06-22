import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Proxy de imagem do Instagram.
 * O CDN do Instagram bloqueia hotlink (carregar a foto direto em outro site).
 * Aqui buscamos a imagem pelo servidor e devolvemos pro navegador — assim ela
 * carrega a partir do nosso próprio domínio.
 * Só aceita URLs do CDN do Instagram/Facebook (evita virar proxy aberto).
 */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "url ausente" }, { status: 400 });

  let host: string;
  try {
    host = new URL(raw).hostname;
  } catch {
    return NextResponse.json({ error: "url inválida" }, { status: 400 });
  }
  if (!/\.cdninstagram\.com$|\.fbcdn\.net$/i.test(host)) {
    return NextResponse.json({ error: "host não permitido" }, { status: 400 });
  }

  try {
    const r = await fetch(raw, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      },
    });
    if (!r.ok) return NextResponse.json({ error: `cdn ${r.status}` }, { status: 502 });
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": r.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "falha" }, { status: 502 });
  }
}
