"use client";

import { useEffect, useState } from "react";
import { api } from "src/lib/api";
import { UserCircle2, LogOut } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { deleteCookie } from "cookies-next";

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
    deleteCookie("auth_token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingScreen />;

  if (!usuario)
    return (
      <main className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error al cargar datos del usuario.</p>
      </main>
    );

  return (
    <main
      className="min-h-screen text-black flex items-center justify-center p-6"
      style={{ marginTop: "70px" }}
    >
      <div
        style={{
          background: "white",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "2rem",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-6">
          <UserCircle2 className="w-20 h-20 text-rojo drop-shadow-md mb-3" />
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{
              textShadow: "0 2px 10px rgba(255,255,255,0.15)",
            }}
          >
            Perfil del Usuario
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            ⚖️ Gobierno Abierto
          </p>
        </div>

        {/* Información */}
        <div className="space-y-4 border-t border-gray-700 pt-5 text-left">
          <div>
            <p className="text-sm text-gray-600 ">Nombre completo</p>
            <p className="text-lg font-semibold text-black">
              {usuario.nombre} {usuario.apellido}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 ">Correo electrónico</p>
            <p className="text-lg font-semibold text-black">{usuario.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 ">Evaluaciones realizadas</p>
            <p className="text-lg font-semibold text-black">
              {usuario.totalEvaluaciones || 0}
            </p>
          </div>
        </div>

        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "2rem",
            width: "100%",
            background: "linear-gradient(90deg, #b91c1c, #7f1d1d)",
            color: "white",
            fontWeight: "600",
            padding: "0.8rem",
            borderRadius: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.3s ease",
            boxShadow: "0 5px 20px rgba(255, 0, 0, 0.25)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 0, 0, 0.35)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.boxShadow = "0 5px 20px rgba(255, 0, 0, 0.25)")
          }
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
