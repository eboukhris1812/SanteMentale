import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getTroubleBySlug,
  troubles,
} from "@/lib/content/mentalHealthCatalog";

export function generateStaticParams() {
  return troubles.map((trouble) => ({ slug: trouble.slug }));
}

function testStatusLabel(status: "implemented" | "adapted" | "planned" | "undefined") {
  if (status === "implemented") return "Implémenté";
  if (status === "adapted") return "Implémentation adaptée";
  if (status === "planned") return "À venir";
  return "À définir";
}

export default async function TroubleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trouble = getTroubleBySlug(slug);
  if (!trouble) {
    notFound();
  }

  const category = getCategoryBySlug(trouble.categorySlug);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Catégorie: {category?.name ?? "Non classé"}</p>
        <h1 className="text-3xl font-bold mt-1">{trouble.name}</h1>
        <p className="mt-3 text-gray-700 leading-7 text-justify">{trouble.summary}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Signes fréquemment observés</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {trouble.signs.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Pistes d'orientation éducative</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {trouble.orientation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
        <h2 className="text-xl font-semibold mb-2">Test spécifique associé</h2>
        {trouble.test ? (
          <>
            <p className="text-gray-800">
              <span className="font-medium">{trouble.test.code}</span> - {trouble.test.name}
            </p>
            <p className="text-sm text-gray-700 mt-1">Statut: {testStatusLabel(trouble.test.status)}</p>
            {trouble.test.notes && <p className="text-sm text-gray-700 mt-1">Note: {trouble.test.notes}</p>}

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/tests/${trouble.test.slug}`}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Ouvrir le test spécifique
              </Link>
              <Link
                href={`/categories/${trouble.categorySlug}`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Retour à la catégorie
              </Link>
            </div>
          </>
        ) : (
          <p className="text-gray-700">Aucun test n'est encore renseigné pour cette fiche.</p>
        )}
      </section>
    </div>
  );
}
