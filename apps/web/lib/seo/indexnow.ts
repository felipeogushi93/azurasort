/**
 * IndexNow — notifica Bing/Yandex (e parceiros) instantaneamente quando uma
 * URL é criada/atualizada, em vez de esperar o crawler passar (semanas → minutos).
 *
 * A chave é hospedada em /public/<key>.txt para o protocolo validar a posse do domínio.
 */
import { PROGRAMMATIC_LOCALES, allProgrammaticUrls } from "./programmatic";
import { PILLAR_SLUGS } from "./pillars/registry";
import { routing } from "@/i18n/routing";

const INDEXNOW_KEY = "ff06472380979b6cc975f39ec65da986";
const HOST = "azurasort.com";

/** Envia uma lista de URLs absolutas para o IndexNow. */
export async function submitToIndexNow(urls: string[]): Promise<{ ok: boolean; status: number }> {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  return { ok: res.ok, status: res.status };
}

/** URLs públicas principais (home + guia + recursos + páginas programáticas). */
export function mainSiteUrls(): string[] {
  const locales = ["en", "es", "fr-ma", "ar-ma", "pt-br"];
  const paths = ["", "/guia", "/sorteio"];
  const urls = new Set<string>([`https://${HOST}`]);
  for (const l of locales) for (const p of paths) urls.add(`https://${HOST}/${l}${p}`);
  // hub + páginas programáticas de cauda longa
  for (const l of PROGRAMMATIC_LOCALES) urls.add(`https://${HOST}/${l}/recursos`);
  for (const u of allProgrammaticUrls(`https://${HOST}`)) urls.add(u);
  // pillar pages (comparativos) em todos os idiomas
  for (const l of routing.locales) for (const s of PILLAR_SLUGS) urls.add(`https://${HOST}/${l}/${s}`);
  // ferramentas gratuitas — SO pt-br (as rotas usam dynamicParams=false e os
  // outros idiomas retornam 404 de proposito). Nao mover pro loop de locales.
  for (const p of ["/gratis", "/sorteador-de-nomes", "/amigo-secreto"]) urls.add(`https://${HOST}/pt-br${p}`);
  return [...urls];
}
