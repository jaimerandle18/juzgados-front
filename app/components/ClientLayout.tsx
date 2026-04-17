"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import logo from "../../public/dataJury1.png";
import GlobalLoadingScreen from "./GlobalLoadingScreen";
import SplashScreen from "./SplashScreen";
import UserAvatarMenu from "./UserAvatarMenu";
import { hideLoader, showLoader } from "./globalLoader";
import NativeGestures from "./NativeGestures";
import { Capacitor } from "@capacitor/core";
import { isGuestMode, clearGuestMode } from "../utils/AuthGuard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bootSplash, setBootSplash] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Splash de arranque: se muestra una sola vez por sesión, al abrir la app,
  // antes de cualquier pantalla (login, registro o home).
  useEffect(() => {
    try {
      const shown = sessionStorage.getItem("dj_boot_splash_shown");
      if (!shown) setBootSplash(true);
    } catch {
      setBootSplash(true);
    }
  }, []);

  const onBootSplashDone = useCallback(() => {
    try { sessionStorage.setItem("dj_boot_splash_shown", "1"); } catch {}
    setBootSplash(false);
  }, []);

  // Cerrar menú mobile al tocar fuera del header
  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium");
    document.documentElement.classList.toggle("is-safari", isSafari);
    if (Capacitor.isNativePlatform()) {
      document.documentElement.classList.add("is-native-app");
    }
  }, []);

  useEffect(() => {
    const token = getCookie("auth_token");
    const logged = typeof token === "string" && token.length > 0;
    setIsLogged(logged);
    setIsGuest(!logged && isGuestMode());
    try {
      setIsAdmin(logged && localStorage.getItem("es_admin") === "1");
    } catch {
      setIsAdmin(false);
    }
  }, [pathname]);

  useEffect(() => {
    hideLoader();
  }, [pathname]);

  // Al cambiar de ruta, arrancar siempre desde arriba (no heredar el
  // scroll de la página anterior). Sin smooth para que no se vea el
  // "salto" en pantalla al navegar.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Items principales del nav. "Mi perfil" y "Mis evaluaciones" viven
  // en el dropdown del avatar, no en la nav principal.
  const allNavItems = [
    { label: "Inicio", href: "/", guestVisible: true },
    { label: "Rankings", href: "/rankings", guestVisible: true },
    { label: "Recorrido", href: "/recorrido", guestVisible: true },
  ];

  // Los mismos items que están en el dropdown, también los mostramos
  // en el menú mobile (porque ahí no hay avatar).
  const mobileExtraItems = [
    { label: "Mis evaluaciones", href: "/mis-evaluaciones" },
    { label: "Mi perfil", href: "/perfil" },
  ];

  const adminMobileItems = [
    { label: "Estadísticas", href: "/admin/stats" },
    { label: "Usuarios", href: "/admin/usuarios" },
    { label: "Acciones", href: "/admin/acciones" },
  ];

  const navItems = isGuest
    ? allNavItems.filter((item) => item.guestVisible)
    : allNavItems;

  const showNav = isLogged || isGuest;

  const logoutWithLoader = () => {
    showLoader("Cerrando sesión…");
    clearGuestMode();
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.location.href = "/logout";
      }, 50);
    });
  };

  const exitGuest = () => {
    clearGuestMode();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen text-gray-900 relative z-0">
      <AnimatePresence>
        {bootSplash && <SplashScreen onDone={onBootSplashDone} />}
      </AnimatePresence>

      {/* ✅ Este deco SIEMPRE atrás */}
      <div className="pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_30%_20%,rgba(0,140,255,0.18),transparent_60%)]" />

      <header
        ref={headerRef}
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
            <Link
              href="/"
              onClick={() => {
                if (pathname !== "/") showLoader();
              }}
              className="hover:opacity-80 transition block"
            >
              <Image
                src={logo}
                alt="Data Jury"
                priority
                width={110}
                height={50}
                style={{ objectFit: "contain", display: "block" }}
              />
            </Link>

            {showNav && (
              <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        if (!active) showLoader();
                      }}
                      className={`px-3 py-1 rounded-md transition ${
                        active ? "text-blue-600 bg-blue-100 shadow-sm" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {isGuest ? (
                  <button
                    onClick={exitGuest}
                    className="px-3 py-1 rounded-md border font-semibold text-blue-600 border-blue-500 hover:bg-blue-50 transition flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Iniciar sesión
                  </button>
                ) : (
                  <UserAvatarMenu />
                )}
              </nav>
            )}

            {showNav && (
              <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)}>
                {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            )}
          </div>

          {showNav && open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white/95 px-6 pb-4 space-y-3 border-t border-gray-200/70 backdrop-blur-xl"
              style={{
                WebkitBackdropFilter: "blur(20px)",
                backdropFilter: "blur(20px)",
              }}
            >
              {[...navItems, ...(!isGuest ? mobileExtraItems : [])].map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      if (!active) showLoader();
                    }}
                    className={`block py-2 text-lg font-semibold rounded-md px-3 transition ${
                      active ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {isAdmin && (
                <>
                  <div className="pt-2 mt-2 border-t border-gray-200/70">
                    <p className="px-3 pb-1 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                      Admin
                    </p>
                  </div>
                  {adminMobileItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setOpen(false);
                          if (!active) showLoader();
                        }}
                        className={`block py-2 text-lg font-semibold rounded-md px-3 transition ${
                          active ? "bg-blue-100 text-blue-700" : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              )}

              {isGuest ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    exitGuest();
                  }}
                  className="px-3 py-1 rounded-md border font-semibold text-blue-600 border-blue-500 hover:bg-blue-50 transition flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Iniciar sesión
                </button>
              ) : (
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
              )}
            </motion.div>
          )}
        </div>
      </header>

      <main className="px-6 max-w-6xl mx-auto relative z-10" style={{ paddingTop: "calc(7rem + env(safe-area-inset-top, 0px))" }}>
        <GlobalLoadingScreen />
        <NativeGestures edgeZonePx={30} />
        {children}
      </main>
    </div>
  );
}
