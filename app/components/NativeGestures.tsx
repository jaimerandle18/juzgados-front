"use client";

import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

type Options = {
  swipeThresholdPx?: number; // mínimo desplazamiento horizontal
  verticalTolerancePx?: number; // cuánto toleramos en vertical
  edgeOnlyPx?: number; // si querés que el gesto sea sólo desde el borde (0 = en cualquier lado)
};

export default function NativeGestures({
  swipeThresholdPx = 60,
  verticalTolerancePx = 40,
  edgeOnlyPx = 0, // poné 24 si querés solo desde el borde izquierdo/derecho
}: Options) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Android back button (ya lo tenías) — OJO: iOS no dispara esto.
    const backSub = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else App.exitApp();
    });

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX.current = t.clientX;
      startY.current = t.clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (startX.current == null || startY.current == null) return;
      if (e.changedTouches.length !== 1) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;

      startX.current = null;
      startY.current = null;

      // Evitar que un scroll vertical dispare navegación
      if (Math.abs(dy) > verticalTolerancePx) return;

      // Si querés gesto solo desde bordes:
      if (edgeOnlyPx > 0) {
        const fromLeftEdge = (t.clientX <= edgeOnlyPx);
        const fromRightEdge = (window.innerWidth - t.clientX <= edgeOnlyPx);
        // Swipe derecha = back, swipe izquierda = forward
        if (dx > 0 && !fromLeftEdge) return;
        if (dx < 0 && !fromRightEdge) return;
      }

      if (dx > swipeThresholdPx) {
        // Swipe → (derecha): volver
        window.history.back();
      } else if (dx < -swipeThresholdPx) {
        // Swipe ← (izquierda): adelante
        window.history.forward();
      }
    };

    // passive true para no bloquear scroll
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      backSub.remove();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [swipeThresholdPx, verticalTolerancePx, edgeOnlyPx]);

  return null;
}
