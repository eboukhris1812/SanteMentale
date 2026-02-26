import { NextResponse } from "next/server";
import {
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
        { error: "Limite de requêtes atteinte" },
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
    const phq9Item9 = payload.answers[8] ?? 0;
    const urgentSupportRecommended = phq9Item9 >= 1;

    return NextResponse.json(
      {
        testId: "phq9",
        score,
        naturalReport,
        methodology: {
          framework: "Dépistage psychométrique éducatif (projet IB)",
          source: questionnaireRegistry.phq9.scoringRules.source,
          educationalPurposeOnly: true,
        },
        safety: {
          urgentSupportRecommended,
          urgentSupportReason: urgentSupportRecommended
            ? "Item 9 du PHQ-9 > 0 : demande rapidement de l'aide à un adulte de confiance ou à un professionnel."
            : "Aucun signal critique immédiat détecté sur l'item 9 du PHQ-9.",
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
      return NextResponse.json({ error: "Format de données invalide" }, { status: 400 });
    }

    console.error("/api/tests/phq9 POST failed", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
