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

/**
 * Preços por FAIXA de participantes (modelo Simplers).
 * Faixas (limite superior): 100 · 500 · 1.000 · 3.000 · 10.000 · 30.000 · ∞
 * Cada array tem 7 valores (índice = faixa), em centavos.
 *   Padrão = tabela base (Simplers −R$1) · Cinematográfico ≈ ×1,6 · VIP ≈ ×2,4
 * 💡 Para ajustar, edite só os arrays abaixo.
 */
const TIER_MAX = [100, 500, 1000, 3000, 10000, 30000, Infinity];

/** Faixa (0..6) a partir do nº de participantes. */
export function tierForCount(count: number): number {
  const c = Math.max(1, Math.floor(count || 0));
  const i = TIER_MAX.findIndex((max) => c <= max);
  return i < 0 ? TIER_MAX.length - 1 : i;
}

export const PRICES: Record<Currency, Record<PlanId, number[]>> = {
  BRL: {
    padrao:  [1490, 1490, 1590, 1790, 2590, 3590, 4890],
    premium: [2390, 2390, 2590, 2890, 4190, 5790, 7790],
    vip:     [3590, 3590, 3790, 4290, 6190, 8590, 11690],
  },
  EUR: {
    padrao:  [490, 490, 590, 690, 990, 1390, 1690],
    premium: [790, 790, 990, 1090, 1590, 2190, 2690],
    vip:     [1190, 1190, 1390, 1690, 2390, 3290, 3990],
  },
  USD: {
    padrao:  [490, 490, 590, 690, 990, 1390, 1690],
    premium: [790, 790, 990, 1090, 1590, 2190, 2690],
    vip:     [1190, 1190, 1390, 1690, 2390, 3290, 3990],
  },
};

/** Preço (centavos) para moeda + plano + nº de participantes. */
export function priceForCount(currency: Currency, plan: PlanId, count: number): number {
  return PRICES[currency][plan][tierForCount(count)];
}

/**
 * Taxa aproximada do cartão (Stripe) por moeda — % + valor fixo por transação.
 * Ajuste aqui se a taxa do Stripe mudar.
 */
const CARD_FEE: Record<Currency, { pct: number; fixed: number }> = {
  BRL: { pct: 0.0399, fixed: 39 }, // ~3,99% + R$0,39
  EUR: { pct: 0.029, fixed: 25 }, // ~2,9% + €0,25
  USD: { pct: 0.029, fixed: 30 }, // ~2,9% + US$0,30
};

/**
 * Preço no CARTÃO (centavos): preço base com a taxa do Stripe embutida (gross-up),
 * arredondado pra cima em 10 centavos. Assim o valor LÍQUIDO recebido ≈ preço base.
 * PIX continua no preço base (priceForCount). No Brasil, cobrar diferente no cartão
 * é permitido (Lei 13.455/2017).
 */
export function cardPriceForCount(currency: Currency, plan: PlanId, count: number): number {
  const base = priceForCount(currency, plan, count);
  const { pct, fixed } = CARD_FEE[currency];
  const gross = (base + fixed) / (1 - pct);
  return Math.ceil(gross / 10) * 10; // arredonda pra cima em 10 centavos
}

/** Países que cobramos em EUR (Europa UE/EEE + Marrocos, mercado-foco). */
const EUR_COUNTRIES = new Set([
  "PT", "ES", "FR", "DE", "IT", "NL", "BE", "LU", "IE", "AT", "FI", "GR", "CY",
  "MT", "SK", "SI", "EE", "LV", "LT", "PL", "CZ", "HU", "RO", "BG", "HR", "DK",
  "SE", "GB", "NO", "CH", "IS", "LI",
  "MA", // Marrocos (foco) → EUR
]);

export function currencyForCountry(country?: string | null): Currency {
  const c = (country || "").toUpperCase();
  if (c === "BR") return "BRL";
  if (EUR_COUNTRIES.has(c)) return "EUR";
  return "USD";
}

/** Fallback quando não há geo (ex.: dev local) — baseado no locale. */
export function currencyForLocale(locale?: string | null): Currency {
  if (locale === "pt-br") return "BRL";
  // Espanha e Marrocos (es, ar-ma, fr-ma) → EUR; demais → USD
  if (locale === "es" || locale === "ar-ma" || locale === "fr-ma") return "EUR";
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

/** Rótulos formatados dos 3 planos numa moeda, para um nº de participantes. */
export function priceLabels(currency: Currency, count: number): Record<PlanId, string> {
  return {
    padrao: formatPrice(priceForCount(currency, "padrao", count), currency),
    premium: formatPrice(priceForCount(currency, "premium", count), currency),
    vip: formatPrice(priceForCount(currency, "vip", count), currency),
  };
}
