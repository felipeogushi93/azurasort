import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GiveawaySimulator } from "@/components/sorteio/GiveawaySimulator";
import { SupportNote } from "@/components/SupportNote";
import { currencyForLocale } from "@/lib/payments/pricing";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/seo/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";

type SorteioCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  faq: { q: string; a: string }[];
};

/** Textos por idioma — antes era PT fixo em todos os locales. */
const COPY: Record<string, SorteioCopy> = {
  "pt-br": {
    title: "Fazer sorteio no Instagram · AzuraSort",
    description: "Cole o link do post, sorteie um ganhador aleatório e receba o vídeo da revelação com certificado verificável.",
    h1: "Fazer sorteio no Instagram pelos comentários",
    intro:
      "Cole o link do seu post ou Reel e o AzuraSort lê os comentários, aplica suas regras e sorteia um ganhador aleatório na hora. Você recebe um vídeo da revelação pronto para publicar no feed ou nos Stories e um certificado público que prova que o resultado não foi escolhido a dedo. Sem cadastro, sem assinatura: você paga por sorteio e vê o preço antes.",
    faq: [
      { q: "Como fazer um sorteio no Instagram pelos comentários?", a: "Cole o link do post ou Reel, escolha as regras (marcar amigos, seguir o perfil, ignorar comentários repetidos) e clique em sortear. O AzuraSort coleta os comentários, embaralha os participantes na tela e revela o ganhador no final." },
      { q: "O sorteio é realmente aleatório?", a: "Sim, e dá para provar. Antes de sortear geramos um hash SHA-256 da lista de participantes e da semente do sorteio. Depois publicamos o certificado com esses dados, então qualquer pessoa pode conferir que o resultado não foi alterado depois do fato." },
      { q: "Quanto custa fazer um sorteio?", a: "É pago por sorteio, sem assinatura, e o preço varia conforme o número de ganhadores e o plano escolhido. Você vê o valor exato antes de pagar. Aceitamos PIX e cartão." },
      { q: "Recebo um vídeo do sorteio para publicar?", a: "Sim. Nos planos com vídeo você baixa um MP4 da revelação — cofre, contagem regressiva, Matrix e outras animações — no formato certo para feed ou Stories, pronto para publicar e mostrar o resultado para os seguidores." },
      { q: "Dá para sortear mais de um ganhador e suplentes?", a: "Sim. Você escolhe quantos ganhadores quer e pode sortear suplentes na mesma rodada, caso alguém não responda dentro do prazo." },
    ],
  },
  en: {
    title: "Run an Instagram giveaway · AzuraSort",
    description: "Paste your post link, draw a random winner and get a cinematic reveal video with a verifiable certificate.",
    h1: "Run an Instagram giveaway from your comments",
    intro:
      "Paste your post or Reel link and AzuraSort reads the comments, applies your rules and draws a random winner instantly. You get a reveal video ready to post to your feed or Stories, plus a public certificate proving the result was not hand-picked. No signup, no subscription: you pay per draw and see the price up front.",
    faq: [
      { q: "How do I run an Instagram giveaway from comments?", a: "Paste the post or Reel link, pick your rules (tag a friend, follow the account, ignore duplicate comments) and hit draw. AzuraSort collects the comments, shuffles the entrants on screen and reveals the winner at the end." },
      { q: "Is the draw actually random?", a: "Yes, and it is provable. Before drawing we publish a SHA-256 hash of the entrant list and the draw seed. Afterwards we publish the certificate with that data, so anyone can verify the result was not changed after the fact." },
      { q: "How much does a giveaway cost?", a: "You pay per draw, with no subscription, and the price depends on the number of winners and the plan you choose. You see the exact amount before paying. We accept card and PIX." },
      { q: "Do I get a video of the draw to post?", a: "Yes. On plans that include video you download an MP4 of the reveal — vault, countdown, Matrix and other animations — sized for feed or Stories and ready to publish for your followers." },
      { q: "Can I draw multiple winners and backups?", a: "Yes. You choose how many winners you want and can draw backup winners in the same round, in case someone does not reply in time." },
    ],
  },
  es: {
    title: "Hacer un sorteo en Instagram · AzuraSort",
    description: "Pega el enlace de tu publicación, sortea un ganador aleatorio y recibe el vídeo de la revelación con certificado verificable.",
    h1: "Hacer un sorteo en Instagram por los comentarios",
    intro:
      "Pega el enlace de tu publicación o Reel y AzuraSort lee los comentarios, aplica tus reglas y sortea un ganador aleatorio al instante. Recibes un vídeo de la revelación listo para publicar en tu feed o en Stories y un certificado público que demuestra que el resultado no fue elegido a dedo. Sin registro y sin suscripción: pagas por sorteo y ves el precio antes.",
    faq: [
      { q: "¿Cómo hacer un sorteo en Instagram por comentarios?", a: "Pega el enlace de la publicación o Reel, elige tus reglas (mencionar a un amigo, seguir la cuenta, ignorar comentarios repetidos) y pulsa sortear. AzuraSort recoge los comentarios, baraja a los participantes en pantalla y revela al ganador al final." },
      { q: "¿El sorteo es realmente aleatorio?", a: "Sí, y se puede demostrar. Antes del sorteo publicamos un hash SHA-256 de la lista de participantes y de la semilla. Después publicamos el certificado con esos datos, así cualquiera puede verificar que el resultado no se alteró." },
      { q: "¿Cuánto cuesta hacer un sorteo?", a: "Se paga por sorteo, sin suscripción, y el precio depende del número de ganadores y del plan elegido. Ves el importe exacto antes de pagar. Aceptamos tarjeta y PIX." },
      { q: "¿Recibo un vídeo del sorteo para publicar?", a: "Sí. En los planes con vídeo descargas un MP4 de la revelación — caja fuerte, cuenta atrás, Matrix y otras animaciones — en el formato correcto para feed o Stories." },
      { q: "¿Puedo sortear varios ganadores y suplentes?", a: "Sí. Eliges cuántos ganadores quieres y puedes sortear suplentes en la misma ronda, por si alguien no responde a tiempo." },
    ],
  },
  "fr-ma": {
    title: "Faire un tirage au sort Instagram · AzuraSort",
    description: "Collez le lien de votre publication, tirez un gagnant au hasard et recevez la vidéo de révélation avec certificat vérifiable.",
    h1: "Faire un tirage au sort Instagram depuis les commentaires",
    intro:
      "Collez le lien de votre publication ou Reel et AzuraSort lit les commentaires, applique vos règles et tire un gagnant au hasard immédiatement. Vous recevez une vidéo de révélation prête à publier dans votre feed ou vos Stories, ainsi qu'un certificat public prouvant que le résultat n'a pas été choisi à la main. Sans inscription ni abonnement : vous payez par tirage et voyez le prix avant.",
    faq: [
      { q: "Comment faire un tirage au sort Instagram depuis les commentaires ?", a: "Collez le lien de la publication ou du Reel, choisissez vos règles (identifier un ami, suivre le compte, ignorer les commentaires en double) et lancez le tirage. AzuraSort collecte les commentaires, mélange les participants à l'écran et révèle le gagnant à la fin." },
      { q: "Le tirage est-il vraiment aléatoire ?", a: "Oui, et c'est prouvable. Avant le tirage nous publions un hash SHA-256 de la liste des participants et de la graine. Ensuite nous publions le certificat avec ces données, donc n'importe qui peut vérifier que le résultat n'a pas été modifié." },
      { q: "Combien coûte un tirage au sort ?", a: "Le paiement se fait par tirage, sans abonnement, et le prix dépend du nombre de gagnants et de la formule choisie. Vous voyez le montant exact avant de payer. Nous acceptons la carte et PIX." },
      { q: "Est-ce que je reçois une vidéo du tirage à publier ?", a: "Oui. Sur les formules avec vidéo vous téléchargez un MP4 de la révélation — coffre-fort, compte à rebours, Matrix et d'autres animations — au bon format pour le feed ou les Stories." },
      { q: "Puis-je tirer plusieurs gagnants et des suppléants ?", a: "Oui. Vous choisissez le nombre de gagnants et pouvez tirer des suppléants dans le même tour, si quelqu'un ne répond pas à temps." },
    ],
  },
  "ar-ma": {
    title: "إجراء سحب على إنستغرام · AzuraSort",
    description: "الصق رابط منشورك، اسحب فائزًا عشوائيًا واحصل على فيديو الكشف مع شهادة قابلة للتحقق.",
    h1: "إجراء سحب على إنستغرام من التعليقات",
    intro:
      "الصق رابط منشورك أو الـ Reel، ويقوم AzuraSort بقراءة التعليقات وتطبيق قواعدك وسحب فائز عشوائي في الحال. تحصل على فيديو للكشف جاهز للنشر في حسابك أو في الستوري، وعلى شهادة عامة تثبت أن النتيجة لم تُختَر يدويًا. بلا تسجيل وبلا اشتراك: تدفع لكل سحب وترى السعر قبل الدفع.",
    faq: [
      { q: "كيف أجري سحبًا على إنستغرام من التعليقات؟", a: "الصق رابط المنشور أو الـ Reel، اختر قواعدك (الإشارة إلى صديق، متابعة الحساب، تجاهل التعليقات المكرّرة) ثم اضغط على السحب. يجمع AzuraSort التعليقات ويخلط المشاركين على الشاشة ويكشف الفائز في النهاية." },
      { q: "هل السحب عشوائي فعلًا؟", a: "نعم، ويمكن إثبات ذلك. قبل السحب ننشر بصمة SHA-256 لقائمة المشاركين وللبذرة المستخدمة. وبعده ننشر الشهادة بهذه البيانات، فيستطيع أي شخص التحقق من أن النتيجة لم تتغيّر." },
      { q: "كم تكلفة إجراء السحب؟", a: "الدفع لكل سحب وبلا اشتراك، ويعتمد السعر على عدد الفائزين والباقة المختارة. ترى المبلغ بدقة قبل الدفع. نقبل البطاقة وPIX." },
      { q: "هل أحصل على فيديو للسحب لنشره؟", a: "نعم. في الباقات التي تتضمّن الفيديو تنزّل ملف MP4 للكشف — الخزنة، العدّ التنازلي، Matrix وغيرها — بالمقاس المناسب للحساب أو الستوري." },
      { q: "هل يمكنني سحب أكثر من فائز واحتياطيين؟", a: "نعم. تختار عدد الفائزين ويمكنك سحب احتياطيين في الجولة نفسها، تحسّبًا لعدم ردّ أحدهم في الوقت المحدّد." },
    ],
  },
};

