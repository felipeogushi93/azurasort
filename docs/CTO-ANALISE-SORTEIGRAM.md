# Análise CTO — SorteiGram → AzuraSort

> Leitura completa do `SorteiGram-Technical-Spec.md` com olhar de CTO: o que o produto provado tem, o que dá pra portar, esforço, prioridade e arquitetura. Inclui motor de sorteio, economia de API, Telegram, painel admin, monitoramento e revelação.

---

## 1. Resumo executivo

O SorteiGram é **simples no conceito, complexo na operação**. O valor real não está em "sortear" (isso é o `sorteio-engine`, pequeno e congelado) — está em **3 moats operacionais**:

1. **Cobertura de coleta** — consegue puxar comentários mesmo quando o Instagram bloqueia (cascade de 8 estágios).
2. **Economia de custo** — cache + cascade barato-primeiro mantém o custo por sorteio baixo (margem do PIX de R$24,90).
3. **Operação 24/7** — monitor + auto-heal + recovery + Telegram = roda sozinho e avisa o dono.

O AzuraSort hoje tem a **vitrine** (landing premium i18n + revelação cinematográfica + simulador client-side). Falta **toda a metade operacional acima**. Esta análise mapeia como portar.

---

## 2. Mapa de capacidades (SorteiGram → AzuraSort)

