"use client";

import React, { useEffect, useState } from "react";
import { getTotalMotorcyclesAction } from "@/actions/categories/motorcycleActions";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function TotalMotorcycles() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTotalMotorcyclesAction().then((count) => {
      setTotal(count);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
        Motorcycles
      </h4>
      <div className="h-[40px] flex items-center justify-center mt-1">
        {loading ? (
          <Loading />
        ) : (
          <p className="text-2xl font-black text-slate-800">
            {total.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
