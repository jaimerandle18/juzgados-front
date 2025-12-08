"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Rutas que NO requieren autenticación
  const publicRoutes = ["/login", "/register", "/verify-token"];

  useEffect(() => {
    const token =  sessionStorage.getItem("auth_token")

    // Si estoy en una ruta pública → no hago nada
    if (publicRoutes.includes(pathname)) return;

    // Si NO tengo token → redirijo a login
    if (!token) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
