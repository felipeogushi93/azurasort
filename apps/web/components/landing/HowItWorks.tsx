"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Conecte o post",
    desc: "Faca login com sua conta Business/Creator e escolha a publicacao. 100% oficial Meta, sem risco de banimento.",
    icon: "🔗",
  },
  {
    n: "02",
    title: "Importe os comentarios",
    desc: "Trazemos todos os comentarios elegiveis em segundos. Filtre por hashtag, mencoes, duplicados e mais.",
    icon: "💬",
  },
  {
    n: "03",
    title: "Escolha a cena",
    desc: "Envelope dourado, cofre, holograma, cassino... 24 revelacoes cinematograficas. Personalize cor e logo.",
    icon: "🎬",
  },
  {
    n: "04",
    title: "Revele e compartilhe",
    desc: "O vencedor e revelado como uma cena de cinema. Baixe o video em 9:16, 16:9 e 1:1, pronto para viralizar.",
    icon: "🏆",
  },
];

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-neon-cyan">Como funciona</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">
          Do post ao espetaculo em <span className="text-gold">4 passos</span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-elevated/50 p-6 backdrop-blur transition hover:border-gold/40 hover:shadow-gold"
          >
            <span className="absolute right-4 top-3 font-display text-5xl text-white/5 transition group-hover:text-gold/10">
              {s.n}
            </span>
            <div className="mb-4 text-3xl">{s.icon}</div>
            <h3 className="font-display text-xl text-hi">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-lo">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
