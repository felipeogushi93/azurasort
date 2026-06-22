"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const FLAG: Record<string, string> = {
  en: "🇬🇧",
  "pt-br": "🇧🇷",
  es: "🇪🇸",
  "ar-ma": "🇲🇦",
  "fr-ma": "🇲🇦",
};

/** Troca de idioma preservando a rota atual. */
export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("locale");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        className="cursor-pointer rounded-full border border-ink/10 bg-surface py-1.5 pl-3 pr-7 text-sm text-ink shadow-soft outline-none transition hover:border-gold/50 focus:border-gold"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {FLAG[l]} {t(l)}
          </option>
        ))}
      </select>
    </label>
  );
}
