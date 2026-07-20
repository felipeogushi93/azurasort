/**
 * Pillar "AzuraSort vs ferramentas de sorteio grátis".
 * Ângulo: grátis mostra só um nome, com anúncios e sem prova; AzuraSort entrega
 * vídeo + certificado. Ponte: o AzuraSort TAMBÉM tem um sorteio grátis (/gratis).
 * Multilíngue (en default, pt-br, es, fr-ma, ar-ma) com fallback para en.
 */

import type { PillarContent } from "./video";

const en: PillarContent = {
  metaTitle: "Free Instagram giveaway tools vs AzuraSort: what you actually get",
  metaDescription:
    "Free Instagram giveaway tools show a name and stop there — ads, no proof, no video. See where free is enough and where AzuraSort's reveal video and verifiable certificate are worth it. AzuraSort also has a free draw.",
  keywords: [
    "free instagram giveaway tool",
    "free comment picker",
    "instagram giveaway free vs paid",
    "is a free giveaway tool safe",
    "instagram giveaway picker",
    "verifiable giveaway",
  ],
  h1: "Free giveaway tools vs AzuraSort",
  intro:
    "Searching for a free Instagram giveaway tool makes sense — for a small, casual draw you may not need anything else. This is an honest look at what free tools give you, where they quietly fall short, and when AzuraSort's paid draw earns its price. Good to know up front: AzuraSort has a free draw too.",
  whyTitle: "What 'free' really includes",
  whyParas: [
    "Most free tools do one job: read the comments and show a random name on screen, usually wrapped in ads. That is genuinely useful for a quick draw. What they rarely include is anything to post afterwards, any way to prove the result was fair, or clarity on what happens to the data they scrape. The result lives on your screen and disappears — and a follower who missed it just has your word.",
    "AzuraSort keeps a free option for exactly those quick draws (a manual list, no cost), and adds a paid tier when the giveaway matters. The paid draw collects the comments for you, applies rules like blocking duplicates, and is provably fair: commit-reveal with SHA-256 so anyone can verify the winner on a public certificate. You also get a cinematic reveal video (MP4) ready to post, multiple winners and backups, a live reveal option, and card or PIX — with the price shown before you pay. Free is for casual; paid is for when you want content and credibility.",
  ],
  stepsTitle: "How to choose between free and paid",
  steps: [
    { name: "Small, casual post?", text: "Use a free draw — AzuraSort's free page or any basic picker is fine when you just need a name." },
    { name: "Want something to post?", text: "If you want a shareable reveal video for your feed or Reels, that is where free tools stop and the paid draw starts." },
    { name: "Prize or audience is big?", text: "The more it matters, the more you want proof. The paid draw gives a certificate anyone can re-check, so nobody can accuse you of rigging it." },
    { name: "Run it", text: "Paste the link, set your rules, draw, and share the video plus the certificate — or start free and upgrade only when you need to." },
  ],
  faqTitle: "Free vs AzuraSort: common questions",
  faq: [
    { q: "Is a free Instagram giveaway tool safe?", a: "Many are fine for a casual draw, but read what they do with the comments they scrape, and expect ads and no proof of fairness. AzuraSort's free draw is manual and keeps it simple; the paid draw adds collection, proof and a video." },
    { q: "Does AzuraSort have a free option?", a: "Yes. There is a free draw for quick, simple giveaways — no payment. When you want the reveal video, the certificate or automatic comment collection, you move to the pay-per-use draw." },
    { q: "Why pay if free tools exist?", a: "Because free tools only show a name. The paid draw gives you an MP4 to post and a certificate your audience can verify — the two things that turn a giveaway into content and proof, not just a result." },
    { q: "Do free tools prove the winner was fair?", a: "Almost never. They show a name and you have to be trusted. AzuraSort publishes the hash before the draw and a public certificate after, so the result is verifiable by anyone." },
    { q: "Can free tools generate a video?", a: "No. A shareable, cinematic reveal MP4 that matches the screen exactly is part of the paid AzuraSort draw, not free pickers." },
  ],
  cta: "Try AzuraSort (free or paid)",
  breadcrumb: "Free tools vs AzuraSort",
};

