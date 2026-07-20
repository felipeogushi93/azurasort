"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Menu "Sorteios" da barra superior.
 *
 * Existe porque as ferramentas gratuitas so apareciam na secao "Mais sorteios",
 * la embaixo da home: pra chegar nelas a pessoa tinha que rolar a pagina toda.
 * No celular era pior — o menu do topo e `hidden md:flex`, entao nao havia
 * navegacao nenhuma. Este componente aparece nos DOIS tamanhos.
 *
 * Abre por clique (nao por hover): hover nao existe em touch, e o mesmo
 * comportamento nos dois lugares e mais previsivel.
 */
const ITENS = [
  { href: "/sorteio", icone: "📸", nome: "Sorteio no Instagram", tag: "Pago" },
  { href: "/sorteador-de-nomes", icone: "🎲", nome: "Sorteador de nomes", tag: "Grátis" },
  { href: "/amigo-secreto", icone: "🎁", nome: "Amigo secreto", tag: "Grátis" },
];

export function SorteiosMenu() {
  const [aberto, setAberto] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora ou apertar Esc — senao o menu fica presente na tela toda
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        className="flex items-center gap-1 text-sm text-inkSoft transition hover:text-ink"
      >
        Sorteios
        <span className={`text-[10px] transition-transform ${aberto ? "rotate-180" : ""}`}>▼</span>
      </button>

      {aberto && (
        <div
          role="menu"
          // ⚠️ `w-64` fixo saia da tela pela direita em 360-390px (o menu comeca a
          // ~170px do canto, entao 256px de largura terminavam em ~426px) e o que
          // era cortado eram justamente as tags Gratis/Pago. Limitado a viewport.
          className="absolute left-0 top-full z-50 mt-3 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card"
        >
          {ITENS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              role="menuitem"
              onClick={() => setAberto(false)}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-canvasAlt"
            >
              <span className="text-lg">{it.icone}</span>
              <span className="flex-1 text-sm font-medium text-ink">{it.nome}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  it.tag === "Grátis" ? "bg-emerald/10 text-emerald" : "bg-gold/15 text-gold-deep"
                }`}
              >
                {it.tag}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
