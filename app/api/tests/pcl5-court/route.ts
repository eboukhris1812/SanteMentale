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

    const payload = specificTestPayloadSchemas.pcl5Short.parse(await request.json());
    const score = scoreQuestionnaire(questionnaireRegistry.pcl5Short, payload.answers);
    const naturalReport = generateSpecificTestReport("pcl5Short", score);
    const aiGeneration = await generateHuggingFaceSpecificReport(
      "pcl5Short",
      score,
      payload.answers,
      false
    );

    return NextResponse.json(
      {
        testId: "pcl5Short",
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
          source: questionnaireRegistry.pcl5Short.scoringRules.source,
          educationalPurposeOnly: true,
        },
        safety: {
          urgentSupportRecommended: false,
          urgentSupportReason: "Aucune regle de signal critique immediat n'est definie pour ce test.",
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

    console.error("/api/tests/pcl5-court POST failed", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      testId: "pcl5Short",
      slug: "pcl5-court",
      itemsCount: questionnaireRegistry.pcl5Short.items.length,
      scale: {
        min: questionnaireRegistry.pcl5Short.scale.min,
        max: questionnaireRegistry.pcl5Short.scale.max,
      },
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
