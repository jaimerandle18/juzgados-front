"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "src/lib/api";
import { BarChart3 } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function PromediosJuzgado() {
  const { id } = useParams();
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromedios = async () => {
      try {
        const res = await api.get(`/juzgados/${id}/promedios`);
        setDatos(res.data);
      } catch (err) {
        console.error("Error al obtener promedios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromedios();
  }, [id]);

  if (loading) return <LoadingScreen/>;
  if (!datos) return <p className="text-center text-red-500">No hay datos disponibles.</p>;

  return (
    <main className="min-h-screen bg-fondo text-white p-6">
      <div className="max-w-3xl mx-auto bg-grisOscuro p-6 rounded-3xl shadow-lg space-y-8">
        {/* Título principal */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">{datos.juzgado.nombre}</h1>
          <BarChart3 className="text-rojo w-6 h-6" />
        </div>

        {/* Listado de estadísticas */}
        {datos.estadisticas.map((preg: any) => {
          // Convertimos el objeto de opciones a array [{opcion, cantidad}]
          const opciones = Object.entries(preg.opciones as Record<string, number>).map(
            ([opcion, cantidad]) => ({
              opcion:
                opcion === "true" ? "Sí" : opcion === "false" ? "No" : opcion,
              cantidad,
            })
          );

          // Buscamos el valor más alto para normalizar las barras
          const max = Math.max(...opciones.map((o) => o.cantidad));

          return (
            <div
              key={preg.id}
              className="bg-[#222] p-5 rounded-2xl border border-gray-700 shadow-inner"
            >
              <h2 className="text-lg font-semibold mb-4 text-rojo">
                {preg.texto}
              </h2>

              <ul className="space-y-3">
                {opciones.map((o) => (
                  <li key={o.opcion} className="flex flex-col">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{o.opcion}</span>
                      <span className="text-gray-400">{o.cantidad} voto(s)</span>
                    </div>

                    {/* Barra visual */}
                    <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rojo to-red-600 rounded-full transition-all duration-700"
                        style={{
                          width: `${(o.cantidad / max) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </main>
  );
}
