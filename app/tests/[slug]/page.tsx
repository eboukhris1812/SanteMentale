import Link from "next/link";
import { notFound } from "next/navigation";
import { getTroubleByTestSlug, troubles } from "@/lib/content/mentalHealthCatalog";

const implementedTestSlugs = new Set(["phq9", "gad7", "mini-toc", "pcl5-court"]);

export function generateStaticParams() {
  const allTestSlugs = troubles
    .map((trouble) => trouble.test?.slug)
    .filter((slug): slug is string => Boolean(slug));

  const unique = [...new Set(allTestSlugs)].filter((slug) => !implementedTestSlugs.has(slug));
  return unique.map((slug) => ({ slug }));
}

export default function PlannedTestPage({ params }: { params: { slug: string } }) {
  const trouble = getTroubleByTestSlug(params.slug);
  if (!trouble || !trouble.test) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-4">
      <h1 className="text-2xl font-bold">Test spécifique: {trouble.test.code}</h1>
      <p className="text-gray-700">
        Ce test est référencé dans la version définitive du site, mais son module interactif n'est pas encore implémenté.
      </p>
      <p className="text-gray-700">
        Trouble concerné: <span className="font-medium">{trouble.name}</span>
      </p>
      <p className="text-gray-700">Nom du test: {trouble.test.name}</p>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        En attendant l'implémentation, utilise la fiche détaillée du trouble et oriente-toi vers un professionnel si besoin.
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/troubles/${trouble.slug}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Retour à la fiche du trouble
        </Link>
        <Link
          href="/troubles"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Voir toutes les catégories
        </Link>
      </div>
    </div>
  );
}
