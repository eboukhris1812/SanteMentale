"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type ApiResult = {
  scores: {
    phq9: QuestionnaireScore;
    gad7: QuestionnaireScore;
    pcl5Short: QuestionnaireScore;
    miniToc: QuestionnaireScore;
  };
  dominantCategory: "depression" | "anxiety" | "trauma" | "ocd";
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

const titleMap: Record<QuestionnaireScore["questionnaireId"], string> = {
  phq9: "PHQ-9 (dépression)",
  gad7: "GAD-7 (anxiété)",
  pcl5Short: "PCL-5 court (trauma)",
  miniToc: "Mini-TOC",
};

const dominantLabelMap: Record<ApiResult["dominantCategory"], string> = {
  depression: "Dépression",
  anxiety: "Anxiété",
  trauma: "Trauma",
  ocd: "TOC",
};

const orientationMap: Record<
  ApiResult["dominantCategory"],
  {
    specificTestName: string;
    specificTestHref: string;
    troubleSheetHref: string;
  }
> = {
  depression: {
    specificTestName: "PHQ-9",
    specificTestHref: "/tests/phq9",
    troubleSheetHref: "/troubles/humeur",
  },
  anxiety: {
    specificTestName: "GAD-7",
    specificTestHref: "/tests/gad7",
    troubleSheetHref: "/categories/troubles-anxieux",
  },
  trauma: {
    specificTestName: "PCL-5 court",
    specificTestHref: "/tests/pcl5-court",
    troubleSheetHref: "/troubles/traumatisme",
  },
  ocd: {
    specificTestName: "Mini-TOC",
    specificTestHref: "/tests/mini-toc",
    troubleSheetHref: "/troubles/obsessionnel-compulsif",
  },
};

function withRecommendationParams(
  href: string,
  dominantCategory: ApiResult["dominantCategory"]
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
      const cachedResult = localStorage.getItem("bilanApiResult");
      if (cachedResult) {
        const parsed = JSON.parse(cachedResult) as ApiResult;
        setResult(parsed);
        setLoading(false);
        return;
      }

      const rawPayload = localStorage.getItem("bilanPayload");
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

      const apiResult = (await response.json()) as ApiResult;
      localStorage.setItem("bilanApiResult", JSON.stringify(apiResult));
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

    const values = Object.values(result.scores).map((score) => score.normalizedScore);
    if (values.length === 0) {
      return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
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
        <p className="text-lg">{dominantLabelMap[result.dominantCategory]}</p>
      </div>

      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
        <p className="font-semibold mb-1">Étape suivante recommandée</p>
        <p className="text-sm text-gray-700 mb-3">
          Continue avec un test ciblé ({orientationMap[result.dominantCategory].specificTestName})
          ou consulte la fiche explicative associée.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={withRecommendationParams(
              orientationMap[result.dominantCategory].specificTestHref,
              result.dominantCategory
            )}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Aller au test spécifique
          </Link>
          <Link
            href={orientationMap[result.dominantCategory].troubleSheetHref}
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

      <div className="grid gap-4">
        {Object.values(result.scores).map((score) => (
          <article key={score.questionnaireId} className="border rounded-xl p-4">
            <h3 className="font-semibold mb-2">{titleMap[score.questionnaireId]}</h3>
            <p className="text-sm text-gray-700 mb-1">
              Score: {score.totalScore} / {score.maxScore}
            </p>
            <p className="text-sm text-gray-700 mb-1">Interprétation clinique: {score.interpretation.label}</p>
            <p className="text-sm text-gray-700">{score.interpretation.clinicalMeaning}</p>
          </article>
        ))}
      </div>

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
