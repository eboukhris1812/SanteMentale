export default function AProposPage() {
  return (
    <section className="animate-fade-up space-y-6">
      <header className="surface-card relative overflow-hidden rounded-3xl px-6 py-7 md:px-8 md:py-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl" />
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 md:text-sm">
          Projet éducatif
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">À propos</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Une plateforme de sensibilisation à la santé mentale conçue pour informer avec rigueur, clarté et prudence.
        </p>
      </header>

      <section className="surface-card overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
          alt="Groupe d'adolescents échangeant avec bienveillance autour de la santé mentale"
          className="h-64 w-full object-cover md:h-[420px]"
        />
        <div className="border-t border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-700">Pourquoi cette image ?</p>
          <p className="mt-1 text-sm text-slate-600">
            Elle montre une dynamique d'écoute et de soutien entre jeunes, cohérente avec l'objectif éducatif et dé-stigmatisant du site.
          </p>
        </div>
      </section>

      <article className="surface-card rounded-3xl p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <p className="text-sm leading-7 text-slate-700 md:text-base md:leading-8">
            Ce site est un projet éducatif et informatif dédié à la santé mentale des adolescents âgés de 14 à 18 ans. Il est
            né d'un constat simple : de nombreux jeunes s'interrogent sur leur état psychologique, ressentent du stress, de
            l'anxiété ou des difficultés de concentration, mais manquent d'informations claires, fiables et accessibles pour
            comprendre ce qu'ils vivent. Face à la multiplication des contenus approximatifs sur Internet et à la persistance
            de certaines idées reçues, il devient essentiel de proposer une plateforme structurée, fondée sur des sources
            scientifiques reconnues et inspirée des recommandations d'organismes internationaux tels que l'Organisation mondiale
            de la santé.
          </p>

          <p className="text-sm leading-7 text-slate-700 md:text-base md:leading-8">
            L'objectif de ce site n'est pas de poser un diagnostic médical, mais d'offrir un espace sécurisé permettant aux
            adolescents de mieux comprendre leurs émotions, d'explorer des informations vulgarisées sur différents troubles
            psychologiques et de réaliser des bilans d'orientation basés sur des questionnaires validés scientifiquement. Chaque
            contenu est présenté de manière pédagogique, prudente et éthique, afin de sensibiliser sans inquiéter et d'informer
            sans remplacer l'avis d'un professionnel de santé. À travers cette démarche, le site vise à contribuer à la
            dé-stigmatisation des troubles mentaux, à encourager la prévention et à favoriser une culture de compréhension,
            d'écoute et de bienveillance envers soi-même et les autres.
          </p>
        </div>
      </article>
    </section>
  );
}