const ptBr: PillarContent = {
  metaTitle: "Sorteio de Instagram grátis vs AzuraSort: o que você realmente ganha",
  metaDescription:
    "Ferramentas de sorteio grátis mostram um nome e param aí — anúncios, sem prova, sem vídeo. Veja quando o grátis basta e quando o vídeo e o certificado do AzuraSort valem a pena. O AzuraSort também tem sorteio grátis.",
  keywords: [
    "sorteio instagram grátis",
    "sorteador de comentários grátis",
    "sorteio instagram grátis vs pago",
    "sorteio grátis é confiável",
    "sorteador de instagram",
    "sorteio verificável",
  ],
  h1: "Ferramentas grátis vs AzuraSort",
  intro:
    "Procurar um sorteador de Instagram grátis faz sentido — pra um sorteio pequeno e casual, talvez você não precise de mais nada. Este é um olhar honesto sobre o que as ferramentas grátis entregam, onde elas ficam devendo em silêncio e quando o sorteio pago do AzuraSort compensa. Já adiantando: o AzuraSort também tem sorteio grátis.",
  whyTitle: "O que o 'grátis' realmente inclui",
  whyParas: [
    "A maioria das ferramentas grátis faz uma coisa: lê os comentários e mostra um nome aleatório na tela, quase sempre cheio de anúncios. Isso é útil de verdade pra um sorteio rápido. O que elas raramente incluem é algo pra postar depois, alguma forma de provar que o resultado foi justo, ou clareza sobre o que acontece com os dados que elas coletam. O resultado vive na sua tela e some — e quem perdeu fica só com a sua palavra.",
    "O AzuraSort mantém uma opção grátis justamente pra esses sorteios rápidos (lista manual, sem custo) e acrescenta um plano pago quando o sorteio importa. O sorteio pago coleta os comentários por você, aplica regras como bloquear duplicados e é provably-fair: commit-reveal com SHA-256, então qualquer um verifica o ganhador numa página pública de certificado. Você ainda ganha um vídeo de revelação cinematográfico (MP4) pronto pra postar, vários ganhadores e suplentes, opção de revelação ao vivo, e cartão ou PIX — com o preço mostrado antes de pagar. Grátis é pro casual; pago é pra quando você quer conteúdo e credibilidade.",
  ],
  stepsTitle: "Como escolher entre grátis e pago",
  steps: [
    { name: "Post pequeno e casual?", text: "Use um sorteio grátis — a página grátis do AzuraSort ou qualquer picker básico serve quando você só precisa de um nome." },
    { name: "Quer algo pra postar?", text: "Se você quer um vídeo de revelação pra compartilhar no feed ou nos Reels, é aí que o grátis para e o pago começa." },
    { name: "Prêmio ou público grandes?", text: "Quanto mais importa, mais você quer prova. O pago entrega um certificado que qualquer um reconfere, então ninguém te acusa de manipular." },
    { name: "Faça o sorteio", text: "Cole o link, defina as regras, sorteie e compartilhe o vídeo com o certificado — ou comece no grátis e faça o upgrade só quando precisar." },
  ],
  faqTitle: "Grátis vs AzuraSort: dúvidas comuns",
  faq: [
    { q: "Sorteio de Instagram grátis é confiável?", a: "Muitos servem pra um sorteio casual, mas veja o que fazem com os comentários que coletam, e espere anúncios e nenhuma prova de justiça. O sorteio grátis do AzuraSort é manual e simples; o pago acrescenta coleta, prova e vídeo." },
    { q: "O AzuraSort tem opção grátis?", a: "Tem. Há um sorteio grátis pra sorteios rápidos e simples — sem pagamento. Quando você quer o vídeo de revelação, o certificado ou a coleta automática de comentários, passa pro sorteio pago por uso." },
    { q: "Por que pagar se existem ferramentas grátis?", a: "Porque as grátis só mostram um nome. O pago te dá um MP4 pra postar e um certificado que sua audiência verifica — as duas coisas que transformam o sorteio em conteúdo e prova, não só um resultado." },
    { q: "As ferramentas grátis provam que o ganhador foi justo?", a: "Quase nunca. Mostram um nome e você precisa ser confiável. O AzuraSort publica o hash antes do sorteio e um certificado público depois, então o resultado é verificável por qualquer um." },
    { q: "As grátis geram vídeo?", a: "Não. Um MP4 de revelação cinematográfico, compartilhável e idêntico à tela faz parte do sorteio pago do AzuraSort, não dos pickers grátis." },
  ],
  cta: "Testar o AzuraSort (grátis ou pago)",
  breadcrumb: "Grátis vs AzuraSort",
};

