import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPrivacy } from "@/lib/legal/content";
import { LegalPage } from "../(legal)/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${getPrivacy(locale).title} · AzuraSort`, alternates: { canonical: `/${locale}/privacidade` } };
}

export default async function PrivacidadePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc={getPrivacy(locale)} locale={locale} />;
}
