"use client";

import { motion } from "framer-motion";

const FEATURES = [
  { title: "Vídeo automático em 3 formatos", desc: "9:16, 16:9 e 1:1 gerados na hora. Concorrentes dão um print — nós entregamos um Reels pronto.", icon: "🎞️" },
  { title: "Certificado de transparência", desc: "Sorteio com semente assinada e verificável publicamente. Prove para a sua audiência que foi justo.", icon: "🛡️" },
  { title: "Resultado provably-fair", desc: "Publicamos o hash antes e revelamos a semente depois: qualquer pessoa pode reauditar o sorteio.", icon: "🔐" },
  { title: "Modo ao vivo / palco", desc: "Revele em eventos e lives controlando pelo celular. Suspense em tempo real para a sua plateia.", icon: "📡" },
  { title: "Paridade tela ↔ vídeo", desc: "O MP4 baixado é idêntico ao que você viu na tela. Mesma engine, zero surpresas.", icon: "🪞" },
  { title: "Performance 60fps", desc: "Efeitos 3D reais com WebGL otimizado. Cinema de verdade, fluido até no celular.", icon: "⚡" },
];

export function Differentials() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-14 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">Por que AzuraSort</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Não é só sortear. É um <span className="text-gold-deep">espetáculo</span>.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="rounded-2xl border border-ink/5 bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="font-display text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-inkSoft">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
