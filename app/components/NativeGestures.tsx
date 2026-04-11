"use client";

import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { forceHideLoader } from "./globalLoader";

type Options = {
  swipeThresholdPx?: number;
  verticalTolerancePx?: number;
  edgeZonePx?: number; // ancho de la zona del borde para iniciar swipe
};

export default function NativeGestures({
  swipeThresholdPx = 50,
  verticalTolerancePx = 60,
  edgeZonePx = 30,
}: Options) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startedFromLeftEdge = useRef(false);
  const startedFromRightEdge = useRef(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backSub = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        forceHideLoader();
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX.current = t.clientX;
      startY.current = t.clientY;
      // Guardamos si el touch empezó desde un borde
      startedFromLeftEdge.current = t.clientX <= edgeZonePx;
      startedFromRightEdge.current = window.innerWidth - t.clientX <= edgeZonePx;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (startX.current == null || startY.current == null) return;
      if (e.changedTouches.length !== 1) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      const fromLeft = startedFromLeftEdge.current;
      const fromRight = startedFromRightEdge.current;

      startX.current = null;
      startY.current = null;
      startedFromLeftEdge.current = false;
      startedFromRightEdge.current = false;

      // Evitar que un scroll vertical dispare navegación
      if (Math.abs(dy) > verticalTolerancePx) return;

      // Swipe → (derecha) desde borde izquierdo: volver
      if (dx > swipeThresholdPx && fromLeft) {
        forceHideLoader();
        window.history.back();
      }
      // Swipe ← (izquierda) desde borde derecho: adelante
      else if (dx < -swipeThresholdPx && fromRight) {
        forceHideLoader();
        window.history.forward();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      backSub.remove();
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [swipeThresholdPx, verticalTolerancePx, edgeZonePx]);

  return null;
}
