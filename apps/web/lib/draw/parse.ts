import type { RawComment } from "./types";

/**
 * Um @handle valido do Instagram: 2-30 chars, letras/numeros/ponto/underscore,
 * e NAO pode ser so numeros. Sem isso, o parser transformava lixo colado
 * ("10", "4", "https", "www") em "ganhadores" @10 / @https — o que apareceu de
 * verdade em certificados publicos (reportado pela analise do Google Ads do
 * Lucas). Numa ferramenta cujo valor e o certificado verificavel, sortear @10
 * mata a credibilidade.
 */
const HANDLE_VALIDO = /^[a-z0-9._]{2,30}$/i;
// fragmentos de URL/UI que aparecem ao colar de uma pagina do Instagram.
// Usado por SEGMENTO (separado por ponto), entao "www.instagram.com" cai porque
// "www"/"instagram"/"com" estao aqui, mas "joao.silva" passa (nenhum e ruido).
const RUIDO = new Set([
  "https", "http", "www", "com", "net", "org", "instagram",
  "reply", "responder", "curtir", "like", "seguir", "follow",
  "editado", "edited", "verificado", "verified", "traducao", "translation",
]);

function handleValido(h: string): boolean {
  if (!HANDLE_VALIDO.test(h)) return false; // formato invalido
  if (/^[\d._]+$/.test(h)) return false; // so numeros/pontos (curtidas, contadores)
  const segmentos = h.toLowerCase().split(".");
  if (segmentos.some((s) => RUIDO.has(s))) return false; // URL/UI (ex.: www.instagram.com)
  return true;
}

/**
 * Converte texto colado em comentarios.
 * Formatos aceitos por linha:
 *   @handle: comentario aqui
 *   @handle  comentario aqui
 *   handle,comentario aqui        (CSV simples)
 * Linhas so com @handle viram um comentario vazio.
 * Linhas cujo "handle" nao e um @ valido sao DESCARTADAS (ver handleValido).
 */
export function parsePastedComments(input: string): RawComment[] {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: RawComment[] = [];
  lines.forEach((line, i) => {
    let handle = "";
    let text = "";

    const colon = line.match(/^@?([a-z0-9._]+)\s*[:,]\s*(.*)$/i);
    if (colon) {
      handle = colon[1];
      text = colon[2];
    } else {
      const space = line.match(/^@?([a-z0-9._]+)\s+(.*)$/);
      if (space) {
        handle = space[1];
        text = space[2];
      } else {
        handle = line.replace(/^@/, "");
        text = "";
      }
    }

    if (handle && handleValido(handle)) out.push({ id: `p${i}`, handle, text });
  });

  return out;
}
