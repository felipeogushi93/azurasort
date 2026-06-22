"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import type { RevealSpec } from "@prizegram/reveal-spec";
import { useRevealClock } from "./engine/useRevealClock";
import { getScene } from "./registry";
import { PostReveal } from "./PostReveal";

export type RevealVariant = "page" | "embed";

/**
 * RevealStage — a EXPERIENCIA.
 *
 * variant "page"  : tela cheia, com painel completo de download pos-reveal.
 * variant "embed" : preenche o container pai, em loop, com badge compacto
 *                   do vencedor (para a galeria/landing).
 *
 * `overrideMs` permite ao render de video (Remotion) injetar o tempo do frame
 * para reproduzir exatamente a mesma cena (paridade tela <-> video).
 */
export function RevealStage({
  spec,
  overrideMs,
  variant = "page",
  loop = false,
}: {
  spec: RevealSpec;
  overrideMs?: number;
  variant?: RevealVariant;
  loop?: boolean;
}) {
  const [runId, setRunId] = useState(0);
  const clock = useRevealClock(spec.timeline, { overrideMs, loop });
  const Scene = getScene(spec.module);
  const isEmbed = variant === "embed";

  if (!Scene) {
    return (
      <div className="flex h-full w-full items-center justify-center text-lo">
        Cena &quot;{spec.module}&quot; ainda nao implementada.
      </div>
    );
  }

  const winner = spec.winners.find((w) => w.position === 1) ?? spec.winners[0];

  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      <Canvas
        key={runId}
        dpr={[1, 2]}
        camera={{ fov: 38, position: [0, 0, 6] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#05060A"]} />
        <fog attach="fog" args={["#05060A", 6, 14]} />
        <Scene spec={spec} clock={clock} />
      </Canvas>

      {/* barra de suspense sutil */}
      {!clock.revealed && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-neon-cyan transition-[width] duration-100"
              style={{ width: `${Math.round(clock.progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* PAGE: botao reiniciar + painel completo */}
      {!isEmbed && (
        <>
          {!clock.revealed && overrideMs === undefined && (
            <button
              className="absolute right-5 top-5 text-xs text-lo transition hover:text-hi"
              onClick={() => setRunId((n) => n + 1)}
            >
              reiniciar ↻
            </button>
          )}
          <AnimatePresence>
            {clock.phase === "celebrate" && overrideMs === undefined && (
              <PostReveal spec={spec} onReplay={() => setRunId((n) => n + 1)} />
            )}
          </AnimatePresence>
        </>
      )}

      {/* EMBED: badge compacto do vencedor */}
      {isEmbed && (
        <AnimatePresence>
          {clock.phase === "celebrate" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 pb-6"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan">
                Vencedor
              </span>
              <span className="font-display text-2xl text-gold drop-shadow-[0_0_24px_rgba(232,194,107,0.5)]">
                {winner.displayName}
              </span>
              <span className="rounded-full bg-elevated/80 px-3 py-1 text-[10px] text-lo backdrop-blur">
                ✓ video 9:16 · 16:9 · 1:1 gerado
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
