/**
 * Conteúdo da pillar page "Sorteio de Instagram verificável / provably-fair".
 * Ângulo: confiança e auditabilidade — como provar que um sorteio do Instagram
 * foi justo, via commit-reveal (SHA-256 + Fisher-Yates) e certificado público.
 * Multilíngue (en default, pt-br, es, fr-ma, ar-ma) com fallback para en.
 */

import type { PillarContent } from "./video";

const en: PillarContent = {
  metaTitle: "Verifiable Instagram giveaway: prove your draw was provably fair",
  metaDescription:
    "Learn how to prove your Instagram giveaway was fair. AzuraSort publishes a SHA-256 hash before the draw, then issues a public certificate anyone can re-check to confirm the winner wasn't rigged.",
  keywords: [
    "verifiable instagram giveaway",
    "provably fair giveaway",
    "auditable giveaway draw",
    "prove giveaway was fair",
    "giveaway certificate",
    "commit reveal giveaway",
  ],
  h1: "How to prove your Instagram giveaway was fair",
  intro:
    "When you announce a winner, followers have to take your word for it — unless you can show the draw couldn't be rigged. AzuraSort makes every giveaway provably fair: it locks the result in advance and gives you a public certificate so anyone can verify it themselves. This page explains how that works and why it's mathematically convincing.",
  whyTitle: "How a verifiable giveaway actually works",
  whyParas: [
    "A provably-fair draw uses a technique called commit-reveal. Before running the draw, AzuraSort takes the full participant list plus a random seed and publishes a SHA-256 hash of it — the commit. A hash is a one-way fingerprint: the same input always produces the same hash, but you cannot work backwards from the hash to change the inputs without the fingerprint changing completely. Because the hash is published before anyone knows the winner, the organizer is locked in. They cannot quietly swap a name, add a fake account for a friend, or re-roll until a favorite wins, because any of those changes would produce a different hash than the one already on record.",
    "After the draw, AzuraSort reveals the seed and the participant list — the reveal. Now anyone can do two checks. First, hash the revealed data themselves and confirm it matches the hash published earlier, proving the inputs weren't altered. Second, run the same shuffle (a deterministic Fisher-Yates shuffle driven by that seed) and confirm it lands on the same winner. If both match, the result is provably the honest output of the committed data. AzuraSort does this for you on a public certificate page, so you don't have to trust AzuraSort either — you can reproduce the math independently.",
  ],
  stepsTitle: "How to run and verify a fair draw",
  steps: [
    { name: "Paste the post or Reel link", text: "AzuraSort loads the participants from the comments or likes and commits to them by publishing a SHA-256 hash before anything is drawn." },
    { name: "Run the provably-fair draw", text: "Participants are shuffled with a deterministic Fisher-Yates algorithm seeded at draw time, and the winner (plus any backups) is selected." },
    { name: "Get your certificate code", text: "Every draw produces a certificate with a public code containing the revealed seed, the participant list and the original hash." },
    { name: "Verify on the public page", text: "Open azurasort.com/<locale>/verify/<code>. Anyone can re-hash the data, re-run the shuffle and confirm the winner matches — no account needed." },
  ],
  faqTitle: "Frequently asked questions",
  faq: [
    { q: "How can anyone verify the result?", a: "Each draw has a public certificate at azurasort.com/<locale>/verify/<code>. The page shows the seed, the participant list and the pre-published hash, and re-runs the algorithm so anyone can confirm the winner is correct. You can also re-check the math by hand or with your own script." },
    { q: "What is commit-reveal?", a: "It's a two-step proof. First you commit: publish a SHA-256 hash of the participants and seed before the draw, locking them in. Then you reveal: after the draw, publish the actual data so people can confirm it matches the hash and reproduces the same winner." },
    { q: "Can the organizer rig it?", a: "Not without getting caught. The hash is published before the winner is known, so changing the participant list, adding fake entries or re-rolling the draw would produce a hash that no longer matches the one already on record. The mismatch would be visible to anyone who checks." },
    { q: "Do I need to understand cryptography?", a: "No. AzuraSort does the verification for you and shows a clear pass or fail on the certificate page. The underlying SHA-256 and Fisher-Yates steps are standard and public, so a technical person can independently confirm them, but you don't have to." },
    { q: "How much does it cost?", a: "Pay-per-use, priced by the number of participants. You see the price before paying, and the certificate is included with every draw. Card (Stripe) and PIX are supported." },
  ],
  cta: "Run a verifiable giveaway",
  breadcrumb: "Verifiable giveaway",
};

