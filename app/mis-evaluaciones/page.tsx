"use client";

import { useEffect, useState } from "react";
import { api } from "../../src/lib/api";
import clsx from "clsx";
import AnchorWithLoader from "@/components/AnchorWithLoader";

export default function MisEvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<any>(null);

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
    } catch (err) {
      console.error("Error borrando evaluación", err);
    }
  };

  if (loading) {
    return (
      <main className="pt-20 text-center text-gray-700 animate-pulse">
        Cargando tus evaluaciones...
      </main>
    );
  }

  return (
    <main className="pt-10 pb-20 px-6 max-w-4xl mx-auto">

<div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Mis Evaluaciones
        </h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
      </div>

      {evaluaciones.length === 0 && (
        <p className="text-gray-600 text-center mt-10">
          Todavía no realizaste ninguna evaluación.
        </p>
      )}

      {/* LISTA DE EVALUACIONES */}
      <div className="space-y-6">
        {evaluaciones.map((v: any) => (
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

              <p className="text-sm text-gray-500 mt-1">
                {new Date(v.fecha_creacion).toLocaleDateString("es-AR")}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 w-full md:w-auto">
              <AnchorWithLoader
                href={`/votar/${v.dependencia_id}/editar`}
                className="
                  flex-1 md:flex-none px-4 py-2 rounded-xl border 
                  border-blue-600 text-blue-700 font-semibold text-center 
                  hover:bg-blue-50 transition
                "
              >
                Editar
              </AnchorWithLoader>

              <button
                onClick={() => setDeleteTarget(v)}
                className="
                  flex-1 md:flex-none px-4 py-2 rounded-xl border 
                  border-red-600 text-red-700 font-semibold text-center 
                  hover:bg-red-50 transition
                "
              >
                Borrar
              </button>

              {/* Solo Desktop */}
              <AnchorWithLoader
                href={`/dependencia/${v.dependencia_id}`}
                className="
                  hidden md:inline-flex px-4 py-2 rounded-xl border 
                  border-gray-400 text-gray-700 font-semibold 
                  hover:bg-gray-100 transition
                "
              >
                Ver
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
