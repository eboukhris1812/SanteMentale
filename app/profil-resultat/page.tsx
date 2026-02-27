"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { repairFrenchText } from "@/lib/text/repairFrenchText";

type Interpretation = {
  label: string;
  severity: string;
  clinicalMeaning: string;
};

type QuestionnaireScore = {
  questionnaireId: "phq9" | "gad7" | "pcl5Short" | "miniToc";
  version: string;
  totalScore: number;
  maxScore: number;
  normalizedScore: number;
  interpretation: Interpretation;
};

type NaturalReport = {
  introduction: string;
  emotionalSummary: string;
  dominantFocus: string;
  psychoeducation: string;
  recommendations: string[];
  encouragement: string;
  ethicalNotice: string;
};

type ApiResult = {
  results: {
    scores: {
      phq9: QuestionnaireScore;
      gad7: QuestionnaireScore;
      pcl5Short: QuestionnaireScore;
      miniToc: QuestionnaireScore;
    };
    categoryScores: {
      depression: number;
      anxiety: number;
      trauma: number;
      ocd: number;
      personality: number;
      eating: number;
      neurodevelopment: number;
    };
    dominantCategory:
      | "depression"
      | "anxiety"
      | "trauma"
      | "ocd"
      | "personality"
      | "eating"
      | "neurodevelopment"
      | null;
    dominantCategories: Array<
      | "depression"
      | "anxiety"
      | "trauma"
      | "ocd"
      | "personality"
      | "eating"
      | "neurodevelopment"
    >;
  };
  dominantCategories: Array<
    | "depression"
    | "anxiety"
    | "trauma"
    | "ocd"
    | "personality"
    | "eating"
    | "neurodevelopment"
  >;
  dominantCategory:
    | "depression"
    | "anxiety"
    | "trauma"
    | "ocd"
    | "personality"
    | "eating"
    | "neurodevelopment"
    | null;
  naturalReport: NaturalReport;
  aiReport?: string;
  aiReportSource?: "huggingface" | "fallback";
  aiReportCached?: boolean;
  methodology: {
    framework: string;
    scoringMethod: string;
    ageTarget: string;
    limitations: string[];
    sources: string[];
  };
  safety: {
    educationalPurposeOnly: boolean;
    emergencyDisclaimer: string;
    urgentSupportRecommended: boolean;
    urgentSupportReason: string;
  };
};

function normalizeApiResult(input: ApiResult | (Omit<ApiResult, "results"> & {
  scores: ApiResult["results"]["scores"];
  categoryScores: ApiResult["results"]["categoryScores"];
})): ApiResult {
  if ("results" in input) {
    const maybeLegacy = input as ApiResult & {
      dominantCategories?: ApiResult["dominantCategories"];
      results: ApiResult["results"] & {
        dominantCategories?: ApiResult["dominantCategories"];
      };
    };

    const resolvedDominantCategories =
      maybeLegacy.dominantCategories ??
      maybeLegacy.results.dominantCategories ??
      (maybeLegacy.dominantCategory ? [maybeLegacy.dominantCategory] : []);

    const aiReport =
      maybeLegacy.aiReport ??
      [
        maybeLegacy.naturalReport.introduction,
        maybeLegacy.naturalReport.emotionalSummary,
        maybeLegacy.naturalReport.dominantFocus,
        maybeLegacy.naturalReport.psychoeducation,
        maybeLegacy.naturalReport.recommendations.join(" "),
        maybeLegacy.naturalReport.encouragement,
        maybeLegacy.naturalReport.ethicalNotice,
      ].join("\n\n");

    return {
      ...maybeLegacy,
      aiReport,
      aiReportSource: maybeLegacy.aiReportSource ?? "fallback",
      aiReportCached: maybeLegacy.aiReportCached ?? false,
      dominantCategories: resolvedDominantCategories,
      results: {
        ...maybeLegacy.results,
        dominantCategories: resolvedDominantCategories,
      },
    };
  }

  return {
    ...input,
    aiReport:
      input.aiReport ??
      [
        input.naturalReport.introduction,
        input.naturalReport.emotionalSummary,
        input.naturalReport.dominantFocus,
        input.naturalReport.psychoeducation,
        input.naturalReport.recommendations.join(" "),
        input.naturalReport.encouragement,
        input.naturalReport.ethicalNotice,
      ].join("\n\n"),
    aiReportSource: input.aiReportSource ?? "fallback",
    aiReportCached: input.aiReportCached ?? false,
    results: {
      scores: input.scores,
      categoryScores: input.categoryScores,
      dominantCategory: input.dominantCategory,
      dominantCategories: input.dominantCategory ? [input.dominantCategory] : [],
    },
    dominantCategories: input.dominantCategory ? [input.dominantCategory] : [],
  };
}

