"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "../../src/lib/api";
import { Search, MapPin, X, Navigation, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Resultado {
  id: number;
  nombre: string;
  tipo_funcional: string;
  domicilio?: string;
  localidad?: string;
  fuero?: { nombre: string } | null;
}

const MAX_UBICACIONES = 10;

export default function RecorridoPage() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Resultado[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cacheRef = useRef<Map<string, Resultado[]>>(new Map());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const buscar = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResultados([]);
      setOpen(false);
      return;
    }

    const key = value.trim().toLowerCase();

    if (cacheRef.current.has(key)) {
      const cached = cacheRef.current.get(key)!;
      setResultados(cached);
      setOpen(cached.length > 0);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/pjn/dependencias/buscar", {
          params: { q: value.trim() },
        });
        cacheRef.current.set(key, data);
        setResultados(data);
        setOpen(data.length > 0);
      } catch {
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const agregar = (item: Resultado) => {
    if (seleccionados.length >= MAX_UBICACIONES) return;
    if (seleccionados.some((s) => s.id === item.id)) return;
    setSeleccionados((prev) => [...prev, item]);
    setOpen(false);
    setQuery("");
  };

  const quitar = (id: number) => {
    setSeleccionados((prev) => prev.filter((s) => s.id !== id));
  };

  const tipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
      juzgado: "Juzgado",
      camara: "Camara",
      sala: "Sala",
      tribunal_oral: "Tribunal Oral",
    };
    return map[tipo] || tipo;
  };

  const armarRecorrido = () => {
    if (seleccionados.length < 2) return;

    const direcciones = seleccionados
      .map((s) => {
        const dir = s.domicilio || s.nombre;
        return s.localidad ? `${dir}, ${s.localidad}` : dir;
      });

    // Primer punto = origen, ultimo = destino, intermedios = waypoints
    const origin = encodeURIComponent(direcciones[0]);
    const destination = encodeURIComponent(direcciones[direcciones.length - 1]);
    const waypoints = direcciones
      .slice(1, -1)
      .map((d) => encodeURIComponent(d))
      .join("|");

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }

    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen px-6 pt-10 pb-20">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Armar recorrido</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        {/* Aviso */}
        <div className="flex items-start gap-3 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800">
            Selecciona hasta <strong>{MAX_UBICACIONES} ubicaciones</strong> y te armamos el recorrido
            en Google Maps con la mejor ruta.
          </p>
        </div>

        {/* Buscador */}
        <div ref={containerRef} className="relative w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => buscar(e.target.value)}
              onFocus={() => resultados.length > 0 && setOpen(true)}
              placeholder="Buscar juzgado, camara, sala..."
              disabled={seleccionados.length >= MAX_UBICACIONES}
              className="
                w-full pl-12 pr-4 py-3.5
                rounded-2xl
                bg-white/70 backdrop-blur-lg
                border border-gray-200
                shadow-md
                text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {open && (
            <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl max-h-[60vh] overflow-y-auto">
              {resultados.map((r) => {
                const yaAgregado = seleccionados.some((s) => s.id === r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => !yaAgregado && agregar(r)}
                    disabled={yaAgregado}
                    className={`
                      w-full text-left px-5 py-3.5
                      transition-colors
                      border-b border-gray-100 last:border-b-0
                      flex flex-col gap-0.5
                      ${yaAgregado ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-50"}
                    `}
                  >
                    <span className="font-semibold text-gray-900 text-sm leading-tight">
                      {r.nombre}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tipoLabel(r.tipo_funcional)}
                      {r.fuero?.nombre ? ` · ${r.fuero.nombre}` : ""}
                      {yaAgregado ? " · Ya agregado" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {open && resultados.length === 0 && !loading && query.length >= 2 && (
            <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl px-5 py-4 text-sm text-gray-500">
              No se encontraron resultados
            </div>
          )}
        </div>

        {/* Contador */}
        {seleccionados.length > 0 && (
          <p className="text-sm text-gray-500 text-center">
            {seleccionados.length} de {MAX_UBICACIONES} ubicaciones
          </p>
        )}

        {/* Lista de seleccionados */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {seleccionados.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                className="
                  flex items-center gap-3
                  bg-white/70 backdrop-blur-lg
                  border border-gray-200
                  rounded-2xl p-4 shadow-md
                "
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {item.nombre}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.domicilio || "Sin domicilio"}
                    {item.localidad ? `, ${item.localidad}` : ""}
                  </p>
                </div>

                <button
                  onClick={() => quitar(item.id)}
                  className="shrink-0 p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Boton de armar recorrido */}
        {seleccionados.length >= 2 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={armarRecorrido}
            className="
              w-full py-4 rounded-2xl
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold text-lg
              shadow-lg hover:-translate-y-0.5
              transition-all
              flex items-center justify-center gap-3
            "
          >
            <Navigation className="w-5 h-5" />
            Abrir recorrido en Google Maps
          </motion.button>
        )}

        {seleccionados.length === 1 && (
          <p className="text-sm text-gray-400 text-center">
            Agrega al menos 2 ubicaciones para armar el recorrido
          </p>
        )}
      </div>
    </main>
  );
}
