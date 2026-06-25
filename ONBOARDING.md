# 🚀 AzuraSort — Onboarding (para o sócio dev)

Sorteador de Instagram (azurasort.com): cole o link de um post → sorteia entre os comentários → revela em vídeo → gera certificado verificável. Pagamento por uso (cartão/PIX), multi-idioma (PT/EN/ES/FR/AR), multi-moeda (BRL/EUR/USD).

## 🧱 Stack
- **Next.js 15** (App Router, React 19, TypeScript) — monorepo npm workspaces
- **Prisma 6 + Neon** (Postgres serverless)
- **Vercel** (deploy automático no push pra `main`)
- **Apify** (coleta de comentários do Instagram), **Stripe** (cartão), **Woovi** (PIX)
- **next-intl** (i18n), **Tailwind**, **Framer Motion**, **R3F** (revelações)

## ⚙️ Rodar local
Pré-requisitos: **Node 20+** e **git**.

```bash
git clone https://github.com/felipeogushi93/azurasort.git
cd azurasort
npm install                 # instala todo o monorepo (raiz)
# crie apps/web/.env.local (peça os valores pelo Bitwarden — NUNCA por chat)
npm run dev                 # sobe o site em http://localhost:3000
```
Outros comandos (na raiz): `npm run build` · `npm run typecheck` · `npm run lint`.

### `.env.local` (em `apps/web/`)
Chaves necessárias (peça ao Lucas via gerenciador de senhas, ou use as suas de teste):
`APIFY_TOKEN` · `STRIPE_SECRET_KEY` · `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` · `WOOVI_APP_ID` · `DATABASE_URL` · `DIRECT_URL` · `ADMIN_USER` · `ADMIN_PASSWORD` · `ADMIN_SESSION_SECRET` · `TELEGRAM_BOT_TOKEN` · `TELEGRAM_CHAT_ID` · (opcional) `ALLOW_FREE_DRAWS=1` para sortear sem pagar em dev.

## 🗺️ Mapa do código (`apps/web/`)
- `app/[locale]/` — páginas públicas (landing, `/sorteio`, `/guia`, `/verify/[code]`, `/termos`, `/privacidade`)
- `app/adminlkgat/` — painel admin (KPIs, sorteios, ganhador forçado, **resgate manual**, filtro de datas)
- `app/api/` — rotas: `draw` (coração), `pay/stripe`, `pay/woovi`, `webhooks/stripe`, `admin/*`, `instagram/*`, `track`
- `lib/draw/` — motor do sorteio (`server.ts` = commit-reveal SHA-256 + Fisher-Yates), `engine.ts` (filtros), `parseIg.ts` (resgate)
- `lib/payments/` — `pricing.ts` (preços por FAIXA de participantes), `stripe.ts`, `woovi.ts`
- `lib/seo/` — conteúdo SEO/GEO + dados estruturados
- `lib/admin/` · `lib/notify/telegram.ts` · `messages/*.json` (traduções)

## 🚢 Fluxo de deploy
1. Crie uma branch, faça as mudanças
2. `git push` → o **Vercel cria um preview automático** (o link aparece no Pull Request do GitHub)
3. Teste no preview → merge na `main` → vai pra **produção** (azurasort.com)
4. **Sempre** rode `npm run build` antes de commitar (pega erros de TS/lint)

## ⚠️ Coisas que NÃO devem quebrar (contexto importante)
- **Trava de pagamento**: `/api/draw` só sorteia com pagamento verificado no servidor (ou `ALLOW_FREE_DRAWS=1` em dev). Não remover.
- **Modelo de economia do Apify**: o scraping anônimo do IG só traz ~15 comentários. **Não é bug.** Mostramos o total da prévia e sorteamos entre os coletados; o **resgate manual** (painel) injeta o pool real quando preciso. Não "consertar" achando que é falha.
- **Pricing por faixa**: preço vem da contagem de participantes em `lib/payments/pricing.ts`. Editar valores só lá.
- **Feature isolada (resgate)**: `RescuePanel.tsx`, `lib/draw/parseIg.ts`, `api/admin/rescue`, model `ManualPool`, e um bloco marcado no `/api/draw`. Fácil de remover.
- **Segredos**: nunca commitar `.env.local` (está no .gitignore). Não colar chaves em prints/chat.

## 🔑 Acessos
- **GitHub**: repo `felipeogushi93/azurasort` (você já tem)
- **Vercel/Neon/Stripe/Apify/Woovi**: peça ao Lucas quando precisar mexer em infra/dados
- **Painel admin**: `azurasort.com/adminlkgat`

Dúvidas de arquitetura: comece pelo `/api/draw/route.ts` (fluxo central) e `lib/draw/server.ts` (sorteio justo).
