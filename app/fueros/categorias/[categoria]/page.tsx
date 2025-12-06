interface PageProps {
  params: Promise<{ categoria: string }>;
}

export default async function Page({ params }: PageProps) {
  const { categoria } = await params;

  const mapCategoriaToTipo: Record<string, string> = {
    nacionales: "nacional",
    federales: "federal",
    "competencia-pais": "competencia_pais",
  };

  const tipo = mapCategoriaToTipo[categoria];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros?tipo=${tipo}`, {
    cache: "no-store",
  });

  const fueros = await res.json();

  return (
    <main className="pt-10 pb-20 px-6 text-gray-900 max-w-4xl mx-auto">

      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
          FUEROS {categoria.toUpperCase().replace("-", " ")}
        </h2>

        {/* Subrayado animado */}
        <div className="mx-auto mt-3 h-[3px] w-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 gap-6">
        
        {fueros.map((f: any) => (
          <a
            key={f.id}
            href={`/fueros/${f.id}`}
            className="
              block p-6 rounded-2xl 
              bg-white/70 backdrop-blur-lg 
              border border-gray-200 
              shadow-md hover:shadow-xl 
              transition-all 
              hover:-translate-y-1 
              group
            "
          >
            {/* Nombre del fuero */}
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {f.nombre}
            </h3>

            {/* Línea decorativa */}
            <div className="mt-2 w-12 h-[3px] bg-blue-400 rounded-full group-hover:w-20 transition-all" />

     
          </a>
        ))}

      </div>
    </main>
  );
}
