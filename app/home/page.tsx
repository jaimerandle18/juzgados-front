"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import JuzgadoCard from "../components/JuzgadoCard";
import LoadingScreen from "../components/LoadingScreen";

export type Juzgado = {
    id: number;
    nombre: string;
    direccion?: string;
    ciudad?: string;
    promedio?: number;     // 👈 agregado
    totalVotos?: number;   // 👈 agregado
  };

export default function HomePage() {
  const [juzgados, setJuzgados] = useState<Juzgado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJuzgados = async () => {
      try {
        const res = await api.get("/juzgados");
        setJuzgados(res.data);
      } catch (error) {
        console.error("Error al obtener los juzgados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJuzgados();
  }, []);

  if (loading) {
    return (
        <LoadingScreen key="loading" />
    );
  }

  return (
    <main className="min-h-screen bg-fondo text-white p-4">
     <br></br>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {juzgados.length > 0 ? (
          juzgados.map((j) => (
            <JuzgadoCard
            key={j.id}
            id={j.id}
            nombre={j.nombre}
            ciudad={j.ciudad}
            promedio={j.promedio ?? 0}
          />
          
          ))
        ) : (
          <p className="text-center text-gray-400">No hay juzgados cargados.</p>
        )}
      </div>
    </main>
  );
}
