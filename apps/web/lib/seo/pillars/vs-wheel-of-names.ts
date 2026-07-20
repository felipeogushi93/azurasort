/**
 * Pillar "AzuraSort vs Wheel of Names / roleta de nomes".
 * Ângulo: a roleta genérica exige digitar os nomes na mão, não é nativa do
 * Instagram (não puxa comentários), não tem prova nem vídeo pronto pra postar.
 * Multilíngue (en default, pt-br, es, fr-ma, ar-ma) com fallback para en.
 */

import type { PillarContent } from "./video";

const en: PillarContent = {
  metaTitle: "Wheel of Names for Instagram giveaways vs AzuraSort",
  metaDescription:
    "A name wheel is great for a list you type by hand — but it does not read Instagram comments, prove fairness or give you a video to post. See why AzuraSort is the Instagram-native alternative to a random name wheel.",
  keywords: [
    "wheel of names instagram",
    "wheel of names alternative",
    "random name wheel giveaway",
    "instagram giveaway wheel",
    "name picker for instagram",
    "provably fair giveaway",
  ],
  h1: "Name wheel vs AzuraSort for Instagram",
  intro:
    "A spinning name wheel is a classic: type in a list, spin, and it lands on someone. It is fun and free for a small group. But for an Instagram giveaway it hits a wall fast — you have to enter every name by hand, it does not read your comments, and it leaves you no proof and nothing to post. This page compares a name wheel with AzuraSort.",
  whyTitle: "Where a name wheel stops for Instagram",
  whyParas: [
    "A name wheel is built for lists you already have. For an Instagram giveaway that means copying every commenter's @ into the wheel by hand — fine for 20 names, impossible for 2,000. It also has no idea about Instagram rules: it cannot block duplicate users, require a mention or a hashtag, or draw from likes. And when it lands on a name, that is all you get: no way to prove the spin was not repeated until a friend won, and no clip designed for your feed.",
    "AzuraSort is Instagram-native. It pulls the comments automatically — no typing — applies your rules (block duplicates, require mentions or hashtags, multiple winners and backups), and is provably fair: commit-reveal with SHA-256, hash published before the result, so anyone can verify the winner on a public certificate. Instead of a generic spin, the reveal plays as a cinematic animation (vault, roulette, countdown and more) auto-generated as an MP4 that matches the screen and is ready to post. Pay-per-use, card or PIX, price shown before you pay.",
  ],
  stepsTitle: "The Instagram-native way",
  steps: [
    { name: "Paste the post or Reel link", text: "AzuraSort loads every comment automatically — no copying names into a wheel one by one." },
    { name: "Set Instagram rules", text: "Block duplicate accounts, require a mention or hashtag, draw from comments or likes, and choose winners plus backups." },
    { name: "Reveal with a themed animation", text: "Pick a cinematic reveal — vault, roulette, countdown — instead of a generic spin, live if you want." },
    { name: "Share video and certificate", text: "Post the MP4 reveal and share the certificate link so anyone can verify the draw — proof a name wheel cannot give." },
  ],
  faqTitle: "Name wheel vs AzuraSort: common questions",
  faq: [
    { q: "Can I use Wheel of Names for an Instagram giveaway?", a: "You can, but you have to type every entrant's name into it by hand and it cannot read comments, enforce rules or prove the result. AzuraSort pulls the comments automatically and gives you a verifiable certificate." },
    { q: "Does a name wheel prove the winner was fair?", a: "No. It spins on your screen and you could re-spin until you like the result — viewers just have to trust you. AzuraSort publishes a hash before the draw and a public certificate after, so the outcome is verifiable." },
    { q: "What about a video to post?", a: "A name wheel gives you a generic spin. AzuraSort renders a themed cinematic reveal as an MP4 that matches the screen and is ready for your feed or Reels." },
    { q: "Can it handle thousands of Instagram comments?", a: "A wheel cannot — you would type names forever. AzuraSort collects them automatically, so post size is never the bottleneck." },
    { q: "When is a name wheel enough?", a: "For a small offline list of names you already have, a wheel is perfect. For an Instagram giveaway where you want to draw from comments, enforce rules, prove fairness and post a video, AzuraSort is the fit." },
  ],
  cta: "Draw from my Instagram comments",
  breadcrumb: "Name wheel vs AzuraSort",
};

