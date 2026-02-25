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
    alt: "Adolescente stressée en contexte scolaire, regard inquiet",
    rationale: "L'image montre une anxiété fonctionnelle du quotidien, facilement identifiable par les jeunes.",
  },
  "depression-majeure": {
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune assis seul avec posture repliée, ambiance réaliste d'isolement",
    rationale: "Le visuel reflète l'isolement et la perte d'élan sans dramatisation excessive.",
  },
  "toc": {
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent vérifiant à répétition son matériel scolaire",
    rationale: "La répétition comportementale est visible et relie la fiche à des situations concrètes.",
  },
  "phobie-sociale": {
    imageUrl: "https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en retrait pendant une interaction de groupe",
    rationale: "Le contraste entre groupe et retrait aide à comprendre la peur du jugement social.",
  },
  "anorexie-mentale": {
    imageUrl: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescente en réflexion face à un repas",
    rationale: "L'image recentre le trouble sur le vécu alimentaire quotidien de façon bienveillante.",
  },
  "boulimie": {
    imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune devant une table de nourriture avec expression de tension émotionnelle",
    rationale: "Le visuel évoque la perte de contrôle alimentaire et la charge émotionnelle associée.",
  },
  "tdah": {
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
    alt: "Élève distrait en classe avec difficulté de concentration",
    rationale: "Le contexte scolaire facilite la compréhension des symptômes d'inattention.",
  },
  "tsa": {
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en interaction guidée, illustrant les enjeux de communication sociale",
    rationale: "L'image soutient une lecture non stigmatisante des particularités sociales.",
  },
};

const visualsByCategory: Record<string, TroubleVisual> = {
  "troubles-anxieux": {
    imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en situation de stress scolaire",
    rationale: "Image réaliste d'anxiété en contexte adolescent.",
  },
  "troubles-humeur": {
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune isolé avec posture fermée",
    rationale: "Représentation claire des difficultés thymiques.",
  },
  "troubles-traumatisme-stress": {
    imageUrl: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent en état d'hypervigilance émotionnelle",
    rationale: "Le visuel évoque le vécu post-événement stressant.",
  },
  "troubles-personnalite": {
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeunes en interaction sociale avec émotions contrastées",
    rationale: "Pertinent pour les enjeux relationnels et émotionnels.",
  },
  "troubles-conduites-alimentaires": {
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent face à l'alimentation et à l'image corporelle",
    rationale: "Permet une représentation contextualisée et non caricaturale.",
  },
  "troubles-neurodeveloppementaux": {
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    alt: "Élève nécessitant des adaptations attentionnelles en classe",
    rationale: "Montre les difficultés dans des environnements concrets.",
  },
};

function getVisual(slug: string, categorySlug: string): TroubleVisual {
  return (
    visualsBySlug[slug] ??
    visualsByCategory[categorySlug] ?? {
      imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
      alt: "Adolescent en réflexion émotionnelle",
      rationale: "Image générale de santé mentale adaptée au public adolescent.",
    }
  );
}

export function generateStaticParams() {
  return troubles.map((trouble) => ({ slug: trouble.slug }));
}

function testStatusLabel(status: "implemented" | "adapted" | "planned" | "undefined") {
  if (status === "implemented") return "Implémenté";
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

