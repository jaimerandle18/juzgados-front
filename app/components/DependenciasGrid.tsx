"use client";

import { motion } from "framer-motion";
import StarRating from "./StarRating";
import AnchorWithLoader from "./AnchorWithLoader";

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
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <AnchorWithLoader
              href={`/dependencia/${d.id}`}
              className="block p-5 rounded-2xl bg-white/70 backdrop-blur-lg
              border border-gray-200 shadow-md hover:shadow-xl
              hover:-translate-y-1 transition-all group"
            >
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {d.nombre}
              </h3>

              <div className="mt-2">
                <StarRating
                  value={d.promedio}
                  cantidad={d.cantidad_votos}
                  tintedByValue
                />
              </div>

              {d.domicilio && (
                <p className="mt-2 text-gray-700">{d.domicilio}</p>
              )}

              {d.localidad && (
                <p className="text-gray-700">{d.localidad}</p>
              )}

              <p className="mt-3 text-sm font-medium text-blue-600 group-hover:underline">
                Ver detalle →
              </p>
            </AnchorWithLoader>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
