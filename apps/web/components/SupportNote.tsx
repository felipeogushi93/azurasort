/**
 * Nota de suporte (WhatsApp do Lucas) pras páginas da ferramenta (/sorteio,
 * /gratis) — onde o cliente mais precisa de ajuda (carregar post, pagar).
 */
const WA = "https://wa.me/5548991420313";

const LABEL: Record<string, string> = {
  "pt-br": "Precisa de ajuda? Falar com o suporte",
  es: "¿Necesitas ayuda? Habla con soporte",
  "fr-ma": "Besoin d'aide ? Parler au support",
  "ar-ma": "تحتاج مساعدة؟ تحدث مع الدعم",
  en: "Need help? Talk to support",
};

export function SupportNote({ locale }: { locale: string }) {
  return (
    <div className="pb-10 pt-2 text-center">
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-inkSoft transition-colors hover:text-ink hover:underline"
      >
        💬 {LABEL[locale] ?? LABEL.en}
      </a>
    </div>
  );
}
