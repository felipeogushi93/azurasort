import { Link } from "@/i18n/navigation";
import { SorteiosMenu } from "@/components/SorteiosMenu";

/**
 * Cabeçalho e rodapé das ferramentas gratuitas (/sorteador-de-nomes,
 * /amigo-secreto).
 *
 * Elas nasciam direto no <main>, sem logo, sem menu e sem rodapé: quem caía
 * nelas por busca ou anúncio não tinha nenhum caminho de volta pra home nem
 * pro produto pago — e o silo de links internos, que era justamente o motivo
 * de existirem, ficava capenga.
 *
 * Estático (sem `fixed`) de propósito: nessas páginas a ferramenta é o
 * conteúdo, e barra grudada no topo só rouba altura no celular.
 */
export function ToolHeader() {
  return (
    <header className="border-b border-ink/5 bg-canvas/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 whitespace-nowrap font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
          Azura<span className="text-gold-deep">sort</span>
        </Link>
        <div className="shrink-0">
          <SorteiosMenu />
        </div>
        <Link href="/sorteio" className="btn-gold ml-auto shrink-0 whitespace-nowrap px-4 py-2 text-sm sm:px-6">
          <span className="sm:hidden">Criar</span>
          <span className="hidden sm:inline">Criar sorteio</span>
        </Link>
      </nav>
    </header>
  );
}

export function ToolFooter() {
  return (
    <footer className="border-t border-ink/5 bg-canvas px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-sm text-inkSoft">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
          <Link href="/" className="hover:text-ink hover:underline">Início</Link>
          <Link href="/sorteio" className="hover:text-ink hover:underline">Sorteio no Instagram</Link>
          <Link href="/sorteador-de-nomes" className="hover:text-ink hover:underline">Sorteador de nomes</Link>
          <Link href="/amigo-secreto" className="hover:text-ink hover:underline">Amigo secreto</Link>
          <Link href="/guia" className="hover:text-ink hover:underline">Como fazer um sorteio</Link>
          <Link href="/termos" className="hover:text-ink hover:underline">Termos</Link>
          <Link href="/privacidade" className="hover:text-ink hover:underline">Privacidade</Link>
        </nav>
        <p className="text-center text-xs text-inkSoft/60">
          © 2026 AzuraSort · LPG Digital. Não afiliado à Meta/Instagram.
        </p>
      </div>
    </footer>
  );
}