/**
 * ⚠️ generateMetadata é OBRIGATÓRIO aqui. Um `export const metadata` sem
 * `alternates` HERDA o canonical do layout — que aponta pra HOME. Resultado: esta
 * página (a que converte) se auto-desindexava, mandando o Google consolidá-la na home.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[locale] ?? COPY.en;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}/sorteio`;
  languages["x-default"] = "/en/sorteio";
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/${locale}/sorteio`, languages },
    openGraph: {
      title: c.title,
      description: c.description,
      url: `${SITE.url}/${locale}/sorteio`,
      siteName: "AzuraSort",
      locale,
      type: "website",
    },
  };
}

export default async function SorteioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // moeda pela LOCALIZAÇÃO escolhida (/pt-br→BRL, /es→EUR, demais→USD)
  const currency = currencyForLocale(locale);
  const c = COPY[locale] ?? COPY.en;

  return (
    <main className="min-h-screen bg-canvas bg-mesh">
      <JsonLd
        data={[
          faqSchema(c.faq),
          breadcrumbSchema([
            { name: "AzuraSort", url: `${SITE.url}/${locale}` },
            { name: c.h1, url: `${SITE.url}/${locale}/sorteio` },
          ]),
        ]}
      />
      <GiveawaySimulator currency={currency} />
      <SupportNote locale={locale} />

      {/* 📄 Conteudo indexavel — fica DEPOIS da ferramenta de proposito: esta pagina
          converte, entao o app tem que ser a primeira coisa na tela. Antes daqui a
          pagina nao tinha H1 nem texto nenhum, so o simulador (JS), entao mesmo
          indexavel ela nao tinha o que ranquear. */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-4">
        <h1 className="font-display text-2xl font-bold text-ink">{c.h1}</h1>
        <p className="mt-3 text-sm leading-relaxed text-inkSoft">{c.intro}</p>
        <div className="mt-8 space-y-5">
          {c.faq.map((f) => (
            <div key={f.q}>
              <h2 className="font-display text-base font-semibold text-ink">{f.q}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-inkSoft">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
