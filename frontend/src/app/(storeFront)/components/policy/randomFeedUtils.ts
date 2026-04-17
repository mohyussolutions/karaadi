import { useMemo } from "react";
import { normalizeQueryWords } from "./searchUtils";

export type PlanType = "premium90" | "standard60" | "basic30";

const PRIORITY_ORDER: Record<PlanType, number> = {
  premium90: 1,
  standard60: 2,
  basic30: 3,
};

export function useListingFeed<T extends object>(
  items: T[] = [],
  query: string = "",
  defaultCategory: string = "",
) {
  return useMemo(() => {
    if (!items || items.length === 0) return [];

    const words = query?.trim() ? normalizeQueryWords(query) : [];

    let processed = items.map((it: any) => {
      const stableId = it.id ?? it._id;

      return {
        ...it,
        category: Array.isArray(it.category)
          ? it.category[0]
          : it.category || defaultCategory,
        id: stableId,
        title: it.title || "",
      };
    });

    if (words.length > 0) {
      processed = processed.filter((item) => {
        const haystack = [item.title, item.city, item.description]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase())
          .join(" ");
        return words.every((w) => haystack.includes(w));
      });
    }

    return [...processed].sort((a: any, b: any) => {
      const priorityA =
        PRIORITY_ORDER[a.planType as PlanType] ?? PRIORITY_ORDER.basic30;
      const priorityB =
        PRIORITY_ORDER[b.planType as PlanType] ?? PRIORITY_ORDER.basic30;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [items, query, defaultCategory]);
}
