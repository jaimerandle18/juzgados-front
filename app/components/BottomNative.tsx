"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export default function BottomNavNative() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const isNative = useMemo(() => Capacitor.isNativePlatform(), []);
  const isIOSApp = useMemo(() => isNative && Capacitor.getPlatform() === "ios", [isNative]);

  useEffect(() => {
    if (!isNative) return;

    // Estimación simple usando history length + popstate.
    // Back: si history length > 1 casi seguro se puede.
    const update = () => {
      setCanGoBack(window.history.length > 1);
      // Forward: no hay API directa; lo dejamos "optimista"
      // y lo deshabilitamos si no querés confusion.
      setCanGoForward(true);
    };

    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [pathname, isNative]);

  // Mostrala solo en iOS app (cambiá a isNative si la querés en Android también)
  if (!isIOSApp) return null;

  const goBack = () => router.back();
  const goForward = () => window.history.forward();
  const goHome = () => router.push("/");
  const refresh = () => window.location.reload();

  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-[99999] border-t border-white/60 bg-white/85 backdrop-blur-md"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
      }}
    >
      <div className="mx-auto max-w-xl px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="rounded-xl py-2 text-sm font-semibold disabled:opacity-40"
          >
            ◀︎ Atrás
          </button>

          <button
            onClick={goForward}
            disabled={!canGoForward}
            className="rounded-xl py-2 text-sm font-semibold disabled:opacity-40"
          >
            Adelante ▶︎
          </button>

          <button
            onClick={goHome}
            className="rounded-xl py-2 text-sm font-semibold"
          >
            ⌂ Inicio
          </button>

          <button
            onClick={refresh}
            className="rounded-xl py-2 text-sm font-semibold"
          >
            ↻ Recargar
          </button>
        </div>
      </div>
    </nav>
  );
}
