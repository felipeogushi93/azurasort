/**
 * Conteúdo legal (Termos de Uso + Política de Privacidade).
 *
 * ⚠️ MODELO PADRÃO — não substitui revisão jurídica. Preencha os dados da empresa
 * (CNPJ, razão social, e-mail do DPO) antes de divulgar. PT é o documento canônico
 * (empresa BR / LGPD); EN serve os demais locales.
 */

export const LEGAL = {
  brand: "AzuraSort",
  company: "LPG Digital", // razão social — ajustar se diferente
  cnpj: "[inserir CNPJ]",
  domain: "azurasort.com",
  email: "contato@azurasort.com", // e-mail de contato/privacidade — ajustar
  updated: "23/06/2026",
  updatedEn: "June 23, 2026",
};

export type Section = { h: string; p: string[] };
export type LegalDoc = { title: string; intro: string; sections: Section[] };

const L = LEGAL;

/* ----------------------------- TERMOS (PT) ----------------------------- */
const termosPt: LegalDoc = {
  title: "Termos de Uso",
  intro: `Última atualização: ${L.updated}. Estes Termos regem o uso da plataforma ${L.brand} (${L.domain}), operada por ${L.company}, inscrita no CNPJ ${L.cnpj} ("nós"). Ao utilizar o serviço, você ("usuário") concorda integralmente com estes Termos.`,
  sections: [
    {
      h: "1. O que é o serviço",
      p: [
        `${L.brand} é uma ferramenta online que realiza sorteios a partir de comentários de publicações públicas do Instagram, com método auditável (comprovação criptográfica SHA-256) e revelação do ganhador em vídeo. O serviço é cobrado por uso (pagamento único por sorteio), conforme o plano escolhido.`,
        "Não somos afiliados, patrocinados ou endossados pela Meta Platforms, Inc., Instagram ou qualquer rede social. As marcas citadas pertencem aos respectivos titulares.",
      ],
    },
    {
      h: "2. Responsabilidade pelo sorteio",
      p: [
        "O usuário é o único e exclusivo responsável pela promoção/sorteio que organiza, incluindo: a legalidade da ação, regras, premiação, entrega do prêmio, comunicação com os participantes e eventual necessidade de autorização de órgãos competentes (ex.: SECAP/Ministério da Fazenda no Brasil, quando aplicável).",
        `${L.company} apenas fornece a ferramenta tecnológica de seleção. Não nos responsabilizamos pela entrega de prêmios, por disputas entre o organizador e participantes, nem pela conformidade do sorteio com a legislação aplicável.`,
      ],
    },
    {
      h: "3. Uso permitido",
      p: [
        "Você concorda em usar o serviço apenas para fins lícitos e em conformidade com os termos do Instagram/Meta e a legislação vigente. É proibido usar a plataforma para fraude, lavagem de dinheiro, conteúdo ilegal, assédio ou qualquer atividade que viole direitos de terceiros.",
        "Você não pode tentar burlar, sobrecarregar, fazer engenharia reversa ou explorar falhas do serviço.",
      ],
    },
    {
      h: "4. Coleta de dados públicos",
      p: [
        "Para realizar o sorteio, a plataforma processa dados publicamente disponíveis na publicação indicada pelo usuário (nomes de usuário/@ e textos dos comentários). Esse processamento ocorre por solicitação e sob responsabilidade do usuário organizador.",
      ],
    },
    {
      h: "5. Pagamentos e reembolso",
      p: [
        "O serviço é pré-pago por sorteio. Os preços são exibidos antes da contratação e podem ser alterados a qualquer momento, sem efeito retroativo. Pagamentos são processados por terceiros (Stripe e Woovi); não armazenamos dados completos de cartão.",
        "Por se tratar de serviço digital de execução imediata, o reembolso é concedido apenas em caso de falha técnica comprovada da plataforma que impeça a realização do sorteio pago. Solicitações: " + L.email + ".",
      ],
    },
    {
      h: "6. Resultado e auditoria",
      p: [
        "O resultado do sorteio é gerado por algoritmo determinístico de comprovação pública (commit-reveal SHA-256) e pode ser verificado na página de certificado. O resultado é definitivo, salvo erro técnico evidente.",
      ],
    },
    {
      h: "7. Limitação de responsabilidade",
      p: [
        `Na máxima extensão permitida em lei, a responsabilidade total de ${L.company} perante o usuário, por qualquer causa, fica limitada ao valor pago pelo usuário pelo sorteio específico que originou a demanda. Não respondemos por danos indiretos, lucros cessantes ou indisponibilidade temporária do serviço.`,
        "O serviço é fornecido \"no estado em que se encontra\", sem garantias de disponibilidade ininterrupta.",
      ],
    },
    {
      h: "8. Propriedade intelectual",
      p: [
        `Todo o conteúdo, marca, design, código e materiais do ${L.brand} são de titularidade de ${L.company} e protegidos por lei. Os vídeos e certificados gerados podem ser usados pelo usuário para divulgar seu próprio sorteio.`,
      ],
    },
    {
      h: "9. Alterações e encerramento",
      p: [
        "Podemos atualizar estes Termos a qualquer momento; a versão vigente será sempre a publicada nesta página. Podemos suspender ou encerrar o acesso de usuários que violem estes Termos.",
      ],
    },
    {
      h: "10. Lei aplicável e foro",
      p: [
        "Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro do domicílio do usuário consumidor para dirimir controvérsias, conforme o Código de Defesa do Consumidor.",
      ],
    },
    {
      h: "11. Contato",
      p: [`Dúvidas sobre estes Termos: ${L.email}.`],
    },
  ],
};

