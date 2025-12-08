import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Eliminar cookie
  const res = NextResponse.redirect(`${url.origin}/login`);
  res.cookies.set("auth_token", "", {
    path: "/",
    expires: new Date(0),
  });
  sessionStorage.clear()

  return res;
}
