import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AmigoSecreto } from "@/components/sorteio/AmigoSecreto";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/seo/content";

/**
 * 🎁 AMIGO SECRETO ONLINE — ferramenta grátis de topo de funil, só em pt-br
 * (termo de busca brasileiro; "amigo secreto" não tem equivalente com a mesma
 * demanda nos outros mercados).
 *
 * ⚠️ generateMetadata é obrigatório: sem `alternates.canonical` a página herda o
 * canonical do layout (que aponta pra HOME) e se auto-desindexa. Sem `languages`
 * de propósito — esta URL existe apenas em pt-br.
 */

export function generateStaticParams() {
  return [{ locale: "pt-br" }];
}

export const dynamicParams = false;

const TITLE = "Amigo Secreto Online Grátis — sorteie e mande o link | AzuraSort";
const DESCRIPTION =
  "Amigo secreto online grátis: coloque os nomes, sorteie e mande um link privado para cada participante. Sem cadastro, sem e-mail e ninguém tira a si mesmo.";

const H1 = "Amigo secreto online grátis";

const FAQ = [
  {
    q: "Como funciona o amigo secreto online?",
    a: "Você coloca os nomes dos participantes, um por linha, e clica em sortear. O site gera um link exclusivo para cada pessoa; você manda o link no privado e ela abre para descobrir quem tirou. Como cada um vê apenas o próprio resultado, ninguém precisa se reunir no mesmo lugar para o sorteio.",
  },
  {
    q: "Alguém pode tirar a si mesmo?",
    a: "Não. O sorteio usa um pareamento em ciclo: a lista é embaralhada e cada participante tira o próximo da fila, com o último fechando no primeiro. Isso torna matematicamente impossível alguém tirar o próprio nome, e também evita que duas pessoas tirem uma à outra (a única exceção é com apenas 2 participantes, em que não existe outra combinação possível).",
  },
  {
    q: "O organizador consegue ver quem tirou quem?",
    a: "A tela final mostra apenas a lista de nomes com o botão de copiar link — nenhum resultado aparece ali. O organizador só saberia de um par se abrisse o link de outra pessoa, então o combinado é simples: copie, envie e não abra o link dos outros.",
  },
  {
    q: "Precisa de cadastro, e-mail ou aplicativo?",
    a: "Não. Ninguém precisa criar conta, informar e-mail ou instalar nada — nem o organizador, nem os participantes. O sorteio acontece no seu próprio navegador e o resultado viaja dentro do link, sem ficar guardado em nenhum banco de dados nosso.",
  },
  {
    q: "Quantas pessoas posso colocar no amigo secreto?",
    a: "O mínimo são 3 participantes e a ferramenta aceita até 200 nomes por sorteio, o que cobre desde a ceia de família até a confraternização da empresa inteira. Nomes repetidos são ignorados automaticamente para não confundir na hora de enviar os links.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `/${locale}/amigo-secreto` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE.url}/${locale}/amigo-secreto`,
      siteName: "AzuraSort",
      locale,
      type: "website",
    },
  };
}

export default async function AmigoSecretoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <JsonLd
        data={[
          faqSchema(FAQ),
          breadcrumbSchema([
            { name: "AzuraSort", url: `${SITE.url}/${locale}` },
            { name: H1, url: `${SITE.url}/${locale}/amigo-secreto` },
          ]),
        ]}
      />

      {/* a ferramenta vem primeiro: quem chega aqui quer sortear, não ler */}
      <AmigoSecreto />

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-4">
        <h1 className="font-display text-2xl font-bold text-ink">{H1}</h1>
        <p className="mt-3 text-sm leading-relaxed text-inkSoft">
          Sorteie o amigo secreto (ou amigo oculto) sem papelzinho, sem reunir todo mundo e sem
          ninguém precisar se cadastrar. Coloque os nomes, clique em sortear e o site devolve um
          link privado por participante — você envia cada link no WhatsApp e a pessoa descobre quem
          tirou com um clique. O resultado fica escondido atrás de um botão, então nem o preview da
          mensagem nem um print acidental estragam a surpresa.
        </p>

        <div className="mt-8 space-y-5">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h2 className="font-display text-base font-semibold text-ink">{f.q}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-inkSoft">{f.a}</p>
            </div>
          ))}
        </div>

        {/* upsell discreto — a página é grátis de verdade, o link é só um convite */}
        <div className="mt-10 rounded-2xl border border-ink/5 bg-surface p-5 shadow-soft">
          <p className="text-sm leading-relaxed text-inkSoft">
            Esses nomes vieram dos comentários de um post do Instagram? O AzuraSort puxa os
            comentários automaticamente e gera o vídeo da revelação{" "}
            <Link href="/sorteio" className="font-semibold text-violet hover:underline">
              →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