const es: PillarContent = {
  metaTitle: "Sorteo de Instagram gratis vs AzuraSort: qué obtienes de verdad",
  metaDescription:
    "Las herramientas de sorteo gratis muestran un nombre y ahí paran — anuncios, sin prueba, sin vídeo. Mira cuándo basta lo gratis y cuándo el vídeo y el certificado de AzuraSort valen la pena. AzuraSort también tiene sorteo gratis.",
  keywords: [
    "sorteo instagram gratis",
    "sorteador de comentarios gratis",
    "sorteo instagram gratis vs pago",
    "sorteo gratis es fiable",
    "sorteador de instagram",
    "sorteo verificable",
  ],
  h1: "Herramientas gratis vs AzuraSort",
  intro:
    "Buscar un sorteador de Instagram gratis tiene sentido — para un sorteo pequeño e informal quizá no necesites nada más. Esta es una mirada honesta a lo que dan las herramientas gratis, dónde se quedan cortas en silencio y cuándo el sorteo de pago de AzuraSort compensa. Por adelantado: AzuraSort también tiene sorteo gratis.",
  whyTitle: "Qué incluye de verdad lo 'gratis'",
  whyParas: [
    "La mayoría de las herramientas gratis hacen una cosa: leen los comentarios y muestran un nombre al azar en pantalla, casi siempre con anuncios. Eso es útil de verdad para un sorteo rápido. Lo que rara vez incluyen es algo para publicar después, alguna forma de probar que el resultado fue justo, o claridad sobre qué pasa con los datos que extraen. El resultado vive en tu pantalla y desaparece — y quien se lo perdió solo tiene tu palabra.",
    "AzuraSort mantiene una opción gratis justo para esos sorteos rápidos (lista manual, sin coste) y añade un plan de pago cuando el sorteo importa. El sorteo de pago recoge los comentarios por ti, aplica reglas como bloquear duplicados y es provably-fair: commit-reveal con SHA-256, así que cualquiera verifica al ganador en una página pública de certificado. Además obtienes un vídeo de revelación cinematográfico (MP4) listo para publicar, varios ganadores y suplentes, opción de revelación en directo, y tarjeta o PIX — con el precio mostrado antes de pagar. Gratis es para lo informal; pago es para cuando quieres contenido y credibilidad.",
  ],
  stepsTitle: "Cómo elegir entre gratis y pago",
  steps: [
    { name: "¿Post pequeño e informal?", text: "Usa un sorteo gratis — la página gratis de AzuraSort o cualquier picker básico vale cuando solo necesitas un nombre." },
    { name: "¿Quieres algo para publicar?", text: "Si quieres un vídeo de revelación para compartir en el feed o en Reels, ahí es donde lo gratis se detiene y empieza el de pago." },
    { name: "¿Premio o audiencia grandes?", text: "Cuanto más importa, más quieres prueba. El de pago da un certificado que cualquiera revisa, así nadie te acusa de amañarlo." },
    { name: "Haz el sorteo", text: "Pega el enlace, define las reglas, sortea y comparte el vídeo con el certificado — o empieza gratis y mejora solo cuando lo necesites." },
  ],
  faqTitle: "Gratis vs AzuraSort: preguntas frecuentes",
  faq: [
    { q: "¿Es fiable un sorteador de Instagram gratis?", a: "Muchos valen para un sorteo informal, pero mira qué hacen con los comentarios que extraen, y espera anuncios y ninguna prueba de imparcialidad. El sorteo gratis de AzuraSort es manual y simple; el de pago añade recolección, prueba y vídeo." },
    { q: "¿AzuraSort tiene opción gratis?", a: "Sí. Hay un sorteo gratis para sorteos rápidos y simples — sin pago. Cuando quieres el vídeo de revelación, el certificado o la recolección automática de comentarios, pasas al sorteo de pago por uso." },
    { q: "¿Por qué pagar si existen herramientas gratis?", a: "Porque las gratis solo muestran un nombre. El de pago te da un MP4 para publicar y un certificado que tu audiencia verifica — las dos cosas que convierten el sorteo en contenido y prueba, no solo un resultado." },
    { q: "¿Las herramientas gratis prueban que el ganador fue justo?", a: "Casi nunca. Muestran un nombre y tienes que ser de fiar. AzuraSort publica el hash antes del sorteo y un certificado público después, así que el resultado es verificable por cualquiera." },
    { q: "¿Las gratis generan vídeo?", a: "No. Un MP4 de revelación cinematográfico, compartible e idéntico a la pantalla es parte del sorteo de pago de AzuraSort, no de los pickers gratis." },
  ],
  cta: "Probar AzuraSort (gratis o de pago)",
  breadcrumb: "Gratis vs AzuraSort",
};

