export default async function Page({ params }: { params: Promise<{ fueroId: string }> }) {
    const { fueroId } = await params;
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/juzgados`, {
      cache: "no-store",
    });
  
    const juzgados = await res.json();
  
    return (
      <main className="pt-10 pb-20 px-6 max-w-4xl mx-auto text-gray-900">
  
        {/* TÍTULO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Juzgados</h1>
          <div className="mx-auto mt-3 h-[3px] w-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
        </div>
  
        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2">
          {juzgados.map((j: any) => (
            <a
              key={j.id}
              href={`/dependencia/${j.id}`}
              className="
                block p-6 rounded-2xl bg-white/70 backdrop-blur-lg
                border border-gray-200 shadow-md hover:shadow-xl
                hover:-translate-y-1 transition-all cursor-pointer group
              "
            >
              <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {j.nombre}
              </h3>
  
              {/* ⭐ PROMEDIO + CANTIDAD */}
              <StarRating promedio={j.promedio} cantidad={j.cantidad_votos} />
  
              {j.domicilio && (
                <p className="mt-3 text-gray-700">{j.domicilio}</p>
              )}
  
              {j.localidad && (
                <p className="text-gray-700">{j.localidad}</p>
              )}
  
              <p className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
                Ver detalle →
              </p>
            </a>
          ))}
        </div>
      </main>
    );
  }
  
  // STAR RATING
  function StarRating({ promedio = 0, cantidad = 0 }) {
    const safePromedio = Number(promedio) || 0;  // evita undefined, null o NaN
  
    const filled = Math.round(safePromedio);
  
    return (
      <div className="flex items-center gap-1">
        {/* ESTRELLAS */}
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`text-lg ${n <= filled ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
  
        {/* PROMEDIO NUMÉRICO */}
        <span className="text-sm font-semibold text-gray-800">
          {safePromedio.toFixed(1)}
        </span>
  
        {/* CANTIDAD */}
        <span className="text-xs text-gray-500">
          ({cantidad})
        </span>
      </div>
    );
  }
  