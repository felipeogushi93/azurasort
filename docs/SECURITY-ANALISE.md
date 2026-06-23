# AzuraSort — Análise de Segurança & Integridade (visão CTO, AAAA)

> Revisão completa do sistema atual: vulnerabilidades, integridade do produto, o que corrigi agora e o que falta antes de divulgar.

## Nota geral
**Postura atual: FRACA para produção (esperado nesta fase).** A vitrine é segura; a parte transacional ainda não tem os pilares de confiança (sorteio no servidor, webhooks, banco, auth). Abaixo, priorizado por severidade.

---

## 1. Vulnerabilidades (severidade · status)

| # | Item | Sev. | Status |
|---|---|---|---|
| 1 | **Sorteio roda no CLIENT** (adulterável pelo usuário no navegador) | 🔴 Alta | ⏳ pendente → mover p/ servidor (commit-reveal) |
| 2 | **"Modo teste" liberava pagamento de graça pra todos** | 🔴 Crítica | ✅ corrigido (gate `?teste=1`) — antes de lançar, trocar por auth real |
| 3 | **Rotas caras públicas** (Apify) sem limite → drenar seu crédito | 🔴 Alta | ✅ mitigado (rate limit por IP) — prod precisa Redis |
| 4 | **Pagamento confirmado no client** (sem webhook autoritativo) | 🔴 Alta | ⏳ pendente → webhook + banco |
| 5 | **Sem banco** → sem auditoria, sem `/verify`, sem recibo | 🔴 Alta | ⏳ pendente (Neon) |
| 6 | **Sem cabeçalhos de segurança** (X-Frame-Options, etc.) | 🟡 Média | ⏳ pendente |
| 7 | **Sem autenticação** (necessária pro painel admin) | 🟡 Média | ⏳ pendente |
| 8 | **LGPD**: guardamos @ e textos de comentários | 🟡 Média | ⏳ política + retenção |
| 9 | Proxy de imagem | 🟢 Baixa | ✅ ok (restrito ao CDN do Instagram) |
| 10 | Segredos | 🟢 Baixa | ✅ ok (`.env.local` gitignored + Vercel; `sk` server-only, `pk` público por design) |
| 11 | `npm audit`: 2 vulnerabilidades moderadas (transitivas) | 🟢 Baixa | ⏳ revisar |

---

## 2. ⚠️ INTEGRIDADE DO PRODUTO (os 2 pontos mais sérios)

### 2.1 Cap de 2.000 comentários vs "mostrar todos"
Hoje: para posts grandes, **coletamos só 2.000 comentários** mas **exibimos o total** (ex.: 34 mil). Isso significa que o sorteio acontece **entre ≤2.000**, não entre todos.

🚨 **Isso NÃO é "economia" — é propaganda enganosa / sorteio injusto.** Você cobra por um sorteio "justo e verificável" mas exclui a maioria. Risco **legal** (fraude em distribuição de prêmios) e de **reputação**.

✅ **Correto (modelo SorteiGram):** a economia é **cache** (não repuxar) + **contar barato primeiro** + **só raspar TUDO depois do pagamento** (o pagamento cobre o custo do Apify). Aí o sorteio é entre **todos** e o número exibido é real. Para posts gigantes, coleta **assíncrona/paginada**.
→ **Recomendo remover o cap para sorteios pagos** e coletar todos. Posso implementar.

### 2.2 Selecionar ganhadores (painel) vs "Provably Fair"
O site anuncia **"Sorteio justo · 100% aleatório · verificável (SHA-256)"**. Se o painel permite **escolher o ganhador**, isso **contradiz diretamente** essa promessa: a página de verificação pública (`/verify`) ficaria **falsa**, e seria **fraude ao consumidor**.

🚨 Como CTO, **desaconselho fortemente** rigar sorteios. Se mesmo assim você quiser:
- Teria que **remover** toda a comunicação "provably fair / verificável" (não dá pra ter os dois).
- O risco legal é alto (sorteio é regulado; manipular resultado é crime/infração).

→ **Minha recomendação:** painel **somente leitura** (ver sorteios, KPIs) — sem seleção de ganhador. Mantém a integridade que é o seu diferencial. Decisão final é sua, mas precisa ser consciente.

---

## 3. O que corrigi agora
- ✅ **Rate limit** (por IP) nas rotas Apify (preview/comments) e de pagamento (Stripe/Woovi) — protege contra abuso/drenagem de crédito.
- ✅ **Modo teste fechado** ao público (só aparece com `?teste=1` na URL).

---

## 4. Arquitetura em camadas (recomendada)
Já está parcialmente organizado. Alvo:
```
lib/
├─ domain/     # regras puras (sorteio, filtros) — sem I/O, testável
├─ services/   # orquestração (coleta, pagamento, sorteio)
├─ providers/  # integrações externas (apify, stripe, woovi)
├─ db/         # Prisma (acesso a dados) [futuro]
└─ utils/      # rateLimit, helpers
app/
├─ (marketing) [locale]/...   # vitrine
├─ (app) [locale]/sorteio     # ferramenta
├─ admin/                     # painel (auth forte)
└─ api/                       # rotas finas → chamam services
```
Regra: **API fina** (valida + chama service); **regra de negócio no domain** (sem I/O); **I/O nos providers**. Migração incremental (sem big-bang, pra não quebrar).

---

## 5. Checklist de segurança PRÉ-LANÇAMENTO (🔴 = bloqueia)
1. 🔴 **Sorteio no servidor** (commit-reveal) + `/verify` pública.
2. 🔴 **Webhook autoritativo** (Stripe/Woovi) + **banco** (libera só após pago de verdade).
3. 🔴 **Coletar todos os comentários** em sorteio pago (remover o cap 2.000).
4. 🔴 **Auth real** no painel admin (não `?teste=1`).
5. 🟡 Rate limit distribuído (Upstash Redis).
6. 🟡 Cabeçalhos de segurança + revisar `npm audit`.
7. 🟡 Termos + Privacidade + LGPD (retenção de dados dos comentários).
8. 🟢 Logs/monitoramento + Telegram de alertas.
