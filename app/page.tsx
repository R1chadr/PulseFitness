import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl shadow-lg">
            <span className="text-4xl" role="img" aria-label="Fitness">
              💪
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 dark:from-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent mb-6">
            Pulse Fitness
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
            Transforma tu cuerpo, eleva tu mente
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Alcanza tus objetivos con entrenamientos personalizados, seguimiento de progreso y una comunidad que te impulsa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500"
              aria-label="Crear cuenta nueva"
            >
              Comenzar gratis
            </Link>
            
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl border-2 border-indigo-200 dark:border-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500"
              aria-label="Iniciar sesión en tu cuenta"
            >
              Iniciar sesión
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4" role="img" aria-label="Entrenamiento">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Entrenamientos Personalizados
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Rutinas adaptadas a tus objetivos y nivel de fitness
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4" role="img" aria-label="Progreso">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Seguimiento Inteligente
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitorea tu progreso con estadísticas detalladas
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4" role="img" aria-label="Comunidad">
                🤝
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Comunidad Motivadora
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Conecta con personas que comparten tus metas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
