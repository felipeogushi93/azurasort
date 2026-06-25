/**
 * Conteúdo da pillar page "Sorteio de Instagram com vídeo de revelação".
 * Ângulo: o diferencial do AzuraSort (vídeo cinematográfico + certificado) vs.
 * um comment picker comum. Cauda longa de alto valor e baixa concorrência.
 * Multilíngue (en default, pt-br, es, fr-ma, ar-ma) com fallback para en.
 */

export type PillarStep = { name: string; text: string };
export type PillarFaq = { q: string; a: string };

export type PillarContent = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  intro: string;
  whyTitle: string;
  whyParas: string[];
  stepsTitle: string;
  steps: PillarStep[];
  faqTitle: string;
  faq: PillarFaq[];
  cta: string;
  breadcrumb: string;
};

const en: PillarContent = {
  metaTitle: "Instagram giveaway with a video reveal: pick a winner and get a shareable video",
  metaDescription:
    "Run an Instagram giveaway that ends with a cinematic winner-reveal video and a verifiable certificate. Pick the winner from the comments, prove it was fair, and get an MP4 ready to post.",
  keywords: [
    "instagram giveaway with video",
    "giveaway video reveal",
    "instagram comment picker with video",
    "winner reveal video",
    "cinematic giveaway reveal",
    "provably fair giveaway",
  ],
  h1: "Instagram giveaway with a video reveal",
  intro:
    "Most giveaway tools just show a name on a screen. AzuraSort turns the moment the winner is revealed into a movie — a cinematic animation that becomes a ready-to-post video — and backs it with a certificate anyone can verify. More engagement, more trust, zero spreadsheets.",
  whyTitle: "Why a video reveal beats a plain comment picker",
  whyParas: [
    "A shareable reveal video is content. Posting the moment the winner is drawn keeps your audience on your profile longer, gets reshared to Stories, and turns a one-off giveaway into reach you didn't pay for.",
    "Trust is the other half. AzuraSort uses a provably-fair draw (commit-reveal with SHA-256 + Fisher-Yates): the hash is published before the result and anyone can re-check the winner on a public certificate page. A cinematic reveal that's also auditable is something a plain picker can't offer.",
  ],
  stepsTitle: "How it works",
  steps: [
    { name: "Paste the post or Reel link", text: "AzuraSort loads the preview and the comment count automatically — no login, no spreadsheet." },
    { name: "Pick the entry base and reveal style", text: "Draw from people who commented or who liked, then choose the reveal animation: vault, countdown or Matrix." },
    { name: "Run the draw (and go live if you want)", text: "Entries are shuffled deterministically and the winner is revealed on screen — you can stream it live to your audience." },
    { name: "Share the video + the certificate", text: "Download the MP4 of the reveal, ready to post, and share the certificate link so anyone can verify the result was fair." },
  ],
  faqTitle: "Frequently asked questions",
  faq: [
    { q: "Does AzuraSort really generate a video of the result?", a: "Yes. The on-screen cinematic reveal is rendered as an MP4 you can download and post to Stories or your feed. The downloaded video matches exactly what you saw on screen." },
    { q: "Can I reveal the winner live?", a: "Yes — you can stream the reveal to your audience and announce the winner in real time." },
    { q: "Is the result still fair and verifiable?", a: "Yes. Every draw is provably fair (commit-reveal with SHA-256). A public certificate page lets anyone reproduce the algorithm and confirm nobody tampered with the result." },
    { q: "Does it work with Reels and with multiple winners?", a: "Yes. It works with posts and Reels, and you can draw several winners plus backups — each winner is a distinct person." },
    { q: "How much does it cost?", a: "Pay-per-use, priced by the number of participants. You see the price before paying. Card (Stripe) and PIX are supported." },
  ],
  cta: "Create my video giveaway",
  breadcrumb: "Giveaway with video reveal",
};

