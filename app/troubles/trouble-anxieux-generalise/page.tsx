import Link from "next/link";

export default function TAGPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-6">
        Trouble Anxieux Généralisé (TAG)
      </h1>

      <p className="mb-6 text-lg text-gray-700">
        Le Trouble Anxieux Généralisé est caractérisé par une inquiétude excessive,
        persistante et difficile à contrôler concernant plusieurs aspects de la vie quotidienne
        (travail, santé, famille, finances…).
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Symptômes fréquents
        </h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Inquiétude excessive et constante</li>
          <li>Difficulté à contrôler les pensées anxieuses</li>
          <li>Tension musculaire</li>
          <li>Fatigue</li>
          <li>Irritabilité</li>
          <li>Troubles du sommeil</li>
          <li>Difficultés de concentration</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Causes possibles
        </h2>
        <p className="text-gray-700">
          Le TAG résulte souvent d’une combinaison de facteurs biologiques,
          psychologiques et environnementaux. Le stress chronique,
          les événements de vie difficiles ou une vulnérabilité génétique
          peuvent contribuer à son développement.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Traitements
        </h2>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          <li>Thérapies cognitivo-comportementales (TCC)</li>
          <li>Approches basées sur la pleine conscience</li>
          <li>Traitements médicamenteux prescrits par un médecin</li>
          <li>Gestion du stress et hygiène de vie</li>
        </ul>
      </section>

      <div className="mt-12 p-6 bg-blue-50 rounded-xl border">
        <h3 className="text-lg font-semibold mb-3">
          Évaluer votre niveau d’anxiété
        </h3>
        <p className="mb-4 text-gray-700">
          Vous pouvez réaliser un auto-questionnaire basé sur le GAD-7
          pour estimer votre niveau d’anxiété.
        </p>

        <Link
          href="/tests/gad-7"
          className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Faire le test GAD-7
        </Link>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        ⚠️ Les informations présentées ici sont éducatives et ne remplacent
        pas un avis médical professionnel.
      </p>

    </div>
  );
}