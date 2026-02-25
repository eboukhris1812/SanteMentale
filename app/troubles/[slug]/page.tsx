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
    rationale: "L'image montre une anxiete fonctionnelle du quotidien, facilement identifiable par les jeunes.",
  },
  "depression-majeure": {
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune assis seul avec posture repliee, ambiance realiste d'isolement",
    rationale: "Le visuel reflete l'isolement et la perte d'elan sans dramatisation excessive.",
  },
  toc: {
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent verifiant a repetition son materiel scolaire",
    rationale: "La repetition comportementale est visible et relie la fiche a des situations concretes.",
  },
  "phobie-sociale": {
    imageUrl: "https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en retrait pendant une interaction de groupe",
    rationale: "Le contraste entre groupe et retrait aide a comprendre la peur du jugement social.",
  },
  "anorexie-mentale": {
    imageUrl: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescente en reflexion face a un repas",
    rationale: "L'image recentre le trouble sur le vecu alimentaire quotidien de facon bienveillante.",
  },
  boulimie: {
    imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune devant une table de nourriture avec expression de tension emotionnelle",
    rationale: "Le visuel evoque la perte de controle alimentaire et la charge emotionnelle associee.",
  },
  tdah: {
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
    alt: "Eleve distrait en classe avec difficulte de concentration",
    rationale: "Le contexte scolaire facilite la comprehension des symptomes d'inattention.",
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
    rationale: "Image realiste d'anxiete en contexte adolescent.",
  },
  "troubles-humeur": {
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune isole avec posture fermee",
    rationale: "Representation claire des difficultes thymiques.",
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
    alt: "Adolescent face a l'alimentation et a l'image corporelle",
    rationale: "Permet une representation contextualisee et non caricaturale.",
  },
  "troubles-neurodeveloppementaux": {
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    alt: "Eleve necessitant des adaptations attentionnelles en classe",
    rationale: "Montre les difficultes dans des environnements concrets.",
  },
};

function getVisual(slug: string, categorySlug: string): TroubleVisual {
  return (
    visualsBySlug[slug] ??
    visualsByCategory[categorySlug] ?? {
      imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
      alt: "Adolescent en reflexion emotionnelle",
      rationale: "Image generale de sante mentale adaptee au public adolescent.",
    }
  );
}

export function generateStaticParams() {
  return troubles.map((trouble) => ({ slug: trouble.slug }));
}

