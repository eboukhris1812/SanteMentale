import { createHash } from "node:crypto";
import { generateNaturalReport } from "@/features/assessment/engine/generateNaturalReport";
import type { AssessmentResults, DominantCategory } from "@/features/assessment/engine/types";
import { prisma } from "@/lib/server/prisma";

type ItemScores = NonNullable<AssessmentResults["itemScores"]>;

type HuggingFaceChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export type AiReportSource = "huggingface" | "fallback";

export type GeneratedAiReport = {
  text: string;
  source: AiReportSource;
  cached: boolean;
  error?: string;
};

type CacheEntry = {
  report: string;
  source: AiReportSource;
  expiresAt: number;
  error?: string;
};

const HUGGING_FACE_API_URL = "https://router.huggingface.co/v1/chat/completions";
const DEFAULT_MODEL = "moonshotai/Kimi-K2-Instruct-0905";
const DEFAULT_FALLBACK_MODELS = ["Qwen/Qwen2.5-7B-Instruct", "meta-llama/Llama-3.1-8B-Instruct"];
const DEFAULT_MAX_NEW_TOKENS = 420;
const HF_MAX_RETRIES = 2;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const REPORT_CACHE_MAX_ITEMS = 500;
const CACHE_VERSION = "hf-chat-v3";
const reportCache = new Map<string, CacheEntry>();

function categoryLabel(category: DominantCategory): string {
  if (category === "depression") return "humeur depressive";
  if (category === "anxiety") return "anxiete";
  if (category === "trauma") return "reactions post-traumatiques";
  if (category === "ocd") return "obsessions/compulsions";
  if (category === "personality") return "regulation emotionnelle et relationnelle";
  if (category === "eating") return "rapport a l'alimentation";
  return "attention et fonctionnement neurodeveloppemental";
}