const frMa: PillarContent = {
  metaTitle: "Outils de tirage Instagram gratuits vs AzuraSort : ce que vous obtenez vraiment",
  metaDescription:
    "Les outils de tirage Instagram gratuits affichent un nom et s'arrêtent là — publicités, aucune preuve, aucune vidéo. Voyez quand le gratuit suffit et quand la vidéo de révélation et le certificat vérifiable d'AzuraSort valent le coup. AzuraSort propose aussi un tirage gratuit.",
  keywords: [
    "outil de tirage instagram gratuit",
    "tirage commentaires gratuit",
    "tirage instagram gratuit ou payant",
    "un outil de tirage gratuit est-il fiable",
    "outil de tirage instagram",
    "tirage au sort vérifiable",
  ],
  h1: "Outils gratuits vs AzuraSort",
  intro:
    "Chercher un outil de tirage Instagram gratuit est logique — pour un petit tirage informel, vous n'avez peut-être besoin de rien d'autre. Voici un regard honnête sur ce que donnent les outils gratuits, là où ils restent discrètement en deçà, et le moment où le tirage payant d'AzuraSort mérite son prix. À savoir d'emblée : AzuraSort a aussi un tirage gratuit.",
  whyTitle: "Ce que « gratuit » comprend vraiment",
  whyParas: [
    "La plupart des outils gratuits font une seule chose : lire les commentaires et afficher un nom au hasard à l'écran, généralement entouré de publicités. C'est réellement utile pour un tirage rapide. Ce qu'ils incluent rarement, c'est de quoi publier ensuite, un moyen de prouver l'équité du résultat, ou de la clarté sur le sort des données qu'ils collectent. Le résultat vit sur votre écran puis disparaît — et l'abonné qui l'a manqué n'a que votre parole.",
    "AzuraSort garde une option gratuite précisément pour ces tirages rapides (liste manuelle, sans frais) et ajoute une formule payante quand le tirage compte. Le tirage payant collecte les commentaires pour vous, applique des règles comme le blocage des doublons, et il est prouvablement équitable : commit-reveal avec SHA-256, si bien que chacun peut vérifier le gagnant sur un certificat public. Vous obtenez aussi une vidéo de révélation cinématographique (MP4) prête à publier, plusieurs gagnants et suppléants, une option de révélation en direct, et le paiement par carte ou PIX — avec le prix affiché avant de payer. Le gratuit, c'est pour l'informel ; le payant, c'est quand vous voulez du contenu et de la crédibilité.",
  ],
  stepsTitle: "Comment choisir entre gratuit et payant",
  steps: [
    { name: "Post petit et informel ?", text: "Prenez un tirage gratuit — la page gratuite d'AzuraSort ou n'importe quel outil de base convient quand il vous faut seulement un nom." },
    { name: "Vous voulez quelque chose à publier ?", text: "Si vous voulez une vidéo de révélation partageable pour votre feed ou vos Reels, c'est là que le gratuit s'arrête et que le payant commence." },
    { name: "Lot ou audience importants ?", text: "Plus l'enjeu est grand, plus vous voulez une preuve. Le tirage payant délivre un certificat que chacun peut revérifier, pour que personne ne puisse vous accuser de truquage." },
    { name: "Lancez le tirage", text: "Collez le lien, définissez vos règles, tirez, puis partagez la vidéo et le certificat — ou commencez gratuitement et passez au payant seulement quand c'est nécessaire." },
  ],
  faqTitle: "Gratuit vs AzuraSort : questions fréquentes",
  faq: [
    { q: "Un outil de tirage Instagram gratuit est-il fiable ?", a: "Beaucoup conviennent pour un tirage informel, mais lisez ce qu'ils font des commentaires qu'ils collectent, et attendez-vous à des publicités et à aucune preuve d'équité. Le tirage gratuit d'AzuraSort est manuel et reste simple ; le tirage payant ajoute la collecte, la preuve et la vidéo." },
    { q: "AzuraSort propose-t-il une option gratuite ?", a: "Oui. Il existe un tirage gratuit pour les tirages rapides et simples — sans paiement. Quand vous voulez la vidéo de révélation, le certificat ou la collecte automatique des commentaires, vous passez au tirage payant à l'usage." },
    { q: "Pourquoi payer si des outils gratuits existent ?", a: "Parce que les outils gratuits ne font qu'afficher un nom. Le tirage payant vous donne un MP4 à publier et un certificat que votre audience peut vérifier — les deux choses qui transforment un tirage en contenu et en preuve, pas seulement en résultat." },
    { q: "Les outils gratuits prouvent-ils l'équité du gagnant ?", a: "Presque jamais. Ils affichent un nom et il faut vous croire sur parole. AzuraSort publie le hash avant le tirage et un certificat public après, si bien que le résultat est vérifiable par n'importe qui." },
    { q: "Les outils gratuits peuvent-ils générer une vidéo ?", a: "Non. Un MP4 de révélation cinématographique, partageable et strictement identique à l'écran fait partie du tirage payant d'AzuraSort, pas des outils gratuits." },
  ],
  cta: "Essayer AzuraSort (gratuit ou payant)",
  breadcrumb: "Outils gratuits vs AzuraSort",
};

