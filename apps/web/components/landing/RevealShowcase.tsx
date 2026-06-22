"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { VideoReveal } from "@/components/reveal/VideoReveal";
import { buildStageHostSpec } from "@/lib/demoSpecs";

/**
 * Exemplo ao vivo embutido na landing: a cena "Palco com Apresentadora" rodando
 * de verdade (mesma engine), em loop, dentro de uma moldura de aparelho clara
 * e premium. A tela (cena) e escura de proposito — cinema.
 */
export function RevealShowcase() {
  const [spec] = useState(() => buildStageHostSpec("showcase", "pt-BR"));

  return (
    <div className="relative mx-auto w-full max-w-[330px]">
      {/* halo dourado suave */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gold-hi/25 blur-3xl" />

      {/* aparelho (bezel claro) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[2.6rem] border border-ink/5 bg-surface p-2.5 shadow-lift"
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] bg-void">
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
          <VideoReveal spec={spec} loop />
          {/* selo de formato */}
          <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-md bg-black/35 px-2 py-1 text-[10px] tracking-widest text-white backdrop-blur">
            9:16
          </div>
        </div>
      </motion.div>

      <p className="mt-5 text-center text-xs text-inkSoft">
        Exemplo real · cena <span className="font-medium text-gold-deep">Palco com Apresentadora</span>
      </p>
    </div>
  );
}
