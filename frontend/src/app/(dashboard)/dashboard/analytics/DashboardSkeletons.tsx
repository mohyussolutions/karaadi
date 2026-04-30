import { CardSkeleton } from "@/app/ui/loading";

export const CirclesSkeleton = () => (
  <div className="grid grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 md:gap-6 place-items-center py-3 sm:py-6">
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gray-100 animate-pulse"
      />
    ))}
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
    ))}
  </div>
);

export const ChartsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    <CardSkeleton className="min-h-[240px]" />
    <CardSkeleton className="min-h-[240px]" />
  </div>
);