const ptBr: PillarContent = {
  metaTitle: "Sorteio de Instagram com vídeo de revelação: sorteie e ganhe um vídeo pronto pra postar",
  metaDescription:
    "Faça um sorteio de Instagram que termina com um vídeo cinematográfico de revelação do ganhador e um certificado verificável. Sorteie entre os comentários, prove que foi justo e baixe o MP4 pronto.",
  keywords: [
    "sorteio instagram com vídeo",
    "sorteador de instagram com vídeo",
    "vídeo de revelação do ganhador",
    "sorteio instagram revelação cinematográfica",
    "sorteio instagram verificável",
  ],
  h1: "Sorteio de Instagram com vídeo de revelação",
  intro:
    "A maioria das ferramentas só mostra um nome na tela. O AzuraSort transforma o momento da revelação do ganhador num filme — uma animação cinematográfica que vira um vídeo pronto pra postar — e ainda entrega um certificado que qualquer pessoa pode verificar. Mais engajamento, mais confiança, sem planilha.",
  whyTitle: "Por que o vídeo de revelação ganha de um sorteador comum",
  whyParas: [
    "Um vídeo de revelação compartilhável é conteúdo. Postar o momento exato do sorteio segura sua audiência no perfil por mais tempo, é recompartilhado nos Stories e transforma um sorteio pontual em alcance que você não pagou.",
    "A outra metade é confiança. O AzuraSort usa um sorteio provably-fair (commit-reveal com SHA-256 + Fisher-Yates): o hash é publicado antes do resultado e qualquer pessoa reconfere o ganhador numa página pública de certificado. Uma revelação cinematográfica que também é auditável é algo que um sorteador simples não oferece.",
  ],
  stepsTitle: "Como funciona",
  steps: [
    { name: "Cole o link do post ou Reels", text: "O AzuraSort carrega a prévia e o número de comentários automaticamente — sem login, sem planilha." },
    { name: "Escolha a base e o estilo da revelação", text: "Sorteie entre quem comentou ou curtiu e escolha a animação: cofre, contagem regressiva ou Matrix." },
    { name: "Faça o sorteio (ao vivo, se quiser)", text: "Os participantes são embaralhados de forma determinística e o ganhador é revelado na tela — dá pra transmitir ao vivo pra audiência." },
    { name: "Compartilhe o vídeo + o certificado", text: "Baixe o MP4 da revelação, pronto pra postar, e divulgue o link do certificado pra qualquer um verificar que foi justo." },
  ],
  faqTitle: "Perguntas frequentes",
  faq: [
    { q: "O AzuraSort gera mesmo um vídeo do resultado?", a: "Sim. A revelação cinematográfica da tela é gerada como um MP4 que você baixa e posta nos Stories ou no feed. O vídeo baixado é idêntico ao que você viu na tela." },
    { q: "Posso revelar o ganhador ao vivo?", a: "Sim — dá pra transmitir a revelação pra sua audiência e anunciar o ganhador em tempo real." },
    { q: "O resultado continua justo e verificável?", a: "Sim. Todo sorteio é provably-fair (commit-reveal com SHA-256). A página pública de certificado deixa qualquer pessoa reproduzir o algoritmo e confirmar que ninguém manipulou." },
    { q: "Funciona com Reels e com vários ganhadores?", a: "Sim. Funciona com posts e Reels, e você pode sortear vários ganhadores e suplentes — cada ganhador é uma pessoa distinta." },
    { q: "Quanto custa?", a: "Pague por uso, com preço pela quantidade de participantes. Você vê o valor antes de pagar. Aceita cartão (Stripe) e PIX." },
  ],
  cta: "Criar meu sorteio com vídeo",
  breadcrumb: "Sorteio com vídeo de revelação",
};

