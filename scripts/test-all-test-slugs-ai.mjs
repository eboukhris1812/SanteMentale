/* eslint-disable no-console */

const BASE_URL = process.env.TEST_SPECIFIC_BASE_URL ?? "http://localhost:3000";
const MAX_RETRIES = Number(process.env.TEST_MAX_RETRIES ?? 3);

const TEST_SLUGS = [
  "phq9",
  "gad7",
  "pcl5",
  "pcl5-court",
  "mini-toc",
  "pdss-sr",
  "pas",
  "lsas",
  "fasc",
  "mdq",
  "sasds",
  "rada",
  "pdq4-groupe-a",
  "pdq4-groupe-b",
  "pdq4-groupe-c",
  "sapas",
  "msi-bpd",
  "pdq4-complet",
  "eat26",
  "bes",
  "asrs-v11",
  "aq10",
  "ygtss",
];

function validateResponse(json) {
  const issues = [];
  const report = typeof json.aiReport === "string" ? json.aiReport : "";
  const paragraphs = report
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (!json.testId) issues.push("testId absent");
  if (!json.score) issues.push("score absent");
  if (!json.naturalReport) issues.push("naturalReport absent");
  if (!report) issues.push("aiReport absent");
  if (!json.aiReportSource) issues.push("aiReportSource absent");
  if (paragraphs.length < 3) issues.push(`aiReport trop court (${paragraphs.length} paragraphes)`);

  return { issues, paragraphs: paragraphs.length };
}

async function fetchMeta(slug) {
  const response = await fetch(`${BASE_URL}/api/tests/${slug}`);
  if (!response.ok) {
    throw new Error(`GET /api/tests/${slug} -> HTTP ${response.status}`);
  }
  return response.json();
}

async function runSlug(slug) {
  const startedAt = Date.now();
  try {
    const meta = await fetchMeta(slug);
    const length = Number(meta.itemsCount);
    const min = Number(meta.scale?.min ?? 0);
    const max = Number(meta.scale?.max ?? 4);
    const answerValue = Math.floor((min + max) / 2);
    const payload = { answers: Array.from({ length }, () => answerValue) };

    let response;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      response = await fetch(`${BASE_URL}/api/tests/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status !== 429) {
        break;
      }

      const resetHeader = response.headers.get("X-RateLimit-Reset");
      const waitMs = resetHeader ? (Number(resetHeader) + 1) * 1000 : 1200 * (attempt + 1);
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    const durationMs = Date.now() - startedAt;
    if (!response.ok) {
      const body = await response.text();
      return {
        slug,
        ok: false,
        durationMs,
        source: "none",
        cached: false,
        paragraphs: 0,
        issues: [`HTTP ${response.status}: ${body.slice(0, 160)}`],
      };
    }

    const json = await response.json();
    const quality = validateResponse(json);
    return {
      slug,
      ok: quality.issues.length === 0,
      durationMs,
      source: json.aiReportSource ?? "unknown",
      cached: Boolean(json.aiReportCached),
      paragraphs: quality.paragraphs,
      issues: quality.issues,
    };
  } catch (error) {
    return {
      slug,
      ok: false,
      durationMs: Date.now() - startedAt,
      source: "none",
      cached: false,
      paragraphs: 0,
      issues: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

async function main() {
  console.log(`Testing ${TEST_SLUGS.length} test slugs on ${BASE_URL}`);
  const results = [];

  for (const slug of TEST_SLUGS) {
    const result = await runSlug(slug);
    results.push(result);
    console.log(
      `[${result.ok ? "OK" : "KO"}] ${result.slug} | src=${result.source} | cached=${result.cached} | p=${result.paragraphs} | ${result.durationMs}ms${result.issues.length ? ` | issues=${result.issues.join("; ")}` : ""}`
    );
  }

  const success = results.filter((result) => result.ok).length;
  const hf = results.filter((result) => result.source === "huggingface").length;
  const fallback = results.filter((result) => result.source === "fallback").length;
  const average = Math.round(results.reduce((sum, result) => sum + result.durationMs, 0) / results.length);

  console.log("\nSummary");
  console.log(`- Success: ${success}/${results.length}`);
  console.log(`- HuggingFace source: ${hf}`);
  console.log(`- Fallback source: ${fallback}`);
  console.log(`- Avg duration: ${average}ms`);

  if (success !== results.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("All-slugs runner failed:", error);
  process.exit(1);
});
