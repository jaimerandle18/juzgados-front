"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";

type Usuario = {
  id: string;
  email: string;
  nombre: string | null;
  apellido: string | null;
  created_at: string;
  es_verificado: boolean;
  es_abogado_verificado: boolean;
};

export default function AdminAccionesPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [separator, setSeparator] = useState<"comma" | "semicolon" | "newline">("comma");
  const [onlyVerified, setOnlyVerified] = useState(false);

  const fetchUsuarios = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/usuarios", { params: q ? { q } : {} });
      setUsuarios(res.data.usuarios || []);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        router.replace("/");
        return;
      }
      setError("No se pudo cargar la lista");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchUsuarios(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    return onlyVerified ? usuarios.filter((u) => u.es_verificado) : usuarios;
  }, [usuarios, onlyVerified]);

  const allSelected =
    filtered.length > 0 && filtered.every((u) => selected.has(u.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) {
      filtered.forEach((u) => next.delete(u.id));
    } else {
      filtered.forEach((u) => next.add(u.id));
    }
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const clearSelection = () => setSelected(new Set());

  const selectedEmails = useMemo(() => {
    return usuarios.filter((u) => selected.has(u.id)).map((u) => u.email);
  }, [usuarios, selected]);

  const sep = separator === "comma" ? ", " : separator === "semicolon" ? "; " : "\n";

  const copyEmails = async () => {
    const text = selectedEmails.join(sep);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-40 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">Acciones</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/stats")}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Estadísticas
          </button>
          <button
            onClick={() => router.push("/admin/usuarios")}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Usuarios
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Seleccioná usuarios y copiá sus mails al portapapeles.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por email, nombre, apellido, tomo o folio..."
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 text-gray-900"
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="w-4 h-4"
          />
          Solo verificados
        </label>

        <button
          onClick={toggleAll}
          disabled={filtered.length === 0}
          className="text-sm border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
        </button>

        {selected.size > 0 && (
          <button
            onClick={clearSelection}
            className="text-sm border border-gray-300 bg-white text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Limpiar ({selected.size})
          </button>
        )}
      </div>

      {loading && <p className="text-center text-gray-500 py-8">Cargando...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-600 mb-3">
            {filtered.length} usuario{filtered.length === 1 ? "" : "s"} · {selected.size} seleccionado{selected.size === 1 ? "" : "s"}
          </p>

          <div className="space-y-2">
            {filtered.map((u) => {
              const checked = selected.has(u.id);
              return (
                <label
                  key={u.id}
                  className={
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition " +
                    (checked
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50")
                  }
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(u.id)}
                    className="w-4 h-4"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {(u.nombre || "") + " " + (u.apellido || "")}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{u.email}</p>
                  </div>
                  {u.es_verificado && (
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                      verificado
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </>
      )}

      {/* Barra flotante de copia */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 z-50">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Separador:</span>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
              >
                <option value="comma">, (coma)</option>
                <option value="semicolon">; (punto y coma)</option>
                <option value="newline">Nueva línea</option>
              </select>
            </div>

            <div className="flex-1" />

            <button
              onClick={copyEmails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg"
            >
              {copied
                ? "¡Copiado!"
                : `Copiar ${selected.size} mail${selected.size === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
