import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FreeDraw } from "@/components/sorteio/FreeDraw";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/seo/content";
import { ToolHeader, ToolFooter } from "@/components/ToolChrome";

/**
 * 🎯 SORTEADOR DE NOMES — página de cauda longa em PT-BR (só pt-br: é um termo
 * de busca brasileiro e traduzir para os outros idiomas geraria página órfã sem
 * demanda). Reaproveita o <FreeDraw/> do /gratis: a lógica de sorteio continua
 * numa fonte única (POST /api/draw com free:true), aqui muda só o SEO.
 *
 * ⚠️ generateMetadata é obrigatório: sem `alternates.canonical` a página herda o
 * canonical do layout (que aponta pra HOME) e se auto-desindexa. Sem `languages`
 * de propósito — esta URL existe apenas em pt-br.
 */

export function generateStaticParams() {
  return [{ locale: "pt-br" }];
}

export const dynamicParams = false;

const TITLE = "Sorteador de Nomes Online Grátis | AzuraSort";
const DESCRIPTION =
  "Sorteador de nomes online grátis: cole a lista de nomes, escolha quantos ganhadores quer e sorteie na hora. Sem cadastro, com certificado verificável.";

const H1 = "Sorteador de nomes online grátis";

const FAQ = [
  {
    q: "Como funciona o sorteador de nomes?",
    a: "Cole a lista de nomes na caixa de texto, um por linha, escolha quantos ganhadores quer e clique em sortear. O resultado aparece na hora, na própria tela, sem instalar nada e sem cadastro.",
  },
  {
    q: "O sorteio é realmente aleatório?",
    a: "Sim. O AzuraSort embaralha a lista com o algoritmo Fisher-Yates a partir de uma semente gerada por um gerador criptográfico, e não por um Math.random qualquer. Cada sorteio gera um certificado com código público: qualquer pessoa pode refazer a conta a partir da semente revelada e confirmar que o resultado não foi alterado depois.",
  },
  {
    q: "Dá para sortear vários ganhadores de uma vez?",
    a: "Sim. Basta informar quantos ganhadores você quer antes de sortear. Cada ganhador é uma pessoa diferente — o mesmo nome nunca é sorteado duas vezes na mesma rodada.",
  },
  {
    q: "Dá para sortear suplentes?",
    a: "Sim. Além dos ganhadores principais, o sorteio pode separar suplentes na mesma rodada, na ordem em que foram sorteados. É útil quando alguém não responde dentro do prazo e você precisa chamar o próximo sem repetir o sorteio.",
  },
  {
    q: "Preciso me cadastrar ou pagar para usar?",
    a: "Não. O sorteador de nomes é grátis e não pede cadastro, e-mail nem cartão. Você só paga se quiser o sorteio completo do Instagram, que coleta os comentários do post automaticamente e gera o vídeo da revelação.",
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
    alternates: { canonical: `/${locale}/sorteador-de-nomes` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE.url}/${locale}/sorteador-de-nomes`,
      siteName: "AzuraSort",
      locale,
      type: "website",
    },
  };
}

export default async function SorteadorDeNomesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <ToolHeader />
      <JsonLd
        data={[
          faqSchema(FAQ),
          breadcrumbSchema([
            { name: "AzuraSort", url: `${SITE.url}/${locale}` },
            { name: H1, url: `${SITE.url}/${locale}/sorteador-de-nomes` },
          ]),
        ]}
      />

      {/* a ferramenta vem primeiro: quem chega aqui quer sortear, não ler */}
      <FreeDraw />

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-4">
        <h1 className="font-display text-2xl font-bold text-ink">{H1}</h1>
        <p className="mt-3 text-sm leading-relaxed text-inkSoft">
          Precisa escolher um nome no meio de uma lista sem ninguém reclamar do resultado? Cole os
          nomes acima — um por linha —, diga quantos ganhadores quer e sorteie. Serve para sorteio de
          brindes, amigo oculto de escritório, escala de tarefas, ordem de apresentação, divisão de
          times ou qualquer decisão que precise ser imparcial. É grátis, roda no navegador e cada
          sorteio ainda gera um certificado com código público para você mostrar a quem participou.
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

        {/* silo de conteudo: as ferramentas se linkam entre si pra nao ficarem ilhadas */}
        <p className="mt-6 text-center text-sm text-inkSoft">
          Vai tirar amigo secreto?{" "}
          <Link href="/amigo-secreto" className="font-semibold text-gold-deep hover:underline">
            Use nosso sorteador de amigo secreto grátis →
          </Link>
        </p>
      </section>
      <ToolFooter />
    </main>
  );
}
