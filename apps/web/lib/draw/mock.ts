import type { RawComment } from "./types";

/** Gera comentarios de teste realistas para simular um sorteio sem o Instagram. */
const FIRST = ["ana", "joao", "maria", "pedro", "lucas", "julia", "bruno", "carla", "rafa", "bia", "thi", "gabi", "leo", "duda", "vini", "manu", "rodrigo", "sofia", "caio", "isa"];
const LAST = ["silva", "souza", "costa", "lima", "alves", "rocha", "melo", "dias", "ramos", "pinto", "neves", "campos", "freitas", "moraes", "barros"];
const TEXTS = [
  "eu quero muito participar! @{a} @{b}",
  "que sorteio incrivel #sorteio @{a}",
  "ja estou participando!! @{a} @{b} #concorrendo",
  "amei, boa sorte pra todos @{a}",
  "participando! #sorteio #quero @{a} @{b}",
  "tomara que eu ganhe dessa vez @{a}",
  "marcando os amigos @{a} @{b} @{c}",
  "comentando aqui pra concorrer",
  "eu preciso ganhar isso @{a} #sorteio",
  "boa! ja segui e marquei @{a} @{b}",
];

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

// PRNG simples so para gerar mocks (nao precisa ser o do sorteio)
function rngFrom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) | 0;
    let t = Math.imul(a ^ (a >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

export function generateMockComments(count: number, seed = 12345): RawComment[] {
  const rnd = rngFrom(seed);
  const out: RawComment[] = [];
  for (let i = 0; i < count; i++) {
    const handle = `${pick(FIRST, rnd)}.${pick(LAST, rnd)}${Math.floor(rnd() * 90 + 10)}`;
    const tpl = pick(TEXTS, rnd);
    const text = tpl
      .replace("{a}", `${pick(FIRST, rnd)}_${pick(LAST, rnd)}`)
      .replace("{b}", `${pick(FIRST, rnd)}.${pick(LAST, rnd)}`)
      .replace("{c}", `${pick(FIRST, rnd)}${Math.floor(rnd() * 99)}`);
    // ~12% dos usuarios comentam duas vezes (para testar dedupe)
    out.push({ id: `c${i}`, handle, text, likeCount: Math.floor(rnd() * 30) });
    if (rnd() < 0.12) out.push({ id: `c${i}b`, handle, text: "comentando de novo!", likeCount: 0 });
  }
  return out;
}
