import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GiveawaySimulator } from "@/components/sorteio/GiveawaySimulator";

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
  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <GiveawaySimulator />
    </main>
  );
}
