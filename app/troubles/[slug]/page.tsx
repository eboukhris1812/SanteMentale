import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getTroubleBySlug, troubles } from "@/lib/content/mentalHealthCatalog";

type TroubleVisual = {
  imageUrl: string;
  alt: string;
  rationale: string;
};

const visualsBySlug: Record<string, TroubleVisual> = {
  "trouble-anxieux-generalise": {
    imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent stresse en contexte scolaire, regard inquiet",
    rationale: "L'image montre une anxiété fonctionnelle du quotidien, facilement identifiable par les jeunes.",
  },
  "dépression-majeure": {
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune assis seul avec posture repliee, ambiance realiste d'isolement",
    rationale: "Le visuel reflete l'isolement et la perte d'elan sans dramatisation excessive.",
  },
  toc: {
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent verifiant à répétition son materiel scolaire",
    rationale: "La répétition comportementale est visible et relie la fiche à des situations concretes.",
  },
  "phobie-sociale": {
    imageUrl: "https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en retrait pendant une interaction de groupe",
    rationale: "Le contraste entre groupe et retrait aide à comprendre la peur du jugement social.",
  },
  "anorexie-mentale": {
    imageUrl: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescente en reflexion face à un repas",
    rationale: "L'image recentre le trouble sur le vecu alimentaire quotidien de facon bienveillante.",
  },
  boulimie: {
    imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune devant une table de nourriture avec expression de tension emotionnelle",
    rationale: "Le visuel evoque la perte de contrôle alimentaire et la charge emotionnelle associée.",
  },
  tdah: {
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
    alt: "Eleve distrait en classe avec difficulté de concentration",
    rationale: "Le contexte scolaire facilite la comprehension des symptômes d'inattention.",
  },
  tsa: {
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en interaction guidee, illustrant les enjeux de communication sociale",
    rationale: "L'image soutient une lecture non stigmatisante des particularites sociales.",
  },
};

const visualsByCategory: Record<string, TroubleVisual> = {
  "troubles-anxieux": {
    imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en situation de stress scolaire",
    rationale: "Image realiste d'anxiété en contexte adolescent.",
  },
  "troubles-humeur": {
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune isole avec posture fermee",
    rationale: "Representation claire des difficultés thymiques.",
  },
  "troubles-traumatisme-stress": {
    imageUrl: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en etat d'hypervigilance emotionnelle",
    rationale: "Le visuel evoque le vecu post-evenement stressant.",
  },
  "troubles-personnalite": {
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeunes en interaction sociale avec emotions contrastees",
    rationale: "Pertinent pour les enjeux relationnels et emotionnels.",
  },
  "troubles-conduites-alimentaires": {
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent face à l'alimentation et à l'image corporelle",
    rationale: "Permet une representation contextualisee et non caricaturale.",
  },
  "troubles-neurodeveloppementaux": {
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    alt: "Eleve necessitant des adaptations attentionnelles en classe",
    rationale: "Montre les difficultés dans des environnements concrets.",
  },
};

function getVisual(slug: string, categorySlug: string): TroubleVisual {
  return (
    visualsBySlug[slug] ??
    visualsByCategory[categorySlug] ?? {
      imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
      alt: "Adolescent en reflexion emotionnelle",
      rationale: "Image générale de santé mentale adaptée au public adolescent.",
    }
  );
}

export function generateStaticParams() {
  return troubles.map((trouble) => ({ slug: trouble.slug }));
}

function testStatusLabel(status: "implemented" | "adapted" | "planned" | "undefined") {
  if (status === "implemented") return "Implémente";
  if (status === "adapted") return "Implémentation adaptée";
  if (status === "planned") return "À venir";
  return "À définir";
}

