"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

type QA = { q: string; a: string };

function Item({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-ink/5 bg-surface shadow-soft">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:text-gold-deep"
      >
        <span className="font-display text-base font-semibold text-ink sm:text-lg">{q}</span>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/15 text-inkSoft transition ${
            open ? "rotate-45 border-gold text-gold-deep" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 leading-relaxed text-inkSoft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as QA[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative mx-auto max-w-3xl px-6 py-28">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">{t("label")}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-inkSoft">{t("subtitle")}</p>
      </div>

      <div>
        {items.map((item, i) => (
          <Item
            key={item.q}
            q={item.q}
            a={item.a}
            open={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
