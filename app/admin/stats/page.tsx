"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";

type Stats = {
  usuarios: {
    total: number;
    admins: number;
    nuevosUltimos30d: number;
  };
  invitados: {
    total: number;
    ultimos30d: number;
  };
  votos: {
    total: number;
    ultimos30d: number;
    ultimos7d: number;
    promedioPuntuacion: number;
    distribucion: { puntuacion: number; votos: number }[];
    porDiaUltimos7d: { dia: string; n: number }[];
  };
  dependencias: {
    total: number;
    conAlMenosUnVoto: number;
    porTipo: { tipo: string; total: number }[];
    votadasUltimos30dPorTipo: { tipo: string; n: number; dependencias_unicas: number }[];
  };
  topDependencias: { id: number; nombre: string; votos: number }[];
  topUsuarios: { id: string; email: string; nombre: string; votos: number }[];
};

function KpiCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-extrabold mt-1 text-gray-900">{value}</p>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function tipoLabel(t: string) {
  const map: Record<string, string> = {
    juzgado: "Juzgados",
    camara: "Cámaras",
    sala: "Salas",
    grupo_juzgados: "Grupos de juzgados",
    grupo_salas: "Grupos de salas",
    otro: "Otros",
  };
  return map[t] || t;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (e: any) {
        if (e?.response?.status === 403) {
          router.replace("/");
          return;
        }
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const maxDia = stats?.votos.porDiaUltimos7d.reduce((m, d) => Math.max(m, d.n), 0) || 1;
  const maxDist = stats?.votos.distribucion.reduce((m, d) => Math.max(m, d.votos), 0) || 1;

  return (
    <main className="min-h-screen px-4 pt-8 pb-24 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-3">Estadísticas</h1>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <button
            onClick={() => router.push("/admin/usuarios")}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Usuarios
          </button>
          <button
            onClick={() => router.push("/admin/acciones")}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Acciones
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500 py-8">Cargando...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {stats && (
        <>
          <h2 className="text-lg font-bold mt-2 mb-3 text-gray-700">Usuarios</h2>
          <p className="text-xs text-gray-500 mb-3">
            Sólo cuenta usuarios con email verificado.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Total" value={stats.usuarios.total} />
            <KpiCard label="Admins" value={stats.usuarios.admins} />
            <KpiCard label="Nuevos (30d)" value={stats.usuarios.nuevosUltimos30d} />
          </div>

          <h2 className="text-lg font-bold mt-8 mb-3 text-gray-700">Invitados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Total" value={stats.invitados.total} hint="Desde que activamos el tracking" />
            <KpiCard label="Últimos 30d" value={stats.invitados.ultimos30d} />
          </div>

          <h2 className="text-lg font-bold mt-8 mb-3 text-gray-700">Votos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Total" value={stats.votos.total} />
            <KpiCard label="Últimos 30d" value={stats.votos.ultimos30d} />
            <KpiCard label="Últimos 7d" value={stats.votos.ultimos7d} />
            <KpiCard label="Promedio" value={Number(stats.votos.promedioPuntuacion).toFixed(2)} />
          </div>

          <h3 className="text-sm font-bold mt-6 mb-2 text-gray-600">Distribución de puntuaciones</h3>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            {stats.votos.distribucion.map((d) => (
              <div key={d.puntuacion} className="flex items-center gap-3 py-1">
                <span className="w-8 text-sm text-gray-600">{d.puntuacion} ★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${(d.votos / maxDist) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-gray-700 text-right">{d.votos}</span>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold mt-6 mb-2 text-gray-600">Votos por día (últimos 7)</h3>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-end gap-2 h-36">
            {stats.votos.porDiaUltimos7d.length === 0 && (
              <p className="text-sm text-gray-500">Sin datos</p>
            )}
            {stats.votos.porDiaUltimos7d.map((d) => (
              <div key={d.dia} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[11px] text-gray-700 mb-1">{d.n}</span>
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(d.n / maxDia) * 100}%` }}
                />
                <span className="text-[10px] text-gray-400 mt-1">
                  {d.dia.slice(5)}
                </span>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold mt-8 mb-3 text-gray-700">Dependencias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Total" value={stats.dependencias.total} />
            <KpiCard
              label="Con al menos 1 voto"
              value={stats.dependencias.conAlMenosUnVoto}
              hint={`${Math.round(
                (stats.dependencias.conAlMenosUnVoto / (stats.dependencias.total || 1)) * 100
              )}% del total`}
            />
          </div>

          <h3 className="text-sm font-bold mt-6 mb-2 text-gray-600">Votadas en los últimos 30 días por tipo</h3>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {stats.dependencias.votadasUltimos30dPorTipo.length === 0 && (
              <p className="text-sm text-gray-500 px-4 py-3">Sin datos</p>
            )}
            {stats.dependencias.votadasUltimos30dPorTipo.map((t) => (
              <div key={t.tipo} className="flex items-center justify-between px-4 py-3">
                <p className="text-gray-900">{tipoLabel(t.tipo)}</p>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{t.n} votos</p>
                  <p className="text-xs text-gray-500">
                    {t.dependencias_unicas} {t.dependencias_unicas === 1 ? "única" : "únicas"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold mt-6 mb-2 text-gray-600">Total de dependencias por tipo</h3>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {stats.dependencias.porTipo.map((t) => (
              <div key={t.tipo} className="flex items-center justify-between px-4 py-3">
                <p className="text-gray-900">{tipoLabel(t.tipo)}</p>
                <span className="text-sm font-semibold text-gray-700">{t.total}</span>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold mt-8 mb-3 text-gray-700">Top dependencias</h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {stats.topDependencias.length === 0 && (
              <p className="text-gray-500 px-4 py-3 text-sm">Sin datos</p>
            )}
            {stats.topDependencias.map((d, i) => (
              <div key={d.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-gray-400 font-bold w-5">{i + 1}</span>
                  <p className="text-gray-900 truncate">{d.nombre}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{d.votos} votos</span>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold mt-8 mb-3 text-gray-700">Usuarios más activos</h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {stats.topUsuarios.length === 0 && (
              <p className="text-gray-500 px-4 py-3 text-sm">Sin datos</p>
            )}
            {stats.topUsuarios.map((u, i) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-gray-400 font-bold w-5">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-gray-900 truncate">{u.nombre}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{u.votos} votos</span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
