"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Activar loading al cambiar de ruta
    setLoading(true);

    // Desactivar después de un pequeño delay
    // (para dejar que la página cargue)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600); // Ajustable

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <LoadingScreen />
    </div>
  );
}