const ptBr: PillarContent = {
  metaTitle: "Roleta de nomes (Wheel of Names) para sorteio no Instagram vs AzuraSort",
  metaDescription:
    "Uma roleta de nomes é ótima pra uma lista que você digita na mão — mas não lê os comentários do Instagram, não prova a justiça nem te dá um vídeo pra postar. Veja por que o AzuraSort é a alternativa nativa do Instagram à roleta de nomes.",
  keywords: [
    "wheel of names instagram",
    "roleta de nomes sorteio",
    "roda de nomes instagram",
    "sorteador de nomes instagram",
    "roleta sorteio instagram",
    "sorteio verificável",
  ],
  h1: "Roleta de nomes vs AzuraSort no Instagram",
  intro:
    "A roleta de nomes é um clássico: você digita uma lista, gira e ela para em alguém. É divertida e grátis pra um grupo pequeno. Mas pra um sorteio de Instagram ela bate num muro rápido — você precisa digitar cada nome na mão, ela não lê seus comentários, e te deixa sem prova e sem nada pra postar. Esta página compara a roleta de nomes com o AzuraSort.",
  whyTitle: "Onde a roleta para no Instagram",
  whyParas: [
    "A roleta de nomes foi feita pra listas que você já tem. Num sorteio de Instagram isso significa copiar o @ de cada pessoa que comentou pra dentro da roleta na mão — ok pra 20 nomes, impossível pra 2.000. Ela também não entende as regras do Instagram: não bloqueia usuários duplicados, não exige marcação nem hashtag, não sorteia por curtidas. E quando para num nome, é só isso que você tem: nenhuma forma de provar que a roleta não foi girada de novo até um amigo ganhar, e nenhum clipe pensado pro seu feed.",
    "O AzuraSort é nativo do Instagram. Ele puxa os comentários automaticamente — sem digitar — aplica suas regras (bloquear duplicados, exigir marcações ou hashtags, vários ganhadores e suplentes) e é provably-fair: commit-reveal com SHA-256, com o hash publicado antes do resultado, então qualquer um verifica o ganhador numa página pública de certificado. No lugar de um giro genérico, a revelação roda como animação cinematográfica (cofre, roleta, contagem e mais) gerada automaticamente como um MP4 idêntico à tela e pronto pra postar. Pago por uso, cartão ou PIX, preço mostrado antes de pagar.",
  ],
  stepsTitle: "O jeito nativo do Instagram",
  steps: [
    { name: "Cole o link do post ou Reels", text: "O AzuraSort carrega todos os comentários automaticamente — sem copiar nome por nome pra uma roleta." },
    { name: "Defina as regras do Instagram", text: "Bloqueie contas duplicadas, exija marcação ou hashtag, sorteie por comentários ou curtidas, e escolha ganhadores mais suplentes." },
    { name: "Revele com uma animação temática", text: "Escolha uma revelação cinematográfica — cofre, roleta, contagem — no lugar de um giro genérico, ao vivo se quiser." },
    { name: "Compartilhe vídeo e certificado", text: "Poste o MP4 da revelação e divulgue o link do certificado pra qualquer um verificar o sorteio — prova que a roleta não te dá." },
  ],
  faqTitle: "Roleta de nomes vs AzuraSort: dúvidas comuns",
  faq: [
    { q: "Dá pra usar o Wheel of Names pra sorteio de Instagram?", a: "Dá, mas você tem que digitar o nome de cada participante na mão e ela não lê comentários, não aplica regras nem prova o resultado. O AzuraSort puxa os comentários automaticamente e te dá um certificado verificável." },
    { q: "A roleta prova que o ganhador foi justo?", a: "Não. Ela gira na sua tela e você poderia girar de novo até gostar do resultado — quem assiste só pode confiar. O AzuraSort publica um hash antes do sorteio e um certificado público depois, então o resultado é verificável." },
    { q: "E um vídeo pra postar?", a: "A roleta te dá um giro genérico. O AzuraSort gera uma revelação cinematográfica temática como MP4 idêntico à tela e pronto pro feed ou Reels." },
    { q: "Ela dá conta de milhares de comentários?", a: "A roleta não — você digitaria nomes pra sempre. O AzuraSort coleta tudo automaticamente, então o tamanho do post nunca é o gargalo." },
    { q: "Quando a roleta de nomes já basta?", a: "Pra uma lista pequena de nomes que você já tem, offline, a roleta é perfeita. Pra um sorteio de Instagram em que você quer sortear pelos comentários, aplicar regras, provar a justiça e postar um vídeo, o AzuraSort encaixa." },
  ],
  cta: "Sortear pelos comentários do meu post",
  breadcrumb: "Roleta de nomes vs AzuraSort",
};