const ptBr: PillarContent = {
  metaTitle: "Sorteio de Instagram verificável: prove que o seu sorteio foi justo",
  metaDescription:
    "Aprenda a provar que o seu sorteio de Instagram foi justo. O AzuraSort publica um hash SHA-256 antes do sorteio e emite um certificado público que qualquer pessoa pode reconferir para confirmar que não houve manipulação.",
  keywords: [
    "sorteio instagram verificável",
    "sorteio justo comprovável",
    "sorteio auditável",
    "provar que sorteio foi justo",
    "certificado de sorteio",
    "sorteio commit-reveal",
  ],
  h1: "Como provar que o seu sorteio de Instagram foi justo",
  intro:
    "Quando você anuncia um ganhador, os seguidores precisam acreditar na sua palavra — a não ser que você consiga mostrar que o sorteio não pôde ser manipulado. O AzuraSort torna todo sorteio comprovadamente justo: ele trava o resultado de antemão e entrega um certificado público para qualquer pessoa verificar por conta própria. Esta página explica como isso funciona e por que é matematicamente convincente.",
  whyTitle: "Como um sorteio verificável realmente funciona",
  whyParas: [
    "Um sorteio provably-fair usa uma técnica chamada commit-reveal. Antes de sortear, o AzuraSort pega a lista completa de participantes mais uma semente aleatória e publica um hash SHA-256 disso — o commit. Um hash é uma impressão digital de mão única: a mesma entrada sempre gera o mesmo hash, mas não dá para voltar do hash e alterar as entradas sem que a impressão digital mude por completo. Como o hash é publicado antes de alguém saber o ganhador, o organizador fica travado. Ele não consegue trocar um nome em silêncio, adicionar uma conta falsa para um amigo nem re-sortear até um favorito ganhar, porque qualquer dessas mudanças geraria um hash diferente do que já está registrado.",
    "Depois do sorteio, o AzuraSort revela a semente e a lista de participantes — o reveal. Agora qualquer pessoa pode fazer duas conferências. Primeiro, gerar o hash dos dados revelados e confirmar que bate com o hash publicado antes, provando que as entradas não foram alteradas. Segundo, rodar o mesmo embaralhamento (um Fisher-Yates determinístico guiado por aquela semente) e confirmar que chega no mesmo ganhador. Se os dois baterem, o resultado é comprovadamente a saída honesta dos dados comprometidos. O AzuraSort faz isso por você numa página pública de certificado, então você nem precisa confiar no AzuraSort — dá para reproduzir a matemática de forma independente.",
  ],
  stepsTitle: "Como fazer e verificar um sorteio justo",
  steps: [
    { name: "Cole o link do post ou Reels", text: "O AzuraSort carrega os participantes dos comentários ou curtidas e se compromete com eles publicando um hash SHA-256 antes de qualquer sorteio." },
    { name: "Faça o sorteio provably-fair", text: "Os participantes são embaralhados com um algoritmo Fisher-Yates determinístico semeado na hora do sorteio, e o ganhador (mais os suplentes) é selecionado." },
    { name: "Receba o código do certificado", text: "Todo sorteio gera um certificado com um código público contendo a semente revelada, a lista de participantes e o hash original." },
    { name: "Verifique na página pública", text: "Abra azurasort.com/<locale>/verify/<code>. Qualquer pessoa pode refazer o hash dos dados, rodar o embaralhamento de novo e confirmar que o ganhador bate — sem precisar de conta." },
  ],
  faqTitle: "Perguntas frequentes",
  faq: [
    { q: "Como qualquer pessoa verifica o resultado?", a: "Cada sorteio tem um certificado público em azurasort.com/<locale>/verify/<code>. A página mostra a semente, a lista de participantes e o hash publicado antes, e roda o algoritmo de novo para qualquer um confirmar que o ganhador está correto. Dá também para reconferir a conta na mão ou com o seu próprio script." },
    { q: "O que é commit-reveal?", a: "É uma prova em duas etapas. Primeiro você se compromete (commit): publica um hash SHA-256 dos participantes e da semente antes do sorteio, travando-os. Depois você revela (reveal): após o sorteio, publica os dados reais para as pessoas confirmarem que batem com o hash e reproduzem o mesmo ganhador." },
    { q: "O organizador consegue manipular?", a: "Não sem ser pego. O hash é publicado antes de o ganhador ser conhecido, então mudar a lista de participantes, adicionar entradas falsas ou re-sortear geraria um hash que não bate mais com o que já está registrado. A divergência ficaria visível para quem conferir." },
    { q: "Preciso entender de criptografia?", a: "Não. O AzuraSort faz a verificação por você e mostra um resultado claro de aprovado ou reprovado na página do certificado. As etapas de SHA-256 e Fisher-Yates são padrão e públicas, então uma pessoa técnica pode confirmá-las de forma independente, mas você não precisa." },
    { q: "Quanto custa?", a: "Pague por uso, com preço pela quantidade de participantes. Você vê o valor antes de pagar, e o certificado vem incluído em todo sorteio. Aceita cartão (Stripe) e PIX." },
  ],
  cta: "Fazer um sorteio verificável",
  breadcrumb: "Sorteio verificável",
};

