"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { api } from "../../src/lib/api";
import AnchorWithLoader from "@/components/AnchorWithLoader";
import { SkeletonMiEvaluacion } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { relativeTime, fullDate } from "@/utils/time";

// Normaliza texto para búsqueda case/accent-insensitive
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // saca acentos
}

export default function MisEvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const { toastSuccess, toastError } = useToast();

  const evaluacionesFiltradas = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return evaluaciones;
    return evaluaciones.filter((v) => {
      const nombre = norm(v.dependencia?.nombre || "");
      return nombre.includes(q);
    });
  }, [evaluaciones, query]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get("/votos/mios");
        setEvaluaciones(res.data || []);
      } catch (e) {
        console.error("Error cargando mis evaluaciones", e);
      }
      setLoading(false);
    };

    cargar();
  }, []);

  const borrarEvaluacion = async (id: string) => {
    try {
      await api.delete(`/votos/${id}`);
      setDeleteTarget(null);
      setEvaluaciones((prev) => prev.filter((v) => v.id !== id));
      toastSuccess("Evaluación eliminada");
    } catch (err) {
      console.error("Error borrando evaluación", err);
      toastError("No se pudo eliminar la evaluación");
    }
  };

  return (
    <main className="pt-10 pb-20 px-6 max-w-4xl mx-auto">

<div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Mis Evaluaciones
        </h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonMiEvaluacion key={i} />
          ))}
        </div>
      )}

      {/* BUSCADOR (solo si hay >=2 evaluaciones, abajo no aporta nada) */}
      {!loading && evaluaciones.length >= 2 && (
        <div className="relative w-full mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar entre tus evaluaciones..."
            className="
              w-full pl-12 pr-12 py-3.5
              rounded-2xl
              bg-white/70 backdrop-blur-lg
              border border-gray-200
              shadow-md
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all
            "
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                p-1.5 rounded-full text-gray-400
                hover:text-gray-700 hover:bg-gray-100 transition
              "
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {!loading && evaluaciones.length === 0 && (
        <p className="text-gray-600 text-center mt-10">
          Todavía no realizaste ninguna evaluación.
        </p>
      )}

      {!loading && evaluaciones.length > 0 && evaluacionesFiltradas.length === 0 && (
        <p className="text-gray-600 text-center mt-10">
          No hay evaluaciones que coincidan con &quot;{query}&quot;.
        </p>
      )}

      {/* LISTA DE EVALUACIONES */}
      <div className="space-y-6">
        {evaluacionesFiltradas.map((v: any) => (
          <div
            key={v.id}
            className="
              p-5 rounded-2xl bg-white/80 backdrop-blur-lg 
              border border-gray-200 shadow-md 
              flex flex-col md:flex-row justify-between 
              items-start md:items-center gap-4
            "
          >
            {/* Info Dependencia */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {v.dependencia?.nombre}
              </h3>

              <p className="text-gray-700 mt-1">
                Puntuación:{" "}
                <span className="font-semibold text-yellow-500">
                  {v.puntuacion} ⭐
                </span>
              </p>

              <p
                className="text-sm text-gray-500 mt-1 capitalize"
                title={fullDate(v.fecha_creacion)}
              >
                {relativeTime(v.fecha_creacion)}
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <AnchorWithLoader
                href={`/votar/${v.dependencia_id}/editar`}
                className="
                  flex-1 min-w-[80px] px-3 py-2 rounded-xl border
                  border-blue-600 text-blue-700 font-semibold text-center text-sm
                  hover:bg-blue-50 transition
                "
              >
                Editar
              </AnchorWithLoader>

              <button
                onClick={() => setDeleteTarget(v)}
                className="
                  flex-1 min-w-[80px] px-3 py-2 rounded-xl border
                  border-red-600 text-red-700 font-semibold text-center text-sm
                  hover:bg-red-50 transition
                "
              >
                Borrar
              </button>

              <AnchorWithLoader
                href={`/dependencia/${v.dependencia_id}/evaluaciones`}
                className="
                  w-full md:w-auto px-3 py-2 rounded-xl border
                  border-gray-400 text-gray-700 font-semibold text-center text-sm
                  hover:bg-gray-100 transition
                "
              >
                Ver evaluaciones
              </AnchorWithLoader>
            </div>
          </div>
        ))}
      </div>

      {/* ====================== */}
      {/* MODAL DE CONFIRMACIÓN */}
      {/* ====================== */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ¿Eliminar evaluación?
            </h2>

            <p className="text-gray-700 text-center mb-6">
              ¿Seguro que querés borrar tu evaluación sobre <br />
              <span className="font-semibold text-blue-600">
                {deleteTarget.dependencia?.nombre}
              </span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border rounded-xl font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={() => borrarEvaluacion(deleteTarget.id)}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow"
              >
                Borrar
              </button>
            </div>
          </div>

          {/* Animación */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.25s ease-out;
            }
          `}</style>
        </div>
      )}
    </main>
  );
}
