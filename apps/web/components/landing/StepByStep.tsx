"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- mocks visuais proprios (light premium) ---------- */

function Frame({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-ink/5 bg-surface p-4 shadow-card">{children}</div>;
}

function PostMock() {
  return (
    <div className="w-56">
      <Frame>
        <div className="mb-2 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet to-rose" />
          <div className="flex-1">
            <div className="h-2 w-20 rounded bg-ink/20" />
            <div className="mt-1 h-1.5 w-12 rounded bg-ink/10" />
          </div>
          <span className="text-inkSoft">•••</span>
        </div>
        <div className="h-28 rounded-xl bg-gradient-to-br from-[#fce8c9] via-[#f3d7e2] to-[#dfe6ff]" />
        <div className="mt-2 flex items-center gap-3 text-xs text-inkSoft">
          <span>♡ 4,5 mil</span>
          <span>💬 312</span>
          <span className="ml-auto rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-deep">
            copiar link
          </span>
        </div>
      </Frame>
    </div>
  );
}

function PasteMock() {
  return (
    <div className="w-64 space-y-3">
      <Frame>
        <div className="flex items-center gap-2">
          <span className="text-rose">🔗</span>
          <span className="truncate text-sm text-inkSoft">instagram.com/p/Cx9k2…</span>
          <span className="ml-auto rounded-md bg-gradient-to-b from-gold-hi to-gold px-2 py-1 text-xs font-semibold text-ink">colar</span>
        </div>
      </Frame>
      <div className="flex gap-2">
        <span className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-medium text-gold-deep">comentários</span>
        <span className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-inkSoft">curtidas</span>
      </div>
    </div>
  );
}

function RulesMock() {
  return (
    <div className="w-64">
      <Frame>
        <p className="mb-3 text-xs uppercase tracking-widest text-inkSoft">Regras</p>
        <div className="space-y-2 text-sm">
          {["Mínimo de menções", "Sem duplicados", "Filtro de palavras"].map((r) => (
            <div key={r} className="flex items-center justify-between rounded-lg bg-canvasAlt px-3 py-2">
              <span className="text-ink">{r}</span>
              <span className="h-4 w-7 rounded-full bg-gold/80 p-0.5">
                <span className="block h-3 w-3 translate-x-3 rounded-full bg-surface" />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-inkSoft">Vencedores</span>
          <div className="flex items-center gap-2 text-ink">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-ink/5">−</span>
            <span className="font-display font-semibold">3</span>
            <span className="grid h-6 w-6 place-items-center rounded-md bg-ink/5">+</span>
          </div>
        </div>
        <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-violet to-rose py-2 text-xs font-semibold text-white">
          ✦ preencher regras com IA
        </button>
      </Frame>
    </div>
  );
}

function FetchMock() {
  return (
    <div className="w-60">
      <Frame>
        <p className="text-center text-xs text-inkSoft">recuperando comentários</p>
        <div className="my-3 h-2 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-[88%] bg-gradient-to-r from-gold to-violet" />
        </div>
        <p className="text-center text-sm text-ink">8.420 / 9.512</p>
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-3 py-1 text-xs text-emerald">
            <span className="h-2 w-2 rounded-full bg-emerald" /> coleta 100% completa
          </span>
        </div>
      </Frame>
    </div>
  );
}

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
        <p className="mt-2 text-center text-[10px] text-rose">● transmissão ao vivo disponível</p>
      </Frame>
    </div>
  );
}

function ResultMock() {
  return (
    <div className="w-60 space-y-3">
      <div className="rounded-2xl border border-emerald/20 bg-emerald/5 p-4 text-center shadow-soft">
        <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-emerald/15 text-emerald">✓</div>
        <p className="text-sm text-ink">Resultado salvo</p>
        <p className="text-[10px] text-inkSoft">via AzuraSort</p>
      </div>
      <Frame>
        <p className="text-[10px] uppercase tracking-widest text-inkSoft">código de verificação</p>
        <p className="font-mono text-sm text-gold-deep">PRZ-9X2A-77</p>
        <div className="mt-2 flex gap-2 text-[10px] text-inkSoft">
          <span className="rounded bg-canvasAlt px-2 py-1">certificado story</span>
          <span className="rounded bg-canvasAlt px-2 py-1">link público</span>
        </div>
      </Frame>
    </div>
  );
}

/* --------------------------------- steps --------------------------------- */

type Step = { n: string; emoji: string; title: string; desc: string; tips?: string[]; mock: ReactNode };

const STEPS: Step[] = [
  { n: "01", emoji: "🔗", title: "Conecte sua publicação", desc: "Cole o link do post ou Reels do seu sorteio. É o ponto de partida — rápido e sem complicação.", tips: ["Abra o menu (•••) na publicação", "Toque em “Copiar link” e cole aqui"], mock: <PostMock /> },
  { n: "02", emoji: "📥", title: "Escolha a base do sorteio", desc: "Defina se vai sortear entre comentários ou curtidas e siga para as regras. Dá para somar mais de uma publicação.", mock: <PasteMock /> },
  { n: "03", emoji: "🎚️", title: "Configure regras e filtros", desc: "Nome do sorteio, número de vencedores e suplentes, e quem concorre: menções obrigatórias, sem duplicados, palavras-chave e limite justo.", tips: ["Deixe a IA detectar suas regras"], mock: <RulesMock /> },
  { n: "04", emoji: "⏳", title: "Deixe a coleta terminar", desc: "Trazemos todos os comentários — de verdade, mesmo que sejam milhares. Um sorteio honesto espera tudo carregar antes de rodar.", mock: <FetchMock /> },
  { n: "05", emoji: "🎬", title: "Rode com contagem regressiva", desc: "Defina o tempo da contagem e inicie. Os participantes embaralham na tela e os vencedores surgem no fim — com opção de transmitir ao vivo.", mock: <CountdownMock /> },
  { n: "06", emoji: "🚀", title: "Compartilhe os resultados", desc: "Publique a página de resultados e o certificado em formato story. Seu público confere o código e confia que tudo foi justo.", mock: <ResultMock /> },
];

export function StepByStep() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-20 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">Passo a passo</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Seu sorteio no ar em <span className="text-gold-deep">minutos</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-inkSoft">
          Profissional, justo e transparente — sem precisar de nada além do link da sua publicação.
        </p>
      </div>

      <div className="space-y-20 lg:space-y-28">
        {STEPS.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className={`relative grid items-center gap-10 lg:grid-cols-2 ${flip ? "lg:[direction:rtl]" : ""}`}
            >
              <div className={`relative ${flip ? "lg:[direction:ltr]" : ""}`}>
                <span className="pointer-events-none absolute -top-16 -left-1 font-display text-[7rem] font-semibold leading-none text-ink/[0.05]">
                  {s.n}
                </span>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-inkSoft">Passo {s.n}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  <span className="mr-2">{s.emoji}</span>
                  {s.title}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-inkSoft">{s.desc}</p>
                {s.tips && (
                  <ul className="mt-4 space-y-2">
                    {s.tips.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-ink/80">
                        <span className="text-gold">▹</span> {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={`flex justify-center ${flip ? "lg:[direction:ltr]" : ""}`}>
                <div className="relative">
                  <div className="absolute -inset-10 -z-10 rounded-full bg-gold-hi/15 blur-3xl" />
                  {s.mock}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
