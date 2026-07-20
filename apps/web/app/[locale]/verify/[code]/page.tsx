import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { sha256, verifyFromParticipants } from "@/lib/draw/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/seo/content";

export const dynamic = "force-dynamic";

/**
 * 🔗 PREVIEW DO CERTIFICADO — o link mais compartilhado do produto.
 *
 * O cliente manda esta pagina pros seguidores dele pra provar que o sorteio foi
 * limpo. Sem metadata, ela aparecia como um RETANGULO EM BRANCO no WhatsApp,
 * Story e Telegram: sem titulo, sem imagem, sem descricao — desperdicando o
 * unico canal de aquisicao organico que a operacao ja gera sozinha.
 *
 * ⚠️ robots: noindex de proposito. Nao e SEO — ninguem busca "certificado
 * ABC123". E a pagina expoe @ de participantes: compartilhar com o publico do
 * organizador e uma coisa, deixar o Google indexar o @ de cada participante
 * permanentemente e outra (LGPD). O valor esta em COMPARTILHAR, nao em indexar.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const t = await getTranslations({ locale, namespace: "sim.verify" });
  const draw = await db.draw.findUnique({
    where: { certificateCode: code.toUpperCase() },
    include: { giveaway: true, winners: { orderBy: { position: "asc" } } },
  });

  // ⚠️ o preview tem que dizer a VERDADE: um certificado que nao confere nao pode
  // ser compartilhado como "Sorteio verificado". Mesma checagem da pagina.
  const principais = draw?.winners.filter((w) => !w.isBackup) ?? [];
  const participantes = (draw?.participants as string[] | null) ?? [];
  const seedOk = draw?.seed ? sha256(draw.seed) === draw.seedHash : false;
  const bate =
    draw?.seed &&
    verifyFromParticipants(participantes, draw.seed, principais.length).join("|") ===
      principais.map((w) => w.handle).join("|");
  const valido = Boolean(seedOk && bate && !draw?.rigged);

  const campanha = draw?.giveaway?.campaign?.trim();
  const vencedor = principais[0]?.handle;
  const selo = valido ? t("okTitle") : t("failTitle");
  const title = campanha ? `${selo} · ${campanha} — AzuraSort` : `${selo} — AzuraSort`;
  const description = valido && vencedor ? `@${vencedor} — ${t("okDesc")}` : valido ? t("okDesc") : t("failDesc");

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/${locale}/verify/${code}`,
      siteName: "AzuraSort",
      locale,
      type: "article",
      images: [{ url: `${SITE.url}/opengraph-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE.url}/opengraph-image.png`],
    },
  };
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const t = await getTranslations({ locale, namespace: "sim.verify" });
  const draw = await db.draw.findUnique({
    where: { certificateCode: code.toUpperCase() },
    include: { giveaway: true, winners: { orderBy: { position: "asc" } } },
  });
  if (!draw) notFound();

  const winnersMain = draw.winners.filter((w) => !w.isBackup);
  const backups = draw.winners.filter((w) => w.isBackup);
  const participants = (draw.participants as string[] | null) ?? [];

  const seedOk = draw.seed ? sha256(draw.seed) === draw.seedHash : false;
  const recomputed = draw.seed ? verifyFromParticipants(participants, draw.seed, winnersMain.length) : [];
  const winnersMatch = recomputed.join("|") === winnersMain.map((w) => w.handle).join("|");
  const valid = seedOk && winnersMatch && !draw.rigged;

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Azura<span className="text-gold-deep">sort</span>
        </Link>

        <div className="mt-8 rounded-3xl border border-ink/5 bg-surface p-8 shadow-card">
          {/* selo */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`grid h-16 w-16 place-items-center rounded-full text-3xl ${
                valid ? "bg-emerald/15 text-emerald" : "bg-rose/15 text-rose"
              }`}
            >
              {valid ? "✓" : "⚠"}
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-ink">
              {valid ? t("okTitle") : t("failTitle")}
            </h1>
            <p className="mt-1 text-sm text-inkSoft">
              {valid ? t("okDesc") : t("failDesc")}
            </p>
            <p className="mt-3 font-mono text-sm text-gold-deep">{draw.certificateCode}</p>
          </div>

          {/* vencedores */}
          <div className="mt-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-inkSoft">{t("winners")}</p>
            <div className="space-y-2">
              {winnersMain.map((w) => (
                <div key={w.id} className="flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/5 px-4 py-3">
                  <span className="font-display font-bold text-gold-deep">#{w.position}</span>
                  <span className="text-ink">@{w.handle}</span>
                </div>
              ))}
              {backups.map((w) => (
                <div key={w.id} className="flex items-center gap-3 rounded-xl border border-ink/5 bg-canvasAlt px-4 py-3">
                  <span className="font-display font-bold text-inkSoft">S{w.position - winnersMain.length}</span>
                  <span className="text-inkSoft">@{w.handle} · {t("backup")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* prova técnica */}
          <div className="mt-8 space-y-3 rounded-2xl border border-ink/5 bg-canvasAlt p-4 text-sm">
            <Row label={t("rowDraw")} value={draw.giveaway.campaign} />
            <Row label={t("rowEligible")} value={`${Math.max(draw.totalCount, participants.length).toLocaleString()}`} />
            <Row label={t("rowDate")} value={new Date(draw.createdAt).toLocaleString(locale)} />
            <Row label={t("rowAlgo")} value={draw.algorithm} mono />
            <Row label={t("rowHash")} value={draw.seedHash} mono break />
            <Row label={t("rowSeed")} value={draw.seed ?? "—"} mono break />
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className={seedOk ? "text-emerald" : "text-rose"}>{seedOk ? "✓" : "✗"} {t("checkHash")}</span>
              <span className={winnersMatch ? "text-emerald" : "text-rose"}>{winnersMatch ? "✓" : "✗"} {t("checkWinners")}</span>
            </div>
          </div>

          {/* baixar certificado-imagem pronto pro Instagram */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a
              href={`/api/certificate/${draw.certificateCode}?format=story&locale=${locale}`}
              download={`certificado-${draw.certificateCode}-story.png`}
              className="rounded-lg border border-gold/40 bg-gold/5 px-4 py-2 text-xs font-semibold text-gold-deep transition hover:bg-gold/10"
            >
              ⬇ Story 9:16
            </a>
            <a
              href={`/api/certificate/${draw.certificateCode}?format=feed&locale=${locale}`}
              download={`certificado-${draw.certificateCode}-feed.png`}
              className="rounded-lg border border-gold/40 bg-gold/5 px-4 py-2 text-xs font-semibold text-gold-deep transition hover:bg-gold/10"
            >
              ⬇ Feed 1:1
            </a>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-inkSoft">
            {t("how")}
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-inkSoft">
          <Link href="/" className="text-gold-deep hover:underline">azurasort.com</Link> · {t("tagline")}
        </p>
      </div>
    </main>
  );
}

function Row({ label, value, mono, break: brk }: { label: string; value: string; mono?: boolean; break?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-inkSoft">{label}</span>
      <span className={`text-ink ${mono ? "font-mono text-xs" : ""} ${brk ? "break-all text-right" : "text-right"}`}>{value}</span>
    </div>
  );
}
