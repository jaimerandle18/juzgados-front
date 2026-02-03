"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import logo from "../../public/dataJury1.png";
import GlobalLoadingScreen from "./GlobalLoadingScreen";
import { hideLoader, showLoader } from "./globalLoader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // ✅ Detectar Safari (desktop + iOS)
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium");
    document.documentElement.classList.toggle("is-safari", isSafari);
  }, []);

  useEffect(() => {
    const token = getCookie("auth_token");
    setIsLogged(typeof token === "string" && token.length > 0);
  }, [pathname]);

  useEffect(() => {
    hideLoader();
  }, [pathname]);

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Mis evaluaciones", href: "/mis-evaluaciones" },
    { label: "Mi perfil", href: "/perfil" },
  ];

  const logoutWithLoader = () => {
    showLoader("Cerrando sesión…");
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.location.href = "/logout";
      }, 50);
    });
  };

  return (
    <div className="min-h-screen text-gray-900 relative z-0">
      {/* ✅ Este deco SIEMPRE atrás */}
      <div className="pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_30%_20%,rgba(0,140,255,0.18),transparent_60%)]" />

      <header
        className="fixed top-0 left-0 w-full z-[9999]"
        style={{
          transform: "translate3d(0,0,0)",
          WebkitTransform: "translate3d(0,0,0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div
          className="
            relative bg-white/90
            border-b border-gray-300/50
            shadow-[0_8px_20px_rgba(0,0,0,0.05)]
            backdrop-blur-xl
          "
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
            WebkitBackdropFilter: "blur(24px)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="absolute bottom-[-20px] left-0 w-full h-[20px] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="hover:opacity-80 transition block">
              <Image
                src={logo}
                alt="Data Jury"
                priority
                width={110}
                height={50}
                style={{ objectFit: "contain", display: "block" }}
              />
            </Link>

            {isLogged && (
              <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-1 rounded-md transition ${
                        active ? "text-blue-600 bg-blue-100 shadow-sm" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={logoutWithLoader}
                  className="px-3 py-1 rounded-md border font-semibold text-red-600 border-red-500 hover:bg-red-50 transition flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </nav>
            )}

            {isLogged && (
              <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
                {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            )}
          </div>

          {isLogged && open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white/95 px-6 pb-4 space-y-3 border-t border-gray-200/70 backdrop-blur-xl"
              style={{
                WebkitBackdropFilter: "blur(20px)",
                backdropFilter: "blur(20px)",
              }}
            >
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block py-2 text-lg font-semibold rounded-md px-3 transition ${
                      active ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setOpen(false);
                  logoutWithLoader();
                }}
                className="px-3 py-1 rounded-md border font-semibold text-red-600 border-red-500 hover:bg-red-50 transition flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="px-6 max-w-6xl mx-auto relative z-10" style={{ paddingTop: "calc(7rem + env(safe-area-inset-top, 0px))" }}>
        <GlobalLoadingScreen />
        {children}
      </main>
    </div>
  );
}
