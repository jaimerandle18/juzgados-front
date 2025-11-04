import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.clone();

  // rutas públicas
  const publicPaths = ["/login", "/register", "/verify-token","/","/home"];

  // si no hay token y la ruta no es pública, redirige a /login
  if (!token && !publicPaths.some((path) => url.pathname.startsWith(path))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // si hay token y entra al login o register, redirige al home
  if (token && ["/login", "/register"].includes(url.pathname)) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
