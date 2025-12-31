"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import logo from "../../public/dataJury1.png";
import RouteLoader from "./RouteLoader";
import { useLoading } from "./LoadingContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const { showLoader, hideLoader } = useLoading();

  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  /* ===============================
     Detectar sesión (una sola vez)
     =============================== */
  useEffect(() => {
    const token = getCookie("auth_token");
    setIsLogged(!!token);
  }, []);

  /* ===============================
     Apagar loader al cambiar ruta
     =============================== */
  useEffect(() => {
    hideLoader();
  }, [pathname, hideLoader]);

  /* ===============================
     Navegación centralizada
     =============================== */
  const navigate = (href: string) => {
    // Evita loop infinito (ej: click en logo estando en "/")
    if (href === pathname) return;

    showLoader();

    startTransition(() => {
      router.push(href);
    });
  };

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Mis evaluaciones", href: "/mis-evaluaciones" },
    { label: "Mi perfil", href: "/perfil" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-blue-90 text-gray-900 relative">
      {/* ================= LOADER GLOBAL ================= */}
      <RouteLoader />

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/90 border-b border-gray-300/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hover:opacity-80 transition"
          >
            <Image
              src={logo}
              alt="Data Jury"
              width={110}
              height={50}
              priority
            />
          </button>

          {/* DESKTOP NAV */}
          {isLogged && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => navigate(item.href)}
                    className={`
                      px-3 py-1 rounded-md transition
                      ${
                        active
                          ? "text-blue-600 bg-blue-100"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  showLoader();
                  window.location.href = "/logout";
                }}
                className="
                  px-3 py-1 rounded-md border font-semibold
                  text-red-600 border-red-500
                  hover:bg-red-50 transition
                  flex items-center gap-1
                "
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </nav>
          )}

          {/* MOBILE TOGGLE */}
          {isLogged && (
            <button
              type="button"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </button>
          )}
        </div>

        {/* ================= MOBILE NAV ================= */}
        {isLogged && open && (
          <div className="md:hidden bg-white/95 px-6 pb-4 space-y-3 border-t">
            {navItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(item.href);
                }}
                className="
                  block w-full text-left py-2 text-lg font-semibold
                  rounded-md px-3 hover:bg-gray-100
                "
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ================= MAIN ================= */}
      <main
        className="px-6 max-w-6xl mx-auto"
        style={{ paddingTop: "7rem" }}
      >
        {children}
      </main>
    </div>
  );
}
