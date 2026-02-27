/* eslint-disable no-console */

const BASE_URL = process.env.TEST_SPECIFIC_BASE_URL ?? "http://localhost:3000";

const TEST_CASES = [
  {
    name: "phq9",
    path: "/api/tests/phq9",
    payload: { answers: [1, 2, 1, 2, 1, 1, 0, 1, 0] },
  },
  {
    name: "gad7",
    path: "/api/tests/gad7",
    payload: { answers: [2, 2, 1, 2, 1, 1, 1] },
  },
  {
    name: "mini-toc",
    path: "/api/tests/mini-toc",
    payload: { answers: [3, 2, 3, 2] },
  },
  {
    name: "pcl5-court",
    path: "/api/tests/pcl5-court",
    payload: { answers: [3, 2, 3, 2] },
  },
  {
    name: "slug-route-gad7",
    path: "/api/tests/gad7",
    payload: { answers: [1, 1, 1, 1, 1, 1, 1] },
  },
];

function validate(json) {
  const issues = [];
  const report = typeof json.aiReport === "string" ? json.aiReport : "";
  const paragraphs = report
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (!report) issues.push("aiReport absent");
  if (!json.aiReportSource) issues.push("aiReportSource absent");
  if (paragraphs.length < 7) issues.push(`paragraphes insuffisants (${paragraphs.length})`);
  if (!json.methodology?.educationalPurposeOnly) issues.push("methodology.educationalPurposeOnly absent");
  if (typeof json.safety?.urgentSupportRecommended !== "boolean") {
    issues.push("safety.urgentSupportRecommended absent");
  }

  return { issues, paragraphs: paragraphs.length };
}

async function runCase(testCase) {
  const started = Date.now();
  const response = await fetch(`${BASE_URL}${testCase.path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testCase.payload),
  });
  const durationMs = Date.now() - started;

  if (!response.ok) {
    const body = await response.text();
    return {
      name: testCase.name,
      ok: false,
      durationMs,
      source: "none",
      cached: false,
      paragraphs: 0,
      issues: [`HTTP ${response.status}: ${body.slice(0, 150)}`],
    };
  }

  const json = await response.json();
  const quality = validate(json);
  return {
    name: testCase.name,
    ok: quality.issues.length === 0,
    durationMs,
    source: json.aiReportSource ?? "unknown",
    cached: Boolean(json.aiReportCached),
    paragraphs: quality.paragraphs,
    issues: quality.issues,
  };
}

async function main() {
  console.log(`Testing specific test endpoints on ${BASE_URL}`);
  const results = [];
  for (const testCase of TEST_CASES) {
    const result = await runCase(testCase);
    results.push(result);
    console.log(
      `[${result.ok ? "OK" : "KO"}] ${result.name} | src=${result.source} | cached=${result.cached} | p=${result.paragraphs} | ${result.durationMs}ms${result.issues.length ? ` | issues=${result.issues.join("; ")}` : ""}`
    );
  }

  const successCount = results.filter((r) => r.ok).length;
  console.log(`\nSummary: ${successCount}/${results.length} passed`);
  if (successCount !== results.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Specific test runner failed:", error);
  process.exit(1);
});
