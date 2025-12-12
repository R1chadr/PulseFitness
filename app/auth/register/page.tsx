"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, last_name: lastName, age, weight, correo, password, conf_password: confPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data?.error || 'Error en el registro');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 1400);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? 'Error en el registro');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
            <Image src="/logo-color.png" alt="Pulse Fitness" fill className="object-contain" />
          </div>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Comienza tu transformación
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Crea tu cuenta gratuita y empieza hoy
            </p>
          </div>

          {success ? (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3 sm:mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Cuenta creada!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Redirigiendo al inicio de sesión...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                  <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading} />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Apellido</label>
                  <input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Edad</label>
                  <input id="age" type="number" min={1}  value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white" disabled={loading} />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Peso (kg)</label>
                  <input id="weight" type="number" min={1}  value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white" disabled={loading} />
                </div>
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Correo electrónico</label>
                <input id="correo" type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tu@email.com" disabled={loading} />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
                <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" disabled={loading} />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label htmlFor="confPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirmar contraseña</label>
                <input id="confPassword" type="password" required minLength={6} value={confPassword} onChange={(e) => setConfPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" disabled={loading} />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-500 disabled:cursor-not-allowed disabled:transform-none"
                aria-label={loading ? "Creando cuenta..." : "Crear cuenta"}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creando cuenta...
                  </span>
                ) : (
                  "Crear cuenta gratis"
                )}
              </button>
            </form>
          )}

          {/* Login link */}
          {!success && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