/* -------------------------- PRIVACIDADE (PT) -------------------------- */
const privacidadePt: LegalDoc = {
  title: "Política de Privacidade",
  intro: `Última atualização: ${L.updated}. Esta Política descreve como ${L.company} (CNPJ ${L.cnpj}), operadora do ${L.brand} (${L.domain}), trata dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).`,
  sections: [
    {
      h: "1. Quem é o controlador",
      p: [`O controlador dos dados é ${L.company}, CNPJ ${L.cnpj}. Contato do encarregado (DPO) / privacidade: ${L.email}.`],
    },
    {
      h: "2. Dados que coletamos",
      p: [
        "Dados do cliente (organizador): e-mail e dados necessários ao pagamento (processados pelos provedores Stripe/Woovi — não armazenamos o número completo do cartão).",
        "Dados de uso: endereço IP, país aproximado, páginas visitadas e eventos de navegação (funil), para métricas e segurança.",
        "Dados públicos da publicação sorteada: nomes de usuário (@) e textos de comentários extraídos da postagem pública indicada pelo organizador, usados exclusivamente para executar o sorteio solicitado.",
      ],
    },
    {
      h: "3. Para que usamos (finalidades e base legal)",
      p: [
        "Executar o sorteio e gerar o certificado verificável (execução de contrato).",
        "Processar pagamentos e prevenir fraudes (execução de contrato / obrigação legal).",
        "Métricas, melhoria e segurança do serviço (legítimo interesse).",
        "Comunicações sobre o serviço e suporte (execução de contrato).",
      ],
    },
    {
      h: "4. Compartilhamento",
      p: [
        "Compartilhamos dados apenas com operadores necessários ao funcionamento: provedores de pagamento (Stripe, Woovi), infraestrutura de hospedagem e banco de dados (Vercel, Neon), coleta de dados públicos (Apify) e notificações internas (Telegram). Não vendemos dados pessoais.",
        "Alguns provedores podem processar dados fora do Brasil; adotamos salvaguardas contratuais para transferências internacionais, conforme a LGPD.",
      ],
    },
    {
      h: "5. Retenção",
      p: [
        "Mantemos os dados pelo tempo necessário às finalidades acima e ao cumprimento de obrigações legais. Os dados do sorteio (participantes elegíveis e resultado) são mantidos para permitir a auditoria/verificação do certificado. Você pode solicitar a exclusão a qualquer momento, ressalvadas as hipóteses de guarda obrigatória.",
      ],
    },
    {
      h: "6. Seus direitos (LGPD)",
      p: [
        "Você pode solicitar: confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamentos e revogação de consentimento. Para exercer, escreva para " + L.email + ".",
        "Participantes de sorteios cujos @ apareçam no resultado podem solicitar a remoção de seus dados pelo mesmo canal.",
      ],
    },
    {
      h: "7. Cookies",
      p: [
        "Usamos cookies/identificadores estritamente necessários ao funcionamento (ex.: idioma, sessão do painel) e medição básica de uso. Você pode bloquear cookies no navegador, ciente de que algumas funções podem deixar de operar.",
      ],
    },
    {
      h: "8. Segurança",
      p: [
        "Adotamos medidas técnicas e organizacionais para proteger os dados (criptografia em trânsito, controle de acesso ao painel administrativo, segregação de segredos). Nenhum sistema é 100% imune; em caso de incidente relevante, comunicaremos os titulares e a ANPD conforme exigido.",
      ],
    },
    {
      h: "9. Crianças e adolescentes",
      p: ["O serviço é destinado a maiores de 18 anos. Não coletamos intencionalmente dados de menores."],
    },
    {
      h: "10. Alterações",
      p: ["Esta Política pode ser atualizada; a versão vigente é a publicada nesta página, com a data de atualização no topo."],
    },
    {
      h: "11. Contato / Encarregado",
      p: [`Para assuntos de privacidade e exercício de direitos: ${L.email}.`],
    },
  ],
};

