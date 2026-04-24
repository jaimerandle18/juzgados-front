"use client";

import { useState } from "react";
import { showLoader } from "@/components/globalLoader";
import AnchorWithLoader from "@/components/AnchorWithLoader";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Building2, Map, Copy } from "lucide-react";
import { isGuestMode } from "@/utils/AuthGuard";
import StarRating from "@/components/StarRating";
import { useToast } from "@/components/Toast";
import { hapticLight } from "@/utils/haptics";

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

function CopyButton({ value, label }: { value: string; label: string }) {
  const { toastSuccess, toastError } = useToast();

  const copiar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hapticLight();
    try {
      await navigator.clipboard.writeText(value);
      toastSuccess(`${label} copiado`);
    } catch {
      toastError("No se pudo copiar");
    }
  };

  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={`Copiar ${label.toLowerCase()}`}
      className="
        shrink-0 p-2 rounded-full text-gray-400
        hover:text-blue-600 hover:bg-blue-50 transition active:scale-95
      "
    >
      <Copy className="w-4 h-4" />
    </button>
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
              `${dep.domicilio}${dep.localidad ? `, ${dep.localidad}` : ""}${dep.provincia ? `, ${dep.provincia}` : ""}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-3
              text-gray-800 hover:text-blue-600 transition active:scale-[0.98]
            "
          >
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{dep.domicilio}</span>
          </a>
        )}

        {/* 🏢 PISO */}
        {dep.piso && (() => {
          // Formato español rioplatense: 1er, 2do, 3er, 4to, 5to, 6to,
          // 7mo, 8vo, 9no, 10mo, y para 11+ usamos el símbolo "°".
          const ordinal = (n: number) => {
            const s: Record<number, string> = {
              1: "er", 2: "do", 3: "er", 4: "to", 5: "to",
              6: "to", 7: "mo", 8: "vo", 9: "no", 10: "mo",
            };
            return s[n] ? `${n}${s[n]}` : `${n}°`;
          };

          const raw = String(dep.piso).trim();
          const m = raw.match(/\d+/);
          const texto = m ? `${ordinal(parseInt(m[0], 10))} piso` : raw;

          return (
            <div className="flex items-center gap-3 text-gray-800">
              <Building2 className="w-5 h-5 text-amber-500" />
              <span className="font-medium">{texto}</span>
            </div>
          );
        })()}

        {/* 🌆 LOCALIDAD */}
        {dep.localidad && (
          <div className="flex items-center gap-3 text-gray-800">
            <Map className="w-5 h-5 text-cyan-500" />
            <span className="font-medium">{dep.localidad}</span>
          </div>
        )}

        {/* 📞 TELÉFONO */}
        {dep.telefono && (
          <div className="flex items-center gap-3">
            <a
              href={`tel:${String(dep.telefono).replace(/[^\d+]/g, "")}`}
              className="
                flex-1 flex items-center gap-3
                text-gray-800 hover:text-blue-600 transition active:scale-[0.98]
              "
            >
              <Phone className="w-5 h-5 text-green-500" />
              <span className="font-medium">{dep.telefono}</span>
            </a>
            <CopyButton value={String(dep.telefono)} label="Teléfono" />
          </div>
        )}

        {/* ✉️ EMAIL */}
        {dep.email && (
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${dep.email}`}
              className="
                flex-1 flex items-center gap-3 min-w-0
                text-gray-800 hover:text-blue-600 transition active:scale-[0.98]
              "
            >
              <Mail className="w-5 h-5 text-purple-500 shrink-0" />
              <span className="font-medium break-all">{dep.email}</span>
            </a>
            <CopyButton value={String(dep.email)} label="Email" />
          </div>
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
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <AnchorWithLoader
                href={`/dependencia/${c.id}`}
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
                    value={c.promedio}
                    cantidad={c.cantidad_votos}
                    size="sm"
                    tintedByValue
                  />
                )}

                <p className="mt-3 text-sm font-medium text-blue-600 group-hover:underline">
                  Ver detalle →
                </p>
              </AnchorWithLoader>
            </motion.div>
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
         <AnchorWithLoader
           href={`/votar/${dep.id}`}
           className="dj-btn dj-btn-blue"
         >
           <span className="dj-btn-content">Evaluar →</span>
         </AnchorWithLoader>
       )}

     <AnchorWithLoader
       href={`/dependencia/${dep.id}/evaluaciones`}
       className="dj-btn dj-btn-green"
     >
       <span className="dj-btn-content">Ver evaluaciones →</span>
     </AnchorWithLoader>
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
