# AzuraSort — Status + Plano de SEO (visão CTO)

## 1. Quadro de status

### ✅ Pronto e no ar (azurasort.com)
- Landing **AAAAA light premium**, **5 idiomas** (en/pt-br/es/ar-ma/fr-ma) com detecção por localização e **árabe RTL**.
- Domínio próprio + HTTPS + CDN (Vercel) + **deploy automático** a cada commit.
- **4 revelações:** Envelope (3D), Palco (vídeo), **Cofre (vídeo, com som + @)**, **Contagem (vídeo, com som + @)**.
- **Coleta real do Instagram** (Apify): prévia (foto + contagem) + comentários, proxy de imagem, cache 15 min.
- **Motor de sorteio** (filtros, Fisher-Yates + seed SHA-256, múltiplos vencedores + suplentes, hash de certificado).
- **Fluxo completo:** link+prévia → base → animação → **paywall** → revelação automática → resultado.
- **Paywall** (chooser/planos no estilo do SorteiGram) + **modo teste grátis**.

### 👍 O que está bom
- **Experiência/visual à frente dos concorrentes** (revelações cinematográficas + design premium + i18n). É o nosso diferencial real.
- **Coleta real funcionando** com economia de API (cache).
- Conceito **provably-fair** (SHA-256) já presente.
- Base técnica sólida (monorepo, TS, build limpo, auto-deploy).

### ⚠️ O que está fraco / faltando (impede faturar/divulgar)
| Item | Situação | Crítico p/ lançar? |
|---|---|---|
| **Pagamento** (PIX/Stripe/PayPal + webhook) | ❌ só visual (paywall não cobra) | 🔴 Sim |
| **Sorteio server-side (commit-reveal)** | ⚠️ hoje roda no client (adulterável) | 🔴 Sim (confiança) |
| **Página /verify pública** | ❌ não existe | 🔴 Sim (confiança) |
| **Banco de dados** (salvar sorteios/pagamentos) | ❌ nada persiste | 🔴 Sim |
| **Fechar o "modo teste"** | ⚠️ aberto a todos | 🔴 Sim (antes de divulgar) |
| **SEO técnico** (sitemap, hreflang, metadata) | ❌ ausente | 🔴 Sim (p/ orgânico) |
| **Termos + Privacidade + LGPD** | ❌ ausente | 🔴 Sim (legal) |
| **Posts grandes** (>2.000 comentários) | ⚠️ capado, sem fila assíncrona | 🟡 Médio |
| **Cortes de vídeo reais** (download MP4) | ⚠️ botões sem render | 🟡 Médio |
| **Admin + Telegram + monitoramento** | ❌ ausente | 🟢 Pós-lançamento |
| **Simulador em outros idiomas** | ⚠️ só PT | 🟢 Pós-lançamento |

### 🚦 Checklist mínimo para começar a divulgar
1. **Pagamento real** (1 provedor PIX) + webhook autoritativo.
2. **Sorteio server-side commit-reveal** + **/verify**.
3. **Banco** (resultados + pagamentos).
4. **Fechar o modo teste** (atrás de senha/flag).
5. **SEO técnico** (sitemap + robots + hreflang + metadata) → seção 2.
6. **Termos/Privacidade/LGPD** + regras de sorteio por país (BR/ES/MA).

---

## 2. Como aparecer no Google (orgânico) — passo a passo

> Realidade: **orgânico leva semanas a meses**. Para tráfego imediato, o SorteiGram usa **Google Ads** (paga por clique). O ideal é os dois: Ads agora + orgânico crescendo.

### Fundação técnica (eu construo — é código)
1. **`robots.txt`** + **`sitemap.xml`** (com todas as URLs e idiomas). — não temos ainda.
2. **hreflang** em todas as páginas (diz ao Google que existe versão pt-br/es/ar-ma/fr-ma/en). Temos i18n, falta marcar o hreflang.
3. **Metadata por página/idioma** (title + description únicos) + **Open Graph** (imagem ao compartilhar).
4. **Dados estruturados** (`SoftwareApplication`, `FAQPage`) — ajuda a aparecer com destaque.
5. **Core Web Vitals** — já estamos rápidos (Vercel/Next).

### Você faz (contas/cadastros)
6. **Google Search Console** (https://search.google.com/search-console): adicionar `azurasort.com`, **verificar** (registro DNS no Cloudflare — eu te guio) e **enviar o sitemap**.
7. **Bing Webmaster Tools** (pega Bing + ajuda IA/AEO).
8. **Google Analytics** (ou Vercel Analytics) pra medir.

### Conteúdo (o que de fato ranqueia)
9. **Páginas-alvo por palavra-chave e idioma:**
   - pt-br: "sorteio instagram", "sorteador de comentários", "sorteio grátis instagram"
   - es: "sorteo instagram", "sortear comentarios"
   - ar-ma / fr-ma: "tirage au sort instagram", termos em árabe/darija
10. **SEO programático** (centenas de páginas): `/[locale]/sorteador-instagram/[nicho]` e `[cidade]`, `/vs/[concorrente]`, `/modelos/[animacao]` (uma por revelação com o vídeo).
11. **Blog/guia:** "como fazer sorteio no Instagram", "regras de sorteio legal" por país.
12. **Loop viral = SEO indireto:** cada vídeo com marca d'água "azurasort.com" gera buscas pela marca + backlinks.

### Ordem recomendada
1ª onda (eu faço): robots + sitemap + hreflang + metadata + OG + structured data.
2ª onda (você): Search Console + verificar + enviar sitemap.
3ª onda: páginas pSEO + blog (conteúdo localizado).
Paralelo: Google Ads para tráfego imediato (como o SorteiGram).
