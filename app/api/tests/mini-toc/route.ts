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

    const payload = specificTestPayloadSchemas.miniToc.parse(await request.json());
    const score = scoreQuestionnaire(questionnaireRegistry.miniToc, payload.answers);
    const naturalReport = generateSpecificTestReport("miniToc", score);

    return NextResponse.json(
      {
        testId: "miniToc",
        score,
        naturalReport,
        methodology: {
          framework: "Dépistage psychométrique éducatif (projet IB)",
          source: questionnaireRegistry.miniToc.scoringRules.source,
          educationalPurposeOnly: true,
        },
        safety: {
          urgentSupportRecommended: false,
          urgentSupportReason: "Aucune règle de signal critique immédiat n'est définie pour ce test.",
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

    console.error("/api/tests/mini-toc POST failed", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
