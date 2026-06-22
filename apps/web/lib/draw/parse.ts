import type { RawComment } from "./types";

/**
 * Converte texto colado em comentarios.
 * Formatos aceitos por linha:
 *   @handle: comentario aqui
 *   @handle  comentario aqui
 *   handle,comentario aqui        (CSV simples)
 * Linhas so com @handle viram um comentario vazio.
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

    if (handle) out.push({ id: `p${i}`, handle, text });
  });

  return out;
}
