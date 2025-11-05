"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "src/lib/api";
import { BarChart3 } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function PromediosJuzgado() {
  const { id } = useParams();
  const router = useRouter();
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sinDatos, setSinDatos] = useState(false);

  useEffect(() => {
    const fetchPromedios = async () => {
      try {
        const res = await api.get(`/juzgados/${id}/promedios`);
        setDatos(res.data);
      } catch (err: any) {
        console.error("Error al obtener promedios:", err);
        if (err.response?.status === 404) {
          setSinDatos(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPromedios();
  }, [id]);

  if (loading) return <LoadingScreen />;

  // 🔹 Si no hay evaluaciones registradas
  if (sinDatos) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10"
        style={{ marginTop: "70px" }}
      >
        <div
          style={{
            background: "rgba(30, 30, 30, 0.6)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1.5rem",
            padding: "2rem",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-rojo">
            ⚖️ Sin evaluaciones disponibles
          </h2>
          <p className="text-gray-300 mb-6">
            Aún no hay evaluaciones registradas para este juzgado.
          </p>
          <button
            onClick={() => router.push("/home")}
            className="bg-rojo hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-2xl transition"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  if (!datos)
    return (
      <p className="text-center text-red-500 mt-10">
        Error al cargar los datos del juzgado.
      </p>
    );

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10"
      style={{ marginTop: "70px" }}
    >
      {/* Contenedor principal con blur */}
      <div
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div className="max-w-3xl mx-auto bg-grisOscuro p-6 rounded-3xl shadow-lg space-y-8">
          {/* Título principal */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <h1 className="text-2xl font-bold">{datos.juzgado.nombre}</h1>
            <BarChart3 className="text-rojo w-6 h-6" />
          </div>

          {/* Listado de estadísticas */}
          {datos.estadisticas.map((preg: any) => {
            const opciones = Object.entries(
              preg.opciones as Record<string, number>
            ).map(([opcion, cantidad]) => ({
              opcion:
                opcion === "true" ? "Sí" : opcion === "false" ? "No" : opcion,
              cantidad,
            }));

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
                        <span className="text-gray-400">
                          {o.cantidad} voto(s)
                        </span>
                      </div>

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
      </div>
    </main>
  );
}