const dominantLabelMap: Record<Exclude<ApiResult["dominantCategory"], null>, string> = {
  depression: "Dépression",
  anxiety: "Anxiété",
  trauma: "Trauma",
  ocd: "TOC",
  personality: "Personnalité",
  eating: "Conduites alimentaires",
  neurodevelopment: "Neurodéveloppement",
};

const orientationMap: Record<
  Exclude<ApiResult["dominantCategory"], null>,
  {
    specificTestName: string;
    specificTestHref: string;
    troubleSheetHref: string;
  }
> = {
  depression: {
    specificTestName: "PHQ-9",
    specificTestHref: "/tests/phq9",
    troubleSheetHref: "/troubles/depression-majeure",
  },
  anxiety: {
    specificTestName: "GAD-7",
    specificTestHref: "/tests/gad7",
    troubleSheetHref: "/categories/troubles-anxieux",
  },
  trauma: {
    specificTestName: "PCL-5 (20 items)",
    specificTestHref: "/tests/pcl5",
    troubleSheetHref: "/troubles/tspt",
  },
  ocd: {
    specificTestName: "Mini-TOC",
    specificTestHref: "/tests/mini-toc",
    troubleSheetHref: "/troubles/toc",
  },
  personality: {
    specificTestName: "SAPAS (tri initial personnalité)",
    specificTestHref: "/tests/sapas",
    troubleSheetHref: "/categories/troubles-personnalite",
  },
  eating: {
    specificTestName: "EAT-26",
    specificTestHref: "/tests/eat26",
    troubleSheetHref: "/categories/troubles-conduites-alimentaires",
  },
  neurodevelopment: {
    specificTestName: "ASRS v1.1 (18 items)",
    specificTestHref: "/tests/asrs-v11",
    troubleSheetHref: "/categories/troubles-neurodeveloppementaux",
  },
};

