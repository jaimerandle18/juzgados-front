"use client";

import { useEffect, useState } from "react";
import { api } from "src/lib/api";
import { UserCircle2, LogOut } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/usuarios/me");
        setUsuario(res.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  if (loading)
    return (
    <LoadingScreen/>
    );

  if (!usuario)
    return (
      <main className="min-h-screen bg-fondo flex items-center justify-center text-red-500">
        <p>Error al cargar datos del usuario.</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-fondo text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-grisOscuro p-8 rounded-3xl shadow-lg border border-gray-800">
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <UserCircle2 className="w-20 h-20 text-rojo drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Perfil del Usuario</h1>
          <p className="text-gray-400 mt-1 text-sm">⚖️ ABOGADOS EN ACCIÓN</p>
        </div>

        {/* Información */}
        <div className="space-y-3 border-t border-gray-700 pt-4">
          <div>
            <p className="text-sm text-gray-400">Nombre completo</p>
            <p className="text-lg font-semibold text-white">
              {usuario.nombre} {usuario.apellido}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Correo electrónico</p>
            <p className="text-lg font-semibold text-white">{usuario.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Evaluaciones realizadas</p>
            <p className="text-lg font-semibold text-white">
              {usuario.totalEvaluaciones || 0}
            </p>
          </div>
        </div>

        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-rojo to-red-700 hover:from-red-700 hover:to-rojo text-white font-semibold py-3 rounded-2xl w-full transition-all duration-300 shadow-md"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
