"use client";

import { useState } from "react";
import { api } from "../../../src/lib/api";
import { Star } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { navigateWithLoader } from "@/components/NavigateWithLoader";

export default function VotarForm({
  id,
  dependenciaNombre,
}: {
  id: string;
  dependenciaNombre: string;
}) {
  const [puntuacion, setPuntuacion] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const preguntas = [
    {
      id: "celeridad_proveer",
      texto: "Celeridad para proveer escritos",
      opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"],
    },
    {
      id: "celeridad_sentencia",
      texto: "Celeridad para dictar sentencia",
      opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"],
    },
    {
      id: "atencion_general",
      texto: "Atención general del organismo",
      opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"],
    },
    {
      id: "atiende_telefono",
      texto: "¿Atienden el teléfono?",
      opciones: ["Sí", "No"],
    },
    {
      id: "responde_mails",
      texto: "¿Responden mails?",
      opciones: ["Sí", "No"],
    },
    {
      id: "atencion_presencial",
      texto: "Atención presencial",
      opciones: ["Buena", "Regular", "Deficiente"],
    },
    {
      id: "cumple_honorarios",
      texto: "Cumplimiento de la ley de honorarios",
      opciones: ["Sí", "No", "Regula bajo"],
    },
    {
      id: "audiencias_profesional",
      texto: "Profesionalismo en audiencias",
      opciones: ["Sí", "No"],
    },
    {
      id: "claridad_comunicacion",
      texto: "Claridad en la comunicación",
      opciones: ["Muy clara", "Clara", "Regular", "Confusa"],
    },
  ];

  const handleSelect = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const enviar = async () => {
    if (!puntuacion) {
      alert("Seleccioná una puntuación con estrellas.");
      return;
    }

    await api.post("/votos", {
      dependencia_id: Number(id),
      puntuacion,
      comentario: JSON.stringify(form),
      ...form,
    });

    setSuccess(true);

    // Mostrar toast y redirigir después de 2s
    setTimeout(() => {
     navigateWithLoader(router,"/mis-evaluaciones");
    }, 2000);
  };

  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto text-gray-900">
      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Evaluar {dependenciaNombre}
        </h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
      </div>

      {/* ESTRELLAS */}
      <div className="flex justify-center mb-10 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            onClick={() => setPuntuacion(n)}
            className={clsx(
              "w-10 h-10 cursor-pointer transition",
              n <= puntuacion
                ? "text-yellow-400 fill-yellow-400 drop-shadow"
                : "text-gray-300"
            )}
          />
        ))}
      </div>

      {/* FORM PREGUNTAS */}
      <div className="space-y-8">
        {preguntas.map((p) => (
          <div key={p.id}>
            <p className="text-lg font-semibold mb-3">{p.texto}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {p.opciones.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => handleSelect(p.id, op)}
                  className={clsx(
                    "px-4 py-3 rounded-xl border text-sm transition-all",
                    form[p.id] === op
                      ? "bg-blue-600 text-white border-blue-700 shadow"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                  )}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ENVIAR */}
      <button
        type="button"
        onClick={enviar}
        className="
          mt-14 w-full py-4 rounded-2xl text-white font-semibold
          bg-blue-600 hover:bg-blue-700 
          shadow-lg hover:-translate-y-0.5 transition-all
        "
      >
        Enviar evaluación
      </button>

      {/* TOAST */}
      {success && (
        <div
          className="
            fixed top-6 right-6 z-50 px-5 py-4 rounded-2xl
            bg-green-100/80 backdrop-blur-md border border-green-300
            shadow-lg animate-slideIn flex items-center gap-2 text-green-800
          "
        >
          <span className="text-xl">✓</span>
          <p className="font-semibold">¡Evaluación enviada con éxito!</p>
        </div>
      )}
    </main>
  );
}
