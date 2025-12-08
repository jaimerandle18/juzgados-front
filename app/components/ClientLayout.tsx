"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../public/dataJury1.png";
import RouteLoader from "./RouteLoader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Si existe cookie auth_token → está logueado
    const token = sessionStorage.getItem("auth_token")
    setIsLogged(!!token);
  }, []);
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("auth_token");
      setIsLogged(!!token);
    };
  
    // Cada 500ms chequea si la cookie cambió
    const interval = setInterval(checkAuth, 500);
  
    return () => clearInterval(interval);
  }, []);
  

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Mis evaluaciones", href: "/mis-evaluaciones" },
    { label: "Mi perfil", href: "/perfil" },
  ];

  return (
    <div 
      className="
        min-h-screen 
        bg-gradient-to-br from-gray-100 via-white to-blue-90 
        text-gray-900 
        relative
      "
    >

      {/* Background deco */}
      <div 
        className="
          pointer-events-none absolute inset-0 
          bg-[radial-gradient(circle_at_30%_20%,rgba(0,140,255,0.18),transparent_60%)]
        "
      />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div 
          className="
            backdrop-blur-xl bg-white/70 
            border-b border-gray-300/50 
            shadow-[0_8px_20px_rgba(0,0,0,0.05)]
            relative
          "
        >

          {/* Subtle gradient bottom */}
          <div 
            className="
              absolute bottom-[-20px] left-0 w-full h-[20px] 
              bg-gradient-to-b from-white/60 to-transparent
              pointer-events-none
            "
          />

          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* LOGO */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/" className="hover:opacity-80 transition block">
                <Image 
                  src={logo} 
                  alt="Data Jury" 
                  priority 
                  width={110}
                  height={50}
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </motion.div>

            {/* ===========================
                DESKTOP NAV (solo si logueado)
               =========================== */}
            {isLogged && (
              <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        px-3 py-1 rounded-md transition
                        ${
                          active
                            ? "text-blue-600 bg-blue-100 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Logout Desktop */}
                <Link
                  onClick={() => setOpen(true)}
                  href="/logout"
                  className="
                    px-3 py-1 rounded-md border font-semibold
                    text-red-600 border-red-500
                    hover:bg-red-50 transition
                    flex items-center gap-1
                  "
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </Link>
              </nav>
            )}

            {/* MOBILE TOGGLE (solo logueado) */}
            {isLogged && (
              <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
                {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            )}
          </div>

          {/* ===========================
              MOBILE NAV (solo logueado)
             =========================== */}
          {isLogged && open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                md:hidden bg-white/90 backdrop-blur-xl px-6 pb-4 space-y-3 
                border-t border-gray-200/70
              "
            >
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      block py-2 text-lg font-semibold rounded-md px-3 transition
                      ${
                        active
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-800 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Logout mobile */}
              <Link
                href="/logout"
                onClick={() => setOpen(false)}
                className="
                  block py-2 text-lg font-bold 
                  text-red-600 border border-red-500
                  rounded-md px-3 text-center
                  hover:bg-red-50 transition
                  flex items-center justify-center gap-2
                "
              >
                <LogOut className="w-5 h-5" />
                Cerrar sesión
              </Link>
            </motion.div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-28 px-6 max-w-6xl mx-auto">
      <RouteLoader />
        {children}
      </main>
    </div>
  );
}
