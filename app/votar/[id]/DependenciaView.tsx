"use client";

import { useState } from "react";
import { showLoader } from "@/components/globalLoader";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { isGuestMode } from "@/utils/AuthGuard";
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
      <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />

    </div>
  );
}

function InfoCard({ dep }: { dep: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-white/70 backdrop-blur-lg border border-gray-200 
        shadow-lg rounded-2xl p-6 mb-10
      "
    >
      {/* TIPO */}
      <p className="text-gray-700 text-lg font-medium capitalize mb-4">
        Tipo:{" "}
        <span className="font-semibold text-blue-600">
          {dep.nombre.includes("Tribunal")
            ? "Tribunal"
            : dep.nombre.includes("Camara")
            ? "Camara"
            : dep.nombre.includes("Salas")
            ? "Sala"
            : dep.nombre.includes("Juzgados")
            ? "Juzgado"
            : dep.tipo_funcional}
        </span>
      </p>

      <div className="flex flex-col gap-3">

        {/* 📍 DOMICILIO */}
        {dep.domicilio && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${dep.domicilio}${dep.localidad ? `, ${dep.localidad}` : ""}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-3 
              text-gray-800               transition active:scale-[0.98]
            "
          >
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{dep.domicilio}</span>
          </a>
        )}

        {/* 📞 TELÉFONO */}
        {dep.telefono && (
          <a
            href={`tel:${String(dep.telefono).replace(/[^\d+]/g, "")}`}
            className="
              flex items-center gap-3 
              text-gray-800               transition active:scale-[0.98]
            "
          >
            <Phone className="w-5 h-5 text-green-500" />
            <span className="font-medium">{dep.telefono}</span>
          </a>
        )}

        {/* ✉️ EMAIL */}
        {dep.email && (
          <a
            href={`mailto:${dep.email}`}
            className="
              flex items-center gap-3 
              text-gray-800               transition active:scale-[0.98]
              break-all
            "
          >
            <Mail className="w-5 h-5 text-purple-500" />
            <span className="font-medium">{dep.email}</span>
          </a>
        )}

      </div>
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
            onClick={() => showLoader()}
              key={c.id}
              href={`/dependencia/${c.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="block p-5 rounded-2xl bg-white/70 backdrop-blur-lg
              border border-gray-200 shadow-md hover:shadow-xl
              hover:-translate-y-1 transition-all group"
            >
              <h3 className="text-xl font-semibold text-gray-900 transition">
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
  const guest = typeof window !== "undefined" && isGuestMode();
  const [showGuestModal, setShowGuestModal] = useState(false);

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
       {guest ? (
         <button
           onClick={() => setShowGuestModal(true)}
           className="dj-btn dj-btn-blue"
         >
           <span className="dj-btn-content">Evaluar →</span>
         </button>
       ) : (
         <a
           href={`/votar/${dep.id}`}
           className="dj-btn dj-btn-blue"
         >
           <span className="dj-btn-content">Evaluar →</span>
         </a>
       )}

     <a
       href={`/dependencia/${dep.id}/evaluaciones`}
       className="dj-btn dj-btn-green"
     >
       <span className="dj-btn-content">Ver evaluaciones →</span>
     </a>
   </div>

      )}

      {/* MODAL INVITADO */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Debes iniciar sesión
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Para evaluar necesitás tener una cuenta. Iniciá sesión o registrate para poder votar.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="/login"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center shadow transition-all"
              >
                Iniciar sesión
              </a>

              <button
                onClick={() => setShowGuestModal(false)}
                className="w-full py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
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
