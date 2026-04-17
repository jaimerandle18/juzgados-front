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
  cpacf_tomo: string | null;
  cpacf_folio: string | null;
  es_verificado: boolean;
  es_abogado_verificado: boolean;
  es_admin: boolean;
};

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const myId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("user_id") || "";
  }, []);

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

  const toggleAdmin = async (u: Usuario) => {
    if (u.id === myId) return;
    setSavingId(u.id);
    try {
      const res = await api.patch(`/admin/usuarios/${u.id}/admin`, {
        es_admin: !u.es_admin,
      });
      setUsuarios((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, es_admin: res.data.es_admin } : x))
      );
    } catch (e: any) {
      alert(e?.response?.data?.error || "Error al actualizar");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-24 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">Usuarios</h1>
        <button
          onClick={() => router.push("/admin/stats")}
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
        >
          Ver estadísticas
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por email, nombre, apellido, tomo o folio..."
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-400 text-gray-900"
      />

      {loading && <p className="text-center text-gray-500 py-8">Cargando...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-600 mb-3">
            {usuarios.length} resultado{usuarios.length === 1 ? "" : "s"}
          </p>

          <div className="space-y-3">
            {usuarios.map((u) => {
              const isSelf = u.id === myId;
              return (
                <div
                  key={u.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 truncate">
                          {(u.nombre || "") + " " + (u.apellido || "")}
                        </p>
                        {u.es_admin && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                            ADMIN
                          </span>
                        )}
                        {isSelf && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            vos
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{u.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tomo {u.cpacf_tomo || "—"} · Folio{" "}
                        {u.cpacf_folio || "—"} ·{" "}
                        {new Date(u.created_at).toLocaleDateString("es-AR")}
                      </p>
                    </div>

                    {!isSelf && (
                      <button
                        onClick={() => toggleAdmin(u)}
                        disabled={savingId === u.id}
                        className={
                          u.es_admin
                            ? "text-sm bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 disabled:opacity-50"
                            : "text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                        }
                      >
                        {savingId === u.id
                          ? "..."
                          : u.es_admin
                          ? "Quitar admin"
                          : "Hacer admin"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
