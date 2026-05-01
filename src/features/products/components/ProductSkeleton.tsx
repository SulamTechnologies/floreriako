import { cn } from "@/shared/lib/cn";

function Bone({ className }: { className?: string }) {
  return <div className={cn("bg-gray-100 rounded-lg animate-pulse", className)} />;
}

export function ProductSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
      <Bone className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Bone className="h-4 w-3/4" />
        <Bone className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <Bone className="h-6 w-24" />
        </div>
        <Bone className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
