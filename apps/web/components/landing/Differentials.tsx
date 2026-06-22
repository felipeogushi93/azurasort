"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const ICONS = ["🎞️", "🛡️", "🔐", "📡", "🪞", "⚡"];

type Item = { title: string; desc: string };

export function Differentials() {
  const t = useTranslations("diff");
  const items = t.raw("items") as Item[];

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-14 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">{t("label")}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("title")} <span className="text-gold-deep">{t("titleHighlight")}</span>
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="rounded-2xl border border-ink/5 bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="mb-3 text-3xl">{ICONS[i] ?? "•"}</div>
            <h3 className="font-display text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-inkSoft">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
