"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import image from "../../public/abogadosea.png"
import Link from "next/link";
import { Menu, UserCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "src/lib/api";

/* 🔹 Pantalla de carga con logo girando y brillo metálico */
function LoadingScreen() {
    return (
      <motion.div
        key="loader"
        className="fixed inset-0 flex items-center justify-center bg-black z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Glow dinámico rojo */}
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-red-600/40 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
  
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
          className="relative w-32 h-32 preserve-3d flex items-center justify-center"
        >
          {/* Logo circular */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-[0_0_20px_#ff000033]">
            <Image
              src={image}
              alt="Abogados en Acción"
              fill
              className="object-contain"
            />
  
            {/* Brillo metálico centrado */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent mix-overlay pointer-events-none"
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }
  
  /* 🔹 Layout principal con transición de fade */
  export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<{ nombre: string; apellido: string } | null>(null);
    const pathname = usePathname();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const rutasOcultas = ["/login", "/register", "/verify-token"];

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulamos el fetch de usuario logueado
        const fetchUser = async () => {
          try {
            const res = await api.get("/usuarios/me");
            setUsuario(res.data);
          } catch {
            console.warn("No se pudo obtener el usuario logueado");
          }
        };
        if (rutasOcultas.includes(pathname)){
        fetchUser();}
      }, []);
  
    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading ? (
              <LoadingScreen key="loading" />
            ) : (
                <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="bg-grisFondo text-white font-sans min-h-screen flex flex-col"
                >
<header
  style={{
    position: "fixed",          // se mantiene fija arriba
    top: 0,
    left: 0,
    width: "100%",
    background: "rgba(20, 20, 20, 0.6)", // gris oscuro semitransparente
    backdropFilter: "blur(20px) saturate(140%)",
    WebkitBackdropFilter: "blur(20px) saturate(140%)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    padding: "1rem 2rem",
    zIndex: 1000,
  }}
>      {/* 🔹 Contenedor principal */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/home"
          className="text-xl font-bold tracking-wide flex items-center gap-2"
          >
             <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-[0_0_20px_#ff000033]">
          <Image src={image}  alt="image"/></div> <span className="hidden sm:inline">ABOGADOS EN ACCIÓN</span>
        </Link>
     { rutasOcultas.includes(pathname)? (<></>) : (<>
           
        {/* 🔹 Botón de menú (solo mobile) */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="sm:hidden p-2 focus:outline-none"
        >
          {menuAbierto ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* 🔹 Navegación desktop */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/home" className="hover:text-rojo font-medium">
            Inicio
          </Link>
          <Link href="/evaluaciones" className="hover:text-rojo font-medium">
            Mis Evaluaciones
          </Link>
          <Link href="/perfil" className="hover:text-rojo font-medium">
            Perfil
          </Link>
        </nav>
        </>)}
      </div>

      {/* 🔹 Menú desplegable mobile */}
      {menuAbierto && (
        <div className="absolute top-full left-0 w-full bg-black border-t border-gray-800 mt-2 p-4 sm:hidden z-40 rounded-b-2xl shadow-lg shadow-black/40 backdrop-blur-sm">
          <nav className="flex flex-col gap-3">
            <Link
              href="/home"
              className="hover:text-rojo font-medium"
              onClick={() => setMenuAbierto(false)}
            >
              Inicio
            </Link>
            <Link
              href="/evaluaciones"
              className="hover:text-rojo font-medium"
              onClick={() => setMenuAbierto(false)}
            >
              Mis Evaluaciones
            </Link>
            <Link
              href="/perfil"
              className="hover:text-rojo font-medium"
              onClick={() => setMenuAbierto(false)}
            >
              Perfil
            </Link>

            <div className="flex items-center gap-2 border-t border-gray-700 pt-3 mt-2">
              <UserCircle2 className="w-5 h-5 text-gray-300" />
              {usuario ? (
                <span className="text-sm text-gray-300">
                  Hola,{" "}
                  <span className="text-white font-semibold">
                    {usuario.nombre} {usuario.apellido}
                  </span>
                </span>
              ) : (
                  <span className="text-sm text-gray-500 italic">Cargando...</span>
                )}
                
                </div>
                </nav>
                </div>
            )}
    </header>
  
              <main className="flex-1">{children}</main>
  
              <footer className="bg-gray-900 p-3 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Abogados en Acción. Todos los derechos reservados.
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }