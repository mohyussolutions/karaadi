"use client";

import { getTotalRealEstateCount } from "@/actions/categories/realEstateActions";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

import React, { useEffect, useState } from "react";

export default function TotalProperties() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotal = async () => {
      const count = await getTotalRealEstateCount();
      setTotal(count);
      setLoading(false);
    };
    fetchTotal();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none">
      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
        Total Properties
      </h4>
      <div className="h-[40px] flex items-center justify-center mt-1">
        {loading ? (
          <Loading />
        ) : (
          <p className="text-2xl font-black text-slate-900">
            {total.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
