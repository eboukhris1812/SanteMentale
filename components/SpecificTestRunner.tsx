"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { QuestionnaireScore } from "@/features/assessment/engine";
import { questionnaireRegistry } from "@/features/assessment/schemas";

type QuestionnaireId = "phq9" | "gad7" | "pcl5Short" | "miniToc";

type SpecificTestApiResponse = {
  testId: QuestionnaireId;
  score: QuestionnaireScore;
  methodology: {
    framework: string;
    source: string;
    educationalPurposeOnly: boolean;
  };
  safety: {
    urgentSupportRecommended: boolean;
    urgentSupportReason: string;
  };
};

type SpecificTestRunnerProps = {
  title: string;
  description: string;
  apiPath: string;
  testId: QuestionnaireId;
  recommendation?: {
    fromBilanGlobal: boolean;
    dominant: string | null;
  };
};

export default function SpecificTestRunner({
  title,
  description,
  apiPath,
  testId,
  recommendation,
}: SpecificTestRunnerProps) {
  const definition = questionnaireRegistry[testId];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SpecificTestApiResponse | null>(null);

  const options = useMemo(
    () =>
      Object.entries(definition.scale.anchors)
        .map(([key, label]) => ({ value: Number(key), label }))
        .sort((a, b) => a.value - b.value),
    [definition.scale.anchors]
  );

  const progress = ((current + 1) / definition.items.length) * 100;
  const currentItem = definition.items[current];
  const isRecommendedFlow = recommendation?.fromBilanGlobal === true;
  const dominant = recommendation?.dominant ?? null;

  const submit = async (nextAnswers: Record<number, number>) => {
    setSubmitting(true);
    setError(null);

    try {
      const orderedAnswers = definition.items.map((_, index) => {
        const value = nextAnswers[index];
        if (typeof value !== "number") {
          throw new Error("Reponse manquante.");
        }
        return value;
      });

      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: orderedAnswers }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Erreur API ${response.status}: ${detail}`);
      }

      const payload = (await response.json()) as SpecificTestApiResponse;
      setResult(payload);
      setSubmitting(false);
    } catch (submitError) {
      setSubmitting(false);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible de calculer le resultat."
      );
    }
  };

  const handleAnswer = (value: number) => {
    if (submitting || result) {
      return;
    }

    const nextAnswers = { ...answers, [current]: value };
    setAnswers(nextAnswers);

    if (current < definition.items.length - 1) {
      setCurrent(current + 1);
      return;
    }

    void submit(nextAnswers);
  };

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setError(null);
    setResult(null);
    setSubmitting(false);
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-700">{description}</p>
        {isRecommendedFlow && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-900">
            Test recommande depuis le bilan global
            {dominant ? ` (dominante detectee: ${dominant}).` : "."}
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="font-medium">Score total</p>
          <p className="text-3xl font-bold">
            {result.score.totalScore} / {result.score.maxScore}
          </p>
        </div>

        <div className="p-4 border rounded-xl">
          <p className="font-medium mb-1">Interpretation</p>
          <p className="text-sm text-gray-700 mb-1">{result.score.interpretation.label}</p>
          <p className="text-sm text-gray-700">{result.score.interpretation.clinicalMeaning}</p>
        </div>

        {result.safety.urgentSupportRecommended && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-900">
            <p className="font-semibold mb-1">Avertissement prioritaire</p>
            <p>{result.safety.urgentSupportReason}</p>
          </div>
        )}

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800">
          <p className="font-semibold mb-1">Methodologie</p>
          <p>{result.methodology.framework}</p>
          <p className="mt-1">Reference scientifique: {result.methodology.source}</p>
        </div>

        <div>
          <button
            onClick={restart}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Refaire ce test
          </button>
          <Link
            href="/profil-resultat"
            className="inline-block ml-3 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Retour au bilan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-700">{description}</p>
      {isRecommendedFlow && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-900">
          Test recommande depuis le bilan global
          {dominant ? ` (dominante detectee: ${dominant}).` : "."}
        </div>
      )}

      <div className="mb-2 h-2 bg-gray-200 rounded">
        <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-sm text-gray-500">
        Question {current + 1} / {definition.items.length}
      </p>

      <h2 className="text-lg font-semibold">{currentItem.prompt}</h2>

      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            disabled={submitting}
            className="p-3 border rounded hover:bg-blue-50 disabled:opacity-60"
          >
            {option.label}
          </button>
        ))}
      </div>

      {submitting && <p className="text-sm text-gray-600">Calcul du score en cours...</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
