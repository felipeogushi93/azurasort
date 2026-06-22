"use client";

import type { RevealPhase } from "./engine/useRevealClock";

/**
 * Placeholder de palco em CSS — usado quando nenhum video real foi plugado.
 * Holofote animado + silhueta de apresentadora de vestido longo.
 * Deixa claro onde entra o clipe real (IA / stock / filmagem).
 */
export function StagePlaceholder({
  gold,
  phase,
}: {
  gold: string;
  phase: RevealPhase;
}) {
  const lit = phase === "reveal" || phase === "celebrate";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* fundo do palco */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #14161f 0%, #0a0b12 45%, #05060a 100%)",
        }}
      />

      {/* piso refletivo */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(232,194,107,0.08), transparent)",
        }}
      />

      {/* feixe do holofote */}
      <div
        className="absolute left-1/2 top-0 h-full w-[70%] -translate-x-1/2 animate-spotlight"
        style={{
          background: `radial-gradient(60% 70% at 50% 18%, ${gold}33, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      {/* silhueta da apresentadora */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        {/* cabeca */}
        <div
          className="mx-auto h-10 w-10 rounded-full"
          style={{
            background: "#070810",
            boxShadow: `0 0 18px ${gold}55, inset -3px -3px 8px rgba(0,0,0,0.6)`,
          }}
        />
        {/* corpo / vestido longo */}
        <div
          className="-mt-1 h-56 w-44"
          style={{
            background: "linear-gradient(180deg, #0b0c14 0%, #07080d 100%)",
            clipPath:
              "polygon(38% 0%, 62% 0%, 70% 18%, 60% 30%, 92% 100%, 8% 100%, 40% 30%, 30% 18%)",
            filter: `drop-shadow(0 0 22px ${gold}40)`,
          }}
        />
      </div>

      {/* brilho extra no reveal */}
      {lit && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 50% at 50% 35%, ${gold}22, transparent 70%)`,
          }}
        />
      )}

      {/* etiqueta: onde entra o video real */}
      <div className="absolute left-1/2 top-3 -translate-x-1/2">
        <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[9px] uppercase tracking-widest text-lo backdrop-blur">
          ▶ video real entra aqui (IA / stock)
        </span>
      </div>
    </div>
  );
}