const es: PillarContent = {
  metaTitle: "Sorteo de Instagram con vídeo de revelación: elige al ganador y obtén un vídeo listo para publicar",
  metaDescription:
    "Haz un sorteo de Instagram que termina con un vídeo cinematográfico de la revelación del ganador y un certificado verificable. Elige al ganador entre los comentarios, demuestra que fue justo y descarga el MP4.",
  keywords: [
    "sorteo instagram con vídeo",
    "sorteador de instagram con vídeo",
    "vídeo de revelación del ganador",
    "sorteo instagram revelación cinematográfica",
    "sorteo instagram verificable",
  ],
  h1: "Sorteo de Instagram con vídeo de revelación",
  intro:
    "La mayoría de las herramientas solo muestran un nombre en la pantalla. AzuraSort convierte el momento de revelar al ganador en una película — una animación cinematográfica que se transforma en un vídeo listo para publicar — y lo respalda con un certificado que cualquiera puede verificar. Más interacción, más confianza, sin hojas de cálculo.",
  whyTitle: "Por qué el vídeo de revelación supera a un comment picker normal",
  whyParas: [
    "Un vídeo de revelación que se puede compartir es contenido. Publicar el momento exacto del sorteo mantiene a tu audiencia más tiempo en tu perfil, se recomparte en Stories y convierte un sorteo puntual en alcance que no pagaste.",
    "La otra mitad es la confianza. AzuraSort usa un sorteo provably-fair (commit-reveal con SHA-256 + Fisher-Yates): el hash se publica antes del resultado y cualquiera puede volver a comprobar al ganador en una página pública de certificado. Una revelación cinematográfica que además es auditable es algo que un picker normal no ofrece.",
  ],
  stepsTitle: "Cómo funciona",
  steps: [
    { name: "Pega el enlace del post o Reel", text: "AzuraSort carga la vista previa y el número de comentarios automáticamente — sin registro, sin hoja de cálculo." },
    { name: "Elige la base y el estilo de revelación", text: "Sortea entre quienes comentaron o dieron like y elige la animación: caja fuerte, cuenta regresiva o Matrix." },
    { name: "Haz el sorteo (en directo si quieres)", text: "Los participantes se barajan de forma determinista y el ganador se revela en pantalla — puedes transmitirlo en vivo a tu audiencia." },
    { name: "Comparte el vídeo + el certificado", text: "Descarga el MP4 de la revelación, listo para publicar, y comparte el enlace del certificado para que cualquiera verifique que fue justo." },
  ],
  faqTitle: "Preguntas frecuentes",
  faq: [
    { q: "¿AzuraSort genera de verdad un vídeo del resultado?", a: "Sí. La revelación cinematográfica de la pantalla se genera como un MP4 que descargas y publicas en Stories o en tu feed. El vídeo descargado es idéntico a lo que viste en pantalla." },
    { q: "¿Puedo revelar al ganador en directo?", a: "Sí — puedes transmitir la revelación a tu audiencia y anunciar al ganador en tiempo real." },
    { q: "¿El resultado sigue siendo justo y verificable?", a: "Sí. Cada sorteo es provably-fair (commit-reveal con SHA-256). La página pública de certificado permite a cualquiera reproducir el algoritmo y confirmar que nadie manipuló el resultado." },
    { q: "¿Funciona con Reels y con varios ganadores?", a: "Sí. Funciona con posts y Reels, y puedes sortear varios ganadores y suplentes — cada ganador es una persona distinta." },
    { q: "¿Cuánto cuesta?", a: "Pago por uso, según el número de participantes. Ves el precio antes de pagar. Acepta tarjeta (Stripe) y PIX." },
  ],
  cta: "Crear mi sorteo con vídeo",
  breadcrumb: "Sorteo con vídeo de revelación",
};

