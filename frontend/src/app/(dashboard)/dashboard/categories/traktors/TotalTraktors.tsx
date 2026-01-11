"use client";

import React, { useEffect, useState } from "react";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";

export default function TotalTractors() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalTractors = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/traktor/total", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch total tractors");

        const data = await res.json();
        setTotal(data.totalTractors ?? 0);
      } catch (err) {
        console.error(err);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalTractors();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Tractors</h4>
      <div className="h-[40px] flex items-center justify-center mt-1">
        {loading ? (
          <ManagerLoading />
        ) : (
          <p className="text-xl font-bold text-gray-800">
            {total.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
