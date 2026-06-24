"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Scene = { name: string; emoji: string; tier: 1 | 2 | 3; live?: boolean; href?: string };

const SCENES: Scene[] = [
  { name: "Bank Vault", emoji: "🔐", tier: 1, live: true, href: "/sorteio" },
  { name: "Countdown", emoji: "⏱️", tier: 1, live: true, href: "/sorteio" },
  { name: "Casino / Roulette", emoji: "🎰", tier: 2 },
  { name: "Matrix", emoji: "🟢", tier: 1, live: true, href: "/sorteio" },
  { name: "Dimensional Portal", emoji: "🌀", tier: 2 },
  { name: "Horse Race", emoji: "🐎", tier: 3 },
  { name: "Treasure Cave", emoji: "💰", tier: 3 },
  { name: "Neon Cyberpunk", emoji: "🌃", tier: 3 },
  { name: "AI Oracle", emoji: "🤖", tier: 3 },
  { name: "Fireworks", emoji: "🎆", tier: 3 },
];

export function SceneGallery() {
  const t = useTranslations("gallery");

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-14 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">{t("label")}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          <span className="text-gold-deep">{t("titleNum")}</span> {t("titleRest")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-inkSoft">{t("subtitle")}</p>
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
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" /> {t("live")}
                  </span>
                ) : (
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-inkSoft">
                    {t("soon")}
                  </span>
                )}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-ink">{s.name}</p>
                <p className="text-[10px] text-inkSoft">{t("tier", { n: s.tier })}</p>
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
