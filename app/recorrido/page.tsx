"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "../../src/lib/api";
import { Search, X, AlertCircle, Locate, StickyNote, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import LoadingScreen from "../components/LoadingScreen";

interface Resultado {
  id: number;
  nombre: string;
  tipo_funcional: string;
  domicilio?: string | null;
  localidad?: string | null;
  lat?: number | null;
  lng?: number | null;
  fuero?: { nombre: string } | null;
}

// ----- Utils de ruteo -----

type Coord = { lat: number; lng: number };

// Distancia en km usando Haversine. Para ~10 puntos en CABA la diferencia
// con Euclidean es despreciable pero esto es correcto para cualquier lugar.
function haversineKm(a: Coord, b: Coord): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const l1 = toRad(a.lat);
  const l2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(l1) * Math.cos(l2);
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Heuristica nearest-neighbor: arranca en `origen` y en cada paso salta al
// punto no visitado mas cercano. Con 10 puntos, el resultado es
// indistinguible del optimo global (TSP) y se calcula en microsegundos.
function optimizarPorCercania<T extends Coord>(origen: Coord, puntos: T[]): T[] {
  const resto = [...puntos];
  const orden: T[] = [];
  let actual: Coord = origen;
  while (resto.length) {
    let mejorIdx = 0;
    let mejorDist = Infinity;
    for (let i = 0; i < resto.length; i++) {
      const d = haversineKm(actual, resto[i]);
      if (d < mejorDist) {
        mejorDist = d;
        mejorIdx = i;
      }
    }
    const sig = resto.splice(mejorIdx, 1)[0];
    orden.push(sig);
    actual = sig;
  }
  return orden;
}

// Centroide (promedio de lat/lng). Sirve como origen "virtual" cuando no
// tenemos GPS: el punto mas cercano al centroide arranca primero y los
// outliers (p.ej. un juzgado en Bahia Blanca mientras el resto esta en
// CABA) caen al final naturalmente.
function centroide(puntos: Coord[]): Coord {
  const sum = puntos.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: sum.lat / puntos.length, lng: sum.lng / puntos.length };
}

