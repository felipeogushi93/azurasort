import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Detecta o idioma (cookie -> Accept-Language do navegador/localizacao) e
 * redireciona para o prefixo correto (/pt-br, /es, /ar-ma, /fr-ma, /en).
 * Fallback: /en.
 */
export default createMiddleware(routing);

export const config = {
  // roda em tudo, menos arquivos estaticos, rotas internas, /api e /adminlkgat
  matcher: ["/((?!api|adminlkgat|_next|_vercel|.*\\..*).*)"],
};