const es: PillarContent = {
  metaTitle: "Sorteo de Instagram verificable: demuestra que tu sorteo fue justo",
  metaDescription:
    "Aprende a demostrar que tu sorteo de Instagram fue justo. AzuraSort publica un hash SHA-256 antes del sorteo y emite un certificado público que cualquiera puede recomprobar para confirmar que no hubo manipulación.",
  keywords: [
    "sorteo instagram verificable",
    "sorteo justo comprobable",
    "sorteo auditable",
    "demostrar que un sorteo fue justo",
    "certificado de sorteo",
    "sorteo commit-reveal",
  ],
  h1: "Cómo demostrar que tu sorteo de Instagram fue justo",
  intro:
    "Cuando anuncias a un ganador, tus seguidores tienen que creer en tu palabra — a menos que puedas mostrar que el sorteo no se pudo manipular. AzuraSort hace que cada sorteo sea comprobablemente justo: bloquea el resultado de antemano y entrega un certificado público para que cualquiera lo verifique por su cuenta. Esta página explica cómo funciona y por qué es matemáticamente convincente.",
  whyTitle: "Cómo funciona realmente un sorteo verificable",
  whyParas: [
    "Un sorteo provably-fair usa una técnica llamada commit-reveal. Antes de sortear, AzuraSort toma la lista completa de participantes más una semilla aleatoria y publica un hash SHA-256 de todo ello — el commit. Un hash es una huella de un solo sentido: la misma entrada siempre produce el mismo hash, pero no puedes ir hacia atrás desde el hash para cambiar las entradas sin que la huella cambie por completo. Como el hash se publica antes de que nadie conozca al ganador, el organizador queda bloqueado. No puede cambiar un nombre en silencio, añadir una cuenta falsa para un amigo ni volver a sortear hasta que gane un favorito, porque cualquiera de esos cambios produciría un hash distinto al ya registrado.",
    "Tras el sorteo, AzuraSort revela la semilla y la lista de participantes — el reveal. Ahora cualquiera puede hacer dos comprobaciones. Primero, calcular el hash de los datos revelados y confirmar que coincide con el hash publicado antes, demostrando que las entradas no se alteraron. Segundo, ejecutar el mismo barajado (un Fisher-Yates determinista guiado por esa semilla) y confirmar que llega al mismo ganador. Si ambos coinciden, el resultado es demostrablemente la salida honesta de los datos comprometidos. AzuraSort lo hace por ti en una página pública de certificado, así que ni siquiera tienes que confiar en AzuraSort — puedes reproducir las matemáticas de forma independiente.",
  ],
  stepsTitle: "Cómo hacer y verificar un sorteo justo",
  steps: [
    { name: "Pega el enlace del post o Reel", text: "AzuraSort carga a los participantes de los comentarios o los likes y se compromete con ellos publicando un hash SHA-256 antes de cualquier sorteo." },
    { name: "Haz el sorteo provably-fair", text: "Los participantes se barajan con un algoritmo Fisher-Yates determinista sembrado en el momento del sorteo, y se selecciona al ganador (más los suplentes)." },
    { name: "Obtén tu código de certificado", text: "Cada sorteo genera un certificado con un código público que contiene la semilla revelada, la lista de participantes y el hash original." },
    { name: "Verifica en la página pública", text: "Abre azurasort.com/<locale>/verify/<code>. Cualquiera puede recalcular el hash de los datos, volver a ejecutar el barajado y confirmar que el ganador coincide — sin necesidad de cuenta." },
  ],
  faqTitle: "Preguntas frecuentes",
  faq: [
    { q: "¿Cómo puede verificar el resultado cualquiera?", a: "Cada sorteo tiene un certificado público en azurasort.com/<locale>/verify/<code>. La página muestra la semilla, la lista de participantes y el hash publicado antes, y vuelve a ejecutar el algoritmo para que cualquiera confirme que el ganador es correcto. También puedes recomprobar las cuentas a mano o con tu propio script." },
    { q: "¿Qué es commit-reveal?", a: "Es una prueba en dos pasos. Primero te comprometes (commit): publicas un hash SHA-256 de los participantes y la semilla antes del sorteo, bloqueándolos. Luego revelas (reveal): tras el sorteo, publicas los datos reales para que la gente confirme que coinciden con el hash y reproducen el mismo ganador." },
    { q: "¿Puede el organizador amañarlo?", a: "No sin que se note. El hash se publica antes de conocer al ganador, así que cambiar la lista de participantes, añadir entradas falsas o volver a sortear produciría un hash que ya no coincide con el registrado. La discrepancia sería visible para quien lo compruebe." },
    { q: "¿Necesito entender de criptografía?", a: "No. AzuraSort hace la verificación por ti y muestra un resultado claro de aprobado o fallido en la página del certificado. Los pasos de SHA-256 y Fisher-Yates son estándar y públicos, así que una persona técnica puede confirmarlos de forma independiente, pero tú no tienes que hacerlo." },
    { q: "¿Cuánto cuesta?", a: "Pago por uso, según el número de participantes. Ves el precio antes de pagar, y el certificado va incluido en cada sorteo. Acepta tarjeta (Stripe) y PIX." },
  ],
  cta: "Hacer un sorteo verificable",
  breadcrumb: "Sorteo verificable",
};

