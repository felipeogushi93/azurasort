# Google Ads — Tracking de Conversões AzuraSort

Doc entregue em 08/07/2026 pelo Lucas + Claude. Explica **o que está funcionando
hoje** e **o que falta você fazer manualmente 1x** pra fechar o ciclo.

---

## Status atual (após commit `feat(tracking): captura gclid + Enhanced Conversions`)

### ✅ Funcionando em produção

1. **Pixel client-side melhorado (Enhanced Conversions)**
   - `layout.tsx` agora tem `allow_enhanced_conversions: true` nos 3 gtag configs
   - Google Ads passa a fazer **hash automático** de emails/telefones digitados
     em qualquer input do site → usa como user identifier no match retroativo
   - **Efeito:** conversão é registrada mesmo se o browser bloqueia cookie
     (~+15-30% no match rate)

2. **Captura de `gclid` (Google Ads Click ID) em todo pagamento**
   - Prioridade: `?gclid=` na URL → cookie `_gcl_aw` → `localStorage.gclid`
   - Passado como `additionalInfo` ao criar charge Woovi (webhook retorna)
   - Persistido em `Payment.gclid` no banco Neon
   - Coluna nova: `Payment.gclid` (TEXT nullable)

3. **Coluna `Payment.conversionUploaded`**
   - Booleana, default `false`
   - Vira `true` só quando o upload server-side foi aceito (dedup)

4. **Conversion Action "Compra Azura (offline)" criada**
   - ID: **7677276602**
   - Type: UPLOAD_CLICKS (offline)
   - Categoria: PURCHASE
   - Primária, valor default R$ 24,90
   - Janela click-through: 30 dias

5. **Hook server-side pronto (não ativo ainda)**
   - `lib/googleAds/uploadConversion.ts` chama Google Ads REST API
   - Rodado no `/api/pay/confirm` (Woovi) e no webhook Stripe
   - **Silencioso** — falha não derruba fluxo de pagamento
   - **Só vai funcionar depois do setup UI abaixo**

---

## ❌ O que falta para o upload server-side automático funcionar

Google restringiu a `UploadClickConversions` API para novas integrações em 2026.
Novas integrações precisam usar a **Data Manager API**, que exige linkagem
manual no dashboard antes de aceitar chamadas via API.

### Passo a passo (1 vez, ~10min)

1. **Entrar no Google Ads da conta AzuraSort BR** (id 1569133219)

2. **Ferramentas & Configurações → Gerenciamento de Dados → Data Manager**
   URL direto: https://ads.google.com/aw/datamanager

3. **Criar uma Data Source (fonte)**
   - Tipo: **Server-side offline conversions**
   - Nome sugerido: `AzuraSort Backend`
   - Aceitar os TOS (Termos de Serviço)

4. **Conectar essa Data Source à Conversion Action existente**
   - Selecionar a ação `Compra Azura (offline)` (id 7677276602)
   - Confirmar

5. **Copiar o `Product Destination ID` gerado**
   - Vai aparecer no formato `AW-XXXXXXXX-XX` ou similar
   - Cole no Vercel como env var `GOOGLE_ADS_PRODUCT_DESTINATION_ID`

6. **Adicionar env vars restantes no Vercel** (Projeto `azurasort` →
   Settings → Environment Variables):

   ```
   GOOGLE_ADS_CLIENT_ID=1019786155228-8ilgiorea5pdut53ctmboi9ps5b6jt82.apps.googleusercontent.com
   GOOGLE_ADS_CLIENT_SECRET=<pegar do googleads.yaml no VPS>
   GOOGLE_ADS_REFRESH_TOKEN=<pegar do googleads.yaml no VPS>
   GOOGLE_ADS_DEVELOPER_TOKEN=<pegar do googleads.yaml no VPS>
   GOOGLE_ADS_PRODUCT_DESTINATION_ID=<o que a UI gerou>
   ```

7. **Redeploy** — ou espere o próximo push. A partir daí, cada venda Woovi/Stripe
   dispara automaticamente a conversão no Google Ads (mesmo se o cliente fechar
   a aba).

---

## Como testar depois do setup

```bash
# Simular uma venda passando gclid pela URL
curl -X POST https://azurasort.com/api/pay/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "woovi",
    "externalId": "test-tracking-001",
    "plan": "premium",
    "currency": "BRL",
    "count": 100,
    "gclid": "EAIaIQobChMI..."
  }'
```

Depois, ver no banco:
```sql
SELECT externalId, gclid, conversionUploaded FROM "Payment"
WHERE externalId = 'test-tracking-001';
```

`conversionUploaded=true` = enviado com sucesso.

---

## Fallback (o que fazer se algo quebrar)

- **Se o upload server-side falhar**: nada quebra. O `.catch()` engole o erro,
  Payment fica com `conversionUploaded=false`. O pixel client-side continua
  disparando quando o cliente chega no simulator (fluxo antigo intacto).

- **Se você quiser desativar temporariamente**: remova a env var
  `GOOGLE_ADS_DEVELOPER_TOKEN` no Vercel → o helper detecta e não faz a chamada.

- **Para debugar**: veja os logs Vercel do endpoint `/api/pay/confirm`. Toda
  tentativa loga `[googleAds/upload] OK` ou `[googleAds/upload] HTTP <status>`.

---

## Arquitetura em 3 camadas (por que ficou assim)

```
Cliente paga
     │
     ├── 1. Client-side pixel (gtag) — dispara SE cliente chega no simulator
     │      • allow_enhanced_conversions=true (match retroativo email/phone)
     │
     ├── 2. Woovi additionalInfo carrega gclid → webhook retorna com gclid
     │      • útil pra atribuição em qualquer lugar (painel-ia, analytics)
     │
     └── 3. Server-side upload (Data Manager API) — dispara SEMPRE
            • independente do cliente fechar aba
            • idempotente por Payment.externalId
```

As 3 camadas são **complementares**, não redundantes:
- Camada 1 pega usuários que completam o fluxo (rápido, direto).
- Camada 2 dá atribuição pro painel de analytics.
- Camada 3 fecha o loop de conversão pro Smart Bidding.

Sem a camada 3, o Smart Bidding fica cego a ~30% das vendas reais.
