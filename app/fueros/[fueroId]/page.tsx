export default async function Page({ params }: { params: Promise<{ fueroId: string }> }) {
  const { fueroId } = await params;

  // 1) Traigo el fuero (nombre, tipo, etc.)
  const fueroRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}`,
    { cache: "no-store" }
  );
  const fuero = await fueroRes.json();

  const nombreFuero = fuero?.nombre ?? "";

  const esJNCC =
    nombreFuero.toLowerCase().includes("criminal") &&
    nombreFuero.toLowerCase().includes("correccional");

  // ==========================
  // CASO ESPECIAL JNCC
  // ==========================
  if (esJNCC) {
    const depsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/dependencias`,
      { cache: "no-store" }
    );

    if (!depsRes.ok) {
      throw new Error("No se pudo obtener dependencias especiales del fuero.");
    }

    const datos = await depsRes.json();

    const tribunalesMenores =
      datos.tribunales_orales?.filter((t: any) =>
        t.nombre.toLowerCase().includes("menores")
      ) ?? [];

    const tribunalesCriminal =
      datos.tribunales_orales?.filter((t: any) =>
        t.nombre.toLowerCase().includes("criminal")
      ) ?? [];

    return (
      <main className="pt-10 pb-20 px-6 text-gray-900 max-w-3xl mx-auto">
        {/* TÍTULO DEL FUERO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {nombreFuero}
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-28 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
        </div>

        <div className="grid gap-6">
          {/* A) Cámara Nacional de Casación */}
          {datos.camara_casacion && (
            <a
              href={`/dependencia/${datos.camara_casacion.id}`}
              className="block p-6 rounded-2xl bg-white shadow border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                Cámara Nacional de Casación en lo Criminal y Correccional
              </h2>
              <p className="mt-2 text-gray-700">
                {datos.camara_casacion.nombre}
              </p>
              <p className="mt-4 text-sm font-medium text-blue-600 underline">
                Ver detalle →
              </p>
            </a>
          )}

          {/* B) Cámara Nacional de Apelaciones */}
          {datos.camara_apelaciones && (
            <a
              href={`/dependencia/${datos.camara_apelaciones.id}`}
              className="block p-6 rounded-2xl bg-white shadow border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                Cámara Nacional de Apelaciones en lo Criminal y Correccional
              </h2>
              <p className="mt-2 text-gray-700">
                {datos.camara_apelaciones.nombre}
              </p>
              <p className="mt-4 text-sm font-medium text-blue-600 underline">
                Ver detalle →
              </p>
            </a>
          )}

          {/* C) Tribunales Orales de Menores */}
          <a
            href={`/fueros/${fueroId}/tribunales-menores`}
            className="block p-6 rounded-2xl bg-white shadow border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Tribunales Orales de Menores
            </h2>
            <p className="mt-2 text-gray-700">
              {tribunalesMenores.length} tribunales
            </p>
            <p className="mt-4 text-sm font-medium text-blue-600 underline">
              Ver listado →
            </p>
          </a>

          {/* D) Tribunales Orales en lo Criminal y Correccional */}
          <a
            href={`/fueros/${fueroId}/tribunales-criminal`}
            className="block p-6 rounded-2xl bg-white shadow border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Tribunales Orales en lo Criminal y Correccional
            </h2>
            <p className="mt-2 text-gray-700">
              {tribunalesCriminal.length} Tribunales
            </p>
            <p className="mt-4 text-sm font-medium text-blue-600 underline">
              Ver listado →
            </p>
          </a>
          {/* E) Juzgados Nacionales de Ejecución Penal */}
<a
  href={`/dependencia/2224`}
  className="block p-6 rounded-2xl bg-white shadow border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all"
>
  <h2 className="text-2xl font-semibold text-gray-900">
    Juzgados Nacionales de Ejecución Penal
  </h2>

  <p className="mt-2 text-gray-700">
    5 juzgados
  </p>

  <p className="mt-4 text-sm font-medium text-blue-600 underline">
    Ver juzgados →
  </p>
</a>

        </div>
      </main>
    );
  }

  // ==========================
  // RESTO DE LOS FUEROS (COMO ANTES)
  // ==========================
  const camaraRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/camara`,
    { cache: "no-store" }
  );
  const camara = await camaraRes.json();

  const juzgadosRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/juzgados`,
    { cache: "no-store" }
  );
  const juzgados = await juzgadosRes.json();

  return (
    <main className="pt-10 pb-20 px-6 text-gray-900 max-w-3xl mx-auto">
      {/* TÍTULO DEL FUERO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {nombreFuero || "Fuero"}
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-28 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* GRID */}
      <div className="grid gap-6">
        {/* CARD CÁMARA */}
        {camara && (
          <a
            href={`/dependencia/${camara.id}`}
            className="block p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
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
          className="block p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            Juzgados
          </h2>

          <p className="mt-2 text-gray-700 group-hover:text-gray-900 transition">
            {Array.isArray(juzgados) ? juzgados.length : 0} juzgados encontrados
          </p>

          <p className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
            Ver listado →
          </p>
        </a>
      </div>
    </main>
  );
}
