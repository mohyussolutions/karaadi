"use client";

import { useEffect, useState } from "react";
import { FAVORITE_ENDPOINTS } from "@/actions/constant/constant";

export function useItemSavedCount(itemId: string | undefined) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemId) return;
    let cancelled = false;
    setLoading(true);
    fetch(FAVORITE_ENDPOINTS.ITEM_SAVED_COUNT(itemId), { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setCount(data.count ?? 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [itemId]);

  return { count, loading };
}
