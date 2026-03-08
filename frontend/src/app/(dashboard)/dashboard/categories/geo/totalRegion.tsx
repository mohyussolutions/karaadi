"use client";

import React, { useEffect, useState } from "react";

import { getTotalOfRegions } from "@/actions/categories/geoAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function TotalRegions() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalRegions = async () => {
    try {
      const data = await getTotalOfRegions();

      setTotal(data);
    } catch {
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalRegions();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center text-center">
      <h2 className="text-lg font-semibold text-gray-700">Regions</h2>

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
