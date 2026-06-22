"use client";

import { motion } from "framer-motion";

const FEATURES = [
  { icon: "♾️", title: "Sorteios sem limite", desc: "Crie quantos sorteios quiser, sempre que precisar — sem cota travando o seu crescimento." },
  { icon: "📄", title: "Exportação da lista", desc: "Baixe todos os participantes, comentários e curtidas em planilha (XLS/CSV) para usar como quiser." },
  { icon: "🔁", title: "Refazer à vontade", desc: "Não gostou de um teste? Rode o mesmo post de novo quantas vezes precisar." },
  { icon: "⏲️", title: "Contagem regressiva", desc: "Defina a duração da animação de suspense antes de revelar o vencedor." },
  { icon: "🔍", title: "Validação avançada", desc: "Confira se o ganhador segue um perfil, tem foto, bio ou nome — antes de confirmar o prêmio." },
  { icon: "🧩", title: "Várias publicações", desc: "Combine mais de um post no mesmo sorteio para ampliar o alcance da campanha." },
  { icon: "🛡️", title: "Certificado verificável", desc: "Gere um certificado compartilhável e auditável dos resultados, com código público." },
  { icon: "✦", title: "Regras com IA", desc: "A IA lê seu post e sugere as regras automaticamente — mais rápido e sem erro." },
  { icon: "📊", title: "Página de resultados", desc: "Liste os ganhadores numa página própria e prove à sua audiência que foi justo." },
  { icon: "⚖️", title: "Limite justo por pessoa", desc: "Defina quantos comentários de cada usuário valem. Todo mundo com a mesma chance." },
  { icon: "🏆", title: "Vencedores + suplentes", desc: "Escolha vários ganhadores e reservas para substituir quem não cumprir as regras." },
  { icon: "🎯", title: "Filtros inteligentes", desc: "Hashtags, menções obrigatórias e remoção de duplicados num clique." },
];

export function Features() {
  return (
    <section className="relative bg-canvasAlt">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">Recursos</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Tudo para um sorteio <span className="text-gold-deep">profissional</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-inkSoft">
            Criar, filtrar e escolher vencedores no Instagram — com a transparência e o
            acabamento que a sua marca merece.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              className="group rounded-2xl border border-ink/5 bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-xl transition group-hover:bg-gold/20">
                {f.icon}
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
