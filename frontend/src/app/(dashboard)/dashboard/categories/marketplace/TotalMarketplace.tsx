"use client";

import React, { useEffect, useState } from "react";
import { getTotalMarketplaceItemsCount } from "@/actions/categories/marketplaceActions";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function TotalMarketplace() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchTotalMarketplace = async () => {
    try {
      const data = await getTotalMarketplaceItemsCount();
      setTotal(data ?? 0);
    } catch {
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalMarketplace();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Marketplace</h4>

      <div className="h-[40px] flex items-center justify-center mt-1">
        {loading ? (
          <Loading />
        ) : (
          <p className="text-xl font-bold text-gray-800">
            {Number(total).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
