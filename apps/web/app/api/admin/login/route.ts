import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkCredentials, cookieOptions, signSession } from "@/lib/admin/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // trava brute-force por IP
  const ip = clientIp(req);
  if (!rateLimit(`admin-login:${ip}`, 8, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde 1 minuto." }, { status: 429 });
  }

  const { user, password } = await req.json().catch(() => ({}));
  if (typeof user !== "string" || typeof password !== "string" || !checkCredentials(user, password)) {
    return NextResponse.json({ error: "Usuário ou senha inválidos." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signSession(user), cookieOptions);
  return res;
}
