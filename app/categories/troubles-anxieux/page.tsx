import Link from "next/link";

export default function TroublesAnxieuxPage() {
  const troubles = [
    {
      nom: "Trouble Anxieux Généralisé",
      slug: "trouble-anxieux-generalise",
      description:
        "Anxiété excessive et persistante concernant plusieurs domaines de la vie quotidienne.",
    },
    {
      nom: "Trouble Panique",
      slug: "trouble-panique",
      description:
        "Attaques de panique soudaines accompagnées de symptômes physiques intenses.",
    },
    {
      nom: "Agoraphobie",
      slug: "agoraphobie",
      description:
        "Peur intense des lieux ou situations dont il serait difficile de s’échapper.",
    },
    {
      nom: "Phobie Sociale",
      slug: "phobie-sociale",
      description:
        "Peur marquée d’être jugé ou observé dans des situations sociales.",
    },
    {
      nom: "Phobies Spécifiques",
      slug: "phobies-specifiques",
      description:
        "Peur intense et irrationnelle d’un objet ou d’une situation particulière.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      <h1 className="text-3xl font-bold mb-6">
        Les troubles anxieux
      </h1>

      <p className="mb-6 text-lg">
        L’anxiété est une réaction normale face au stress ou au danger.
        Cependant, lorsqu’elle devient intense, fréquente et difficile à contrôler,
        elle peut correspondre à un trouble anxieux.
      </p>

      <p className="mb-10 text-gray-600">
        ⚠️ Ce site ne pose pas de diagnostic médical. Les informations proposées
        sont éducatives et ne remplacent pas un professionnel de santé.
      </p>

      <h2 className="text-xl font-semibold mb-6">
        Troubles inclus dans cette catégorie :
      </h2>

      <div className="grid gap-6">
        {troubles.map((trouble) => (
          <Link
            key={trouble.slug}
            href={`/troubles/${trouble.slug}`}
            className="block border rounded-xl p-6 hover:shadow-lg hover:border-blue-400 transition duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">
              {trouble.nom}
            </h3>
            <p className="text-gray-600 text-sm">
              {trouble.description}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}