import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevelarAmigo } from "@/components/sorteio/AmigoSecreto";
import { decodeAmigoToken } from "@/lib/amigoSecreto";
import { ToolHeader, ToolFooter } from "@/components/ToolChrome";

/**
 * 🎁 LINK INDIVIDUAL DO AMIGO SECRETO — a URL que o organizador manda no privado
 * para cada participante. O par vem codificado no próprio token (sem banco).
 *
 * ⚠️ DUAS REGRAS QUE NÃO PODEM SER QUEBRADAS:
 *
 * 1. `robots: noindex` — é conteúdo pessoal de uma brincadeira privada. Não
 *    existe busca por "amigo secreto do Felipe": indexar só exporia nomes.
 *
 * 2. O título/description/openGraph NUNCA podem conter o nome sorteado. Este
 *    link é enviado pelo WhatsApp, que renderiza um preview do link ANTES de
 *    alguém abrir — se a resposta estiver nos metadados, o preview entrega o
 *    resultado na conversa e destrói a única razão de existir da ferramenta.
 *    Por isso o texto aqui é genérico de propósito.
 */

export const dynamic = "force-dynamic";

const GENERICO = {
  title: "Seu amigo secreto · AzuraSort",
  description: "Seu amigo secreto está te esperando.",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: GENERICO.title,
    description: GENERICO.description,
    robots: { index: false, follow: false },
    openGraph: {
      title: GENERICO.title,
      description: GENERICO.description,
      siteName: "AzuraSort",
      type: "website",
    },
  };
}

export default async function AmigoSecretoTokenPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;

  // a ferramenta é pt-br only — as outras localizações nem geram esses links
  if (locale !== "pt-br") notFound();
  setRequestLocale(locale);

  // Decodifica SÓ pra validar o link (variável local do servidor, não vira prop).
  // O resultado é descartado de propósito: quem decodifica pra exibir é o
  // navegador, senão o nome sorteado ia junto no HTML — ver RevelarAmigo.
  const payload = decodeAmigoToken(token);

  // link truncado/adulterado: recado amigável, nunca um erro estourado na cara
  // de quem só queria ver o amigo secreto
  if (!payload) {
    return (
      <main className="min-h-screen bg-canvas bg-mesh">
      <ToolHeader />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">
            Esse link não parece completo
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-inkSoft">
            Não conseguimos ler o seu amigo secreto. Normalmente isso acontece quando o link foi
            copiado pela metade ou quebrou em duas linhas na mensagem. Peça para quem organizou o
            sorteio enviar o link inteiro de novo.
          </p>
          <Link href="/amigo-secreto" className="btn-gold mt-8 inline-block px-8 py-3 text-base">
            Fazer um amigo secreto
          </Link>
        </div>
        <ToolFooter />
    </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <ToolHeader />
      <RevelarAmigo token={token} />

      <div className="mx-auto max-w-md px-6 pb-20 text-center">
        <Link href="/amigo-secreto" className="text-sm text-violet hover:underline">
          Fazer o meu próprio amigo secreto →
        </Link>
      </div>
      <ToolFooter />
    </main>
  );
}
