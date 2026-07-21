import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/seo/content";
import { ToolHeader, ToolFooter } from "@/components/ToolChrome";

/**
 * 🆚 ALTERNATIVA AO SORTEADOR — página de comparação, só pt-br ("alternativa ao
 * sorteador" é busca de marca brasileira, alta intenção de compra: quem procura
 * já usa uma ferramenta e considera trocar).
 *
 * ⚠️ Comparação JUSTA, não ataque: reconhece pra que o sorteador simples serve e
 * é claro sobre onde o AzuraSort entra (coleta automática + vídeo + certificado).
 * Nenhuma afirmação negativa não-verificável sobre o concorrente. Página que
 * xinga rankeia pior e é indefensável.
 *
 * generateMetadata é obrigatório: sem alternates.canonical a página herda o
 * canonical do layout (aponta pra HOME) e se auto-desindexa.
 */

export function generateStaticParams() {
  return [{ locale: "pt-br" }];
}

export const dynamicParams = false;

const TITLE = "Alternativa ao Sorteador para sorteio no Instagram | AzuraSort";
const DESCRIPTION =
  "Procurando uma alternativa ao Sorteador para sortear no Instagram? O AzuraSort coleta os comentários do post automaticamente, entrega vídeo da revelação e certificado verificável. Veja a comparação.";

const H1 = "Alternativa ao Sorteador para sorteio no Instagram";

const FAQ = [
  {
    q: "Qual a diferença entre o Sorteador e o AzuraSort?",
    a: "Um sorteador de nomes tradicional serve para escolher um item de uma lista que você já tem em mãos — você digita ou cola os nomes e ele sorteia. O AzuraSort é focado em sorteio de Instagram: cola-se o link do post e ele coleta os comentários automaticamente, aplica regras (marcar amigo, ignorar repetidos), gera o vídeo da revelação para postar e um certificado público que prova que o resultado não foi manipulado.",
  },
  {
    q: "O AzuraSort é grátis como o Sorteador?",
    a: "O AzuraSort tem ferramentas grátis (sorteador de nomes e amigo secreto, sem cadastro) e um sorteio manual gratuito. O que é pago é o sorteio do Instagram com coleta automática dos comentários e vídeo da revelação — cobrado por sorteio, sem assinatura, com o preço mostrado antes de pagar.",
  },
  {
    q: "Preciso digitar os comentários na mão?",
    a: "No AzuraSort não. Você cola o link do post e ele coleta os comentários para você. Em ferramentas de sorteio de nomes, o padrão é você mesmo montar a lista — o que funciona bem para poucos nomes, mas fica inviável em um post com centenas de comentários.",
  },
  {
    q: "Como o AzuraSort prova que o sorteio foi justo?",
    a: "Cada sorteio gera um certificado com código público. Antes de sortear, é registrado um hash SHA-256 da lista de participantes e da semente; depois, o certificado revela esses dados. Qualquer pessoa pode refazer a conta e confirmar que o resultado não foi alterado. É a mesma transparência que muitos criadores buscam ao gravar a tela na mão — só que automática e verificável.",
  },
  {
    q: "Vale a pena trocar de ferramenta?",
    a: "Depende do que você precisa. Para um sorteio informal entre poucos nomes, um sorteador simples resolve. Para um sorteio de Instagram de marca ou influenciador — onde importa coletar todos os comentários, provar que foi limpo e ter um vídeo para postar —, é aí que o AzuraSort foi feito para entrar.",
  },
];

