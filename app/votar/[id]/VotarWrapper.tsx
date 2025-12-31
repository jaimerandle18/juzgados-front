"use client";

import Link from "next/link";
import VotarForm from "./VotarForm";
import { api } from "src/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VotarWrapper({ id, miVoto, dependenciaNombre }: any) {
  const router = useRouter();

  // Estado para el modal
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const borrarEvaluacion = async (id: string) => {
    try {
      await api.delete(`/votos/${id}`);
      setDeleteTarget(null);
      router.push("/mis-evaluaciones");
    } catch (err) {
      console.error("Error borrando evaluación", err);
    }
  };

  // Si ya votó
  if (miVoto) {
    return (
      <main className="pt-20 text-center px-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-grey-600">
          Ya votaste {dependenciaNombre}
        </h1>

        <p className="text-gray-700 mt-4 mb-8">
          Podés modificar o eliminar tu evaluación.
        </p>

        <div className="flex flex-col gap-4">

          {/* MODIFICAR */}
          <Link
            href={`/votar/${id}/editar`}
            className="
              px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 
              text-black hover:bg-blue-50 transition
            "
          >
            ✏️ Modificar evaluación
          </Link>

          {/* ELIMINAR → abre el modal */}
          <button
            onClick={() => setDeleteTarget(miVoto)}
            className="
              px-6 py-3 rounded-xl font-semibold border-2 border-red-600 
              text-black hover:bg-red-50 transition
            "
          >
            🗑️ Eliminar evaluación
          </button>

          {/* VOLVER */}
          <Link
            href={`/dependencia/${id}`}
            className="mt-4 text-blue-600 underline"
          >
            ← Volver al detalle
          </Link>
        </div>

        {/* ------------------------ */}
        {/* MODAL DE CONFIRMACIÓN   */}
        {/* ------------------------ */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                ¿Eliminar evaluación?
              </h2>

              <p className="text-gray-700 text-center mb-6">
                ¿Seguro que querés eliminar tu evaluación de <br />
                <span className="font-semibold text-blue-600">
                  {dependenciaNombre}
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

  // Si NO votó → mostramos formulario
  return <VotarForm id={id} dependenciaNombre={dependenciaNombre} />;
}
