"use client";

import React, { useEffect, useState } from "react";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import { getTotalBoatsAction } from "@/actions/categories/boatActions";

export default function TotalBoats() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTotalBoatsAction().then((count) => {
      setTotal(count);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Boats</h4>
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
