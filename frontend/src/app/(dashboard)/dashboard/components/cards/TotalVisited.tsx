"use client";
import { useEffect, useState } from "react";
import { fetchTotalVisitors } from "@/actions/categories/visitorActions";

export default function TotalVisited() {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    fetchTotalVisitors().then((count) => setTotal(count ?? 0));
  }, []);
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Visited</h2>
      <div className="h-[48px] flex items-center justify-center mt-3">
        <p className="text-3xl font-bold text-green-600">
          {total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
