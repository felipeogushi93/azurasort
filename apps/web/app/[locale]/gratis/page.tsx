import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FreeDraw } from "@/components/sorteio/FreeDraw";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/seo/content";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "free" });
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}/gratis`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/gratis`, languages },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${SITE.url}/${locale}/gratis`, type: "website" },
  };
}

export default async function GratisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <FreeDraw />
    </main>
  );
}
