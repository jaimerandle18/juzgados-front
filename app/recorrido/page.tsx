"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "../../src/lib/api";
import { Search, X, AlertCircle, Locate, StickyNote, Trash2 } from "lucide-react";
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
const STORAGE_KEY_SELECCIONADOS = "dj_recorrido_seleccionados";
const STORAGE_KEY_NOTAS = "dj_recorrido_notas";

export default function RecorridoPage() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Resultado[]>([]);
  const [notas, setNotas] = useState<Record<number, string>>({});
  const [notaAbiertaId, setNotaAbiertaId] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cacheRef = useRef<Map<string, Resultado[]>>(new Map());

  // Cargar recorrido guardado al abrir la app. Recien despues habilitamos
  // la persistencia, asi no pisamos lo guardado con el estado vacio inicial.
  useEffect(() => {
    try {
      const rawSel = localStorage.getItem(STORAGE_KEY_SELECCIONADOS);
      if (rawSel) {
        const parsed = JSON.parse(rawSel);
        if (Array.isArray(parsed)) setSeleccionados(parsed);
      }
      const rawNotas = localStorage.getItem(STORAGE_KEY_NOTAS);
      if (rawNotas) {
        const parsed = JSON.parse(rawNotas);
        if (parsed && typeof parsed === "object") setNotas(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_SELECCIONADOS, JSON.stringify(seleccionados));
    } catch {}
  }, [seleccionados, hydrated]);

  // Los recorridos guardados con la version vieja no traen domicilio.
  // Apenas hidratamos, completamos el detalle de los que falten.
  useEffect(() => {
    if (!hydrated) return;
    seleccionados.forEach((s) => {
      if (!s.domicilio) completarDetalle(s.id);
    });
    // Solo en el momento de hidratar; los nuevos ya se completan en agregar().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_NOTAS, JSON.stringify(notas));
    } catch {}
  }, [notas, hydrated]);

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

  // El endpoint /buscar devuelve una ficha liviana (sin domicilio/localidad),
  // asi que al agregar pedimos el detalle para tener la direccion real.
  // Agregamos el item primero para que la UI responda al toque y despues
  // lo enriquecemos cuando llega la respuesta.
  const completarDetalle = async (id: number) => {
    try {
      const { data } = await api.get(`/pjn/dependencias/${id}`);
      // El endpoint envuelve la ficha bajo `dependencia` (junto con integrantes
      // y children). Aceptamos tambien el formato plano por si cambia.
      const dep = data?.dependencia ?? data;
      setSeleccionados((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                domicilio: dep?.domicilio ?? s.domicilio,
                localidad: dep?.localidad ?? s.localidad,
              }
            : s
        )
      );
    } catch {
      // si falla, igual queda agregado con lo que tenemos
    }
  };

  const agregar = (item: Resultado) => {
    if (seleccionados.length >= MAX_UBICACIONES) return;
    if (seleccionados.some((s) => s.id === item.id)) return;
    setSeleccionados((prev) => [...prev, item]);
    setOpen(false);
    setQuery("");
    if (!item.domicilio) completarDetalle(item.id);
  };

  const quitar = (id: number) => {
    setSeleccionados((prev) => prev.filter((s) => s.id !== id));
    setNotas((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setNotaAbiertaId((prev) => (prev === id ? null : prev));
  };

  const toggleNota = (id: number) => {
    setNotaAbiertaId((prev) => (prev === id ? null : id));
  };

  const actualizarNota = (id: number, valor: string) => {
    setNotas((prev) => ({ ...prev, [id]: valor }));
  };

  const limpiarRecorrido = () => {
    if (seleccionados.length === 0) return;
    const ok = window.confirm(
      "¿Limpiar todo el recorrido? Se borraran los juzgados seleccionados y sus notas."
    );
    if (!ok) return;
    setSeleccionados([]);
    setNotas({});
    setNotaAbiertaId(null);
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
    if (seleccionados.length < 1) return;

    const direcciones = seleccionados.map((s) => {
      const dir = s.domicilio || s.nombre;
      return s.localidad ? `${dir}, ${s.localidad}` : dir;
    });

    // Truco: en el formato path-based de Google Maps, dejar el origen
    // VACÍO (doble slash al inicio) hace que Maps use automáticamente
    // "Tu ubicación" como punto de partida — tanto en web como en la
    // app nativa. Así no necesitamos pedir GPS desde la webview.
    //   https://www.google.com/maps/dir//destino1/destino2/...
    const segmentos = direcciones
      .map((d) => encodeURIComponent(d).replace(/%20/g, "+"))
      .join("/");

    const url = `https://www.google.com/maps/dir//${segmentos}/`;

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
          <p className="text-sm text-blue-900 font-medium">
            Selecciona hasta <strong>{MAX_UBICACIONES} ubicaciones</strong> y te armamos el recorrido
            en Google Maps con la mejor ruta.
          </p>
        </div>

        {/* Punto de partida = ubicación del usuario (lo resuelve Maps) */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-green-50/80 border border-green-200 text-green-800">
          <Locate className="w-4 h-4 shrink-0" />
          <span>Google Maps partirá desde tu ubicación actual</span>
        </div>

        {/* Buscador */}
        <div ref={containerRef} className="relative w-[90%] self-center">
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
                    <span className="text-xs text-gray-600">
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
            <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl px-5 py-4 text-sm text-gray-700">
              No se encontraron resultados
            </div>
          )}
        </div>

        {/* Contador + limpiar */}
        {seleccionados.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 font-medium">
              {seleccionados.length} de {MAX_UBICACIONES} ubicaciones
            </p>
            <button
              onClick={limpiarRecorrido}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-full transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar recorrido
            </button>
          </div>
        )}

        {/* Lista de seleccionados */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {seleccionados.map((item, index) => {
              const nota = notas[item.id] ?? "";
              const abierta = notaAbiertaId === item.id;
              const tieneNota = nota.trim().length > 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className="
                    flex flex-col
                    bg-white/70 backdrop-blur-lg
                    border border-gray-200
                    rounded-2xl p-4 shadow-md
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-gray-700 truncate">
                        {item.domicilio || "Sin domicilio"}
                        {item.localidad ? `, ${item.localidad}` : ""}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleNota(item.id)}
                      aria-label={tieneNota ? "Editar nota" : "Agregar nota"}
                      aria-expanded={abierta}
                      className={`
                        shrink-0 p-1.5 rounded-full transition relative
                        ${tieneNota
                          ? "text-amber-600 hover:bg-amber-50"
                          : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}
                      `}
                    >
                      <StickyNote className="w-5 h-5" />
                      {tieneNota && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 border border-white" />
                      )}
                    </button>

                    <button
                      onClick={() => quitar(item.id)}
                      aria-label="Quitar del recorrido"
                      className="shrink-0 p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {!abierta && tieneNota && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
                      <p className="whitespace-pre-wrap break-words">{nota}</p>
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {abierta && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3">
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            ¿Qué tenés que hacer acá?
                          </label>
                          <textarea
                            value={nota}
                            onChange={(e) => actualizarNota(item.id, e.target.value)}
                            placeholder="Ej: presentar escrito, retirar copias, mesa de entradas..."
                            rows={3}
                            className="
                              w-full rounded-xl
                              bg-white border border-gray-200
                              px-3 py-2 text-sm text-gray-900 placeholder-gray-400
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              resize-none
                            "
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Boton de armar recorrido */}
        {seleccionados.length >= 1 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={armarRecorrido}
            aria-label="Abrir recorrido en Google Maps"
            className="
              w-full
              flex items-center gap-4
              pl-3 pr-5 py-3
              rounded-2xl
              bg-white
              border border-gray-200
              shadow-lg
              transition-all
              hover:-translate-y-0.5 hover:shadow-xl
              active:scale-[0.98]
            "
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2xzPbptUcOWQz-4Rjd42Na2gJ6Sh26Rv3Uw&s"
              alt=""
              className="w-14 h-14 rounded-xl shrink-0"
            />
            <div className="flex-1 text-left">
              <p className="font-bold text-gray-900 leading-tight">
                Abrir en Google Maps
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Iniciar recorrido
              </p>
            </div>
            <span
              aria-hidden="true"
              className="text-gray-400 text-xl leading-none"
            >
              ›
            </span>
          </motion.button>
        )}
      </div>
    </main>
  );
}