function pickMostRelevantItems(items: number[], topN: number): number[] {
  return items
    .map((value, index) => ({ index, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, topN)
    .map((item) => item.index);
}

function symptomSignals(itemScores: ItemScores) {
  return {
    phq9TopItems: pickMostRelevantItems(itemScores.phq9, 3),
    gad7TopItems: pickMostRelevantItems(itemScores.gad7, 3),
    pcl5ShortTopItems: pickMostRelevantItems(itemScores.pcl5Short, 2),
    miniTocTopItems: pickMostRelevantItems(itemScores.miniToc, 2),
    personalityTopItems: pickMostRelevantItems(itemScores.personalityScreen, 2),
    eatingTopItems: pickMostRelevantItems(itemScores.eatingScreen, 2),
    neuroTopItems: pickMostRelevantItems(itemScores.neurodevScreen, 2),
  };
}

function stableProfileHash(results: AssessmentResults): string {
  const payload = {
    cacheVersion: CACHE_VERSION,
    scores: {
      phq9: Number(results.scores.phq9.normalizedScore.toFixed(4)),
      gad7: Number(results.scores.gad7.normalizedScore.toFixed(4)),
      pcl5Short: Number(results.scores.pcl5Short.normalizedScore.toFixed(4)),
      miniToc: Number(results.scores.miniToc.normalizedScore.toFixed(4)),
      personality: Number((results.categoryScores.personality ?? 0).toFixed(4)),
      eating: Number((results.categoryScores.eating ?? 0).toFixed(4)),
      neurodevelopment: Number((results.categoryScores.neurodevelopment ?? 0).toFixed(4)),
    },
    dominantCategories: [...results.dominantCategories].sort(),
    itemScores: results.itemScores ?? null,
  };

  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function cleanupCache(now = Date.now()): void {
  if (reportCache.size <= REPORT_CACHE_MAX_ITEMS) return;
  for (const [key, entry] of reportCache.entries()) {
    if (entry.expiresAt <= now) {
      reportCache.delete(key);
    }
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
    if (!row || row.expiresAt <= now) {
      return null;
    }

    const source: AiReportSource = row.source === "huggingface" ? "huggingface" : "fallback";
    return {
      report: row.reportText,
      source,
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
    // Best effort only: API still works with in-memory cache and fallback generation.
  }
}

function fallbackReport(results: AssessmentResults): string {
  const natural = generateNaturalReport(results);
  return [
    natural.introduction,
    natural.emotionalSummary,
    natural.dominantFocus,
    natural.psychoeducation,
    natural.recommendations.join(" "),
    natural.encouragement,
    natural.ethicalNotice,
  ].join("\n\n");
}

function compactScoreSummary(results: AssessmentResults): string {
  return Object.entries(results.categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `${key}:${value.toFixed(2)}`)
    .join(", ");
}

export function buildPromptForHuggingFace(results: AssessmentResults): string {
  const dominant =
    results.dominantCategories.map(categoryLabel).join(", ") || "aucune categorie dominante claire";
  const items = symptomSignals(
    results.itemScores ?? {
      phq9: [],
      gad7: [],
      pcl5Short: [],
      miniToc: [],
      personalityScreen: [],
      eatingScreen: [],
      neurodevScreen: [],
    }
  );

  return [
    "Tu es psychologue clinicien et redacteur scientifique en sante mentale.",
    "Public cible: toutes tranches d'age.",
    `Categories dominantes: ${dominant}.`,
    `Profil categories normalisees (0-1): ${compactScoreSummary(results)}.`,
    `Items les plus eleves (indices): PHQ9=${items.phq9TopItems.join("/") || "none"}, GAD7=${items.gad7TopItems.join("/") || "none"}, PCL5=${items.pcl5ShortTopItems.join("/") || "none"}, TOC=${items.miniTocTopItems.join("/") || "none"}, PERSONNALITE=${items.personalityTopItems.join("/") || "none"}, ALIMENTAIRE=${items.eatingTopItems.join("/") || "none"}, NEURO=${items.neuroTopItems.join("/") || "none"}.`,
    "Redige un rapport unique, personnalise, synthetique, scientifique et bienveillant en francais.",
    "Interdictions: aucune repetition, aucun score brut, aucun diagnostic certain, aucun titre.",
    "Interdictions supplementaires: ne jamais mentionner un entretien clinique, une consultation deja faite, ou des informations non presentes dans les questionnaires.",
    "Structure obligatoire en 7 paragraphes dans cet ordre: introduction, synthese emotionnelle/symptomes, focus categories dominantes, psychoeducation, recommandations concretes, encouragement, avertissement ethique.",
    "Format strict: produire exactement 7 paragraphes separes par une ligne vide (\\n\\n) et rien d'autre.",
    "Chaque paragraphe doit se terminer par une phrase complete avec ponctuation finale.",
    "Adapter le niveau de langage a la personne evaluee, ton rassurant et professionnel.",
  ].join("\n");
}

function stripPromptEcho(generated: string, prompt: string): string {
  if (generated.startsWith(prompt)) {
    return generated.slice(prompt.length).trim();
  }
  return generated.trim();
}

function sanitizeOutput(text: string): string {
  return text
    .replace(
      /^\s*(introduction|resume|focus|psychoeducation|recommandations|encouragement|avertissement)\s*[:\-]\s*/gim,
      ""
    )
    .replace(/\b(PHQ-?9|GAD-?7|PCL-?5|TOC|EAT-?26)\s*[:=]?\s*\d+\s*(\/\s*\d+)?/gi, "")
    .replace(/\b(entretien clinique|entretien|consultation deja faite)\b/gi, "questionnaire")
    .replace(
      /\s*Ces elements peuvent evoluer favorablement avec un accompagnement adapte\.\s*/gi,
      " "
    )
    .replace(
      /\s*Les signaux observes n'equivalent pas a un diagnostic, mais ils indiquent des points de vigilance utiles a suivre dans le temps\.\s*/gi,
      " "
    )
    .replace(/\s{3,}/g, " ")
    .trim();
}

function ensureCompleteEnding(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (/[.!?]"?$/.test(trimmed)) {
    return trimmed;
  }

  // If the model stops mid-sentence/word, append a safe closing sentence.
  return `${trimmed} Ce bilan reste un outil d'orientation et ne remplace pas une evaluation clinique.`;
}

function looksTruncatedParagraph(paragraph: string): boolean {
  const p = paragraph.trim();
  if (!p) return true;
  if (!/[.!?]"?$/.test(p)) return true;
  if (/\b(envoie alors|lorsqu'|ce qui|afin de|pour que)\s*$/i.test(p)) return true;
  return false;
}

function normalizeParagraphQuality(text: string, results: AssessmentResults): string {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    return text;
  }

  const enriched = [...paragraphs];

  const values = Object.values(results.categoryScores);
  const globalIndex = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const urgentSignal = (results.itemScores?.phq9?.[8] ?? 0) >= 1;

  for (let i = 0; i < enriched.length; i += 1) {
    const paragraph = enriched[i] ?? "";
    if (looksTruncatedParagraph(paragraph)) {
      if (i >= enriched.length - 2) {
        enriched[i] =
          urgentSignal || globalIndex >= 0.45
            ? "Ce bilan reste un outil d'orientation et ne remplace pas une evaluation clinique. En cas de detresse importante ou d'idees de vous faire du mal, contactez rapidement un professionnel de sante ou les services d'urgence."
            : "Ce bilan reste un outil d'orientation et ne remplace pas une evaluation clinique. Si vos difficultes augmentent dans les prochaines semaines, parlez-en avec un professionnel de sante pour etre accompagne de facon adaptee.";
      } else {
        enriched[i] =
          "Ces manifestations restent ajustables avec des strategies progressives. Un accompagnement adapte peut aider a consolider ces changements dans la duree.";
      }
    }
  }

  return enriched.join("\n\n");
}

function normalizeParagraphs(text: string): string {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  const existing = cleaned
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  if (existing.length >= 7) {
    return existing.slice(0, 7).join("\n\n");
  }

  const sentenceLike = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  if (sentenceLike.length === 0) {
    return cleaned;
  }

  const targetParagraphs = Math.min(7, Math.max(6, sentenceLike.length));
  const grouped: string[] = [];
  let cursor = 0;

  for (let i = 0; i < targetParagraphs; i += 1) {
    const remainingSentences = sentenceLike.length - cursor;
    const remainingGroups = targetParagraphs - i;
    const take = Math.max(1, Math.ceil(remainingSentences / remainingGroups));
    grouped.push(sentenceLike.slice(cursor, cursor + take).join(" ").trim());
    cursor += take;
  }

  return ensureMinimumParagraphs(grouped.filter((paragraph) => paragraph.length > 0), 7).join(
    "\n\n"
  );
}

function ensureMinimumParagraphs(paragraphs: string[], minCount: number): string[] {
  const result = [...paragraphs].slice(0, 7);
  const fillers = [
    "Une routine simple et realiste (sommeil, repas, activite physique douce, pauses regulieres) peut deja reduire la charge emotionnelle.",
    "Si la gene persiste ou s'intensifie, echanger avec un professionnel de sante mentale peut aider a cibler des strategies plus efficaces.",
    "Demander de l'aide est une demarche de protection et de prevention, pas un signe de faiblesse.",
    "Ce bilan a une finalite educative et d'orientation; en cas de detresse importante, contacte rapidement les services d'urgence ou une personne de confiance.",
    "Progressivement, des ajustements concrets et un soutien adapte peuvent ameliorer la stabilite emotionnelle et le fonctionnement quotidien.",
    "Avancer par petites etapes mesurables est souvent plus efficace qu'un plan trop ambitieux difficile a maintenir.",
    "Avec de la regularite, des outils simples peuvent produire une amelioration nette du confort psychologique au quotidien.",
  ];

  let fillerIndex = 0;
  while (result.length < minCount) {
    result.push(fillers[fillerIndex % fillers.length]);
    fillerIndex += 1;
  }

  return result.slice(0, 7);
}

async function callHuggingFace(prompt: string): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing HUGGINGFACE_API_KEY");
  }

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
                  "Tu rediges des rapports psychometriques educatifs, clairs, non repetitifs, bienveillants, sans diagnostic certain.",
              },
              {
                role: "user",
                content: prompt,
              },
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

export async function generateHuggingFaceReport(
  results: AssessmentResults
): Promise<GeneratedAiReport> {
  const cacheKey = stableProfileHash(results);
  const now = Date.now();
  const cached = reportCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    const normalizedCachedText = normalizeParagraphs(cached.report);
    if (normalizedCachedText !== cached.report) {
      cached.report = normalizedCachedText;
      reportCache.set(cacheKey, cached);
      await persistCache(cacheKey, cached);
    }
    return {
      text: normalizedCachedText,
      source: cached.source,
      cached: true,
      error: cached.error,
    };
  }

  const persisted = await readPersistedCache(cacheKey, new Date(now));
  if (persisted) {
    const normalizedPersistedText = normalizeParagraphs(persisted.report);
    if (normalizedPersistedText !== persisted.report) {
      persisted.report = normalizedPersistedText;
      await persistCache(cacheKey, persisted);
    }
    cleanupCache(now);
    reportCache.set(cacheKey, persisted);
    return {
      text: normalizedPersistedText,
      source: persisted.source,
      cached: true,
      error: persisted.error,
    };
  }

  const prompt = buildPromptForHuggingFace(results);

  try {
    const generated = await callHuggingFace(prompt);
    const report = normalizeParagraphQuality(
      ensureCompleteEnding(normalizeParagraphs(sanitizeOutput(stripPromptEcho(generated, prompt))))
      ,
      results
    );
    if (!report) {
      throw new Error("Empty generated report");
    }

    cleanupCache(now);
    const entry: CacheEntry = {
      report,
      source: "huggingface",
      expiresAt: now + CACHE_TTL_MS,
      error: undefined,
    };
    reportCache.set(cacheKey, entry);
    await persistCache(cacheKey, entry);

    return {
      text: report,
      source: "huggingface",
      cached: false,
    };
  } catch (error) {
    const report = fallbackReport(results);
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

    return {
      text: report,
      source: "fallback",
      cached: false,
      error: reason,
    };
  }
}
