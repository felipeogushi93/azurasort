"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Scene = { name: string; emoji: string; tier: 1 | 2 | 3; live?: boolean; href?: string };

const SCENES: Scene[] = [
  { name: "Palco com Apresentadora", emoji: "🎤", tier: 1, live: true, href: "/reveal/stage" },
  { name: "Envelope Dourado", emoji: "✉️", tier: 1, live: true, href: "/reveal/demo" },
  { name: "Cofre de Banco", emoji: "🔐", tier: 1 },
  { name: "Holograma", emoji: "🛸", tier: 1 },
  { name: "Matrix de Comentarios", emoji: "🟢", tier: 1 },
  { name: "Cassino / Roleta", emoji: "🎰", tier: 2 },
  { name: "Loot Box Gamer", emoji: "📦", tier: 2 },
  { name: "Tapete Vermelho", emoji: "🎭", tier: 2 },
  { name: "IA Oraculo", emoji: "🤖", tier: 2 },
  { name: "Telao de Estadio", emoji: "🏟️", tier: 2 },
  { name: "Portal Dimensional", emoji: "🌀", tier: 3 },
  { name: "Galaxia", emoji: "🌌", tier: 3 },
  { name: "Tempestade", emoji: "⚡", tier: 3 },
  { name: "Fogos de Artificio", emoji: "🎆", tier: 3 },
  { name: "Maquina da Sorte", emoji: "🎱", tier: 3 },
  { name: "Caca-niquel", emoji: "🎟️", tier: 3 },
  { name: "Tela Quebrando", emoji: "💥", tier: 3 },
  { name: "Caixa de Presente", emoji: "🎁", tier: 3 },
  { name: "Neon Cyberpunk", emoji: "🌃", tier: 3 },
  { name: "Caverna do Tesouro", emoji: "💰", tier: 3 },
  { name: "Speedrun de Nomes", emoji: "📜", tier: 3 },
  { name: "Origami", emoji: "🦢", tier: 3 },
  { name: "Mensagem na Garrafa", emoji: "🍾", tier: 3 },
  { name: "Lancamento de Foguete", emoji: "🚀", tier: 3 },
];

export function SceneGallery() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-14 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">A galeria</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          <span className="text-gold-deep">24</span> formas de revelar um vencedor
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-inkSoft">
          Cada cena tem roteiro, câmera, iluminação e som próprios. Escolha o clima do seu
          sorteio — do Oscar ao cassino, do futuro ao tesouro.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SCENES.map((s, i) => {
          const card = (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              className={`group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border p-4 transition ${
                s.live
                  ? "border-gold/40 bg-gradient-to-br from-gold/10 to-surface shadow-gold hover:-translate-y-1"
                  : "border-ink/5 bg-surface shadow-soft hover:-translate-y-1 hover:shadow-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl transition group-hover:scale-110">{s.emoji}</span>
                {s.live ? (
                  <span className="flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-deep">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" /> ao vivo
                  </span>
                ) : (
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-inkSoft">
                    em breve
                  </span>
                )}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-ink">{s.name}</p>
                <p className="text-[10px] text-inkSoft">Tier {s.tier}</p>
              </div>
            </motion.div>
          );
          return s.live ? (
            <Link key={s.name} href={s.href ?? "/reveal/demo"}>
              {card}
            </Link>
          ) : (
            <div key={s.name}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
