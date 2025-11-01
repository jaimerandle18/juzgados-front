"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { Star } from "lucide-react";

export default function MisEvaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      const res = await api.get("/usuarios/evaluaciones");
      setEvaluaciones(res.data);
    };
    fetchEvaluaciones();
  }, []);

  if (!evaluaciones.length)
    return <p className="text-center mt-20 text-gray-400">No hiciste evaluaciones aún.</p>;

  return (
    <main className="min-h-screen bg-fondo text-white p-6">
      <div className="max-w-3xl mx-auto bg-grisOscuro p-6 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-rojo">📝 Mis Evaluaciones</h1>

        <ul className="space-y-4">
          {evaluaciones.map((ev) => (
            <li key={ev.id} className="bg-[#222] p-4 rounded-xl border border-gray-700 flex justify-between items-center">
              <div>
                <p className="font-semibold">{ev.juzgado}</p>
                <p className="text-sm text-gray-400">{ev.ciudad}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(ev.fecha).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < ev.puntuacion
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
