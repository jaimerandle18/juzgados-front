"use client";

import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { showLoader } from "../components/globalLoader";

// Rutas que requieren sesión real (no invitado)
const AUTH_ONLY_ROUTES = ["/mis-evaluaciones", "/perfil"];

// Rutas que NO requieren ni login ni invitado
const PUBLIC_ROUTES = ["/login", "/register", "/verify-token", "/privacyPolicy"];

export function isGuestMode(): boolean {
  if (typeof document === "undefined") return false;
  // Solo es invitado si tiene guest_mode Y NO tiene auth_token
  return document.cookie.includes("guest_mode=1") && !document.cookie.includes("auth_token=");
}

export function setGuestMode() {
  document.cookie = "guest_mode=1; Path=/; Max-Age=86400; SameSite=Lax";
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${baseUrl}/metrics/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function clearGuestMode() {
  document.cookie = "guest_mode=; Path=/; Max-Age=0";
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // En cada boot fresco de la app, limpiar guest_mode para que el
    // usuario vuelva a pasar por el login. Se detecta con un flag en
    // sessionStorage (que se resetea al cerrar/reabrir la app).
    try {
      if (!sessionStorage.getItem("dj_session_started")) {
        clearGuestMode();
        sessionStorage.setItem("dj_session_started", "1");
      }
    } catch {}

    const token = getCookie("auth_token");
    const guest = isGuestMode();

    // Rutas públicas siempre permitidas
    if (PUBLIC_ROUTES.includes(pathname)) return;

    // Rutas de admin: requieren token + flag es_admin en localStorage
    if (pathname.startsWith("/admin")) {
      if (!token) {
        showLoader();
        router.replace("/login");
        return;
      }
      let isAdmin = false;
      try {
        isAdmin = localStorage.getItem("es_admin") === "1";
      } catch {}
      if (!isAdmin) {
        showLoader();
        router.replace("/");
        return;
      }
      return;
    }

    // Rutas que requieren login real (no invitado)
    if (AUTH_ONLY_ROUTES.includes(pathname) || pathname.startsWith("/votar")) {
      if (!token) {
        showLoader();
        router.replace("/login");
        return;
      }
    }

    // Resto de rutas: permitir si tiene token O es invitado
    if (!token && !guest) {
      showLoader();
      router.replace("/login");
    }
  }, [pathname]);

  return <>{children}</>;
}