const frMa: PillarContent = {
  metaTitle: "Tirage au sort Instagram vérifiable : prouvez que votre tirage était équitable",
  metaDescription:
    "Apprenez à prouver que votre tirage au sort Instagram était équitable. AzuraSort publie un hash SHA-256 avant le tirage et délivre un certificat public que chacun peut revérifier pour confirmer l'absence de manipulation.",
  keywords: [
    "tirage au sort instagram vérifiable",
    "tirage équitable prouvable",
    "tirage auditable",
    "prouver l'équité d'un tirage",
    "certificat de tirage",
    "tirage commit-reveal",
  ],
  h1: "Comment prouver que votre tirage au sort Instagram était équitable",
  intro:
    "Quand vous annoncez un gagnant, vos abonnés doivent vous croire sur parole — sauf si vous pouvez montrer que le tirage ne pouvait pas être truqué. AzuraSort rend chaque tirage prouvablement équitable : il verrouille le résultat à l'avance et fournit un certificat public que chacun peut vérifier lui-même. Cette page explique comment cela fonctionne et pourquoi c'est mathématiquement convaincant.",
  whyTitle: "Comment fonctionne réellement un tirage vérifiable",
  whyParas: [
    "Un tirage provably-fair utilise une technique appelée commit-reveal. Avant le tirage, AzuraSort prend la liste complète des participants et une graine aléatoire, puis publie un hash SHA-256 de l'ensemble — le commit. Un hash est une empreinte à sens unique : la même entrée produit toujours le même hash, mais on ne peut pas remonter du hash pour modifier les entrées sans que l'empreinte change entièrement. Comme le hash est publié avant que quiconque connaisse le gagnant, l'organisateur est verrouillé. Il ne peut pas changer un nom en douce, ajouter un faux compte pour un ami ni relancer le tirage jusqu'à ce qu'un favori gagne, car chacun de ces changements produirait un hash différent de celui déjà enregistré.",
    "Après le tirage, AzuraSort révèle la graine et la liste des participants — le reveal. Chacun peut alors faire deux vérifications. D'abord, calculer le hash des données révélées et confirmer qu'il correspond au hash publié avant, prouvant que les entrées n'ont pas été modifiées. Ensuite, exécuter le même mélange (un Fisher-Yates déterministe piloté par cette graine) et confirmer qu'il aboutit au même gagnant. Si les deux correspondent, le résultat est prouvablement la sortie honnête des données engagées. AzuraSort le fait pour vous sur une page de certificat publique, donc vous n'avez même pas besoin de faire confiance à AzuraSort — vous pouvez reproduire les calculs de façon indépendante.",
  ],
  stepsTitle: "Comment réaliser et vérifier un tirage équitable",
  steps: [
    { name: "Collez le lien du post ou du Reel", text: "AzuraSort charge les participants depuis les commentaires ou les likes et s'engage sur eux en publiant un hash SHA-256 avant tout tirage." },
    { name: "Lancez le tirage provably-fair", text: "Les participants sont mélangés avec un algorithme Fisher-Yates déterministe initialisé au moment du tirage, et le gagnant (plus les suppléants) est sélectionné." },
    { name: "Obtenez votre code de certificat", text: "Chaque tirage génère un certificat avec un code public contenant la graine révélée, la liste des participants et le hash d'origine." },
    { name: "Vérifiez sur la page publique", text: "Ouvrez azurasort.com/<locale>/verify/<code>. Chacun peut recalculer le hash des données, relancer le mélange et confirmer que le gagnant correspond — sans compte." },
  ],
  faqTitle: "Questions fréquentes",
  faq: [
    { q: "Comment chacun peut-il vérifier le résultat ?", a: "Chaque tirage a un certificat public sur azurasort.com/<locale>/verify/<code>. La page affiche la graine, la liste des participants et le hash publié avant, et relance l'algorithme pour que chacun confirme que le gagnant est correct. Vous pouvez aussi revérifier les calculs à la main ou avec votre propre script." },
    { q: "Qu'est-ce que le commit-reveal ?", a: "C'est une preuve en deux étapes. D'abord vous vous engagez (commit) : vous publiez un hash SHA-256 des participants et de la graine avant le tirage, ce qui les verrouille. Ensuite vous révélez (reveal) : après le tirage, vous publiez les données réelles pour que les gens confirment qu'elles correspondent au hash et reproduisent le même gagnant." },
    { q: "L'organisateur peut-il truquer le tirage ?", a: "Pas sans se faire prendre. Le hash est publié avant que le gagnant soit connu, donc modifier la liste des participants, ajouter de fausses entrées ou relancer le tirage produirait un hash qui ne correspond plus à celui enregistré. L'écart serait visible par quiconque vérifie." },
    { q: "Dois-je comprendre la cryptographie ?", a: "Non. AzuraSort fait la vérification pour vous et affiche un résultat clair, réussi ou échoué, sur la page du certificat. Les étapes SHA-256 et Fisher-Yates sont standard et publiques, donc une personne technique peut les confirmer de façon indépendante, mais vous n'êtes pas obligé." },
    { q: "Combien ça coûte ?", a: "Paiement à l'usage, selon le nombre de participants. Vous voyez le prix avant de payer, et le certificat est inclus avec chaque tirage. Carte (Stripe) et PIX acceptés." },
  ],
  cta: "Lancer un tirage vérifiable",
  breadcrumb: "Tirage vérifiable",
};

