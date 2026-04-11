"use client";

import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

// Rutas que requieren sesión real (no invitado)
const AUTH_ONLY_ROUTES = ["/mis-evaluaciones", "/perfil"];

// Rutas que NO requieren ni login ni invitado
const PUBLIC_ROUTES = ["/login", "/register", "/verify-token", "/privacyPolicy"];

export function isGuestMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("guest_mode=1");
}

export function setGuestMode() {
  document.cookie = "guest_mode=1; Path=/; Max-Age=86400; SameSite=Lax";
}

export function clearGuestMode() {
  document.cookie = "guest_mode=; Path=/; Max-Age=0";
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("auth_token");
    const guest = isGuestMode();

    // Rutas públicas siempre permitidas
    if (PUBLIC_ROUTES.includes(pathname)) return;

    // Rutas que requieren login real (no invitado)
    if (AUTH_ONLY_ROUTES.includes(pathname) || pathname.startsWith("/votar")) {
      if (!token) {
        router.replace("/login");
        return;
      }
    }

    // Resto de rutas: permitir si tiene token O es invitado
    if (!token && !guest) {
      router.replace("/login");
    }
  }, [pathname]);

  return <>{children}</>;
}