const frMa: PillarContent = {
  metaTitle: "Tirage au sort Instagram avec vidéo de révélation : choisissez le gagnant et obtenez une vidéo prête à publier",
  metaDescription:
    "Organisez un tirage au sort Instagram qui se termine par une vidéo cinématographique de révélation du gagnant et un certificat vérifiable. Tirez le gagnant parmi les commentaires, prouvez l'équité et téléchargez le MP4.",
  keywords: [
    "tirage au sort instagram avec vidéo",
    "outil de tirage instagram avec vidéo",
    "vidéo de révélation du gagnant",
    "tirage instagram révélation cinématographique",
    "tirage instagram vérifiable",
  ],
  h1: "Tirage au sort Instagram avec vidéo de révélation",
  intro:
    "La plupart des outils affichent juste un nom à l'écran. AzuraSort transforme le moment de la révélation du gagnant en film — une animation cinématographique qui devient une vidéo prête à publier — et l'accompagne d'un certificat que tout le monde peut vérifier. Plus d'engagement, plus de confiance, sans tableur.",
  whyTitle: "Pourquoi la vidéo de révélation surpasse un comment picker classique",
  whyParas: [
    "Une vidéo de révélation partageable, c'est du contenu. Publier le moment exact du tirage garde votre audience plus longtemps sur votre profil, se repartage en Stories et transforme un tirage ponctuel en portée que vous n'avez pas payée.",
    "L'autre moitié, c'est la confiance. AzuraSort utilise un tirage provably-fair (commit-reveal avec SHA-256 + Fisher-Yates) : le hash est publié avant le résultat et chacun peut revérifier le gagnant sur une page de certificat publique. Une révélation cinématographique également auditable, un picker classique ne peut pas l'offrir.",
  ],
  stepsTitle: "Comment ça marche",
  steps: [
    { name: "Collez le lien du post ou du Reel", text: "AzuraSort charge l'aperçu et le nombre de commentaires automatiquement — sans compte, sans tableur." },
    { name: "Choisissez la base et le style de révélation", text: "Tirez parmi ceux qui ont commenté ou aimé, puis choisissez l'animation : coffre-fort, compte à rebours ou Matrix." },
    { name: "Lancez le tirage (en direct si vous voulez)", text: "Les participants sont mélangés de façon déterministe et le gagnant est révélé à l'écran — vous pouvez le diffuser en direct à votre audience." },
    { name: "Partagez la vidéo + le certificat", text: "Téléchargez le MP4 de la révélation, prêt à publier, et partagez le lien du certificat pour que chacun vérifie l'équité." },
  ],
  faqTitle: "Questions fréquentes",
  faq: [
    { q: "AzuraSort génère-t-il vraiment une vidéo du résultat ?", a: "Oui. La révélation cinématographique à l'écran est générée en MP4 que vous téléchargez et publiez en Stories ou dans votre feed. La vidéo téléchargée est identique à ce que vous avez vu à l'écran." },
    { q: "Puis-je révéler le gagnant en direct ?", a: "Oui — vous pouvez diffuser la révélation à votre audience et annoncer le gagnant en temps réel." },
    { q: "Le résultat reste-t-il équitable et vérifiable ?", a: "Oui. Chaque tirage est provably-fair (commit-reveal avec SHA-256). La page de certificat publique permet à chacun de reproduire l'algorithme et de confirmer que personne n'a manipulé le résultat." },
    { q: "Ça marche avec les Reels et plusieurs gagnants ?", a: "Oui. Ça marche avec les posts et les Reels, et vous pouvez tirer plusieurs gagnants et suppléants — chaque gagnant est une personne distincte." },
    { q: "Combien ça coûte ?", a: "Paiement à l'usage, selon le nombre de participants. Vous voyez le prix avant de payer. Carte (Stripe) et PIX acceptés." },
  ],
  cta: "Créer mon tirage avec vidéo",
  breadcrumb: "Tirage avec vidéo de révélation",
};

