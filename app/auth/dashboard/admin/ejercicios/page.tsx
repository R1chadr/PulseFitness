"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  grupo_muscular: string;
  dificultad: "principiante" | "intermedio" | "avanzado";
  imagen_url: string | null;
  video_url: string | null;
  instrucciones: string | null;
  created_at: string;
}

interface EjercicioFormData {
  nombre: string;
  descripcion: string;
  grupo_muscular: string;
  dificultad: "principiante" | "intermedio" | "avanzado";
  imagen_url: string;
  video_url: string;
  instrucciones: string;
}

export default function EjerciciosPage() {
  const router = useRouter();
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [grupoFilter, setGrupoFilter] = useState<string>("all");
  const [dificultadFilter, setDificultadFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"nombre" | "grupo_muscular" | "dificultad" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEjercicio, setSelectedEjercicio] = useState<Ejercicio | null>(null);
  const [formData, setFormData] = useState<EjercicioFormData>({
    nombre: "",
    descripcion: "",
    grupo_muscular: "Pecho",
    dificultad: "principiante",
    imagen_url: "",
    video_url: "",
    instrucciones: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ejercicioToDelete, setEjercicioToDelete] = useState<Ejercicio | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [ejercicioToView, setEjercicioToView] = useState<Ejercicio | null>(null);

  const gruposMusculares = ["Pecho", "Espalda", "Piernas", "Hombros", "Brazos", "Core"];

  useEffect(() => {
    verifyAdminAndLoadEjercicios();
  }, []);

  async function verifyAdminAndLoadEjercicios() {
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

      await loadEjercicios();
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar ejercicios");
      setLoading(false);
    }
  }

  async function loadEjercicios() {
    try {
      const response = await fetch("/api/admin/ejercicios");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al cargar ejercicios");
        setLoading(false);
        return;
      }

      setEjercicios(data.ejercicios);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar ejercicios");
      setLoading(false);
    }
  }

  function openCreateModal() {
    setModalMode('create');
    setFormData({
      nombre: "",
      descripcion: "",
      grupo_muscular: "Pecho",
      dificultad: "principiante",
      imagen_url: "",
      video_url: "",
      instrucciones: ""
    });
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(ejercicio: Ejercicio) {
    setModalMode('edit');
    setSelectedEjercicio(ejercicio);
    setFormData({
      nombre: ejercicio.nombre,
      descripcion: ejercicio.descripcion || "",
      grupo_muscular: ejercicio.grupo_muscular,
      dificultad: ejercicio.dificultad,
      imagen_url: ejercicio.imagen_url || "",
      video_url: ejercicio.video_url || "",
      instrucciones: ejercicio.instrucciones || ""
    });
    setFormError("");
    setShowModal(true);
  }

  function openDeleteModal(ejercicio: Ejercicio) {
    setEjercicioToDelete(ejercicio);
    setShowDeleteModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (modalMode === 'create') {
        const response = await fetch("/api/admin/ejercicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          setFormError(data.error || "Error al crear ejercicio");
          setFormLoading(false);
          return;
        }
      } else {
        const cleanData: any = {};
        Object.keys(formData).forEach(key => {
          const value = (formData as any)[key];
          if (value !== undefined && value !== null && value !== "") {
            cleanData[key] = value;
          }
        });
        
        const response = await fetch(`/api/admin/ejercicios/${selectedEjercicio?.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanData)
        });

        const data = await response.json();

        if (!response.ok) {
          setFormError(data.error || "Error al actualizar ejercicio");
          setFormLoading(false);
          return;
        }
      }

      setShowModal(false);
      setFormLoading(false);
      await loadEjercicios();
    } catch (err) {
      console.error("Error:", err);
      setFormError("Error al guardar ejercicio");
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    if (!ejercicioToDelete) return;

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/admin/ejercicios/${ejercicioToDelete.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setShowDeleteModal(false);
        await loadEjercicios();
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleSort(field: "nombre" | "grupo_muscular" | "dificultad" | "created_at") {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  const filteredEjercicios = ejercicios
    .filter(ejercicio => {
      if (grupoFilter !== "all" && ejercicio.grupo_muscular !== grupoFilter) return false;
      if (dificultadFilter !== "all" && ejercicio.dificultad !== dificultadFilter) return false;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          ejercicio.nombre.toLowerCase().includes(term) ||
          ejercicio.grupo_muscular.toLowerCase().includes(term) ||
          (ejercicio.descripcion && ejercicio.descripcion.toLowerCase().includes(term))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (typeof aValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Gestión de Ejercicios
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Administra los ejercicios de la plataforma
        </p>
      </div>

      <main>
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
          <div className="p-4 sm:p-6 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                  Biblioteca de Ejercicios
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Total: {ejercicios.length} | Filtrados: {filteredEjercicios.length}
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Crear Ejercicio</span>
                <span className="sm:hidden">Crear</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar ejercicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={grupoFilter}
                onChange={(e) => setGrupoFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Todos los grupos</option>
                {gruposMusculares.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </select>

              <select
                value={dificultadFilter}
                onChange={(e) => setDificultadFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Todas las dificultades</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => handleSort("nombre")}
                  >
                    <div className="flex items-center gap-1">
                      Nombre
                      {sortField === "nombre" && (
                        <svg className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => handleSort("grupo_muscular")}
                  >
                    <div className="flex items-center gap-1">
                      Grupo Muscular
                      {sortField === "grupo_muscular" && (
                        <svg className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => handleSort("dificultad")}
                  >
                    <div className="flex items-center gap-1">
                      Dificultad
                      {sortField === "dificultad" && (
                        <svg className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredEjercicios.map((ejercicio) => (
                  <tr key={ejercicio.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {ejercicio.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {ejercicio.descripcion || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                        {ejercicio.grupo_muscular}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ejercicio.dificultad === "principiante" 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : ejercicio.dificultad === "intermedio"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}>
                        {ejercicio.dificultad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEjercicioToView(ejercicio); setShowDetailsModal(true); }}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(ejercicio)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Editar ejercicio"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(ejercicio)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Eliminar ejercicio"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEjercicios.length === 0 && !error && (
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || grupoFilter !== "all" || dificultadFilter !== "all"
                  ? "No se encontraron ejercicios con los filtros aplicados" 
                  : "No hay ejercicios registrados"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-xl">
              <h3 className="text-2xl font-bold text-white">
                {modalMode === "create" ? "Crear Nuevo Ejercicio" : "Editar Ejercicio"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grupo Muscular *
                  </label>
                  <select
                    required
                    value={formData.grupo_muscular}
                    onChange={(e) => setFormData({ ...formData, grupo_muscular: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {gruposMusculares.map(grupo => (
                      <option key={grupo} value={grupo}>{grupo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dificultad *
                </label>
                <select
                  required
                  value={formData.dificultad}
                  onChange={(e) => setFormData({ ...formData, dificultad: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instrucciones
                </label>
                <textarea
                  rows={4}
                  value={formData.instrucciones}
                  onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="1. Paso uno&#10;2. Paso dos..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imagen_url}
                    onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL de Video
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Guardando..." : modalMode === "create" ? "Crear Ejercicio" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && ejercicioToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-t-xl">
              <h3 className="text-2xl font-bold text-white">Confirmar Eliminación</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                ¿Estás seguro de que deseas eliminar este ejercicio?
              </p>
              <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Nombre:</strong> {ejercicioToDelete.nombre}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <strong className="text-gray-900 dark:text-white">Grupo:</strong> {ejercicioToDelete.grupo_muscular}
                </p>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? "Eliminando..." : "Eliminar Ejercicio"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {showDetailsModal && ejercicioToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-xl">
              <h3 className="text-2xl font-bold text-white">Detalles del Ejercicio</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Nombre
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {ejercicioToView.nombre}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Grupo Muscular
                  </label>
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                    {ejercicioToView.grupo_muscular}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Dificultad
                  </label>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    ejercicioToView.dificultad === "principiante" 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : ejercicioToView.dificultad === "intermedio"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  }`}>
                    {ejercicioToView.dificultad}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {new Date(ejercicioToView.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Descripción
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {ejercicioToView.descripcion || "Sin descripción"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Instrucciones
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line">
                    {ejercicioToView.instrucciones || "Sin instrucciones"}
                  </p>
                </div>

                {ejercicioToView.imagen_url && (
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Imagen
                    </label>
                    <img 
                      src={ejercicioToView.imagen_url} 
                      alt={ejercicioToView.nombre}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text y="50" font-size="14" fill="gray">Sin imagen</text></svg>';
                      }}
                    />
                  </div>
                )}

                {ejercicioToView.video_url && (
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Video
                    </label>
                    <a 
                      href={ejercicioToView.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm break-all"
                    >
                      {ejercicioToView.video_url}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