const es: PillarContent = {
  metaTitle: "Rueda de nombres (Wheel of Names) para sorteos de Instagram vs AzuraSort",
  metaDescription:
    "Una rueda de nombres es genial para una lista que escribes a mano — pero no lee los comentarios de Instagram, no prueba la imparcialidad ni te da un vídeo para publicar. Mira por qué AzuraSort es la alternativa nativa de Instagram a la ruleta de nombres.",
  keywords: [
    "wheel of names instagram",
    "ruleta de nombres sorteo",
    "rueda de nombres instagram",
    "sorteador de nombres instagram",
    "ruleta sorteo instagram",
    "sorteo verificable",
  ],
  h1: "Ruleta de nombres vs AzuraSort en Instagram",
  intro:
    "La ruleta de nombres es un clásico: escribes una lista, giras y se detiene en alguien. Es divertida y gratis para un grupo pequeño. Pero para un sorteo de Instagram choca con un muro rápido — tienes que escribir cada nombre a mano, no lee tus comentarios, y te deja sin prueba y sin nada para publicar. Esta página compara la ruleta de nombres con AzuraSort.",
  whyTitle: "Dónde se detiene la ruleta en Instagram",
  whyParas: [
    "La ruleta de nombres está hecha para listas que ya tienes. En un sorteo de Instagram eso significa copiar el @ de cada persona que comentó dentro de la ruleta a mano — bien para 20 nombres, imposible para 2.000. Tampoco entiende las reglas de Instagram: no bloquea usuarios duplicados, no exige mención ni hashtag, no sortea por likes. Y cuando se detiene en un nombre, eso es todo lo que tienes: ninguna forma de probar que no la giraste de nuevo hasta que ganó un amigo, y ningún clip pensado para tu feed.",
    "AzuraSort es nativo de Instagram. Extrae los comentarios automáticamente — sin escribir — aplica tus reglas (bloquear duplicados, exigir menciones o hashtags, varios ganadores y suplentes) y es provably-fair: commit-reveal con SHA-256, con el hash publicado antes del resultado, así que cualquiera verifica al ganador en una página pública de certificado. En lugar de un giro genérico, la revelación se reproduce como animación cinematográfica (caja fuerte, ruleta, cuenta regresiva y más) generada automáticamente como un MP4 idéntico a la pantalla y listo para publicar. Pago por uso, tarjeta o PIX, precio mostrado antes de pagar.",
  ],
  stepsTitle: "La forma nativa de Instagram",
  steps: [
    { name: "Pega el enlace del post o Reel", text: "AzuraSort carga todos los comentarios automáticamente — sin copiar nombre por nombre en una ruleta." },
    { name: "Define las reglas de Instagram", text: "Bloquea cuentas duplicadas, exige mención o hashtag, sortea por comentarios o likes, y elige ganadores más suplentes." },
    { name: "Revela con una animación temática", text: "Elige una revelación cinematográfica — caja fuerte, ruleta, cuenta regresiva — en lugar de un giro genérico, en directo si quieres." },
    { name: "Comparte vídeo y certificado", text: "Publica el MP4 de la revelación y comparte el enlace del certificado para que cualquiera verifique el sorteo — prueba que la ruleta no te da." },
  ],
  faqTitle: "Ruleta de nombres vs AzuraSort: preguntas frecuentes",
  faq: [
    { q: "¿Puedo usar Wheel of Names para un sorteo de Instagram?", a: "Puedes, pero tienes que escribir el nombre de cada participante a mano y no lee comentarios, no aplica reglas ni prueba el resultado. AzuraSort extrae los comentarios automáticamente y te da un certificado verificable." },
    { q: "¿La ruleta prueba que el ganador fue justo?", a: "No. Gira en tu pantalla y podrías girar de nuevo hasta que te guste el resultado — quien mira solo puede confiar. AzuraSort publica un hash antes del sorteo y un certificado público después, así que el resultado es verificable." },
    { q: "¿Y un vídeo para publicar?", a: "La ruleta te da un giro genérico. AzuraSort genera una revelación cinematográfica temática como MP4 idéntico a la pantalla y listo para el feed o Reels." },
    { q: "¿Aguanta miles de comentarios de Instagram?", a: "La ruleta no — escribirías nombres para siempre. AzuraSort los recoge automáticamente, así que el tamaño del post nunca es el cuello de botella." },
    { q: "¿Cuándo basta con una ruleta de nombres?", a: "Para una lista pequeña de nombres que ya tienes, offline, la ruleta es perfecta. Para un sorteo de Instagram donde quieres sortear por comentarios, aplicar reglas, probar la imparcialidad y publicar un vídeo, AzuraSort encaja." },
  ],
  cta: "Sortear por los comentarios de mi post",
  breadcrumb: "Ruleta de nombres vs AzuraSort",
};

