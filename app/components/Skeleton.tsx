/**
 * Placeholders con shimmer para loading states.
 * Usar en reemplazo de spinners cuando querés que el usuario vea
 * la estructura de lo que va a cargar.
 */

type Props = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  w?: string; // ej: "w-24", "w-full"
  h?: string; // ej: "h-4", "h-10"
};

export function SkeletonBox({ className = "", rounded = "md", w, h }: Props) {
  const r =
    rounded === "full"
      ? "rounded-full"
      : rounded === "2xl"
      ? "rounded-2xl"
      : rounded === "xl"
      ? "rounded-xl"
      : rounded === "lg"
      ? "rounded-lg"
      : rounded === "sm"
      ? "rounded-sm"
      : "rounded-md";

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${r} ${w ?? ""} ${h ?? ""} ${className}
      `}
    />
  );
}

/** Card tipo juzgado/fuero: título + estrellas + 2 líneas. */
export function SkeletonDependenciaCard() {
  return (
    <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md">
      <SkeletonBox w="w-3/4" h="h-5" className="mb-3" />
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} w="w-4" h="h-4" rounded="sm" />
        ))}
        <SkeletonBox w="w-8" h="h-3" className="ml-2" />
      </div>
      <SkeletonBox w="w-1/2" h="h-3" className="mt-3" />
      <SkeletonBox w="w-1/3" h="h-3" className="mt-2" />
    </div>
  );
}

/** Item de ranking: numero grande + titulo + estrellas. */
export function SkeletonRankingItem() {
  return (
    <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md flex items-start gap-4">
      <SkeletonBox w="w-8" h="h-8" rounded="sm" />
      <div className="flex-1">
        <SkeletonBox w="w-4/5" h="h-5" className="mb-2" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBox key={i} w="w-4" h="h-4" rounded="sm" />
          ))}
          <SkeletonBox w="w-10" h="h-3" className="ml-2" />
        </div>
        <SkeletonBox w="w-1/3" h="h-3" className="mt-2" />
      </div>
    </div>
  );
}

/** Row de mis-evaluaciones: header + comentario + botones. */
export function SkeletonMiEvaluacion() {
  return (
    <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md">
      <SkeletonBox w="w-2/3" h="h-5" className="mb-3" />
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} w="w-4" h="h-4" rounded="sm" />
        ))}
      </div>
      <SkeletonBox w="w-full" h="h-3" className="mb-2" />
      <SkeletonBox w="w-5/6" h="h-3" className="mb-4" />
      <div className="flex gap-2">
        <SkeletonBox w="w-24" h="h-9" rounded="xl" />
        <SkeletonBox w="w-28" h="h-9" rounded="xl" />
      </div>
    </div>
  );
}

/** Lista genérica de N skeletons del mismo tipo. */
export function SkeletonList({
  count = 6,
  item: Item,
}: {
  count?: number;
  item: () => React.ReactElement;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Item />
        </div>
      ))}
    </div>
  );
}
