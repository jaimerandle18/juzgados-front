import AnchorWithLoader from "@/components/AnchorWithLoader";

interface RankedDep {
  id: number;
  nombre: string;
  tipo_funcional: string;
  fuero: { nombre: string } | null;
  promedio: number;
  cantidad_votos: number;
}

export default async function RankingsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pjn/rankings`,
    { next: { revalidate: 120 } }
  );

  const { mejores, peores }: { mejores: RankedDep[]; peores: RankedDep[] } =
    await res.json();

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

                <div className="flex items-center gap-2 mt-1">
                  <StarRating value={d.promedio} />
                  <span className="text-xs text-gray-500">
                    ({d.cantidad_votos} {d.cantidad_votos === 1 ? "voto" : "votos"})
                  </span>
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

function StarRating({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-lg ${n <= filled ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm font-semibold text-gray-800 ml-1">
        {value.toFixed(1)}
      </span>
    </div>
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
