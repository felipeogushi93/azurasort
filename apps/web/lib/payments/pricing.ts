/**
 * Preços e moeda por país (geo-pricing).
 *
 * Regra do negócio: Brasil → BRL, Europa → EUR, resto do mundo → USD.
 * Detecção pelo país do visitante (header geo da Vercel); fallback pelo locale.
 *
 * 💡 Para ajustar valores, edite somente a tabela PRICES abaixo (em centavos).
 */

export type Currency = "BRL" | "EUR" | "USD";
export type PlanId = "padrao" | "premium" | "vip";

/** Preços na MENOR unidade da moeda (centavos). Ajuste aqui se quiser. */
export const PRICES: Record<Currency, Record<PlanId, number>> = {
  BRL: { padrao: 1990, premium: 3490, vip: 5990 },
  EUR: { padrao: 490, premium: 790, vip: 1190 },
  USD: { padrao: 490, premium: 790, vip: 1290 },
};

/** Países da Europa (UE/EEE + próximos) → EUR. */
const EUROPE = new Set([
  "PT", "ES", "FR", "DE", "IT", "NL", "BE", "LU", "IE", "AT", "FI", "GR", "CY",
  "MT", "SK", "SI", "EE", "LV", "LT", "PL", "CZ", "HU", "RO", "BG", "HR", "DK",
  "SE", "GB", "NO", "CH", "IS", "LI",
]);

export function currencyForCountry(country?: string | null): Currency {
  const c = (country || "").toUpperCase();
  if (c === "BR") return "BRL";
  if (EUROPE.has(c)) return "EUR";
  return "USD";
}

/** Fallback quando não há geo (ex.: dev local) — baseado no locale. */
export function currencyForLocale(locale?: string | null): Currency {
  if (locale === "pt-br") return "BRL";
  if (locale === "es") return "EUR";
  return "USD";
}

/** Lê o país do request (header geo da Vercel). */
export function countryFromRequest(req: Request): string | null {
  return req.headers.get("x-vercel-ip-country");
}

/** Código de moeda no formato do Stripe (minúsculo). */
export function stripeCurrency(currency: Currency): string {
  return currency.toLowerCase();
}

const INTL_LOCALE: Record<Currency, string> = { BRL: "pt-BR", EUR: "de-DE", USD: "en-US" };

/** Formata centavos para exibição (ex.: "R$ 34,90", "€7,90", "$12.90"). */
export function formatPrice(cents: number, currency: Currency): string {
  return (cents / 100).toLocaleString(INTL_LOCALE[currency], { style: "currency", currency });
}

/** Rótulos formatados de todos os planos numa moeda. */
export function priceLabels(currency: Currency): Record<PlanId, string> {
  return {
    padrao: formatPrice(PRICES[currency].padrao, currency),
    premium: formatPrice(PRICES[currency].premium, currency),
    vip: formatPrice(PRICES[currency].vip, currency),
  };
}
