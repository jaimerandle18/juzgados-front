"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";
import { showLoader } from "../../components/globalLoader";

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
  const [confirmTarget, setConfirmTarget] = useState<Usuario | null>(null);

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
    <main className="px-4 pt-8 pb-24 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-3">Usuarios</h1>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <button
            onClick={() => { showLoader(); router.push("/admin/stats"); }}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Estadísticas
          </button>
          <button
            onClick={() => { showLoader(); router.push("/admin/acciones"); }}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Acciones
          </button>
        </div>
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

      {confirmTarget && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
          onClick={() => savingId === null && setConfirmTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {confirmTarget.es_admin
                ? "Quitar permisos de admin"
                : "Dar permisos de admin"}
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              {confirmTarget.es_admin
                ? "Vas a quitarle los permisos de admin a:"
                : "Vas a darle permisos de admin a:"}
            </p>
            <p className="font-semibold text-gray-900">
              {(confirmTarget.nombre || "") + " " + (confirmTarget.apellido || "")}
            </p>
            <p className="text-sm text-gray-500 mb-5">{confirmTarget.email}</p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmTarget(null)}
                disabled={savingId !== null}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const target = confirmTarget;
                  await toggleAdmin(target);
                  setConfirmTarget(null);
                }}
                disabled={savingId !== null}
                className={
                  "px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 " +
                  (confirmTarget.es_admin
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700")
                }
              >
                {savingId === confirmTarget.id
                  ? "Guardando..."
                  : confirmTarget.es_admin
                  ? "Sí, quitar admin"
                  : "Sí, hacer admin"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                        onClick={() => setConfirmTarget(u)}
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
