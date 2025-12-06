export default async function Page({ params }: { params: Promise<{ fueroId: string }> }) {

    const { fueroId } = await params;
  
    // Obtener el fuero (solo para el título)
    const fueroRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}`, {
      cache: "no-store",
    });
    const fuero = await fueroRes.json();
  
    // Cámara
    const camaraRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/camara`, {
      cache: "no-store",
    });
    const camara = await camaraRes.json();
  
    // Juzgados
    const juzgadosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/juzgados`, {
      cache: "no-store",
    });
    const juzgados = await juzgadosRes.json();
  
    return (
      <main className="pt-10 pb-20 px-6 text-gray-900 max-w-3xl mx-auto">
  
        {/* TÍTULO DEL FUERO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {fuero?.nombre ?? "Fuero"}
          </h1>
  
          <div className="mx-auto mt-3 h-[3px] w-28 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
        </div>
  
        {/* GRID */}
        <div className="grid gap-6">
  
          {/* CARD CÁMARA */}
          {camara && (
            <a
              href={`/dependencia/${camara.id}`}
              className="
                block p-6 rounded-2xl 
                bg-white/70 backdrop-blur-lg 
                border border-gray-200 
                shadow-md hover:shadow-xl 
                hover:-translate-y-1 
                transition-all group
              "
            >
              <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Cámara
              </h2>
  
              <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
                {camara.nombre}
              </p>
  
              <p className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
                Ver más →
              </p>
            </a>
          )}
  
          {/* CARD JUZGADOS */}
          <a
            href={`/fueros/${fueroId}/juzgados`}
            className="
              block p-6 rounded-2xl 
              bg-white/70 backdrop-blur-lg 
              border border-gray-200 
              shadow-md hover:shadow-xl 
              hover:-translate-y-1 
              transition-all group
            "
          >
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Juzgados
            </h2>
  
            <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
              {juzgados.length} juzgados encontrados
            </p>
  
            <p className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
              Ver listado →
            </p>
          </a>
  
        </div>
      </main>
    );
  }
  