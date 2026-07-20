import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GiveawaySimulator } from "@/components/sorteio/GiveawaySimulator";
import { SupportNote } from "@/components/SupportNote";
import { currencyForLocale } from "@/lib/payments/pricing";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/seo/content";

/** Textos por idioma — antes era PT fixo em todos os locales. */
const COPY: Record<string, { title: string; description: string }> = {
  "pt-br": {
    title: "Fazer sorteio no Instagram · AzuraSort",
    description: "Cole o link do post, sorteie um ganhador aleatório e receba o vídeo da revelação com certificado verificável.",
  },
  en: {
    title: "Run an Instagram giveaway · AzuraSort",
    description: "Paste your post link, draw a random winner and get a cinematic reveal video with a verifiable certificate.",
  },
  es: {
    title: "Hacer un sorteo en Instagram · AzuraSort",
    description: "Pega el enlace de tu publicación, sortea un ganador aleatorio y recibe el vídeo de la revelación con certificado verificable.",
  },
  "fr-ma": {
    title: "Faire un tirage au sort Instagram · AzuraSort",
    description: "Collez le lien de votre publication, tirez un gagnant au hasard et recevez la vidéo de révélation avec certificat vérifiable.",
  },
  "ar-ma": {
    title: "إجراء سحب على إنستغرام · AzuraSort",
    description: "الصق رابط منشورك، اسحب فائزًا عشوائيًا واحصل على فيديو الكشف مع شهادة قابلة للتحقق.",
  },
};

/**
 * ⚠️ generateMetadata é OBRIGATÓRIO aqui. Um `export const metadata` sem
 * `alternates` HERDA o canonical do layout — que aponta pra HOME. Resultado: esta
 * página (a que converte) se auto-desindexava, mandando o Google consolidá-la na home.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[locale] ?? COPY.en;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}/sorteio`;
  languages["x-default"] = "/en/sorteio";
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/${locale}/sorteio`, languages },
    openGraph: {
      title: c.title,
      description: c.description,
      url: `${SITE.url}/${locale}/sorteio`,
      siteName: "AzuraSort",
      locale,
      type: "website",
    },
  };
}

export default async function SorteioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // moeda pela LOCALIZAÇÃO escolhida (/pt-br→BRL, /es→EUR, demais→USD)
  const currency = currencyForLocale(locale);

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <GiveawaySimulator currency={currency} />
      <SupportNote locale={locale} />
    </main>
  );
}
