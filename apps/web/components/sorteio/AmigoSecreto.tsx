"use client";

import { useState } from "react";
import { encodeAmigoToken } from "@/lib/amigoSecreto";

/**
 * 🎁 AMIGO SECRETO — 100% no cliente. Não passa pelo /api/draw, não grava nada
 * no banco: o par sorteado vive dentro do link que o organizador manda pra cada
 * pessoa. Ferramenta grátis de topo de funil (upsell pro sorteio pago fica na
 * página, não aqui dentro).
 */

const MAX_PARTICIPANTES = 200;

/** Inteiro aleatório em [0, max) sem viés (rejection sampling sobre o CSPRNG). */
function randomInt(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

/** Fisher-Yates com crypto.getRandomValues (nunca Math.random num sorteio). */
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Marcas de acento (combining diacritics) — em escape ASCII de propósito. */
const ACENTOS = new RegExp("[\\u0300-\\u036f]", "g");

/** Chave de comparação para achar nomes repetidos ("Ana" == "ana" == "ANA "). */
function chave(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(ACENTOS, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function parseNomes(raw: string): { nomes: string[]; repetidos: string[] } {
  const nomes: string[] = [];
  const repetidos: string[] = [];
  const vistos = new Set<string>();
  for (const linha of raw.split(/\r?\n/)) {
    const nome = linha.trim().replace(/\s+/g, " ").slice(0, 80);
    if (!nome) continue;
    const k = chave(nome);
    if (vistos.has(k)) {
      repetidos.push(nome);
      continue;
    }
    vistos.add(k);
    nomes.push(nome);
    if (nomes.length >= MAX_PARTICIPANTES) break;
  }
  return { nomes, repetidos };
}

type Par = { de: string; token: string };

/**
 * Pareamento em CICLO: embaralha e cada um tira o próximo da fila, o último
 * fecha no primeiro. Garante matematicamente que ninguém tira a si mesmo e que
 * não sai par recíproco fechado de duas pessoas (salvo n=2, onde é inevitável).
 */
function sortearCiclo(nomes: string[], grupo: string): Par[] {
  const ordem = shuffle(nomes);
  return ordem.map((de, i) => ({
    de,
    token: encodeAmigoToken({ d: de, p: ordem[(i + 1) % ordem.length], g: grupo }),
  }));
}

export function AmigoSecreto() {
  const [raw, setRaw] = useState("");
  const [grupo, setGrupo] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [pares, setPares] = useState<Par[] | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  function sortear() {
    const { nomes, repetidos } = parseNomes(raw);
    if (nomes.length < 3) {
      setErro("Coloque pelo menos 3 nomes diferentes, um por linha.");
      setPares(null);
      return;
    }
    setErro("");
    setAviso(
      repetidos.length > 0
        ? `Ignoramos ${repetidos.length} nome(s) repetido(s): ${repetidos.join(", ")}.`
        : "",
    );
    setPares(sortearCiclo(nomes, grupo.trim()));
    setCopiado(null);
  }

  function linkDe(token: string): string {
    const origem = typeof window !== "undefined" ? window.location.origin : "";
    return `${origem}/pt-br/amigo-secreto/${token}`;
  }

  async function copiar(par: Par) {
    const url = linkDe(par.token);
    const texto = grupo.trim()
      ? `${par.de}, seu amigo secreto do ${grupo.trim()} já foi sorteado! Abra só você: ${url}`
      : `${par.de}, seu amigo secreto já foi sorteado! Abra só você: ${url}`;
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // navegador sem permissão de área de transferência (ou http): seleciona
      // num campo temporário como plano B
      const el = document.createElement("textarea");
      el.value = texto;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {
        /* desiste em silêncio — o link continua visível na tela */
      }
      document.body.removeChild(el);
    }
    setCopiado(par.de);
    window.setTimeout(() => setCopiado((c) => (c === par.de ? null : c)), 2000);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
        Amigo secreto online
      </h2>
      <p className="mt-2 text-base text-inkSoft">
        Coloque os nomes, sorteie e mande um link para cada pessoa. Ninguém tira a si mesmo e nem
        você descobre quem tirou quem.
      </p>

      {!pares && (
        <div className="mt-8 rounded-3xl border border-ink/5 bg-surface p-6 shadow-card">
          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">
            Nomes dos participantes (um por linha)
          </label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={8}
            placeholder={"Felipe\nAna\nLucas\nMariana"}
            className="inp w-full resize-y font-mono text-sm"
          />
          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">
              Nome do grupo (opcional)
            </label>
            <input
              value={grupo}
              onChange={(e) => setGrupo(e.target.value.slice(0, 80))}
              placeholder="Natal da família, Turma do trabalho…"
              className="inp w-full"
            />
          </div>

          {erro && <p className="mt-3 rounded-lg bg-rose/10 px-3 py-2 text-sm text-rose">{erro}</p>}

          <button onClick={sortear} className="btn-gold mt-5 w-full py-3.5 text-base">
            Sortear amigo secreto
          </button>
          <p className="mt-3 text-center text-[11px] text-inkSoft">
            O sorteio acontece no seu navegador. Não guardamos nomes nem resultados.
          </p>
        </div>
      )}

      {pares && (
        <div className="mt-8">
          <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-6 shadow-gold">
            <p className="text-sm font-medium uppercase tracking-widest text-gold-deep">
              🎁 Sorteio feito
            </p>
            <p className="mt-2 text-sm text-inkSoft">
              {pares.length} participantes{grupo.trim() ? ` · ${grupo.trim()}` : ""}. Copie o link de
              cada pessoa e mande no privado — só ela vê quem tirou.
            </p>

            {aviso && <p className="mt-3 text-xs text-inkSoft">{aviso}</p>}

            <ul className="mt-5 space-y-2">
              {pares.map((par) => (
                <li
                  key={par.de}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-ink/5 bg-surface px-4 py-3"
                >
                  <span className="truncate font-medium text-ink">{par.de}</span>
                  <button
                    onClick={() => copiar(par)}
                    className="btn-ghost shrink-0 px-4 py-2 text-xs"
                  >
                    {copiado === par.de ? "✓ copiado" : "copiar link"}
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-center text-[11px] text-inkSoft">
              ⚠️ Não abra os links dos outros: cada link revela um resultado. Feche esta página
              depois de enviar tudo — sem banco de dados, ela não pode ser recuperada.
            </p>
          </div>

          <button
            onClick={() => {
              setPares(null);
              setCopiado(null);
              setAviso("");
            }}
            className="btn-ghost mt-4 w-full"
          >
            Fazer outro sorteio
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Tela do participante. O nome sorteado chega renderizado do servidor, mas fica
 * escondido atrás de um clique: print acidental e olhar por cima do ombro não
 * estragam a brincadeira.
 */
export function RevelarAmigo({ de, para, grupo }: { de: string; para: string; grupo: string }) {
  const [revelado, setRevelado] = useState(false);

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-gold-deep">
        {grupo ? grupo : "Amigo secreto"}
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">Olá, {de}!</h1>

      {!revelado ? (
        <>
          <p className="mt-3 text-base text-inkSoft">
            Seu amigo secreto já foi sorteado. Confira num lugar em que ninguém esteja olhando a sua
            tela.
          </p>
          <button
            onClick={() => setRevelado(true)}
            className="btn-gold mt-8 w-full py-3.5 text-base"
          >
            Revelar quem eu tirei
          </button>
        </>
      ) : (
        <div className="mt-8 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-8 shadow-gold">
          <p className="text-xs font-medium uppercase tracking-widest text-inkSoft">Você tirou</p>
          <p className="mt-3 font-display text-4xl font-black leading-tight text-ink">{para}</p>
          <p className="mt-4 text-xs text-inkSoft">
            Guarde segredo 🤫 — e não conte nem para quem te mandou o link.
          </p>
        </div>
      )}
    </div>
  );
}
