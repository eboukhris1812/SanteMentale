import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateSpecificTestReport,
  scoreQuestionnaire,
} from "@/features/assessment/engine";
import { getQuestionnaireByTestSlug } from "@/features/assessment/schemas";
import { enforceRateLimit } from "@/lib/security/rateLimit";

function extractClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const definition = getQuestionnaireByTestSlug(slug);
    if (!definition) {
      return NextResponse.json({ error: "Test introuvable" }, { status: 404 });
    }

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

    const payloadSchema = z.object({
      answers: z
        .array(z.number().int().min(definition.scale.min).max(definition.scale.max))
        .length(definition.items.length),
    });

    const payload = payloadSchema.parse(await request.json());
    const score = scoreQuestionnaire(definition, payload.answers);
    const naturalReport = generateSpecificTestReport(definition.id, score);
    const urgentSupportRecommended =
      definition.id === "phq9" ? (payload.answers[8] ?? 0) >= 1 : false;
    const urgentSupportReason =
      definition.id === "phq9"
        ? urgentSupportRecommended
          ? "Item 9 du PHQ-9 > 0 : demande rapidement de l'aide à un adulte de confiance ou à un professionnel."
          : "Aucun signal critique immédiat détecté sur l'item 9 du PHQ-9."
        : "Ce résultat est un repérage éducatif et ne remplace pas une évaluation clinique.";

    return NextResponse.json(
      {
        testId: definition.id,
        score,
        naturalReport,
        methodology: {
          framework: "Dépistage psychométrique éducatif (projet IB)",
          source: definition.scoringRules.source,
          educationalPurposeOnly: true,
        },
        safety: {
          urgentSupportRecommended,
          urgentSupportReason,
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
    console.error("/api/tests/[slug] POST failed", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
