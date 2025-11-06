"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  puntuacionInicial?: number;
  onChangePuntuacion: (valor: number) => void;
};

export default function VotarJuzgado({
  puntuacionInicial = 0,
  onChangePuntuacion,
}: Props) {
  const [puntuacion, setPuntuacion] = useState(puntuacionInicial);

  const handleClick = (valor: number) => {
    setPuntuacion(valor);
    onChangePuntuacion(valor);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-lg font-semibold text-black">
        ¿Cómo calificarías este juzgado?
      </h3>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((valor) => (
          <button
            key={valor}
            type="button"
            onClick={() => handleClick(valor)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                valor <= puntuacion
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-500 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
