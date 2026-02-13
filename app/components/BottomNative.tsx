"use client";

import { useMemo, useState, useEffect } from "react";
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

    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [isNativeApp, pathname]);

  if (!isNativeApp) return null;
  if (shouldHide(pathname)) return null;

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
  
    // ✅ evita que el loader SPA quede colgado
    window.location.assign("/");
  };
  
  const goHome = () => router.push("/");

  const goForward = () => {
    // no siempre hay “forward”, pero no rompe
    window.history.forward();
  };

  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-[99999] border-t border-white/40 bg-white/45 backdrop-blur-xl"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)", // ✅ pegada al borde del celu
        WebkitBackdropFilter: "blur(18px)",
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
      }}
      aria-label="Navegación"
    >
      <div className="mx-auto max-w-xl px-4 py-2">
        <div className="grid grid-cols-3 items-center">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="flex items-center justify-center rounded-xl py-3 text-2xl font-semibold disabled:opacity-35 active:scale-[0.98]"
            aria-label="Volver atrás"
          >
            ‹
          </button>

          <button
            onClick={goHome}
            className="flex items-center justify-center rounded-xl py-3 text-2xl font-semibold active:scale-[0.98]"
            aria-label="Inicio"
          >
            ⌂
          </button>

          <button
            onClick={goForward}
            className="flex items-center justify-center rounded-xl py-3 text-2xl font-semibold active:scale-[0.98]"
            aria-label="Ir hacia adelante"
          >
            ›
          </button>
        </div>
      </div>
    </nav>
  );
}
