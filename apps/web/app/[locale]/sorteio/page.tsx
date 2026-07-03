import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GiveawaySimulator } from "@/components/sorteio/GiveawaySimulator";
import { SupportNote } from "@/components/SupportNote";
import { currencyForLocale } from "@/lib/payments/pricing";

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

  // moeda pela LOCALIZAÇÃO escolhida (/pt-br→BRL, /es→EUR, demais→USD)
  const currency = currencyForLocale(locale);

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <GiveawaySimulator currency={currency} />
      <SupportNote locale={locale} />
    </main>
  );
}
