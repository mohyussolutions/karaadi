"use client";

import { fetchTotalVisitors } from "@/actions/categories/visitorActions";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

import React, { useEffect, useState } from "react";

export default function TotalVisited() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVisitors = async () => {
      try {
        const count = await fetchTotalVisitors();
        setTotal(count);
      } catch (error) {
        console.error("Error loading visitors:", error);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadVisitors();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Visited</h2>

      <div className="h-[48px] flex items-center justify-center mt-3">
        {loading ? (
          <Loading />
        ) : (
          <p className="text-3xl font-bold text-green-600">
            {total.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
