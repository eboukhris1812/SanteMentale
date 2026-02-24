import Link from "next/link";

const objectifs = [
  "Fournir des informations fiables et scientifiquement fondées",
  "Permettre une auto-évaluation prudente et non diagnostique",
  "Orienter vers des ressources adaptées",
  "Encourager la consultation d'un professionnel lorsque nécessaire",
];

export default function HomePage() {
  return (
    <div className="space-y-10 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 text-white px-6 py-14 md:px-12 md:py-20 shadow-xl">
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative max-w-4xl">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs md:text-sm font-medium tracking-wide">
            Plateforme éducative de santé mentale (14-18 ans)
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight text-justify">
            Comprendre la santé mentale des adolescents avec des repères fiables
          </h1>
          <p className="mt-5 text-base md:text-lg text-blue-100 max-w-3xl leading-7 text-justify">
            Longtemps négligée, la santé mentale est désormais reconnue comme une composante essentielle du bien-être global,
            au même titre que la santé physique. Selon l'Organisation mondiale de la santé, elle ne se limite pas à l'absence
            de trouble, mais correspond à un état de bien-être permettant à chacun de réaliser son potentiel, de faire face aux
            difficultés de la vie et de contribuer à la société.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/bilan-global"
              className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 transition"
            >
              Commencer le bilan
            </Link>
            <Link
              href="/a-propos"
              className="rounded-lg border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20 transition"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto rounded-2xl bg-white p-6 md:p-10 shadow-sm border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Contexte et évolution des connaissances</h2>
        <div className="space-y-4 text-gray-700 leading-8 text-justify">
          <p>
            Au cours des dernières décennies, la perception des troubles psychologiques a profondément évolué. Autrefois
            stigmatisés, souvent ignorés ou mal compris, ils font aujourd'hui l'objet d'une reconnaissance scientifique et
            sociale croissante. Les avancées en psychologie et en neurosciences ont permis une meilleure compréhension de
            troubles tels que l'anxiété, la dépression, les troubles obsessionnels ou les troubles du spectre de l'autisme.
          </p>
          <p>
            À l'ère du numérique, des réseaux sociaux et de la pression académique accrue, les adolescents font face à de
            nouveaux défis psychologiques. L'isolement social, la comparaison permanente et l'incertitude face à l'avenir
            contribuent à une augmentation significative des symptômes anxieux et dépressifs chez les jeunes.
          </p>
          <p>
            Cependant, malgré une meilleure sensibilisation, de nombreux adolescents hésitent encore à consulter un
            professionnel. Le manque d'information fiable, la peur du jugement et la difficulté à identifier ses propres
            symptômes constituent des obstacles majeurs.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto rounded-2xl bg-white p-6 md:p-10 shadow-sm border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Pourquoi ce site existe</h2>
        <div className="space-y-4 text-gray-700 leading-8 text-justify">
          <p>
            Aujourd'hui, parler de santé mentale n'est plus un tabou. Les campagnes de sensibilisation internationales, les
            initiatives éducatives et la diffusion d'informations scientifiques ont permis de normaliser ces discussions.
            La prévention et l'éducation jouent désormais un rôle central : comprendre ses émotions, reconnaître des signaux
            d'alerte et savoir quand demander de l'aide sont devenus des compétences essentielles.
          </p>
          <p>
            La santé mentale n'est plus uniquement une question médicale : elle est devenue un enjeu éducatif, social et
            sociétal.
          </p>
          <p>
            Ce site a pour objectif de proposer un espace éducatif, structuré et sécurisé destiné aux adolescents.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {objectifs.map((objectif) => (
            <article key={objectif} className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-sm md:text-base text-blue-900 font-medium leading-7">{objectif}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-2">Avertissement éthique</h2>
        <p className="text-amber-900 leading-7 text-justify">
          Les contenus et bilans proposés ici ont une finalité éducative et informative. Ils ne remplacent pas un diagnostic
          médical ni une prise en charge clinique. En cas de mal-être important ou de risque immédiat, contacte sans délai
          un adulte de confiance et les services d'urgence de ton pays.
        </p>
      </section>
    </div>
  );
}
