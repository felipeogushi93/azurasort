"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Por que vale a pena fazer um sorteio no Instagram?",
    a: "Sorteios são uma das formas mais rápidas de crescer: aumentam comentários, alcance e seguidores em poucos dias, fortalecem o relacionamento com a audiência e dão à sua marca um motivo de celebração que as pessoas adoram compartilhar.",
  },
  {
    q: "Por que é importante coletar todos os comentários?",
    a: "Se a ferramenta lê só uma parte dos comentários, o sorteio fica injusto — várias pessoas nem entram no resultado. Nós recuperamos a lista completa, mesmo com milhares de participantes, para que cada pessoa tenha exatamente a mesma chance.",
  },
  {
    q: "Como funciona o sorteio com inteligência artificial?",
    a: "A IA lê a sua publicação e identifica as regras automaticamente (menções, hashtags, palavras-chave) e ainda ajuda a validar perfis vencedores. Você economiza tempo e evita erros de configuração.",
  },
  {
    q: "O sorteio do Prizegram é seguro e confiável?",
    a: "Sim. Cada sorteio usa um sorteio aleatório auditável, com semente assinada que gera um certificado verificável publicamente. Qualquer pessoa pode conferir que o resultado não foi manipulado.",
  },
  {
    q: "Posso sortear a partir de Reels e carrosséis?",
    a: "Sim. Funciona com posts, Reels e carrosséis — basta colar o link da publicação do sorteio.",
  },
  {
    q: "Dá para fazer sorteio grátis?",
    a: "Dá. O plano gratuito permite realizar sorteios com as cenas essenciais (os vídeos saem com nossa marca d'água). Os planos pagos liberam mais cenas, vídeo sem marca e recursos avançados.",
  },
  {
    q: "Quanto custa um sorteio profissional?",
    a: "Você começa sem pagar nada. Quando quiser remover a marca d'água, usar o seu logo, exportar listas ou liberar todas as cenas de revelação, há planos mensais acessíveis — com preço ajustado por região.",
  },
  {
    q: "Quantos vencedores posso escolher?",
    a: "Quantos quiser. Também é possível definir suplentes para substituir quem não cumprir as regras ou não resgatar o prêmio, além de ativar menções obrigatórias, remover duplicados e limitar participações por pessoa.",
  },
  {
    q: "Como garanto que o sorteio seja justo e transparente?",
    a: "Coletamos todos os comentários, sorteamos com um algoritmo aleatório reproduzível e geramos um certificado com código de verificação. Você compartilha a página de resultados e seus seguidores confirmam tudo.",
  },
  {
    q: "Funciona com contas privadas?",
    a: "Para garantir um sorteio 100% oficial e dentro das regras do Instagram, trabalhamos com contas comerciais ou de criador de conteúdo conectadas com segurança. Contas privadas não expõem os comentários publicamente.",
  },
  {
    q: "Posso reiniciar o mesmo sorteio?",
    a: "Sim, quantas vezes quiser, usando a mesma publicação — útil para testar a animação antes de rodar o sorteio definitivo ao vivo.",
  },
  {
    q: "O que torna o Prizegram diferente das outras ferramentas?",
    a: "Além de sortear de forma justa, transformamos o anúncio do vencedor numa revelação cinematográfica e geramos automaticamente o vídeo pronto para Stories, Reels e feed. O resultado vira conteúdo que a sua audiência compartilha.",
  },
];

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
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-28">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-deep">FAQ</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Perguntas frequentes</h2>
        <p className="mt-4 text-inkSoft">As dúvidas mais comuns sobre sorteios no Instagram.</p>
      </div>

      <div>
        {FAQ.map((item, i) => (
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