const arMa: PillarContent = {
  metaTitle: "سحب على إنستغرام مع فيديو الكشف: اختر الفائز واحصل على فيديو جاهز للنشر",
  metaDescription:
    "نظّم سحبًا على إنستغرام ينتهي بفيديو سينمائي للكشف عن الفائز وشهادة قابلة للتحقق. اختر الفائز من التعليقات، أثبت النزاهة، وحمّل ملف MP4 الجاهز.",
  keywords: [
    "سحب إنستغرام بالفيديو",
    "أداة سحب إنستغرام",
    "فيديو الكشف عن الفائز",
    "سحب إنستغرام موثوق",
  ],
  h1: "سحب على إنستغرام مع فيديو الكشف",
  intro:
    "معظم الأدوات تكتفي بعرض اسم على الشاشة. أمّا AzuraSort فيحوّل لحظة الكشف عن الفائز إلى فيلم — رسوم متحركة سينمائية تتحوّل إلى فيديو جاهز للنشر — مدعومة بشهادة يستطيع أي شخص التحقق منها. تفاعل أكبر، ثقة أكبر، وبدون جداول.",
  whyTitle: "لماذا يتفوّق فيديو الكشف على أداة اختيار التعليقات العادية",
  whyParas: [
    "فيديو الكشف القابل للمشاركة هو محتوى بحد ذاته. نشر لحظة السحب يُبقي جمهورك وقتًا أطول على حسابك، ويُعاد نشره في الستوري، ويحوّل سحبًا عابرًا إلى وصول لم تدفع مقابله.",
    "النصف الآخر هو الثقة. يستخدم AzuraSort سحبًا قابلًا للإثبات (commit-reveal مع SHA-256 + Fisher-Yates): يُنشَر الـ hash قبل النتيجة ويمكن لأي شخص التحقق من الفائز عبر صفحة شهادة عامة. كشف سينمائي وقابل للتدقيق في آنٍ واحد شيء لا توفّره الأدوات العادية.",
  ],
  stepsTitle: "كيف يعمل",
  steps: [
    { name: "الصق رابط المنشور أو الـ Reel", text: "يحمّل AzuraSort المعاينة وعدد التعليقات تلقائيًا — بدون تسجيل دخول وبدون جداول." },
    { name: "اختر قاعدة السحب ونمط الكشف", text: "اسحب من بين من علّقوا أو أعجبوا، ثم اختر الرسوم المتحركة: الخزنة أو العد التنازلي أو Matrix." },
    { name: "نفّذ السحب (مباشرةً إن أردت)", text: "يُخلط المشاركون بطريقة حتمية ويُكشف الفائز على الشاشة — ويمكنك بثّه مباشرةً لجمهورك." },
    { name: "شارك الفيديو + الشهادة", text: "حمّل ملف MP4 للكشف الجاهز للنشر، وشارك رابط الشهادة ليتحقق أي شخص من نزاهة النتيجة." },
  ],
  faqTitle: "الأسئلة الشائعة",
  faq: [
    { q: "هل ينشئ AzuraSort فعلًا فيديو للنتيجة؟", a: "نعم. يُولَّد الكشف السينمائي على الشاشة كملف MP4 تحمّله وتنشره في الستوري أو على حسابك، وهو مطابق تمامًا لما رأيته على الشاشة." },
    { q: "هل يمكنني الكشف عن الفائز مباشرةً؟", a: "نعم — يمكنك بثّ الكشف لجمهورك والإعلان عن الفائز في الوقت الفعلي." },
    { q: "هل تبقى النتيجة عادلة وقابلة للتحقق؟", a: "نعم. كل سحب قابل للإثبات (commit-reveal مع SHA-256). تتيح صفحة الشهادة العامة لأي شخص إعادة تنفيذ الخوارزمية والتأكد من عدم التلاعب." },
    { q: "هل يعمل مع الـ Reels ومع عدة فائزين؟", a: "نعم. يعمل مع المنشورات والـ Reels، ويمكنك سحب عدة فائزين واحتياطيين — كل فائز شخص مختلف." },
    { q: "كم يكلّف؟", a: "الدفع حسب الاستخدام، بحسب عدد المشاركين. ترى السعر قبل الدفع. يدعم البطاقة (Stripe) وPIX." },
  ],
  cta: "أنشئ سحبي بالفيديو",
  breadcrumb: "سحب مع فيديو الكشف",
};

const BY_LOCALE: Record<string, PillarContent> = {
  en,
  "pt-br": ptBr,
  es,
  "fr-ma": frMa,
  "ar-ma": arMa,
};

export function getVideoPillar(locale: string): PillarContent {
  return BY_LOCALE[locale] ?? en;
}
