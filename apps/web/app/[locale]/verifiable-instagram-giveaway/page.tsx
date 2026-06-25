import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PillarArticle } from "@/components/seo/PillarArticle";
import { pillarMetadata } from "@/lib/seo/pillars/registry";

const SLUG = "verifiable-instagram-giveaway";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pillarMetadata(locale, SLUG);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PillarArticle locale={locale} slug={SLUG} />;
}
