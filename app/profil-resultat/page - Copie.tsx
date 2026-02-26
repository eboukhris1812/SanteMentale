"use client";

import React, { useEffect, useState } from "react";

type Scores = {
  [key: string]: number;
};

const seuilDominante = 1.5;

export default function Resultats() {
  const [scores, setScores] = useState<Scores | null>(null);

  // ✅ Hook 1
  useEffect(() => {
    const data = localStorage.getItem("bilanResults");
    if (data) {
      const parsed = JSON.parse(data);
      setScores(parsed.scores);
    }
  }, []);

  // ==============================
  // Calculs sécurisés
  // ==============================

  const pondérations: Scores = {
    humeur: 1.2,
    anxiété: 1.1,
    sommeil: 1.0,
    estime: 1.0,
    stress: 1.1,
    trauma: 1.3,
    burnout: 1.2,
    critique: 2.0,
  };

  const IGDP =
    scores
      ? Object.entries(scores).reduce((acc, [cat, score]) => {
          const poids = pondérations[cat] ?? 1;
          return acc + score * poids;
        }, 0) / Object.keys(scores).length
      : 0;

  let niveau = "";

  if (IGDP < 1) niveau = "Fonctionnement stable";
  else if (IGDP < 2.5) niveau = "Vulnérabilité légère";
  else if (IGDP < 4) niveau = "Vulnérabilité modérée";
  else niveau = "Vulnérabilité élevée";

  let dominante: string | null = null;

  if (scores) {
    const valeurs = Object.values(scores);
    const maxScore = Math.max(...valeurs);

    if (IGDP !== 0 && maxScore >= seuilDominante) {
      const categoriesMax = Object.entries(scores)
        .filter(([_, score]) => score === maxScore)
        .map(([cat]) => cat);

      dominante =
        categoriesMax.length === 1 ? categoriesMax[0] : "profil mixte";
    }
  }

  const messageClinique = () => {
    if (!scores) return "";
    if (IGDP === 0) return "Aucun indicateur détecté.";
    if (!dominante) return "Profil homogène.";
    if (dominante === "profil mixte")
      return "Plusieurs domaines présentent un niveau similaire.";
    return `Dominante liée à ${dominante}.`;
  };

  // ✅ Hook 2 (toujours appelé)
  useEffect(() => {
    if (!scores) return;

    const sauvegarderBilan = async () => {
      try {
        await fetch("/api/bilan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...scores,
            IGDP,
            niveau,
            dominante,
          }),
        });
      } catch (error) {
        console.error("Erreur sauvegarde bilan :", error);
      }
    };

    sauvegarderBilan();
  }, [scores]);

  // ✅ Return unique, après tous les hooks
  if (!scores) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          Bilan Synthétique
        </h2>
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">
        Bilan Synthétique
      </h2>

      <div className="mb-6">
        <p className="font-medium mb-2">
          Index Global de Détresse :
        </p>
        <p className="text-3xl font-bold">
          {IGDP.toFixed(1)}
        </p>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">
          Niveau clinique :
        </p>
        <p className="text-lg">{niveau}</p>
      </div>

      {dominante && (
        <div className="mb-6">
          <p className="font-medium mb-2">
            Profil dominant détecté :
          </p>
          <p className="text-lg capitalize">
            {dominante}
          </p>
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-xl">
        <p>{messageClinique()}</p>
      </div>
    </div>
  );
}