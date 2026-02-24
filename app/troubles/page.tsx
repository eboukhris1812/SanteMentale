import Link from "next/link";
import { getTroublesByCategorySlug, troubleCategories } from "@/lib/content/mentalHealthCatalog";

export default function TroublesIndexPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold">Catégories de troubles</h1>
        <p className="mt-2 text-gray-700">
          Explore les fiches détaillées par catégorie et accède aux tests spécifiques associés.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {troubleCategories.map((category) => {
          const count = getTroublesByCategorySlug(category.slug).length;
          return (
            <article key={category.slug} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
              <p className="mt-2 text-gray-700 text-sm leading-6">{category.description}</p>
              <p className="mt-3 text-sm text-gray-500">{count} fiche(s) disponible(s)</p>
              <Link
                href={`/categories/${category.slug}`}
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Voir la catégorie
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