const arMa: PillarContent = {
  metaTitle: "سحب إنستغرام قابل للتحقق: أثبت أن سحبك كان نزيهًا",
  metaDescription:
    "تعلّم كيف تثبت أن سحبك على إنستغرام كان نزيهًا. ينشر AzuraSort بصمة SHA-256 قبل السحب ثم يصدر شهادة عامة يمكن لأي شخص إعادة التحقق منها للتأكد من عدم التلاعب.",
  keywords: [
    "سحب إنستغرام قابل للتحقق",
    "سحب نزيه قابل للإثبات",
    "سحب قابل للتدقيق",
    "إثبات نزاهة السحب",
    "شهادة السحب",
    "سحب commit-reveal",
  ],
  h1: "كيف تثبت أن سحبك على إنستغرام كان نزيهًا",
  intro:
    "حين تعلن عن فائز، على متابعيك أن يصدّقوك على كلمتك — إلا إذا استطعت أن تُظهر أن السحب لا يمكن التلاعب به. يجعل AzuraSort كل سحب قابلًا للإثبات: يُثبّت النتيجة مسبقًا ويمنحك شهادة عامة يستطيع أي شخص التحقق منها بنفسه. تشرح هذه الصفحة كيف يحدث ذلك ولماذا هو مقنع رياضيًا.",
  whyTitle: "كيف يعمل السحب القابل للتحقق فعليًا",
  whyParas: [
    "يستخدم السحب القابل للإثبات تقنية تُسمّى commit-reveal. قبل السحب، يأخذ AzuraSort قائمة المشاركين كاملة مع بذرة عشوائية وينشر بصمة SHA-256 لها — وهي خطوة الالتزام (commit). البصمة هي طبعة أحادية الاتجاه: المدخل نفسه يُنتج دائمًا البصمة نفسها، لكن لا يمكنك الرجوع من البصمة لتغيير المدخلات دون أن تتغيّر الطبعة بالكامل. وبما أن البصمة تُنشَر قبل أن يعرف أحد الفائز، يصبح المنظّم مقيَّدًا. لا يستطيع تبديل اسم بهدوء، ولا إضافة حساب وهمي لصديق، ولا إعادة السحب حتى يفوز مفضَّل لديه، لأن أيًا من هذه التغييرات سيُنتج بصمة مختلفة عن المسجَّلة سلفًا.",
    "بعد السحب، يكشف AzuraSort عن البذرة وقائمة المشاركين — وهي خطوة الكشف (reveal). الآن يمكن لأي شخص إجراء فحصين. أولًا، يحسب بصمة البيانات المكشوفة ويتأكد أنها تطابق البصمة المنشورة سابقًا، مما يثبت أن المدخلات لم تُغيَّر. ثانيًا، يُشغّل الخلط نفسه (خلط Fisher-Yates حتمي تقوده تلك البذرة) ويتأكد أنه يصل إلى الفائز نفسه. إذا تطابق الاثنان، فالنتيجة هي بشكل قابل للإثبات المخرَج النزيه للبيانات الملتزَم بها. يقوم AzuraSort بهذا نيابةً عنك في صفحة شهادة عامة، فلا تحتاج حتى إلى الوثوق بـ AzuraSort — يمكنك إعادة الحساب الرياضي بشكل مستقل.",
  ],
  stepsTitle: "كيف تنفّذ سحبًا نزيهًا وتتحقق منه",
  steps: [
    { name: "الصق رابط المنشور أو الـ Reel", text: "يحمّل AzuraSort المشاركين من التعليقات أو الإعجابات ويلتزم بهم بنشر بصمة SHA-256 قبل أي سحب." },
    { name: "نفّذ السحب القابل للإثبات", text: "يُخلط المشاركون بخوارزمية Fisher-Yates حتمية تُبذَر لحظة السحب، ويُختار الفائز (إضافةً إلى الاحتياطيين)." },
    { name: "احصل على رمز شهادتك", text: "كل سحب يُنشئ شهادة برمز عام يتضمّن البذرة المكشوفة وقائمة المشاركين والبصمة الأصلية." },
    { name: "تحقق على الصفحة العامة", text: "افتح azurasort.com/<locale>/verify/<code>. يمكن لأي شخص إعادة حساب بصمة البيانات وإعادة تشغيل الخلط والتأكد من تطابق الفائز — دون الحاجة إلى حساب." },
  ],
  faqTitle: "الأسئلة الشائعة",
  faq: [
    { q: "كيف يتحقق أي شخص من النتيجة؟", a: "لكل سحب شهادة عامة على azurasort.com/<locale>/verify/<code>. تعرض الصفحة البذرة وقائمة المشاركين والبصمة المنشورة سابقًا، وتعيد تشغيل الخوارزمية ليؤكّد أي شخص أن الفائز صحيح. كما يمكنك إعادة التحقق من الحساب يدويًا أو باستخدام برنامجك الخاص." },
    { q: "ما هو commit-reveal؟", a: "إنه إثبات من خطوتين. أولًا تلتزم (commit): تنشر بصمة SHA-256 للمشاركين والبذرة قبل السحب، فتثبّتهم. ثم تكشف (reveal): بعد السحب، تنشر البيانات الفعلية ليتأكد الناس أنها تطابق البصمة وتُعيد إنتاج الفائز نفسه." },
    { q: "هل يستطيع المنظّم التلاعب؟", a: "ليس دون أن يُكشف. تُنشَر البصمة قبل معرفة الفائز، لذا فإن تغيير قائمة المشاركين أو إضافة مشاركات وهمية أو إعادة السحب سينتج بصمة لم تعد تطابق المسجَّلة. ويظهر هذا التعارض لكل من يتحقق." },
    { q: "هل أحتاج إلى فهم التشفير؟", a: "لا. يقوم AzuraSort بالتحقق نيابةً عنك ويُظهر نتيجة واضحة بنجاح أو فشل على صفحة الشهادة. خطوتا SHA-256 وFisher-Yates قياسيتان وعامتان، فيستطيع شخص تقني تأكيدهما بشكل مستقل، لكنك لست مضطرًا لذلك." },
    { q: "كم يكلّف؟", a: "الدفع حسب الاستخدام، بحسب عدد المشاركين. ترى السعر قبل الدفع، والشهادة مُضمَّنة مع كل سحب. يدعم البطاقة (Stripe) وPIX." },
  ],
  cta: "نفّذ سحبًا قابلًا للتحقق",
  breadcrumb: "سحب قابل للتحقق",
};

const BY_LOCALE: Record<string, PillarContent> = {
  en,
  "pt-br": ptBr,
  es,
  "fr-ma": frMa,
  "ar-ma": arMa,
};

export function getVerifiable(locale: string): PillarContent {
  return BY_LOCALE[locale] ?? en;
}
