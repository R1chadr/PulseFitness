"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExercises: 0,
    totalRoutines: 0
  });

  useEffect(() => {
    verifyAdminAndLoadStats();
  }, []);

  async function verifyAdminAndLoadStats() {
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("auth_id", user.id)
        .single();

      if (!userData || userData.role !== "admin") {
        router.push("/auth/dashboard");
        return;
      }

      await loadStats();
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const [usersRes, ejerciciosRes, rutinasRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/ejercicios"),
        fetch("/api/admin/rutinas")
      ]);

      const [usersData, ejerciciosData, rutinasData] = await Promise.all([
        usersRes.json(),
        ejerciciosRes.json(),
        rutinasRes.json()
      ]);

      setStats({
        totalUsers: usersData.users?.length || 0,
        totalExercises: ejerciciosData.ejercicios?.length || 0,
        totalRoutines: rutinasData.rutinas?.length || 0
      });

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Gestiona usuarios, ejercicios y rutinas desde aquí
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card Usuarios */}
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-slate-700">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Usuarios</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</h3>
              </div>
              <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 text-sm mb-4">
              Gestiona todos los usuarios registrados en la plataforma
            </p>
            <Link
              href="/auth/dashboard/admin/usuarios"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Ver Más
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Card Ejercicios */}
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-slate-700">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Ejercicios</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.totalExercises}</h3>
              </div>
              <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 text-sm mb-4">
              Administra la biblioteca de ejercicios disponibles
            </p>
            <Link
              href="/auth/dashboard/admin/ejercicios"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Ver Más
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Card Rutinas */}
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-slate-700">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Rutinas</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{stats.totalRoutines}</h3>
                </div>
                <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          <div className="p-6">
            <p className="text-gray-400 text-sm mb-4">
              Crea y edita rutinas de entrenamiento personalizadas
            </p>
            <Link
              href="/auth/dashboard/admin/rutinas"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Ver Más
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
