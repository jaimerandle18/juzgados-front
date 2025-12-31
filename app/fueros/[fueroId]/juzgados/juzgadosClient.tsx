"use client";

import { useNavigate } from "@/components/useNavigate";

export default function JuzgadosClient({
  juzgados,
}: {
  juzgados: any[];
}) {
  const navigate = useNavigate();

  return (
    <main className="pt-10 pb-20 px-6 max-w-4xl mx-auto text-gray-900">
      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Juzgados
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2">
        {juzgados.map((j: any) => (
          <button
            key={j.id}
            type="button"
            onClick={() => navigate(`/dependencia/${j.id}`)}
            className="
              block text-left p-6 rounded-2xl bg-white/70 backdrop-blur-lg
              border border-gray-200 shadow-md hover:shadow-xl
              hover:-translate-y-1 transition-all group
            "
          >
            <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {j.nombre}
            </h3>

            <StarRating
              promedio={j.promedio}
              cantidad={j.cantidad_votos}
            />

            {j.domicilio && (
              <p className="mt-3 text-gray-700">{j.domicilio}</p>
            )}

            {j.localidad && (
              <p className="text-gray-700">{j.localidad}</p>
            )}

            <p className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
              Ver detalle →
            </p>
          </button>
        ))}
      </div>
    </main>
  );
}

/* ===============================
   STAR RATING (CLIENT)
   =============================== */
function StarRating({ promedio = 0, cantidad = 0 }) {
  const safePromedio = Number(promedio) || 0;
  const filled = Math.round(safePromedio);

  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-lg ${
            n <= filled ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}

      <span className="text-sm font-semibold text-gray-800 ml-1">
        {safePromedio.toFixed(1)}
      </span>

      <span className="text-xs text-gray-500 ml-1">
        ({cantidad})
      </span>
    </div>
  );
}
