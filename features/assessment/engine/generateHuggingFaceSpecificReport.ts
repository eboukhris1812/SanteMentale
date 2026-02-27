import { createHash } from "node:crypto";
import type { QuestionnaireScore } from "@/features/assessment/engine/types";
import { generateSpecificTestReport } from "@/features/assessment/engine/generateSpecificTestReport";
import { prisma } from "@/lib/server/prisma";

type HuggingFaceChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export type SpecificAiReportSource = "huggingface" | "fallback";

export type GeneratedSpecificAiReport = {
  text: string;
  source: SpecificAiReportSource;
  cached: boolean;
  error?: string;
};

type CacheEntry = {
  report: string;
  source: SpecificAiReportSource;
  expiresAt: number;
  error?: string;
};

const HUGGING_FACE_API_URL = "https://router.huggingface.co/v1/chat/completions";
const DEFAULT_MODEL = "moonshotai/Kimi-K2-Instruct-0905";
const DEFAULT_FALLBACK_MODELS = ["Qwen/Qwen2.5-7B-Instruct", "meta-llama/Llama-3.1-8B-Instruct"];
const DEFAULT_MAX_NEW_TOKENS = 600;
const HF_MAX_RETRIES = 2;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const REPORT_CACHE_MAX_ITEMS = 500;
const CACHE_VERSION = "specific-hf-v3";
const reportCache = new Map<string, CacheEntry>();

type FallbackBand = "light" | "moderate" | "high";

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferFallbackBand(score: QuestionnaireScore): FallbackBand {
  const severityRaw = normalizeText(String(score.interpretation.severity ?? ""));
  const labelRaw = normalizeText(String(score.interpretation.label ?? ""));
  const normalized = Number.isFinite(score.normalizedScore)
    ? Math.max(0, Math.min(1, score.normalizedScore))
    : 0;

  if (
    severityRaw.includes("severe") ||
    severityRaw.includes("moderately severe") ||
    severityRaw.includes("moderatement severe") ||
    severityRaw.includes("high") ||
    severityRaw.includes("positive") ||
    labelRaw.includes("severe") ||
    labelRaw.includes("moderee a severe") ||
    labelRaw.includes("charge symptomatique elevee")
  ) {
    return "high";
  }

  if (severityRaw.includes("moderate")) return "moderate";
  if (severityRaw.includes("mild") || severityRaw.includes("minimal")) return "light";
  if (normalized < 0.34) return "light";
  if (normalized < 0.67) return "moderate";
  return "high";
}

