"use client";

import { useNavigate } from "@/components/useNavigate";

export default function FueroCardsClient({
  fueroId,
  nombreFuero,
  tipo,
  datos,
  camara,
  juzgados,
}: any) {
  const navigate = useNavigate();

  return (
    <main className="pt-10 pb-20 px-6 text-gray-900 max-w-3xl mx-auto">
      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {nombreFuero}
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-28 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      <div className="grid gap-6">
        {tipo === "jncc" && (
          <>
            {datos?.camara_casacion && (
              <Card
                title="Cámara Nacional de Casación"
                subtitle={datos.camara_casacion.nombre}
                onClick={() =>
                  navigate(`/dependencia/${datos.camara_casacion.id}`)
                }
              />
            )}

            {datos?.camara_apelaciones && (
              <Card
                title="Cámara Nacional de Apelaciones"
                subtitle={datos.camara_apelaciones.nombre}
                onClick={() =>
                  navigate(`/dependencia/${datos.camara_apelaciones.id}`)
                }
              />
            )}

            <Card
              title="Tribunales Orales de Menores"
              subtitle={`${datos.tribunales_orales?.length ?? 0} tribunales`}
              onClick={() =>
                navigate(`/fueros/${fueroId}/tribunales-menores`)
              }
            />

            <Card
              title="Tribunales Orales Criminales"
              subtitle={`${datos.tribunales_orales?.length ?? 0} tribunales`}
              onClick={() =>
                navigate(`/fueros/${fueroId}/tribunales-criminal`)
              }
            />

            <Card
              title="Juzgados Nacionales de Ejecución Penal"
              subtitle="5 juzgados"
              onClick={() => navigate(`/dependencia/2224`)}
            />
          </>
        )}

        {tipo === "normal" && (
          <>
            {camara && (
              <Card
                title="Cámara"
                subtitle={camara.nombre}
                onClick={() => navigate(`/dependencia/${camara.id}`)}
              />
            )}

            <Card
              title="Juzgados"
              subtitle={`${Array.isArray(juzgados) ? juzgados.length : 0} juzgados`}
              onClick={() => navigate(`/fueros/${fueroId}/juzgados`)}
            />
          </>
        )}
      </div>
    </main>
  );
}

function Card({ title, subtitle, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block text-left p-6 rounded-2xl bg-white shadow border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-700">{subtitle}</p>
      <p className="mt-4 text-sm font-medium text-blue-600 underline">
        Ver detalle →
      </p>
    </button>
  );
}
