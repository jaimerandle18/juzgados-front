export const dynamic = "force-dynamic";

import AnchorWithLoader from "@/components/AnchorWithLoader";
import StarRating from "@/components/StarRating";

interface RankedDep {
  id: number;
  nombre: string;
  tipo_funcional: string;
  fuero: { nombre: string } | null;
  promedio: number;
  cantidad_votos: number;
}

// Promedio bayesiano (estilo IMDb) para que un solo voto de 5★ no
// le gane a 100 votos de 4.5★. Tira el promedio del juzgado hacia el
// promedio global cuando tiene pocos votos.
//   score = (v/(v+m)) * R + (m/(v+m)) * C
//     R = promedio del juzgado · v = cantidad de votos
//     C = promedio global (ponderado por votos)
//     m = "votos mínimos de confianza" (cuanto más alto, más penaliza pocos votos)
const MIN_VOTOS_CONFIANZA = 5;

function rankearBayesiano(items: RankedDep[], orden: "mejores" | "peores"): RankedDep[] {
  if (items.length === 0) return items;

  const totalVotos = items.reduce((acc, d) => acc + d.cantidad_votos, 0);
  const sumaPonderada = items.reduce(
    (acc, d) => acc + d.promedio * d.cantidad_votos,
    0
  );
  const C = totalVotos > 0 ? sumaPonderada / totalVotos : 0;

  const scoreDe = (d: RankedDep) => {
    const v = d.cantidad_votos;
    const R = d.promedio;
    return (v / (v + MIN_VOTOS_CONFIANZA)) * R +
           (MIN_VOTOS_CONFIANZA / (v + MIN_VOTOS_CONFIANZA)) * C;
  };

  // No filtramos por cantidad mínima: la fórmula bayesiana ya empuja
  // los items con pocos votos hacia el promedio global, así que un
  // juzgado con 1 voto malo no se hunde al fondo del ranking igual.
  return [...items].sort((a, b) =>
    orden === "mejores" ? scoreDe(b) - scoreDe(a) : scoreDe(a) - scoreDe(b)
  );
}

export default async function RankingsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pjn/rankings`,
    { next: { revalidate: 120 } }
  );

  const raw: { mejores: RankedDep[]; peores: RankedDep[] } = await res.json();
  const mejores = rankearBayesiano(raw.mejores, "mejores");
  const peores = rankearBayesiano(raw.peores, "peores");

  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto text-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Rankings</h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
      </div>

      <Section
        titulo="Mejores Evaluados"
        items={mejores}
        emptyText="No hay dependencias con votos aún."
        medalColors={["text-yellow-500", "text-gray-400", "text-amber-600"]}
      />

      <div className="my-10" />

      <Section
        titulo="Peores Evaluados"
        items={peores}
        emptyText="No hay dependencias con votos aún."
      />
    </main>
  );
}

function Section({
  titulo,
  items,
  emptyText,
  medalColors,
}: {
  titulo: string;
  items: RankedDep[];
  emptyText: string;
  medalColors?: string[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-5">{titulo}</h2>

      {items.length === 0 && (
        <p className="text-gray-500">{emptyText}</p>
      )}

      <div className="space-y-4">
        {items.map((d, i) => (
          <AnchorWithLoader
            key={d.id}
            href={`/dependencia/${d.id}`}
            className="
              block p-5 rounded-2xl bg-white/70 backdrop-blur-lg
              border border-gray-200 shadow-md hover:shadow-xl
              hover:-translate-y-1 transition-all group
            "
          >
            <div className="flex items-start gap-4">
              <span className={`text-2xl font-bold ${medalColors?.[i] ?? "text-gray-400"}`}>
                #{i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
                  {d.nombre}
                </h3>

                <div className="mt-1">
                  <StarRating
                    value={d.promedio}
                    cantidad={d.cantidad_votos}
                    size="sm"
                    tintedByValue
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {tipoLabel(d.tipo_funcional)}
                  {d.fuero?.nombre ? ` · ${d.fuero.nombre}` : ""}
                </p>
              </div>
            </div>
          </AnchorWithLoader>
        ))}
      </div>
    </section>
  );
}

function tipoLabel(tipo: string) {
  const map: Record<string, string> = {
    juzgado: "Juzgado",
    camara: "Cámara",
    sala: "Sala",
    tribunal_oral: "Tribunal Oral",
  };
  return map[tipo] || tipo;
}
