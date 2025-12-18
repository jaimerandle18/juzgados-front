"use client";

import { motion } from "framer-motion";

function StarRating({ promedio = 0, cantidad = 0 }) {
  const filled = Math.round(Number(promedio) || 0);

  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-yellow-400 text-lg ${n <= filled ? "" : "opacity-30"}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm font-semibold text-gray-800 ml-1">
        {(Number(promedio) || 0).toFixed(1)}
      </span>
      <span className="text-xs text-gray-500 ml-1">({cantidad})</span>
    </div>
  );
}

export default function DependenciasGrid({
  items,
  titulo = "",
}: {
  items: any[];
  titulo?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{titulo}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((d: any, i: number) => (
          <motion.a
            key={d.id}
            href={`/dependencia/${d.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="block p-5 rounded-2xl bg-white/70 backdrop-blur-lg
            border border-gray-200 shadow-md hover:shadow-xl
            hover:-translate-y-1 transition-all group"
          >
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {d.nombre}
            </h3>

            <StarRating
              promedio={d.promedio}
              cantidad={d.cantidad_votos}
            />

            {d.domicilio && (
              <p className="mt-2 text-gray-700">{d.domicilio}</p>
            )}

            {d.localidad && (
              <p className="text-gray-700">{d.localidad}</p>
            )}

            <p className="mt-3 text-sm font-medium text-blue-600 group-hover:underline">
              Ver detalle →
            </p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
