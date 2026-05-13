"use client";

import { useEffect, useState } from "react";
import { FAVORITE_ENDPOINTS } from "@/actions/constant/constant";

export function useItemSavedCount(itemId: string | undefined) {
  const [count, setCount] = useState<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!itemId) return;
    let cancelled = false;
    setReady(false);
    fetch(FAVORITE_ENDPOINTS.ITEM_SAVED_COUNT(itemId), { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          setCount(data ? Math.max(0, parseInt(data.count ?? 0, 10)) || 0 : 0);
          setReady(true);
        }
      })
      .catch(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, [itemId]);

  return { count, ready };
}
