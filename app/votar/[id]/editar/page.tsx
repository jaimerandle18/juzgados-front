
import EditarForm from "./EditarForm";

export default async function Page({ params }: any) {
  const { id } = await params;

  const token =  sessionStorage.getItem("auth_token")

  // Traemos la dependencia + miVoto
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/dependencias/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Backend error:", await res.text());
    throw new Error("Error cargando datos");
  }

  const data = await res.json();

  if (!data.miVoto) {
    // Usuario ingresó directo pero nunca votó → lo mandamos al formulario nuevo
    return (
      <div className="pt-20 text-center">
        <h1 className="text-xl font-semibold text-red-600">Todavía no votaste esta dependencia</h1>
        <a href={`/votar/${id}`} className="text-blue-600 underline mt-4 block">Ir a votar</a>
      </div>
    );
  }

  return <EditarForm id={id} miVoto={data.miVoto} />;
}