const COMPARACAO = [
  { criterio: "Coleta os comentários do post", sorteador: "Você monta a lista", azura: "Automático pelo link" },
  { criterio: "Regras (marcar amigo, ignorar repetidos)", sorteador: "Manual", azura: "Aplicadas no sorteio" },
  { criterio: "Vídeo da revelação para postar", sorteador: "—", azura: "MP4 pronto (feed/stories)" },
  { criterio: "Certificado público verificável", sorteador: "—", azura: "SHA-256, com código público" },
  { criterio: "Vários ganhadores + suplentes", sorteador: "Depende", azura: "Sim, na mesma rodada" },
  { criterio: "Preço", sorteador: "Grátis", azura: "Grátis (nomes) / pago por sorteio (Instagram)" },
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
    alternates: { canonical: `/${locale}/alternativa-ao-sorteador` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE.url}/${locale}/alternativa-ao-sorteador`,
      siteName: "AzuraSort",
      locale,
      type: "article",
    },
  };
}

export default async function AlternativaSorteadorPage({
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
            { name: "Alternativa ao Sorteador", url: `${SITE.url}/${locale}/alternativa-ao-sorteador` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{H1}</h1>
        <p className="mt-4 text-base leading-relaxed text-inkSoft">
          Se você usa o Sorteador (ou outro sorteador de nomes) e está procurando algo feito
          especificamente para <strong>sorteio no Instagram</strong>, este é o ponto onde as duas
          ferramentas se separam. Um sorteador tradicional escolhe um item de uma lista que você já
          tem. O AzuraSort parte do <strong>link do seu post</strong>: coleta os comentários,
          aplica as regras, sorteia e ainda te entrega um vídeo da revelação e um certificado que
          prova que o resultado foi limpo.
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-ink">Comparação rápida</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left">
                <th className="py-2 pr-3 font-semibold text-ink"></th>
                <th className="py-2 px-3 font-semibold text-inkSoft">Sorteador de nomes</th>
                <th className="py-2 pl-3 font-semibold text-gold-deep">AzuraSort</th>
              </tr>
            </thead>
            <tbody>
              {COMPARACAO.map((r) => (
                <tr key={r.criterio} className="border-b border-ink/5 align-top">
                  <td className="py-2.5 pr-3 font-medium text-ink">{r.criterio}</td>
                  <td className="py-2.5 px-3 text-inkSoft">{r.sorteador}</td>
                  <td className="py-2.5 pl-3 text-ink">{r.azura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-display text-xl font-bold text-ink">
          Quando o Sorteador basta — e quando não
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-inkSoft">
          Não existe ferramenta melhor para tudo. Para escolher um nome no meio de uma lista que
          você já tem — o amigo oculto da firma, a ordem de apresentação, um brinde entre colegas —,
          um sorteador de nomes simples e gratuito resolve, e o AzuraSort inclusive tem um{" "}
          <Link href="/sorteador-de-nomes" className="font-semibold text-gold-deep hover:underline">
            sorteador de nomes grátis
          </Link>{" "}
          para isso.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-inkSoft">
          A diferença aparece quando o sorteio é de <strong>Instagram e de verdade importa</strong>:
          um post com centenas de comentários (montar a lista na mão vira inviável), a necessidade de{" "}
          <strong>provar que o ganhador não foi escolhido a dedo</strong> — algo cada vez mais
          cobrado depois de casos de sorteios manipulados de influenciadores — e a vontade de
          transformar o resultado em <strong>conteúdo</strong>, com um vídeo pronto para o feed. É
          exatamente esse conjunto que o AzuraSort resolve e um sorteador genérico não cobre.
        </p>

        <div className="mt-8 space-y-5">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h2 className="font-display text-base font-semibold text-ink">{f.q}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-inkSoft">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-6 text-center shadow-gold">
          <p className="font-display text-lg font-bold text-ink">
            Faça seu sorteio de Instagram com vídeo e certificado
          </p>
          <p className="mt-2 text-sm text-inkSoft">
            Cole o link do post, sorteie na hora e receba o vídeo da revelação pronto para postar.
          </p>
          <Link href="/sorteio" className="btn-gold mt-5 inline-block px-8 py-3 text-base">
            Criar meu sorteio →
          </Link>
        </div>
      </article>
      <ToolFooter />
    </main>
  );
}
