"use client";

import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import React, { useEffect, useState } from "react";

export default function TotalRevenue() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/revenue/total", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setTotal(0);
          return;
        }

        const data = await res.json();
        const revenue = Number(data?.totalRevenue);

        setTotal(isNaN(revenue) ? 0 : revenue);
      } catch {
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRevenue();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>

      <div className="h-[48px] flex items-center justify-center mt-3">
        {loading ? (
          <ManagerLoading />
        ) : (
          <p className="text-3xl font-bold text-green-600">
            ${total.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
