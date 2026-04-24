import { SkeletonBox } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <SkeletonBox w="w-64" h="h-9" className="mx-auto" />
        <div className="mx-auto mt-3 h-[3px] w-28 bg-gray-200 rounded-full" />
      </div>
      <SkeletonBox w="w-full" h="h-24" rounded="2xl" className="mb-4" />
      <SkeletonBox w="w-full" h="h-16" rounded="2xl" className="mb-4" />
      <SkeletonBox w="w-full" h="h-16" rounded="2xl" className="mb-4" />
      <SkeletonBox w="w-3/4" h="h-10" rounded="2xl" className="mx-auto mt-8" />
    </main>
  );
}
