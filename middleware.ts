import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookie } from "cookies-next";

export function middleware(req: NextRequest) {
  const token = getCookie("auth_token")
  const { pathname } = req.nextUrl;

  // ❗ Rutas públicas: NO requieren token
  const publicRoutes = ["/login", "/register", "/verify-token"];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // ❗ Si NO es pública y NO hay token → redirigir a login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 🧠 El matcher aplica el middleware a TODAS las rutas excepto archivos del sistema
export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|assets|api).*)",
  ],
};
