"use client";

import AnchorWithLoader from "@/components/AnchorsWithLoaders";
import { motion } from "framer-motion";

// ======================
// ⭐ ESTRELLAS
// ======================
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
      <span className="text-xs text-gray-500 ml-1">({cantidad})</span>
    </div>
  );
}

// ======================
// 👥 INTEGRANTES
// ======================
function IntegrantesSection({ integrantes }: { integrantes: any[] }) {
  if (!integrantes || integrantes.length === 0) return null;

  return (
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
  );
}

// ======================
// 🧱 HEADER + INFO
// ======================
function Header({ dep }: { dep: any }) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-extrabold tracking-tight">{dep.nombre}</h1>
      <div className="mx-auto mt-3 h-[3px] w-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
    </div>
  );
}

function InfoCard({ dep }: { dep: any }) {
  console.log(dep,"dep")
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-lg border border-gray-200 
      shadow-lg rounded-2xl p-6 mb-10"
    >
      <p className="text-gray-700 text-lg font-medium capitalize mb-2">
        Tipo:{" "}
        <span className="font-semibold text-blue-600">
          {dep.nombre.includes("Tribunal")?"Tribunal":dep.nombre.includes("Camara")? "Camara" :dep.nombre.includes("Salas")? "Sala":dep.nombre.includes("Juzgados")?"Juzgado": dep.tipo_funcional }
        </span>
      </p>

      {dep.domicilio && (
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Domicilio:</span> {dep.domicilio}
        </p>
      )}

      {dep.localidad && (
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Localidad:</span> {dep.localidad}
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
  );
}

// ======================
// 📂 HIJOS (SALAS / JUZGADOS / ETC)
// ======================
function ChildrenGrid({
  children,
  titulo = "Salas",
}: {
  children: any[];
  titulo?: string;
}) {
  if (!children || children.length === 0) return null;

  // 👉 SOLO lo que queremos mostrar como card
  const childrenFiltrados = children.filter((c: any) =>
    ["camara", "sala", "juzgado", "grupo_salas", "grupo_juzgados"].includes(
      c.tipo_funcional
    )
  );

  if (childrenFiltrados.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{titulo}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {childrenFiltrados.map((c: any, i: number) => {
          const esGrupo =
            c.tipo_funcional === "grupo_salas" ||
            c.tipo_funcional === "grupo_juzgados";

          return (
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

              {/* ⭐ solo dependencias reales */}
              {!esGrupo && (
                <StarRating
                  promedio={c.promedio}
                  cantidad={c.cantidad_votos}
                />
              )}

              <p className="mt-3 text-sm font-medium text-blue-600 group-hover:underline">
                Ver detalle →
              </p>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}



// ======================
// 🌍 EXPORT DEFAULT
// ======================
export default function DependenciaView({ data }: { data: any }) {
  const dep = data.dependencia;
  const integrantes = data.integrantes || [];
  const children = data.children || [];

  const tieneHijos = children.length > 0;
// 👉 detectar Cámara Nacional de Apelaciones en lo Criminal y Correccional
const esCamaraApelacionesCriminal =
  dep.pjn_id === "705" ||
  dep.nombre
    ?.toLowerCase()
    .includes("cámara nacional de apelaciones en lo criminal");

// 👉 por defecto, mostramos todo
let childrenToShow = children;
let tituloChildren = "Salas";

// 🔴 CASO ESPECIAL: Cámara 705
if (esCamaraApelacionesCriminal) {
  childrenToShow = children.filter((c: any) => {
    // Card 1: Salas
    if (c.tipo_funcional === "grupo_salas") return true;

    // Card 2: Juzgados Criminal y Correccional
    if (
      c.tipo_funcional === "grupo_juzgados" &&
      c.nombre.toLowerCase().includes("criminal y correccional")
    )
      return true;

    // Card 3: Juzgados de Menores
    if (
      c.tipo_funcional === "grupo_juzgados" &&
      c.nombre.toLowerCase().includes("menores")
    )
      return true;

    return false;
  });

  tituloChildren = "Secciones";
}



  return (
    <main className="pt-20 pb-20 px-6 max-w-3xl mx-auto text-gray-900">
      <Header dep={dep} />
      <InfoCard dep={dep} />

      {/* BOTONES SOLO SI NO TIENE HIJOS */}
      {!tieneHijos && (
        <div className="mb-12 flex flex-col md:flex-row gap-6 justify-center">
          <AnchorWithLoader
            href={`/votar/${dep.id}`}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r 
            from-blue-500 to-blue-600 text-white font-semibold shadow-lg"
          >
            Evaluar →
          </AnchorWithLoader>

          <AnchorWithLoader
            href={`/dependencia/${dep.id}/evaluaciones`}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r 
            from-green-500 to-blue-600 text-white font-semibold shadow-lg"
          >
            Ver evaluaciones →
          </AnchorWithLoader>
        </div>
      )}

      {/* 👥 INTEGRANTES (SIEMPRE IGUAL) */}
      <IntegrantesSection integrantes={integrantes} />

      {/* 📂 HIJOS */}
      {childrenToShow.length > 0 && (
  <ChildrenGrid
  children={childrenToShow}
  titulo="Secciones"
/>

)}

      
    </main>
  );
}
