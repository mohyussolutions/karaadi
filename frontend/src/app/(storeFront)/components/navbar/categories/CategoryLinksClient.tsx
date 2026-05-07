"use client";
import dynamic from "next/dynamic";

const SKELETON_COUNT = 6;

export default dynamic(() => import("./MainCategoryLinks"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 max-w-7xl mx-auto">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-50 min-h-[84px] animate-pulse" />
      ))}
    </div>
  ),
});
