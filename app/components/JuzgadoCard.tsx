"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

type Props = {
    id: number;
    nombre: string;
    ciudad?: string; // <- opcional
    promedio?: number;
    telefono: string;
    email: string
  };
  
export default function JuzgadoCard({ id, nombre, ciudad, promedio = 0 , telefono, email}: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/juzgado/${id}`);
  };

  return (
    <article
      className="
        relative
        bg-[var(--color-card)]
        rounded-3xl
        shadow-[0_12px_35px_rgba(0,0,0,0.25)]
        overflow-hidden
        pt-5
        pb-6
        px-6
        flex
        flex-col
        gap-3
        min-h-[160px]
      "
    >
      <span
        className="
          absolute
          left-0
          top-4
          bottom-4
          w-1.5
          bg-[var(--color-rojo)]
          rounded-full
        "
      />

      <div className="pl-3">
        <h2 className="text-lg font-semibold tracking-tight">{nombre}</h2>
        <p className="text-sm text-[var(--color-muted)]">{ciudad || "Sin ciudad"}</p>
        <p className="text-sm text-[var(--color-muted)]">Telefono: {telefono || "Sin ciudad"}</p>
        <p className="text-sm text-[var(--color-muted)]">Email: {email || "Sin ciudad"}</p>
      </div>

      <div className="flex items-center gap-2 pl-3">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="font-semibold text-base">{promedio.toFixed(1)}</span>
      </div>

      <div className="flex gap-3 mt-2">
  <button
    onClick={() => router.push(`/juzgado/${id}`)}
    className="w-1/2 bg-rojo hover:bg-red-800 text-white font-semibold py-2.5 rounded-2xl transition"
  >
    Evaluar
  </button>
  <button
    onClick={() => router.push(`/juzgado/${id}/promedios`)}
    className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-2xl transition"
  >
    Ver Evaluaciones
  </button>
</div>

    </article>
  );
}
