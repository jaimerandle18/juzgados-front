import { cookies } from "next/headers";

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token ?? ""}` },
    cache: "no-store",
  });

  const text = await res.text();
  return new Response(text, { status: res.status });
}