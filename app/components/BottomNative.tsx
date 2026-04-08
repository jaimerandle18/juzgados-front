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
  const navStack = useRef<string[]>([]);

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

  // Trackear navegación propia en vez de confiar en history.length
  useEffect(() => {
    if (!isNativeApp) return;

    // Solo agregar si es distinto al último (evitar duplicados por re-render)
    const stack = navStack.current;
    if (stack[stack.length - 1] !== pathname) {
      stack.push(pathname);
    }
    setCanGoBack(stack.length > 1);

    const onPageShow = () => forceHideLoader();
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [isNativeApp, pathname]);

  // MUY importante: cada cambio de ruta, apagá loader sí o sí
  useEffect(() => {
    forceHideLoader();
  }, [pathname]);

  if (!isNativeApp) return null;
  if (shouldHide(pathname)) return null;

  const goHome = () => runNav(() => router.replace("/"));

  const goBack = () =>
    runNav(() => {
      const stack = navStack.current;
      if (stack.length > 1) {
        stack.pop(); // sacamos la actual
        router.back();
        setCanGoBack(stack.length > 1);
      } else {
        router.replace("/");
      }
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
