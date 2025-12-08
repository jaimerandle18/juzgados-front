"use client";

import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Rutas que NO requieren login
  const publicRoutes = ["/login", "/register", "/verify-token"];

  useEffect(() => {
    const token = getCookie("auth_token");

    // Si estoy en una ruta pública → siempre permitir
    if (publicRoutes.includes(pathname)) return;

    // Si estoy en ruta protegida y NO tengo token → ir a login
    if (!token) {
      router.replace("/login");
    }
  }, [pathname]);

  return <>{children}</>;
}