// Geolocalizacion envuelta en promesa. Devuelve null si el usuario niega,
// no hay soporte, o tarda demasiado. En el WebView de Capacitor iOS el
// timeout del navegador no siempre se respeta (p.ej. si el dialog de
// permisos queda abierto), asi que sumamos un hard-timeout nuestro.
function pedirUbicacion(): Promise<Coord | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return resolve(null);
    }
    let terminado = false;
    const finalizar = (c: Coord | null) => {
      if (terminado) return;
      terminado = true;
      resolve(c);
    };
    // Hard-timeout de 6s: si el webview no responde en ese lapso, seguimos
    // sin ubicacion y abrimos Maps con el orden manual. Mejor que dejar al
    // usuario viendo "Armando recorrido..." para siempre.
    const t = setTimeout(() => finalizar(null), 6000);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(t);
          finalizar({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          clearTimeout(t);
          finalizar(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60_000 }
      );
    } catch {
      clearTimeout(t);
      finalizar(null);
    }
  });
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
  const [maxModalOpen, setMaxModalOpen] = useState(false);
  const [cardsExpandidas, setCardsExpandidas] = useState<Set<number>>(new Set());
  const [armando, setArmando] = useState(false);

  const toggleCard = (id: number) => {
    setCardsExpandidas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // Los recorridos guardados con la version vieja no traen domicilio (ni
  // lat/lng). Apenas hidratamos, completamos el detalle de los que falten.
  useEffect(() => {
    if (!hydrated) return;
    seleccionados.forEach((s) => {
      const faltaDireccion = !s.domicilio;
      const faltanCoords = typeof s.lat !== "number" || typeof s.lng !== "number";
      if (faltaDireccion || faltanCoords) completarDetalle(s.id);
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
                lat: typeof dep?.lat === "number" ? dep.lat : s.lat,
                lng: typeof dep?.lng === "number" ? dep.lng : s.lng,
              }
            : s
        )
      );
    } catch {
      // si falla, igual queda agregado con lo que tenemos
    }
  };

  const agregar = (item: Resultado) => {
    if (seleccionados.some((s) => s.id === item.id)) return;
    if (seleccionados.length >= MAX_UBICACIONES) {
      setOpen(false);
      setMaxModalOpen(true);
      return;
    }
    setSeleccionados((prev) => [...prev, item]);
    setOpen(false);
    setQuery("");
    // Si el search no trajo todo (domicilio/coords), pedimos el detalle.
    const faltaDireccion = !item.domicilio;
    const faltanCoords = typeof item.lat !== "number" || typeof item.lng !== "number";
    if (faltaDireccion || faltanCoords) completarDetalle(item.id);
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

  const armarRecorrido = async () => {
    if (seleccionados.length < 1 || armando) return;
    setArmando(true);

    try {
      // Separamos los que tienen coords de los que no. Optimizamos los
      // que tienen; los que no, quedan al final en el orden manual.
      const conCoords = seleccionados.filter(
        (s): s is Resultado & Coord =>
          typeof s.lat === "number" && typeof s.lng === "number"
      );
      const sinCoords = seleccionados.filter(
        (s) => typeof s.lat !== "number" || typeof s.lng !== "number"
      );

      let ordenados: Resultado[] = seleccionados;

      if (conCoords.length >= 2) {
        // Origen: GPS si el usuario lo permite; si no, centroide de los
        // puntos seleccionados (clustering natural, outliers al final).
        const gps = await pedirUbicacion();
        const origen: Coord = gps ?? centroide(conCoords);
        const ordenadosConCoords = optimizarPorCercania(origen, conCoords);
        // Los sin coords al final (raros, solo si el backend no los tiene
        // geocodificados aun). Mantienen su orden relativo manual.
        ordenados = [...ordenadosConCoords, ...sinCoords];
      }

      // Usamos el formato oficial api=1 de Google Maps: soporta destino +
      // waypoints explicitos y es el que Google recomienda para compatibilidad
      // cross-platform (web, Android app, iOS app). El formato path-based
      // `/dir/X/Y/Z/` lo parsea distinto el iOS app y se come las paradas
      // despues de la segunda.
      //   https://www.google.com/maps/dir/?api=1&origin=&destination=X&waypoints=A|B|C
      // Origin vacio -> Maps usa "Tu ubicación" como punto de partida.
      //
      // Priorizamos lat,lng cuando lo tenemos (mas preciso, URL mas cortas);
      // si falta, cae al string direccion + localidad.
      const puntos = ordenados.map((s) => {
        if (typeof s.lat === "number" && typeof s.lng === "number") {
          return `${s.lat},${s.lng}`;
        }
        const dir = s.domicilio || s.nombre;
        return s.localidad ? `${dir}, ${s.localidad}` : dir;
      });

      const destination = puntos[puntos.length - 1];
      const waypoints = puntos.slice(0, -1);

      const params = new URLSearchParams({
        api: "1",
        origin: "",
        destination,
        travelmode: "driving",
      });
      if (waypoints.length > 0) {
        params.set("waypoints", waypoints.join("|"));
      }
      const url = `https://www.google.com/maps/dir/?${params.toString()}`;

      // En webview de iOS, navigate absoluto dispara universal links:
      // si el usuario tiene Google Maps instalado, se abre el app nativo.
      // Si no, cae a la version web en el browser del sistema.
      // En web, abrir en otra pestaña como siempre.
      if (Capacitor.isNativePlatform()) {
        window.location.href = url;
      } else {
        window.open(url, "_blank");
      }
    } finally {
      setArmando(false);
    }
  };

  return (
    <main className="min-h-screen px-6 pt-10 pb-20">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Armar recorrido</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        {/* Buscador */}
        <div ref={containerRef} className="relative w-[90%] self-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => buscar(e.target.value)}
              onFocus={() => resultados.length > 0 && setOpen(true)}
              placeholder="Buscar juzgado, camara, sala..."
              className="
                w-full pl-9 pr-4 py-3.5
                rounded-2xl
                bg-white/70 backdrop-blur-lg
                border border-gray-200
                shadow-md
                text-gray-900 placeholder-gray-400
                focus:outline-none
                transition-all
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 font-medium">
            {seleccionados.length} de {MAX_UBICACIONES} ubicaciones
          </p>
          {seleccionados.length > 0 && (
            <button
              onClick={limpiarRecorrido}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-full transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar recorrido
            </button>
          )}
        </div>

        {/* Estado vacio: explicamos como se arma un recorrido */}
        {seleccionados.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
              bg-white/70 backdrop-blur-lg
              border border-gray-200 rounded-2xl
              p-5 shadow-md
            "
          >
            <h2 className="font-bold text-gray-900 mb-1">
              ¿Cómo armar tu recorrido?
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              En tres pasos y listo.
            </p>

            <ol className="flex flex-col gap-4">
              <li className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-blue-500" />
                    Buscá tus destinos
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Escribí el nombre del juzgado, cámara o sala en el buscador
                    de arriba.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                    Sumá hasta {MAX_UBICACIONES} ubicaciones
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Tocá un resultado para agregarlo al recorrido. Si querés,
                    anotá qué tenés que hacer en cada uno (presentar escrito,
                    retirar copias, mesa de entradas...).
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                    <Locate className="w-3.5 h-3.5 text-green-600" />
                    Abrí en Google Maps
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Te armamos la ruta desde tu ubicación actual, con el orden
                    más eficiente para visitarlas todas.
                  </p>
                </div>
              </li>
            </ol>
          </motion.div>
        )}

        {/* Lista de seleccionados */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {seleccionados.map((item, index) => {
              const nota = notas[item.id] ?? "";
              const abierta = notaAbiertaId === item.id;
              const tieneNota = nota.trim().length > 0;
              const expandida = cardsExpandidas.has(item.id);
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

                    <button
                      type="button"
                      onClick={() => toggleCard(item.id)}
                      aria-expanded={expandida}
                      aria-label={expandida ? "Colapsar" : "Ver completo"}
                      className="flex-1 min-w-0 text-left"
                    >
                      <p
                        className={`font-semibold text-gray-900 text-sm ${
                          expandida ? "" : "truncate"
                        }`}
                      >
                        {item.nombre}
                      </p>
                      <p
                        className={`text-xs text-gray-700 ${
                          expandida ? "" : "truncate"
                        }`}
                      >
                        {item.domicilio || "Sin domicilio"}
                        {item.localidad ? `, ${item.localidad}` : ""}
                      </p>
                    </button>

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
                    <button
                      type="button"
                      onClick={() => setNotaAbiertaId(item.id)}
                      aria-label="Editar nota"
                      className="
                        mt-3 w-full text-left
                        flex items-start gap-2
                        text-xs text-amber-900
                        bg-amber-50 border border-amber-200
                        rounded-xl px-3 py-2
                        hover:bg-amber-100 active:scale-[0.99]
                        transition
                      "
                    >
                      <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
                      <p className="whitespace-pre-wrap break-words">{nota}</p>
                    </button>
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
                            onFocus={(e) => {
                              // El teclado de iOS aparece ~300ms despues del
                              // focus y achica el viewport. Esperamos para
                              // que scrollIntoView calcule con el viewport
                              // ya recortado y el textarea quede visible.
                              const el = e.currentTarget;
                              setTimeout(() => {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              }, 350);
                            }}
                            onBlur={() =>
                              // Al tocar fuera del textarea "guardamos" (la
                              // persistencia ya es automatica via localStorage)
                              // y colapsamos el editor.
                              setNotaAbiertaId((prev) =>
                                prev === item.id ? null : prev
                              )
                            }
                            autoFocus
                            placeholder="Ej: presentar escrito, retirar copias, mesa de entradas..."
                            rows={3}
                            className="
                              w-full rounded-xl
                              bg-white border border-gray-200
                              px-3 py-2 text-base text-gray-900 placeholder-gray-400
                              focus:outline-none
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

        {/* Aviso de ubicacion + boton de armar recorrido */}
        {seleccionados.length >= 1 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium bg-green-50/80 border border-green-200 text-green-800">
            <Locate className="w-4 h-4 shrink-0" />
            <span>Google Maps partirá desde tu ubicación actual</span>
          </div>
        )}

        {seleccionados.length >= 1 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={armarRecorrido}
            disabled={armando}
            aria-label="Abrir recorrido en Google Maps"
            className="
              w-full
              flex items-center gap-3
              pl-2.5 pr-4 py-2
              rounded-2xl
              bg-white
              border border-gray-200
              shadow-lg
              transition-all
              hover:-translate-y-0.5 hover:shadow-xl
              active:scale-[0.98]
              disabled:opacity-70 disabled:cursor-progress
            "
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqvez5ObFklOvff8oJJhHbex2KydC-_HmUqA&s"
              alt=""
              className="w-14 h-14 rounded-xl shrink-0 object-cover"
            />
            <div className="flex-1 text-left">
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {armando ? "Armando recorrido…" : "Abrir en Google Maps"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {armando ? "Ordenando por cercanía" : "Iniciar recorrido"}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="text-gray-400 text-lg leading-none"
            >
              ›
            </span>
          </motion.button>
        )}
      </div>

      {/* Loader full-screen mientras armamos el recorrido optimizado.
          Tapa la pantalla hasta que Maps abre (o cae el fallback). */}
      {armando && (
        <LoadingScreen
          message="Vas a ser redirigido a Google Maps cuando encontremos el recorrido más eficiente. Esperá unos segundos."
          brandLogoUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqvez5ObFklOvff8oJJhHbex2KydC-_HmUqA&s"
          brandLogoAlt="Google Maps"
          showSponsor
        />
      )}

      {/* Modal: limite de ubicaciones alcanzado */}
      <AnimatePresence>
        {maxModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMaxModalOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                <h3 className="font-bold text-lg text-gray-900">
                  Llegaste al máximo
                </h3>
              </div>
              <p className="text-sm text-gray-700 mb-5">
                Solo podés armar un recorrido con hasta{" "}
                <strong>{MAX_UBICACIONES} ubicaciones</strong>. Quitá alguna si
                querés sumar otra.
              </p>
              <button
                type="button"
                onClick={() => setMaxModalOpen(false)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
