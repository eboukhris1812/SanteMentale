import SpecificTestRunner from "@/components/SpecificTestRunner";

type RawSearchParams = Record<string, string | string[] | undefined>;

function normalizeParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0] ?? null;
  return null;
}

export default async function TestPcl5CourtPage({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  const resolved = (await searchParams) ?? {};
  const source = normalizeParam(resolved.source);
  const recommended = normalizeParam(resolved.recommended);
  const dominant = normalizeParam(resolved.dominant);

  return (
    <SpecificTestRunner
      title="Test spécifique : PCL-5 court"
      description="Auto-évaluation orientée traumatisme/stress (outil éducatif, non diagnostique)."
      testId="pcl5Short"
      apiPath="/api/tests/pcl5-court"
      recommendation={{
        fromBilanGlobal: source === "bilan-global" && recommended === "1",
        dominant,
      }}
    />
  );
}