function testStatusLabel(status: "implemented" | "adapted" | "planned" | "undefined") {
  if (status === "implemented") return "Implémente";
  if (status === "adapted") return "Implémentation adaptée";
  if (status === "planned") return "A venir";
  return "A définir";
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
  const isTroublesDepressifs = trouble.slug === "depression-majeure";
  const isTroublePanique = trouble.slug === "trouble-panique";
  const isAgoraphobie = trouble.slug === "agoraphobie";
  const isPhobieSociale = trouble.slug === "phobie-sociale";
  const isTag = trouble.slug === "trouble-anxieux-generalise";
  const isPhobiesSpecifiques = trouble.slug === "phobies-specifiques";

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
              traumatisant accablant. Il se caractérise par des symptômes anxieux, dissociatifs et de reviviscence qui apparaissent
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
              Le trouble reactionnel de l'attachement (TRA) est un trouble de l'enfance caracterise par une incapacite a etablir
              des liens affectifs securisants avec les figures de soins. Il survient generalement entre 9 mois et 5 ans, souvent
              a la suite de negligence, de maltraitance ou d'un environnement instable. Les enfants concernes presentent des
              difficultes emotionnelles et relationnelles importantes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Etiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Negligence ou maltraitance precoce</li>
              <li>Absence de soins stables et coherents</li>
              <li>Changements repetes de donneurs de soins</li>
              <li>Environnements inhabituels limitant l'etablissement d'attachements selectifs</li>
              <li>Facteurs de risque : troubles de sante mentale parentaux, pauvrete, adoption, traumatismes familiaux</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Retrait emotionnel et social</li>
              <li>Absence de recherche de reconfort en cas de detresse</li>
              <li>Reponse limitee au reconfort</li>
              <li>Affects positifs restreints</li>
              <li>Irritabilite, tristesse ou peur inexpliquees</li>
              <li>Evitement du contact visuel ou physique</li>
              <li>Preference affective envers des etrangers plutot qu'envers les proches</li>
              <li>Difficultes dans les jeux interactifs</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Selon le DSM-5-TR, le diagnostic repose sur :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Mode relationnel durable caracterise par un comportement inhibe et un retrait emotionnel</li>
              <li>Perturbation sociale et emotionnelle persistante</li>
              <li>Symptomes presents avant l'age de 5 ans</li>
              <li>Exclusion d'autres troubles psychiatriques ou causes medicales</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Un diagnostic precoce est essentiel pour prevenir les complications a long terme.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prevention</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Interaction reguliere et de qualite avec l'enfant</li>
              <li>Comprehension des signaux verbaux et non verbaux</li>
              <li>Reponses adaptees aux besoins de l'enfant</li>
              <li>Developpement d'un environnement stable et securisant</li>
              <li>Encouragement des interactions affectives et sociales</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie individuelle centree sur l'enfant</li>
                  <li>Therapie familiale pour renforcer les liens parent-enfant</li>
                  <li>Interventions en competences sociales</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Approches complementaires</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Psychoeducation des parents et des soignants</li>
                  <li>Programmes specialises (Child-Parent Psychotherapy, Attachment Behavioral Catch-up, Cercle de securite parentale)</li>
                  <li>Soutien social et communautaire</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sans traitement, risque de troubles anxieux, depressifs, comportements antisociaux ou abus de substances</li>
              <li>Avec une intervention precoce, amelioration significative des capacites relationnelles et emotionnelles</li>
              <li>Importance du suivi regulier et du soutien parental</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble reactionnel de l'attachement est une pathologie grave de l'enfance qui compromet le developpement affectif
              et social. Une prise en charge precoce et adaptee, centree sur la relation parent-enfant et le renforcement des
              capacites de soins, permet d'ameliorer le pronostic et de favoriser un developpement harmonieux.
            </p>
          </section>
        </>
      ) : isPersonnaliteParanoiaque ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite paranoide est un trouble psychiatrique caracterise par une mefiance et une suspicion
              omnipresentes et injustifiees envers les autres. Les personnes atteintes interpretent les intentions d'autrui comme
              malveillantes, ce qui entraine une souffrance importante et des difficultes relationnelles. La prevalence est estimee
              entre 3 et 5 % de la population, avec une frequence plus elevee chez les hommes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Soupcons persistants d'etre exploite, trompe ou menace</li>
              <li>Hypervigilance face aux insultes, affronts ou menaces</li>
              <li>Interpretation hostile des remarques ou comportements neutres</li>
              <li>Rancune tenace et tendance a contre-attaquer</li>
              <li>Mefiance excessive, besoin d'autonomie et de controle</li>
              <li>Difficultes a se confier ou a etablir des relations proches</li>
              <li>Doutes injustifies sur la fidelite des amis ou du conjoint</li>
              <li>Jalousie excessive et comportements possessifs</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les criteres du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Mefiance et suspicion persistantes envers les autres</li>
              <li>
                Presence d'au moins 4 manifestations typiques (soupcons injustifies, reticence a se confier, rancune tenace,
                interpretation hostile, etc.)
              </li>
              <li>Debut des symptomes au debut de l'age adulte</li>
            </ul>
            <p className="mt-3 text-slate-700">Diagnostic differentiel :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble de la personnalite schizoide (detachement social)</li>
              <li>Trouble de la personnalite schizotypique (pensees et comportements excentriques)</li>
              <li>Trouble borderline (dependance et instabilite relationnelle)</li>
              <li>Trouble narcissique (grandiosite)</li>
              <li>Trouble antisocial (exploitation d'autrui)</li>
              <li>Troubles psychotiques (schizophrenie, trouble delirant)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie cognitivo-comportementale (TCC) : identification et correction des pensees paranoiaques</li>
                  <li>Psychoeducation et accompagnement relationnel</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs pour les symptomes anxieux ou depressifs</li>
                  <li>Antipsychotiques atypiques (seconde generation) pour reduire l'anxiete et la paranoia</li>
                </ul>
              </article>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Le traitement est souvent difficile en raison de la mefiance generalisee des patients. L'etablissement d'une alliance
              therapeutique est essentiel.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>
                Trouble chronique, rarement isole (comorbidites frequentes : schizophrenie, phobie sociale, TSPT, troubles de la
                personnalite)
              </li>
              <li>Pronostic dependant de la precocite du diagnostic et de l'adhesion au traitement</li>
              <li>Importance du suivi regulier et du soutien psychologique</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite paranoide est une pathologie invalidante qui affecte profondement les relations
              sociales et familiales. Bien qu'aucun traitement curatif n'existe, une prise en charge adaptee, centree sur la
              psychotherapie et parfois associee a une pharmacotherapie, peut reduire les symptomes et ameliorer la qualite de vie
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
              et souvent illegaux, sans eprouver de remords. La prevalence est estimee entre 2 et 6 % dans la population, avec une
              frequence trois fois plus elevee chez les hommes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs genetiques : risque accru chez les apparentes au premier degre</li>
              <li>Facteurs environnementaux : maltraitance, negligence, discipline incoherente durant l'enfance</li>
              <li>Antecedents de troubles des conduites et de TDAH avant 10 ans</li>
              <li>Mepris precoce de la douleur des autres associe a un comportement antisocial ulterieur</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Mepris des autres</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Exploitation, escroquerie, manipulation pour obtenir argent, pouvoir ou gratification</li>
                  <li>Actes illegaux (vol, destruction de biens, harcelement)</li>
                  <li>Absence de remords ou rationalisation des comportements</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Impulsivite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulte a anticiper les consequences</li>
                  <li>Changements soudains de relations, emploi ou domicile</li>
                  <li>Conduite dangereuse, abus de substances</li>
                  <li>Agressivite et bagarres frequentes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Irresponsabilite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Abandon d'emplois sans planification</li>
                  <li>Non-paiement des factures ou des dettes</li>
                  <li>Negligence des obligations familiales (pension alimentaire)</li>
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
            <p className="text-slate-700">Le diagnostic repose sur les criteres du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Mepris constant des droits d'autrui</li>
              <li>
                Presence d'au moins 3 criteres : actes illegaux repetes, malhonnetete, impulsivite, agressivite,
                irresponsabilite, absence de remords
              </li>
              <li>Diagnostic pose uniquement chez les personnes de 18 ans ou plus</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic differentiel : troubles lies a l'abus de substances, trouble borderline, trouble du controle des
              impulsions.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Gestion des contingences : recompenses pour comportements positifs</li>
                  <li>Approches comportementales ciblees</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Stabilisateurs de l'humeur (lithium, anticonvulsivants)</li>
                  <li>ISRS pour reduire l'impulsivite et l'agressivite</li>
                </ul>
              </article>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Limites : difficulte de prise en charge en raison du manque de remords et de cooperation; certaines psychotherapies
              (comme la TCC classique) peuvent etre inefficaces ou contre-productives.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble chronique, souvent associe a des comorbidites (abus de substances, TDAH, borderline)</li>
              <li>Esperance de vie reduite en raison des comportements a risque</li>
              <li>Pronostic dependant d'une intervention precoce sur les troubles des conduites chez l'enfant</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite antisociale est une pathologie severe, marquee par un mepris des droits d'autrui et
              une impulsivite chronique. Bien que difficile a traiter, une prise en charge adaptee, centree sur la gestion des
              comportements et parfois associee a une pharmacotherapie, peut reduire l'agressivite et ameliorer la stabilite
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
              elles pourraient etre jugees negativement. Ce trouble touche environ 2 % de la population generale et est legerement
              plus frequent chez les femmes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs genetiques : predisposition a l'anxiete sociale</li>
              <li>Facteurs environnementaux : rejet ou marginalisation durant l'enfance</li>
              <li>Evitement social observe des l'age de 2 ans</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Peur du rejet</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Refus de promotions ou d'opportunites professionnelles par crainte de critiques</li>
                  <li>Evitement des reunions ou des nouvelles relations</li>
                  <li>Besoin d'assurances repetees de soutien avant d'integrer un groupe</li>
                  <li>Reticence a parler de soi par peur d'etre ridiculise</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Sensibilite extreme a la critique</h3>
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
            <p className="text-slate-700">Le diagnostic repose sur les criteres du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Evitement des activites impliquant des relations personnelles par peur du rejet</li>
              <li>Refus de s'engager dans des relations sans certitude d'etre apprecie</li>
              <li>Reserves dans les relations proches par peur d'humiliation</li>
              <li>Inquietude constante d'etre critique</li>
              <li>Inhibition dans les nouvelles situations sociales</li>
              <li>Sentiment d'inferiorite et d'incompetence sociale</li>
              <li>Refus de prendre des risques ou de participer a de nouvelles activites</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Les symptomes doivent apparaitre au debut de l'age adulte.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie cognitivo-comportementale (TCC) axee sur les competences sociales</li>
                  <li>Therapies de groupe adaptees aux personnes presentant les memes difficultes</li>
                  <li>Psychotherapie psychodynamique pour explorer les conflits sous-jacents</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs (ISRS) pour reduire l'anxiete</li>
                  <li>Anxiolytiques pour faciliter l'exposition aux situations sociales</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble chronique mais ameliorable avec une prise en charge adaptee</li>
              <li>Pronostic favorable avec psychotherapie et soutien medicamenteux</li>
              <li>Importance du suivi regulier et de l'accompagnement social</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite evitante est marque par une peur persistante du rejet et une hypersensibilite a la
              critique. Bien qu'il entraine isolement et souffrance, une prise en charge combinant psychotherapie et
              pharmacotherapie peut ameliorer les competences sociales et la qualite de vie des patients.
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
              de ne pas pouvoir s'occuper d'elles-memes. Ce trouble touche moins de 1 % de la population generale et est
              diagnostique plus souvent chez les femmes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs culturels favorisant la soumission et la dependance</li>
              <li>Experiences negatives precoces (negligence, rejet, traumatismes)</li>
              <li>Tendance innee a l'anxiete</li>
              <li>Traits hereditaires : insecurite, effacement de soi</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Besoin d'etre pris en charge</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulte a prendre des decisions sans conseils ou reassurance</li>
                  <li>Dependance excessive envers une personne pour les responsabilites quotidiennes</li>
                  <li>Recherche immediate d'un nouveau soutien apres la fin d'une relation</li>
                  <li>Peur intense d'etre abandonne</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Soumission excessive</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulte a exprimer un desaccord par peur de perdre du soutien</li>
                  <li>Acceptation de taches desagreables ou de comportements abusifs pour conserver l'aide d'autrui</li>
                  <li>Malaise ou peur extreme lorsqu'elles sont seules</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Manque de confiance en soi</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Devalorisation de leurs capacites</li>
                  <li>Interpretation des critiques comme preuve d'incompetence</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Manque d'independance</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulte a initier des projets ou a travailler de maniere autonome</li>
                  <li>Evitement des responsabilites</li>
                  <li>Fonctionnement correct uniquement sous supervision</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les criteres du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Besoin excessif d'etre pris en charge</li>
              <li>
                Presence d'au moins 5 manifestations typiques (difficulte a prendre des decisions, peur de l'abandon,
                soumission excessive, etc.)
              </li>
              <li>Apparition des symptomes au debut de l'age adulte</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie cognitivo-comportementale : travail sur la peur de l'independance et l'affirmation de soi</li>
                  <li>Psychotherapie psychodynamique : exploration des conflits sous-jacents</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs (ISRS) parfois utilises pour traiter anxiete ou depression associees</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble chronique, mais ameliorable avec une prise en charge adaptee</li>
              <li>Risque de dependance relationnelle persistante</li>
              <li>Pronostic favorable avec psychotherapie et soutien regulier</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble de la personnalite dependante est marque par une soumission excessive et une peur constante de l'abandon.
              Bien qu'il entraine une souffrance relationnelle et sociale, une prise en charge precoce et adaptee, centree sur la
              psychotherapie, peut ameliorer l'autonomie et la qualite de vie des patients.
            </p>
          </section>
        </>
      ) : isAnorexieMentale ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              L'anorexie mentale est un trouble des conduites alimentaires caracterise par une peur intense de l'obesite, une
              recherche obsessionnelle de minceur et une perception deformee de l'image corporelle. Elle entraine une restriction
              alimentaire severe et un poids corporel significativement bas. La prevalence est estimee a 1,5 % chez les femmes et
              0,1 % chez les hommes, avec un debut typique a l'adolescence.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Facteurs de risque</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sexe feminin</li>
              <li>Normes culturelles valorisant la minceur</li>
              <li>Activites centrees sur le poids (gymnastique, ballet)</li>
              <li>Traits de personnalite perfectionnistes et compulsifs</li>
              <li>Antecedents familiaux et predisposition genetique</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Restriction alimentaire persistante</li>
              <li>Peur intense de prendre du poids</li>
              <li>Image corporelle distordue</li>
              <li>Preoccupation excessive pour la nourriture (comptage des calories, preparation de repas pour autrui)</li>
              <li>Vomissements provoques, usage de laxatifs ou diuretiques</li>
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
              <li>Restriction alimentaire entrainant un poids tres faible</li>
              <li>Peur intense de prendre du poids</li>
              <li>Perturbation de l'image corporelle ou deni de la gravite de la maladie</li>
            </ul>
            <p className="mt-3 text-slate-700">Outils diagnostiques :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>IMC inferieur a 17 kg/m2 chez l'adulte</li>
              <li>Percentiles de croissance chez l'enfant/adolescent</li>
              <li>Examens complementaires : bilan biologique, ECG</li>
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
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie cognitivo-comportementale (TCC)</li>
                  <li>Therapie familiale (modele Maudsley chez les adolescents)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
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
              <li>Taux de mortalite eleve (5,1/1000 personnes-annees)</li>
              <li>50 % des patients recuperent completement</li>
              <li>25 % presentent des resultats intermediaires</li>
              <li>25 % evoluent defavorablement avec rechutes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              L'anorexie mentale est un trouble grave et potentiellement mortel. Une prise en charge precoce et
              multidisciplinaire, centree sur la renutrition et la psychotherapie, ameliore le pronostic et favorise la
              recuperation. L'implication familiale est cruciale, notamment chez les adolescents.
            </p>
          </section>
        </>
      ) : isBoulimieMentale ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              La boulimie mentale est un trouble des conduites alimentaires caracterise par des episodes repetes de frenesie
              alimentaire suivis de comportements compensatoires (vomissements provoques, laxatifs, jeûne ou exercice excessif).
              Elle touche principalement les adolescents et jeunes adultes, avec une prevalence estimee a 0,5 % de la population,
              plus frequente chez les femmes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Facteurs de risque</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sexe feminin</li>
              <li>Normes culturelles valorisant la minceur</li>
              <li>Activites centrees sur la silhouette (gymnastique, danse, ballet)</li>
              <li>Antecedents familiaux de troubles alimentaires</li>
              <li>Traits de personnalite impulsifs et perfectionnistes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Frenesie alimentaire</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Consommation rapide de grandes quantites de nourriture</li>
                  <li>Sentiment de perte de controle</li>
                  <li>Episodes souvent declenches par le stress emotionnel</li>
                  <li>Preference pour les aliments sucres et riches en graisses</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Comportements compensatoires</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Vomissements provoques</li>
                  <li>Usage de laxatifs ou diuretiques</li>
                  <li>Jeûne ou regimes stricts</li>
                  <li>Exercice physique excessif</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Consequences physiques</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Poids generalement normal</li>
                  <li>Erosion de l'email dentaire</li>
                  <li>Hypertrophie des glandes salivaires</li>
                  <li>Inflammation de l'oesophage</li>
                  <li>Hypokaliemie et troubles du rythme cardiaque</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Consequences psychologiques</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Estime de soi centree sur le poids et la silhouette</li>
                  <li>Remords et culpabilite apres les crises</li>
                  <li>Depression et anxiete frequentes</li>
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
              <li>Sentiment de perte de controle</li>
              <li>Comportements compensatoires reguliers</li>
              <li>Preoccupation excessive du poids et de la silhouette</li>
            </ul>
            <p className="mt-3 text-slate-700">Signes cliniques associes :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Fluctuations de poids</li>
              <li>Glandes salivaires gonflees</li>
              <li>Cicatrices sur les doigts (vomissements provoques)</li>
              <li>Erosion dentaire</li>
              <li>Hypokaliemie</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Therapie cognitivo-comportementale (TCC) : regulation des habitudes alimentaires, reduction des preoccupations
                    liees au poids
                  </li>
                  <li>Psychotherapie interpersonnelle : amelioration des relations sociales et gestion des conflits</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs ISRS (fluoxetine) pour reduire les crises et traiter l'anxiete/depression associees</li>
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
              <li>Amelioration significative avec une prise en charge adaptee</li>
              <li>Risque de rechute si le traitement est interrompu</li>
              <li>Pronostic favorable avec psychotherapie et suivi regulier</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              La boulimie mentale est un trouble grave mais traitable. Une prise en charge precoce et multidisciplinaire,
              associant psychotherapie et pharmacotherapie, permet de reduire les crises, d'ameliorer la qualite de vie et de
              prevenir les complications physiques et psychologiques.
            </p>
          </section>
        </>
      ) : isHyperphagieBoulimique ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble hyperphagique boulimique (Binge Eating Disorder) est un trouble des conduites alimentaires caracterise
              par des episodes recurrents de consommation excessive de nourriture accompagnes d'un sentiment de perte de controle.
              Contrairement a la boulimie mentale, il n'existe pas de comportements compensatoires (vomissements, laxatifs, jeûne
              ou exercice excessif). Ce trouble touche environ 1 a 2 % des femmes et moins de 1 % des hommes, avec une prevalence
              plus elevee chez les personnes en surpoids ou obeses.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Facteurs de risque</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Sexe feminin</li>
              <li>Surpoids ou obesite</li>
              <li>Antecedents familiaux de troubles alimentaires</li>
              <li>Facteurs psychologiques : anxiete, depression</li>
              <li>Influence possible de la genetique et du microbiome intestinal</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Consommation de grandes quantites de nourriture en peu de temps</li>
              <li>Sentiment de perte de controle pendant et apres les crises</li>
              <li>Absence de comportements compensatoires</li>
              <li>Manger rapidement ou jusqu'a l'inconfort</li>
              <li>Manger sans faim reelle</li>
              <li>Manger seul par honte</li>
              <li>Sentiments de culpabilite, de degout ou de depression apres les crises</li>
            </ul>
            <h3 className="mt-4 text-base font-semibold text-slate-900">Consequences</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Association frequente avec le surpoids et l'obesite</li>
              <li>Risque accru de complications medicales : hypertension arterielle, diabete, troubles metaboliques</li>
              <li>Souffrance psychologique importante</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Criteres DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Crises de frenesie alimentaire au moins 1 fois/semaine pendant au moins 3 mois</li>
              <li>Sentiment de perte de controle</li>
              <li>
                Presence d'au moins 3 criteres : manger rapidement, manger jusqu'a l'inconfort, manger sans faim, manger seul par
                honte, culpabilite ou depression apres les crises
              </li>
              <li>Absence de comportements compensatoires</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie cognitivo-comportementale (TCC) : traitement de reference</li>
                  <li>Psychotherapie interpersonnelle : alternative efficace</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs ISRS (fluoxetine)</li>
                  <li>Lisdexamfetamine pour les formes moderees a severes</li>
                  <li>Medicaments coupe-faim (topiramate) ou inducteurs de perte de poids (orlistat)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Autres approches</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Programmes de perte de poids : efficacite limitee a court terme</li>
                  <li>Chirurgie bariatrique : amelioration possible mais resultats a long terme incertains</li>
                  <li>Groupes de soutien (Boulimiques anonymes, Dependants a la nourriture anonymes)</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Environ 50 % des patients atteignent une remission avec psychotherapie</li>
              <li>Risque de rechute si le suivi est interrompu</li>
              <li>Pronostic favorable avec une prise en charge multidisciplinaire</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble hyperphagique boulimique est une pathologie frequente et invalidante, souvent associee a l'obesite et a
              des complications medicales. Une prise en charge precoce et adaptee, centree sur la psychotherapie et parfois
              completee par un traitement medicamenteux, permet de reduire les crises et d'ameliorer la qualite de vie des patients.
            </p>
          </section>
        </>
      ) : isTdah ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble deficit de l'attention avec ou sans hyperactivite (TDAH) est un trouble du neurodeveloppement
              caracterise par trois dimensions principales :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Inattention : difficultes a maintenir l'attention, oublis frequents, distractibilite</li>
              <li>Hyperactivite motrice : agitation excessive, incapacite a rester en place</li>
              <li>Impulsivite : difficulte a attendre, tendance a interrompre les autres</li>
            </ul>
            <p className="mt-3 leading-7 text-slate-700">
              Le TDAH touche environ 5 % des enfants et peut persister a l'adolescence et a l'age adulte. Il est diagnostique
              deux fois plus souvent chez les garcons que chez les filles.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs genetiques et heredite</li>
              <li>Anomalies des neurotransmetteurs cerebraux</li>
              <li>
                Facteurs de risque : faible poids de naissance, traumatismes craniens, infections cerebrales, carences en fer,
                apnee du sommeil, exposition prenatale a l'alcool, au tabac ou a la cocaine
              </li>
              <li>Facteurs environnementaux : violence, maltraitance, negligence</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Inattention</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulte a se concentrer sur les details</li>
                  <li>Oublis frequents</li>
                  <li>Desorganisation</li>
                  <li>Difficulte a terminer les taches</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Hyperactivite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Agitation constante</li>
                  <li>Difficulte a rester assis</li>
                  <li>Activite motrice excessive</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Impulsivite</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Reponses precipitees</li>
                  <li>Difficulte a attendre son tour</li>
                  <li>Interruptions frequentes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Chez l'adulte</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Difficulte a se concentrer</li>
                  <li>Agitation</li>
                  <li>Sautes d'humeur</li>
                  <li>Difficultes relationnelles</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Presence d'au moins six signes d'inattention ou d'hyperactivite/impulsivite</li>
              <li>Symptomes presents dans au moins deux environnements (maison, ecole, travail)</li>
              <li>Symptomes persistants depuis au moins six mois</li>
              <li>Evaluation clinique, questionnaires des parents et enseignants</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Therapie comportementale</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Mise en place de routines et structures</li>
                  <li>Plan d'intervention scolaire</li>
                  <li>Techniques educatives adaptees</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Traitement medicamenteux</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Psychostimulants (methylphenidate, amphetamines)</li>
                  <li>Atomoxetine (non stimulant)</li>
                  <li>Medicaments antihypertenseurs (clonidine, guanfacine)</li>
                  <li>Antidepresseurs ou anxiolytiques dans certains cas</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Approches combinees</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie comportementale + medicaments</li>
                  <li>Collaboration entre medecins, enseignants et parents</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>La majorite des enfants atteints de TDAH deviennent des adultes productifs</li>
              <li>Les symptomes d'hyperactivite tendent a diminuer avec l'age, mais l'inattention peut persister</li>
              <li>Risques accrus en cas de non prise en charge : depression, anxiete, abus de substances, accidents</li>
              <li>Un suivi regulier et une prise en charge adaptee ameliorent le pronostic</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le TDAH est un trouble neurodeveloppemental frequent et complexe, necessitant une prise en charge precoce et
              multidisciplinaire. L'association de therapies comportementales, d'un soutien scolaire et familial, et parfois de
              traitements medicamenteux, permet de reduire les symptomes et d'ameliorer la qualite de vie des patients.
            </p>
          </section>
        </>
      ) : isTsa ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble du spectre de l'autisme (TSA) est un trouble du neurodeveloppement qui apparait des l'enfance et persiste
              tout au long de la vie. Il se caracterise par des difficultes dans la communication et les interactions sociales,
              ainsi que par des comportements et interets restreints et repetitifs. Chaque personne autiste est unique, ce qui
              explique la notion de "spectre".
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Caracteristiques principales</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>
                Communication et interactions sociales : difficultes a etablir des relations, contact visuel atypique,
                comprehension litterale du langage
              </li>
              <li>
                Comportements et interets : routines rigides, resistance au changement, interets specifiques intenses,
                stereotypies motrices ou verbales
              </li>
              <li>
                Particularites sensorielles : hypersensibilite ou hyposensibilite aux sons, lumieres, textures, odeurs
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prevalence</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>En France, environ 1 personne sur 100 est concernee</li>
              <li>Pres de 700 000 a 1 million de personnes, dont 100 000 ont moins de 20 ans</li>
              <li>Les garcons sont diagnostiques trois fois plus souvent que les filles</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Terminologie (DSM-5)</h2>
            <p className="leading-7 text-slate-700">
              Le DSM-5 regroupe sous le terme TSA plusieurs diagnostics anterieurs : autisme infantile, syndrome d'Asperger,
              autisme de Kanner, troubles envahissants du developpement, etc. Les specifications permettent d'individualiser le
              diagnostic (avec ou sans deficit intellectuel, avec ou sans alteration du langage, etc.).
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Signes d'alerte precoces</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>6 a 9 mois : absence de contact visuel, peu de sourires</li>
              <li>9 a 12 mois : absence de reponse au prenom, absence de gestes de communication</li>
              <li>1 a 2 ans : retard ou absence de langage</li>
              <li>
                Tous ages : perte de competences acquises, isolement, comportements repetitifs, reactions sensorielles atypiques
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Origine multifactorielle</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs genetiques predominants (plus de 80 % d'heritabilite)</li>
              <li>Facteurs environnementaux perinataux</li>
              <li>Anomalies precoces du neurodeveloppement</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prise en charge</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Interventions precoces : depistage des 18 mois pour ameliorer le pronostic</li>
              <li>
                Approche pluridisciplinaire : soins psycho-educatifs, orthophonie, ergotherapie, accompagnement familial
              </li>
              <li>
                Objectifs : developper les competences sociales, cognitives et sensorielles, favoriser l'autonomie et l'inclusion
                scolaire et sociale
              </li>
              <li>
                Medicaments : aucun traitement specifique du TSA, mais certains medicaments peuvent traiter les comorbidites
                (epilepsie, anxiete, depression)
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Recherche et strategie nationale</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Recherche pluridisciplinaire (genetique, neurosciences, sciences sociales)</li>
              <li>
                Strategie nationale TND 2023-2027 : reperage precoce, accompagnement tout au long de la vie, inclusion scolaire
                et sociale, soutien aux familles
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble du spectre de l'autisme est une condition complexe et multifactorielle. Bien qu'il ne puisse etre "gueri",
              une prise en charge adaptee et precoce permet d'ameliorer significativement la qualite de vie et l'inclusion des
              personnes concernees. La reconnaissance de la diversite des profils et la mise en place de strategies individualisees
              sont essentielles pour repondre aux besoins specifiques de chaque personne autiste.
            </p>
          </section>
        </>
      ) : isGillesTourette ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le syndrome de Gilles de la Tourette est un trouble neurologique caracterise par la presence de tics moteurs et
              vocaux persistants pendant plus d'un an. Les tics sont des mouvements ou vocalisations soudains, rapides, repetes
              et non rythmiques. Ils apparaissent generalement dans l'enfance, entre 4 et 7 ans, atteignent un pic vers 11 ans,
              puis diminuent souvent a l'adolescence.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Prevalence et evolution</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prevalence : environ 0,5 a 1 % des enfants</li>
              <li>Rapport garcons/filles : 3 a 4 pour 1</li>
              <li>
                La majorite des enfants voient leurs symptomes s'attenuer a l'adolescence, mais 25 % gardent des tics moderes ou
                severes a l'age adulte
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Classification des troubles de tics (DSM-5-TR)</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Tics provisoires : moteurs et/ou vocaux, presents depuis moins d'un an</li>
              <li>Tics persistants (chroniques) : moteurs ou vocaux (mais pas les deux), presents depuis plus d'un an</li>
              <li>Syndrome de Gilles de la Tourette : presence de tics moteurs et vocaux pendant plus d'un an</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Tics moteurs simples : clignements, grimaces, haussements d'epaules</li>
              <li>Tics moteurs complexes : association de plusieurs tics, copropraxie (gestes obscenes), echopraxie (imitation)</li>
              <li>Tics vocaux simples : grognements, reniflements, raclements de gorge</li>
              <li>Tics vocaux complexes : coprolalie (proferer des obscenites), echolalie (repetition de mots ou phrases)</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Les tics fluctuent en intensite et frequence, sont aggraves par le stress et la fatigue, mais diminuent lors
              d'activites engageantes. Ils ne surviennent pas pendant le sommeil.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Comorbidites frequentes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble deficit de l'attention avec ou sans hyperactivite (TDAH)</li>
              <li>Trouble obsessionnel-compulsif (TOC)</li>
              <li>Troubles anxieux</li>
              <li>Troubles de l'apprentissage</li>
              <li>Chez l'adolescent/adulte : depression, trouble bipolaire, addictions</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Causes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Origine multifactorielle, avec forte composante genetique</li>
              <li>Dysfonctionnement dopaminergique impliquant les circuits moteurs et sensoriels</li>
              <li>Facteurs environnementaux (stress, infections comme PANDAS) peuvent jouer un role</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Base sur l'anamnese et l'examen clinique</li>
              <li>Criteres : tics moteurs et vocaux presents depuis plus d'un an, debut avant 18 ans</li>
              <li>Diagnostic differentiel : exclure les tics secondaires lies a substances ou autres maladies neurologiques</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Approches comportementales</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Intervention comportementale globale pour les tics (CBIT) : therapie cognitivo-comportementale, inversion
                    d'habitudes, relaxation
                  </li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Medicaments</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Agonistes alpha-adrenergiques (clonidine, guanfacine) : premiere intention pour tics legers/moderes, surtout
                    avec TDAH
                  </li>
                  <li>Antipsychotiques (aripiprazole, haloperidol, pimozide) : deuxieme intention pour tics severes</li>
                  <li>Autres options : fluphenazine, topiramate, toxine botulique</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Prise en charge des comorbidites</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>TDAH : stimulants a faible dose ou atomoxetine</li>
                  <li>TOC : ISRS</li>
                  <li>Troubles anxieux : clonidine, guanfacine</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>La majorite des enfants voient une amelioration a l'adolescence</li>
              <li>Les tics peuvent persister a l'age adulte chez une minorite</li>
              <li>Une prise en charge adaptee ameliore la qualite de vie et reduit l'impact social et psychologique</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le syndrome de Gilles de la Tourette est un trouble neurologique complexe, souvent associe a des comorbidites. Bien
              qu'il ne puisse etre gueri, une prise en charge combinant therapies comportementales, traitements medicamenteux
              adaptes et soutien scolaire et familial permet de reduire les symptomes et d'ameliorer le quotidien des patients.
            </p>
          </section>
        </>
      ) : isBipolaireTypeIOrII ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Les troubles bipolaires sont des troubles de l'humeur caracterises par l'alternance d'episodes
              maniaques/hypomaniaques et depressifs. Ils debutent generalement a l'adolescence ou au debut de l'age adulte et
              touchent environ 2 % de la population au cours de la vie. La bipolarite se presente sous plusieurs formes, dont
              les types I et II, qui different par la severite et la nature des episodes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Etiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs genetiques : forte composante hereditaire, concordance elevee chez les jumeaux monozygotes</li>
              <li>Neurobiologie : dysregulation des neurotransmetteurs (serotonine, dopamine, noradrenaline)</li>
              <li>Facteurs psychosociaux : evenements de vie stressants, traumatismes</li>
              <li>Substances et medicaments : cocaine, amphetamines, corticosteroides, certains antidepresseurs</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Manie (Type I)</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Humeur elevee, expansive ou irritable pendant au moins 1 semaine</li>
                  <li>Estime de soi exageree, idees de grandeur</li>
                  <li>Reduction du besoin de sommeil</li>
                  <li>Logorrhee, fuite des idees</li>
                  <li>Distractibilite</li>
                  <li>Activite excessive, comportements a risque</li>
                  <li>Possibles symptomes psychotiques (delires, hallucinations)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Hypomanie (Type II)</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Humeur elevee ou irritable pendant au moins 4 jours</li>
                  <li>Augmentation de l'energie et de l'activite</li>
                  <li>Reduction du besoin de sommeil</li>
                  <li>Fonctionnement social/professionnel relativement preserve</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Depression</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Humeur depressive persistante</li>
                  <li>Anhedonie</li>
                  <li>Fatigue, perte d'energie</li>
                  <li>Troubles du sommeil et de l'appetit</li>
                  <li>Sentiment de devalorisation, culpabilite excessive</li>
                  <li>Idees suicidaires frequentes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Etats mixtes et cycles rapides</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Association simultanee de symptomes maniaques/hypomaniaques et depressifs</li>
                  <li>Risque suicidaire particulierement eleve</li>
                  <li>Cycles rapides : au moins 4 episodes par an</li>
                  <li>Pronostic plus defavorable</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les criteres du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Type I : au moins un episode maniaque, souvent associe a des episodes depressifs</li>
              <li>
                Type II : au moins un episode hypomaniaque et un episode depressif majeur, sans episode maniaque complet
              </li>
            </ul>
            <p className="mt-3 text-slate-700">Examens complementaires :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Bilan thyroidien (TSH, T4)</li>
              <li>Depistage de substances</li>
              <li>Examens biologiques pour exclure causes organiques</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic differentiel : troubles anxieux, depression unipolaire, troubles schizoaffectifs, hyperthyroidie,
              pheochromocytome.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Stabilisateurs de l'humeur : lithium, valproate, carbamazepine, lamotrigine</li>
                  <li>
                    Antipsychotiques de 2e generation : aripiprazole, olanzapine, quetiapine, risperidone, ziprasidone, cariprazine
                  </li>
                  <li>Antidepresseurs : parfois utilises en association, jamais en monotherapie</li>
                  <li>Ketamine/esketamine : option dans les depressions bipolaires resistantes</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Autres traitements</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Electroconvulsivotherapie (ECT)</li>
                  <li>Stimulation magnetique transcranienne (rTMS)</li>
                  <li>Phototherapie (troubles saisonniers)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie et psychoeducation</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie individuelle et de groupe</li>
                  <li>Psychoeducation pour reconnaitre les signes precoces de rechute</li>
                  <li>Soutien familial et social</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Evolution chronique avec alternance de remissions et rechutes</li>
              <li>Risque suicidaire eleve (20 a 30 fois superieur a la population generale)</li>
              <li>Pronostic ameliore par une prise en charge precoce et un suivi regulier</li>
              <li>Importance du traitement d'entretien et de la prevention des rechutes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Les troubles bipolaires de type I et II sont des pathologies psychiatriques severes, invalidantes et a haut risque
              suicidaire. Une prise en charge multimodale, associant stabilisateurs de l'humeur, antipsychotiques, psychotherapie
              et psychoeducation, permet de reduire la frequence et l'intensite des episodes et d'ameliorer la qualite de vie des
              patients.
            </p>
          </section>
        </>
      ) : isTroublesDepressifs ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Les troubles depressifs regroupent plusieurs formes de depression caracterisees par une tristesse persistante, une
              perte d'interet ou de plaisir (anhedonie), et une alteration du fonctionnement quotidien. Ils incluent le trouble
              depressif majeur, le trouble depressif persistant (dysthymie), le trouble dysphorique premenstruel, le trouble de
              deuil prolonge et d'autres formes specifiques ou non specifiees. Leur origine est multifactorielle : genetique,
              neurobiologique, endocrinienne et psychosociale.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Etiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Facteurs genetiques : heredite impliquee dans environ 50 % des cas, forte concordance chez les jumeaux monozygotes</li>
              <li>Neurotransmetteurs : anomalies de la regulation serotoninergique, dopaminergique, noradrenergique, glutamatergique</li>
              <li>Neuroendocrinologie : dysfonctionnement des axes hypothalamo-hypophyso-surrenal, thyroidien et hormone de croissance</li>
              <li>Facteurs psychosociaux : stress majeurs, pertes, separations, vulnerabilite individuelle</li>
              <li>Facteurs medicaux : pathologies endocriniennes, neurologiques, infectieuses, maladies chroniques</li>
              <li>Substances et medicaments : corticosteroides, beta-bloqueurs, alcool, amphetamines</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomatologie</h2>
            <p className="text-slate-700">Les symptomes incluent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Humeur depressive persistante</li>
              <li>Anhedonie</li>
              <li>Fatigue, baisse d'energie</li>
              <li>Troubles du sommeil (insomnie ou hypersomnie)</li>
              <li>Modifications de l'appetit et du poids</li>
              <li>Troubles cognitifs (concentration, memoire, indecision)</li>
              <li>Sentiment de devalorisation, culpabilite excessive</li>
              <li>Idees suicidaires ou comportements suicidaires</li>
            </ul>

            <h3 className="mt-4 text-base font-semibold text-slate-900">Formes cliniques</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble depressif majeur : au moins 5 symptomes pendant au moins 2 semaines, dont humeur depressive ou anhedonie</li>
              <li>Trouble depressif persistant (dysthymie) : symptomes pendant au moins 2 ans, humeur sombre chronique</li>
              <li>Trouble dysphorique premenstruel : symptomes lies au cycle menstruel, severes et invalidants</li>
              <li>Trouble de deuil prolonge : tristesse persistante pendant au moins 1 an apres une perte, avec souffrance invalidante</li>
              <li>Autres troubles depressifs : symptomes depressifs significatifs sans repondre aux criteres complets</li>
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
              <li>Anamnese clinique et criteres DSM-5-TR</li>
              <li>Exclusion de causes medicales (NFS, TSH, vitamine B12, folates)</li>
              <li>Differenciation avec demoralisation, chagrin, troubles anxieux, troubles bipolaires</li>
              <li>Utilisation d'outils de depistage (PHQ-9, Beck Depression Inventory)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie cognitivo-comportementale (TCC)</li>
                  <li>Therapie interpersonnelle</li>
                  <li>Soutien psychologique et psychoeducation</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ISRS, IRSN, modulateurs serotoninergiques</li>
                  <li>Antidepresseurs tricycliques, IMAO</li>
                  <li>Ketamine et esketamine (formes resistantes)</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                <h3 className="text-base font-semibold text-slate-900">Autres traitements</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Electroconvulsivotherapie (ECT)</li>
                  <li>Stimulation magnetique transcranienne (rTMS)</li>
                  <li>Activite physique, hygiene de vie</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Evolution variable : episodes isoles ou recurrents</li>
              <li>Risque eleve de recidive apres un premier episode</li>
              <li>Pronostic ameliore par une prise en charge precoce et adaptee</li>
              <li>Importance du suivi regulier, du traitement d'entretien et de la prevention des rechutes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Les troubles depressifs sont frequents et invalidants, affectant profondement la qualite de vie. Une approche
              multimodale combinant psychotherapie, pharmacotherapie et interventions complementaires permet une amelioration
              significative. La reconnaissance precoce des symptomes et l'acces aux soins specialises sont essentiels pour reduire
              la souffrance et prevenir les complications.
            </p>
          </section>
        </>
      ) : isTroublePanique ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble panique est un trouble anxieux caracterise par la survenue repetee d'attaques de panique inattendues et
              imprevisibles. Ces crises se manifestent par une peur intense et des symptomes somatiques marques. Le trouble panique
              s'accompagne souvent d'une anxiete anticipatoire et de comportements d'evitement, entrainant une alteration du
              fonctionnement social, professionnel et familial.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <p className="text-slate-700">
              Une attaque de panique implique l'apparition soudaine d'une peur ou d'un malaise intense, accompagnee d'au moins 4
              des symptomes suivants :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Palpitations, tachycardie</li>
              <li>Transpiration excessive, bouffees de chaleur</li>
              <li>Tremblements, frissons</li>
              <li>Sensation d'etouffement ou d'etranglement</li>
              <li>Douleur ou gene thoracique</li>
              <li>Nausees, gene abdominale</li>
              <li>Vertiges, instabilite, impression d'evanouissement</li>
              <li>Derealisation ou depersonnalisation</li>
              <li>Peur de perdre le controle ou de devenir fou</li>
              <li>Peur de mourir</li>
            </ul>
            <p className="mt-3 text-slate-700">Le trouble panique se caracterise egalement par :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Inquietude persistante concernant la survenue de nouvelles crises</li>
              <li>Comportements d'evitement des situations ou lieux associes aux crises</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur les criteres du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Attaques de panique recurrentes et inattendues</li>
              <li>
                Au moins une attaque suivie pendant au moins 1 mois de :
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                  <li>Inquietude persistante d'avoir d'autres attaques ou de leurs consequences</li>
                  <li>Modification comportementale inadaptee (evitement, restriction des activites)</li>
                </ul>
              </li>
            </ul>
            <p className="mt-3 text-slate-700">
              Examens complementaires : bilan medical pour exclure une cause organique (troubles cardiaques, endocriniens,
              respiratoires) ou l'effet de substances.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Comorbidites frequentes : depression majeure, autres troubles anxieux, trouble bipolaire, abus d'alcool, troubles
              cardiaques ou respiratoires.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Therapie cognitivo-comportementale (TCC) : identification et correction des pensees dysfonctionnelles,
                    exposition graduee aux situations anxiogenes, techniques de relaxation et de respiration
                  </li>
                  <li>Strategies complementaires : pleine conscience, meditation, hypnose, exercices de respiration</li>
                </ul>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs : ISRS (ex. sertraline, paroxetine), IRSN (ex. venlafaxine), tricycliques, IMAO</li>
                  <li>Benzodiazepines : anxiolytiques a action rapide, usage limite en raison du risque de dependance</li>
                  <li>
                    Association antidepresseurs + benzodiazepines : parfois utilisee en debut de traitement, avec reduction
                    progressive des benzodiazepines
                  </li>
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  Le traitement est individualise selon la severite et la presence de comportements d'evitement. La duree du
                  traitement medicamenteux est souvent de plusieurs mois, voire annees, pour prevenir les rechutes.
                </p>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prevalence : 2-3 % de la population sur 12 mois</li>
              <li>Attaques de panique isolees : jusqu'a 11 % de la population en 1 an</li>
              <li>Debut habituel : fin de l'adolescence ou debut de l'age adulte</li>
              <li>Femmes deux fois plus touchees que les hommes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Evolution souvent fluctuante et chronique</li>
              <li>Certains patients guerissent spontanement, d'autres necessitent une prise en charge prolongee</li>
              <li>Importance du suivi regulier pour ajuster le traitement et prevenir les rechutes</li>
              <li>
                Psychoeducation et soutien psychologique essentiels pour limiter l'evitement et restaurer le fonctionnement
                quotidien
              </li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le trouble panique est un trouble anxieux invalidant, marque par des crises de panique recurrentes et une anxiete
              anticipatoire. Une prise en charge adaptee, combinant psychotherapie et pharmacotherapie, permet de reduire la
              frequence et l'intensite des crises, d'ameliorer la qualite de vie et de prevenir les rechutes.
            </p>
          </section>
        </>
      ) : isAgoraphobie ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              L'agoraphobie est un trouble anxieux caracterise par une peur ou une anxiete intense face a des situations ou il
              pourrait etre difficile de s'echapper ou d'obtenir de l'aide en cas de crise. Elle entraine souvent des comportements
              d'evitement et peut perturber considerablement la vie quotidienne, parfois jusqu'a confiner la personne chez elle.
              Environ 2 % des adultes souffrent d'agoraphobie chaque annee, avec une prevalence plus elevee chez les femmes. Elle
              debute frequemment a l'adolescence ou au debut de l'age adulte.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <p className="text-slate-700">Les situations typiquement redoutees incluent :</p>
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
              <li>Incapacite a raisonner l'anxiete</li>
              <li>Planification de strategies d'evitement</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">
              Le diagnostic repose sur un examen clinique et les criteres psychiatriques standards (DSM-5). Les criteres incluent :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur ou anxiete persistante (au moins 6 mois)</li>
              <li>
                Presence d'au moins deux situations typiques (transports, espaces ouverts/clos, foule, isolement hors domicile)
              </li>
              <li>Symptomes disproportionnes par rapport au danger reel</li>
              <li>Souffrance significative ou alteration du fonctionnement</li>
              <li>Exclusion d'autres troubles mentaux ou pathologies generales</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Therapie d'exposition : confrontation progressive aux situations redoutees, efficace chez plus de 90 % des
                    patients
                  </li>
                  <li>
                    Therapie cognitivo-comportementale (TCC) : identification et correction des pensees deformees, modification des
                    comportements
                  </li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie et regulation</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ISRS (inhibiteurs selectifs de la recapture de la serotonine) : efficaces dans certains cas</li>
                  <li>Strategies de relaxation : respiration, meditation, pleine conscience</li>
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  Le traitement est individualise et peut associer psychotherapie et pharmacotherapie. L'approche precoce ameliore
                  le pronostic.
                </p>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prevalence : environ 2 % des adultes chaque annee</li>
              <li>Femmes plus touchees que les hommes</li>
              <li>Debut frequent a l'adolescence ou au debut de l'age adulte</li>
              <li>Souvent associe au trouble panique (30 a 50 % des cas)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Evolution variable : intensite fluctuante, parfois disparition spontanee</li>
              <li>Risque de chronicite si non traite</li>
              <li>Importance du suivi regulier et de la psychoeducation</li>
              <li>Traitement precoce associe a une meilleure recuperation</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              L'agoraphobie est un trouble anxieux invalidant qui limite fortement la vie quotidienne. Une prise en charge adaptee,
              combinant therapie d'exposition, TCC et parfois pharmacotherapie, permet aux patients de reprendre le controle de leur
              vie et de reduire significativement l'impact fonctionnel.
            </p>
          </section>
        </>
      ) : isPhobieSociale ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble d'anxiete sociale, ou phobie sociale, est un trouble anxieux caracterise par une peur intense et
              persistante des situations sociales ou de performance. Les personnes atteintes craignent d'etre observees, jugees
              negativement, humiliees ou rejetees. Cette anxiete entraine souvent des comportements d'evitement et une souffrance
              significative, alterant la vie quotidienne. La prevalence est estimee a environ 13 % au cours de la vie, avec une
              frequence annuelle de 9 % chez les femmes et 7 % chez les hommes.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <p className="text-slate-700">Les situations typiquement redoutees incluent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Parler en public</li>
              <li>Realiser une tache devant autrui (lecture, musique)</li>
              <li>Manger en presence d'autres personnes</li>
              <li>Rencontrer des inconnus</li>
              <li>Tenir une conversation</li>
              <li>Signer un document devant temoins</li>
              <li>Utiliser des toilettes publiques</li>
            </ul>
            <p className="mt-3 text-slate-700">Les manifestations comprennent :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Crainte d'etre juge ou rejete</li>
              <li>Peur d'offenser autrui</li>
              <li>Evitement des situations sociales</li>
              <li>Symptomes physiques : transpiration, rougissement, tremblements, voix tremblante, nausees</li>
              <li>Crises de panique dans les contextes sociaux</li>
            </ul>
            <h3 className="mt-4 text-base font-semibold text-slate-900">Anxiete de performance</h3>
            <p className="mt-1 text-slate-700">Forme particuliere de phobie sociale, caracterisee par :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur demesuree de l'echec</li>
              <li>Pensees negatives avant, pendant ou apres une evaluation</li>
              <li>Stress, insomnie, crises de panique</li>
              <li>Recherche excessive de perfection et validation externe</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">
              Le diagnostic repose sur un examen clinique et les criteres psychiatriques standards (DSM-5) :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur ou anxiete intense, persistante depuis au moins 6 mois</li>
              <li>Presence dans une ou plusieurs situations sociales</li>
              <li>Crainte d'une evaluation negative par autrui</li>
              <li>Evitement ou endurance avec malaise</li>
              <li>Disproportion par rapport au danger reel</li>
              <li>Souffrance significative ou alteration du fonctionnement</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic differentiel : agoraphobie, trouble panique, dysmorphophobie.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie d'exposition : confrontation progressive aux situations sociales redoutees</li>
                  <li>
                    Therapie cognitivo-comportementale (TCC) : techniques de relaxation, identification et correction des pensees
                    dysfonctionnelles, modification des comportements
                  </li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>ISRS (inhibiteurs selectifs de la recapture de la serotonine) : traitement de premiere intention</li>
                  <li>Benzodiazepines : anxiolytiques a action rapide, usage limite en raison du risque de dependance</li>
                  <li>
                    Betabloquants : reduction des symptomes physiques (tachycardie, tremblements) dans les situations de
                    performance
                  </li>
                </ul>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prevalence vie entiere : environ 13 %</li>
              <li>Prevalence annuelle : 9 % chez les femmes, 7 % chez les hommes</li>
              <li>Debut frequent apres la puberte</li>
              <li>Facteurs de risque : timidite infantile, faible estime de soi, perfectionnisme, attentes parentales elevees</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble souvent chronique si non traite</li>
              <li>Amelioration significative avec psychotherapie et/ou pharmacotherapie</li>
              <li>Importance du suivi regulier et de la psychoeducation</li>
              <li>Prevention des rechutes par maintien therapeutique et strategies d'adaptation</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              La phobie sociale est un trouble anxieux frequent et invalidant, qui limite fortement les interactions sociales et
              professionnelles. Une prise en charge adaptee, combinant therapie cognitivo-comportementale, exposition et traitement
              pharmacologique, permet de reduire l'anxiete, d'ameliorer la qualite de vie et de restaurer le fonctionnement social.
            </p>
          </section>
        </>
      ) : isTag ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Le trouble anxieux generalise (TAG) est un trouble psychiatrique caracterise par une anxiete excessive, diffuse et
              persistante, difficilement controlable. Cette anxiete est presente la plupart des jours pendant au moins six mois et
              entraine une alteration significative du fonctionnement social, professionnel ou familial. Le TAG est frequemment
              associe a d'autres pathologies psychiatriques, telles que la depression majeure ou les troubles lies a l'usage de
              substances.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>
                Inquietude constante et disproportionnee, concernant plusieurs domaines (sante, finances, travail, relations,
                securite)
              </li>
              <li>Agitation, nervosite, hypervigilance</li>
              <li>Fatigue excessive et baisse d'energie</li>
              <li>Difficultes de concentration et troubles de la memoire</li>
              <li>Irritabilite frequente</li>
              <li>Tension musculaire, cephalees, douleurs dorsales ou cervicales</li>
              <li>Troubles du sommeil (insomnie, reveils nocturnes, sommeil non reparateur)</li>
            </ul>
            <p className="mt-3 text-slate-700">
              Ces symptomes entrainent une souffrance significative et une alteration du fonctionnement quotidien.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Anamnese clinique et criteres psychiatriques standardises (DSM-5, CIM-10)</li>
              <li>Presence d'une anxiete excessive sur plusieurs themes, la plupart des jours pendant au moins 6 mois</li>
              <li>Au moins trois symptomes associes (agitation, fatigue, troubles du sommeil, etc.)</li>
            </ul>
            <p className="mt-3 text-slate-700">
              Examens complementaires : bilan biologique cible pour exclure une cause organique (hyperthyroidie, pathologies
              neurologiques) ou medicamenteuse.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Diagnostic differentiel : depression majeure, trouble panique, trouble obsessionnel-compulsif, phobies specifiques.
              Comorbidites frequentes : depression, autres troubles anxieux, usage de substances.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>
                    Therapie cognitivo-comportementale (TCC) : restructuration cognitive, gestion de la rumination, techniques
                    de relaxation, exposition graduee aux inquietudes
                  </li>
                  <li>Autres approches : therapies interpersonnelles, therapies basees sur la pleine conscience</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs : ISRS (ex. escitalopram, sertraline), IRSN (ex. venlafaxine, duloxetine)</li>
                  <li>Benzodiazepines : effet rapide, usage court terme (risque de dependance)</li>
                  <li>Buspirone : alternative non sedative, delai d'action de 2 semaines</li>
                  <li>Phytotherapie (valeriane, kawa) : efficacite non confirmee, prudence vis-a-vis des interactions</li>
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  La prise en charge associe souvent psychotherapie et traitement medicamenteux, adaptes a la severite des
                  symptomes.
                </p>
              </article>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Epidemiologie</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Prevalence : 2-4 % des adultes chaque annee</li>
              <li>Femmes deux fois plus touchees que les hommes</li>
              <li>Debut frequent a l'age adulte, mais possible a tout age</li>
              <li>Evolution chronique et fluctuante, aggravee par les periodes de stress</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Pronostic et suivi</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>Trouble souvent persistant sur plusieurs annees, avec phases d'exacerbation</li>
              <li>Pronostic ameliore par une prise en charge precoce et multimodale</li>
              <li>Importance du suivi regulier pour ajuster le traitement et prevenir les rechutes</li>
              <li>Hygiene de vie recommandee : sommeil regulier, activite physique, reduction de l'alcool et des stimulants</li>
              <li>Orientation vers psychiatre en cas de resistance au traitement ou comorbidite severe</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Le TAG est un trouble anxieux frequent et invalidant. Une prise en charge adaptee, combinant psychotherapie et
              pharmacotherapie, permet d'ameliorer significativement la qualite de vie des patients. La reconnaissance precoce des
              symptomes et l'acces a un suivi specialise sont essentiels pour limiter l'impact fonctionnel et prevenir les rechutes.
            </p>
          </section>
        </>
      ) : isPhobiesSpecifiques ? (
        <>
          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p className="leading-7 text-slate-700">
              Les phobies specifiques sont des peurs intenses, irrationnelles et persistantes liees a des objets, situations ou
              circonstances particulieres. Elles entrainent une anxiete immediate et des comportements d'evitement. Bien que la
              personne reconnaisse souvent le caractere excessif de sa peur, celle-ci reste envahissante et peut perturber le
              fonctionnement quotidien. Les phobies specifiques representent le trouble anxieux le plus frequent.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Symptomes</h2>
            <p className="text-slate-700">
              Les personnes atteintes developpent une peur ou une anxiete marquee en presence de l'objet ou de la situation
              phobogene. Les symptomes incluent :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Palpitations, tachycardie</li>
              <li>Tremblements, secousses musculaires</li>
              <li>Transpiration excessive</li>
              <li>Douleurs musculaires</li>
              <li>Maux de ventre, diarrhee</li>
              <li>Confusion</li>
              <li>Crises de panique dans les cas severes</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Diagnostic</h2>
            <p className="text-slate-700">Le diagnostic repose sur l'anamnese clinique et les criteres du DSM-5-TR :</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              <li>Peur ou anxiete persistante (au moins 6 mois) liee a un objet ou une situation specifique</li>
              <li>Declenchement quasi systematique de la peur ou de l'anxiete</li>
              <li>Evitement actif de la situation ou de l'objet</li>
              <li>Reaction disproportionnee par rapport au danger reel</li>
              <li>Souffrance significative ou alteration du fonctionnement social/professionnel</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Diagnostic differentiel : autres troubles anxieux, depression, troubles bipolaires, troubles lies aux substances,
              troubles de la personnalite.
            </p>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Types frequents de phobies specifiques</h2>
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
              <li>Prevalence annuelle : environ 8 % des femmes et 3 % des hommes</li>
              <li>Prevalence vie entiere : environ 9 % de la population</li>
              <li>Debut frequent des l'enfance ou l'adolescence, mais possible a tout age</li>
              <li>Facteurs de risque : biologiques, hereditaires, individuels et environnementaux</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-semibold">Traitement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Psychotherapie</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Therapie d'exposition : confrontation progressive a l'objet ou la situation redoutee</li>
                  <li>Therapie cognitivo-comportementale (TCC) : modification des pensees et comportements dysfonctionnels</li>
                  <li>Hypnose : parfois utilisee comme complement</li>
                </ul>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-semibold text-slate-900">Pharmacotherapie et autres approches</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>Antidepresseurs (ISRS, IRSN)</li>
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
              <li>Evolution variable selon la severite et l'objet de la phobie</li>
              <li>Amelioration significative avec une prise en charge adaptee</li>
              <li>Importance d'un suivi regulier pour prevenir les rechutes</li>
              <li>Risque de complications si non traite (isolement, alteration du fonctionnement, refus de soins medicaux)</li>
            </ul>
          </section>

          <section className="surface-card rounded-2xl p-5">
            <h2 className="mb-2 text-xl font-semibold">Conclusion</h2>
            <p className="leading-7 text-slate-700">
              Les phobies specifiques sont des troubles anxieux frequents et invalidants. Une prise en charge precoce, reposant
              principalement sur la therapie d'exposition et la TCC, permet de reduire l'anxiete et de restaurer le fonctionnement
              quotidien. Les traitements pharmacologiques peuvent etre utilises en complement. La reconnaissance et le traitement de
              ces phobies ameliorent considerablement la qualite de vie des patients.
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
                href={`/tests/${trouble.test.slug}`}
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