export default async function TroubleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trouble = getTroubleBySlug(slug);
  if (!trouble) {
    notFound();
  }

  const category = getCategoryBySlug(trouble.categorySlug);
  const visual = getVisual(trouble.slug, trouble.categorySlug);
  const isTspt = trouble.slug === "tspt";
  const isStressAigu = trouble.slug === "stress-aigu";
  const isAttachementReactionnel = trouble.slug === "attachement-reactionnel";
  const isPersonnaliteParanoiaque = trouble.slug === "personnalite-paranoiaque";
  const isPersonnaliteAntisociale = trouble.slug === "personnalite-antisociale";
  const isPersonnaliteEvitante = trouble.slug === "personnalite-evitante";
  const isPersonnaliteDependante = trouble.slug === "personnalite-dependante";
  const isAnorexieMentale = trouble.slug === "anorexie-mentale";
  const isBoulimieMentale = trouble.slug === "boulimie";
  const isHyperphagieBoulimique = trouble.slug === "hyperphagie-boulimique";
  const isTdah = trouble.slug === "tdah";
  const isTsa = trouble.slug === "tsa";
  const isGillesTourette = trouble.slug === "gilles-tourette";
  const isBipolaireTypeIOrII = trouble.slug === "bipolaire-type-1" || trouble.slug === "bipolaire-type-2";
  const isTroublesDepressifs = trouble.slug === "dépression-majeure";
  const isTroublePanique = trouble.slug === "trouble-panique";
  const isAgoraphobie = trouble.slug === "agoraphobie";
  const isPhobieSociale = trouble.slug === "phobie-sociale";
  const isTag = trouble.slug === "trouble-anxieux-generalise";
  const isPhobiesSpecifiques = trouble.slug === "phobies-spécifiques";

  return (
    <div className="space-y-6">
      <header className="surface-card rounded-3xl p-6 md:p-8">
        <p className="text-sm text-slate-500">Catégorie: {category?.name ?? "Non classé"}</p>
        <h1 className="mt-1 text-3xl font-bold">{trouble.name}</h1>
      </header>

      <section className="surface-card overflow-hidden rounded-3xl">
        <img src={visual.imageUrl} alt={visual.alt} className="h-64 w-full object-cover md:h-[420px]" />
        <div className="border-t border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-700">Pourquoi cette image ?</p>
          <p className="mt-1 text-sm text-slate-600">{visual.rationale}</p>
        </div>
      </section>

      {isTspt ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de stress post-traumatique (TSPT) est un trouble anxieux caractérisé par des réactions intenses et
              invalidantes après un événement traumatisant. Il survient à la suite d'une exposition directe ou indirecte à une
              menace de mort, une blessure grave ou une violence. Le TSPT affecte environ 9 % des personnes au cours de leur vie
              et 4 % chaque année. Il peut apparaître immédiatement après le traumatisme ou plusieurs mois plus tard.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Symptômes d'intrusion</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Souvenirs involontaires et envahissants</li>
                  <li>Cauchemars récurrents</li>
                  <li>Flashbacks (reviviscence de l'événement)</li>
                  <li>Réactions intenses aux rappels du traumatisme</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Symptômes d'évitement</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Évitement des lieux, personnes ou situations liés au traumatisme</li>
                  <li>Refus de penser ou de parler de l'événement</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Effets négatifs sur les pensées et l'humeur</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Amnésie dissociative</li>
                  <li>Sentiment de culpabilité ou de honte</li>
                  <li>Dépression et perte d'intérêt</li>
                  <li>Difficulté à ressentir des émotions positives</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Altération de la vigilance et des réactions</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Hypervigilance</li>
                  <li>Réactions de sursaut exagérées</li>
                  <li>Irritabilité, accès de colère</li>
                  <li>Troubles du sommeil et de la concentration</li>
                </ul>
              </article>
            </div>

            <article className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">Autres manifestations</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>Comportements compulsifs (ex. bains répétés après une agression)</li>
                <li>Usage de substances pour soulager les symptômes</li>
                <li>Sous-type dissociatif : dépersonnalisation et déréalisation</li>
              </ul>
            </article>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Examen clinique et critères DSM-5-TR</li>
              <li>Symptômes présents pendant au moins 1 mois</li>
              <li>Souffrance significative ou altération du fonctionnement</li>
              <li>Présence de symptômes dans chacune des quatre catégories</li>
              <li>Exclusion d'autres causes (substances, pathologies médicales, autres troubles psychiatriques)</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Sous-type dissociatif : ajout de dépersonnalisation et/ou déréalisation.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Soins auto-administrés</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Assurer la sécurité personnelle</li>
                  <li>Maintenir une bonne hygiène de vie (sommeil, alimentation, activité physique)</li>
                  <li>Pratiquer la pleine conscience et des activités apaisantes</li>
                  <li>Favoriser les interactions sociales et communautaires</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie cognitivo-comportementale axée sur le traumatisme</li>
                  <li>Thérapie d'exposition graduelle aux souvenirs traumatiques</li>
                  <li>EMDR (désensibilisation par mouvements oculaires)</li>
                  <li>Thérapies de soutien et psychodynamiques</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ISRS (antidépresseurs de première intention)</li>
                  <li>Antipsychotiques en cas de symptômes psychotiques</li>
                  <li>Stabilisateurs de l'humeur pour l'impulsivité</li>
                  <li>Prazosine pour les cauchemars</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Évolution variable : amélioration spontanée possible, mais risque de chronicité</li>
              <li>Pronostic amélioré par une prise en charge précoce et adaptée</li>
              <li>Importance du suivi régulier et du soutien familial</li>
              <li>Risque de comorbidités : dépression, troubles anxieux, abus de substances</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le TSPT est un trouble anxieux sévère qui peut altérer durablement la vie sociale, professionnelle et personnelle.
              Une prise en charge multimodale, associant psychothérapie, pharmacothérapie et soutien social, permet de réduire
              les symptômes et d'améliorer la qualité de vie des patients.
            </p>
          </section>
        </>
      ) : isStressAigu ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de stress aigu est une réaction intense et invalidante qui survient immédiatement après un événement
              traumatisant accablant. Il se caractérisé par des symptômes anxieux, dissociatifs et de reviviscence qui apparaissent
              dans le mois suivant l'exposition. Sa durée est limitée à moins d'un mois. Si les symptômes persistent au-delà, le
              diagnostic évolue vers un trouble de stress post-traumatique (TSPT).
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <p className="text-slate-700">
              Les personnes atteintes présentent généralement :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Souvenirs récurrents et intrusifs de l'événement</li>
              <li>Cauchemars pénibles</li>
              <li>Flashbacks</li>
              <li>Souffrance psychologique ou physique intense en lien avec les rappels du traumatisme</li>
              <li>Incapacité à ressentir des émotions positives</li>
              <li>Sens altéré de la réalité (déréalisation, hébétude)</li>
              <li>Amnésie concernant une partie de l'événement</li>
              <li>Évitement des pensées, souvenirs ou situations associées</li>
              <li>Troubles du sommeil</li>
              <li>Irritabilité ou accès de colère</li>
              <li>Hypervigilance</li>
              <li>Difficultés de concentration</li>
              <li>Réactions de sursaut exagérées</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Les symptômes doivent être présents entre 3 jours et 1 mois et provoquer une souffrance significative ou une
              altération du fonctionnement.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Examen clinique et critères DSM-5-TR</li>
              <li>Exposition directe ou indirecte à un événement traumatisant</li>
              <li>Présence d'au moins 9 symptômes parmi les catégories listées</li>
              <li>Exclusion d'autres causes (substances, pathologies médicales, autres troubles psychiatriques)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Soins auto-administrés</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Assurer la sécurité personnelle</li>
                  <li>Maintenir une bonne hygiène de vie (sommeil, alimentation, activité physique)</li>
                  <li>Pratiquer la pleine conscience et des activités apaisantes</li>
                  <li>Favoriser les interactions sociales et communautaires</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Thérapie cognitivo-comportementale (TCC) : traitement des souvenirs traumatiques, correction des pensées inadaptées
                  </li>
                  <li>Psychoéducation pour comprendre la réaction au stress</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Médicaments utilisés de façon temporaire pour soulager l'anxiété ou l'insomnie</li>
                  <li>Antidépresseurs uniquement en cas de trouble concomitant</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Évolution généralement favorable avec disparition des symptômes en quelques semaines</li>
              <li>Risque de progression vers un TSPT si les symptômes persistent plus d'un mois</li>
              <li>Importance du soutien familial et social</li>
              <li>Suivi médical recommandé pour prévenir les complications</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de stress aigu est une réaction transitoire mais invalidante à un traumatisme. Une prise en charge adaptée,
              combinant soins de support, psychothérapie et parfois pharmacothérapie, permet de réduire les symptômes et de prévenir
              l'évolution vers un TSPT.
            </p>
          </section>
        </>
      ) : isAttachementReactionnel ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble reactionnel de l'attachement (TRA) est un trouble de l'enfance caractérisé par une incapacite à établir
              des liens affectifs securisants avec les figures de soins. Il survient généralement entre 9 mois et 5 ans, souvent
              à la suite de négligence, de maltraitance ou d'un environnement instable. Les enfants concernés présentent des
              difficultés emotionnelles et relationnelles importantes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Etiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Négligence ou maltraitance précoce</li>
              <li>Absence de soins stables et coherents</li>
              <li>Changements répétés de donneurs de soins</li>
              <li>Environnements inhabituels limitant l'etablissement d'attachements sélectifs</li>
              <li>Facteurs de risque : troubles de santé mentale parentaux, pauvrete, adoption, traumatismes familiaux</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Retrait emotionnel et social</li>
              <li>Absence de recherche de reconfort en cas de detresse</li>
              <li>Reponse limitee au reconfort</li>
              <li>Affects positifs restreints</li>
              <li>Irritabilité, tristesse ou peur inexpliquées</li>
              <li>Évitement du contact visuel ou physique</li>
              <li>Preference affective envers des etrangers plutot qu'envers les proches</li>
              <li>Difficultés dans les jeux interactifs</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Selon le DSM-5-TR, le diagnostic repose sur :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Mode relationnel durable caractérisé par un comportement inhibe et un retrait emotionnel</li>
              <li>Perturbation sociale et emotionnelle persistante</li>
              <li>Symptômes présents avant l'age de 5 ans</li>
              <li>Exclusion d'autres troubles psychiatriques ou causes médicales</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Un diagnostic précoce est essentiel pour prévenir les complications à long terme.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prevention</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Interaction réguliere et de qualité avec l'enfant</li>
              <li>Comprehension des signaux verbaux et non verbaux</li>
              <li>Réponses adaptées aux besoins de l'enfant</li>
              <li>Développement d'un environnement stable et securisant</li>
              <li>Encouragement des interactions affectives et sociales</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie individuelle centrée sur l'enfant</li>
                  <li>Thérapie familiale pour renforcer les liens parent-enfant</li>
                  <li>Interventions en compétences sociales</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Approches complémentaires</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Psychoeducation des parents et des soignants</li>
                  <li>Programmes spécialisés (Child-Parent Psychotherapy, Attachment Behavioral Catch-up, Cercle de securite parentale)</li>
                  <li>Soutien social et communautaire</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sans traitement, risque de troubles anxieux, dépressifs, comportements antisociaux ou abus de substances</li>
              <li>Avec une intervention précoce, amélioration significative des capacités relationnelles et emotionnelles</li>
              <li>Importance du suivi régulier et du soutien parental</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble reactionnel de l'attachement est une pathologie grave de l'enfance qui compromet le développement affectif
              et social. Une prise en charge précoce et adaptée, centrée sur la relation parent-enfant et le renforcement des
              capacités de soins, permet d'améliorer le pronostic et de favoriser un développement harmonieux.
            </p>
          </section>
        </>
      ) : isPersonnaliteParanoiaque ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite paranoide est un trouble psychiatrique caractérisé par une mefiance et une suspicion
              omnipresentes et injustifiees envers les autres. Les personnes atteintes interpretent les intentions d'autrui comme
              malveillantes, ce qui entraîne une souffrance importante et des difficultés relationnelles. La prévalence est estimée
              entre 3 et 5 % de la population, avec une fréquence plus élevée chez les hommes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Soupcons persistants d'etre exploité, trompé ou menace</li>
              <li>Hypervigilance face aux insultes, affronts ou menaces</li>
              <li>Interpretation hostile des remarques ou comportements neutres</li>
              <li>Rancune tenace et tendance à contre-attaquer</li>
              <li>Mefiance excessive, besoin d'autonomie et de contrôle</li>
              <li>Difficultés à se confier ou à établir des relations proches</li>
              <li>Doutes injustifiés sur la fidélité des amis ou du conjoint</li>
              <li>Jalousie excessive et comportements possessifs</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les critères du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Mefiance et suspicion persistantes envers les autres</li>
              <li>
                Présence d'au moins 4 manifestations typiques (soupçons injustifiés, réticence à se confier, rancune tenace,
                interpretation hostile, etc.)
              </li>
              <li>Début des symptômes au début de l'age adulte</li>
            </ul>
            <p className="mt-3 text-slate-700">Diagnostic différentiel :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble de la personnalite schizoide (detachement social)</li>
              <li>Trouble de la personnalite schizotypique (pensées et comportements excentriques)</li>
              <li>Trouble borderline (dependance et instabilité relationnelle)</li>
              <li>Trouble narcissique (grandiosite)</li>
              <li>Trouble antisocial (exploitation d'autrui)</li>
              <li>Troubles psychotiques (schizophrenie, trouble delirant)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie cognitivo-comportementale (TCC) : identification et correction des pensées paranoïaques</li>
                  <li>Psychoeducation et accompagnement relationnel</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs pour les symptômes anxieux ou dépressifs</li>
                  <li>Antipsychotiques atypiques (seconde generation) pour réduire l'anxiété et la paranoia</li>
                </ul>
              </article>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Le traitement est souvent difficile en raison de la mefiance generalisee des patients. L'etablissement d'une alliance
              thérapeutique est essentiel.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>
                Trouble chronique, rarement isole (comorbidités fréquentes : schizophrenie, phobie sociale, TSPT, troubles de la
                personnalite)
              </li>
              <li>Pronostic dependant de la precocite du diagnostic et de l'adhesion au traitement</li>
              <li>Importance du suivi régulier et du soutien psychologique</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite paranoide est une pathologie invalidante qui affecte profondément les relations
              sociales et familiales. Bien qu'aucun traitement curatif n'existe, une prise en charge adaptée, centrée sur la
              psychothérapie et parfois associée à une pharmacothérapie, peut réduire les symptômes et améliorer la qualité de vie
              des patients.
            </p>
          </section>
        </>
      ) : isPersonnaliteAntisociale ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite antisociale est une affection psychiatrique caracterisee par un mepris persistant des
              droits d'autrui et des normes sociales. Les personnes atteintes adoptent des comportements impulsifs, manipulateurs
              et souvent illégaux, sans éprouver de remords. La prévalence est estimée entre 2 et 6 % dans la population, avec une
              fréquence trois fois plus élevée chez les hommes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs génétiques : risque accru chez les apparentes au premier degré</li>
              <li>Facteurs environnementaux : maltraitance, négligence, discipline incoherente durant l'enfance</li>
              <li>Antecedents de troubles des conduites et de TDAH avant 10 ans</li>
              <li>Mepris précoce de la douleur des autres associé à un comportement antisocial ultérieur</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Mepris des autres</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Exploitation, escroquerie, manipulation pour obtenir argent, pouvoir ou gratification</li>
                  <li>Actes illégaux (vol, destruction de biens, harcèlement)</li>
                  <li>Absence de remords ou rationalisation des comportements</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Impulsivite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulté à anticiper les conséquences</li>
                  <li>Changements soudains de relations, emploi ou domicile</li>
                  <li>Conduite dangereuse, abus de substances</li>
                  <li>Agressivite et bagarres fréquentes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Irresponsabilite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Abandon d'emplois sans planification</li>
                  <li>Non-paiement des factures ou des dettes</li>
                  <li>Négligence des obligations familiales (pension alimentaire)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Autres manifestations</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Optimisme excessif, arrogance</li>
                  <li>Charme superficiel et manipulation persuasive</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les critères du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Mepris constant des droits d'autrui</li>
              <li>
                Présence d'au moins 3 critères : actes illégaux répétés, malhonnêteté, impulsivité, agressivité,
                irresponsabilite, absence de remords
              </li>
              <li>Diagnostic posé uniquement chez les personnes de 18 ans ou plus</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic différentiel : troubles liés à l'abus de substances, trouble borderline, trouble du contrôle des
              impulsions.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Gestion des contingences : recompenses pour comportements positifs</li>
                  <li>Approches comportementales ciblees</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Stabilisateurs de l'humeur (lithium, anticonvulsivants)</li>
                  <li>ISRS pour réduire l'impulsivité et l'agressivité</li>
                </ul>
              </article>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Limites : difficulté de prise en charge en raison du manque de remords et de coopération; certaines psychothérapies
              (comme la TCC classique) peuvent etre inefficaces ou contre-productives.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble chronique, souvent associé à des comorbidités (abus de substances, TDAH, borderline)</li>
              <li>Esperance de vie reduite en raison des comportements à risque</li>
              <li>Pronostic dependant d'une intervention précoce sur les troubles des conduites chez l'enfant</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite antisociale est une pathologie sévère, marquée par un mepris des droits d'autrui et
              une impulsivité chronique. Bien que difficile à traiter, une prise en charge adaptée, centrée sur la gestion des
              comportements et parfois associée à une pharmacothérapie, peut réduire l'agressivité et améliorer la stabilité
              sociale.
            </p>
          </section>
        </>
      ) : isPersonnaliteEvitante ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite evitante est une affection psychiatrique caracterisee par une peur intense du rejet,
              de la critique ou de l'humiliation. Les personnes atteintes evitent les situations sociales ou professionnelles ou
              elles pourraient etre jugées négativement. Ce trouble touche environ 2 % de la population générale et est légèrement
              plus fréquent chez les femmes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs génétiques : prédisposition à l'anxiété sociale</li>
              <li>Facteurs environnementaux : rejet ou marginalisation durant l'enfance</li>
              <li>Évitement social observe des l'age de 2 ans</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Peur du rejet</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Refus de promotions ou d'opportunités professionnelles par crainte de critiques</li>
                  <li>Évitement des réunions ou des nouvelles relations</li>
                  <li>Besoin d'assurances repetees de soutien avant d'integrer un groupe</li>
                  <li>Réticence à parler de soi par peur d'etre ridiculisé</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Sensibilité extrême à la critique</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Hypervigilance aux signes de desapprobation</li>
                  <li>Apparence tendue et anxieuse, renforcant les moqueries et insecurites</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Autres manifestations</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Faible confiance en soi et sentiment d'inferiorite</li>
                  <li>Inhibition dans les nouvelles situations sociales</li>
                  <li>Isolement social malgre un desir d'interactions</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les critères du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Évitement des activités impliquant des relations personnelles par peur du rejet</li>
              <li>Refus de s'engager dans des relations sans certitude d'etre apprécié</li>
              <li>Reserves dans les relations proches par peur d'humiliation</li>
              <li>Inquiétude constante d'être critiqué</li>
              <li>Inhibition dans les nouvelles situations sociales</li>
              <li>Sentiment d'inferiorite et d'incompetence sociale</li>
              <li>Refus de prendre des risques ou de participer à de nouvelles activités</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Les symptômes doivent apparaitre au début de l'age adulte.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie cognitivo-comportementale (TCC) axee sur les compétences sociales</li>
                  <li>Thérapies de groupe adaptées aux personnes presentant les mêmes difficultés</li>
                  <li>Psychothérapie psychodynamique pour explorer les conflits sous-jacents</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs (ISRS) pour réduire l'anxiété</li>
                  <li>Anxiolytiques pour faciliter l'exposition aux situations sociales</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble chronique mais ameliorable avec une prise en charge adaptée</li>
              <li>Pronostic favorable avec psychothérapie et soutien médicamenteux</li>
              <li>Importance du suivi régulier et de l'accompagnement social</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite evitante est marque par une peur persistante du rejet et une hypersensibilité à la
              critique. Bien qu'il entraîne isolement et souffrance, une prise en charge combinant psychothérapie et
              pharmacothérapie peut améliorer les compétences sociales et la qualité de vie des patients.
            </p>
          </section>
        </>
      ) : isPersonnaliteDependante ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite dependante est une affection psychiatrique caracterisee par un besoin excessif et
              persistant d'etre pris en charge. Les personnes atteintes adoptent des comportements soumis et "collants", craignant
              de ne pas pouvoir s'occuper d'elles-mêmes. Ce trouble touche moins de 1 % de la population générale et est
              diagnostiqué plus souvent chez les femmes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs culturels favorisant la soumission et la dependance</li>
              <li>Experiences negatives précoces (négligence, rejet, traumatismes)</li>
              <li>Tendance innée à l'anxiété</li>
              <li>Traits hereditaires : insecurite, effacement de soi</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Besoin d'etre pris en charge</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulté à prendre des decisions sans conseils ou réassurance</li>
                  <li>Dependance excessive envers une personne pour les responsabilités quotidiennes</li>
                  <li>Recherche immédiate d'un nouveau soutien apres la fin d'une relation</li>
                  <li>Peur intense d'etre abandonné</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Soumission excessive</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulté à exprimer un désaccord par peur de perdre du soutien</li>
                  <li>Acceptation de tâches désagréables ou de comportements abusifs pour conserver l'aide d'autrui</li>
                  <li>Malaise ou peur extrême lorsqu'elles sont seules</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Manque de confiance en soi</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Devalorisation de leurs capacités</li>
                  <li>Interpretation des critiques comme preuve d'incompetence</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Manque d'indépendance</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulté à initier des projets ou à travailler de manière autonome</li>
                  <li>Évitement des responsabilités</li>
                  <li>Fonctionnement correct uniquement sous supervision</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les critères du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Besoin excessif d'etre pris en charge</li>
              <li>
                Présence d'au moins 5 manifestations typiques (difficulté à prendre des decisions, peur de l'abandon,
                soumission excessive, etc.)
              </li>
              <li>Apparition des symptômes au début de l'age adulte</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie cognitivo-comportementale : travail sur la peur de l'indépendance et l'affirmation de soi</li>
                  <li>Psychothérapie psychodynamique : exploration des conflits sous-jacents</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs (ISRS) parfois utilisés pour traiter anxiété ou dépression associées</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble chronique, mais ameliorable avec une prise en charge adaptée</li>
              <li>Risque de dependance relationnelle persistante</li>
              <li>Pronostic favorable avec psychothérapie et soutien régulier</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite dependante est marque par une soumission excessive et une peur constante de l'abandon.
              Bien qu'il entraîne une souffrance relationnelle et sociale, une prise en charge précoce et adaptée, centrée sur la
              psychothérapie, peut améliorer l'autonomie et la qualité de vie des patients.
            </p>
          </section>
        </>
      ) : isAnorexieMentale ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              L'anorexie mentale est un trouble des conduites alimentaires caractérisé par une peur intense de l'obésité, une
              recherche obsessionnelle de minceur et une perception deformee de l'image corporelle. Elle entraîne une restriction
              alimentaire sévère et un poids corporel significativement bas. La prévalence est estimée à 1,5 % chez les femmes et
              0,1 % chez les hommes, avec un début typique à l'adolescence.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Facteurs de risque</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sexe feminin</li>
              <li>Normes culturelles valorisant la minceur</li>
              <li>Activites centrées sur le poids (gymnastique, ballet)</li>
              <li>Traits de personnalite perfectionnistes et compulsifs</li>
              <li>Antecedents familiaux et prédisposition génétique</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Restriction alimentaire persistante</li>
              <li>Peur intense de prendre du poids</li>
              <li>Image corporelle distordue</li>
              <li>Preoccupation excessive pour la nourriture (comptage des calories, preparation de repas pour autrui)</li>
              <li>Vomissements provoqués, usage de laxatifs ou diurétiques</li>
              <li>Activite physique excessive</li>
              <li>Amenorrhee chez les femmes</li>
              <li>Signes cliniques : bradycardie, hypotension, hypothermie, lanugo, osteoporose</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Complications</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Troubles endocriniens (hypogonadisme, anomalies thyroidiennes, hypercortisolisme)</li>
              <li>Desordres electrolytiques (hypokaliemie, hyponatremie)</li>
              <li>Anemie, thrombocytopenie</li>
              <li>Osteoporose</li>
              <li>Complications cardiaques (bradycardie, QT long, tachyarythmies)</li>
              <li>Risque de mort subite</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Criteres DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Restriction alimentaire entraînant un poids tres faible</li>
              <li>Peur intense de prendre du poids</li>
              <li>Perturbation de l'image corporelle ou déni de la gravité de la maladie</li>
            </ul>
            <p className="mt-3 text-slate-700">Outils diagnostiques :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>IMC inferieur à 17 kg/m2 chez l'adulte</li>
              <li>Percentiles de croissance chez l'enfant/adolescent</li>
              <li>Examens complémentaires : bilan biologique, ECG</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Supplementation nutritionnelle</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Renutrition progressive (30-40 kcal/kg/jour)</li>
                  <li>Surveillance des complications (syndrome de renutrition)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie cognitivo-comportementale (TCC)</li>
                  <li>Thérapie familiale (modele Maudsley chez les adolescents)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Olanzapine parfois utilisee pour favoriser la prise de poids</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Suivi multidisciplinaire</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Implication de nutritionnistes, psychiatres et famille</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Taux de mortalite élevé (5,1/1000 personnes-annees)</li>
              <li>50 % des patients recuperent complètement</li>
              <li>25 % présentent des resultats intermediaires</li>
              <li>25 % evoluent defavorablement avec rechutes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              L'anorexie mentale est un trouble grave et potentiellement mortel. Une prise en charge précoce et
              multidisciplinaire, centrée sur la renutrition et la psychothérapie, améliore le pronostic et favorise la
              récupération. L'implication familiale est cruciale, notamment chez les adolescents.
            </p>
          </section>
        </>
      ) : isBoulimieMentale ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              La boulimie mentale est un trouble des conduites alimentaires caractérisé par des episodes répétés de frenesie
              alimentaire suivis de comportements compensatoires (vomissements provoqués, laxatifs, jeûne ou exercice excessif).
              Elle touche principalement les adolescents et jeunes adultes, avec une prévalence estimée à 0,5 % de la population,
              plus fréquente chez les femmes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Facteurs de risque</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sexe feminin</li>
              <li>Normes culturelles valorisant la minceur</li>
              <li>Activites centrées sur la silhouette (gymnastique, danse, ballet)</li>
              <li>Antecedents familiaux de troubles alimentaires</li>
              <li>Traits de personnalite impulsifs et perfectionnistes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Frenesie alimentaire</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Consommation rapide de grandes quantites de nourriture</li>
                  <li>Sentiment de perte de contrôle</li>
                  <li>Episodes souvent declenches par le stress emotionnel</li>
                  <li>Preference pour les aliments sucres et riches en graisses</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Comportements compensatoires</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Vomissements provoqués</li>
                  <li>Usage de laxatifs ou diurétiques</li>
                  <li>Jeûne ou régimes stricts</li>
                  <li>Exercice physique excessif</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Conséquences physiques</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Poids généralement normal</li>
                  <li>Erosion de l'email dentaire</li>
                  <li>Hypertrophie des glandes salivaires</li>
                  <li>Inflammation de l'oesophage</li>
                  <li>Hypokaliemie et troubles du rythme cardiaque</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Conséquences psychologiques</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Estime de soi centrée sur le poids et la silhouette</li>
                  <li>Remords et culpabilité apres les crises</li>
                  <li>Dépression et anxiété fréquentes</li>
                  <li>Comportements impulsifs et abus de substances possibles</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Criteres DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Crises de frenesie alimentaire au moins 1 fois/semaine pendant au moins 3 mois</li>
              <li>Sentiment de perte de contrôle</li>
              <li>Comportements compensatoires réguliers</li>
              <li>Preoccupation excessive du poids et de la silhouette</li>
            </ul>
            <p className="mt-3 text-slate-700">Signes cliniques associés :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Fluctuations de poids</li>
              <li>Glandes salivaires gonflees</li>
              <li>Cicatrices sur les doigts (vomissements provoqués)</li>
              <li>Erosion dentaire</li>
              <li>Hypokaliemie</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Thérapie cognitivo-comportementale (TCC) : régulation des habitudes alimentaires, réduction des préoccupations
                    liées au poids
                  </li>
                  <li>Psychothérapie interpersonnelle : amélioration des relations sociales et gestion des conflits</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs ISRS (fluoxetine) pour réduire les crises et traiter l'anxiété/dépression associées</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Suivi</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Approche multidisciplinaire (psychiatre, nutritionniste, psychologue)</li>
                  <li>Soutien familial et social</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Amélioration significative avec une prise en charge adaptée</li>
              <li>Risque de rechute si le traitement est interrompu</li>
              <li>Pronostic favorable avec psychothérapie et suivi régulier</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              La boulimie mentale est un trouble grave mais traitable. Une prise en charge précoce et multidisciplinaire,
              associant psychothérapie et pharmacothérapie, permet de réduire les crises, d'améliorer la qualité de vie et de
              prévenir les complications physiques et psychologiques.
            </p>
          </section>
        </>
      ) : isHyperphagieBoulimique ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble hyperphagique boulimique (Binge Eating Disorder) est un trouble des conduites alimentaires caractérisé
              par des episodes récurrents de consommation excessive de nourriture accompagnes d'un sentiment de perte de contrôle.
              Contrairement à la boulimie mentale, il n'existe pas de comportements compensatoires (vomissements, laxatifs, jeûne
              ou exercice excessif). Ce trouble touche environ 1 à 2 % des femmes et moins de 1 % des hommes, avec une prévalence
              plus élevée chez les personnes en surpoids ou obèses.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Facteurs de risque</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sexe feminin</li>
              <li>Surpoids ou obésité</li>
              <li>Antecedents familiaux de troubles alimentaires</li>
              <li>Facteurs psychologiques : anxiété, dépression</li>
              <li>Influence possible de la génétique et du microbiome intestinal</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Consommation de grandes quantites de nourriture en peu de temps</li>
              <li>Sentiment de perte de contrôle pendant et apres les crises</li>
              <li>Absence de comportements compensatoires</li>
              <li>Manger rapidement ou jusqu'a l'inconfort</li>
              <li>Manger sans faim reelle</li>
              <li>Manger seul par honte</li>
              <li>Sentiments de culpabilité, de dégoût ou de dépression apres les crises</li>
            </ul>
            <h3 className="mt-4 text-base font-semibold text-slate-900">Conséquences</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Association fréquente avec le surpoids et l'obésité</li>
              <li>Risque accru de complications médicales : hypertension arterielle, diabete, troubles metaboliques</li>
              <li>Souffrance psychologique importante</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Criteres DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Crises de frenesie alimentaire au moins 1 fois/semaine pendant au moins 3 mois</li>
              <li>Sentiment de perte de contrôle</li>
              <li>
                Présence d'au moins 3 critères : manger rapidement, manger jusqu'a l'inconfort, manger sans faim, manger seul par
                honte, culpabilité ou dépression apres les crises
              </li>
              <li>Absence de comportements compensatoires</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie cognitivo-comportementale (TCC) : traitement de reference</li>
                  <li>Psychothérapie interpersonnelle : alternative efficace</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs ISRS (fluoxetine)</li>
                  <li>Lisdexamfetamine pour les formes moderees à sévères</li>
                  <li>Médicaments coupe-faim (topiramate) ou inducteurs de perte de poids (orlistat)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Autres approches</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Programmes de perte de poids : efficacité limitee à court terme</li>
                  <li>Chirurgie bariatrique : amélioration possible mais resultats à long terme incertains</li>
                  <li>Groupes de soutien (Boulimiques anonymes, Dependants à la nourriture anonymes)</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Environ 50 % des patients atteignent une rémission avec psychothérapie</li>
              <li>Risque de rechute si le suivi est interrompu</li>
              <li>Pronostic favorable avec une prise en charge multidisciplinaire</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble hyperphagique boulimique est une pathologie fréquente et invalidante, souvent associée à l'obésité et a
              des complications médicales. Une prise en charge précoce et adaptée, centrée sur la psychothérapie et parfois
              completee par un traitement médicamenteux, permet de réduire les crises et d'améliorer la qualité de vie des patients.
            </p>
          </section>
        </>
      ) : isTdah ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble deficit de l'attention avec ou sans hyperactivite (TDAH) est un trouble du neurodeveloppement
              caractérisé par trois dimensions principales :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Inattention : difficultés à maintenir l'attention, oublis fréquents, distractibilite</li>
              <li>Hyperactivite motrice : agitation excessive, incapacite à rester en place</li>
              <li>Impulsivite : difficulté à attendre, tendance à interrompre les autres</li>
            </ul>
            <p className="mt-3 leading-7 text-slate-700">
              Le TDAH touche environ 5 % des enfants et peut persister à l'adolescence et à l'age adulte. Il est diagnostiqué
              deux fois plus souvent chez les garçons que chez les filles.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs génétiques et hérédité</li>
              <li>Anomalies des neurotransmetteurs cerebraux</li>
              <li>
                Facteurs de risque : faible poids de naissance, traumatismes craniens, infections cerebrales, carences en fer,
                apnée du sommeil, exposition prenatale à l'alcool, au tabac ou à la cocaïne
              </li>
              <li>Facteurs environnementaux : violence, maltraitance, négligence</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Inattention</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulté à se concentrer sur les détails</li>
                  <li>Oublis fréquents</li>
                  <li>Desorganisation</li>
                  <li>Difficulté à terminer les tâches</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Hyperactivite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Agitation constante</li>
                  <li>Difficulté à rester assis</li>
                  <li>Activite motrice excessive</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Impulsivite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Réponses précipitées</li>
                  <li>Difficulté à attendre son tour</li>
                  <li>Interruptions fréquentes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Chez l'adulte</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulté à se concentrer</li>
                  <li>Agitation</li>
                  <li>Sautes d'humeur</li>
                  <li>Difficultés relationnelles</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Présence d'au moins six signes d'inattention ou d'hyperactivite/impulsivité</li>
              <li>Symptômes présents dans au moins deux environnements (maison, école, travail)</li>
              <li>Symptômes persistants depuis au moins six mois</li>
              <li>Evaluation clinique, questionnaires des parents et enseignants</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Thérapie comportementale</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Mise en place de routines et structures</li>
                  <li>Plan d'intervention scolaire</li>
                  <li>Techniques educatives adaptées</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Traitement médicamenteux</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Psychostimulants (methylphenidate, amphétamines)</li>
                  <li>Atomoxetine (non stimulant)</li>
                  <li>Médicaments antihypertenseurs (clonidine, guanfacine)</li>
                  <li>Antidépresseurs ou anxiolytiques dans certains cas</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Approches combinees</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie comportementale + médicaments</li>
                  <li>Collaboration entre medecins, enseignants et parents</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>La majorité des enfants atteints de TDAH deviennent des adultes productifs</li>
              <li>Les symptômes d'hyperactivite tendent à diminuer avec l'age, mais l'inattention peut persister</li>
              <li>Risques accrus en cas de non prise en charge : dépression, anxiété, abus de substances, accidents</li>
              <li>Un suivi régulier et une prise en charge adaptée ameliorent le pronostic</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le TDAH est un trouble neurodeveloppemental fréquent et complexe, necessitant une prise en charge précoce et
              multidisciplinaire. L'association de thérapies comportementales, d'un soutien scolaire et familial, et parfois de
              traitements médicamenteux, permet de réduire les symptômes et d'améliorer la qualité de vie des patients.
            </p>
          </section>
        </>
      ) : isTsa ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble du spectre de l'autisme (TSA) est un trouble du neurodeveloppement qui apparaît dès l'enfance et persiste
              tout au long de la vie. Il se caractérisé par des difficultés dans la communication et les interactions sociales,
              ainsi que par des comportements et interets restreints et repetitifs. Chaque personne autiste est unique, ce qui
              explique la notion de "spectre".
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Caracteristiques principales</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>
                Communication et interactions sociales : difficultés à établir des relations, contact visuel atypique,
                comprehension litterale du langage
              </li>
              <li>
                Comportements et interets : routines rigides, résistance au changement, interets spécifiques intenses,
                stéréotypies motrices ou verbales
              </li>
              <li>
                Particularités sensorielles : hypersensibilité ou hyposensibilité aux sons, lumières, textures, odeurs
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prévalence</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>En France, environ 1 personne sur 100 est concernee</li>
              <li>Pres de 700 000 à 1 million de personnes, dont 100 000 ont moins de 20 ans</li>
              <li>Les garçons sont diagnostiques trois fois plus souvent que les filles</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Terminologie (DSM-5)</h2>
            <p className="leading-7 text-slate-700">
              Le DSM-5 regroupe sous le terme TSÀ plusieurs diagnostics anterieurs : autisme infantile, syndrome d'Asperger,
              autisme de Kanner, troubles envahissants du développement, etc. Les spécifications permettent d'individualiser le
              diagnostic (avec ou sans deficit intellectuel, avec ou sans altération du langage, etc.).
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Signes d'alerte précoces</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>6 à 9 mois : absence de contact visuel, peu de sourires</li>
              <li>9 à 12 mois : absence de réponse au prénom, absence de gestes de communication</li>
              <li>1 à 2 ans : retard ou absence de langage</li>
              <li>
                Tous ages : perte de compétences acquises, isolement, comportements repetitifs, réactions sensorielles atypiques
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Origine multifactorielle</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs génétiques prédominants (plus de 80 % d'heritabilite)</li>
              <li>Facteurs environnementaux perinataux</li>
              <li>Anomalies précoces du neurodeveloppement</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prise en charge</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Interventions précoces : dépistage des 18 mois pour améliorer le pronostic</li>
              <li>
                Approche pluridisciplinaire : soins psycho-educatifs, orthophonie, ergothérapie, accompagnement familial
              </li>
              <li>
                Objectifs : développer les compétences sociales, cognitives et sensorielles, favoriser l'autonomie et l'inclusion
                scolaire et sociale
              </li>
              <li>
                Médicaments : aucun traitement spécifique du TSA, mais certains médicaments peuvent traiter les comorbidités
                (épilepsie, anxiété, dépression)
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Recherche et stratégie nationale</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Recherche pluridisciplinaire (génétique, neurosciences, sciences sociales)</li>
              <li>
                Strategie nationale TND 2023-2027 : repérage précoce, accompagnement tout au long de la vie, inclusion scolaire
                et sociale, soutien aux familles
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble du spectre de l'autisme est une condition complexe et multifactorielle. Bien qu'il ne puisse etre "gueri",
              une prise en charge adaptée et précoce permet d'améliorer significativement la qualité de vie et l'inclusion des
              personnes concernees. La reconnaissance de la diversite des profils et la mise en place de stratégies individualisées
              sont essentielles pour répondre aux besoins spécifiques de chaque personne autiste.
            </p>
          </section>
        </>
      ) : isGillesTourette ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le syndrome de Gilles de la Tourette est un trouble neurologique caractérisé par la présence de tics moteurs et
              vocaux persistants pendant plus d'un an. Les tics sont des mouvements ou vocalisations soudains, rapides, répétés
              et non rythmiques. Ils apparaissent généralement dans l'enfance, entre 4 et 7 ans, atteignent un pic vers 11 ans,
              puis diminuent souvent à l'adolescence.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prévalence et évolution</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prévalence : environ 0,5 à 1 % des enfants</li>
              <li>Rapport garçons/filles : 3 à 4 pour 1</li>
              <li>
                La majorité des enfants voient leurs symptômes s'atténuer à l'adolescence, mais 25 % gardent des tics modérés ou
                sévères à l'age adulte
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Classification des troubles de tics (DSM-5-TR)</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Tics provisoires : moteurs et/ou vocaux, présents depuis moins d'un an</li>
              <li>Tics persistants (chroniques) : moteurs ou vocaux (mais pas les deux), présents depuis plus d'un an</li>
              <li>Syndrome de Gilles de la Tourette : présence de tics moteurs et vocaux pendant plus d'un an</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Tics moteurs simples : clignements, grimaces, haussements d'epaules</li>
              <li>Tics moteurs complexes : association de plusieurs tics, copropraxie (gestes obscenes), echopraxie (imitation)</li>
              <li>Tics vocaux simples : grognements, reniflements, raclements de gorge</li>
              <li>Tics vocaux complexes : coprolalie (proférer des obscénités), écholalie (répétition de mots ou phrases)</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Les tics fluctuent en intensite et fréquence, sont aggraves par le stress et la fatigue, mais diminuent lors
              d'activités engageantes. Ils ne surviennent pas pendant le sommeil.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Comorbidités fréquentes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble deficit de l'attention avec ou sans hyperactivite (TDAH)</li>
              <li>Trouble obsessionnel-compulsif (TOC)</li>
              <li>Troubles anxieux</li>
              <li>Troubles de l'apprentissage</li>
              <li>Chez l'adolescent/adulte : dépression, trouble bipolaire, addictions</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Origine multifactorielle, avec forte composante génétique</li>
              <li>Dysfonctionnement dopaminergique impliquant les circuits moteurs et sensoriels</li>
              <li>Facteurs environnementaux (stress, infections comme PANDAS) peuvent jouer un role</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Base sur l'anamnese et l'examen clinique</li>
              <li>Criteres : tics moteurs et vocaux présents depuis plus d'un an, début avant 18 ans</li>
              <li>Diagnostic différentiel : exclure les tics secondaires liés à substances ou autres maladies neurologiques</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Approches comportementales</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Intervention comportementale globale pour les tics (CBIT) : thérapie cognitivo-comportementale, inversion
                    d'habitudes, relaxation
                  </li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Médicaments</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Agonistes alpha-adrenergiques (clonidine, guanfacine) : première intention pour tics légers/modérés, surtout
                    avec TDAH
                  </li>
                  <li>Antipsychotiques (aripiprazole, haloperidol, pimozide) : deuxième intention pour tics sévères</li>
                  <li>Autres options : fluphenazine, topiramate, toxine botulique</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Prise en charge des comorbidités</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>TDAH : stimulants à faible dose ou atomoxétine</li>
                  <li>TOC : ISRS</li>
                  <li>Troubles anxieux : clonidine, guanfacine</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>La majorité des enfants voient une amélioration à l'adolescence</li>
              <li>Les tics peuvent persister à l'age adulte chez une minorité</li>
              <li>Une prise en charge adaptée améliore la qualité de vie et reduit l'impact social et psychologique</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le syndrome de Gilles de la Tourette est un trouble neurologique complexe, souvent associé à des comorbidités. Bien
              qu'il ne puisse etre gueri, une prise en charge combinant thérapies comportementales, traitements médicamenteux
              adaptés et soutien scolaire et familial permet de réduire les symptômes et d'améliorer le quotidien des patients.
            </p>
          </section>
        </>
      ) : isBipolaireTypeIOrII ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Les troubles bipolaires sont des troubles de l'humeur caracterises par l'alternance d'episodes
              maniaques/hypomaniaques et dépressifs. Ils débutent généralement à l'adolescence ou au début de l'age adulte et
              touchent environ 2 % de la population au cours de la vie. La bipolarite se presente sous plusieurs formes, dont
              les types I et II, qui different par la sévérité et la nature des episodes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Etiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs génétiques : forte composante héréditaire, concordance élevée chez les jumeaux monozygotes</li>
              <li>Neurobiologie : dysregulation des neurotransmetteurs (sérotonine, dopamine, noradrenaline)</li>
              <li>Facteurs psychosociaux : evenements de vie stressants, traumatismes</li>
              <li>Substances et médicaments : cocaïne, amphétamines, corticostéroïdes, certains antidépresseurs</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Manie (Type I)</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Humeur élevée, expansive ou irritable pendant au moins 1 semaine</li>
                  <li>Estime de soi exageree, idees de grandeur</li>
                  <li>Reduction du besoin de sommeil</li>
                  <li>Logorrhee, fuite des idees</li>
                  <li>Distractibilite</li>
                  <li>Activite excessive, comportements à risque</li>
                  <li>Possibles symptômes psychotiques (delires, hallucinations)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Hypomanie (Type II)</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Humeur élevée ou irritable pendant au moins 4 jours</li>
                  <li>Augmentation de l'energie et de l'activite</li>
                  <li>Reduction du besoin de sommeil</li>
                  <li>Fonctionnement social/professionnel relativement preserve</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Dépression</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Humeur dépressive persistante</li>
                  <li>Anhedonie</li>
                  <li>Fatigue, perte d'energie</li>
                  <li>Troubles du sommeil et de l'appetit</li>
                  <li>Sentiment de devalorisation, culpabilité excessive</li>
                  <li>Idées suicidaires fréquentes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Etats mixtes et cycles rapides</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Association simultanee de symptômes maniaques/hypomaniaques et dépressifs</li>
                  <li>Risque suicidaire particulierement élevé</li>
                  <li>Cycles rapides : au moins 4 episodes par an</li>
                  <li>Pronostic plus defavorable</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les critères du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Type I : au moins un episode maniaque, souvent associé à des episodes dépressifs</li>
              <li>
                Type II : au moins un episode hypomaniaque et un episode dépressif majeur, sans episode maniaque complet
              </li>
            </ul>
            <p className="mt-3 text-slate-700">Examens complémentaires :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Bilan thyroidien (TSH, T4)</li>
              <li>Depistage de substances</li>
              <li>Examens biologiques pour exclure causes organiques</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic différentiel : troubles anxieux, dépression unipolaire, troubles schizoaffectifs, hyperthyroïdie,
              pheochromocytome.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Stabilisateurs de l'humeur : lithium, valproate, carbamazepine, lamotrigine</li>
                  <li>
                    Antipsychotiques de 2e generation : aripiprazole, olanzapine, quetiapine, risperidone, ziprasidone, cariprazine
                  </li>
                  <li>Antidépresseurs : parfois utilisés en association, jamais en monothérapie</li>
                  <li>Ketamine/esketamine : option dans les depressions bipolaires resistantes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Autres traitements</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Electroconvulsivothérapie (ECT)</li>
                  <li>Stimulation magnetique transcranienne (rTMS)</li>
                  <li>Photothérapie (troubles saisonniers)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie et psychoeducation</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie individuelle et de groupe</li>
                  <li>Psychoeducation pour reconnaitre les signes précoces de rechute</li>
                  <li>Soutien familial et social</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Évolution chronique avec alternance de rémissions et rechutes</li>
              <li>Risque suicidaire élevé (20 à 30 fois superieur à la population générale)</li>
              <li>Pronostic améliore par une prise en charge précoce et un suivi régulier</li>
              <li>Importance du traitement d'entretien et de la prévention des rechutes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Les troubles bipolaires de type I et II sont des pathologies psychiatriques sévères, invalidantes et à haut risque
              suicidaire. Une prise en charge multimodale, associant stabilisateurs de l'humeur, antipsychotiques, psychothérapie
              et psychoeducation, permet de réduire la fréquence et l'intensite des episodes et d'améliorer la qualité de vie des
              patients.
            </p>
          </section>
        </>
      ) : isTroublesDepressifs ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Les troubles dépressifs regroupent plusieurs formes de dépression caracterisees par une tristesse persistante, une
              perte d'intérêt ou de plaisir (anhedonie), et une altération du fonctionnement quotidien. Ils incluent le trouble
              dépressif majeur, le trouble dépressif persistant (dysthymie), le trouble dysphorique prémenstruel, le trouble de
              deuil prolongé et d'autres formes spécifiques ou non spécifiées. Leur origine est multifactorielle : génétique,
              neurobiologique, endocrinienne et psychosociale.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Etiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs génétiques : hérédité impliquee dans environ 50 % des cas, forte concordance chez les jumeaux monozygotes</li>
              <li>Neurotransmetteurs : anomalies de la régulation serotoninergique, dopaminergique, noradrenergique, glutamatergique</li>
              <li>Neuroendocrinologie : dysfonctionnement des axes hypothalamo-hypophyso-surrenal, thyroidien et hormone de croissance</li>
              <li>Facteurs psychosociaux : stress majeurs, pertes, separations, vulnerabilite individuelle</li>
              <li>Facteurs medicaux : pathologies endocriniennes, neurologiques, infectieuses, maladies chroniques</li>
              <li>Substances et médicaments : corticostéroïdes, beta-bloqueurs, alcool, amphétamines</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <p className="text-slate-700">Les symptômes incluent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Humeur dépressive persistante</li>
              <li>Anhedonie</li>
              <li>Fatigue, baisse d'energie</li>
              <li>Troubles du sommeil (insomnie ou hypersomnie)</li>
              <li>Modifications de l'appetit et du poids</li>
              <li>Troubles cognitifs (concentration, mémoire, indécision)</li>
              <li>Sentiment de devalorisation, culpabilité excessive</li>
              <li>Idées suicidaires ou comportements suicidaires</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-slate-900">Formes cliniques</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble dépressif majeur : au moins 5 symptômes pendant au moins 2 semaines, dont humeur dépressive ou anhedonie</li>
              <li>Trouble dépressif persistant (dysthymie) : symptômes pendant au moins 2 ans, humeur sombre chronique</li>
              <li>Trouble dysphorique prémenstruel : symptômes liés au cycle menstruel, sévères et invalidants</li>
              <li>Trouble de deuil prolongé : tristesse persistante pendant au moins 1 an apres une perte, avec souffrance invalidante</li>
              <li>Autres troubles dépressifs : symptômes dépressifs significatifs sans répondre aux critères complets</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-slate-900">Specificateurs</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Detresse anxieuse</li>
              <li>Caracteristiques mixtes</li>
              <li>Melancolique</li>
              <li>Atypique</li>
              <li>Psychotique</li>
              <li>Catatonique</li>
              <li>Apparition peripartum</li>
              <li>Schema saisonnier</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Anamnese clinique et critères DSM-5-TR</li>
              <li>Exclusion de causes médicales (NFS, TSH, vitamine B12, folates)</li>
              <li>Differenciation avec demoralisation, chagrin, troubles anxieux, troubles bipolaires</li>
              <li>Utilisation d'outils de dépistage (PHQ-9, Beck Depression Inventory)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie cognitivo-comportementale (TCC)</li>
                  <li>Thérapie interpersonnelle</li>
                  <li>Soutien psychologique et psychoeducation</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ISRS, IRSN, modulateurs serotoninergiques</li>
                  <li>Antidépresseurs tricycliques, IMAO</li>
                  <li>Ketamine et esketamine (formes resistantes)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Autres traitements</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Electroconvulsivothérapie (ECT)</li>
                  <li>Stimulation magnetique transcranienne (rTMS)</li>
                  <li>Activite physique, hygiene de vie</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Évolution variable : episodes isolés ou récurrents</li>
              <li>Risque élevé de récidive apres un premier episode</li>
              <li>Pronostic améliore par une prise en charge précoce et adaptée</li>
              <li>Importance du suivi régulier, du traitement d'entretien et de la prévention des rechutes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Les troubles dépressifs sont fréquents et invalidants, affectant profondément la qualité de vie. Une approche
              multimodale combinant psychothérapie, pharmacothérapie et interventions complémentaires permet une amélioration
              significative. La reconnaissance précoce des symptômes et l'accès aux soins spécialisés sont essentiels pour réduire
              la souffrance et prévenir les complications.
            </p>
          </section>
        </>
      ) : isTroublePanique ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble panique est un trouble anxieux caractérisé par la survenue repetee d'attaques de panique inattendues et
              imprevisibles. Ces crises se manifestent par une peur intense et des symptômes somatiques marques. Le trouble panique
              s'accompagne souvent d'une anxiété anticipatoire et de comportements d'évitement, entraînant une altération du
              fonctionnement social, professionnel et familial.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <p className="text-slate-700">
              Une attaque de panique implique l'apparition soudaine d'une peur ou d'un malaise intense, accompagnée d'au moins 4
              des symptômes suivants :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Palpitations, tachycardie</li>
              <li>Transpiration excessive, bouffees de chaleur</li>
              <li>Tremblements, frissons</li>
              <li>Sensation d'étouffement ou d'étranglement</li>
              <li>Douleur ou gêne thoracique</li>
              <li>Nausees, gêne abdominale</li>
              <li>Vertiges, instabilité, impression d'evanouissement</li>
              <li>Déréalisation ou dépersonnalisation</li>
              <li>Peur de perdre le contrôle ou de devenir fou</li>
              <li>Peur de mourir</li>
            </ul>
            <p className="mt-3 text-slate-700">Le trouble panique se caractérisé egalement par :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Inquiétude persistante concernant la survenue de nouvelles crises</li>
              <li>Comportements d'évitement des situations ou lieux associés aux crises</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les critères du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Attaques de panique recurrentes et inattendues</li>
              <li>
                Au moins une attaque suivie pendant au moins 1 mois de :
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Inquiétude persistante d'avoir d'autres attaques ou de leurs conséquences</li>
                  <li>Modification comportementale inadaptée (évitement, restriction des activités)</li>
                </ul>
              </li>
            </ul>
            <p className="mt-3 text-slate-700">
              Examens complémentaires : bilan médical pour exclure une cause organique (troubles cardiaques, endocriniens,
              respiratoires) ou l'effet de substances.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Comorbidités fréquentes : dépression majeure, autres troubles anxieux, trouble bipolaire, abus d'alcool, troubles
              cardiaques ou respiratoires.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Thérapie cognitivo-comportementale (TCC) : identification et correction des pensées dysfonctionnelles,
                    exposition graduee aux situations anxiogenes, techniques de relaxation et de respiration
                  </li>
                  <li>Stratégies complémentaires : pleine conscience, méditation, hypnose, exercices de respiration</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs : ISRS (ex. sertraline, paroxetine), IRSN (ex. venlafaxine), tricycliques, IMAO</li>
                  <li>Benzodiazepines : anxiolytiques à action rapide, usage limite en raison du risque de dependance</li>
                  <li>
                    Association antidépresseurs + benzodiazepines : parfois utilisee en début de traitement, avec réduction
                    progressive des benzodiazepines
                  </li>
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  Le traitement est individualisé selon la sévérité et la présence de comportements d'évitement. La durée du
                  traitement médicamenteux est souvent de plusieurs mois, voire annees, pour prévenir les rechutes.
                </p>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prévalence : 2-3 % de la population sur 12 mois</li>
              <li>Attaques de panique isolées : jusqu'a 11 % de la population en 1 an</li>
              <li>Début habituel : fin de l'adolescence ou début de l'age adulte</li>
              <li>Femmes deux fois plus touchees que les hommes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Évolution souvent fluctuante et chronique</li>
              <li>Certains patients guerissent spontanement, d'autres necessitent une prise en charge prolongee</li>
              <li>Importance du suivi régulier pour ajuster le traitement et prévenir les rechutes</li>
              <li>
                Psychoeducation et soutien psychologique essentiels pour limiter l'évitement et restaurer le fonctionnement
                quotidien
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble panique est un trouble anxieux invalidant, marque par des crises de panique recurrentes et une anxiété
              anticipatoire. Une prise en charge adaptée, combinant psychothérapie et pharmacothérapie, permet de réduire la
              fréquence et l'intensite des crises, d'améliorer la qualité de vie et de prévenir les rechutes.
            </p>
          </section>
        </>
      ) : isAgoraphobie ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              L'agoraphobie est un trouble anxieux caractérisé par une peur ou une anxiété intense face à des situations ou il
              pourrait etre difficile de s'echapper ou d'obtenir de l'aide en cas de crise. Elle entraîne souvent des comportements
              d'évitement et peut perturber considérablement la vie quotidienne, parfois jusqu'a confiner la personne chez elle.
              Environ 2 % des adultes souffrent d'agoraphobie chaque annee, avec une prévalence plus élevée chez les femmes. Elle
              débute fréquemment à l'adolescence ou au début de l'age adulte.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <p className="text-slate-700">Les situations typiquement redoutées incluent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Utiliser les transports en commun</li>
              <li>Se trouver dans des espaces ouverts (marches, parkings)</li>
              <li>Se trouver dans des espaces clos (magasins, theatres)</li>
              <li>Faire la queue ou etre dans une foule</li>
              <li>Etre seul hors de chez soi</li>
            </ul>
            <p className="mt-3 text-slate-700">Les manifestations comprennent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Panique ou sentiment de terreur</li>
              <li>Acceleration du rythme cardiaque, essoufflement, tremblements</li>
              <li>Sensation d'oppression thoracique</li>
              <li>Besoin irresistible de fuir</li>
              <li>Incapacite à raisonner l'anxiété</li>
              <li>Planification de stratégies d'évitement</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">
              Le diagnostic repose sur un examen clinique et les critères psychiatriques standards (DSM-5). Les critères incluent :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur ou anxiété persistante (au moins 6 mois)</li>
              <li>
                Présence d'au moins deux situations typiques (transports, espaces ouverts/clos, foule, isolement hors domicile)
              </li>
              <li>Symptômes disproportionnes par rapport au danger reel</li>
              <li>Souffrance significative ou altération du fonctionnement</li>
              <li>Exclusion d'autres troubles mentaux ou pathologies générales</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Thérapie d'exposition : confrontation progressive aux situations redoutées, efficace chez plus de 90 % des
                    patients
                  </li>
                  <li>
                    Thérapie cognitivo-comportementale (TCC) : identification et correction des pensées déformées, modification des
                    comportements
                  </li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie et régulation</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ISRS (inhibiteurs sélectifs de la recapture de la sérotonine) : efficaces dans certains cas</li>
                  <li>Stratégies de relaxation : respiration, méditation, pleine conscience</li>
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  Le traitement est individualisé et peut associer psychothérapie et pharmacothérapie. L'approche précoce améliore
                  le pronostic.
                </p>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prévalence : environ 2 % des adultes chaque annee</li>
              <li>Femmes plus touchees que les hommes</li>
              <li>Début fréquent à l'adolescence ou au début de l'age adulte</li>
              <li>Souvent associé au trouble panique (30 à 50 % des cas)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Évolution variable : intensite fluctuante, parfois disparition spontanée</li>
              <li>Risque de chronicite si non traite</li>
              <li>Importance du suivi régulier et de la psychoeducation</li>
              <li>Traitement précoce associé à une meilleure récupération</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              L'agoraphobie est un trouble anxieux invalidant qui limite fortement la vie quotidienne. Une prise en charge adaptée,
              combinant thérapie d'exposition, TCC et parfois pharmacothérapie, permet aux patients de reprendre le contrôle de leur
              vie et de réduire significativement l'impact fonctionnel.
            </p>
          </section>
        </>
      ) : isPhobieSociale ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble d'anxiété sociale, ou phobie sociale, est un trouble anxieux caractérisé par une peur intense et
              persistante des situations sociales ou de performance. Les personnes atteintes craignent d'etre observées, jugées
              négativement, humiliées ou rejetées. Cette anxiété entraîne souvent des comportements d'évitement et une souffrance
              significative, altérant la vie quotidienne. La prévalence est estimée à environ 13 % au cours de la vie, avec une
              fréquence annuelle de 9 % chez les femmes et 7 % chez les hommes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <p className="text-slate-700">Les situations typiquement redoutées incluent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Parler en public</li>
              <li>Realiser une tache devant autrui (lecture, musique)</li>
              <li>Manger en présence d'autres personnes</li>
              <li>Rencontrer des inconnus</li>
              <li>Tenir une conversation</li>
              <li>Signer un document devant temoins</li>
              <li>Utiliser des toilettes publiques</li>
            </ul>
            <p className="mt-3 text-slate-700">Les manifestations comprennent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Crainte d'etre juge ou rejete</li>
              <li>Peur d'offenser autrui</li>
              <li>Évitement des situations sociales</li>
              <li>Symptômes physiques : transpiration, rougissement, tremblements, voix tremblante, nausees</li>
              <li>Crises de panique dans les contextes sociaux</li>
            </ul>
            <h3 className="mt-4 text-base font-semibold text-slate-900">Anxiété de performance</h3>
            <p className="mt-1 text-slate-700">Forme particuliere de phobie sociale, caracterisee par :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur demesuree de l'echec</li>
              <li>Pensées négatives avant, pendant ou après une évaluation</li>
              <li>Stress, insomnie, crises de panique</li>
              <li>Recherche excessive de perfection et validation externe</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">
              Le diagnostic repose sur un examen clinique et les critères psychiatriques standards (DSM-5) :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur ou anxiété intense, persistante depuis au moins 6 mois</li>
              <li>Présence dans une ou plusieurs situations sociales</li>
              <li>Crainte d'une évaluation negative par autrui</li>
              <li>Évitement ou endurance avec malaise</li>
              <li>Disproportion par rapport au danger reel</li>
              <li>Souffrance significative ou altération du fonctionnement</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic différentiel : agoraphobie, trouble panique, dysmorphophobie.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie d'exposition : confrontation progressive aux situations sociales redoutées</li>
                  <li>
                    Thérapie cognitivo-comportementale (TCC) : techniques de relaxation, identification et correction des pensées
                    dysfonctionnelles, modification des comportements
                  </li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ISRS (inhibiteurs sélectifs de la recapture de la sérotonine) : traitement de première intention</li>
                  <li>Benzodiazepines : anxiolytiques à action rapide, usage limite en raison du risque de dependance</li>
                  <li>
                    Betabloquants : réduction des symptômes physiques (tachycardie, tremblements) dans les situations de
                    performance
                  </li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prévalence vie entiere : environ 13 %</li>
              <li>Prévalence annuelle : 9 % chez les femmes, 7 % chez les hommes</li>
              <li>Début fréquent apres la puberté</li>
              <li>Facteurs de risque : timidite infantile, faible estime de soi, perfectionnisme, attentes parentales elevees</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble souvent chronique si non traite</li>
              <li>Amélioration significative avec psychothérapie et/ou pharmacothérapie</li>
              <li>Importance du suivi régulier et de la psychoeducation</li>
              <li>Prevention des rechutes par maintien thérapeutique et stratégies d'adaptation</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              La phobie sociale est un trouble anxieux fréquent et invalidant, qui limite fortement les interactions sociales et
              professionnelles. Une prise en charge adaptée, combinant thérapie cognitivo-comportementale, exposition et traitement
              pharmacologique, permet de réduire l'anxiété, d'améliorer la qualité de vie et de restaurer le fonctionnement social.
            </p>
          </section>
        </>
      ) : isTag ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble anxieux généralisé (TAG) est un trouble psychiatrique caractérisé par une anxiété excessive, diffuse et
              persistante, difficilement controlable. Cette anxiété est presente la plupart des jours pendant au moins six mois et
              entraîne une altération significative du fonctionnement social, professionnel ou familial. Le TAG est fréquemment
              associé à d'autres pathologies psychiatriques, telles que la dépression majeure ou les troubles liés à l'usage de
              substances.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>
                Inquiétude constante et disproportionnée, concernant plusieurs domaines (santé, finances, travail, relations,
                securite)
              </li>
              <li>Agitation, nervosite, hypervigilance</li>
              <li>Fatigue excessive et baisse d'energie</li>
              <li>Difficultés de concentration et troubles de la mémoire</li>
              <li>Irritabilité fréquente</li>
              <li>Tension musculaire, céphalées, douleurs dorsales ou cervicales</li>
              <li>Troubles du sommeil (insomnie, reveils nocturnes, sommeil non reparateur)</li>
            </ul>
            <p className="mt-3 text-slate-700">
              Ces symptômes entrainent une souffrance significative et une altération du fonctionnement quotidien.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Anamnese clinique et critères psychiatriques standardises (DSM-5, CIM-10)</li>
              <li>Présence d'une anxiété excessive sur plusieurs themes, la plupart des jours pendant au moins 6 mois</li>
              <li>Au moins trois symptômes associés (agitation, fatigue, troubles du sommeil, etc.)</li>
            </ul>
            <p className="mt-3 text-slate-700">
              Examens complémentaires : bilan biologique cible pour exclure une cause organique (hyperthyroïdie, pathologies
              neurologiques) ou médicamenteuse.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Diagnostic différentiel : dépression majeure, trouble panique, trouble obsessionnel-compulsif, phobies spécifiques.
              Comorbidités fréquentes : dépression, autres troubles anxieux, usage de substances.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Thérapie cognitivo-comportementale (TCC) : restructuration cognitive, gestion de la rumination, techniques
                    de relaxation, exposition graduee aux inquietudes
                  </li>
                  <li>Autres approches : thérapies interpersonnelles, thérapies basees sur la pleine conscience</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs : ISRS (ex. escitalopram, sertraline), IRSN (ex. venlafaxine, duloxetine)</li>
                  <li>Benzodiazepines : effet rapide, usage court terme (risque de dependance)</li>
                  <li>Buspirone : alternative non sedative, delai d'action de 2 semaines</li>
                  <li>Phytothérapie (valériane, kawa) : efficacité non confirmée, prudence vis-à-vis des interactions</li>
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  La prise en charge associé souvent psychothérapie et traitement médicamenteux, adaptés à la sévérité des
                  symptômes.
                </p>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prévalence : 2-4 % des adultes chaque annee</li>
              <li>Femmes deux fois plus touchees que les hommes</li>
              <li>Début fréquent à l'age adulte, mais possible à tout age</li>
              <li>Évolution chronique et fluctuante, aggravée par les periodes de stress</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble souvent persistant sur plusieurs annees, avec phases d'exacerbation</li>
              <li>Pronostic améliore par une prise en charge précoce et multimodale</li>
              <li>Importance du suivi régulier pour ajuster le traitement et prévenir les rechutes</li>
              <li>Hygiene de vie recommandee : sommeil régulier, activite physique, réduction de l'alcool et des stimulants</li>
              <li>Orientation vers psychiatre en cas de résistance au traitement ou comorbidité sévère</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le TAG est un trouble anxieux fréquent et invalidant. Une prise en charge adaptée, combinant psychothérapie et
              pharmacothérapie, permet d'améliorer significativement la qualité de vie des patients. La reconnaissance précoce des
              symptômes et l'accès à un suivi spécialisé sont essentiels pour limiter l'impact fonctionnel et prévenir les rechutes.
            </p>
          </section>
        </>
      ) : isPhobiesSpecifiques ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Les phobies spécifiques sont des peurs intenses, irrationnelles et persistantes liées à des objets, situations ou
              circonstances particulieres. Elles entrainent une anxiété immédiate et des comportements d'évitement. Bien que la
              personne reconnaisse souvent le caractere excessif de sa peur, celle-ci reste envahissante et peut perturber le
              fonctionnement quotidien. Les phobies spécifiques representent le trouble anxieux le plus fréquent.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptômes</h2>
            <p className="text-slate-700">
              Les personnes atteintes développent une peur ou une anxiété marquée en présence de l'objet ou de la situation
              phobogene. Les symptômes incluent :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Palpitations, tachycardie</li>
              <li>Tremblements, secousses musculaires</li>
              <li>Transpiration excessive</li>
              <li>Douleurs musculaires</li>
              <li>Maux de ventre, diarrhee</li>
              <li>Confusion</li>
              <li>Crises de panique dans les cas sévères</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur l'anamnese clinique et les critères du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur ou anxiété persistante (au moins 6 mois) liée à un objet ou une situation spécifique</li>
              <li>Déclenchement quasi systématique de la peur ou de l'anxiété</li>
              <li>Évitement actif de la situation ou de l'objet</li>
              <li>Reaction disproportionnée par rapport au danger reel</li>
              <li>Souffrance significative ou altération du fonctionnement social/professionnel</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic différentiel : autres troubles anxieux, dépression, troubles bipolaires, troubles liés aux substances,
              troubles de la personnalite.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Types fréquents de phobies spécifiques</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Animaux (zoophobie)</li>
              <li>Insectes</li>
              <li>Orages (astraphobie)</li>
              <li>Hauteurs (acrophobie)</li>
              <li>Espaces clos (claustrophobie)</li>
              <li>Ponts</li>
              <li>Sang, aiguilles, blessures (avec risque de malaise vasovagal)</li>
              <li>Mort</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prévalence annuelle : environ 8 % des femmes et 3 % des hommes</li>
              <li>Prévalence vie entiere : environ 9 % de la population</li>
              <li>Début fréquent dès l'enfance ou l'adolescence, mais possible à tout age</li>
              <li>Facteurs de risque : biologiques, hereditaires, individuels et environnementaux</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychothérapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Thérapie d'exposition : confrontation progressive à l'objet ou la situation redoutée</li>
                  <li>Thérapie cognitivo-comportementale (TCC) : modification des pensées et comportements dysfonctionnels</li>
                  <li>Hypnose : parfois utilisee comme complément</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacothérapie et autres approches</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidépresseurs (ISRS, IRSN)</li>
                  <li>Anxiolytiques (benzodiazepines) en usage limite</li>
                  <li>Psychoeducation</li>
                  <li>Techniques de relaxation et gestion du stress</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Évolution variable selon la sévérité et l'objet de la phobie</li>
              <li>Amélioration significative avec une prise en charge adaptée</li>
              <li>Importance d'un suivi régulier pour prévenir les rechutes</li>
              <li>Risque de complications si non traite (isolement, altération du fonctionnement, refus de soins medicaux)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Les phobies spécifiques sont des troubles anxieux fréquents et invalidants. Une prise en charge précoce, reposant
              principalement sur la thérapie d'exposition et la TCC, permet de réduire l'anxiété et de restaurer le fonctionnement
              quotidien. Les traitements pharmacologiques peuvent etre utilisés en complément. La reconnaissance et le traitement de
              ces phobies ameliorent considérablement la qualité de vie des patients.
            </p>
          </section>
        </>
      ) : (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Comprendre le trouble</h2>
            <p className="leading-7 text-slate-700">{trouble.summary}</p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Signes fréquemment observés</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              {trouble.signs.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pistes d'orientation éducative</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              {trouble.orientation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
        <h2 className="mb-2 text-xl font-semibold">Test spécifique associé</h2>
        {trouble.test ? (
          <>
            <p className="text-slate-800">
              <span className="font-medium">{trouble.test.code}</span> - {trouble.test.name}
            </p>
            <p className="mt-1 text-sm text-slate-700">Statut: {testStatusLabel(trouble.test.status)}</p>
            {trouble.test.notes && <p className="mt-1 text-sm text-slate-700">Note: {trouble.test.notes}</p>}

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/tests/${trouble.test.slug}?trouble=${trouble.slug}`}
                className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-800"
              >
                Ouvrir le test spécifique
              </Link>
              <Link
                href={`/categories/${trouble.categorySlug}`}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-white/70"
              >
                Retour à la catégorie
              </Link>
            </div>
          </>
        ) : (
          <p className="text-slate-700">Aucun test n'est encore renseigné pour cette fiche.</p>
        )}
      </section>
    </div>
  );
}
