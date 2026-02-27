/* eslint-disable no-console */

const API_URL = process.env.TEST_BILANS_URL ?? "http://localhost:3000/api/bilans";

const PROFILES = [
  {
    name: "anxiete-moderee",
    payload: {
      phq9: [1, 2, 1, 2, 1, 1, 0, 1, 0],
      gad7: [2, 2, 1, 2, 1, 1, 1],
      pcl5Short: [1, 1, 0, 1],
      miniToc: [1, 1, 0, 1],
      personalityScreen: [1, 2, 1, 1],
      eatingScreen: [0, 1, 0, 1],
      neurodevScreen: [1, 1, 2, 1],
    },
  },
  {
    name: "depression-haute",
    payload: {
      phq9: [3, 3, 2, 3, 2, 3, 2, 2, 1],
      gad7: [1, 1, 1, 1, 1, 1, 1],
      pcl5Short: [0, 1, 0, 0],
      miniToc: [0, 0, 0, 0],
      personalityScreen: [1, 1, 1, 1],
      eatingScreen: [1, 0, 0, 0],
      neurodevScreen: [1, 1, 1, 1],
    },
  },
  {
    name: "trauma-dominant",
    payload: {
      phq9: [1, 1, 2, 1, 1, 1, 1, 1, 0],
      gad7: [2, 1, 2, 1, 1, 1, 2],
      pcl5Short: [4, 4, 3, 4],
      miniToc: [1, 1, 1, 0],
      personalityScreen: [1, 1, 1, 1],
      eatingScreen: [0, 0, 1, 1],
      neurodevScreen: [1, 1, 1, 1],
    },
  },
  {
    name: "toc-dominant",
    payload: {
      phq9: [0, 1, 1, 1, 0, 1, 1, 0, 0],
      gad7: [1, 1, 1, 1, 1, 1, 1],
      pcl5Short: [0, 0, 1, 0],
      miniToc: [4, 4, 4, 3],
      personalityScreen: [1, 1, 0, 1],
      eatingScreen: [1, 0, 1, 0],
      neurodevScreen: [1, 1, 1, 1],
    },
  },
  {
    name: "personnalite-elevee",
    payload: {
      phq9: [1, 1, 1, 1, 1, 1, 1, 1, 0],
      gad7: [1, 2, 1, 2, 1, 2, 1],
      pcl5Short: [1, 1, 1, 1],
      miniToc: [1, 1, 1, 1],
      personalityScreen: [3, 3, 3, 2],
      eatingScreen: [1, 1, 0, 1],
      neurodevScreen: [2, 1, 1, 1],
    },
  },
  {
    name: "alimentaire-eleve",
    payload: {
      phq9: [1, 1, 1, 1, 1, 1, 0, 1, 0],
      gad7: [1, 1, 1, 1, 1, 1, 1],
      pcl5Short: [0, 0, 0, 1],
      miniToc: [1, 0, 1, 0],
      personalityScreen: [1, 1, 1, 1],
      eatingScreen: [3, 3, 3, 2],
      neurodevScreen: [1, 1, 1, 1],
    },
  },
  {
    name: "neurodev-eleve",
    payload: {
      phq9: [1, 1, 1, 1, 1, 1, 1, 1, 0],
      gad7: [1, 1, 1, 1, 1, 1, 1],
      pcl5Short: [0, 0, 0, 0],
      miniToc: [1, 0, 1, 0],
      personalityScreen: [1, 1, 1, 1],
      eatingScreen: [1, 0, 1, 0],
      neurodevScreen: [3, 3, 2, 3],
    },
  },
  {
    name: "multi-haut",
    payload: {
      phq9: [3, 2, 3, 3, 2, 3, 2, 2, 1],
      gad7: [3, 3, 3, 3, 2, 2, 3],
      pcl5Short: [3, 3, 2, 3],
      miniToc: [3, 2, 3, 2],
      personalityScreen: [3, 2, 3, 2],
      eatingScreen: [2, 2, 2, 2],
      neurodevScreen: [2, 3, 2, 3],
    },
  },
  {
    name: "faible-global",
    payload: {
      phq9: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      gad7: [0, 0, 0, 0, 0, 0, 0],
      pcl5Short: [0, 0, 0, 0],
      miniToc: [0, 0, 0, 0],
      personalityScreen: [0, 0, 0, 0],
      eatingScreen: [0, 0, 0, 0],
      neurodevScreen: [0, 0, 0, 0],
    },
  },
  {
    name: "urgence-item9",
    payload: {
      phq9: [2, 2, 2, 2, 2, 2, 1, 1, 3],
      gad7: [2, 2, 2, 2, 2, 2, 2],
      pcl5Short: [1, 2, 1, 1],
      miniToc: [1, 1, 1, 1],
      personalityScreen: [1, 2, 2, 1],
      eatingScreen: [1, 1, 1, 1],
      neurodevScreen: [1, 1, 2, 1],
    },
  },
];

