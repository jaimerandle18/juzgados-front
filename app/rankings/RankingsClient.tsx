"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Scale } from "lucide-react";
import AnchorWithLoader from "@/components/AnchorWithLoader";
import StarRating from "@/components/StarRating";

interface RankedDep {
  id: number;
  nombre: string;
  tipo_funcional: string;
  fuero: { nombre: string } | null;
  promedio: number;
  cantidad_votos: number;
}

interface Fuero {
  id: number;
  nombre: string;
  tipo: string;
}

const MIN_VOTOS_CONFIANZA = 5;

function rankearBayesiano(
  items: RankedDep[],
  orden: "mejores" | "peores"
): RankedDep[] {
  if (items.length === 0) return items;

  const totalVotos = items.reduce((acc, d) => acc + d.cantidad_votos, 0);
  const sumaPonderada = items.reduce(
    (acc, d) => acc + d.promedio * d.cantidad_votos,
    0
  );
  const C = totalVotos > 0 ? sumaPonderada / totalVotos : 0;

  const scoreDe = (d: RankedDep) => {
    const v = d.cantidad_votos;
    const R = d.promedio;
    return (
      (v / (v + MIN_VOTOS_CONFIANZA)) * R +
      (MIN_VOTOS_CONFIANZA / (v + MIN_VOTOS_CONFIANZA)) * C
    );
  };

  return [...items].sort((a, b) =>
    orden === "mejores" ? scoreDe(b) - scoreDe(a) : scoreDe(a) - scoreDe(b)
  );
}

function tipoLabel(tipo: string) {
  const map: Record<string, string> = {
    juzgado: "Juzgado",
    camara: "Cámara",
    sala: "Sala",
    tribunal_oral: "Tribunal Oral",
  };
  return map[tipo] || tipo;
}

export default function RankingsClient({ fueros }: { fueros: Fuero[] }) {
  const [fueroId, setFueroId] = useState<string>("");
  const [mejores, setMejores] = useState<RankedDep[]>([]);
  const [peores, setPeores] = useState<RankedDep[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    fueros.find((f) => String(f.id) === fueroId)?.nombre ?? "Todos los fueros";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const url = fueroId
      ? `${process.env.NEXT_PUBLIC_API_URL}/pjn/rankings?fueroId=${fueroId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/pjn/rankings`;

    fetch(url)
      .then((r) => r.json())
      .then((raw: { mejores: RankedDep[]; peores: RankedDep[] }) => {
        if (cancelled) return;
        setMejores(rankearBayesiano(raw.mejores, "mejores"));
        setPeores(rankearBayesiano(raw.peores, "peores"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fueroId]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto text-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Rankings</h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
      </div>

      {/* Selector de fuero */}
      <div className="mb-8 flex justify-center">
        <div ref={dropdownRef} className="relative w-full max-w-xs">
          <button
            onClick={() => setOpen((o) => !o)}
            className="
              w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl
              bg-white/80 backdrop-blur-lg border border-gray-200
              shadow-md hover:shadow-lg text-sm font-medium text-gray-700
              transition-all active:scale-[0.97] cursor-pointer
            "
          >
            <Scale size={16} className="text-blue-500 shrink-0" />
            <span className="flex-1 text-left truncate">{selectedLabel}</span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="
                  absolute z-50 mt-2 w-full max-h-60 overflow-y-auto
                  overscroll-contain
                  rounded-2xl bg-white/95 backdrop-blur-xl
                  border border-gray-200 shadow-2xl
                  py-1.5
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-gray-300
                "
              >
                <DropdownItem
                  label="Todos los fueros"
                  selected={fueroId === ""}
                  onClick={() => { setFueroId(""); setOpen(false); }}
                />
                {fueros.map((f) => (
                  <DropdownItem
                    key={f.id}
                    label={f.nombre}
                    selected={fueroId === String(f.id)}
                    onClick={() => { setFueroId(String(f.id)); setOpen(false); }}
                  />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        </div>
      ) : (
        <>
          <Section
            titulo="Mejores Evaluados"
            items={mejores}
            emptyText="No hay dependencias con votos en este fuero."
            medalColors={[
              "text-yellow-500",
              "text-gray-400",
              "text-amber-600",
            ]}
          />

          <div className="my-10" />

          <Section
            titulo="Peores Evaluados"
            items={peores}
            emptyText="No hay dependencias con votos en este fuero."
          />
        </>
      )}
    </main>
  );
}

function Section({
  titulo,
  items,
  emptyText,
  medalColors,
}: {
  titulo: string;
  items: RankedDep[];
  emptyText: string;
  medalColors?: string[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-5">{titulo}</h2>

      {items.length === 0 && <p className="text-gray-500">{emptyText}</p>}

      <div className="space-y-4">
        {items.map((d, i) => (
          <AnchorWithLoader
            key={d.id}
            href={`/dependencia/${d.id}`}
            className="
              block p-5 rounded-2xl bg-white/70 backdrop-blur-lg
              border border-gray-200 shadow-md hover:shadow-xl
              hover:-translate-y-1 transition-all group
            "
          >
            <div className="flex items-start gap-4">
              <span
                className={`text-2xl font-bold ${medalColors?.[i] ?? "text-gray-400"}`}
              >
                #{i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
                  {d.nombre}
                </h3>

                <div className="mt-1">
                  <StarRating
                    value={d.promedio}
                    cantidad={d.cantidad_votos}
                    size="sm"
                    tintedByValue
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {tipoLabel(d.tipo_funcional)}
                  {d.fuero?.nombre ? ` · ${d.fuero.nombre}` : ""}
                </p>
              </div>
            </div>
          </AnchorWithLoader>
        ))}
      </div>
    </section>
  );
}

function DropdownItem({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
          transition-colors cursor-pointer
          ${selected ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}
        `}
      >
        <Check
          size={14}
          className={`shrink-0 transition-opacity ${selected ? "opacity-100 text-blue-500" : "opacity-0"}`}
        />
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}
