import Link from "next/link";
import { getTroublesByCategorySlug, troubleCategories } from "@/lib/content/mentalHealthCatalog";

const categoryImages: Record<string, { src: string; alt: string }> = {
  "troubles-anxieux": {
    src: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=1400&q=80",
    alt: "Adolescente stressée en environnement scolaire, illustrant l'anxiété académique",
  },
  "troubles-humeur": {
    src: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1400&q=80",
    alt: "Jeune isolé assis seul, posture fermée, évoquant un épisode dépressif",
  },
  "troubles-traumatisme-stress": {
    src: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?auto=format&fit=crop&w=1400&q=80",
    alt: "Adolescent regardant au loin avec tension émotionnelle, image liée au stress post-traumatique",
  },
  "troubles-personnalite": {
    src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
    alt: "Groupe de jeunes en interaction, illustrant les dynamiques relationnelles et émotionnelles",
  },
  "troubles-conduites-alimentaires": {
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
    alt: "Adolescente en situation de repas avec focalisation sur l'alimentation et l'image corporelle",
  },
  "troubles-neurodeveloppementaux": {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80",
    alt: "Élève en classe avec besoin d'attention ciblée, illustration des enjeux neurodéveloppementaux",
  },
};

export default function TroublesIndexPage() {
  return (
    <section className="space-y-6">
      <header className="surface-card animate-fade-up rounded-3xl px-6 py-7 md:px-8 md:py-8">
        <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 md:text-sm">
          Bibliothèque de contenus
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Catégories de troubles</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Explore les fiches détaillées par catégorie et accède aux tests spécifiques associés.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {troubleCategories.map((category, index) => {
          const count = getTroublesByCategorySlug(category.slug).length;
          const delayClass = index % 3 === 0 ? "delay-100" : index % 3 === 1 ? "delay-200" : "delay-300";
          const image = categoryImages[category.slug];

          return (
            <article
              key={category.slug}
              className={`surface-card animate-fade-up ${delayClass} group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200`}
            >
              <img src={image.src} alt={image.alt} className="h-44 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 md:text-xl">{category.name}</h2>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {count} fiche(s)
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{category.description}</p>
                <Link
                  href={`/categories/${category.slug}`}
                  className="mt-5 inline-flex w-fit items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-700"
                >
                  Voir la catégorie
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

