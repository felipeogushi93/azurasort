import type { Metadata } from "next";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { GiveawaySimulator } from "@/components/sorteio/GiveawaySimulator";
import { currencyForCountry, currencyForLocale } from "@/lib/payments/pricing";

export const metadata: Metadata = {
  title: "Simular sorteio · AzuraSort",
  description: "Crie e teste um sorteio completo — importar, filtrar, sortear e revelar.",
};

export default async function SorteioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // moeda pelo país do visitante (geo Vercel); fallback pelo locale (ex.: dev local)
  const country = (await headers()).get("x-vercel-ip-country");
  const currency = country ? currencyForCountry(country) : currencyForLocale(locale);

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <GiveawaySimulator currency={currency} />
    </main>
  );
}
