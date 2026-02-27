"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { QuestionnaireScore } from "@/features/assessment/engine";
import { questionnaireRegistry } from "@/features/assessment/schemas";

type QuestionnaireId = keyof typeof questionnaireRegistry;

type SpecificTestApiResponse = {
  testId: QuestionnaireId;
  score: QuestionnaireScore;
  aiReport?: string;
  aiReportSource?: "huggingface" | "fallback";
  aiReportCached?: boolean;
  naturalReport?: {
    introduction: string;
    emotionalSummary: string;
    dominantFocus: string;
    hasDominantCategory: boolean;
  };
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

  const options = useMemo(() => {
    const currentItem = definition.items[current];
    const itemMaxOption = definition.items[current]?.maxOption ?? definition.scale.max;
    const baseChoices = currentItem?.choices ?? definition.scale.anchors;
    return Object.entries(baseChoices)
      .map(([key, label]) => ({ value: Number(key), label: String(label) }))
      .filter((option) => option.value <= itemMaxOption)
      .sort((a, b) => a.value - b.value);
  }, [definition.items, definition.scale.anchors, definition.scale.max, current]);

  const progress = ((current + 1) / definition.items.length) * 100;
  const currentItem = definition.items[current];
  const isRecommendedFlow = recommendation?.fromBilanGlobal === true;
  const dominant = recommendation?.dominant ?? null;
  const isPdqSectionTest = testId === "pdq4A" || testId === "pdq4B" || testId === "pdq4C";
  const isSapasTest = testId === "sapas";
  const isMsiBpdTest = testId === "msiBpd";
  const aiReportParagraphs = useMemo(() => {
    if (!result?.aiReport) return [];
    return result.aiReport
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);
  }, [result?.aiReport]);

  const componentLabels: Record<string, string> = {
    motorTicScore: "Sous-score tics moteurs",
    vocalTicScore: "Sous-score tics vocaux",
    ticSeverityScore: "Severite totale des tics",
    impairmentScore: "Retentissement fonctionnel",
    criterionBCount: "Critere B (intrusion) - items >= 2",
    criterionCCount: "Critere C (évitement) - items >= 2",
    criterionDCount: "Critere D (cognitions/humeur) - items >= 2",
    criterionECount: "Critere E (reactivite) - items >= 2",
    criterionBMet: "Critere B valide (0/1)",
    criterionCMet: "Critere C valide (0/1)",
    criterionDMet: "Critere D valide (0/1)",
    criterionEMet: "Critere E valide (0/1)",
    provisionalByDsm5: "Profil DSM-5 provisoire (0/1)",
    provisionalByCutoff31: "Cut-off >= 31 (0/1)",
    provisionalByCutoff33: "Cut-off >= 33 (0/1)",
    radSubscore: "Sous-score RAD (profil inhibe/retrait)",
    radMax: "Maximum RAD",
    dsedSubscore: "Sous-score DSED (sociabilite desinhibee)",
    dsedMax: "Maximum DSED",
    radNormalized: "RAD normalise (0-1)",
    dsedNormalized: "DSED normalise (0-1)",
    radSignal: "Signal RAD élevé (0/1)",
    dsedSignal: "Signal DSED élevé (0/1)",
    symptomCount: "MDQ - nombre de symptomes (items 1-13)",
    symptomCriterionMet: "MDQ critere A >= 7 (0/1)",
    cooccurrenceYes: "MDQ critere B simultanéité (0/1)",
    impairmentModerateOrSerious: "MDQ critere C modéré/sérieux (0/1)",
    officialPositiveScreen: "MDQ dépistage positif officiel (0/1)",
    positiveActivation: "MDQ activation positive (sous-score)",
    negativeActivation: "MDQ activation negative (sous-score)",
    averageScore: "Score moyen (0-4)",
    meanSeverityLevel: "Niveau moyen de severite (0-4)",
    fearScore: "LSAS sous-score peur/anxiété",
    avoidanceScore: "LSAS sous-score évitement",
    performanceAnxietyScore: "LSAS sous-score performance",
    socialInteractionScore: "LSAS sous-score interaction sociale",
  };

  function getPersonalityPathway(score: QuestionnaireScore): {
    title: string;
    steps: string[];
    links: Array<{ href: string; label: string }>;
  } | null {
    if (testId === "sapas") {
      const positive = score.totalScore >= 3;
      return {
        title: "synthèse de parcours personnalite",
        steps: positive
          ? [
              "Tri SAPAS positif (>=3): dépistage complementaire recommande.",
              "Passer le PDQ-4+ complet (99 items) pour un panorama large.",
              "Ajouter MSI-BPD si suspicion de traits borderline.",
              "Confirmer par entretien clinique structure (SCID-5-PD/IPDE).",
            ]
          : [
              "Tri SAPAS négatif (<3): faible probabilité au dépistage rapide.",
              "Rester vigilant si souffrance importante ou retentissement fonctionnel.",
              "En cas de doute clinique, envisager quand même le PDQ-4+ complet.",
            ],
        links: positive
          ? [
              { href: "/tests/pdq4-complet?source=sapas&recommended=1", label: "PDQ-4+ complet (99 items)" },
              { href: "/tests/msi-bpd?source=sapas&recommended=1", label: "MSI-BPD (screening borderline)" },
            ]
          : [{ href: "/tests/pdq4-complet?source=sapas&recommended=1", label: "PDQ-4+ complet (optionnel)" }],
      };
    }

    if (testId === "msiBpd") {
      const positive = score.totalScore >= 7;
      return {
        title: "synthèse de parcours borderline",
        steps: positive
          ? [
              "MSI-BPD positif (>=7): suspicion clinique de traits borderline.",
              "complèter par évaluation globale de personnalite (PDQ-4+ complet).",
              "Confirmer par entretien clinique structure.",
            ]
          : [
              "MSI-BPD négatif (<7): dépistage borderline non concluant.",
              "Si doute persistant, complèter avec PDQ-4+ complet.",
            ],
        links: [{ href: "/tests/pdq4-complet?source=msi-bpd&recommended=1", label: "PDQ-4+ complet (99 items)" }],
      };
    }

    if (testId === "pdq4A" || testId === "pdq4B" || testId === "pdq4C") {
      const sectionLabel = testId === "pdq4A" ? "A" : testId === "pdq4B" ? "B" : "C";
      return {
        title: `synthèse de parcours section ${sectionLabel}`,
        steps: [
          "Section courte de repérage: resultat non diagnostique.",
          "étape suivante recommandee: PDQ-4+ complet (99 items).",
          "En cas de profil borderline suspect (section B), ajouter MSI-BPD.",
          "Confirmer ensuite par entretien clinique structure.",
        ],
        links:
          testId === "pdq4B"
            ? [
                { href: "/tests/pdq4-complet?source=pdq4-section&recommended=1", label: "PDQ-4+ complet (99 items)" },
                { href: "/tests/msi-bpd?source=pdq4-section&recommended=1", label: "MSI-BPD" },
              ]
            : [{ href: "/tests/pdq4-complet?source=pdq4-section&recommended=1", label: "PDQ-4+ complet (99 items)" }],
      };
    }

    if (testId === "pdq4Full") {
      return {
        title: "synthèse de parcours PDQ-4+ complet",
        steps: [
          "Le PDQ-4+ complet est un dépistage et ne suffit pas pour un diagnostic.",
          "Si plusieurs domaines sont positifs ou si la souffrance est élevée, orienter vers entretien clinique structure.",
          "Si traits borderline marquants, le MSI-BPD peut aider au tri cible.",
        ],
        links: [{ href: "/tests/msi-bpd?source=pdq4-complet&recommended=1", label: "MSI-BPD (optionnel)" }],
      };
    }

    return null;
  }

  const submit = async (nextAnswers: Record<number, number>) => {
    setSubmitting(true);
    setError(null);

    try {
      const orderedAnswers = definition.items.map((_, index) => {
        const value = nextAnswers[index];
        if (typeof value !== "number") {
          throw new Error("Réponse manquante.");
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
          : "Impossible de calculer le résultat."
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
    const pathway = getPersonalityPathway(result.score);
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-700">{description}</p>
        {isRecommendedFlow && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-900">
            Test recommandé depuis le bilan global
            {dominant ? ` (dominante détectée : ${dominant}).` : "."}
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="font-medium">Score total</p>
          <p className="text-3xl font-bold">
            {result.score.totalScore} / {result.score.maxScore}
          </p>
        </div>

        {result.score.components && Object.keys(result.score.components).length > 0 && (
          <div className="p-4 border rounded-xl">
            <p className="font-medium mb-2">Detail des composantés</p>
            <div className="grid gap-2">
              {Object.entries(result.score.components).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm text-gray-700">
                  <span>{componentLabels[key] ?? key}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border rounded-xl">
          <p className="font-medium mb-1">Interprétation</p>
          <p className="text-sm text-gray-700 mb-1">{result.score.interpretation.label}</p>
          <p className="text-sm text-gray-700">{result.score.interpretation.clinicalMeaning}</p>
        </div>

        {result.aiReport && (
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
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {!result.aiReport && result.naturalReport && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
            <p className="font-semibold text-emerald-900">Synthèse de ton évaluation</p>
            <p className="text-sm text-emerald-950">{result.naturalReport.introduction}</p>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-900">Résumé émotionnel</p>
              <p className="text-sm text-emerald-950">{result.naturalReport.emotionalSummary}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-900">
                {result.naturalReport.hasDominantCategory
                  ? "Focus sur la catégorie dominante"
                  : "Focus général"}
              </p>
              <p className="text-sm text-emerald-950">{result.naturalReport.dominantFocus}</p>
            </div>
          </div>
        )}

        {isPdqSectionTest && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
            <p className="font-semibold mb-1">étape suivante recommandee</p>
            <p>
              Cette section courte sert au repérage initial. Pour une évaluation plus complète des traits de
              personnalite, poursuivez avec le PDQ-4+ complet (99 items).
            </p>
            <Link
              href="/tests/pdq4-complet?source=pdq4-section&recommended=1"
              className="inline-block mt-3 px-4 py-2 rounded bg-amber-700 text-white hover:bg-amber-800"
            >
              Passer le PDQ-4+ complet
            </Link>
          </div>
        )}

        {isSapasTest && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
            <p className="font-semibold mb-1">Parcours recommande en pratique</p>
            <p>
              SAPAS est un tri initial. En cas de score positif, poursuivez avec le PDQ-4+ complet et,
              si des traits borderline sont suspectes, avec le MSI-BPD.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/tests/pdq4-complet?source=sapas&recommended=1"
                className="inline-block px-4 py-2 rounded bg-amber-700 text-white hover:bg-amber-800"
              >
                Passer le PDQ-4+ complet
              </Link>
              <Link
                href="/tests/msi-bpd?source=sapas&recommended=1"
                className="inline-block px-4 py-2 rounded border border-amber-300 bg-white hover:bg-amber-100"
              >
                Passer le MSI-BPD
              </Link>
            </div>
          </div>
        )}

        {isMsiBpdTest && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
            <p className="font-semibold mb-1">Interpretation clinique</p>
            <p>
              Le MSI-BPD est un outil de dépistage. Un resultat positif doit etre confirme par un
              entretien clinique structure (ex: SCID-5-PD).
            </p>
          </div>
        )}

        {pathway && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-900">
            <p className="font-semibold mb-2">{pathway.title}</p>
            <ul className="list-disc pl-5 space-y-1">
              {pathway.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            {pathway.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pathway.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-block px-4 py-2 rounded bg-indigo-700 text-white hover:bg-indigo-800"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {result.safety.urgentSupportRecommended && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-900">
            <p className="font-semibold mb-1">Avertissement prioritaire</p>
            <p>{result.safety.urgentSupportReason}</p>
          </div>
        )}

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800">
          <p className="font-semibold mb-1">Méthodologie</p>
          <p>{result.methodology.framework}</p>
          <p className="mt-1">Référence scientifique : {result.methodology.source}</p>
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
          Test recommandé depuis le bilan global
          {dominant ? ` (dominante détectée : ${dominant}).` : "."}
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


