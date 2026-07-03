import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rateLimit";
import { notifyTelegram, funnelMessage } from "@/lib/notify/telegram";

export const runtime = "nodejs";

// só eventos conhecidos do funil (evita poluição/abuso)
const ALLOWED = new Set(["visit", "link_loaded", "unlock_view", "pay_started", "pay_done"]);

// crawlers/robôs conhecidos (preview de link, SEO, IA, headless, HTTP clients).
// UA vazio também conta como bot (navegador real sempre manda UA).
const BOT_RE =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|slack|discord|twitter|linkedin|embedly|pinterest|redditbot|applebot|petalbot|bytespider|gptbot|oai-searchbot|chatgpt|claude|anthropic|perplexity|amazonbot|ahrefs|semrush|mj12|dotbot|dataforseo|screaming|headless|phantom|puppeteer|playwright|python|curl|wget|axios|go-http|java\/|okhttp|node-fetch|libwww|scrapy|httpclient|monitor|uptime|pingdom|statuscake|lighthouse|gtmetrix|vercel/i;

function isBotUA(ua: string | null): boolean {
  if (!ua || ua.trim().length < 8) return true; // sem UA / muito curto = robô
  return BOT_RE.test(ua);
}

export async function POST(req: Request) {
  try {
    const { type, sessionId, path, meta } = await req.json().catch(() => ({}));
    if (typeof type !== "string" || !ALLOWED.has(type)) {
      return NextResponse.json({ ok: false }, { status: 204 });
    }
    const ip = clientIp(req);
    const country = req.headers.get("x-vercel-ip-country") ?? null;
    const ua = req.headers.get("user-agent");
    const bot = isBotUA(ua); // robô? (filtrado do painel; não pinga no Telegram)
    // IMPORTANTE: await na gravação. Em serverless (Vercel), promessa não
    // aguardada é cortada quando a resposta retorna e o evento se PERDE. Como o
    // cliente usa sendBeacon (não espera a resposta), aguardar não afeta a UX.
    await db.event
      .create({
        data: {
          type,
          sessionId: typeof sessionId === "string" ? sessionId.slice(0, 64) : null,
          ip,
          country,
          bot,
          ua: ua ? ua.slice(0, 300) : null,
          path: typeof path === "string" ? path.slice(0, 200) : null,
          meta: meta && typeof meta === "object" ? meta : undefined,
        },
      })
      .catch(() => {});

    // Mapa da jornada num grupo SEPARADO do Telegram. Só dispara se
    // TELEGRAM_FUNNEL_CHAT_ID estiver setado (não polui o grupo de vendas).
    // "visit" só avisa na PRIMEIRA página da sessão (senão spam a cada clique).
    const funnelChat = process.env.TELEGRAM_FUNNEL_CHAT_ID?.trim();
    if (funnelChat && !bot) {
      // bots não pingam no Telegram (senão soterram as pessoas reais)
      const sid = typeof sessionId === "string" ? sessionId : "";
      let send = true;
      if (type === "visit") {
        // create já foi aguardado acima; count === 1 => esta é a 1ª visita (humana)
        send = sid ? (await db.event.count({ where: { type: "visit", sessionId: sid, bot: false } })) <= 1 : false;
      }
      if (send) {
        const msg = funnelMessage({ type, meta, ip, country, sessionId, path });
        if (msg) await notifyTelegram(msg, funnelChat);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 204 });
  }
}
