"use client";

import { useLoading } from "./LoadingContext";

export function useHrefLoader() {
  const { showLoader } = useLoading();

  return {
    onClick: () => {
      showLoader("Probando pantalla de carga…");
      
      // 👇 fuerza visibilidad
      setTimeout(() => {}, 2000);
    },
  };
}
