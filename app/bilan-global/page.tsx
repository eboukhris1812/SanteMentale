"use client";

import { useState } from "react";

type QuestionnaireId = "phq9" | "gad7" | "pcl5Short" | "miniToc";

type Question = {
  id: string;
  questionnaire: QuestionnaireId;
  text: string;
  choices: readonly string[];
};

const questions: readonly Question[] = [
  {
    id: "phq9_1",
    questionnaire: "phq9",
    text: "Peu d'intérêt ou de plaisir à faire les choses.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_2",
    questionnaire: "phq9",
    text: "Se sentir triste, déprimé(e) ou sans espoir.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_3",
    questionnaire: "phq9",
    text: "Difficultés de sommeil (endormissement, réveils, trop dormir).",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_4",
    questionnaire: "phq9",
    text: "Se sentir fatigué(e) ou avec peu d'énergie.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_5",
    questionnaire: "phq9",
    text: "Problèmes d'appétit (pas faim ou manger trop).",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_6",
    questionnaire: "phq9",
    text: "Se sentir nul(le) ou coupable.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_7",
    questionnaire: "phq9",
    text: "Difficulté à se concentrer (cours, lecture, devoirs).",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_8",
    questionnaire: "phq9",
    text: "Lenteur inhabituelle ou agitation importante.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "phq9_9",
    questionnaire: "phq9",
    text: "Pensées que la vie ne vaut pas la peine ou auto-agression.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },

  {
    id: "gad7_1",
    questionnaire: "gad7",
    text: "Se sentir nerveux(se), anxieux(se) ou à bout.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "gad7_2",
    questionnaire: "gad7",
    text: "Ne pas réussir à arrêter de s'inquiéter.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "gad7_3",
    questionnaire: "gad7",
    text: "S'inquiéter trop pour différentes choses.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "gad7_4",
    questionnaire: "gad7",
    text: "Avoir du mal à se détendre.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "gad7_5",
    questionnaire: "gad7",
    text: "Être tellement agité(e) qu'il est difficile de rester en place.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "gad7_6",
    questionnaire: "gad7",
    text: "Devenir facilement irritable.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },
  {
    id: "gad7_7",
    questionnaire: "gad7",
    text: "Avoir peur que quelque chose de grave arrive.",
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
  },

  {
    id: "pcl5s_2",
    questionnaire: "pcl5Short",
    text: "Rêves répétés et pénibles liés à un événement stressant.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },
  {
    id: "pcl5s_4",
    questionnaire: "pcl5Short",
    text: "Se sentir très bouleversé(e) quand quelque chose rappelle l'événement.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },
  {
    id: "pcl5s_13",
    questionnaire: "pcl5Short",
    text: "Se sentir distant(e) ou coupé(e) des autres.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },
  {
    id: "pcl5s_15",
    questionnaire: "pcl5Short",
    text: "Difficultés de sommeil depuis l'événement.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },

  {
    id: "mini_toc_1",
    questionnaire: "miniToc",
    text: "Pensées intrusives difficiles à contrôler.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },
  {
    id: "mini_toc_2",
    questionnaire: "miniToc",
    text: "Vérifier plusieurs fois les mêmes choses.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },
  {
    id: "mini_toc_3",
    questionnaire: "miniToc",
    text: "Rituels de nettoyage/lavage répétitifs.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },
  {
    id: "mini_toc_4",
    questionnaire: "miniToc",
    text: "Besoin d'ordre/symétrie qui génère de la détresse.",
    choices: ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Extrêmement"],
  },
];

const totalByQuestionnaire: Record<QuestionnaireId, number> = {
  phq9: 9,
  gad7: 7,
  pcl5Short: 4,
  miniToc: 4,
};

type AnswersMap = Record<string, number>;

type BilanPayload = {
  phq9: number[];
  gad7: number[];
  pcl5Short: number[];
  miniToc: number[];
};

function buildPayload(answers: AnswersMap): BilanPayload {
  const grouped: BilanPayload = {
    phq9: [],
    gad7: [],
    pcl5Short: [],
    miniToc: [],
  };

  for (const question of questions) {
    const value = answers[question.id];
    if (typeof value !== "number") {
      throw new Error(`Réponse manquante pour ${question.id}`);
    }
    grouped[question.questionnaire].push(value);
  }

  for (const [questionnaire, expected] of Object.entries(totalByQuestionnaire)) {
    const current = grouped[questionnaire as QuestionnaireId].length;
    if (current !== expected) {
      throw new Error(`Longueur invalide pour ${questionnaire}: ${current}/${expected}`);
    }
  }

  return grouped;
}

export default function BilanGlobal() {
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [current, setCurrent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const currentQuestion = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const nextAnswers: AnswersMap = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(nextAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }

    try {
      const payload = buildPayload(nextAnswers);
      localStorage.removeItem("bilanApiResult");
      localStorage.setItem("bilanPayload", JSON.stringify(payload));
      window.location.assign("/profil-resultat");
    } catch (submissionError) {
      console.error("Erreur de création du payload bilan:", submissionError);
    }
  };

  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Avant de commencer le bilan</h1>
          <p className="text-gray-700">
            Ce questionnaire est un outil éducatif pour un projet académique IB. Il ne remplace pas
            une évaluation clinique.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 space-y-3">
          <p className="font-semibold">Méthodologie (conformité IB)</p>
          <p>
            <span className="font-medium">Cadre:</span> dépistage psychométrique éducatif (14-18 ans).
          </p>
          <p>
            <span className="font-medium">Méthode:</span> score par somme des items pour PHQ-9, GAD-7,
            PCL-5 court et Mini-TOC.
          </p>
          <div>
            <p className="font-medium mb-1">Limites scientifiques:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ce résultat est indicatif et non diagnostique.</li>
              <li>Les seuils peuvent varier selon l'âge, la langue et le contexte.</li>
              <li>Les versions courtes (PCL-5 court, Mini-TOC) servent au dépistage initial.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-900 space-y-1">
          <p className="font-semibold">Avertissements importants</p>
          <p>
            Si tu te sens en danger immédiat, contacte tout de suite les services d'urgence de ton
            pays.
          </p>
          <p>Parle aussi rapidement à un adulte de confiance ou à un professionnel de santé.</p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setHasStarted(true)}
            className="px-5 py-3 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Commencer le bilan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-4 h-2 bg-gray-200 rounded">
        <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-sm text-gray-500 mb-2">
        Question {current + 1} / {questions.length}
      </p>

      <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>

      <div className="grid gap-3">
        {currentQuestion.choices.map((label, value) => (
          <button
            key={label}
            onClick={() => handleAnswer(value)}
            className="p-3 border rounded hover:bg-blue-50"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
