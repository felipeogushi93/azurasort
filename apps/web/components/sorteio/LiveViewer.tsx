"use client";

import { useState } from "react";
import type { RevealSpec } from "@prizegram/reveal-spec";
import { CofreReveal } from "@/components/reveal/CofreReveal";
import { VideoReveal } from "@/components/reveal/VideoReveal";
import { RevealErrorBoundary } from "./RevealErrorBoundary";
import { useLiveRoom, type LiveMessage } from "@/lib/live/useLiveRoom";

/** Renderiza a revelação a partir do spec (mesma lógica do organizador). */
function RevealFromSpec({ spec }: { spec: RevealSpec }) {
  const handle = (spec.winners.find((w) => w.position === 1) ?? spec.winners[0])?.handle ?? "";
  if (spec.module === "bank_vault")
    return <CofreReveal handle={handle} suspenseMs={900} openingLabel="Abrindo o cofre…" soundLabel="🔊 Ativar som" />;
  if (spec.module === "countdown")
    return <CofreReveal handle={handle} src="/contagem.mp4" revealAtSec={15.9} suspenseMs={0} showBand={false} textLeft={50} textTop={50} fontScale={0.04} openingLabel="Preparando…" soundLabel="🔊 Ativar som" />;
  if (spec.module === "comment_matrix")
    return <CofreReveal handle={handle} src="/matrix.mp4" revealAtSec={14.9} suspenseMs={0} showBand={false} textLeft={50} textTop={48} fontScale={0.05} openingLabel="Preparando…" soundLabel="🔊 Ativar som" />;
  return <div className="h-full w-full"><VideoReveal spec={spec} /></div>;
}

export function LiveViewer({ id }: { id: string }) {
  const [campaign, setCampaign] = useState<string>("");
  const [spec, setSpec] = useState<RevealSpec | null>(null);

  function onMessage(m: LiveMessage) {
    if (m.type === "hello" && typeof m.campaign === "string") setCampaign(m.campaign);
    if (m.type === "start" && m.spec) {
      if (typeof m.campaign === "string") setCampaign(m.campaign);
      setSpec(m.spec as RevealSpec);
    }
    if (m.type === "end") setSpec(null);
  }

  const { count, connected, configured } = useLiveRoom(id, "viewer", onMessage);

  // sala indisponível (sem realtime configurado)
  if (configured === false) {
    return (
      <main className="grid min-h-screen place-items-center bg-void px-6 text-center">
        <div>
          <p className="font-display text-2xl font-bold text-white">Transmissão indisponível</p>
          <p className="mt-2 text-sm text-white/60">Esta live não está ativa no momento.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-void">
      {/* topo: AO VIVO + espectadores */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
        <span className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ao vivo
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          👁 {Math.max(count, 1).toLocaleString("pt-BR")}
        </span>
      </div>

      {spec ? (
        <div className="h-screen w-full">
          <RevealErrorBoundary onClose={() => {}} label="">
            <RevealFromSpec spec={spec} />
          </RevealErrorBoundary>
        </div>
      ) : (
        <div className="grid min-h-screen place-items-center px-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl">🎬</span>
            {campaign && <p className="font-display text-2xl font-bold text-white">{campaign}</p>}
            <p className="text-sm text-white/70">
              {connected ? "Aguardando o organizador iniciar o sorteio…" : "Conectando à transmissão…"}
            </p>
            <span className="mt-2 h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-gold" />
            <p className="mt-6 text-xs text-white/40">AzuraSort · sorteio ao vivo verificável</p>
          </div>
        </div>
      )}
    </main>
  );
}
