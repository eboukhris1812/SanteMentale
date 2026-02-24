export default function HomePage() {
  return (
    <>
  <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue sur Santé Mentale Adolescents</h1>
        <p className="text-lg md:text-2xl mb-8 max-w-xl">
          Comprends mieux ton état psychologique et découvre des ressources fiables pour t’orienter.
        </p>
       <a href="/bilan-global" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition">
  	Commencer le bilan
	</a>
      </section>

      {/* Section d'information */}
      <section className="py-16 px-4 bg-white text-gray-800 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pourquoi la santé mentale est importante ?</h2>
        <p className="text-lg md:text-xl mb-4">
          La santé mentale est essentielle pour le bien-être des adolescents. Comprendre ses émotions, gérer le stress et reconnaître les signes précoces de troubles psychologiques permet de mieux se soutenir et d’agir à temps.
        </p>
        <p className="text-lg md:text-xl">
          Ce site fournit des informations fiables, des tests validés scientifiquement et des ressources pour aider les jeunes à mieux se connaître et à demander de l’aide si nécessaire.
        </p>
      </section>
	
	{/* Section Avertissement éthique */}
      <section className="py-12 px-4 bg-yellow-50 text-yellow-900 text-center max-w-4xl mx-auto rounded-lg border-l-4 border-yellow-500 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Avertissement</h2>
        <p className="text-lg md:text-xl">
          Ce site a un but éducatif et informatif uniquement. Il ne remplace en aucun cas un diagnostic médical.  
          Si tu ressens un mal-être, de l’anxiété ou des symptômes inquiétants, nous t’encourageons à consulter un professionnel de santé qualifié.
        </p>
      </section>

	{/* Section Commencer le bilan */}
	<section className="py-16 px-4 bg-blue-50 text-blue-900 text-center max-w-4xl mx-auto rounded-lg mt-8">
  	<h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à découvrir ton profil psychologique ?</h2>
  	<p className="text-lg md:text-xl mb-8">
    Clique sur le bouton ci-dessous pour commencer un bilan général et identifier tes tendances psychologiques.
  	</p>
  	<a href="/bilan-global" className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 
    active:scale-95 active:bg-blue-800
    transition transform duration-200 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-blue-300">Commencer le bilan</a>

	</section>




    </main>
</>
  );
}
