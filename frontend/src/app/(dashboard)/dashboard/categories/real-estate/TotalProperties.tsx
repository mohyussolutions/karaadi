"use client";

import React, { useEffect, useState } from "react";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";

export default function TotalProperties() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalProperties = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/real-estate/total", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setTotal(data.totalRealEstates ?? 0);
        }
      } catch {
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalProperties();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Properties</h4>
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
