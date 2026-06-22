import type { Metadata } from "next";
import { GiveawaySimulator } from "@/components/sorteio/GiveawaySimulator";

export const metadata: Metadata = {
  title: "Simular sorteio · Prizegram",
  description: "Crie e teste um sorteio completo — importar, filtrar, sortear e revelar.",
};

export default function SorteioPage() {
  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <GiveawaySimulator />
    </main>
  );
}
