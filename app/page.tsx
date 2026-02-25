import Link from "next/link";

const objectifs = [
  "Fournir des informations fiables et scientifiquement fondées",
  "Permettre une auto-évaluation prudente et non diagnostique",
  "Orienter vers des ressources adaptées",
  "Encourager la consultation d'un professionnel lorsque nécessaire",
];

export default function HomePage() {
  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      <section className="surface-card animate-fade-up relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 md:text-sm">
              Plateforme éducative de santé mentale (14-18 ans)
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Comprendre la santé mentale des adolescents avec des repères fiables
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700 md:text-base">
              Longtemps négligée, la santé mentale est désormais reconnue comme une composante essentielle du bien-être global,
              au même titre que la santé physique. Selon l'Organisation mondiale de la santé, elle ne se limite pas à l'absence
              de trouble, mais correspond à un état de bien-être permettant à chacun de réaliser son potentiel, de faire face aux
              difficultés de la vie et de contribuer à la société.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/bilan-global"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-700 md:text-base"
              >
                Commencer le bilan
              </Link>
              <Link
                href="/a-propos"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50 md:text-base"
              >
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Main visible hero image requested as primary content (not background). */}
          <figure className="animate-fade-up delay-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1600&q=80"
              alt="Adolescent pensif en contexte scolaire, illustrant les enjeux de santé mentale chez les jeunes"
              className="h-64 w-full object-cover md:h-80"
            />
            <figcaption className="border-t border-slate-200 bg-white p-3 text-sm text-slate-600">
              Une image réaliste du quotidien adolescent pour favoriser l'identification et la compréhension.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="animate-fade-up delay-100 relative overflow-hidden rounded-2xl border-2 border-red-300 bg-red-50 px-6 py-5 shadow-[0_14px_34px_rgba(127,29,29,0.18)] md:px-8 md:py-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-200/80 blur-2xl" />
        <div className="relative">
          <p className="inline-flex rounded-full border border-red-300 bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-800">
            Important
          </p>
          <details open className="group mt-2">
            <summary className="cursor-pointer list-none text-xl font-semibold tracking-tight text-red-950 md:text-2xl">
              Avertissement éthique
            </summary>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-red-900 md:text-base">
              Les contenus et bilans proposés ici ont une finalité éducative et informative. Ils ne remplacent pas un diagnostic
              médical ni une prise en charge clinique. En cas de mal-être important ou de risque immédiat, contacte sans délai
              un adulte de confiance et les services d'urgence de ton pays.
            </p>
          </details>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="surface-card animate-fade-up delay-100 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Contexte et évolution des connaissances
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
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
        </article>

        <article className="surface-card animate-fade-up delay-200 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Pourquoi ce site existe</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
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
            <p>Ce site a pour objectif de proposer un espace éducatif, structuré et sécurisé destiné aux adolescents.</p>
          </div>
        </article>
      </section>

      <section className="surface-card animate-fade-up delay-300 rounded-3xl p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">Engagements de la plateforme</h2>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            Approche éducative
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {objectifs.map((objectif) => (
            <article
              key={objectif}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-sm"
            >
              <p className="text-sm font-medium leading-6 text-slate-800 md:text-base">{objectif}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
