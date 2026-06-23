import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTerms } from "@/lib/legal/content";
import { LegalPage } from "../(legal)/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${getTerms(locale).title} · AzuraSort`, alternates: { canonical: `/${locale}/termos` } };
}

export default async function TermosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc={getTerms(locale)} locale={locale} />;
}
