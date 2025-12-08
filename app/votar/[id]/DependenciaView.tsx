"use client";

import { motion } from "framer-motion";

// ⭐ Componente de estrellas
function StarRating({ promedio = 0, cantidad = 0 }) {
  const filled = Math.round(Number(promedio) || 0);

  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-yellow-400 text-lg ${n <= filled ? "" : "opacity-30"}`}
        >
          ★
        </span>
      ))}

      <span className="text-sm font-semibold text-gray-800 ml-1">
        {(Number(promedio) || 0).toFixed(1)}
      </span>

      <span className="text-xs text-gray-500 ml-1">
        ({cantidad})
      </span>
    </div>
  );
}

export default function DependenciaView({ data }: { data: any }) {
  const dep = data.dependencia;
  const integrantes = data.integrantes || [];
  const hijos = data.children || [];
  const tieneHijos = hijos.length > 0;

  return (
    <main className="pt-20 pb-20 px-6 max-w-3xl mx-auto text-gray-900">

      {/* TITULO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">{dep.nombre}</h1>
        <div className="mx-auto mt-3 h-[3px] w-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* CARD PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-lg border border-gray-200 
        shadow-lg rounded-2xl p-6 mb-10"
      >
        <p className="text-gray-700 text-lg font-medium capitalize mb-2">
          Tipo:{" "}
          <span className="font-semibold text-blue-600">
            {dep.tipo_funcional}
          </span>
        </p>

        {dep.domicilio && (
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Domicilio:</span> {dep.domicilio}
          </p>
        )}

        {dep.localidad && (
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Ciudad:</span> {dep.localidad}
          </p>
        )}

        {dep.telefono && (
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Teléfono:</span> {dep.telefono}
          </p>
        )}

        {dep.email && (
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Email:</span> {dep.email}
          </p>
        )}
      </motion.div>

      {/* ======================================================
         SI NO TIENE HIJOS → MOSTRAR BOTONES
      ======================================================= */}
      {!tieneHijos && (
   <div
   className="
     mb-12 
     flex flex-col items-center gap-4 
     md:flex-row md:justify-center md:gap-6
   "
 >
   <a
     href={`/votar/${dep.id}`}
     className="
       w-full md:w-64 text-center
       px-8 py-4 rounded-2xl bg-gradient-to-r 
       from-blue-500 to-blue-600 text-white font-semibold shadow-lg 
       hover:shadow-xl hover:-translate-y-1 transition-all
     "
   >
     Evaluar →
   </a>
 
   <a
     href={`/dependencia/${dep.id}/evaluaciones`}
     className="
       w-full md:w-64 text-center
       px-8 py-4 rounded-2xl bg-gradient-to-r 
       from-green-500 to-blue-600 text-white font-semibold shadow-lg 
       hover:shadow-xl hover:-translate-y-1 transition-all
     "
   >
     Ver evaluaciones →
   </a>
 </div>
 
      )}

      {/* ======================================================
         INTEGRANTES
      ======================================================= */}
      {integrantes.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Integrantes</h2>
          <div className="space-y-5">
            {integrantes.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white/70 backdrop-blur-md 
                border border-gray-200 shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {p.tratamiento} {p.apellido}, {p.nombre}
                </h3>

                {p.funcion && (
                  <p className="text-blue-600 font-medium mt-1">{p.funcion}</p>
                )}

                {p.visibleEmail && p.email && (
                  <p className="text-gray-700 mt-2">
                    <span className="font-semibold">Email:</span> {p.email}
                  </p>
                )}

                {p.visibleTelefono && p.telefono && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Teléfono:</span> {p.telefono}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
         SI TIENE HIJOS → MOSTRAR CARDS TIPO JUZGADOS
      ======================================================= */}
      {tieneHijos && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Salas:</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {hijos.map((c: any, i: number) => (
              <motion.a
                key={c.id}
                href={`/dependencia/${c.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="block p-5 rounded-2xl bg-white/70 backdrop-blur-lg
                border border-gray-200 shadow-md hover:shadow-xl
                hover:-translate-y-1 transition-all group"
              >
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {c.nombre}
                </h3>

                {/* ⭐ PROMEDIO DE VOTACIÓN */}
                <StarRating promedio={c.promedio} cantidad={c.cantidad_votos} />

                {c.domicilio && (
                  <p className="mt-2 text-gray-700">{c.domicilio}</p>
                )}

                {c.localidad && (
                  <p className="text-gray-700">{c.localidad}</p>
                )}

                <p className="mt-3 text-sm font-medium text-blue-600 group-hover:underline">
                  Ver detalle →
                </p>
              </motion.a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
