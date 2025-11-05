"use client";

import { useEffect, useState } from "react";
import { api } from "src/lib/api";
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
    return (
      <p className="text-center mt-20 text-gray-400">
        No hiciste evaluaciones aún.
      </p>
    );

  return (
    <main
      className="min-h-screen text-white flex flex-col items-center p-6"
      style={{ marginTop: "70px" }}
    >
      {/* Fondo con blur y transparencia */}
      <div
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "2rem",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        {/* Título centrado con estilo */}
        <h1
          className="text-3xl font-bold text-center mb-8 tracking-tight"
          style={{
            color: "white",
            textShadow: "0 2px 10px rgba(255,255,255,0.15)",
          }}
        >
          📝 Mis Evaluaciones
        </h1>

        <ul className="space-y-4">
          {evaluaciones.map((ev) => (
            <li
              key={ev.id}
              style={{
                background: "rgba(45, 45, 45, 0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1rem",
                padding: "1.25rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              className="hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{ev.juzgado}</p>
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
