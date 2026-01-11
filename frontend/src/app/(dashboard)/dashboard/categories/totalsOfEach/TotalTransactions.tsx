"use client";

import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import React, { useEffect, useState } from "react";

export default function TotalTransactions() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/finance/transactions",
          { credentials: "include" }
        );

        if (!res.ok) {
          setTotal(0);
          return;
        }

        const data = await res.json();
        setTotal(data.totalTransactions ?? 0);
      } catch {
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">
        Total Transactions
      </h2>

      <div className="h-[48px] flex items-center justify-center mt-3">
        {loading && <ManagerLoading />}

        {!loading && (
          <p className="text-3xl font-bold text-green-600">
            ${Number(total).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
