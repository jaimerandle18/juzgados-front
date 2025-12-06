import { cookies } from "next/headers";

/* ===========================================================
   📄 PAGE — Evaluaciones por Dependencia
=========================================================== */
export default async function Page({ params }: any) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/votos/${id}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token ?? ""}` },
    }
  );

  if (!res.ok) {
    console.error("Backend error:", await res.text());
    throw new Error("Falló la API");
  }

  const data = await res.json();
  const { dependencia, promedioPuntuacion, totalVotos, votos } = data;

  const nombreDependencia = dependencia?.nombre ?? "esta dependencia";

  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto text-gray-900">

      {/* TÍTULO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Evaluaciones sobre {nombreDependencia}
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-52 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* SUMARIO GENERAL */}
      <div className="
        bg-white/70 backdrop-blur-lg 
        border border-gray-200 shadow-xl 
        rounded-2xl p-6 mb-12
      ">
        <p className="text-lg font-semibold text-gray-800">
          Total de evaluaciones:{" "}
          <span className="text-blue-600 font-bold">{totalVotos}</span>
        </p>

        {/* PROMEDIO ESTRELLAS */}
        <div className="mt-4">
          <StarRating value={promedioPuntuacion} />
        </div>

        {/* REVIEW BARS */}
        {totalVotos > 0 && (
          <div className="mt-6">
            <ReviewBars votos={votos} />
          </div>
        )}
      </div>

      {/* ANÁLISIS DETALLADO */}
      <div className="space-y-8">
        {renderAnalisis(votos)}
      </div>
    </main>
  );
}

/* ===========================================================
   ⭐ COMPONENTE — Promedio de Estrellas
=========================================================== */
function StarRating({ value }: { value: number }) {
  const rounded = Math.round(value);

  return (
    <div className="flex items-center gap-1 justify-center sm:justify-start">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? "text-yellow-400" : "text-gray-300"} style={{ fontSize: "28px" }}>
          ★
        </span>
      ))}

      <span className="ml-2 text-gray-700 font-semibold text-lg">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

/* ===========================================================
   ⭐ COMPONENTE — Review Bars estilo Google Reviews
=========================================================== */
function ReviewBars({ votos }: any) {
  const cantidades = [1, 2, 3, 4, 5].reduce((acc: any, estrella) => {
    acc[estrella] = votos.filter((v: any) => v.puntuacion === estrella).length;
    return acc;
  }, {});

  const maxCount = Math.max(...(Object.values(cantidades) as number[]), 1);

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((estrella) => (
        <div key={estrella} className="flex items-center gap-3">
          {/* Etiqueta izquierda */}
          <span className="w-10 text-sm font-semibold text-gray-800">
            {estrella} ★
          </span>

          {/* Barra */}
          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-3 bg-blue-500 rounded-full transition-all"
              style={{ width: `${(cantidades[estrella] / maxCount) * 100}%` }}
            />
          </div>

          {/* Cantidad */}
          <span className="text-sm font-semibold text-gray-700">
            {cantidades[estrella]}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ===========================================================
   📝 ANÁLISIS DETALLADO DE CADA PREGUNTA
=========================================================== */
function renderAnalisis(votos: any[]) {
  if (!votos || votos.length === 0) {
    return (
      <p className="text-center text-gray-600 text-lg">
        Aún no hay evaluaciones para esta dependencia.
      </p>
    );
  }

  const respuestas = votos.map((v) => JSON.parse(v.comentario));

  const preguntas = [
    { id: "celeridad_proveer", texto: "Celeridad para proveer escritos" },
    { id: "celeridad_sentencia", texto: "Celeridad para dictar sentencia" },
    { id: "atencion_general", texto: "Atención general del organismo" },
    { id: "atiende_telefono", texto: "¿Atienden el teléfono?" },
    { id: "responde_mails", texto: "¿Responden mails?" },
    { id: "atencion_presencial", texto: "Atención presencial" },
    { id: "cumple_honorarios", texto: "Cumplimiento de la ley de honorarios" },
    { id: "audiencias_profesional", texto: "Profesionalismo en audiencias" },
    { id: "claridad_comunicacion", texto: "Claridad en la comunicación" },
  ];

  return preguntas.map((p) => {
    const conteo: Record<string, number> = {};

    respuestas.forEach((r) => {
      const op = r[p.id];
      if (op) conteo[op] = (conteo[op] || 0) + 1;
    });

    const opciones = Object.keys(conteo);

    return (
      <div
        key={p.id}
        className="
          bg-white/70 backdrop-blur-lg 
          border border-gray-200 shadow-xl 
          rounded-2xl p-6 transition-all 
          hover:shadow-2xl hover:-translate-y-1
        "
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">{p.texto}</h3>

        {opciones.length === 0 ? (
          <p className="text-gray-600 italic">Sin respuestas.</p>
        ) : (
          <ul className="space-y-2">
            {opciones.map((op) => (
              <li
                key={op}
                className="
                  flex justify-between items-center 
                  bg-blue-50 border border-blue-200 
                  py-2 px-3 rounded-xl shadow-sm
                "
              >
                <span className="font-semibold text-gray-900">{op}</span>
                <span className="text-blue-700 font-bold text-lg">
                  {conteo[op]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  });
}
