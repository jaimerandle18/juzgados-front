"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../src/lib/api";
import { Search } from "lucide-react";
import { showLoader } from "./globalLoader";

interface Resultado {
  id: number;
  nombre: string;
  tipo_funcional: string;
  fuero?: { nombre: string } | null;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

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

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/pjn/dependencias/buscar", {
          params: { q: value.trim() },
        });
        setResultados(data);
        setOpen(data.length > 0);
      } catch {
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const navegar = (id: number) => {
    setOpen(false);
    setQuery("");
    showLoader();
    router.push(`/dependencia/${id}`);
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

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => buscar(e.target.value)}
          onFocus={() => resultados.length > 0 && setOpen(true)}
          placeholder="Buscar juzgado, camara, sala..."
          className="
            w-full pl-12 pr-4 py-3.5
            rounded-2xl
            bg-white/70 backdrop-blur-lg
            border border-gray-200
            shadow-md
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
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
          {resultados.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => navegar(r.id)}
              className="
                w-full text-left px-5 py-3.5
                hover:bg-blue-50 transition-colors
                border-b border-gray-100 last:border-b-0
                flex flex-col gap-0.5
              "
            >
              <span className="font-semibold text-gray-900 text-sm leading-tight">
                {r.nombre}
              </span>
              <span className="text-xs text-gray-500">
                {tipoLabel(r.tipo_funcional)}
                {r.fuero?.nombre ? ` · ${r.fuero.nombre}` : ""}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && resultados.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl px-5 py-4 text-sm text-gray-500">
          No se encontraron resultados
        </div>
      )}
    </div>
  );
}
