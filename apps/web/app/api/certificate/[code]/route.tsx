import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Paleta (tokens da marca)
const VOID = "#05060A";
const PANEL = "#0D0F17";
const GOLD = "#C2922E";
const GOLD_HI = "#E8C26B";
const CYAN = "#3DF5FF";
const INK_HI = "#F5F7FF";
const INK_LO = "#8A90A6";

const SITE = "https://azurasort.com";

/**
 * GET /api/certificate/<code>?format=story|feed&locale=pt-br
 * Gera o certificado de transparência como IMAGEM pronta pro Instagram:
 *   - story = 1080x1920 (stories/reels)
 *   - feed  = 1080x1080 (feed)
 * Inclui @ do vencedor, hash SHA-256, data e QR code para a página de verificação.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") === "feed" ? "feed" : "story";
  // ⚠️ locale precisa ser validado: um valor qualquer (?locale=xyz) fazia o
  // toLocaleDateString lançar RangeError → 500 no certificado público.
  const LOCALES = ["pt-br", "en", "es", "fr-ma", "ar-ma"];
  const raw = (url.searchParams.get("locale") || "pt-br").toLowerCase();
  const locale = LOCALES.includes(raw) ? raw : "pt-br";

  const draw = await db.draw.findUnique({
    where: { certificateCode: code.toUpperCase() },
    include: { giveaway: true, winners: { orderBy: { position: "asc" } } },
  });
  if (!draw) {
    return new Response("Certificado não encontrado", { status: 404 });
  }

  const winners = draw.winners.filter((w) => !w.isBackup);
  const main = winners[0];
  const verifyUrl = `${SITE}/${locale}/verify/${draw.certificateCode}`;
  const date = new Date(draw.createdAt).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // QR em data URL (cores da marca)
  const qr = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 240,
    color: { dark: GOLD_HI, light: PANEL },
  });

  const isStory = format === "story";
  const W = 1080;
  const H = isStory ? 1920 : 1080;
  const multi = winners.length > 1;

  // tamanho do @ adaptado ao comprimento (evita estourar a borda em handles longos)
  const handle = main?.handle ?? "—";
  const handleLen = (handle.length || 6) + 1; // +1 do "@"
  const handleFont = Math.max(
    isStory ? 46 : 42,
    Math.min(isStory ? 118 : 96, Math.floor((isStory ? 1500 : 1320) / handleLen)),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          background: `radial-gradient(120% 80% at 50% 0%, #15122A 0%, ${VOID} 55%)`,
          padding: isStory ? "120px 80px" : "70px 80px",
          fontFamily: "sans-serif",
          color: INK_HI,
        }}
      >
        {/* topo: marca + selo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: INK_HI }}>Azura</span>
            <span style={{ color: GOLD_HI }}>sort</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 28,
              padding: "12px 26px",
              borderRadius: 999,
              border: `2px solid ${GOLD}`,
              background: "rgba(194,146,46,0.10)",
              color: GOLD_HI,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: CYAN }} />
            SORTEIO VERIFICADO
          </div>
        </div>

        {/* centro: vencedor */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {/* medalha (CSS puro — sem emoji) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              borderRadius: 999,
              border: `3px solid ${GOLD}`,
              background: "radial-gradient(circle at 50% 35%, rgba(232,194,107,0.28), rgba(13,15,23,0.6))",
              fontSize: 64,
              fontWeight: 900,
              color: GOLD_HI,
            }}
          >
            1
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, letterSpacing: 8, color: CYAN }}>
            {multi ? "VENCEDORES" : "VENCEDOR"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontSize: handleFont,
              fontWeight: 900,
              color: GOLD_HI,
              lineHeight: 1.05,
              maxWidth: 940,
              overflow: "hidden",
            }}
          >
            @{handle}
          </div>
          {multi && (
            <div style={{ display: "flex", marginTop: 14, fontSize: 34, color: INK_LO }}>
              + {winners.length - 1} {winners.length - 1 === 1 ? "ganhador" : "ganhadores"}
            </div>
          )}
          {draw.giveaway.campaign ? (
            <div style={{ display: "flex", marginTop: 26, fontSize: 32, color: INK_HI, maxWidth: 820, textAlign: "center" }}>
              {draw.giveaway.campaign}
            </div>
          ) : null}
        </div>

        {/* rodapé: prova + QR */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 36,
            width: "100%",
            padding: 36,
            borderRadius: 32,
            border: "1px solid rgba(255,255,255,0.08)",
            background: PANEL,
          }}
        >
          <img src={qr} width={200} height={200} style={{ borderRadius: 16 }} />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 24, color: INK_LO }}>Código do certificado</div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: GOLD_HI, letterSpacing: 2 }}>
              {draw.certificateCode}
            </div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 22, color: INK_LO }}>
              {date} · SHA-256 {draw.seedHash.slice(0, 12)}…
            </div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 22, color: CYAN }}>
              Verifique em azurasort.com/verify
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
