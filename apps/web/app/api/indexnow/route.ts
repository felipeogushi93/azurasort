import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

/**
 * IndexNow — avisa Bing/Yandex na hora que o conteúdo mudou (indexação rápida).
 * A chave precisa estar acessível em https://azurasort.com/<KEY>.txt (já está em public/).
 * Dispare com: GET https://azurasort.com/api/indexnow  (ou POST { urls: [...] }).
 */
const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "6356727db670673ce3e82c8a887f95a0";
const HOST = "https://azurasort.com";

// páginas públicas indexáveis (mesmas do sitemap) × idiomas + arquivos de IA
const PATHS = ["", "/sorteio", "/guia", "/instagram-giveaway-video", "/termos", "/privacidade"];

function buildUrls(): string[] {
  const urls: string[] = [];
  for (const locale of routing.locales) {
    for (const path of PATHS) urls.push(`${HOST}/${locale}${path}`);
  }
  urls.push(`${HOST}/llms.txt`, `${HOST}/ai.txt`, `${HOST}/sitemap.xml`);
  return urls;
}

async function submitIndexNow(urls: string[]) {
  if (!INDEXNOW_KEY || INDEXNOW_KEY.length < 8) {
    return { ok: false, error: "no_key" };
  }
  const targets = [
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];
  const body = JSON.stringify({
    host: "azurasort.com",
    key: INDEXNOW_KEY,
    keyLocation: `${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  });
  const results = await Promise.allSettled(
    targets.map(async (t) => {
      const res = await fetch(t, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
      });
      return { target: t, status: res.status };
    }),
  );
  return {
    ok: true,
    submitted: urls.length,
    targets: results.map((r, i) =>
      r.status === "fulfilled"
        ? r.value
        : { target: targets[i], error: (r.reason as Error)?.message || "fail" },
    ),
  };
}

export async function GET() {
  return NextResponse.json(await submitIndexNow(buildUrls()));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] =
      Array.isArray(body?.urls) && body.urls.length > 0
        ? body.urls.filter(
            (u: unknown) => typeof u === "string" && (u as string).startsWith(HOST),
          )
        : buildUrls();
    return NextResponse.json(await submitIndexNow(urls));
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error)?.message || "fail" },
      { status: 500 },
    );
  }
}