const frMa: PillarContent = {
  metaTitle: "Roue de noms (Wheel of Names) pour les tirages Instagram vs AzuraSort",
  metaDescription:
    "Une roue de noms est parfaite pour une liste que vous saisissez à la main — mais elle ne lit pas les commentaires Instagram, ne prouve rien et ne vous donne aucune vidéo à publier. Voici pourquoi AzuraSort est l'alternative native à la roue de noms.",
  keywords: [
    "wheel of names instagram",
    "roue de noms tirage au sort",
    "roue de la chance instagram",
    "tirage de noms instagram",
    "roulette tirage instagram",
    "tirage au sort vérifiable",
  ],
  h1: "Roue de noms vs AzuraSort sur Instagram",
  intro:
    "La roue de noms est un classique : vous saisissez une liste, vous lancez la roue et elle s'arrête sur quelqu'un. C'est ludique et gratuit pour un petit groupe. Mais pour un tirage Instagram, elle se heurte vite à un mur — il faut taper chaque nom à la main, elle ne lit pas vos commentaires, et elle ne vous laisse ni preuve ni contenu à publier. Cette page compare la roue de noms à AzuraSort.",
  whyTitle: "Là où la roue de noms s'arrête sur Instagram",
  whyParas: [
    "La roue de noms est conçue pour des listes que vous avez déjà. Pour un tirage Instagram, cela veut dire recopier à la main le @ de chaque personne qui a commenté — acceptable pour 20 noms, impossible pour 2 000. Elle ignore aussi totalement les règles d'Instagram : elle ne bloque pas les comptes en double, n'exige ni mention ni hashtag, et ne tire pas parmi les likes. Et quand elle s'arrête sur un nom, vous n'avez que ça : aucun moyen de prouver que la roue n'a pas été relancée jusqu'à ce qu'un ami gagne, et aucun clip pensé pour votre feed.",
    "AzuraSort est natif d'Instagram. Il récupère les commentaires automatiquement — sans rien taper — applique vos règles (bloquer les doublons, exiger des mentions ou des hashtags, plusieurs gagnants et suppléants) et il est prouvablement équitable : commit-reveal avec SHA-256, le hash étant publié avant le résultat, si bien que chacun peut vérifier le gagnant sur une page de certificat public. Au lieu d'un tour de roue générique, la révélation se joue comme une animation cinématographique (coffre-fort, roulette, compte à rebours et d'autres), générée automatiquement en MP4 identique à l'écran et prête à publier. Paiement à l'usage, carte ou PIX, prix affiché avant de payer.",
  ],
  stepsTitle: "La méthode native Instagram",
  steps: [
    { name: "Collez le lien du post ou du Reel", text: "AzuraSort charge tous les commentaires automatiquement — sans recopier les noms un par un dans une roue." },
    { name: "Définissez les règles Instagram", text: "Bloquez les comptes en double, exigez une mention ou un hashtag, tirez parmi les commentaires ou les likes, et choisissez gagnants et suppléants." },
    { name: "Révélez avec une animation thématique", text: "Choisissez une révélation cinématographique — coffre-fort, roulette, compte à rebours — au lieu d'un tour de roue générique, en direct si vous voulez." },
    { name: "Partagez la vidéo et le certificat", text: "Publiez le MP4 de la révélation et diffusez le lien du certificat pour que chacun vérifie le tirage — une preuve qu'une roue de noms ne peut pas offrir." },
  ],
  faqTitle: "Roue de noms vs AzuraSort : questions fréquentes",
  faq: [
    { q: "Puis-je utiliser Wheel of Names pour un tirage Instagram ?", a: "C'est possible, mais vous devez saisir à la main le nom de chaque participant, et l'outil ne lit pas les commentaires, n'applique aucune règle et ne prouve pas le résultat. AzuraSort récupère les commentaires automatiquement et vous remet un certificat vérifiable." },
    { q: "Une roue de noms prouve-t-elle que le gagnant est équitable ?", a: "Non. Elle tourne sur votre écran et vous pourriez la relancer jusqu'à obtenir le résultat qui vous plaît — vos spectateurs n'ont que votre parole. AzuraSort publie un hash avant le tirage et un certificat public après, ce qui rend le résultat vérifiable." },
    { q: "Et une vidéo à publier ?", a: "Une roue de noms ne vous donne qu'un tour générique. AzuraSort produit une révélation cinématographique thématique en MP4, identique à l'écran et prête pour votre feed ou vos Reels." },
    { q: "Peut-elle gérer des milliers de commentaires Instagram ?", a: "Une roue, non — vous taperiez des noms indéfiniment. AzuraSort les collecte automatiquement : la taille du post n'est jamais le goulot d'étranglement." },
    { q: "Quand une roue de noms suffit-elle ?", a: "Pour une petite liste de noms hors ligne que vous avez déjà, la roue est parfaite. Pour un tirage Instagram où vous voulez puiser dans les commentaires, appliquer des règles, prouver l'équité et publier une vidéo, AzuraSort est le bon choix." },
  ],
  cta: "Tirer au sort parmi mes commentaires Instagram",
  breadcrumb: "Roue de noms vs AzuraSort",
};

