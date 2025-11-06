"use client";

import Link from "next/link";
import { Star } from "lucide-react";

const resultados = [
  { criterio: "Claridad en la comunicación", promedio: 4.5 },
  { criterio: "Tiempo de espera", promedio: 3.8 },
  { criterio: "Atención del personal", promedio: 4.0 },
];

export default function ResumenJuzgadoPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-black px-4 py-10"
      style={{ marginTop: "70px" }}
    >
      {/* Contenedor principal con blur */}
      <div
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Título */}
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            textShadow: "0 2px 10px rgba(255,255,255,0.15)",
          }}
        >
          Juzgado Nacional en lo Civil Nº {params.id}
        </h1>
        <p className="text-gray-600  mb-8 tracking-wide">PROMEDIO GENERAL</p>

        {/* Promedio principal */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="text-6xl font-bold text-rojo drop-shadow-md">4.2</div>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i <= 4 ? "fill-#1f5691-400 text-rojo-400" : "text-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Resultados por criterio */}
        <div className="flex flex-col gap-4">
          {resultados.map((r) => (
            <div
              key={r.criterio}
              style={{
                background: "rgba(45, 45, 45, 0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderLeft: "4px solid rgba(220,38,38,0.8)",
                borderRadius: "1rem",
                padding: "1rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              className="hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
            >
              <span className="font-medium">{r.criterio}</span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{r.promedio}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Volver */}
        <div className="mt-10">
          <Link
            href="/"
            className="text-rojo underline hover:text-rojo-700 transition text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
