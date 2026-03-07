"use client";

import { getTotalTransactions } from "@/actions/categories/paymentAction";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import React, { useEffect, useState } from "react";

export default function TotalTransactions() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTotalTransactions();
      setTotal(data);
      setLoading(false);
    };

    fetchData();
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
