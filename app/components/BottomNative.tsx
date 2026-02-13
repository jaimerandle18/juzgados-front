"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { forceHideLoader } from "./globalLoader";

const HIDE_ON: (string | RegExp)[] = [
  "/login",
  "/registry",
  /^\/login\/?/,
  /^\/registry\/?/,
];

function shouldHide(pathname: string) {
  return HIDE_ON.some((r) =>
    typeof r === "string" ? pathname === r : r.test(pathname)
  );
}

export default function BottomNavNative() {
  const pathname = usePathname();

  const isNativeApp = useMemo(
    () => Capacitor.isNativePlatform(),
    []
  );

  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (!isNativeApp) return;

    const update = () => setCanGoBack(window.history.length > 1);
    update();

    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [pathname, isNativeApp]);

  if (!isNativeApp) return null;
  if (shouldHide(pathname)) return null;

  // 🔥 BACK FIX DEFINITIVO
  const goHome = () => {
    forceHideLoader();
    window.location.replace("/");
  };
  
  const goBack = () => {
    forceHideLoader();
    if (window.history.length <= 2) goHome();
    else window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

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
      {/* 👇 ALTURA REDUCIDA ~40% */}
      <div className="mx-auto max-w-xl px-3 py-1">
        <div className="grid grid-cols-3 items-center">
          {/* BACK */}
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="flex items-center justify-center rounded-xl py-1 text-lg font-semibold disabled:opacity-30 active:scale-[0.96]"
          >
            ‹
          </button>

          {/* HOME */}
          <button
            onClick={goHome}
            className="flex items-center justify-center rounded-xl py-1 text-lg font-semibold active:scale-[0.96]"
          >
            ⌂
          </button>

          {/* FORWARD */}
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
