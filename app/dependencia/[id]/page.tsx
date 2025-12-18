import { cookies } from "next/headers";
import DependenciaView from "@/votar/[id]/DependenciaView";

export default async function Page({ params }: any) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pjn/dependencias/${id}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  if (!res.ok) {
    console.error("Error en backend:", await res.text());
    throw new Error("Falló la API");
  }

  const data = await res.json();

  return <DependenciaView data={data} />;
}
