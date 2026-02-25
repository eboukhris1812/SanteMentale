import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getTroublesByCategorySlug, troubleCategories } from "@/lib/content/mentalHealthCatalog";

type CategoryVisual = {
  imageUrl: string;
  alt: string;
  rationale: string;
};

const categoryVisuals: Record<string, CategoryVisual> = {
  "troubles-anxieux": {
    imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescente pensivement assise en classe avec signes de stress scolaire",
    rationale: "Cette image normalise l'anxiété en contexte quotidien et facilite l'identification chez les adolescents.",
  },
  "troubles-humeur": {
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
    alt: "Jeune isolé sur un banc avec posture fermée, illustrant un état dépressif",
    rationale: "La scène traduit l'isolement émotionnel sans stigmatisation ni sensationnalisme.",
  },
  "troubles-traumatisme-stress": {
    imageUrl: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescent regardant au loin avec tension émotionnelle après un événement stressant",
    rationale: "Le visuel suggère l'hypervigilance et la charge émotionnelle de manière humaine et respectueuse.",
  },
  "troubles-personnalite": {
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    alt: "Groupe de jeunes en interaction sociale avec expressions émotionnelles variées",
    rationale: "L'image met l'accent sur les dynamiques relationnelles, enjeu central de ces troubles.",
  },
  "troubles-conduites-alimentaires": {
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
    alt: "Adolescente face à un repas en contexte de questionnement alimentaire et corporel",
    rationale: "Le cadrage recentre le sujet sur le vécu quotidien plutôt que sur des représentations extrêmes.",
  },
  "troubles-neurodeveloppementaux": {
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
    alt: "Élève adolescent en classe avec besoin de concentration et adaptation pédagogique",
    rationale: "Cette scène contextualise les difficultés d'attention et d'apprentissage en milieu réel.",
  },
};

function getVisual(slug: string): CategoryVisual {
  return (
    categoryVisuals[slug] ?? {
      imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1600&q=80",
      alt: "Adolescent en situation de réflexion émotionnelle",
      rationale: "Image générale de santé mentale pour un repère visuel clair.",
    }
  );
}

export function generateStaticParams() {
  return troubleCategories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const items = getTroublesByCategorySlug(category.slug);
  const visual = getVisual(category.slug);

  return (
    <div className="space-y-6">
      <header className="surface-card rounded-3xl p-6 md:p-8">
        <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 md:text-sm">
          Catégorie
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{category.name}</h1>
        <p className="mt-2 max-w-4xl text-slate-700">{category.description}</p>
      </header>

      <section className="surface-card overflow-hidden rounded-3xl">
        <img src={visual.imageUrl} alt={visual.alt} className="h-64 w-full object-cover md:h-[420px]" />
        <div className="border-t border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-700">Pourquoi cette image ?</p>
          <p className="mt-1 text-sm text-slate-600">{visual.rationale}</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((trouble) => (
          <article key={trouble.slug} className="surface-card rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-slate-900">{trouble.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{trouble.summary}</p>
            {trouble.test && (
              <p className="mt-3 text-sm text-slate-600">
                Test associé: <span className="font-medium">{trouble.test.code}</span>{" "}
                (
                {trouble.test.status === "implemented"
                  ? "implémenté"
                  : trouble.test.status === "adapted"
                    ? "implémentation adaptée"
                    : trouble.test.status === "planned"
                      ? "à venir"
                      : "à définir"}
                )
              </p>
            )}
            <Link
              href={`/troubles/${trouble.slug}`}
              className="mt-4 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              Ouvrir la fiche détaillée
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

