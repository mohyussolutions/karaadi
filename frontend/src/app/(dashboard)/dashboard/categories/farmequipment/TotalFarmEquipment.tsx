"use client";

import React, { useEffect, useState } from "react";

import { getFarmEquipmentTotal } from "@/actions/categories/FarmequipmentAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function TotalFarmEquipment() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const count = await getFarmEquipmentTotal();
        console.log(count);
        setTotal(count);
      } catch (error) {
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchTotal();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none">
      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
        Farm Equipment
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
