import { SkeletonBox } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="pt-10 pb-20 px-6 max-w-lg mx-auto">
      <div className="text-center mb-12">
        <SkeletonBox w="w-40" h="h-9" className="mx-auto" />
        <div className="mx-auto mt-3 h-[3px] w-28 bg-gray-200 rounded-full" />
      </div>
      <SkeletonBox w="w-full" h="h-14" rounded="xl" className="mb-4" />
      <SkeletonBox w="w-full" h="h-14" rounded="xl" className="mb-4" />
      <SkeletonBox w="w-full" h="h-14" rounded="xl" className="mb-4" />
      <SkeletonBox w="w-full" h="h-14" rounded="xl" className="mb-4" />
    </main>
  );
}
