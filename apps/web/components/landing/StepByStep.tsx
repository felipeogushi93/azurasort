"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- mocks visuais proprios (light premium) ---------- */

function Frame({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-ink/5 bg-surface p-4 shadow-card">{children}</div>;
}

// 1 — conectar publicacao (cole o link / copiar link)
function LinkMock() {
  return (
    <div className="w-60 space-y-3">
      <Frame>
        <div className="mb-2 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet to-rose" />
          <div className="h-2 w-20 rounded bg-ink/20" />
          <span className="ml-auto rounded-md bg-ink/5 px-1.5 text-inkSoft">•••</span>
        </div>
        <div className="h-24 rounded-xl bg-gradient-to-br from-[#fce8c9] via-[#f3d7e2] to-[#dfe6ff]" />
        <div className="mt-2 flex justify-end">
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-deep">
            📋 copiar link
          </span>
        </div>
      </Frame>
      <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-surface p-2.5 shadow-soft">
        <span className="text-rose">🔗</span>
        <span className="truncate text-xs text-inkSoft">instagram.com/p/Cx9k2…</span>
        <span className="ml-auto rounded-md bg-gradient-to-b from-gold-hi to-gold px-2 py-1 text-[10px] font-semibold text-ink">
          colar
        </span>
      </div>
    </div>
  );
}

// 2 — comentarios ou curtidas
function BaseMock() {
  return (
    <div className="w-60">
      <Frame>
        <p className="mb-3 text-xs uppercase tracking-widest text-inkSoft">Base do sorteio</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
            <span className="flex items-center gap-2 text-ink">💬 Comentários</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-[11px] text-void">✓</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3">
            <span className="flex items-center gap-2 text-inkSoft">❤️ Curtidas</span>
            <span className="h-5 w-5 rounded-full border border-ink/15" />
          </div>
        </div>
      </Frame>
    </div>
  );
}

// 3 — escolher a animacao (+ ao vivo + cortes)
function AnimationMock() {
  return (
    <div className="w-64">
      <Frame>
        <p className="mb-3 text-xs uppercase tracking-widest text-inkSoft">Animação da revelação</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { e: "✉️", on: true },
            { e: "🔐", on: false },
            { e: "🎤", on: false },
          ].map((s, i) => (
            <div
              key={i}
              className={`grid h-14 place-items-center rounded-xl border text-2xl ${
                s.on ? "border-gold bg-gold/10 shadow-gold" : "border-ink/10 bg-canvasAlt"
              }`}
            >
              {s.e}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-canvasAlt px-3 py-2">
          <span className="flex items-center gap-2 text-sm text-ink">🔴 Transmitir ao vivo</span>
          <span className="h-4 w-7 rounded-full bg-rose/80 p-0.5">
            <span className="block h-3 w-3 translate-x-3 rounded-full bg-surface" />
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold-deep">cortes 9:16</span>
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold-deep">16:9</span>
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold-deep">1:1</span>
        </div>
      </Frame>
    </div>
  );
}

// 4 — contagem regressiva
function CountdownMock() {
  return (
    <div className="w-60">
      <Frame>
        <p className="text-center text-xs uppercase tracking-widest text-inkSoft">contagem regressiva</p>
        <p className="my-2 text-center font-display text-5xl font-semibold text-gold-deep">08</p>
        <div className="flex justify-center gap-2">
          <span className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-inkSoft">participantes</span>
          <span className="rounded-full bg-gradient-to-b from-gold-hi to-gold px-3 py-1.5 text-xs font-semibold text-ink">iniciar</span>
        </div>
      </Frame>
    </div>
  );
}

// 5 — compartilhar resultados + cortes prontos
function ResultMock() {
  return (
    <div className="w-60 space-y-3">
      <div className="rounded-2xl border border-emerald/20 bg-emerald/5 p-4 text-center shadow-soft">
        <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-emerald/15 text-emerald">✓</div>
        <p className="text-sm text-ink">Resultado salvo</p>
        <p className="text-[10px] text-inkSoft">via AzuraSort</p>
      </div>
      <Frame>
        <p className="text-[10px] uppercase tracking-widest text-inkSoft">cortes prontos para postar</p>
        <div className="mt-2 flex gap-2">
          <span className="flex-1 rounded-lg bg-canvasAlt py-2 text-center text-[10px] text-ink">⬇ 9:16</span>
          <span className="flex-1 rounded-lg bg-canvasAlt py-2 text-center text-[10px] text-ink">⬇ 16:9</span>
          <span className="flex-1 rounded-lg bg-canvasAlt py-2 text-center text-[10px] text-ink">⬇ 1:1</span>
        </div>
      </Frame>
    </div>
  );
}

/* --------------------------------- steps --------------------------------- */

type StepText = { title: string; desc: string; tips?: string[] };

// visual (emoji + mock) por indice — o texto vem das traducoes
const STEP_VISUALS: { n: string; emoji: string; mock: ReactNode }[] = [
  { n: "01", emoji: "🔗", mock: <LinkMock /> },
  { n: "02", emoji: "💬", mock: <BaseMock /> },
  { n: "03", emoji: "🎬", mock: <AnimationMock /> },
  { n: "04", emoji: "⏱️", mock: <CountdownMock /> },
  { n: "05", emoji: "🚀", mock: <ResultMock /> },
];

export function StepByStep() {
  const t = useTranslations("steps");
  const items = t.raw("items") as StepText[];

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-20 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">{t("label")}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("title")} <span className="text-gold-deep">{t("titleHighlight")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-inkSoft">{t("subtitle")}</p>
      </div>

      <div className="space-y-20 lg:space-y-28">
        {STEP_VISUALS.map((v, i) => {
          const s = items[i] ?? { title: "", desc: "", tips: [] };
          const flip = i % 2 === 1;
          return (
            <motion.div
              key={v.n}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className={`relative grid items-center gap-10 lg:grid-cols-2 ${flip ? "lg:[direction:rtl]" : ""}`}
            >
              <div className={`relative ${flip ? "lg:[direction:ltr]" : ""}`}>
                <span className="pointer-events-none absolute -top-16 -left-1 font-display text-[7rem] font-semibold leading-none text-ink/[0.05]">
                  {v.n}
                </span>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-inkSoft">
                  {t("stepWord")} {v.n}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  <span className="mr-2">{v.emoji}</span>
                  {s.title}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-inkSoft">{s.desc}</p>
                {s.tips && s.tips.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {s.tips.map((tip) => (
                      <li key={tip} className="flex items-center gap-2 text-sm text-ink/80">
                        <span className="text-gold">▹</span> {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={`flex justify-center ${flip ? "lg:[direction:ltr]" : ""}`}>
                <div className="relative">
                  <div className="absolute -inset-10 -z-10 rounded-full bg-gold-hi/15 blur-3xl" />
                  {v.mock}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
