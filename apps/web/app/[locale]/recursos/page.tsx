import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/seo/content";
import { isRtl } from "@/i18n/routing";
import { PROGRAMMATIC_LOCALES, topicsForLocale } from "@/lib/seo/programmatic";

// hub só nos idiomas com conteúdo programático
export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRAMMATIC_LOCALES.map((locale) => ({ locale }));
}

const COPY: Record<string, { title: string; h1: string; intro: string }> = {
  es: {
    title: "Guías y recursos para sorteos en Instagram — AzuraSort",
    h1: "Guías y recursos para sorteos en Instagram",
    intro: "Todo lo que necesitas para hacer sorteos en Instagram de forma justa, rápida y verificable: comentarios, likes, reels, varios ganadores, revelación en vídeo y más.",
  },
  "fr-ma": {
    title: "Guides et ressources pour vos tirages au sort Instagram — AzuraSort",
    h1: "Guides et ressources pour vos tirages au sort Instagram",
    intro: "Tout ce qu'il faut pour organiser un tirage au sort Instagram équitable, rapide et vérifiable : commentaires, likes, reels, plusieurs gagnants, révélation en vidéo et plus.",
  },
  "ar-ma": {
    title: "أدلة وموارد لقرعات انستغرام — AzuraSort",
    h1: "أدلة وموارد لقرعات انستغرام",
    intro: "كل ما تحتاجه لإجراء قرعة انستغرام عادلة وسريعة وقابلة للتحقق: التعليقات، الإعجابات، الريلز، عدة فائزين، الكشف بالفيديو والمزيد.",
  },
  en: {
    title: "Instagram giveaway guides & resources — AzuraSort",
    h1: "Instagram giveaway guides & resources",
    intro: "Everything you need to run a fair, fast and verifiable Instagram giveaway: comments, likes, reels, multiple winners, video reveal and more.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[locale] ?? COPY.en;
  const languages: Record<string, string> = {};
  for (const l of PROGRAMMATIC_LOCALES) languages[l] = `/${l}/recursos`;
  return {
    title: c.title,
    description: c.intro,
    alternates: { canonical: `/${locale}/recursos`, languages },
  };
}

export default async function RecursosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = COPY[locale] ?? COPY.en;
  const topics = topicsForLocale(locale);
  const rtl = isRtl(locale);

  return (
    <main className="min-h-screen bg-canvas" dir={rtl ? "rtl" : "ltr"}>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-violet hover:underline">← {SITE.name}</Link>
        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{c.h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-inkSoft">{c.intro}</p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {topics.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/${t.slug}`}
                className="block rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-gold/40"
              >
                <p className="font-semibold text-ink">{t.h1}</p>
                <p className="mt-1 line-clamp-2 text-sm text-inkSoft">{t.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
