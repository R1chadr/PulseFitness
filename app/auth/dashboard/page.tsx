import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import UserMenu from "./LogoutButton";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 relative flex-shrink-0">  
              <Image src="/logo-color.png" alt="Pulse Fitness" fill className="object-contain" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Pulse Fitness
            </h1>
          </div>
          <UserMenu userEmail={user.email || ""} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white mb-6 sm:mb-8 shadow-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            ¡Bienvenido de vuelta! 👋
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg">
            {user.email}
          </p>
          <p className="text-indigo-100 mt-3 sm:mt-4 text-sm sm:text-base">
            Estás listo para continuar tu viaje fitness
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold">
                Entrenamientos
              </h3>
              <span className="text-2xl sm:text-3xl" role="img" aria-label="Entrenamientos">
                🏋️
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              0
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Completa tu primer entrenamiento
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold">
                Racha
              </h3>
              <span className="text-2xl sm:text-3xl" role="img" aria-label="Racha">
                🔥
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              0 días
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ¡Comienza tu racha hoy!
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold">
                Calorías
              </h3>
              <span className="text-2xl sm:text-3xl" role="img" aria-label="Calorías">
                ⚡
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              0
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Esta semana
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Acciones rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg sm:rounded-xl transition-colors text-left group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                🎯
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Nuevo entrenamiento
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Comienza una sesión
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg sm:rounded-xl transition-colors text-left group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                📊
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Ver progreso
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Revisa tus estadísticas
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg sm:rounded-xl transition-colors text-left group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-600 rounded-lg flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                📅
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Planificar semana
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Organiza tus entrenamientos
                </p>
              </div>
            </button>

            <button className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg sm:rounded-xl transition-colors text-left group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                🤝
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Comunidad
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Conecta con otros
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
