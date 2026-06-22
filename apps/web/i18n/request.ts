import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/** Merge profundo: textos faltando num idioma caem no ingles (base). */
function deepMerge(base: any, over: any): any {
  const out: any = { ...base };
  for (const key of Object.keys(over ?? {})) {
    const b = base?.[key];
    const o = over[key];
    if (b && o && typeof b === "object" && !Array.isArray(b) && typeof o === "object" && !Array.isArray(o)) {
      out[key] = deepMerge(b, o);
    } else {
      out[key] = o;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }

  const en = (await import("../messages/en.json")).default;
  const messages =
    locale === "en"
      ? en
      : deepMerge(en, (await import(`../messages/${locale}.json`)).default);

  return { locale, messages };
});