const arMa: PillarContent = {
  metaTitle: "عجلة الأسماء (Wheel of Names) لسحوبات إنستغرام مقابل AzuraSort",
  metaDescription:
    "عجلة الأسماء ممتازة لقائمة تكتبها بيدك — لكنها لا تقرأ تعليقات إنستغرام، ولا تُثبت النزاهة، ولا تمنحك فيديو للنشر. اكتشف لماذا يُعدّ AzuraSort البديل الأصلي لعجلة الأسماء على إنستغرام.",
  keywords: [
    "عجلة الأسماء إنستغرام",
    "بديل عجلة الأسماء",
    "عجلة سحب عشوائي",
    "سحب أسماء إنستغرام",
    "عجلة سحب إنستغرام",
    "سحب قابل للتحقق",
  ],
  h1: "عجلة الأسماء مقابل AzuraSort على إنستغرام",
  intro:
    "عجلة الأسماء كلاسيكية: تكتب قائمة، تُديرها، فتتوقف عند أحدهم. إنها ممتعة ومجانية لمجموعة صغيرة. لكنها تصطدم بحائط سريعًا في سحوبات إنستغرام — عليك إدخال كل اسم يدويًا، وهي لا تقرأ تعليقاتك، ولا تترك لك دليلًا ولا شيئًا تنشره. تقارن هذه الصفحة بين عجلة الأسماء وAzuraSort.",
  whyTitle: "أين تتوقف عجلة الأسماء على إنستغرام",
  whyParas: [
    "صُمِّمت عجلة الأسماء لقوائم تملكها مسبقًا. في سحب على إنستغرام يعني ذلك نسخ معرّف (@) كل من علّق إلى داخل العجلة يدويًا — مقبول مع 20 اسمًا، ومستحيل مع 2000. كما أنها لا تعرف شيئًا عن قواعد إنستغرام: لا تحجب الحسابات المكرّرة، ولا تشترط إشارة أو وسمًا، ولا تسحب من الإعجابات. وحين تتوقف عند اسم، فهذا كل ما تحصل عليه: لا وسيلة لإثبات أنك لم تُعِد إدارتها حتى يفوز صديق، ولا مقطع مصمَّم لحسابك.",
    "أما AzuraSort فمبني أصلًا لإنستغرام. يسحب التعليقات تلقائيًا — بلا كتابة — ويطبّق قواعدك (حجب المكرّرين، اشتراط الإشارات أو الوسوم، عدة فائزين واحتياطيين)، وهو قابل للإثبات: commit-reveal مع SHA-256، إذ يُنشر الهاش قبل النتيجة، فيتمكن أي شخص من التحقق من الفائز عبر صفحة شهادة عامة. وبدل دوران عام لا هوية له، يُعرض الكشف كرسوم متحركة سينمائية (خزنة، روليت، عدّ تنازلي وغيرها) تُولَّد تلقائيًا كملف MP4 مطابق للشاشة وجاهز للنشر. الدفع حسب الاستخدام، بالبطاقة أو PIX، والسعر يظهر قبل الدفع.",
  ],
  stepsTitle: "الطريقة الأصلية لإنستغرام",
  steps: [
    { name: "الصق رابط المنشور أو الـ Reel", text: "يحمّل AzuraSort كل التعليقات تلقائيًا — بلا نسخ الأسماء واحدًا واحدًا إلى عجلة." },
    { name: "اضبط قواعد إنستغرام", text: "احجب الحسابات المكرّرة، اشترط إشارة أو وسمًا، اسحب من التعليقات أو الإعجابات، وحدّد الفائزين والاحتياطيين." },
    { name: "اكشف الفائز برسوم متحركة مميزة", text: "اختر كشفًا سينمائيًا — خزنة أو روليت أو عدّ تنازلي — بدل دوران عام، وبثّه مباشرةً إن أردت." },
    { name: "شارك الفيديو والشهادة", text: "انشر ملف MP4 للكشف وشارك رابط الشهادة ليتحقق أي شخص من السحب — دليل لا تستطيع عجلة الأسماء تقديمه." },
  ],
  faqTitle: "عجلة الأسماء مقابل AzuraSort: أسئلة شائعة",
  faq: [
    { q: "هل يمكنني استخدام Wheel of Names لسحب على إنستغرام؟", a: "يمكنك ذلك، لكن عليك كتابة اسم كل مشارك يدويًا، وهي لا تقرأ التعليقات ولا تطبّق القواعد ولا تُثبت النتيجة. أما AzuraSort فيسحب التعليقات تلقائيًا ويمنحك شهادة قابلة للتحقق." },
    { q: "هل تُثبت عجلة الأسماء نزاهة الفائز؟", a: "لا. إنها تدور على شاشتك، ويمكنك إعادة إدارتها حتى تُعجبك النتيجة — ولا يملك المشاهدون سوى الثقة بك. أما AzuraSort فينشر هاشًا قبل السحب وشهادة عامة بعده، فتصبح النتيجة قابلة للتحقق." },
    { q: "وماذا عن فيديو للنشر؟", a: "عجلة الأسماء تمنحك دورانًا عامًا فقط. أما AzuraSort فيُنتج كشفًا سينمائيًا بطابع مميز كملف MP4 مطابق للشاشة وجاهز لحسابك أو للـ Reels." },
    { q: "هل تتحمّل آلاف التعليقات على إنستغرام؟", a: "العجلة لا تتحمّل ذلك — ستظل تكتب الأسماء بلا نهاية. أما AzuraSort فيجمعها تلقائيًا، فلا يكون حجم المنشور عائقًا أبدًا." },
    { q: "متى تكفي عجلة الأسماء؟", a: "لقائمة صغيرة من أسماء تملكها مسبقًا خارج الإنترنت، العجلة مثالية. أما إذا أردت السحب من التعليقات وتطبيق القواعد وإثبات النزاهة ونشر فيديو، فإن AzuraSort هو الخيار المناسب." },
  ],
  cta: "اسحب من تعليقات منشوري على إنستغرام",
  breadcrumb: "عجلة الأسماء مقابل AzuraSort",
};

const BY_LOCALE: Record<string, PillarContent> = {
  en,
  "pt-br": ptBr,
  es,
  "fr-ma": frMa,
  "ar-ma": arMa,
};

export function getVsWheelOfNames(locale: string): PillarContent {
  return BY_LOCALE[locale] ?? en;
}
