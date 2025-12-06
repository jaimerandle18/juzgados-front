"use client";

import Link from "next/link";
import VotarForm from "./VotarForm";

export default function VotarWrapper({ id, miVoto, dependenciaNombre }: any) {
  // Si el usuario YA votó
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

          {/* ELIMINAR */}
          <Link
            href={`/votar/${id}/eliminar`}
            className="
              px-6 py-3 rounded-xl font-semibold border-2 border-red-600 
              text-black hover:bg-red-50 transition
            "
          >
            🗑️ Eliminar evaluación
          </Link>

          {/* VOLVER */}
          <Link
            href={`/dependencia/${id}`}
            className="mt-4 text-blue-600 underline"
          >
            ← Volver al detalle
          </Link>
        </div>
      </main>
    );
  }

  // Si NO votó → mostramos formulario original
  return <VotarForm id={id} dependenciaNombre={dependenciaNombre} />;
}
