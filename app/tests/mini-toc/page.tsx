import SpecificTestRunner from "@/components/SpecificTestRunner";

type RawSearchParams = Record<string, string | string[] | undefined>;

function normalizeParam(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0] ?? null;
  return null;
}

export default async function TestMiniTocPage({
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
      title="Test spécifique : Mini-TOC"
      description="Auto-évaluation orientée symptômes obsessionnels-compulsifs (outil éducatif, non diagnostique)."
      testId="miniToc"
      apiPath="/api/tests/mini-toc"
      recommendation={{
        fromBilanGlobal: source === "bilan-global" && recommended === "1",
        dominant,
      }}
    />
  );
}