function checkReportQuality(json) {
  const issues = [];
  const report = typeof json.aiReport === "string" ? json.aiReport : "";
  const paragraphs = report.split(/\n{2,}/).filter((p) => p.trim().length > 0);

  if (!report) issues.push("aiReport absent");
  if (!json.aiReportSource) issues.push("aiReportSource absent");
  if (paragraphs.length < 6) issues.push(`paragraphes insuffisants (${paragraphs.length})`);
  if (/\b(PHQ-?9|GAD-?7|PCL-?5|EAT-?26|TOC)\s*[:=]?\s*\d+/i.test(report)) {
    issues.push("score brut detecte");
  }
  if (/^(introduction|resume|focus|psychoeducation|recommandations|encouragement|avertissement)\s*:/im.test(report)) {
    issues.push("titres detectes");
  }
  if (!json.safety || typeof json.safety.urgentSupportRecommended !== "boolean") {
    issues.push("champ safety incomplet");
  }

  return { issues, paragraphs: paragraphs.length };
}

async function runProfile(profile) {
  const startedAt = Date.now();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile.payload),
  });

  const durationMs = Date.now() - startedAt;
  if (!response.ok) {
    const body = await response.text();
    return {
      profile: profile.name,
      ok: false,
      status: response.status,
      durationMs,
      source: "none",
      cached: false,
      paragraphs: 0,
      issues: [`HTTP ${response.status}: ${body.slice(0, 180)}`],
    };
  }

  const json = await response.json();
  const quality = checkReportQuality(json);
  return {
    profile: profile.name,
    ok: quality.issues.length === 0,
    status: response.status,
    durationMs,
    source: json.aiReportSource ?? "unknown",
    cached: Boolean(json.aiReportCached),
    paragraphs: quality.paragraphs,
    issues: quality.issues,
    aiReportError: json.aiReportError,
  };
}

async function main() {
  console.log(`Testing ${PROFILES.length} profiles on ${API_URL}`);
  const results = [];

  for (const profile of PROFILES) {
    const result = await runProfile(profile);
    results.push(result);
    const issueText = result.issues.length > 0 ? ` | issues=${result.issues.join("; ")}` : "";
    const errText = result.aiReportError ? ` | aiError=${result.aiReportError}` : "";
    console.log(
      `[${result.ok ? "OK" : "KO"}] ${result.profile} | src=${result.source} | cached=${result.cached} | p=${result.paragraphs} | ${result.durationMs}ms${issueText}${errText}`
    );
  }

  const total = results.length;
  const okCount = results.filter((r) => r.ok).length;
  const hfCount = results.filter((r) => r.source === "huggingface").length;
  const fallbackCount = results.filter((r) => r.source === "fallback").length;
  const avgMs = Math.round(results.reduce((sum, r) => sum + r.durationMs, 0) / total);

  console.log("\nSummary");
  console.log(`- Success: ${okCount}/${total}`);
  console.log(`- HuggingFace source: ${hfCount}`);
  console.log(`- Fallback source: ${fallbackCount}`);
  console.log(`- Avg duration: ${avgMs}ms`);

  if (okCount !== total) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Profile test runner failed:", error);
  process.exit(1);
});
