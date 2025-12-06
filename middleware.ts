import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas públicas (NO requieren login)
  const publicRoutes = ["/login", "/verify-token", "/register"];

  // Si la ruta actual es pública → permitir
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Leer cookie del usuario
  const token = req.cookies.get("auth_token")?.value;

  // Si NO hay token → redirigir a /login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Caso normal: permitir acceso
  return NextResponse.next();
}

// Indicar qué rutas usa el middleware
export const config = {
  matcher: [
    /*
      Cubre todas las rutas excepto assets estáticos
      (imágenes, JS, CSS, fuentes, etc.)
    */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
