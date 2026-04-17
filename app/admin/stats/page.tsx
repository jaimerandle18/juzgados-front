"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";

type Stats = {
  usuarios: {
    total: number;
    verificados: number;
    abogadosVerificados: number;
    admins: number;
    nuevosUltimos30d: number;
  };
  votos: {
    total: number;
    ultimos30d: number;
    promedioPuntuacion: number;
  };
  topDependencias: { id: number; nombre: string; votos: number }[];
};

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-extrabold mt-1 text-gray-900">{value}</p>
    </div>
  );
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

  return (
    <main className="min-h-screen px-4 pt-8 pb-24 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">Estadísticas</h1>
        <button
          onClick={() => router.push("/admin/usuarios")}
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
        >
          Ver usuarios
        </button>
      </div>

      {loading && <p className="text-center text-gray-500 py-8">Cargando...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {stats && (
        <>
          <h2 className="text-lg font-bold mt-2 mb-3 text-gray-700">Usuarios</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Total" value={stats.usuarios.total} />
            <KpiCard label="Verificados" value={stats.usuarios.verificados} />
            <KpiCard
              label="Abogados validados"
              value={stats.usuarios.abogadosVerificados}
            />
            <KpiCard label="Admins" value={stats.usuarios.admins} />
            <KpiCard
              label="Nuevos (30d)"
              value={stats.usuarios.nuevosUltimos30d}
            />
          </div>

          <h2 className="text-lg font-bold mt-8 mb-3 text-gray-700">Votos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Total" value={stats.votos.total} />
            <KpiCard label="Últimos 30d" value={stats.votos.ultimos30d} />
            <KpiCard
              label="Promedio"
              value={Number(stats.votos.promedioPuntuacion).toFixed(2)}
            />
          </div>

          <h2 className="text-lg font-bold mt-8 mb-3 text-gray-700">
            Top dependencias
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {stats.topDependencias.length === 0 && (
              <p className="text-gray-500 px-4 py-3 text-sm">Sin datos</p>
            )}
            {stats.topDependencias.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-gray-400 font-bold w-5">{i + 1}</span>
                  <p className="text-gray-900 truncate">{d.nombre}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {d.votos} votos
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
