"use client";

import { motion } from "framer-motion";
import type { RevealSpec } from "@prizegram/reveal-spec";

/** Overlay HTML pos-reveal: vencedor + download dos 3 formatos de video + acoes. */
export function PostReveal({
  spec,
  onReplay,
}: {
  spec: RevealSpec;
  onReplay: () => void;
}) {
  const winner = spec.winners.find((w) => w.position === 1) ?? spec.winners[0];
  const formats: { key: string; label: string; ratio: string }[] = [
    { key: "VERTICAL", label: "9:16", ratio: "Reels / Stories" },
    { key: "HORIZONTAL", label: "16:9", ratio: "YouTube" },
    { key: "SQUARE", label: "1:1", ratio: "Feed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6 pb-10"
    >
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-neon-cyan">Vencedor</p>
        <h2 className="font-display text-3xl text-gold drop-shadow-[0_0_30px_rgba(232,194,107,0.5)]">
          {winner.displayName}
        </h2>
        <p className="text-lo">@{winner.handle}</p>
      </div>

      <div className="flex gap-3">
        {formats.map((f) => (
          <button
            key={f.key}
            className="flex flex-col items-center rounded-xl border border-white/10 bg-elevated/80 px-4 py-3 backdrop-blur transition hover:border-neon-cyan hover:shadow-neon-cyan"
          >
            <span className="font-display text-lg text-hi">{f.label}</span>
            <span className="text-[10px] text-lo">{f.ratio}</span>
            <span className="mt-1 text-[10px] text-neon-cyan">baixar MP4 ↓</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 text-sm">
        <button className="rounded-lg border border-gold/40 px-4 py-2 text-gold transition hover:bg-gold/10">
          Certificado de transparencia
        </button>
        <button
          onClick={onReplay}
          className="rounded-lg border border-white/10 px-4 py-2 text-lo transition hover:text-hi"
        >
          ↻ Refazer
        </button>
      </div>

      {spec.branding.watermark && (
        <p className="text-[10px] tracking-widest text-lo/70">Made with AzuraSort</p>
      )}
    </motion.div>
  );
}
