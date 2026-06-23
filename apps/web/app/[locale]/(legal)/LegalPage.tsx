import { Link } from "@/i18n/navigation";
import type { LegalDoc } from "@/lib/legal/content";

/** Layout de leitura para documentos legais (Termos / Privacidade). */
export function LegalPage({ doc, locale }: { doc: LegalDoc; locale: string }) {
  const back = locale === "pt-br" ? "← Voltar ao início" : "← Back to home";
  return (
    <main className="min-h-screen bg-canvas px-6 py-16">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-violet hover:underline">
          {back}
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">{doc.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-inkSoft">{doc.intro}</p>

        <div className="mt-10 space-y-8">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-lg font-semibold text-ink">{s.h}</h2>
              <div className="mt-2 space-y-2">
                {s.p.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-inkSoft">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
