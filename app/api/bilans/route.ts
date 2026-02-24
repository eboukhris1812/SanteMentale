import { NextResponse } from "next/server";
import { scoreQuestionnaire } from "@/features/assessment/engine";
import { questionnaireRegistry } from "@/features/assessment/schemas";
import { enforceRateLimit } from "@/lib/security/rateLimit";
import { bilanPayloadSchema } from "@/lib/validation/bilan";

type DominantCategory = "depression" | "anxiety" | "trauma" | "ocd";

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
      message: "Use POST with JSON body: { phq9, gad7, pcl5Short, miniToc }",
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
        { error: "Rate limit exceeded" },
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

    const dominantMap: Record<DominantCategory, number> = {
      depression: phq9.normalizedScore,
      anxiety: gad7.normalizedScore,
      trauma: pcl5Short.normalizedScore,
      ocd: miniToc.normalizedScore,
    };

    const dominantCategory = (Object.entries(dominantMap).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "depression") as DominantCategory;

    const phq9Item9 = payload.phq9[8] ?? 0;
    const urgentSupportRecommended = phq9Item9 >= 1;

    return NextResponse.json(
      {
        scores: {
          phq9,
          gad7,
          pcl5Short,
          miniToc,
        },
        dominantCategory,
        methodology: {
          framework: "Educational psychometric screening for IB academic project",
          scoringMethod: "Simple sum scoring per questionnaire, server-side",
          ageTarget: "Adolescents 14-18",
          limitations: [
            "Screening tool only: does not establish a clinical diagnosis.",
            "Cut-points can vary by population, language, and setting.",
            "PCL-5 short and OCI-4 style mini-TOC are indicative and not standalone diagnostics.",
          ],
          sources: [
            "PHQ-9: Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16(9):606-613.",
            "GAD-7: Spitzer RL, Kroenke K, Williams JBW, Lowe B. Arch Intern Med. 2006;166(10):1092-1097.",
            "PCL-5 guidance (20-item): VA/NCPTSD; short-form thresholds vary by validation study.",
            "OCI-4 short screener: Abramovitch A et al. J Obsessive Compuls Relat Disord. 2021;31:100696.",
          ],
        },
        safety: {
          educationalPurposeOnly: true,
          emergencyDisclaimer:
            "If there is immediate danger, contact local emergency services right now.",
          urgentSupportRecommended,
          urgentSupportReason:
            urgentSupportRecommended
              ? "PHQ-9 item 9 is above 0, which warrants prompt follow-up with a qualified adult or professional."
              : "No immediate critical flag detected on PHQ-9 item 9.",
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
        { error: "Invalid payload format" },
        { status: 400 }
      );
    }

    console.error("/api/bilans POST failed", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
