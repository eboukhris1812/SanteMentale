import { NextResponse } from "next/server";
import {
  generateNaturalReport,
  scoreQuestionnaire,
  type AssessmentResults,
  type DominantCategory,
} from "@/features/assessment/engine";
import { questionnaireRegistry } from "@/features/assessment/schemas";
import { enforceRateLimit } from "@/lib/security/rateLimit";
import { bilanPayloadSchema } from "@/lib/validation/bilan";

function normalizeScreen(answers: number[], maxPerItem: number): number {
  const maxScore = answers.length * maxPerItem;
  if (maxScore === 0) {
    return 0;
  }
  return answers.reduce((sum, value) => sum + value, 0) / maxScore;
}

function extractClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      endpoint: "/api/bilans",
      methods: ["GET", "POST"],
      message:
        "Utilise POST avec un JSON: { phq9, gad7, pcl5Short, miniToc, personalityScreen, eatingScreen, neurodevScreen }",
      ibCompliance: {
        educationalPurposeOnly: true,
        noDiagnosis: true,
        noMedicalAdvice: true,
      },
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
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

    const rawPayload = await request.json();
    const payload = bilanPayloadSchema.parse(rawPayload);

    const phq9 = scoreQuestionnaire(questionnaireRegistry.phq9, payload.phq9);
    const gad7 = scoreQuestionnaire(questionnaireRegistry.gad7, payload.gad7);
    const pcl5Short = scoreQuestionnaire(
      questionnaireRegistry.pcl5Short,
      payload.pcl5Short
    );
    const miniToc = scoreQuestionnaire(questionnaireRegistry.miniToc, payload.miniToc);
    const personalityScreen = normalizeScreen(payload.personalityScreen, 3);
    const eatingScreen = normalizeScreen(payload.eatingScreen, 3);
    const neurodevScreen = normalizeScreen(payload.neurodevScreen, 3);

    const dominantMap: Record<DominantCategory, number> = {
      depression: phq9.normalizedScore,
      anxiety: gad7.normalizedScore,
      trauma: pcl5Short.normalizedScore,
      ocd: miniToc.normalizedScore,
      personality: personalityScreen,
      eating: eatingScreen,
      neurodevelopment: neurodevScreen,
    };

    const dominantCategory = (Object.entries(dominantMap).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "depression") as DominantCategory;

    const results: AssessmentResults = {
      scores: {
        phq9,
        gad7,
        pcl5Short,
        miniToc,
      },
      categoryScores: dominantMap,
      dominantCategory,
    };

    const naturalReport = generateNaturalReport(results);

    const phq9Item9 = payload.phq9[8] ?? 0;
    const urgentSupportRecommended = phq9Item9 >= 1;

    return NextResponse.json(
      {
        results,
        dominantCategory,
        naturalReport,
        // Backward-compatible aliases to avoid breaking existing frontend code during migration.
        scores: results.scores,
        categoryScores: results.categoryScores,
        methodology: {
          framework: "dépistage psychométrique éducatif pour projet academique IB",
          scoringMethod:
            "Somme simple des items calculee cote serveur (questionnaires valides + ecrans d'orientation categories).",
          ageTarget: "Adolescents 14-18 ans",
          limitations: [
            "Outil de dépistage uniquement: ne pose pas de diagnostic clinique.",
            "Les seuils peuvent varier selon la population, la langue et le contexte.",
            "PCL-5 court et Mini-TOC (style OCI-4) sont indicatifs et non diagnostiques seuls.",
            "Personnalite, conduites alimentaires et neurodeveloppement sont actuellement estimes par des ecrans d'orientation courts.",
          ],
          sources: [
            "PHQ-9: Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16(9):606-613.",
            "GAD-7: Spitzer RL, Kroenke K, Williams JBW, Lowe B. Arch Intern Med. 2006;166(10):1092-1097.",
            "PCL-5 (20 items): recommandations VA/NCPTSD; seuils courts variables selon les études.",
            "OCI-4 court: Abramovitch A et al. J Obsessive Compuls Relat Disord. 2021;31:100696.",
          ],
        },
        safety: {
          educationalPurposeOnly: true,
          emergencyDisclaimer:
            "En cas de danger immediat, contacte sans attendre les services d'urgence locaux.",
          urgentSupportRecommended,
          urgentSupportReason:
            urgentSupportRecommended
              ? "L'item 9 du PHQ-9 est superieur a 0: parle rapidement a un adulte de confiance ou a un professionnel de santé."
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
      return NextResponse.json(
        { error: "Format de donnees invalide" },
        { status: 400 }
      );
    }

    console.error("/api/bilans POST failed", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

