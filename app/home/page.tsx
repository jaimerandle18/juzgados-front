"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "src/lib/api";
import JuzgadoCard from "../components/JuzgadoCard";
import LoadingScreen from "../components/LoadingScreen";
import { Search } from "lucide-react";

export type Juzgado = {
  id: number;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  promedio?: number;
  totalVotos?: number;
  telefono: string;
  email: string;
};

export default function HomePage() {
  const [juzgados, setJuzgados] = useState<Juzgado[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fuero, setFuero] = useState<"todos" | "federal" | "nacional">("todos");

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

  // 📌 Función que detecta si un juzgado es federal según su nombre
  const esFederal = (nombre: string) => {
    return nombre.toLowerCase().includes("federal");
  };

  // 🔍 Filtrado por búsqueda + fuero
  const juzgadosFiltrados = useMemo(() => {
    const term = search.toLowerCase().trim();

    return juzgados.filter((j) => {
      const isFederal = esFederal(j.nombre);

      // 🟦 Filtrar por fuero
      if (fuero === "federal" && !isFederal) return false;
      if (fuero === "nacional" && isFederal) return false;

      // 🟥 Filtrar por texto
      if (!term) return true;
      const palabras = term.split(/\s+/);
      const texto = `${j.nombre ?? ""} ${j.ciudad ?? ""}`.toLowerCase();
      return palabras.every((p) => texto.includes(p));
    });
  }, [search, juzgados, fuero]);

  if (loading) return <LoadingScreen key="loading" />;

  return (
    <main className="min-h-screen text-black pt-25 p-6">
      <div className="max-w-6xl mx-auto">

        {/* 🔵 BOTONES DE FILTRO POR FUERO */}
        <div className="flex gap-3 mb-6 justify-center">
          <button
            onClick={() => setFuero("todos")}
            className={`px-4 py-2 rounded-xl border 
            ${fuero === "todos" ? "bg-rojo text-white" : "bg-white text-black border-gray-400"}`}>
            Todos
          </button>

          <button
            onClick={() => setFuero("federal")}
            className={`px-4 py-2 rounded-xl border 
            ${fuero === "federal" ? "bg-rojo text-white" : "bg-white text-black border-gray-400"}`}>
            Federal
          </button>

          <button
            onClick={() => setFuero("nacional")}
            className={`px-4 py-2 rounded-xl border 
            ${fuero === "nacional" ? "bg-rojo text-white" : "bg-white text-black border-gray-400"}`}>
            Nacional
          </button>
        </div>

        {/* 🔎 Barra de búsqueda */}
        <div className="relative mb-6" style={{ marginTop: 20 }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "2px solid grey" }}
            className="w-full bg-white text-black placeholder-gray-600 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rojo transition"
          />
        </div>

        {/* 🏛️ Grilla de juzgados */}
        {juzgadosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {juzgadosFiltrados.map((j) => (
              <JuzgadoCard
                key={j.id}
                id={j.id}
                nombre={j.nombre}
                ciudad={j.ciudad}
                promedio={j.promedio ?? 0}
                telefono={j.telefono}
                email={j.email}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            No se encontraron juzgados que coincidan con “{search}”.
          </p>
        )}
      </div>
    </main>
  );
}
