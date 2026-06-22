"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// icones por indice — textos vem das traducoes
const ICONS = ["♾️", "📄", "🔁", "⏲️", "🔍", "🧩", "🛡️", "✦", "📊", "⚖️", "🏆", "🎯"];

type Item = { title: string; desc: string };

export function Features() {
  const t = useTranslations("features");
  const items = t.raw("items") as Item[];

  return (
    <section className="relative bg-canvasAlt">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">{t("label")}</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {t("title")} <span className="text-gold-deep">{t("titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-inkSoft">{t("subtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              className="group rounded-2xl border border-ink/5 bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-xl transition group-hover:bg-gold/20">
                {ICONS[i] ?? "•"}
              </div>
              <h3 className="font-display text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-inkSoft">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