function pickMostRelevantItems(items: number[], topN: number): number[] {
  return items
    .map((value, index) => ({ index, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, topN)
    .map((item) => item.index);
}

function stableProfileHash(testId: string, score: QuestionnaireScore, answers: number[]): string {
  const payload = {
    cacheVersion: CACHE_VERSION,
    testId,
    normalized: Number(score.normalizedScore.toFixed(4)),
    severity: score.interpretation.severity,
    interpretationLabel: score.interpretation.label,
    components: score.components ?? null,
    answers,
  };
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function cleanupCache(now = Date.now()): void {
  if (reportCache.size <= REPORT_CACHE_MAX_ITEMS) return;
  for (const [key, entry] of reportCache.entries()) {
    if (entry.expiresAt <= now) reportCache.delete(key);
  }
}

async function readPersistedCache(cacheKey: string, now: Date): Promise<CacheEntry | null> {
  try {
    const rows = await prisma.$queryRaw<
      Array<{ reportText: string; source: string; error: string | null; expiresAt: Date }>
    >`
      SELECT "reportText", "source", "error", "expiresAt"
      FROM "AiReportCache"
      WHERE "profileHash" = ${cacheKey}
      LIMIT 1
    `;
    const row = rows[0];
    if (!row || row.expiresAt <= now) return null;
    return {
      report: row.reportText,
      source: row.source === "huggingface" ? "huggingface" : "fallback",
      error: row.error ?? undefined,
      expiresAt: row.expiresAt.getTime(),
    };
  } catch {
    return null;
  }
}

async function persistCache(cacheKey: string, entry: CacheEntry): Promise<void> {
  try {
    await prisma.$executeRaw`
      INSERT INTO "AiReportCache" ("profileHash", "reportText", "source", "error", "expiresAt", "updatedAt")
      VALUES (${cacheKey}, ${entry.report}, ${entry.source}, ${entry.error ?? null}, ${new Date(entry.expiresAt)}, NOW())
      ON CONFLICT ("profileHash")
      DO UPDATE SET
        "reportText" = EXCLUDED."reportText",
        "source" = EXCLUDED."source",
        "error" = EXCLUDED."error",
        "expiresAt" = EXCLUDED."expiresAt",
        "updatedAt" = NOW()
    `;
  } catch {
    // Best effort persistence.
  }
}

function fallbackReport(testId: string, score: QuestionnaireScore): string {
  const natural = generateSpecificTestReport(testId, score);
  const band = inferFallbackBand(score);
  const recommendations =
    band === "high"
      ? "Priorisez 3 actions simples pendant 7 jours: horaires de sommeil reguliers, reduction des facteurs de surcharge en soiree, et prise de rendez-vous avec un professionnel de sante mentale dans un delai court."
      : band === "moderate"
        ? "Mettez en place un plan sur 2 semaines avec routines stables (sommeil, activite physique moderee, respiration lente), puis reevaluez l'evolution des symptomes."
        : "Maintenez des habitudes protectrices: sommeil regulier, activite physique douce, temps d'ecran limite en fin de journee et points de pause dans la semaine.";
  const encouragement =
    band === "high"
      ? "Une amelioration reste possible meme si la charge actuelle est importante. Un accompagnement structure augmente nettement les chances de stabilisation."
      : "Avec de la constance et un soutien adapte, ce type de difficulte peut s'ameliorer. Demander de l'aide est une strategie de protection, pas un echec.";
  const ethical =
    band === "high"
      ? "Ce resultat ne remplace pas une evaluation clinique. Si la detresse augmente, si vous vous sentez en risque, ou si des idees de mort apparaissent, contactez sans attendre un professionnel ou les services d'urgence."
      : "Ce resultat ne remplace pas une evaluation clinique. Si la gene augmente ou devient invalidante, parlez-en rapidement avec un professionnel de sante.";

  return [
    natural.introduction,
    natural.emotionalSummary,
    natural.dominantFocus,
    "Ces signaux sont des indicateurs d'orientation et non un diagnostic. Ils servent a mieux comprendre ce qui merite une attention progressive.",
    recommendations,
    encouragement,
    ethical,
  ].join("\n\n");
}

function buildPromptForHuggingFaceSpecific(
  testId: string,
  score: QuestionnaireScore,
  answers: number[],
  urgentSupportRecommended: boolean
): string {
  const topItems = pickMostRelevantItems(answers, 3);
  const componentsSummary = score.components
    ? Object.entries(score.components)
        .map(([key, value]) => `${key}=${value}`)
        .join(", ")
    : "none";
  const mdqConstraint =
    testId === "mdq"
      ? `Contraintes MDQ factuelles: officialPositiveScreen=${score.components?.officialPositiveScreen ?? "unknown"}, symptomCriterionMet=${score.components?.symptomCriterionMet ?? "unknown"}, cooccurrenceYes=${score.components?.cooccurrenceYes ?? "unknown"}, impairmentModerateOrSerious=${score.components?.impairmentModerateOrSerious ?? "unknown"}. Si officialPositiveScreen=0, ne pas affirmer que les criteres complets sont valides et ne pas conclure a un depistage officiel positif.`
      : "";
  return [
    "Tu es psychologue clinicien et redacteur scientifique en sante mentale.",
    "Tu rediges un rapport court pour un test psychometrique specifique.",
    `Test: ${testId}.`,
    `Niveau normalise (0-1): ${score.normalizedScore.toFixed(2)}.`,
    `Interpretation: ${score.interpretation.label}.`,
    `Signification clinique: ${score.interpretation.clinicalMeaning}.`,
    `Composants de score: ${componentsSummary}.`,
    `Items saillants (indices): ${topItems.join("/") || "none"}.`,
    `Signal urgent: ${urgentSupportRecommended ? "oui" : "non"}.`,
    mdqConstraint,
    "Redige un rapport unique, personalise, synthetique, scientifique et bienveillant en francais.",
    "Interdictions: aucune repetition, aucun score brut, aucun diagnostic certain, aucun titre, aucune mention d'entretien clinique.",
    "Interdictions supplementaires: ne jamais inventer l'age, ne jamais dire 'votre enfant', ne jamais inventer des informations familiales ou scolaires.",
    "Structure obligatoire en 7 paragraphes dans cet ordre: introduction, synthese emotionnelle/symptomes, focus du test, psychoeducation, recommandations concretes, encouragement, avertissement ethique.",
    "Format strict: exactement 7 paragraphes separes par une ligne vide (\\n\\n).",
  ].join("\n");
}

function sanitizeOutput(text: string): string {
  return text
    .replace(/^\s*(introduction|resume|focus|psychoeducation|recommandations|encouragement|avertissement)\s*[:\-]\s*/gim, "")
    .replace(/\b(PHQ-?9|GAD-?7|PCL-?5|TOC|EAT-?26)\s*[:=]?\s*\d+\s*(\/\s*\d+)?/gi, "")
    .replace(/\b(entretien clinique|entretien|consultation deja faite)\b/gi, "questionnaire")
    .replace(/\b(climat de confiance|passation)\b/gi, "realisation")
    .replace(/\bvotre enfant\b/gi, "vous")
    .replace(/\bvotre adolescent\b/gi, "vous")
    .replace(/\bson enfant\b/gi, "vous")
    .replace(/\bles parents\b/gi, "la personne")
    .replace(/:\s*1\.\s*/g, ": 1. ")
    .replace(/\s+2\.\s*$/g, " ")
    .replace(/\s{3,}/g, " ")
    .trim();
}

function ensureCompleteEnding(text: string): string {
  const trimmed = text.trim().replace(/\s+[a-z]{1,4}$/i, "");
  if (!trimmed) return trimmed;
  if (/[.!?]"?$/.test(trimmed)) return trimmed;
  return `${trimmed} Ce test reste un outil d'orientation et ne remplace pas une evaluation clinique.`;
}

function looksTruncatedParagraph(paragraph: string): boolean {
  const p = paragraph.trim();
  if (!p) return true;
  if (!/[.!?]"?$/.test(p)) return true;
  if (/\b(ou vous|ce qui|afin de|pour que|puis)\s*$/i.test(p)) return true;
  if (/\b\d+\.\s*$/i.test(p)) return true;
  return false;
}

function normalizeParagraphQuality(text: string): string {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (paragraphs.length === 0) return text;

  const enriched = [...paragraphs];
  for (let i = 0; i < enriched.length; i += 1) {
    const paragraph = enriched[i] ?? "";
    if (!looksTruncatedParagraph(paragraph)) continue;

    if (i >= enriched.length - 2) {
      enriched[i] =
        "Ce test reste un outil d'orientation et ne remplace pas une evaluation clinique. Si la gene augmente ou devient invalidante, parlez-en rapidement avec un professionnel de sante.";
    } else {
      enriched[i] =
        "Ces manifestations peuvent s'ameliorer avec des strategies progressives. Un accompagnement adapte aide generalement a stabiliser la situation.";
    }
  }

  return enriched.join("\n\n");
}

function normalizeParagraphs(text: string): string {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  const existing = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (existing.length >= 7) return existing.slice(0, 7).join("\n\n");

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length === 0) return cleaned;

  const grouped: string[] = [];
  let cursor = 0;
  for (let i = 0; i < 7; i += 1) {
    const remainingSentences = sentences.length - cursor;
    const remainingGroups = 7 - i;
    if (remainingSentences <= 0) break;
    const take = Math.max(1, Math.ceil(remainingSentences / remainingGroups));
    grouped.push(sentences.slice(cursor, cursor + take).join(" "));
    cursor += take;
  }

  const fillers = [
    "Une routine simple et stable peut deja diminuer la charge emotionnelle.",
    "Demander un soutien adapte est une demarche de protection.",
    "Ce test reste un outil d'orientation et ne remplace pas une evaluation clinique.",
  ];

  let index = 0;
  while (grouped.length < 7) {
    grouped.push(fillers[index % fillers.length]);
    index += 1;
  }

  return grouped.slice(0, 7).join("\n\n");
}

function enforceFactualConsistency(testId: string, score: QuestionnaireScore, text: string): string {
  let fixed = text
    .replace(/\bvotre enfant\b/gi, "vous")
    .replace(/\bvotre adolescent\b/gi, "vous")
    .replace(/\bson enfant\b/gi, "vous");

  if (testId === "mdq") {
    const officialPositive = Number(score.components?.officialPositiveScreen ?? -1);
    if (officialPositive === 0) {
      fixed = fixed
        .replace(
          /\b(vous|la personne)\s+a\s+valide[^.]*criteres[^.]*\./gi,
          "Le seuil symptomatique est atteint, mais les criteres complets du depistage officiel MDQ ne sont pas reunis."
        )
        .replace(
          /\bdepistage\s+(officiel\s+)?positif[^.]*\./gi,
          "Le depistage officiel MDQ n'est pas positif sur ce profil."
        )
        .replace(
          /\boriente\s+vers\s+un\s+terrain\s+cyclothymique[^.]*\./gi,
          "Le profil suggere une vigilance clinique sans conclusion diagnostique."
        )
        .replace(
          /\boriente\s+vers\s+un\s+trouble\s+bipolaire[^.]*\./gi,
          "Le profil suggere une vigilance clinique sans conclusion diagnostique."
        );
    }
  }

  return fixed;
}

async function callHuggingFace(prompt: string): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("Missing HUGGINGFACE_API_KEY");

  const primaryModel = process.env.HUGGINGFACE_MODEL || DEFAULT_MODEL;
  const fallbackModels = (process.env.HUGGINGFACE_FALLBACK_MODELS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  const modelCandidates = [primaryModel, ...fallbackModels, ...DEFAULT_FALLBACK_MODELS].filter(
    (value, index, list) => list.indexOf(value) === index
  );
  const maxNewTokens = Number(process.env.HUGGINGFACE_MAX_NEW_TOKENS ?? DEFAULT_MAX_NEW_TOKENS);
  const retryableStatuses = new Set([408, 429, 500, 502, 503, 504]);
  const errors: string[] = [];

  for (const model of modelCandidates) {
    for (let attempt = 0; attempt <= HF_MAX_RETRIES; attempt += 1) {
      try {
        const response = await fetch(HUGGING_FACE_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "Tu rediges des rapports psychometriques educatifs, clairs, bienveillants, sans diagnostic certain.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: Number.isFinite(maxNewTokens) ? maxNewTokens : DEFAULT_MAX_NEW_TOKENS,
            temperature: 0.8,
            top_p: 0.92,
            frequency_penalty: 0.2,
            presence_penalty: 0.1,
          }),
          cache: "no-store",
        });

        if (!response.ok) {
          const body = await response.text();
          errors.push(`model=${model} attempt=${attempt} status=${response.status}: ${body.slice(0, 180)}`);
          if (retryableStatuses.has(response.status) && attempt < HF_MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
            continue;
          }
          break;
        }

        const json = (await response.json()) as HuggingFaceChatCompletionResponse;
        const generated = json.choices?.[0]?.message?.content?.trim() ?? "";
        if (!generated) {
          errors.push(`model=${model} attempt=${attempt}: empty content`);
          if (attempt < HF_MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
            continue;
          }
          break;
        }

        return generated;
      } catch (error) {
        errors.push(
          `model=${model} attempt=${attempt}: ${
            error instanceof Error ? error.message : "network error"
          }`
        );
        if (attempt < HF_MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
  }

  throw new Error(`Hugging Face retries exhausted: ${errors.slice(-6).join(" | ")}`);
}

export async function generateHuggingFaceSpecificReport(
  testId: string,
  score: QuestionnaireScore,
  answers: number[],
  urgentSupportRecommended: boolean
): Promise<GeneratedSpecificAiReport> {
  const cacheKey = stableProfileHash(testId, score, answers);
  const now = Date.now();
  const cached = reportCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return { text: cached.report, source: cached.source, cached: true, error: cached.error };
  }

  const persisted = await readPersistedCache(cacheKey, new Date(now));
  if (persisted) {
    cleanupCache(now);
    reportCache.set(cacheKey, persisted);
    return { text: persisted.report, source: persisted.source, cached: true, error: persisted.error };
  }

  const prompt = buildPromptForHuggingFaceSpecific(testId, score, answers, urgentSupportRecommended);
  try {
    const generated = await callHuggingFace(prompt);
    const report = normalizeParagraphQuality(
      normalizeParagraphs(
        enforceFactualConsistency(
          testId,
          score,
          ensureCompleteEnding(normalizeParagraphs(sanitizeOutput(generated)))
        )
      )
    );
    if (!report) throw new Error("Empty generated report");

    cleanupCache(now);
    const entry: CacheEntry = {
      report,
      source: "huggingface",
      expiresAt: now + CACHE_TTL_MS,
    };
    reportCache.set(cacheKey, entry);
    await persistCache(cacheKey, entry);
    return { text: report, source: "huggingface", cached: false };
  } catch (error) {
    const report = fallbackReport(testId, score);
    const reason = error instanceof Error ? error.message : "Unknown Hugging Face error";
    cleanupCache(now);
    const entry: CacheEntry = {
      report,
      source: "fallback",
      expiresAt: now + CACHE_TTL_MS,
      error: reason,
    };
    reportCache.set(cacheKey, entry);
    await persistCache(cacheKey, entry);
    return { text: report, source: "fallback", cached: false, error: reason };
  }
}
