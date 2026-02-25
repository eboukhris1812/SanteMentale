import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getTroublesByCategorySlug,
  troubleCategories,
} from "@/lib/content/mentalHealthCatalog";

export function generateStaticParams() {
  return troubleCategories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const items = getTroublesByCategorySlug(category.slug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 text-gray-700 max-w-4xl">{category.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((trouble) => (
          <article key={trouble.slug} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">{trouble.name}</h2>
            <p className="mt-2 text-gray-700 text-sm leading-6">{trouble.summary}</p>
            {trouble.test && (
              <p className="mt-3 text-sm text-gray-600">
                Test associé: <span className="font-medium">{trouble.test.code}</span>
                {" "}
                ({trouble.test.status === "implemented" ? "implémenté" : trouble.test.status === "adapted" ? "implémentation adaptée" : trouble.test.status === "planned" ? "à venir" : "à définir"})
              </p>
            )}
            <Link
              href={`/troubles/${trouble.slug}`}
              className="mt-4 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Ouvrir la fiche détaillée
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
