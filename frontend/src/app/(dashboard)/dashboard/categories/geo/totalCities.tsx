"use client";

import React, { useEffect, useState } from "react";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import { getTotalOfCities } from "@/actions/categories/geoAction";

export default function TotalCities() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalCities = async () => {
    try {
      const data = await getTotalOfCities();

      setTotal(data);
    } catch {
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalCities();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center text-center">
      <h2 className="text-lg font-semibold text-gray-700">Cities</h2>

      <div className="h-[48px] flex items-center justify-center mt-3">
        {loading ? (
          <ManagerLoading />
        ) : (
          <p className="text-3xl font-bold text-green-600">
            {total.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
