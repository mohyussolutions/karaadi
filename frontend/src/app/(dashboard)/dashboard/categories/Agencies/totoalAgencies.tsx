"use client";

import React, { useEffect, useState } from "react";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import { getAgencyStats } from "@/actions/categories/actionsAgency";

export default function TotalAgencies() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalAgencies = async () => {
    try {
      const data = await getAgencyStats();

      if (data.success) {
        setTotal(data.total ?? 0);
      }
    } catch {
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalAgencies();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center text-center">
      <h2 className="text-lg font-semibold text-gray-700">Agencies</h2>

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
