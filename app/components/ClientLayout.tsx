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
      const fetchUser = async () => {
        try {
          const res = await api.get("/usuarios/me");
          setUsuario(res.data);
        } catch {
          console.warn("No se pudo obtener el usuario logueado");
        } finally {
           // Asegúrate de que el loading termine después del fetch
           setIsLoading(false);
        }
      };
      // Si estás en una ruta oculta, terminamos el loading rápido
      if (rutasOcultas.includes(pathname)){
          setIsLoading(false);
      } else {
          // Solo si no estamos en rutas de auth, hacemos el fetch
          fetchUser();
      }
    }, [pathname]); // Depende de pathname para cargar usuario al navegar

  // Simulamos un tiempo de carga mínimo para el efecto visual si no hay fetch
  useEffect(() => {
      if (isLoading && rutasOcultas.includes(pathname)) {
          const timer = setTimeout(() => setIsLoading(false), 500); // Carga mínima rápida
          return () => clearTimeout(timer);
      }
  }, [isLoading, pathname]);

  return (
    <>
      {/* 1. CAPA DE IMAGEN (Viewport Fix) */}
      <div className="background-image-layer" /> 
      
      {/* 2. CAPA DE FILTROS (Viewport Fix) */}
      <div className="filter-layer" /> 

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
                  {/* Header y resto del contenido */}
                  {/* ... (El resto del código del header) ... */}
                  
                  <header
                      style={{
                          position: "fixed",          
                          top: 0,
                          left: 0,
                          width: "100%",
                          background: "rgba(20, 20, 20, 0.6)", 
                          backdropFilter: "blur(20px) saturate(140%)",
                          WebkitBackdropFilter: "blur(20px) saturate(140%)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          padding: "1rem 2rem",
                          zIndex: 1000,
                      }}
                  >
                      {/* Contenido del header */}
                  </header>

                  {/* 🚀 IMPORTANTE: Añadir padding top para el header fijo */}
                  <main className="flex-1 pt-24 sm:pt-28">{children}</main> 

                  <footer className="bg-gray-900 p-3 text-center text-sm text-gray-400">
                      © {new Date().getFullYear()} Abogados en Acción. Todos los derechos reservados.
                  </footer>
              </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}