/* ------------------------------ TERMS (EN) ------------------------------ */
const termsEn: LegalDoc = {
  title: "Terms of Service",
  intro: `Last updated: ${L.updatedEn}. These Terms govern your use of ${L.brand} (${L.domain}), operated by ${L.company} ("we"). By using the service you ("user") fully agree to these Terms.`,
  sections: [
    {
      h: "1. The service",
      p: [
        `${L.brand} is an online tool that runs giveaways from comments on public Instagram posts, using an auditable method (SHA-256 cryptographic proof) and a video winner reveal. The service is pay-per-use (a one-time fee per giveaway) according to the selected plan.`,
        "We are not affiliated with, sponsored, or endorsed by Meta Platforms, Inc., Instagram, or any social network. All trademarks belong to their respective owners.",
      ],
    },
    {
      h: "2. Responsibility for the giveaway",
      p: [
        "The user is solely responsible for the promotion/giveaway they organize, including its legality, rules, prize, prize delivery, communication with participants, and any required authorizations under applicable law.",
        `${L.company} only provides the technological selection tool. We are not responsible for prize delivery, disputes between organizer and participants, or the giveaway's compliance with applicable law.`,
      ],
    },
    {
      h: "3. Acceptable use",
      p: [
        "You agree to use the service only for lawful purposes and in compliance with Instagram/Meta terms and applicable law. Fraud, money laundering, illegal content, harassment, or any activity that violates third-party rights is prohibited.",
        "You may not circumvent, overload, reverse-engineer, or exploit the service.",
      ],
    },
    {
      h: "4. Public data processing",
      p: [
        "To run a giveaway, the platform processes publicly available data from the post you provide (usernames and comment text), at your request and under your responsibility as organizer.",
      ],
    },
    {
      h: "5. Payments and refunds",
      p: [
        "The service is prepaid per giveaway. Prices are shown before purchase and may change at any time without retroactive effect. Payments are handled by third parties (Stripe and Woovi); we do not store full card data.",
        "As a digital service with immediate execution, refunds are granted only for a proven technical failure of the platform that prevents the paid giveaway from running. Requests: " + L.email + ".",
      ],
    },
    {
      h: "6. Result and audit",
      p: [
        "The result is generated by a deterministic, publicly verifiable algorithm (SHA-256 commit-reveal) and can be checked on the certificate page. The result is final, except for evident technical error.",
      ],
    },
    {
      h: "7. Limitation of liability",
      p: [
        `To the maximum extent permitted by law, ${L.company}'s total liability to the user, for any cause, is limited to the amount paid by the user for the specific giveaway giving rise to the claim. We are not liable for indirect damages, lost profits, or temporary unavailability.`,
        'The service is provided "as is", without warranties of uninterrupted availability.',
      ],
    },
    {
      h: "8. Intellectual property",
      p: [
        `All content, brand, design, code, and materials of ${L.brand} are owned by ${L.company} and protected by law. Generated videos and certificates may be used by the user to promote their own giveaway.`,
      ],
    },
    {
      h: "9. Changes and termination",
      p: [
        "We may update these Terms at any time; the current version is the one published on this page. We may suspend or terminate access for users who violate these Terms.",
      ],
    },
    {
      h: "10. Governing law",
      p: [
        "These Terms are governed by the laws of the Federative Republic of Brazil, where the operator is established.",
      ],
    },
    {
      h: "11. Contact",
      p: [`Questions about these Terms: ${L.email}.`],
    },
  ],
};

