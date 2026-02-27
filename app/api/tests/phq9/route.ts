import { NextResponse } from "next/server";
import {
  generateHuggingFaceSpecificReport,
  generateSpecificTestReport,
  scoreQuestionnaire,
} from "@/features/assessment/engine";
import { questionnaireRegistry } from "@/features/assessment/schemas";
import { enforceRateLimit } from "@/lib/security/rateLimit";
import { specificTestPayloadSchemas } from "@/lib/validation/specificTests";

function extractClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = extractClientIp(request);
    const rateLimit = await enforceRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Limite de requetes atteinte" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    const payload = specificTestPayloadSchemas.phq9.parse(await request.json());
    const score = scoreQuestionnaire(questionnaireRegistry.phq9, payload.answers);
    const naturalReport = generateSpecificTestReport("phq9", score);
    const urgentSupportRecommended = (payload.answers[8] ?? 0) >= 1;
    const aiStartedAt = Date.now();
    const aiGeneration = await generateHuggingFaceSpecificReport(
      "phq9",
      score,
      payload.answers,
      urgentSupportRecommended
    );
    const aiDurationMs = Date.now() - aiStartedAt;
    console.info(`[ai-report-specific] test=phq9 source=${aiGeneration.source} cached=${aiGeneration.cached} durationMs=${aiDurationMs}`);
    if (process.env.NODE_ENV === "production" && aiGeneration.source === "fallback") {
      console.warn(`[ai-report-specific] fallback used in production for test=phq9: ${aiGeneration.error ?? "unknown"}`);
    }

    return NextResponse.json(
      {
        testId: "phq9",
        score,
        naturalReport,
        aiReport: aiGeneration.text,
        aiReportSource: aiGeneration.source,
        aiReportCached: aiGeneration.cached,
        ...(process.env.NODE_ENV !== "production" && aiGeneration.error
          ? { aiReportError: aiGeneration.error }
          : {}),
        methodology: {
          framework: "Depistage psychometrique educatif (projet IB)",
          source: questionnaireRegistry.phq9.scoringRules.source,
          educationalPurposeOnly: true,
        },
        safety: {
          urgentSupportRecommended,
          urgentSupportReason: urgentSupportRecommended
            ? "Item 9 du PHQ-9 > 0: demande rapidement de l'aide a un adulte de confiance ou a un professionnel."
            : "Aucun signal critique immediat detecte sur l'item 9 du PHQ-9.",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
        },
      }
    );
  } catch (error) {
    if (error instanceof Error && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Format de donnees invalide" }, { status: 400 });
    }

    console.error("/api/tests/phq9 POST failed", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      testId: "phq9",
      slug: "phq9",
      itemsCount: questionnaireRegistry.phq9.items.length,
      scale: {
        min: questionnaireRegistry.phq9.scale.min,
        max: questionnaireRegistry.phq9.scale.max,
      },
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}

