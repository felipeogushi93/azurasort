# Prizegram — Análise de Lacunas para Lançamento

> Comparando: spec do **SorteiGram** (produto que já fatura) + specs de qualidade (**VaultReveal**, régua AAAA) vs **código atual** do Prizegram.
> Pergunta: o que falta para "colocar no ar assim como o outro"?

## Veredito em uma linha
Temos a **metade da frente** pronta e linda (landing premium + revelações + simulador de sorteio).
Falta a **metade de trás** — a que faz dinheiro: **ingestão real de comentários, backend/persistência, pagamento, provably-fair server-side + verificação pública, e deploy.**

---

## ✅ O que JÁ está feito

| Área | Estado |
|---|---|
| Landing AAAAA light premium | ✅ completa (hero, passo a passo, recursos, galeria, diferenciais, FAQ) |
| Engine de revelação + cenas | ✅ 3 cenas (Oscar 3D, Palco 3D, Vídeo+overlay) com `reveal-spec` compartilhada |
| Motor de sorteio (lógica) | ✅ filtros, Fisher-Yates determinístico, SHA-256 seed, multi-vencedor + suplentes, hash de certificado |
| Simulador `/sorteio` | ✅ importar (mock/colar/CSV) → filtrar → sortear → revelar → exportar CSV |
| Base técnica | ✅ monorepo, TS strict, build limpo |

---

## ❌ O que FALTA (por pilar)

### 1. Ingestão real de comentários — 🔴 CRÍTICO
- **Temos:** só manual / CSV / mock.
- **Falta:** cascade de scraping (1+ provider: ScrapeCreators/Apify), endpoint de contagem (meta scrape barato), cache por shortcode.
- **Sem isso não há produto real** — é o coração operacional do SorteiGram.

### 2. Backend / API — 🔴 CRÍTICO
- **Temos:** nada (frontend puro, nenhuma rota de API).
- **Falta:** route handlers no próprio Next (`apps/web/app/api/...`): `comments`, `draw`, `pay`, `verify`, webhooks.
- **Nota importante:** o SorteiGram é **Next.js full-stack**, NÃO NestJS. Isso simplifica muito — não precisamos de um backend separado para lançar. (Reviso o blueprint nesse ponto.)

### 3. Provably-fair server-side + verificação pública — 🔴 CRÍTICO (confiança)
- **Temos:** sorteio no client + hash (mas client-side = adulterável; sem commit-reveal; sem página pública).
- **Falta:** mover o sorteio para o servidor; **commit-reveal** (publica hash do seed ANTES, revela o seed DEPOIS); persistir resultado; página `/verificar` onde qualquer um reroda e confirma.

### 4. Persistência (banco) — 🔴 CRÍTICO
- **Temos:** nada — cada sorteio some ao recarregar.
- **Falta:** banco (Postgres+Prisma, ou SQLite para começar) para sorteios, resultados, pagamentos. A página de verificação EXIGE persistência.

### 5. Monetização — 🔴 CRÍTICO (faturar)
- **Temos:** nada.
- **Falta:** chooser/paywall (≤200 grátis/manual, >200 pago), 1 provedor de pagamento (Woovi PIX / Stripe) com **webhook authoritative**, liberação de acesso (paid-link).
- **Você pluga as contas/chaves** — eu construo a integração com placeholders.

### 6. Deploy / infra / domínio — 🔴 CRÍTICO (ir ao ar)
- **Temos:** roda só local.
- **Falta:** deploy (Vercel = simples para Next; ou VPS como o SorteiGram), domínio, variáveis de ambiente/segredos, URL pública para webhooks de pagamento.

### 7. Qualidade de revelação nível AAAA — 🟡 DIFERENCIAL (não bloqueia lançar)
- **Temos:** 3 cenas boas em React Three Fiber.
- **Falta para nível Awwwards (Lusion/Active Theory):** o **VaultReveal** (Three.js puro + HDRI/PMREM + UnrealBloom + áudio procedural WebAudio + god-rays + timeline de ~15s), e refino das cenas atuais.
- É o "uau" que diferencia, mas **dá para lançar com o que temos** e adicionar depois.

### 8. Growth: SEO / tracking / ops — 🟢 PÓS-LANÇAMENTO
- **Falta:** SEO programático + hreflang + sitemap, tracking gclid→Google Ads, monitoramento + Telegram, recovery system.

---

## 🚀 Caminho mínimo para lançar ("MVP que fatura")

Ordem recomendada:

1. **Fundação backend** — rotas de API no Next + persistência mínima (Prisma + Postgres gerenciado, ex. Neon/Supabase; ou SQLite para começar).
2. **Provably-fair server-side + `/verificar`** — commit-reveal, reaproveitando nosso motor atual.
3. **Ingestão real** — 1 provider de scraping + contagem + cache + fallback manual (já temos).
4. **Chooser/paywall + 1 pagamento** (PIX ou Stripe) + webhook.
5. **Deploy** (Vercel) + domínio + env.
6. **(Depois)** VaultReveal + cenas AAAA + SEO/tracking/monitoramento.

Passos 1–2 não precisam de nenhuma conta externa — dá para começar já.
Passos 3–4 precisam das **suas chaves** (scraping + pagamento).
Passo 5 precisa de **domínio + decisão de hospedagem**.

---

## ❓ Decisões que dependem de você
- **Scraping:** qual provider começar? (ScrapeCreators é barato/rápido; Apify é robusto.) → precisa de API key.
- **Pagamento:** Woovi (PIX BR) ou Stripe (cartão)? → precisa de conta/keys.
- **Banco:** Postgres gerenciado (Neon/Supabase, grátis para começar) ou SQLite local primeiro?
- **Deploy:** Vercel (mais simples para Next) ou VPS (como o SorteiGram)?
- **Domínio:** já tem um para o Prizegram?