/* ----------------------------- PRIVACY (EN) ----------------------------- */
const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  intro: `Last updated: ${L.updatedEn}. This Policy describes how ${L.company}, operator of ${L.brand} (${L.domain}), processes personal data, in line with the Brazilian Data Protection Law (LGPD) and applicable principles.`,
  sections: [
    {
      h: "1. Controller",
      p: [`The data controller is ${L.company}. Privacy / DPO contact: ${L.email}.`],
    },
    {
      h: "2. Data we collect",
      p: [
        "Customer (organizer) data: email and data needed for payment (handled by Stripe/Woovi — we do not store full card numbers).",
        "Usage data: IP address, approximate country, pages visited, and navigation events (funnel), for metrics and security.",
        "Public post data: usernames and comment text extracted from the public post you provide, used solely to run the requested giveaway.",
      ],
    },
    {
      h: "3. Purposes and legal basis",
      p: [
        "Run the giveaway and generate the verifiable certificate (contract performance).",
        "Process payments and prevent fraud (contract / legal obligation).",
        "Metrics, improvement, and security (legitimate interest).",
        "Service communications and support (contract performance).",
      ],
    },
    {
      h: "4. Sharing",
      p: [
        "We share data only with operators required to run the service: payment providers (Stripe, Woovi), hosting and database (Vercel, Neon), public-data collection (Apify), and internal notifications (Telegram). We do not sell personal data.",
        "Some providers may process data outside Brazil; we apply contractual safeguards for international transfers.",
      ],
    },
    {
      h: "5. Retention",
      p: [
        "We keep data for as long as necessary for the purposes above and legal obligations. Giveaway data (eligible participants and result) is retained to allow certificate audit/verification. You may request deletion at any time, subject to mandatory retention.",
      ],
    },
    {
      h: "6. Your rights",
      p: [
        "You may request confirmation of processing, access, correction, anonymization, portability, deletion, information on sharing, and withdrawal of consent. To exercise, write to " + L.email + ".",
        "Participants whose usernames appear in a result may request removal through the same channel.",
      ],
    },
    {
      h: "7. Cookies",
      p: [
        "We use strictly necessary cookies/identifiers (e.g., language, admin session) and basic usage measurement. You may block cookies in your browser, aware that some features may stop working.",
      ],
    },
    {
      h: "8. Security",
      p: [
        "We apply technical and organizational measures to protect data (encryption in transit, admin access control, secret segregation). No system is fully immune; in case of a relevant incident, we will notify data subjects and the authority as required.",
      ],
    },
    {
      h: "9. Children",
      p: ["The service is intended for users over 18. We do not knowingly collect data from minors."],
    },
    {
      h: "10. Changes",
      p: ["This Policy may be updated; the current version is the one published on this page with the date at the top."],
    },
    {
      h: "11. Contact",
      p: [`For privacy matters and rights requests: ${L.email}.`],
    },
  ],
};

const isPt = (locale: string) => locale === "pt-br";

export function getTerms(locale: string): LegalDoc {
  return isPt(locale) ? termosPt : termsEn;
}
export function getPrivacy(locale: string): LegalDoc {
  return isPt(locale) ? privacidadePt : privacyEn;
}
