import AnchorWithLoader from "@/components/AnchorWithLoader";
import StarRating from "@/components/StarRating";

export default async function Page({ params }: { params: Promise<{ fueroId: string }> }) {
    const { fueroId } = await params;
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/juzgados`, {
      cache: "no-store",
    });
  
    const juzgados = await res.json();
  
    const juzgadosOnly = juzgados.filter((t: any) =>
      t.nombre.toLowerCase().includes("juzgado")
    );
    return (
      <main className="pt-10 pb-20 px-6 max-w-4xl mx-auto text-gray-900">
  
        {/* TÍTULO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Juzgados</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />

        </div>
  
        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2">
        {juzgadosOnly.map((j: any) => (
  <AnchorWithLoader
    key={j.id}
    href={`/dependencia/${j.id}`}
    loadingMessage="Cargando detalle..."
    className="
      block p-6 rounded-2xl bg-white/70 backdrop-blur-lg
      border border-gray-200 shadow-md hover:shadow-xl
      hover:-translate-y-1 transition-all cursor-pointer group
    "
  >
    <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
      {j.nombre}
    </h3>

    <div className="mt-2">
      <StarRating
        value={j.promedio}
        cantidad={j.cantidad_votos}
        tintedByValue
      />
    </div>

    {j.domicilio && <p className="mt-3 text-gray-700">{j.domicilio}</p>}
    {j.localidad && <p className="text-gray-700">{j.localidad}</p>}

    <p className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
      Ver detalle →
    </p>
  </AnchorWithLoader>
))}
        </div>
      </main>
    );
  }
