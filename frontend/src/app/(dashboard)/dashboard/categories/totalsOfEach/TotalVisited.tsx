"use client";

import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import React, { useEffect, useState } from "react";

export default function TotalVisited() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVisitors = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/visitors/all", {
          credentials: "include",
        });
        console.log(res);
        if (!res.ok) {
          setTotal(0);
          return;
        }

        const data = await res.json();
        setTotal(data?.total ?? 0);
      } catch {
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadVisitors();
  }, []);

  console.log(total);
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Visited</h2>

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
