import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white dark:bg-[#2B2F33]">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6 sm:space-y-8">
              {/* Logo */}
              <div className="inline-flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-2xl shadow-xl">
                  <Image src="/logo-color.png" alt="Pulse Fitness" fill className="object-contain" />
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1D71B1] dark:text-[#2DC086] px-4">
                Pulse Fitness
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-[#2E485C] dark:text-[#E1E5E8] max-w-3xl mx-auto font-light px-4">
                Transforma tu cuerpo, eleva tu mente
              </p>
              
              <p className="text-base sm:text-lg text-[#2E485C]/80 dark:text-[#E1E5E8]/80 max-w-2xl mx-auto px-4">
                Tu plataforma integral de entrenamiento personalizado. Alcanza tus objetivos con planes diseñados para ti, seguimiento en tiempo real y una comunidad que te impulsa cada día.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-8 px-4">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#2D6086] hover:bg-[#1D71B1] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Comenzar Gratis
                </Link>
                
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-[#2B2F33] text-[#007CDB] dark:text-[#2DC086] font-semibold rounded-xl border-2 border-[#007CDB]/30 dark:border-[#2DC086]/30 hover:border-[#007CDB] dark:hover:border-[#2DC086] shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Ver Cómo Funciona
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 md:py-20 px-4 bg-white dark:bg-[#2E485C]/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2E485C] dark:text-white mb-3 sm:mb-4 px-4">
                Todo lo que necesitas
              </h2>
              <p className="text-base sm:text-lg text-[#2E485C]/80 dark:text-[#E1E5E8]/80 max-w-2xl mx-auto px-4">
                Herramientas profesionales para maximizar tus resultados
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white dark:bg-[#2E485C] p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-[#E1E5E8] dark:border-[#2E485C]">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🎯</div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2E485C] dark:text-white mb-3 sm:mb-4">
                  Entrenamientos Personalizados
                </h3>
                <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80 leading-relaxed">
                  Planes adaptados a tu nivel, objetivos y disponibilidad. Desde principiantes hasta atletas avanzados.
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#2E485C] p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-[#E1E5E8] dark:border-[#2E485C]">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">📊</div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2E485C] dark:text-white mb-3 sm:mb-4">
                  Seguimiento Inteligente
                </h3>
                <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80 leading-relaxed">
                  Monitorea tu progreso con estadísticas detalladas, gráficos y análisis de rendimiento en tiempo real.
                </p>
              </div>
              
              <div className="bg-white dark:bg-[#2E485C] p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-[#E1E5E8] dark:border-[#2E485C] sm:col-span-2 lg:col-span-1">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🤝</div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2E485C] dark:text-white mb-3 sm:mb-4">
                  Comunidad Motivadora
                </h3>
                <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80 leading-relaxed">
                  Conecta con personas que comparten tus metas. Comparte logros, retos y mantén la motivación alta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2E485C] dark:text-white mb-3 sm:mb-4 px-4">
                Cómo Funciona
              </h2>
              <p className="text-base sm:text-lg text-[#2E485C]/80 dark:text-[#E1E5E8]/80 max-w-2xl mx-auto px-4">
                Comienza tu transformación en 3 simples pasos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1D71B1] text-white text-xl sm:text-2xl font-bold rounded-full flex items-center justify-center mx-auto shadow-lg">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2E485C] dark:text-white px-4">
                  Crea tu Perfil
                </h3>
                <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80 px-4">
                  Regístrate y completa tu perfil. Cuéntanos sobre tus objetivos, nivel actual y preferencias de entrenamiento.
                </p>
              </div>

              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#2D6086] text-white text-xl sm:text-2xl font-bold rounded-full flex items-center justify-center mx-auto shadow-lg">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2E485C] dark:text-white px-4">
                  Recibe tu Plan
                </h3>
                <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80 px-4">
                  Nuestro sistema genera un plan personalizado basado en tus necesidades. Rutinas, nutrición y metas claras.
                </p>
              </div>

              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#007CDB] text-white text-xl sm:text-2xl font-bold rounded-full flex items-center justify-center mx-auto shadow-lg">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2E485C] dark:text-white px-4">
                  Entrena y Evoluciona
                </h3>
                <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80 px-4">
                  Sigue tus entrenamientos, registra tu progreso y observa cómo alcanzas tus objetivos día a día.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 sm:py-16 md:py-20 px-4 bg-white dark:bg-[#2E485C]/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-[#2E485C] dark:text-white px-4">
                Por Qué Pulse Fitness
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#2E485C]/80 dark:text-[#E1E5E8]/80 max-w-2xl mx-auto px-4">
                Más que una app de fitness, es tu compañero de transformación
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="flex gap-3 sm:gap-4 p-4 rounded-xl hover:bg-[#E1E5E8]/30 dark:hover:bg-[#2E485C]/30 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E1E5E8] dark:bg-[#2E485C] rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                    ⚡
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-[#2E485C] dark:text-white">Resultados Comprobados</h3>
                  <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80">
                    Miles de usuarios han alcanzado sus objetivos con nuestros planes personalizados.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 p-4 rounded-xl hover:bg-[#E1E5E8]/30 dark:hover:bg-[#2E485C]/30 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E1E5E8] dark:bg-[#2E485C] rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                    🔒
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-[#2E485C] dark:text-white">100% Seguro</h3>
                  <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80">
                    Tus datos están protegidos con encriptación de nivel bancario.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 p-4 rounded-xl hover:bg-[#E1E5E8]/30 dark:hover:bg-[#2E485C]/30 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E1E5E8] dark:bg-[#2E485C] rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                    📱
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-[#2E485C] dark:text-white">Acceso Multiplataforma</h3>
                  <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80">
                    Entrena desde cualquier dispositivo. Web, móvil, tablet. Siempre sincronizado.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 p-4 rounded-xl hover:bg-[#E1E5E8]/30 dark:hover:bg-[#2E485C]/30 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E1E5E8] dark:bg-[#2E485C] rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                    🎓
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-[#2E485C] dark:text-white">Soporte Profesional</h3>
                  <p className="text-sm sm:text-base text-[#2E485C]/80 dark:text-[#E1E5E8]/80">
                    Asesoría de entrenadores certificados y nutricionistas cuando lo necesites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white dark:bg-[#2E485C] rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 text-center border border-[#E1E5E8] dark:border-[#2E485C]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2E485C] dark:text-white mb-4 sm:mb-6 px-4">
                Comienza Tu Transformación Hoy
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#2E485C]/80 dark:text-[#E1E5E8]/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Únete a miles de personas que ya están alcanzando sus objetivos. Sin compromisos, sin pagos iniciales.
              </p>
              <Link
                href="/auth/register"
                className="inline-block w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-[#007CDB] hover:bg-[#1D71B1] text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Crear Cuenta Gratis
              </Link>
              <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#2E485C]/60 dark:text-[#E1E5E8]/60 px-4">
                No se requiere tarjeta de crédito • Cancela cuando quieras
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}
