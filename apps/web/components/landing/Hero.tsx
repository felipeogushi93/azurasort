"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealShowcase } from "./RevealShowcase";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-70" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-2 lg:gap-8 lg:pt-40">
        {/* coluna texto */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-inkSoft shadow-soft"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Sorteio justo e verificável · SHA-256
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            Sorteios de Instagram
            <br />
            com{" "}
            <span className="bg-gradient-to-r from-gold-deep via-gold to-gold-hi bg-clip-text text-transparent">
              final de cinema.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-inkSoft lg:mx-0"
          >
            Sorteie entre os comentários de forma justa e auditável — e revele o
            vencedor como uma cena de cinema, com vídeo pronto para compartilhar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/sorteio" className="btn-gold text-base">
              Criar meu sorteio →
            </Link>
            <a href="#como-funciona" className="btn-ghost text-base">
              Como funciona
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-inkSoft lg:justify-start"
          >
            <span className="flex items-center gap-1.5">🔒 Resultado verificável</span>
            <span className="flex items-center gap-1.5">🎬 Revelação cinematográfica</span>
            <span className="flex items-center gap-1.5">🎞️ Vídeo 9:16 · 16:9 · 1:1</span>
          </motion.div>
        </div>

        {/* coluna showcase */}
        <div className="flex justify-center lg:justify-end">
          <RevealShowcase />
        </div>
      </div>
    </section>
  );
}
