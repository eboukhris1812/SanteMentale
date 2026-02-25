import { notFound } from "next/navigation";
import SpecificTestRunner from "@/components/SpecificTestRunner";
import { getQuestionnaireByTestSlug, testSlugToQuestionnaireId } from "@/features/assessment/schemas";
import { getTroubleByTestSlug, troubles } from "@/lib/content/mentalHealthCatalog";

type RawSearchParams = Record<string, string | string[] | undefined>;

function normalizeParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0] ?? null;
  return null;
}

export function generateStaticParams() {
  const allTestSlugs = troubles
    .map((trouble) => trouble.test?.slug)
    .filter((slug): slug is string => Boolean(slug));

  const unique = [...new Set(allTestSlugs)];
  return unique.map((slug) => ({ slug }));
}

export default async function TestBySlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const trouble = getTroubleByTestSlug(slug);
  const definition = getQuestionnaireByTestSlug(slug);
  const questionnaireId = testSlugToQuestionnaireId[slug];

  if (!trouble?.test || !definition || !questionnaireId) {
    notFound();
  }

  const resolved = (await searchParams) ?? {};
  const source = normalizeParam(resolved.source);
  const recommended = normalizeParam(resolved.recommended);
  const dominant = normalizeParam(resolved.dominant);

  return (
    <SpecificTestRunner
      title={`Test spécifique : ${trouble.test.code}`}
      description={`Auto-évaluation orientée ${trouble.name.toLowerCase()} (outil éducatif, non diagnostique).`}
      testId={questionnaireId}
      apiPath={`/api/tests/${slug}`}
      recommendation={{
        fromBilanGlobal: source === "bilan-global" && recommended === "1",
        dominant,
      }}
    />
  );
}