function withRecommendationParams(
  href: string,
  dominantCategory: Exclude<ApiResult["dominantCategory"], null>
): string {
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}source=bilan-global&recommended=1&dominant=${dominantCategory}`;
}

export default function Resultats() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);

  const computeFromApi = async () => {
    setLoading(true);
    setError(null);
    setDetails(null);
    try {
      const cachedResult = sessionStorage.getItem("bilanApiResult");
      if (cachedResult) {
        const parsed = JSON.parse(cachedResult) as ApiResult | (Omit<ApiResult, "results"> & {
          scores: ApiResult["results"]["scores"];
          categoryScores: ApiResult["results"]["categoryScores"];
        });
        setResult(normalizeApiResult(parsed));
        setLoading(false);
        return;
      }

      const rawPayload = sessionStorage.getItem("bilanPayload");
      if (!rawPayload) {
        setError("Aucun questionnaire trouvé. Recommence le bilan.");
        setLoading(false);
        return;
      }

      const payload = JSON.parse(rawPayload);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const response = await fetch("/api/bilans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Erreur API ${response.status}: ${detail}`);
      }

      const apiResult = normalizeApiResult(
        (await response.json()) as ApiResult | (Omit<ApiResult, "results"> & {
          scores: ApiResult["results"]["scores"];
          categoryScores: ApiResult["results"]["categoryScores"];
        })
      );
      sessionStorage.setItem("bilanApiResult", JSON.stringify(apiResult));
      setResult(apiResult);
      setLoading(false);
    } catch (computeError) {
      console.error("Erreur calcul résultat:", computeError);
      const message = computeError instanceof Error ? computeError.message : "Erreur inconnue";
      setError("Impossible de calculer le bilan actuellement.");
      setDetails(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    void computeFromApi();
  }, []);

  const globalIndex = useMemo(() => {
    if (!result) {
      return 0;
    }

    const values = Object.values(result.results.categoryScores);
    if (values.length === 0) {
      return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [result]);

  const aiReportParagraphs = useMemo(() => {
    if (!result?.aiReport) {
      return [];
    }
    return result.aiReport
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);
  }, [result]);

  const recommendedDominants = useMemo(() => {
    if (!result) return [] as Array<Exclude<ApiResult["dominantCategory"], null>>;
    if (result.dominantCategories.length === 0) return [] as Array<Exclude<ApiResult["dominantCategory"], null>>;
    return [...result.dominantCategories]
      .sort(
        (a, b) =>
          (result.results.categoryScores[b] ?? 0) - (result.results.categoryScores[a] ?? 0)
      )
      .slice(0, 3);
  }, [result]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Bilan synthétique</h2>
        <p className="text-gray-700">Calcul du bilan en cours...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Bilan synthétique</h2>
        <p className="text-red-700 mb-4">{error ?? "Aucun résultat disponible."}</p>
        {details && <p className="text-xs text-gray-600 mb-4">{details}</p>}
        <button
          onClick={() => void computeFromApi()}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Bilan synthétique</h2>
        <p className="text-gray-700">
          Les scores ci-dessous sont calculés côté serveur via le moteur psychométrique.
        </p>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="font-medium">Indice global normalisé</p>
        <p className="text-3xl font-bold">{(globalIndex * 100).toFixed(1)}%</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="font-medium">Catégorie dominante</p>
        <p className="text-lg">
          {result.dominantCategories.length === 0
            ? "Aucune dominante (sous seuil de dépistage)"
            : result.dominantCategories
                .map((key) => dominantLabelMap[key])
                .join(" / ")}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="font-medium mb-2">Scores par catégorie</p>
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(result.results.categoryScores).map(([key, value]) => (
            <p key={key} className="text-sm text-gray-700">
              {dominantLabelMap[key as Exclude<ApiResult["dominantCategory"], null>]}:{" "}
              <span className="font-semibold">{(value * 100).toFixed(1)}%</span>
            </p>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-emerald-900">Rapport personnalisé</p>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-emerald-900">
            Source: {result.aiReportSource === "huggingface" ? "IA Hugging Face" : "Moteur local"}
          </span>
          {result.aiReportCached && (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-emerald-900">
              Cache serveur
            </span>
          )}
        </div>
        <div className="space-y-3">
          {aiReportParagraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-sm text-emerald-950">
              {repairFrenchText(paragraph)}
            </p>
          ))}
        </div>
      </div>

      {recommendedDominants.length === 1 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <p className="font-semibold mb-1">Étape suivante recommandée</p>
          <p className="text-sm text-gray-700 mb-3">
            Continue avec un test ciblé ({orientationMap[recommendedDominants[0]].specificTestName})
            ou consulte la fiche explicative associée.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={withRecommendationParams(
                orientationMap[recommendedDominants[0]].specificTestHref,
                recommendedDominants[0]
              )}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Aller au test spécifique
            </Link>
            <Link
              href={orientationMap[recommendedDominants[0]].troubleSheetHref}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            >
              Voir la fiche trouble
            </Link>
            <Link
              href="/bilan-global"
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            >
              Refaire le bilan
            </Link>
          </div>
        </div>
      )}

      {recommendedDominants.length > 1 && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <p className="font-semibold mb-1">Étapes suivantes recommandées</p>
          <p className="text-sm text-gray-700 mb-3">
            Plusieurs dimensions ressortent. Choisis 2 a 3 tests cibles pour affiner le bilan.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {recommendedDominants.map((category) => (
              <div key={category} className="rounded-lg border border-indigo-200 bg-white p-3 space-y-2">
                <p className="font-medium text-indigo-900">{dominantLabelMap[category]}</p>
                <p className="text-sm text-gray-700">
                  Test recommande: {orientationMap[category].specificTestName}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={withRecommendationParams(orientationMap[category].specificTestHref, category)}
                    className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                  >
                    Lancer le test
                  </Link>
                  <Link
                    href={orientationMap[category].troubleSheetHref}
                    className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    Fiche trouble
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link
              href="/bilan-global"
              className="inline-block px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            >
              Refaire le bilan
            </Link>
          </div>
        </div>
      )}

      {result.safety.urgentSupportRecommended && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-900">
          <p className="font-semibold mb-1">Avertissement prioritaire</p>
          <p>{result.safety.urgentSupportReason}</p>
        </div>
      )}

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 space-y-3">
        <p className="font-semibold">Méthodologie (conformité IB)</p>
        <p>
          <span className="font-medium">Cadre:</span> {result.methodology.framework}
        </p>
        <p>
          <span className="font-medium">Méthode de score:</span> {result.methodology.scoringMethod}
        </p>
        <p>
          <span className="font-medium">Population cible:</span> {result.methodology.ageTarget}
        </p>
        <div>
          <p className="font-medium mb-1">Limites scientifiques:</p>
          <ul className="list-disc pl-5 space-y-1">
            {result.methodology.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium mb-1">Références:</p>
          <ul className="list-disc pl-5 space-y-1">
            {result.methodology.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-900">
        <p className="font-semibold mb-1">Avertissement</p>
        <p>
          Outil éducatif: ce résultat ne remplace pas une évaluation clinique par un professionnel de santé.
        </p>
        <p className="mt-1">{result.safety.emergencyDisclaimer}</p>
      </div>
    </div>
  );
}


