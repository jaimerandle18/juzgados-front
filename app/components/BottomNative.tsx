"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { forceHideLoader } from "./globalLoader";

const HIDE_ON: (string | RegExp)[] = ["/login", "/register", /^\/login\/?/, /^\/registry\/?/];

function shouldHide(pathname: string) {
  return HIDE_ON.some((r) => (typeof r === "string" ? pathname === r : r.test(pathname)));
}

export default function BottomNavNative() {
  const pathname = usePathname();
  const router = useRouter();

  const isNativeApp = useMemo(() => Capacitor.isNativePlatform(), []);
  const [canGoBack, setCanGoBack] = useState(false);

  // lock para evitar doble tap / race -> loader colgado
  const navLock = useRef(false);
  const runNav = (fn: () => void) => {
    if (navLock.current) return;
    navLock.current = true;
    forceHideLoader();
    fn();
    // liberamos lock luego de un ratito; lo importante es evitar doble click rápido en iOS
    setTimeout(() => (navLock.current = false), 350);
  };

  useEffect(() => {
    if (!isNativeApp) return;

    const update = () => setCanGoBack(window.history.length > 1);
    update();

    window.addEventListener("popstate", update);

    // iOS bfcache: cuando vuelve desde cache, popstate a veces no alcanza
    const onPageShow = () => {
      forceHideLoader();
      update();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [isNativeApp]);

  // MUY importante: cada cambio de ruta, apagá loader sí o sí
  useEffect(() => {
    forceHideLoader();
  }, [pathname]);

  if (!isNativeApp) return null;
  if (shouldHide(pathname)) return null;

  const goHome = () => runNav(() => router.replace("/"));

  const goBack = () =>
    runNav(() => {
      // si no hay back real, volvemos a home sin reload
      if (window.history.length <= 2) router.replace("/");
      else router.back();
    });

  const goForward = () => runNav(() => window.history.forward());

  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-[99999] border-t border-white/30 bg-white/35 backdrop-blur-xl"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        WebkitBackdropFilter: "blur(14px)",
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
      }}
      aria-label="Navegación"
    >
      <div className="mx-auto max-w-xl px-3 py-1">
        <div className="grid grid-cols-3 items-center">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="flex items-center justify-center rounded-xl py-1 text-lg font-semibold disabled:opacity-30 active:scale-[0.96]"
          >
            ‹
          </button>

          <button
            onClick={goHome}
            className="flex items-center justify-center rounded-xl py-1 text-lg font-semibold active:scale-[0.96]"
          >
            ⌂
          </button>

          <button
            onClick={goForward}
            className="flex items-center justify-center rounded-xl py-1 text-lg font-semibold active:scale-[0.96]"
          >
            ›
          </button>
        </div>
      </div>
    </nav>
  );
}
