"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CofreReveal } from "@/components/reveal/CofreReveal";

/**
 * Exemplo ao vivo embutido na landing: roda o vídeo real da "Contagem regressiva"
 * (vertical 9:16) com o @ do vencedor em dourado, dentro de uma moldura premium.
 */
export function RevealShowcase() {
  const t = useTranslations("showcase");

  return (
    <div className="relative mx-auto w-full max-w-[330px]">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gold-hi/25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[2.6rem] border border-ink/5 bg-surface p-2.5 shadow-lift"
      >
        <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] bg-void">
          <div className="absolute left-1/2 top-2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
          <CofreReveal
            handle="mari.costa"
            src="/contagem.mp4"
            revealAtSec={15.9}
            showBand={false}
            textLeft={50}
            textTop={50}
            fontScale={0.06}
            loop
            silent
            suspenseMs={0}
          />
          <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-md bg-black/35 px-2 py-1 text-[10px] tracking-widest text-white backdrop-blur">
            9:16
          </div>
        </div>
      </motion.div>

      <p className="mt-5 text-center text-xs text-inkSoft">{t("caption")}</p>
    </div>
  );
}
