import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

// só eventos conhecidos do funil (evita poluição/abuso)
const ALLOWED = new Set(["visit", "link_loaded", "unlock_view", "pay_started", "pay_done"]);

export async function POST(req: Request) {
  try {
    const { type, sessionId, path, meta } = await req.json().catch(() => ({}));
    if (typeof type !== "string" || !ALLOWED.has(type)) {
      return NextResponse.json({ ok: false }, { status: 204 });
    }
    const ip = clientIp(req);
    const country = req.headers.get("x-vercel-ip-country") ?? null;
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
          path: typeof path === "string" ? path.slice(0, 200) : null,
          meta: meta && typeof meta === "object" ? meta : undefined,
        },
      })
      .catch(() => {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 204 });
  }
}
