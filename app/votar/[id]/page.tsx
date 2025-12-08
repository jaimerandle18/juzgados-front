
import VotarWrapper from "./VotarWrapper";

export default async function Page({ params }: any) {
  const { id } = await params;

  const token = sessionStorage.getItem("auth_token")

  // Consultamos si ya votó antes
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/dependencias/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Backend error:", await res.text());
    throw new Error("Error cargando dependencia");
  }

  const data = await res.json();

  return <VotarWrapper id={id} miVoto={data.miVoto} dependenciaNombre={data.dependencia?.nombre} />;
}
