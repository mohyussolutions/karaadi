"use client";
import dynamic from "next/dynamic";

export default dynamic(() => import("./MainCategoryLinks"), {
  ssr: false,
  loading: () => <div className="min-h-[192px]" />,
});
