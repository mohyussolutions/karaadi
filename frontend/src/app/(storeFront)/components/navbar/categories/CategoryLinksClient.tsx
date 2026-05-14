"use client";
import dynamic from "next/dynamic";

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 max-w-7xl mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white py-3 px-2 min-h-[84px] w-full">
          <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="w-16 h-3 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default dynamic(() => import("./MainCategoryLinks"), {
  ssr: false,
  loading: CategorySkeleton,
});