| # | Capacidade | O que faz no SorteiGram | Temos? | Esforço | Prioridade |
|---|---|---|---|---|---|
| 1 | **Motor de sorteio commit-reveal** | SHA-256: publica hash do seed ANTES, revela DEPOIS; Fisher-Yates determinístico | Parcial (sorteio client, sem commit-reveal) | M | 🔴 P0 |
| 2 | **Seleção de vencedores + suplentes** | nº ganhadores, backups, reproduzível | Sim (client) | — | ✅ |
| 3 | **Filtros / anti-fraude** | menções, hashtag, palavra-chave, dedupe, `fraudeScore` anti-bot | Parcial (sem fraudeScore) | M | 🟡 P1 |
| 4 | **Ingestão de comentários (scraping)** | cascade 8 estágios, multi-provider | Não (só manual/CSV) | XL | 🔴 P0 |
| 5 | **Economia de API** | cache `_paid` 24h / free 5min, cascade barato→caro, rate-limit, dedupe inflight, multi-token | Não | L | 🔴 P0 (anda junto do #4) |
| 6 | **Contagem de comentários (cheap meta)** | apifyMeta ~$0.05 só pra contar → decide chooser/paywall | Não | S | 🔴 P0 |
| 7 | **Chooser / Paywall** | ≤200 grátis/manual · >200 pago | Não | M | 🔴 P0 |
| 8 | **Pagamento + webhook** | Woovi PIX / Stripe / PayPal, webhook authoritative, paid-link | Não | L | 🔴 P0 |
| 9 | **Telegram (vendas + alertas)** | `notifyTelegram` — venda com valor, custos, exhausted, count-zero | Não | S | 🟡 P1 |
| 10 | **Painel admin** | manual-paste, force-load, reset-drawn, tier, just-unlock, diagnose | Não | L | 🟡 P1 |
| 11 | **Recovery system** | failed-jobs + `/admin-rescue` (colar comentários na mão) | Não | M | 🟡 P1 |
| 12 | **Monitoramento / cron** | health 5min + auto-heal PM2, daily report, backups, IG warmup | Não | M | 🟢 P2 |
| 13 | **Conversion tracking** | gclid (cookie) → bind paymentId → CSV → Google Ads | Não | M | 🟢 P2 (quando rodar Ads) |
| 14 | **Página de verificação pública** | `/verify` reroda e confirma | Não | S | 🔴 P0 |
| 15 | **Countdown + shuffle na revelação** | timer + embaralhamento na tela | Parcial (temos cenas) | S | 🟡 P1 |
| 16 | **Multi-currency / geo-pricing** | BRL/USD/MXN/EUR por país | Não | S | 🟢 P2 |
| 17 | **Persistência (DB)** | Postgres + Prisma (sorteios, pagamentos, ganhadores) | Não | M | 🔴 P0 |

Legenda esforço: S=pequeno, M=médio, L=grande, XL=muito grande. P0=bloqueia faturar.

---

## 3. Detalhe por pilar

### 3.1 Motor de sorteio — o CORE (congelado)
O SorteiGram trata `sorteio-engine` como **imutável** (qualquer mudança quebra auditorias passadas). O padrão é **commit-reveal**:
1. Antes: gera `seed = randomBytes(32)`, publica **só o hash** `SHA256(seed)`.
2. Coleta os participantes.
3. Sorteia: ordena por `id.localeCompare` (determinismo cross-machine) → Fisher-Yates com `HMAC(seed, counter)`.
4. Depois: revela o `seed`. Qualquer um confere `SHA256(seed) == hash` e re-roda.

**No AzuraSort:** nosso `engine.ts` já faz Fisher-Yates + SHA-256, mas **roda no client** (adulterável) e **sem commit-reveal**. Portar para o servidor + commit-reveal é P0 de confiança. A lógica de sort/shuffle deve copiar a do SorteiGram **idêntica** (assim sorteios são compatíveis e auditáveis pelo mesmo método).

### 3.2 Ingestão + ECONOMIA DE API (o pulo do gato do custo)
Quanto mais comentários, mais caro. O SorteiGram economiza com:
- **Contar barato primeiro** (`apifyMeta` ~$0.05) → decide se precisa da coleta cara.
- **Cascade barato→caro:** ScrapeCreators ($0.0004/req) → EnsembleData → browser pool → Apify ($0.30/run) → … Só escala pro caro se o barato não entregou.
- **Cache agressivo:** `_paid` 24h (imutável após `locked`), free 5min. Mesmo shortcode não re-raspa.
- **Anti-desperdício:** rate-limit 1 cascade/30s por IP; dedupe `inflight` (Map<shortcode, started_at>) evita cascades simultâneas; rescue ≤60s = SKIP.
- **Multi-token Apify** com cooldown de 30min em 403 (não entra em loop).

**No AzuraSort:** desenhar um `CommentProvider` com **interface única** e implementações em cascade, com **cache** (Redis ou tabela + TTL) e **contagem barata** antes. Começar com **1 provider** (ScrapeCreators) + fallback manual (que já temos). O cache e o "contar antes" são o que protege a margem.

> ⚠️ Lição do SorteiGram: **nunca** chamar provider caro (Apify residencial) em fluxo grátis sem paid-link. É o que estoura o custo.

### 3.3 Chooser / Paywall + Pagamento
- `/api/comments` recebe a URL → conta (barato) → decide:
  - **≤200:** chooser (grátis manual OU pago automático).
  - **>200:** paywall obrigatório.
- Paga via PIX (Woovi) → **webhook é a fonte da verdade** (não confia em `?paid=1` do front) → libera `paid-link` → roda cascade.
- **No AzuraSort:** Next full-stack (route handlers), 1 provider de pagamento pra começar (PIX via Woovi/Mercado Pago, ou Stripe). Webhook autoritativo + dedupe `paymentId` único.

### 3.4 Telegram (venda avisa no seu celular)
`notifyTelegram(text)` → `api.telegram.org/bot{TOKEN}/sendMessage`. Eventos: `payment_confirmed` ("💰 VENDA PIX R$ X | tier | shortcode"), `custo_scraping`, `apify_primary_exhausted`, `count_zero_alert`, `manual_paste`.
**No AzuraSort:** módulo `notify` (1 arquivo) chamado no webhook de pagamento e em erros de coleta. **Barato e altíssimo valor** (você sente o negócio respirando). Esforço S → fazer cedo.

### 3.5 Painel admin (visualização + resgate)
Rotas admin (header `x-admin-key`): `manual-paste` (colar comentários no resgate), `force-load`, `reset-drawn`, `tier`, `just-unlock`, `diagnose`. Mais o `/admin-rescue` (cliente pagou, cascade falhou → admin cola na mão → libera).
**No AzuraSort:** uma área `/admin` protegida com: lista de sorteios/pagamentos, status de coleta, botão "colar comentários manual" (resgate), e diagnóstico. Reaproveita nosso parser de colagem que já existe.

### 3.6 Monitoramento (roda sozinho)
Cron 5min: checa sites + **auto-heal** (restart PM2 se errored) + alerta "90min sem venda" + "Apify exhausted". Daily report 02h (vendas + custo). Backups 03h.
**No AzuraSort (Vercel):** parte vira **Vercel Cron** + healthchecks; alertas no Telegram. Auto-heal do PM2 não se aplica (serverless). Backups do DB pelo provedor (Neon/Supabase).

### 3.7 Conversion tracking (quando rodar Google Ads)
gclid no cookie → bind com `paymentId` → CSV diário → upload no Google Ads (conversão offline) → ROAS real. P2, só quando investir em Ads.

### 3.8 Revelação (countdown + shuffle + cofre)
SorteiGram: contagem regressiva + embaralhamento dos nomes na tela. Nós já temos cenas 3D (Oscar, Palco). O **VaultReveal** (cofre, prompt que você mandou) é a evolução premium — nível Awwwards. P1 de diferenciação, não bloqueia faturar.

---

## 4. Arquitetura recomendada para o AzuraSort

**Descoberta-chave:** o SorteiGram é **Next.js full-stack** (não NestJS). Seguimos igual — mais simples e provado.

```
apps/web (Next.js no Vercel)
├─ app/[locale]/...            # vitrine (pronto)
├─ app/api/
│  ├─ comments/route.ts        # conta (barato) + cascade + cache
│  ├─ draw/route.ts            # commit-reveal server-side
│  ├─ pay/route.ts             # cria PIX/checkout
│  ├─ webhooks/pay/route.ts    # AUTORITATIVO → paid-link + Telegram
│  ├─ verify/[code]/route.ts   # auditoria pública
│  └─ admin/*                  # resgate, diagnose (x-admin-key)
├─ lib/
│  ├─ draw/                    # motor (portar commit-reveal do SorteiGram)
│  ├─ providers/               # CommentProvider cascade + cache
│  ├─ pay/                     # provider de pagamento + webhook
│  └─ notify/telegram.ts       # alertas de venda
packages/db (Prisma + Postgres gerenciado: Neon/Supabase)
```
Filas/cron: **Vercel Cron** + (se precisar de jobs longos de coleta) um worker leve. Cache: Redis (Upstash) ou tabela com TTL.

---

## 5. Roadmap priorizado (o que faz dinheiro primeiro)

**Fase A — Faturar (P0):**
1. DB (Prisma + Neon) + persistência de sorteios/resultados.
2. Motor commit-reveal server-side + `/verify` pública.
3. Ingestão: contar-barato + 1 provider (ScrapeCreators) + cache + fallback manual.
4. Chooser/Paywall + 1 pagamento (PIX) + webhook autoritativo.
5. **Telegram** de venda (S, alto valor — encaixar aqui).

**Fase B — Operar (P1):**
6. Painel admin + recovery (resgate manual).
7. Filtros anti-fraude (fraudeScore).
8. Countdown/shuffle + 1ª cena AAAA (VaultReveal).

**Fase C — Escalar (P2):**
9. Monitoramento (Vercel Cron + Telegram), multi-currency, conversion tracking, mais providers na cascade.

---

## 6. O que você pode estar esquecendo (gaps)
- **Margem por sorteio:** sem o "contar barato + cache", um sorteio grande pode custar mais do que o cliente paga. A economia de API **é** o modelo de negócio.
- **Webhook autoritativo:** nunca liberar acesso por `?paid=1` do front (fraude trivial). Só o webhook libera.
- **Idempotência:** `paymentId` único + dedupe de cascade (inflight) — senão cobra/raspa duplicado.
- **LGPD/dados:** guardamos @ e textos de comentários — política de retenção e base legal.
- **Regras de sorteio por país:** BR (distribuição gratuita de prêmios), ES, MA têm normas — afeta copy e termos.
- **Limite serverless:** coleta de milhares de comentários pode estourar o timeout do Vercel (10–60s). Pode exigir um worker/fila para posts grandes.
- **Custo de e-mail/suporte:** recovery manual exige um canal (WhatsApp/e-mail) e SLA.
