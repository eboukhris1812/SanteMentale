import { notFound } from "next/navigation";
import SpecificTestRunner from "@/components/SpecificTestRunner";
import {
  getQuestionnaireByTestSlug,
  testSlugToQuestionnaireId,
} from "@/features/assessment/schemas";
import { getTroubleBySlug, getTroubleByTestSlug, troubles } from "@/lib/content/mentalHealthCatalog";

type RawSearchParams = Record<string, string | string[] | undefined>;

function normalizeParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0] ?? null;
  return null;
}

export function generateStaticParams() {
  const slugsFromTroubles = troubles
    .map((trouble) => trouble.test?.slug)
    .filter((slug): slug is string => Boolean(slug));
  const allKnownSlugs = [...slugsFromTroubles, ...Object.keys(testSlugToQuestionnaireId)];
  const unique = [...new Set(allKnownSlugs)];
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
  const defaultTrouble = getTroubleByTestSlug(slug);
  const definition = getQuestionnaireByTestSlug(slug);
  const questionnaireId = testSlugToQuestionnaireId[slug];

  if (!definition || !questionnaireId) {
    notFound();
  }

  const resolved = (await searchParams) ?? {};
  const source = normalizeParam(resolved.source);
  const recommended = normalizeParam(resolved.recommended);
  const dominant = normalizeParam(resolved.dominant);
  const requestedTroubleSlug = normalizeParam(resolved.trouble);
  const requestedTrouble = requestedTroubleSlug ? getTroubleBySlug(requestedTroubleSlug) : undefined;

  const scopedTrouble =
    requestedTrouble && requestedTrouble.test?.slug === slug
      ? requestedTrouble
      : defaultTrouble;

  const sharedTroubles = troubles.filter((candidate) => candidate.test?.slug === slug);
  const orientationLabel =
    !scopedTrouble
      ? "le dépistage psychométrique correspondant"
      : sharedTroubles.length > 1 && !requestedTrouble
      ? "les troubles associés à ce test"
      : scopedTrouble.name.toLowerCase();
  const testCode = scopedTrouble?.test?.code ?? definition.title;
  const isPdqSectionSlug =
    slug === "pdq4-groupe-a" || slug === "pdq4-groupe-b" || slug === "pdq4-groupe-c";
  const isSapasSlug = slug === "sapas";
  const baseDescription = `Auto-évaluation orientée ${orientationLabel} (outil éducatif, non diagnostique).`;
  const description = isSapasSlug
    ? `${baseDescription} SAPAS est un tri ultra-court: en cas de positivité, un dépistage complémentaire (PDQ-4+ complet, MSI-BPD) est recommandé.`
    : isPdqSectionSlug
    ? `${baseDescription} Cette section courte est une étape de repérage: le PDQ-4+ complet (99 items) est recommandé ensuite.`
    : baseDescription;

  return (
    <SpecificTestRunner
      title={`Test spécifique : ${testCode}`}
      description={description}
      testId={questionnaireId}
      apiPath={`/api/tests/${slug}`}
      recommendation={{
        fromBilanGlobal: source === "bilan-global" && recommended === "1",
        dominant,
      }}
    />
  );
}
