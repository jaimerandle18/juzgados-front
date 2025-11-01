import Link from "next/link";
import { Star } from "lucide-react";

const resultados = [
  { criterio: "Claridad en la comunicación", promedio: 4.5 },
  { criterio: "Tiempo de espera", promedio: 3.8 },
  { criterio: "Atención del personal", promedio: 4.0 },
];

export default function ResumenJuzgadoPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-fondo text-white px-4 py-10">
      <h1 className="text-center text-2xl font-bold mb-2">
        Juzgado Nacional en lo Civil Nº {params.id}
      </h1>
      <p className="text-center text-grisClaro mb-8 tracking-wide">
        PROMEDIO GENERAL
      </p>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="text-6xl font-bold text-rojo">4.2</div>
        <div className="flex mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-8 h-8 ${
                i <= 4 ? "fill-red-600 text-red-600" : "text-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto flex flex-col gap-4">
        {resultados.map((r) => (
          <div
            key={r.criterio}
            className="bg-grisOscuro border-l-4 border-rojo rounded-2xl p-4 flex justify-between items-center"
          >
            <span>{r.criterio}</span>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>{r.promedio}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="text-rojo underline hover:text-red-700 transition text-sm"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
