"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

const HIDE_ON: (string | RegExp)[] = [
  "/login",
  "/registry",
  /^\/login\/?/,
  /^\/registry\/?/,
];

function shouldHide(pathname: string) {
  return HIDE_ON.some((r) => (typeof r === "string" ? pathname === r : r.test(pathname)));
}

export default function BottomNavNative() {
  const router = useRouter();
  const pathname = usePathname();

  const isNativeApp = useMemo(() => Capacitor.isNativePlatform(), []);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (!isNativeApp) return;

    const update = () => setCanGoBack(window.history.length > 1);

    // inicial + cambios de navegación
    update();
    window.addEventListener("popstate", update);

    return () => window.removeEventListener("popstate", update);
  }, [pathname, isNativeApp]);

  if (!isNativeApp) return null;
  if (shouldHide(pathname)) return null;

  const goBack = () => router.back();
  const goHome = () => router.push("/");
  const goForward = () => window.history.forward();

  return (
    <nav
      aria-label="Navegación"
      className="fixed left-0 right-0 z-[99999]"
      style={{
        bottom: "max(10px, env(safe-area-inset-bottom, 0px))", // 👈 más abajo, pegada al safe-area
        pointerEvents: "none", // el wrapper no captura; solo la barra
      }}
    >
      <div className="mx-auto max-w-xl px-4" style={{ pointerEvents: "none" }}>
        <div
          className="mx-auto w-full rounded-2xl border border-white/50 bg-white/35 shadow-xl backdrop-blur-xl"
          style={{
            pointerEvents: "auto",
            WebkitBackdropFilter: "blur(18px)",
            transform: "translate3d(0,0,0)",
            WebkitTransform: "translate3d(0,0,0)",
          }}
        >
          <div className="grid grid-cols-3 items-center px-3 py-2">
            {/* Back */}
            <button
              onClick={goBack}
              disabled={!canGoBack}
              className="flex items-center justify-center rounded-xl py-3 text-xl font-semibold disabled:opacity-35 active:scale-[0.98]"
              aria-label="Volver atrás"
            >
              ‹
            </button>

            {/* Home */}
            <button
              onClick={goHome}
              className="flex items-center justify-center rounded-xl py-3 text-xl font-semibold active:scale-[0.98]"
              aria-label="Ir al inicio"
            >
              ⌂
            </button>

            {/* Forward */}
            <button
              onClick={goForward}
              className="flex items-center justify-center rounded-xl py-3 text-xl font-semibold active:scale-[0.98]"
              aria-label="Ir hacia adelante"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
