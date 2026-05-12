"use client";
import dynamic from "next/dynamic";

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 max-w-7xl mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="min-h-[84px]" />
      ))}
    </div>
  );
}

export default dynamic(() => import("./MainCategoryLinks"), {
  ssr: false,
  loading: CategorySkeleton,
});
