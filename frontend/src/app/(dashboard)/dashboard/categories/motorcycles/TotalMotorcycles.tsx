"use client";

import React, { useEffect, useState } from "react";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";

export default function TotalMotorcycles() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalMotorcycles = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/motorcycles/total", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setTotal(data.totalMotorcycles ?? 0);
        }
      } catch {
        setTotal(0); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTotalMotorcycles();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Motorcycles</h4>

      <div className="h-[40px] flex items-center justify-center mt-1">
        {loading ? (
          <ManagerLoading />
        ) : (
          <p className="text-xl font-bold text-gray-800">
            {Number(total).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