const arMa: PillarContent = {
  metaTitle: "أدوات السحب المجانية على إنستغرام مقابل AzuraSort: ماذا تحصل فعلًا",
  metaDescription:
    "أدوات السحب المجانية على إنستغرام تعرض اسمًا وتتوقف عند ذلك — إعلانات، بلا إثبات، بلا فيديو. اعرف متى يكفي المجاني ومتى يستحق فيديو الكشف والشهادة القابلة للتحقق من AzuraSort. ولدى AzuraSort سحب مجاني أيضًا.",
  keywords: [
    "أداة سحب إنستغرام مجانية",
    "سحب تعليقات مجاني",
    "سحب إنستغرام مجاني أم مدفوع",
    "هل أدوات السحب المجانية آمنة",
    "أداة سحب إنستغرام",
    "سحب قابل للتحقق",
  ],
  h1: "الأدوات المجانية مقابل AzuraSort",
  intro:
    "البحث عن أداة سحب مجانية على إنستغرام أمر منطقي — فلسحب صغير وعابر قد لا تحتاج إلى أكثر من ذلك. هذه نظرة صادقة إلى ما تمنحك إياه الأدوات المجانية، وأين تقصّر بهدوء، ومتى يستحق السحب المدفوع من AzuraSort سعره. ومن الجيد معرفته منذ البداية: لدى AzuraSort سحب مجاني أيضًا.",
  whyTitle: "ما الذي يشمله «المجاني» حقًا",
  whyParas: [
    "معظم الأدوات المجانية تؤدي مهمة واحدة: قراءة التعليقات وعرض اسم عشوائي على الشاشة، وغالبًا وسط الإعلانات. وهذا مفيد فعلًا لسحب سريع. لكن ما نادرًا ما تشمله هو شيء تنشره بعد ذلك، أو وسيلة لإثبات نزاهة النتيجة، أو وضوح بشأن مصير البيانات التي تجمعها. تعيش النتيجة على شاشتك ثم تختفي — ولا يبقى للمتابع الذي فاتته سوى كلامك.",
    "يحتفظ AzuraSort بخيار مجاني لهذه السحوبات السريعة بالضبط (قائمة يدوية، بلا تكلفة)، ويضيف مستوى مدفوعًا حين يكون السحب مهمًّا. السحب المدفوع يجمع التعليقات نيابةً عنك، ويطبّق شروطًا مثل حجب المكرّرين، وهو قابل للإثبات: commit-reveal مع SHA-256 ليتحقق أي شخص من الفائز عبر شهادة عامة. كما تحصل على فيديو كشف سينمائي (MP4) جاهز للنشر، وعدة فائزين واحتياطيين، وخيار كشف مباشر، والدفع بالبطاقة أو PIX — مع عرض السعر قبل الدفع. المجاني للسحوبات العابرة؛ والمدفوع حين تريد محتوى ومصداقية.",
  ],
  stepsTitle: "كيف تختار بين المجاني والمدفوع",
  steps: [
    { name: "منشور صغير وعابر؟", text: "استخدم سحبًا مجانيًا — صفحة AzuraSort المجانية أو أي أداة بسيطة تكفي حين تحتاج إلى اسم فقط." },
    { name: "تريد شيئًا تنشره؟", text: "إن أردت فيديو كشف قابلًا للمشاركة على حسابك أو في الـ Reels، فهنا يتوقف المجاني ويبدأ المدفوع." },
    { name: "الجائزة أو الجمهور كبيران؟", text: "كلما زادت الأهمية زادت حاجتك إلى الإثبات. يمنحك السحب المدفوع شهادة يعيد أي شخص التحقق منها، فلا يستطيع أحد اتهامك بالتلاعب." },
    { name: "نفّذ السحب", text: "الصق الرابط، اضبط شروطك، اسحب، ثم شارك الفيديو مع الشهادة — أو ابدأ مجانًا وارتقِ للمدفوع فقط عند الحاجة." },
  ],
  faqTitle: "المجاني مقابل AzuraSort: أسئلة شائعة",
  faq: [
    { q: "هل أدوات السحب المجانية على إنستغرام آمنة؟", a: "كثير منها مناسب لسحب عابر، لكن اقرأ ما تفعله بالتعليقات التي تجمعها، وتوقّع إعلانات وغياب أي إثبات للنزاهة. السحب المجاني في AzuraSort يدوي وبسيط، أما المدفوع فيضيف الجمع والإثبات والفيديو." },
    { q: "هل لدى AzuraSort خيار مجاني؟", a: "نعم. هناك سحب مجاني للسحوبات السريعة والبسيطة — بلا دفع. وحين تريد فيديو الكشف أو الشهادة أو الجمع التلقائي للتعليقات، تنتقل إلى السحب المدفوع حسب الاستخدام." },
    { q: "لماذا أدفع مع وجود أدوات مجانية؟", a: "لأن الأدوات المجانية تعرض اسمًا فقط. أما السحب المدفوع فيمنحك ملف MP4 للنشر وشهادة يتحقق منها جمهورك — وهما ما يحوّلان السحب إلى محتوى ودليل، لا مجرد نتيجة." },
    { q: "هل تُثبت الأدوات المجانية نزاهة الفائز؟", a: "نادرًا جدًّا. تعرض اسمًا وعليك أن تكون محلّ ثقة. أما AzuraSort فينشر الهاش قبل السحب وشهادة عامة بعده، فتصبح النتيجة قابلة للتحقق من أي شخص." },
    { q: "هل تستطيع الأدوات المجانية إنشاء فيديو؟", a: "لا. فيديو الكشف السينمائي القابل للمشاركة والمطابق للشاشة تمامًا جزء من السحب المدفوع في AzuraSort، لا من الأدوات المجانية." },
  ],
  cta: "جرّب AzuraSort (مجانًا أو مدفوعًا)",
  breadcrumb: "المجاني مقابل AzuraSort",
};

const BY_LOCALE: Record<string, PillarContent> = {
  en,
  "pt-br": ptBr,
  es,
  "fr-ma": frMa,
  "ar-ma": arMa,
};

export function getVsFreeGiveawayTools(locale: string): PillarContent {
  return BY_LOCALE[locale] ?? en;
}
