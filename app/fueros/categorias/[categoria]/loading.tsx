import { SkeletonList, SkeletonDependenciaCard } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-9 w-56 bg-gray-200 animate-pulse rounded-md mx-auto" />
        <div className="mx-auto mt-3 h-[3px] w-28 bg-gray-200 rounded-full" />
      </div>
      <SkeletonList count={6} item={SkeletonDependenciaCard} />
    </main>
  );
}
