"use client";

import { useState } from "react";
import { api } from "../../../../src/lib/api";
import { Star } from "lucide-react";
import clsx from "clsx";

export default function EditarForm({ id, miVoto }: any) {
  const [puntuacion, setPuntuacion] = useState(miVoto.puntuacion);
  const [form, setForm] = useState(
    miVoto.comentario ? JSON.parse(miVoto.comentario) : {}
  );
  const [success, setSuccess] = useState(false);

  const preguntas = [
    { id: "celeridad_proveer", texto: "Celeridad para proveer escritos", opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"] },
    { id: "celeridad_sentencia", texto: "Celeridad para dictar sentencia", opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"] },
    { id: "atencion_general", texto: "Atención general", opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"] },
    { id: "atiende_telefono", texto: "¿Atienden el teléfono?", opciones: ["Sí", "No"] },
    { id: "responde_mails", texto: "¿Responden mails?", opciones: ["Sí", "No"] },
    { id: "atencion_presencial", texto: "Atención presencial", opciones: ["Buena", "Regular", "Deficiente"] },
    { id: "cumple_honorarios", texto: "Cumplimiento de honorarios", opciones: ["Sí", "No", "Regula bajo"] },
    { id: "audiencias_profesional", texto: "Profesionalismo", opciones: ["Sí", "No"] },
    { id: "claridad_comunicacion", texto: "Claridad en la comunicación", opciones: ["Muy clara", "Clara", "Regular", "Confusa"] },
  ];

  const handleSelect = (key: any, value: any) => {
    setForm(prev=> ({ ...prev, [key]: value }));
  };

  const guardarCambios = async () => {
    await api.post("/votos", {
      dependencia_id: Number(id),
      puntuacion,
      comentario: JSON.stringify(form),
      ...form,
    });

    setSuccess(true);
  };

  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto text-gray-900">
     <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Editar evaluación
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-28 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* Estrellas */}
      <div className="flex justify-center mb-10 gap-2">
        {[1, 2, 3, 4, 5].map(n => (
          <Star
            key={n}
            onClick={() => setPuntuacion(n)}
            className={clsx(
              "w-10 h-10 cursor-pointer",
              n <= puntuacion ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>

      {/* Preguntas */}
      <div className="space-y-8">
        {preguntas.map(p => (
          <div key={p.id}>
            <p className="text-lg font-semibold mb-3">{p.texto}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {p.opciones.map(op => (
                <button
                  key={op}
                  type="button"
                  onClick={() => handleSelect(p.id, op)}
                  className={clsx(
                    "px-4 py-3 rounded-xl border text-sm",
                    form[p.id] === op ? "bg-blue-600 text-white" : "bg-white border-gray-300"
                  )}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={guardarCambios}
        className="mt-10 w-full py-4 bg-blue-600 text-white font-semibold rounded-xl shadow"
      >
        Guardar cambios
      </button>

      {success && (
        <p className="text-green-600 text-center mt-4">
          ✓ Cambios guardados con éxito
        </p>
      )}
    </main>
  );
}
