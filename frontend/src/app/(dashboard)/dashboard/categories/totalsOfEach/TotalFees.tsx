"use client";

import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import React, { useEffect, useState } from "react";

export default function TotalFees() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/finance/fees", {
          credentials: "include",
        });

        if (!res.ok) {
          setTotal(0);
          return;
        }

        const data = await res.json();
        setTotal(data.totalFees ?? 0);
      } catch {
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Fees</h2>

      <div className="h-[48px] flex items-center justify-center mt-3">
        {loading && <Loading />}

        {!loading && (
          <p className="text-3xl font-bold text-green-600">
            ${Number(total).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
