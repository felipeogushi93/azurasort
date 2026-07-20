import { defineRouting } from "next-intl/routing";

/**
 * Idiomas do AzuraSort.
 * Padrao: en (universal) quando nao da pra detectar a localizacao.
 * Mercados-alvo: Brasil (pt-br), Espanha (es), Marrocos (ar-ma + fr-ma).
 */
export const routing = defineRouting({
  locales: ["en", "pt-br", "es", "ar-ma", "fr-ma"],
  defaultLocale: "en",
  localePrefix: "always",
});


/** Idiomas escritos da direita para a esquerda. */
export const RTL_LOCALES: string[] = ["ar-ma"];

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale);
}
