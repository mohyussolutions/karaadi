"use client";

import React, { useEffect, useState } from "react";
import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import { getTotalCars } from "@/actions/categories/carActions";

export default function TotalCars() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTotal = async () => {
      try {
        const data = await getTotalCars();
        setTotal(data);
      } catch (err) {
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadTotal();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Cars</h4>

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
